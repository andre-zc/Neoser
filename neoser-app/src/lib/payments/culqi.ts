/**
 * Culqi payments — integración server-side con Custom Checkout.
 *
 * Flujo:
 *  1. Frontend: Custom Checkout (js.culqi.com/checkout-js) tokeniza la
 *     tarjeta -> source_id (formato "tkn_xxx"). Los datos de tarjeta NUNCA
 *     pasan por nuestro servidor (PCI DSS via Culqi).
 *  2. Backend: POST /api/payments/culqi/charge recibe el token y delega
 *     en `createCulqiCharge` -> POST a https://api.culqi.com/v2/charges
 *     con Bearer sk_*.
 *  3. Webhook: Culqi confirma el cargo async. /api/payments/culqi/webhook
 *     valida firma con `verifyCulqiWebhookSignature` y persiste/dispara
 *     sync a HubSpot/Brevo/email.
 *
 * Docs: https://docs.culqi.com/
 */

import crypto from "crypto";

// ============================================
// Tipos públicos
// ============================================

export type CulqiChargeInput = {
  /** source_id devuelto por Custom Checkout (tkn_test_* / tkn_live_*) */
  token: string;
  /** Monto en céntimos. Ej: S/. 350.00 -> 35000 */
  amountCents: number;
  currency: "PEN";
  /** Email del comprador. Culqi lo usa como identificador del cargo. */
  customerEmail: string;
  /** Nombre completo del comprador (lo splitamos a first_name/last_name antes
   *  de mandarlo a Culqi; sin esto, el panel muestra "first_last_name first_last_name"). */
  customerFullName: string;
  /** Descripción visible en CulqiPanel (ej: "Inscripción: Curso X"). */
  description: string;
  /** Metadata custom (key/value strings). Útil para reconstruir el contexto
   *  en el webhook sin lookup adicional: courseId, guestName, orderRef, etc. */
  metadata?: Record<string, string>;
};

/**
 * Divide un nombre completo en first_name + last_name para el panel de Culqi.
 * Si solo hay una palabra, last_name queda como "—" (Culqi requiere ambos).
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] || "Cliente", lastName: "—" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) ?? "—",
  };
}

export type CulqiChargeResult = {
  ok: boolean;
  /** ID del cargo en Culqi (chr_*). Presente incluso si fue rechazado. */
  chargeId?: string;
  status: "approved" | "rejected" | "pending";
  /** Tipo de outcome de Culqi: "venta_exitosa", "tarjeta_rechazada", etc. */
  outcomeType?: string;
  /** Mensaje listo para mostrar al usuario final. */
  userMessage?: string;
  /** Método usado: "card" | "yape" | "tarjeta" | "bank_account" ... */
  paymentMethod?: string;
  /** Respuesta cruda de Culqi (para guardar en payments.raw_payload). */
  raw: unknown;
};

/** Payload del webhook (estructura mínima que usamos). */
export type CulqiWebhookEvent = {
  id: string;
  type: string;
  data: {
    id: string;
    object?: string;
    amount?: number;
    currency_code?: string;
    email?: string;
    outcome?: { type?: string; user_message?: string };
    source?: { type?: string };
    metadata?: Record<string, string>;
  };
};

// ============================================
// Env helpers
// ============================================

function getCulqiSecret(): string {
  const key = process.env.CULQI_SECRET_KEY;
  if (!key) throw new Error("CULQI_SECRET_KEY no configurada");
  return key;
}

function getCulqiWebhookSecret(): string | undefined {
  return process.env.CULQI_WEBHOOK_SECRET || undefined;
}

// ============================================
// API: crear cargo (server-side)
// ============================================

const CULQI_API_BASE = "https://api.culqi.com/v2";

export async function createCulqiCharge(
  input: CulqiChargeInput,
): Promise<CulqiChargeResult> {
  const secret = getCulqiSecret();

  const { firstName, lastName } = splitName(input.customerFullName);

  // antifraud_details: Culqi recomienda enviar nombre del comprador aquí
  // (también lo muestra en el panel y en la respuesta del cargo).
  const body = {
    amount: input.amountCents,
    currency_code: input.currency,
    email: input.customerEmail,
    source_id: input.token,
    description: input.description,
    antifraud_details: {
      first_name: firstName,
      last_name: lastName,
    },
    ...(input.metadata ? { metadata: input.metadata } : {}),
  };

  let response: Response;
  try {
    response = await fetch(`${CULQI_API_BASE}/charges`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    return {
      ok: false,
      status: "rejected",
      outcomeType: "network_error",
      userMessage:
        "No se pudo contactar al proveedor de pago. Reintenta en unos segundos.",
      raw: { error: String(networkError) },
    };
  }

  const json = (await response.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  // Culqi devuelve 4xx para errores de API (token invalido, key invalida)
  // y 200 con outcome para resultados de tarjeta (rechazada / exitosa).
  if (!response.ok) {
    const message =
      (json?.user_message as string) ||
      (json?.merchant_message as string) ||
      `Error de Culqi (${response.status})`;
    return {
      ok: false,
      status: "rejected",
      outcomeType: (json?.type as string) || "api_error",
      userMessage: message,
      raw: json,
    };
  }

  const outcome = json?.outcome as
    | { type?: string; user_message?: string }
    | undefined;
  const outcomeType = outcome?.type || "";
  const isSuccess = outcomeType === "venta_exitosa" || json?.paid === true;

  const source = json?.source as { type?: string } | undefined;

  return {
    ok: Boolean(isSuccess),
    chargeId: json?.id as string | undefined,
    status: isSuccess ? "approved" : "rejected",
    outcomeType,
    userMessage: outcome?.user_message,
    paymentMethod: source?.type,
    raw: json,
  };
}

// ============================================
// Webhook signature verification
// ============================================

/**
 * Verifica la firma HMAC-SHA256 del webhook de Culqi.
 *
 * Configuración:
 *  - Setear CULQI_WEBHOOK_SECRET con el secret del panel Culqi > Webhooks.
 *  - Sin secret configurado, devuelve true (modo desarrollo) y loguea warning.
 *
 * Nota: el nombre exacto del header depende de la versión del panel Culqi.
 * Los más comunes son `x-culqi-signature` o `culqi-signature`. La ruta del
 * webhook prueba ambos antes de invocar esta función.
 */
export function verifyCulqiWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = getCulqiWebhookSecret();

  if (!secret) {
    console.warn(
      "[culqi] CULQI_WEBHOOK_SECRET no configurado — el webhook acepta todos los eventos",
    );
    return true;
  }

  if (!signatureHeader) return false;

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const normalized = signatureHeader.replace(/^sha256=/, "").trim();

  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(normalized),
    );
  } catch {
    return false;
  }
}

// ============================================
// Status mapper Culqi -> nuestro enum
// ============================================

/**
 * Mapea el `type` de evento de Culqi al enum `payments.status` de Supabase.
 *
 * Eventos comunes:
 *  - charge.creation.succeeded -> approved
 *  - charge.creation.failed    -> rejected
 *  - refund.creation.succeeded -> refunded
 */
export function mapCulqiEventToPaymentStatus(
  eventType: string,
): "pending" | "approved" | "rejected" | "refunded" {
  if (eventType.startsWith("charge.creation.succeeded")) return "approved";
  if (eventType.startsWith("charge.creation.failed")) return "rejected";
  if (eventType.startsWith("refund.creation.succeeded")) return "refunded";
  return "pending";
}
