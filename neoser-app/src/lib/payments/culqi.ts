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
 *     valida su autenticación y persiste/dispara sync a HubSpot/Brevo/email.
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
  /** Monto en céntimos de la moneda elegida. Ej: S/. 350.00 -> 35000 */
  amountCents: number;
  /**
   * PEN = tarjeta + Yape (Perú). USD = tarjeta internacional.
   * OJO: cobrar en USD requiere que el comercio tenga multimoneda habilitada
   * en su cuenta Culqi; si no, Culqi rechaza el cargo.
   */
  currency: "PEN" | "USD";
  /** Email del comprador. Culqi lo usa como identificador del cargo. */
  customerEmail: string;
  /** Nombre completo del comprador (lo splitamos a first_name/last_name antes
   *  de mandarlo a Culqi; sin esto, el panel muestra "first_last_name first_last_name"). */
  customerFullName: string;
  /** Teléfono usado por el motor antifraude de Culqi. */
  customerPhone: string;
  /** Huella generada por Culqi3DS en el navegador. */
  deviceFingerprintId: string;
  /** Resultado del reto 3DS para el segundo intento del mismo cargo. */
  authentication3DS?: {
    eci: string;
    xid: string;
    cavv: string;
    protocolVersion: string;
    directoryServerTransactionId?: string;
  };
  /** Descripción visible en CulqiPanel (ej: "Inscripción: Curso X"). */
  description: string;
  /** Metadata mínima para reconstruir el contexto en el webhook. */
  metadata?: Record<string, string>;
};

/**
 * Divide un nombre completo en first_name + last_name para el panel de Culqi.
 * Si solo hay una palabra, last_name queda como "—" (Culqi requiere ambos).
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0] || "Cliente", lastName: "—" };
  }
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) ?? "—",
  };
}

export type CulqiChargeResult = {
  ok: boolean;
  /** El motor antifraude pidió autenticar al titular antes de reintentar. */
  requires3DS?: boolean;
  /** ID del cargo en Culqi (chr_*). Presente incluso si fue rechazado. */
  chargeId?: string;
  status: "approved" | "rejected" | "pending";
  /** Tipo de outcome de Culqi: "venta_exitosa", "tarjeta_rechazada", etc. */
  outcomeType?: string;
  /** Mensaje listo para mostrar al usuario final. */
  userMessage?: string;
  /** Método usado: "card" | "yape" | "tarjeta" | "bank_account" ... */
  paymentMethod?: string;
  /** Respuesta de Culqi ya reducida a campos operativos no sensibles. */
  raw: unknown;
};

/** Payload del webhook (estructura mínima que usamos). */
export type CulqiWebhookEvent = {
  id: string;
  type: string;
  data: {
    id: string;
    charge_id?: string;
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

  const secretEnvironment = key.match(/^sk_(test|live)_/)?.[1];
  const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
  const publicEnvironment = publicKey?.match(/^pk_(test|live)_/)?.[1];
  if (!secretEnvironment) {
    throw new Error("CULQI_SECRET_KEY tiene un formato inválido");
  }
  if (publicKey && publicEnvironment !== secretEnvironment) {
    throw new Error("Las llaves pública y privada de Culqi no coinciden");
  }
  return key;
}

function getCulqiWebhookSecret(): string | undefined {
  return process.env.CULQI_WEBHOOK_SECRET || undefined;
}

function getCulqiWebhookBasicCredentials():
  | { username: string; password: string }
  | undefined {
  const username = process.env.CULQI_WEBHOOK_USERNAME;
  const password = process.env.CULQI_WEBHOOK_PASSWORD;
  if (!username && !password) return undefined;
  if (!username || !password) return { username: "", password: "" };
  return { username, password };
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

/**
 * Conserva solo campos operativos de Culqi. Elimina email, nombres, teléfono,
 * metadata y cualquier dato de tarjeta antes de persistir la respuesta.
 */
export function sanitizeCulqiPayload(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};

  const source = payload as Record<string, unknown>;
  const outcome =
    source.outcome && typeof source.outcome === "object"
      ? (source.outcome as Record<string, unknown>)
      : undefined;
  const paymentSource =
    source.source && typeof source.source === "object"
      ? (source.source as Record<string, unknown>)
      : undefined;

  return {
    ...(typeof source.id === "string" ? { id: source.id } : {}),
    ...(typeof source.object === "string" ? { object: source.object } : {}),
    ...(typeof source.charge_id === "string"
      ? { charge_id: source.charge_id }
      : {}),
    ...(typeof source.type === "string" ? { type: source.type } : {}),
    ...(typeof source.amount === "number" ? { amount: source.amount } : {}),
    ...(typeof source.currency_code === "string"
      ? { currency_code: source.currency_code }
      : {}),
    ...(typeof source.paid === "boolean" ? { paid: source.paid } : {}),
    ...(typeof source.action_code === "string"
      ? { action_code: source.action_code }
      : {}),
    ...(outcome && typeof outcome.type === "string"
      ? { outcome: { type: outcome.type } }
      : {}),
    ...(paymentSource && typeof paymentSource.type === "string"
      ? { source: { type: paymentSource.type } }
      : {}),
  };
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
      email: input.customerEmail,
      phone_number: input.customerPhone,
      device_finger_print_id: input.deviceFingerprintId,
    },
    installments: 0,
    ...(input.authentication3DS
      ? { authentication_3DS: input.authentication3DS }
      : {}),
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
  } catch {
    return {
      ok: false,
      status: "rejected",
      outcomeType: "network_error",
      userMessage:
        "No se pudo contactar al proveedor de pago. Reintenta en unos segundos.",
      raw: { type: "network_error" },
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
      raw: sanitizeCulqiPayload(json),
    };
  }

  const outcome = json?.outcome as
    | { type?: string; user_message?: string }
    | undefined;
  const outcomeType = outcome?.type || "";
  const requires3DS =
    response.status === 200 && json?.action_code === "REVIEW";
  const isSuccess =
    outcomeType === "venta_exitosa" ||
    json?.paid === true ||
    (response.status === 201 && json?.object === "charge");

  const source = json?.source as { type?: string } | undefined;

  return {
    ok: Boolean(isSuccess),
    requires3DS,
    chargeId: json?.id as string | undefined,
    status: isSuccess ? "approved" : "rejected",
    outcomeType,
    userMessage: outcome?.user_message,
    paymentMethod: source?.type,
    raw: sanitizeCulqiPayload(json),
  };
}

// ============================================
// Autenticación del webhook
// ============================================

/**
 * Verifica la autenticación del webhook de Culqi.
 *
 * Configuración:
 * Prioridad:
 *  1. HTTP Basic cuando CULQI_WEBHOOK_USERNAME/PASSWORD están configuradas.
 *  2. HMAC-SHA256 legado cuando solo existe CULQI_WEBHOOK_SECRET.
 *
 * Si no hay un método completo configurado, nunca acepta el evento.
 */
export function verifyCulqiWebhookAuthentication(
  rawBody: string,
  headers: { authorization: string | null; signature: string | null },
): "verified" | "invalid" | "not_configured" {
  const basicCredentials = getCulqiWebhookBasicCredentials();
  if (basicCredentials) {
    if (!basicCredentials.username || !basicCredentials.password) {
      return "not_configured";
    }
    const expected = `Basic ${Buffer.from(
      `${basicCredentials.username}:${basicCredentials.password}`,
    ).toString("base64")}`;
    return headers.authorization && safeEqual(headers.authorization, expected)
      ? "verified"
      : "invalid";
  }

  const secret = getCulqiWebhookSecret();
  if (!secret) return "not_configured";
  if (!headers.signature) return "invalid";

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const normalized = headers.signature.replace(/^sha256=/, "").trim();
  return safeEqual(digest, normalized) ? "verified" : "invalid";
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
