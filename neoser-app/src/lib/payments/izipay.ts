import crypto from "crypto";

// ============================================
// Tipos públicos
// ============================================

export type EnrollmentMetadata = {
  courseId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
  utmSource?: string;
};

export type IzipayCreatePaymentInput = {
  orderReference: string;
  amount: number;
  currency: "PEN";
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  description: string;
  successUrl: string;
  failureUrl: string;
  metadata: EnrollmentMetadata;
};

export type IzipayCreatePaymentResult = {
  checkoutUrl: string;
  orderReference: string;
  provider: "izipay" | "mock";
};

export type IzipayWebhookEvent = {
  transactionId: string;
  status: "AUTHORIZED" | "REFUSED" | "CANCELLED" | "PENDING" | "REFUNDED";
  orderReference: string;
  amount: number;
  currency: string;
  metadata: EnrollmentMetadata;
  raw: Record<string, unknown>;
};

// ============================================
// Helpers internos
// ============================================

function getIzipaySecret() {
  return process.env.IZIPAY_SECRET_KEY;
}

export function isMockMode() {
  return (
    process.env.IZIPAY_MOCK_MODE === "true" ||
    !process.env.IZIPAY_MERCHANT_ID
  );
}

// ============================================
// Verificación de webhook (HMAC SHA256)
// ============================================

export function verifyIzipayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (isMockMode()) return true;

  const secret = getIzipaySecret();
  if (!secret) return false;
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
// API — stubs (se completa en Fase 3 con API real)
// ============================================

export async function createIzipayPayment(
  input: IzipayCreatePaymentInput,
): Promise<IzipayCreatePaymentResult> {
  if (isMockMode()) {
    // URL relativa: el browser usa el origen actual (localhost en dev,
    // dominio Vercel/DO en prod). Evita problemas si NEXT_PUBLIC_SITE_URL
    // apunta a un sitio legacy distinto al deploy actual.
    const params = new URLSearchParams({
      orderRef: input.orderReference,
      amount: String(input.amount),
      courseId: input.metadata.courseId,
      guestName: input.metadata.guestName,
      guestEmail: input.metadata.guestEmail,
      guestPhone: input.metadata.guestPhone,
    });
    if (input.metadata.notes) params.set("notes", input.metadata.notes);
    if (input.metadata.utmSource) params.set("utmSource", input.metadata.utmSource);
    return {
      checkoutUrl: `/checkout/mock?${params.toString()}`,
      orderReference: input.orderReference,
      provider: "mock",
    };
  }

  // TODO Fase 3: implementar llamada real a Izipay API
  throw new Error("createIzipayPayment: pendiente Fase 3 (Izipay API real)");
}

export function parseIzipayWebhookPayload(
  rawBody: string,
): IzipayWebhookEvent | null {
  try {
    const parsed = JSON.parse(rawBody);
    return parsed as IzipayWebhookEvent;
  } catch {
    return null;
  }
}
