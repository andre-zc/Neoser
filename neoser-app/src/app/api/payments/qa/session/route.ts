import { NextResponse } from "next/server";
import {
  createPaymentQaSession,
  PAYMENT_QA_COOKIE_NAME,
  verifyPaymentQaAccessKey,
} from "@/lib/payments/payment-qa";

export async function POST(request: Request) {
  let accessKey = "";

  try {
    const payload = (await request.json()) as { accessKey?: unknown };
    accessKey =
      typeof payload.accessKey === "string" ? payload.accessKey.trim() : "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!verifyPaymentQaAccessKey(accessKey)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }

  const session = createPaymentQaSession();
  if (!session) {
    return NextResponse.json(
      { error: "El acceso de pruebas no está configurado" },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PAYMENT_QA_COOKIE_NAME, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  response.headers.set("Cache-Control", "no-store");

  return response;
}
