"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { MarketingOptIn } from "@/components/marketing-opt-in";
import { LEGAL } from "@/lib/legal";

const COURSE_INTEREST =
  "Curso Neurobiología del Parto y Protocolos para un Nacimiento Humanizado";

const DEFAULT_MESSAGE =
  "Hola NeoSer, quiero más información sobre el curso Neurobiología del Parto y Protocolos para un Nacimiento Humanizado.";

type Props = {
  whatsappText?: string;
  className?: string;
  /** Compacto para el panel del hero. */
  compact?: boolean;
  submitLabel?: string;
};

/**
 * Formulario de campaña: captación autorizada + puente a WhatsApp ManyChat.
 * Convive con el CTA de compra (checkout) en la misma landing.
 */
export function CampaignLeadForm({
  whatsappText,
  className = "",
  compact = false,
  submitLabel = "Quiero recibir información",
}: Props) {
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
    const fullName = String(formData.get("fullName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message =
      String(formData.get("message") || "").trim() || DEFAULT_MESSAGE;

    const marketingConsent = formData.get("marketingConsent") === "on";
    if (!marketingConsent) {
      setStatus("error");
      setError(
        "Debes autorizar el contacto y el envío de información del curso.",
      );
      return;
    }

    const payload = {
      fullName,
      phone,
      email: email || undefined,
      message,
      source: "meta_ads" as const,
      waConsent: formData.get("waConsent") === "on",
      marketingConsent: true,
      serviceInterest: COURSE_INTEREST,
    };

    try {
      const response = await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo enviar");
      }

      const text =
        whatsappText ||
        encodeURIComponent(
          `Hola NeoSer, soy ${fullName}. Quiero información sobre el curso Neurobiología del Parto.`,
        );
      window.open(
        `https://wa.me/${LEGAL.whatsappManychat}?text=${text}`,
        "_blank",
        "noopener,noreferrer",
      );

      form.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error inesperado",
      );
    }
  }

  const field =
    "w-full rounded-xl border border-navy/10 bg-white px-3.5 py-2.5 text-sm text-navy outline-none ring-pink/30 focus:ring-2";

  return (
    <form
      id="informacion"
      onSubmit={onSubmit}
      className={`space-y-3 ${className}`}
    >
      <input
        name="fullName"
        required
        autoComplete="name"
        placeholder="Nombre completo *"
        className={field}
      />
      <input
        name="phone"
        required
        autoComplete="tel"
        placeholder="WhatsApp / teléfono *"
        className={field}
      />
      <input
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email (opcional)"
        className={field}
      />
      {!compact && (
        <textarea
          name="message"
          rows={2}
          placeholder="¿Qué te gustaría saber? (opcional)"
          className={`${field} resize-y`}
        />
      )}

      <MarketingOptIn
        required
        title="Autorizo el contacto y el envío de información del curso *"
        description="Necesario para que NeoSer pueda escribirte y hacer seguimiento de esta solicitud. Puedes darte de baja cuando quieras."
      />

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input name="waConsent" type="checkbox" required className="mt-0.5" />
        <span>
          Autorizo que me contacten por WhatsApp sobre esta consulta. *
        </span>
      </label>

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input name="privacy" type="checkbox" required className="mt-0.5" />
        <span>
          He leído y acepto la{" "}
          <Link
            href="/politica-de-privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-pink underline-offset-2 hover:underline"
          >
            Política de Privacidad
          </Link>{" "}
          (Ley de Protección de Datos Personales). *
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
          </>
        ) : (
          <>
            {submitLabel} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700">
          Listo: tus datos quedaron registrados y te redirigimos a WhatsApp para
          seguir con una asesora. Si no se abrió, revisa que el navegador no
          haya bloqueado la ventana emergente.
        </p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
