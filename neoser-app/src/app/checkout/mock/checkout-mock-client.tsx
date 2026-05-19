"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutMockInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>("");

  const orderRef = searchParams.get("orderRef") ?? "";
  const amount = Number(searchParams.get("amount") ?? "0");
  const courseId = searchParams.get("courseId") ?? "";
  const guestName = searchParams.get("guestName") ?? "";
  const guestEmail = searchParams.get("guestEmail") ?? "";
  const guestPhone = searchParams.get("guestPhone") ?? "";
  const notes = searchParams.get("notes") ?? "";
  const utmSource = searchParams.get("utmSource") ?? "";

  async function handleConfirm() {
    setStatus("loading");
    setError("");

    const payload = {
      transactionId: `mock_${Date.now()}`,
      status: "AUTHORIZED",
      orderReference: orderRef,
      amount,
      currency: "PEN",
      metadata: {
        courseId,
        guestName,
        guestEmail,
        guestPhone,
        ...(notes ? { notes } : {}),
        ...(utmSource ? { utmSource } : {}),
      },
    };

    try {
      const response = await fetch("/api/payments/izipay/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Error procesando el pago simulado");
      }

      window.location.href = `/checkout/success?orderRef=${encodeURIComponent(orderRef)}`;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  function handleCancel() {
    window.location.href = `/checkout/failure?orderRef=${encodeURIComponent(orderRef)}`;
  }

  const formattedAmount = `S/. ${Number(amount).toLocaleString("es-PE")}`;

  return (
    <main className="min-h-screen bg-cream py-12 md:py-20">
      <div className="container-main mx-auto max-w-xl">
        <div className="surface-card p-8">
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800">
            Esta pantalla simula el flujo de Izipay en modo desarrollo. No se
            cobra dinero real.
          </div>

          <h1 className="mt-6 text-2xl font-bold text-navy">
            Simulación de pago — Izipay
          </h1>

          <div className="mt-6 space-y-3 rounded-xl bg-white p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Orden</span>
              <span className="font-mono text-xs text-navy">{orderRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cliente</span>
              <span className="text-navy">{guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-navy">{guestEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Teléfono</span>
              <span className="text-navy">{guestPhone}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <span className="font-semibold text-gray-600">Total</span>
              <span className="course-price">{formattedAmount}</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={status === "loading" || !orderRef || !courseId}
              className="w-full justify-center rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {status === "loading" ? "Procesando..." : "Confirmar pago"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancelar pago
            </button>
          </div>

          {status === "error" && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          {(!orderRef || !courseId) && (
            <p className="mt-4 text-xs text-red-600">
              Faltan parámetros en la URL. Inicia el flujo desde la página de
              inscripción de un curso.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CheckoutMockClient() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cream py-12 md:py-20">
          <div className="container-main mx-auto max-w-xl">
            <div className="surface-card p-8 text-center text-sm text-gray-500">
              Cargando simulador de pago...
            </div>
          </div>
        </main>
      }
    >
      <CheckoutMockInner />
    </Suspense>
  );
}
