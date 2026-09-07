import "server-only";

import crypto from "crypto";

export const PAYMENT_QA_COURSE_ID =
  "9a8b7c6d-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const PAYMENT_QA_PURPOSE = "protocolos_payment_qa";
export const PAYMENT_QA_TITLE = "Prueba de pago — Curso Protocolos";
export const PAYMENT_QA_PRICE_PEN = 5;
export const PAYMENT_QA_PRICE_USD = 1.5;
export const PAYMENT_QA_COOKIE_NAME = "neoser_payment_qa";

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
  return courseId === PAYMENT_QA_COURSE_ID;
}

export function getPaymentQaAmount(currency: "PEN" | "USD"): number {
  return currency === "USD"
    ? PAYMENT_QA_PRICE_USD
    : PAYMENT_QA_PRICE_PEN;
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
  return (
    (payload as Record<string, unknown>).purpose === PAYMENT_QA_PURPOSE
  );
}
