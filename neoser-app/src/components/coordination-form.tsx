"use client";

import { FormEvent, useState } from "react";

const reasons = [
  "Ponencia o conferencia",
  "Curso o capacitación",
  "Convenio institucional",
  "Proyecto académico o de investigación",
  "Participación en evento",
  "Entrevista o medio de comunicación",
  "Otro",
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

function getWhatsappUrl() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51978822368";
  const msg =
    "Hola. He enviado una solicitud de reunión de coordinación a través de la página web de NeoSer y deseo brindar información adicional. Gracias.";
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20";

export function CoordinationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");

    const fd = new FormData(form);
    const payload = {
      fullName: String(fd.get("fullName") || ""),
      institution: String(fd.get("institution") || ""),
      position: String(fd.get("position") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      reason: String(fd.get("reason") || ""),
      description: String(fd.get("description") || ""),
    };

    try {
      const res = await fetch("/api/coordination-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo enviar la solicitud");
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
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-navy">¡Solicitud recibida!</h3>
        <p className="mx-auto mb-6 max-w-md leading-relaxed text-gray-600">
          Gracias por contactarse con NeoSer. Hemos recibido su solicitud de
          coordinación. Nuestro equipo revisará la información y se comunicará con
          usted a la brevedad para coordinar la fecha, horario y modalidad de la
          reunión.
        </p>
        <a
          href={getWhatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:bg-[#1ebe5d]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          ¿Deseas brindar más información? Escríbenos
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-1 text-2xl font-bold text-navy">
        Reunión de Coordinación
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        Coordine con NeoSer capacitaciones, ponencias, alianzas institucionales y
        proyectos de colaboración.{" "}
        <span className="font-medium text-navy">
          Duración: 30 minutos · Modalidad virtual.
        </span>
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="fullName"
            required
            placeholder="Nombres y apellidos *"
            className={inputClass}
          />
          <input
            name="institution"
            required
            placeholder="Institución u organización *"
            className={inputClass}
          />
          <input
            name="position"
            required
            placeholder="Cargo *"
            className={inputClass}
          />
          <input
            name="phone"
            required
            placeholder="Teléfono celular *"
            className={inputClass}
          />
        </div>

        <input
          name="email"
          type="email"
          required
          placeholder="Correo electrónico *"
          className={inputClass}
        />

        <select name="reason" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Motivo de la coordinación *
          </option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          required
          rows={4}
          placeholder="Descripción breve de la solicitud *"
          className={inputClass}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-navy px-6 py-3 font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
        >
          {status === "loading" ? "Enviando..." : "Enviar solicitud"}
        </button>

        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
