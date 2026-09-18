import "server-only";

import crypto from "crypto";

export const PAYMENT_QA_COURSE_ID =
  "9a8b7c6d-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const PAYMENT_QA_PURPOSE = "protocolos_payment_qa";
export const PAYMENT_QA_TITLE = "Prueba de pago — Curso Protocolos";
// Mínimos vigentes del checkout online de Culqi para que el laboratorio
// reproduzca los mismos métodos disponibles que el curso publicado.
export const PAYMENT_QA_PRICE_PEN = 6;
export const PAYMENT_QA_PRICE_USD = 3;
export const NEUROBIOLOGY_PAYMENT_QA_COURSE_ID =
  "6a7b8c9d-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const NEUROBIOLOGY_PAYMENT_QA_PURPOSE =
  "neurobiologia_usd_payment_qa";
export const NEUROBIOLOGY_PAYMENT_QA_TITLE =
  "Prueba de pago — Neurobiología del Parto";
// Mínimo para tarjeta en USD según la tabla de límites de CulqiOnline.
export const NEUROBIOLOGY_PAYMENT_QA_PRICE_USD = 3;
export const PAYMENT_QA_COOKIE_NAME = "neoser_payment_qa";

type PaymentQaProduct = {
  courseId: string;
  purpose: string;
  title: string;
  path: string;
  pricePEN?: number;
  priceUSD: number;
};

const qaProducts: PaymentQaProduct[] = [
  {
    courseId: PAYMENT_QA_COURSE_ID,
    purpose: PAYMENT_QA_PURPOSE,
    title: PAYMENT_QA_TITLE,
    path: "/pruebas/pagos/protocolos",
    pricePEN: PAYMENT_QA_PRICE_PEN,
    priceUSD: PAYMENT_QA_PRICE_USD,
  },
  {
    courseId: NEUROBIOLOGY_PAYMENT_QA_COURSE_ID,
    purpose: NEUROBIOLOGY_PAYMENT_QA_PURPOSE,
    title: NEUROBIOLOGY_PAYMENT_QA_TITLE,
    path: "/pruebas/pagos/neurobiologia-internacional",
    priceUSD: NEUROBIOLOGY_PAYMENT_QA_PRICE_USD,
  },
];

const PAYMENT_QA_SESSION_TTL_SECONDS = 4 * 60 * 60;

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function configuredAccessKey(): string | null {
  const accessKey = process.env.PAYMENTS_QA_ACCESS_KEY?.trim();
  return accessKey && accessKey.length >= 20 ? accessKey : null;
}

function signSessionExpiry(expiresAt: number): string | null {
  const accessKey = configuredAccessKey();
  if (!accessKey) return null;

  return crypto
    .createHmac("sha256", accessKey)
    .update(`${PAYMENT_QA_PURPOSE}:${expiresAt}`)
    .digest("hex");
}

export function verifyPaymentQaAccessKey(candidate: string): boolean {
  const accessKey = configuredAccessKey();
  return Boolean(accessKey && safeEqual(candidate, accessKey));
}

export function createPaymentQaSession(): {
  value: string;
  maxAge: number;
} | null {
  const expiresAt = Math.floor(Date.now() / 1000) + PAYMENT_QA_SESSION_TTL_SECONDS;
  const signature = signSessionExpiry(expiresAt);
  return signature
    ? {
        value: `${expiresAt}.${signature}`,
        maxAge: PAYMENT_QA_SESSION_TTL_SECONDS,
      }
    : null;
}

export function verifyPaymentQaSession(candidate?: string): boolean {
  if (!candidate) return false;

  const [expiresAtText, candidateSignature, extra] = candidate.split(".");
  const expiresAt = Number(expiresAtText);
  if (
    extra !== undefined ||
    !Number.isInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  const expectedSignature = signSessionExpiry(expiresAt);
  return Boolean(
    candidateSignature &&
      expectedSignature &&
      safeEqual(candidateSignature, expectedSignature),
  );
}

export function isPaymentQaCourse(courseId: string): boolean {
  return getPaymentQaProduct(courseId) !== null;
}

export function getPaymentQaProduct(courseId: string): PaymentQaProduct | null {
  return qaProducts.find((product) => product.courseId === courseId) ?? null;
}

export function getPaymentQaProductByPurpose(
  purpose: unknown,
): PaymentQaProduct | null {
  return typeof purpose === "string"
    ? qaProducts.find((product) => product.purpose === purpose) ?? null
    : null;
}

export function getPaymentQaAmount(
  courseId: string,
  currency: "PEN" | "USD",
): number | null {
  const product = getPaymentQaProduct(courseId);
  if (!product) return null;
  return currency === "USD" ? product.priceUSD : product.pricePEN ?? null;
}

export function getCulqiEnvironment(): "live" | "test" | "invalid" {
  const publicEnvironment = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY?.match(
    /^pk_(test|live)_/,
  )?.[1] as "test" | "live" | undefined;
  const secretEnvironment = process.env.CULQI_SECRET_KEY?.match(
    /^sk_(test|live)_/,
  )?.[1] as "test" | "live" | undefined;

  return publicEnvironment && publicEnvironment === secretEnvironment
    ? publicEnvironment
    : "invalid";
}

export function isPaymentQaRawPayload(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  return Boolean(
    getPaymentQaProductByPurpose(
      (payload as Record<string, unknown>).purpose,
    ),
  );
}
