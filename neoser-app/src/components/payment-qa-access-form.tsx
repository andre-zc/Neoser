"use client";

import { FormEvent, useState } from "react";
import { KeyRound, LockKeyhole } from "lucide-react";

export function PaymentQaAccessForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const accessKey = String(formData.get("accessKey") || "");

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/payments/qa/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "No se pudo validar la clave");
      }

      window.location.reload();
    } catch (cause) {
      setStatus("error");
      setError(
        cause instanceof Error ? cause.message : "No se pudo validar la clave",
      );
    }
  }

  return (
    <main className="min-h-screen bg-cream py-16 md:py-24">
      <div className="container-main mx-auto max-w-md">
        <section className="surface-card p-7 sm:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl text-navy">Prueba privada de pagos</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Ingresa la clave de acceso para abrir el laboratorio de cobros de
            NeoSer.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-navy">
                Clave de acceso
              </span>
              <span className="relative block">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  name="accessKey"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-sm focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {status === "loading" ? "Validando..." : "Abrir prueba"}
            </button>

            {status === "error" ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
