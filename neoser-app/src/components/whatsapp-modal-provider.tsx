"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  FormEvent,
  type ReactNode,
} from "react";
import { services } from "@/lib/services";

type ModalContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const Ctx = createContext<ModalContextValue | null>(null);

export function useWhatsappModal() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useWhatsappModal debe usarse dentro de WhatsappModalProvider",
    );
  }
  return ctx;
}

function getWhatsappUrl(name: string, serviceInterest?: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51978822368";
  const baseMsg = `Hola NeoSer, soy ${name}. Acabo de llenar el formulario en su web`;
  const fullMsg =
    serviceInterest && serviceInterest !== "Otro"
      ? `${baseMsg} y me gustaría más información sobre "${serviceInterest}".`
      : `${baseMsg} y me gustaría más información sobre sus servicios.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(fullMsg)}`;
}

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

function WhatsappLeadModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  // Cerrar con ESC
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");

    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const serviceInterest = String(formData.get("serviceInterest") || "");
    const gestationWeeks = formData.get("gestationWeeks");
    const messageInput = String(formData.get("message") || "").trim();

    const payload = {
      fullName,
      phone,
      message:
        messageInput ||
        `Contacto por WhatsApp${serviceInterest ? ` - interesada en ${serviceInterest}` : ""}`,
      source: "whatsapp_button",
      waConsent: true,
      email: email || undefined,
      serviceInterest: serviceInterest || undefined,
      gestationWeeks: gestationWeeks ? Number(gestationWeeks) : undefined,
    };

    try {
      const response = await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo registrar el contacto");
      }

      // Abrir WhatsApp en nueva pestaña con mensaje pre-armado
      const waUrl = getWhatsappUrl(fullName, serviceInterest);
      window.open(waUrl, "_blank", "noopener,noreferrer");
      onClose();
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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-[#25D366] px-6 py-5 text-center text-white">
          <WhatsAppIcon className="mx-auto mb-2 h-10 w-10" />
          <h2 id="whatsapp-modal-title" className="text-lg font-bold">
            Antes de escribirnos por WhatsApp
          </h2>
          <p className="mt-1 text-sm text-white/90">
            Déjanos tus datos para atenderte mejor.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 p-6">
          <input
            name="fullName"
            required
            placeholder="Nombre completo *"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
          />
          <input
            name="phone"
            required
            placeholder="Teléfono *"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
          />
          <input
            name="email"
            type="email"
            placeholder="Email (opcional)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
          />
          <select
            name="serviceInterest"
            defaultValue=""
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
          >
            <option value="">Servicio de interés (opcional)</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Otro">Otro / No listado</option>
          </select>
          <input
            name="gestationWeeks"
            type="number"
            min={0}
            max={45}
            placeholder="Semanas de gestación (opcional)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
          />
          <textarea
            name="message"
            placeholder="Mensaje (opcional)"
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
          />
          <p className="text-xs leading-relaxed text-gray-500">
            Al continuar acepto recibir mensajes relacionados a mi consulta.
          </p>
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:bg-[#1ebe5d] disabled:opacity-60"
          >
            {status === "loading" ? (
              "Enviando..."
            ) : (
              <>
                <WhatsAppIcon className="h-5 w-5" />
                Terminar y abrir WhatsApp
              </>
            )}
          </button>
          {status === "error" && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export function WhatsappModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value: ModalContextValue = {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    isOpen,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen && <WhatsappLeadModal onClose={() => setIsOpen(false)} />}
    </Ctx.Provider>
  );
}
