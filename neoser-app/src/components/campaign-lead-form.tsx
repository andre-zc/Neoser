"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { MarketingOptIn } from "@/components/marketing-opt-in";
import { LEGAL } from "@/lib/legal";

const COURSE_INTEREST =
  "Curso Neurobiología del Parto y Protocolos para un Nacimiento Humanizado";

const DEFAULT_MESSAGE =
  "Hola NeoSer, quiero más información sobre el curso Neurobiología del Parto y Protocolos para un Nacimiento Humanizado.";

type Props = {
  /** Texto prearmado del WhatsApp ManyChat (ya URL-encoded o plano). */
  whatsappText?: string;
  className?: string;
};

/**
 * Formulario corto de campaña: guarda el lead y abre el WhatsApp de ManyChat.
 * Pensado para landings `/lp/*` (Meta Ads), no para la web institucional.
 */
export function CampaignLeadForm({
  whatsappText,
  className = "",
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

    const payload = {
      fullName,
      phone,
      email: email || undefined,
      message,
      source: "meta_ads" as const,
      waConsent: formData.get("waConsent") === "on",
      marketingConsent: formData.get("marketingConsent") === "on",
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
      const waUrl = `https://wa.me/${LEGAL.whatsappManychat}?text=${text}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

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

  return (
    <form
      id="informacion"
      onSubmit={onSubmit}
      className={`space-y-4 ${className}`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="fullName"
          required
          autoComplete="name"
          placeholder="Nombre completo *"
          className="w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none ring-pink/30 focus:ring-2"
        />
        <input
          name="phone"
          required
          autoComplete="tel"
          placeholder="WhatsApp / teléfono *"
          className="w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none ring-pink/30 focus:ring-2"
        />
      </div>
      <input
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email (opcional)"
        className="w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none ring-pink/30 focus:ring-2"
      />
      <textarea
        name="message"
        rows={3}
        placeholder="¿Qué te gustaría saber? (opcional)"
        className="w-full resize-y rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none ring-pink/30 focus:ring-2"
      />

      <MarketingOptIn
        title="Autorizo recibir información del curso y novedades NeoSer"
        description="Te escribiremos por WhatsApp o email sobre esta edición y formaciones relacionadas. Puedes darte de baja cuando quieras."
      />

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input name="waConsent" type="checkbox" required className="mt-0.5" />
        <span>
          Autorizo que NeoSer me contacte por WhatsApp sobre esta consulta. *
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
            Quiero recibir información <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700">
          Listo. Te abrimos WhatsApp para continuar la conversación.
        </p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
