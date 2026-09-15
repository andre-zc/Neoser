"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { MarketingOptIn } from "@/components/marketing-opt-in";

/**
 * Formulario de suscripción a novedades (modelo Spinning Babies / Toulouse).
 * Persiste en contact_leads con source=newsletter y marketing_consent=true.
 */
export function NewsletterSignupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");

    const formData = new FormData(form);
    const marketingConsent = formData.get("marketingConsent") === "on";
    if (!marketingConsent) {
      setStatus("error");
      setError("Debes autorizar el envío de novedades para suscribirte.");
      return;
    }

    const fullName = String(formData.get("fullName") || "").trim();
    const payload = {
      fullName,
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: "Suscripción a novedades y próximas capacitaciones NeoSer.",
      source: "newsletter" as const,
      waConsent: true,
      marketingConsent: true,
      serviceInterest: "Novedades y capacitaciones",
    };

    try {
      const response = await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo registrar");
      }

      form.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error ? submitError.message : "Error inesperado",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-pink/20 bg-white p-8 text-center shadow-sm md:p-10">
        <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy md:text-3xl">
          ¡Gracias por registrarte!
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
          Te avisaremos por correo y WhatsApp sobre próximas capacitaciones y
          novedades de NeoSer. Revisa también tu carpeta de spam la primera vez.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-pink/15 bg-white p-6 shadow-sm md:p-8"
    >
      <input
        name="fullName"
        required
        autoComplete="name"
        placeholder="Nombre completo"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-pink"
      />
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Correo electrónico"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-pink"
      />
      <input
        name="phone"
        required
        autoComplete="tel"
        placeholder="WhatsApp / teléfono"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-pink"
      />

      <MarketingOptIn required />

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input name="privacy" type="checkbox" required className="mt-0.5" />
        <span>
          He leído y acepto la{" "}
          <Link
            href="/politica-de-privacidad"
            className="font-semibold text-pink underline-offset-2 hover:underline"
          >
            Política de Privacidad
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Registrando..." : "Regístrate ahora"}
      </button>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
