"use client";

import { FormEvent, useState } from "react";

type Props = {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  courseCurrency: string;
};

function formatPrice(price: number, currency: string) {
  if (currency === "PEN") {
    return `S/. ${Number(price).toLocaleString("es-PE")}`;
  }
  return `${currency} ${Number(price).toLocaleString("es-PE")}`;
}

export function CourseEnrollmentForm({
  courseId,
  courseTitle,
  coursePrice,
  courseCurrency,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");

    const formData = new FormData(form);
    const payload = {
      courseId,
      guestName: String(formData.get("guestName") || ""),
      guestEmail: String(formData.get("guestEmail") || ""),
      guestPhone: String(formData.get("guestPhone") || ""),
      notes: (formData.get("notes") as string) || undefined,
    };

    try {
      const response = await fetch("/api/payments/izipay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo iniciar el pago");
      }

      const data = await response.json();
      if (!data.checkoutUrl) {
        throw new Error("Respuesta inválida del proveedor de pago");
      }

      window.location.href = data.checkoutUrl;
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error inesperado",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-4 p-6 md:p-8">
      <div className="rounded-xl bg-cream p-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Te estás inscribiendo en
        </p>
        <p className="mt-1 font-semibold text-navy">{courseTitle}</p>
        <p className="course-price mt-1 text-2xl">
          {formatPrice(coursePrice, courseCurrency)}
        </p>
      </div>

      <input
        name="guestName"
        required
        minLength={2}
        maxLength={120}
        placeholder="Nombre completo"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <input
        name="guestEmail"
        type="email"
        required
        placeholder="Correo electrónico"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <input
        name="guestPhone"
        required
        minLength={7}
        maxLength={20}
        placeholder="Teléfono / WhatsApp"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <textarea
        name="notes"
        placeholder="Notas o consultas (opcional)"
        maxLength={500}
        className="min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Procesando..." : "Ir al pago"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-center text-xs text-gray-400">
        Al continuar serás redirigido al sistema de pago seguro.
      </p>
    </form>
  );
}
