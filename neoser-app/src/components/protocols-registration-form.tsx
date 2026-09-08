"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

type ProtocolsRegistrationFormProps = {
  reference: string;
  preview?: boolean;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-[15px] text-navy outline-none transition placeholder:text-gray-400 focus:border-pink-dark focus:ring-4 focus:ring-pink/15";

export function ProtocolsRegistrationForm({
  reference,
  preview = false,
}: ProtocolsRegistrationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      reference,
      fullName: String(formData.get("fullName") ?? ""),
      identityDocument: String(formData.get("identityDocument") ?? ""),
      whatsappPhone: String(formData.get("whatsappPhone") ?? ""),
      email: String(formData.get("email") ?? ""),
      profession: String(formData.get("profession") ?? ""),
      workplace: String(formData.get("workplace") ?? ""),
      city: String(formData.get("city") ?? ""),
      country: String(formData.get("country") ?? ""),
    };

    if (preview) {
      router.replace(
        "/checkout/success?ref=preview_protocols&preview=access",
      );
      return;
    }

    try {
      const response = await fetch(
        "/api/enrollments/protocolos/registration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setErrorMessage(
          result.error || "No pudimos guardar tus datos. Inténtalo nuevamente.",
        );
        setIsSubmitting(false);
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage(
        "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7" noValidate={false}>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-navy sm:col-span-2">
          Nombres y apellidos completos
          <input
            name="fullName"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            className={inputClassName}
            placeholder="Ej. María Fernanda López"
          />
        </label>

        <label className="text-sm font-semibold text-navy">
          DNI o cédula de identidad
          <input
            name="identityDocument"
            type="text"
            inputMode="text"
            autoComplete="off"
            required
            minLength={6}
            maxLength={30}
            className={inputClassName}
            placeholder="Número de documento"
          />
        </label>

        <label className="text-sm font-semibold text-navy">
          Número de WhatsApp
          <input
            name="whatsappPhone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            minLength={7}
            maxLength={24}
            className={inputClassName}
            placeholder="Ej. +51 999 999 999"
          />
        </label>

        <label className="text-sm font-semibold text-navy sm:col-span-2">
          Correo electrónico
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            className={inputClassName}
            placeholder="correo@ejemplo.com"
          />
        </label>

        <label className="text-sm font-semibold text-navy">
          Profesión u ocupación actual
          <input
            name="profession"
            type="text"
            autoComplete="organization-title"
            required
            minLength={2}
            maxLength={120}
            className={inputClassName}
            placeholder="Ej. Obstetra"
          />
        </label>

        <label className="text-sm font-semibold text-navy">
          Centro donde labora
          <input
            name="workplace"
            type="text"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={160}
            className={inputClassName}
            placeholder="Nombre de la institución"
          />
        </label>

        <label className="text-sm font-semibold text-navy">
          Ciudad
          <input
            name="city"
            type="text"
            autoComplete="address-level2"
            required
            minLength={2}
            maxLength={100}
            className={inputClassName}
            placeholder="Ej. Lima"
          />
        </label>

        <label className="text-sm font-semibold text-navy">
          País
          <input
            name="country"
            type="text"
            autoComplete="country-name"
            required
            minLength={2}
            maxLength={100}
            className={inputClassName}
            placeholder="Ej. Perú"
          />
        </label>
      </div>

      <div className="mt-6 flex gap-3 rounded-xl bg-navy/[0.045] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
        <p className="text-xs leading-relaxed text-gray-500">
          Tus datos se usarán únicamente para gestionar tu inscripción y el
          acceso a este curso. No aparecerán en el mensaje ni en el código QR
          de WhatsApp.
        </p>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          aria-live="polite"
          className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-pink px-5 py-4 text-base font-bold text-white shadow-[0_7px_0_#c9657a] transition hover:-translate-y-0.5 hover:bg-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-dark active:translate-y-1 active:shadow-[0_3px_0_#c9657a] disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Guardando tus datos…
          </>
        ) : (
          <>
            Guardar datos y continuar
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
}
