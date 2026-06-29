"use client";

/**
 * Form de inscripción a un curso con Culqi Custom Checkout.
 *
 * Flujo:
 *  1. Carga el script https://checkout.culqi.com/js/v4 (afterInteractive).
 *  2. Al submit: configura Culqi (publicKey, settings, options) y abre el modal.
 *  3. Culqi tokeniza la tarjeta (la info NUNCA toca nuestro servidor) y dispara
 *     el callback global `window.culqi()`.
 *  4. El callback hace POST a /api/payments/culqi/charge con el token.
 *  5. Según response: redirect a /checkout/success?ref=chr_xxx (200 ok)
 *     o mostrar mensaje en el form (402 rechazado).
 */

import { FormEvent, useEffect, useRef, useState } from "react";
import Script from "next/script";

type Props = {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  courseCurrency: string;
};

type ChargePayload = {
  courseId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
  utmSource?: string;
};

// Tipos mínimos del Custom Checkout (la libreria es JS, no TS).
declare global {
  interface Window {
    Culqi?: {
      publicKey: string;
      settings: (s: {
        title: string;
        currency: string;
        amount: number;
        order?: string;
      }) => void;
      options: (o: Record<string, unknown>) => void;
      open: () => void;
      close: () => void;
      token?: { id: string; email: string };
      error?: {
        type?: string;
        merchant_message?: string;
        user_message?: string;
      };
    };
    culqi?: () => void;
  }
}

const CULQI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";

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

  // Guardamos el payload del form aquí porque el callback global `culqi()`
  // se invoca fuera del scope del onSubmit (es asincrónico desde el modal).
  const pendingChargeRef = useRef<ChargePayload | null>(null);

  const amountCents = Math.round(Number(coursePrice) * 100);

  // Registrar el callback global de Culqi UNA sola vez.
  // Culqi llama a window.culqi() cuando termina la tokenización (éxito o error).
  // submitCharge vive ADENTRO del effect para que el closure sea estable y no
  // capture versiones viejas del componente (state setters son estables).
  useEffect(() => {
    // Flag (closure) para bloquear procesamiento concurrente. Culqi puede
    // invocar window.culqi() multiples veces (click doble del usuario en el
    // modal, race condition interno del SDK). Sin esta guarda, cada
    // invocacion genera un cargo nuevo => DOBLE COBRO en producción real.
    // Se resetea en error (402/red/fail) para permitir reintentos; se queda
    // en true en éxito porque ya redirigimos a /checkout/success.
    let processing = false;

    async function submitCharge(token: string, payload: ChargePayload) {
      try {
        const response = await fetch("/api/payments/culqi/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, token }),
        });

        const data = await response.json().catch(() => ({}));

        // Camino feliz: cerrar modal Culqi y redirigir a success
        if (response.ok && data.ok) {
          try {
            window.Culqi?.close();
          } catch {
            /* ignore */
          }
          const ref = encodeURIComponent(data.chargeId || "");
          window.location.href = `/checkout/success?ref=${ref}`;
          return;
        }

        // 402: tarjeta rechazada (request válido, banco dijo no) → mostrar inline
        if (response.status === 402) {
          processing = false; // permitir reintento con otra tarjeta
          setStatus("error");
          setError(data.message || "Tu tarjeta fue rechazada. Intenta con otra.");
          try {
            window.Culqi?.close();
          } catch {
            /* ignore */
          }
          return;
        }

        throw new Error(data.error || "No se pudo procesar el pago");
      } catch (err) {
        processing = false; // permitir reintento ante error de red/server
        setStatus("error");
        setError(err instanceof Error ? err.message : "Error inesperado");
        try {
          window.Culqi?.close();
        } catch {
          /* ignore */
        }
      }
    }

    window.culqi = function culqiCallback() {
      const C = window.Culqi;
      if (!C) return;

      if (C.token) {
        // Si ya estamos procesando, ignorar invocaciones extra (anti-doble-cobro)
        if (processing) return;
        processing = true;

        const token = C.token.id;
        const pending = pendingChargeRef.current;
        if (!pending) {
          processing = false;
          setStatus("error");
          setError("Estado de pago inválido. Recarga la página e intenta de nuevo.");
          return;
        }
        void submitCharge(token, pending);
      } else if (C.error) {
        processing = false; // permitir reintento si Culqi falla la tokenización
        const message =
          C.error.user_message ||
          C.error.merchant_message ||
          "No se pudo procesar el pago";
        setStatus("error");
        setError(message);
        try {
          C.close();
        } catch {
          /* ignore */
        }
      }
    };

    return () => {
      // Limpiar al desmontar para evitar callbacks tardíos a un componente muerto
      if (window.culqi) {
        window.culqi = undefined;
      }
    };
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!CULQI_PUBLIC_KEY) {
      setStatus("error");
      setError("Sistema de pago no configurado. Contáctanos por WhatsApp.");
      return;
    }

    // Check basado en window.Culqi directo: scriptLoaded puede estar desfasado
    // si onLoad no se disparó (script cacheado). El runtime real es window.Culqi.
    if (!window.Culqi) {
      setStatus("error");
      setError(
        "El sistema de pago aún se está cargando. Espera un segundo y reintenta.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload: ChargePayload = {
      courseId,
      guestName: String(formData.get("guestName") || "").trim(),
      guestEmail: String(formData.get("guestEmail") || "").trim(),
      guestPhone: String(formData.get("guestPhone") || "").trim(),
      notes: ((formData.get("notes") as string) || "").trim() || undefined,
    };

    pendingChargeRef.current = payload;
    setStatus("loading");

    // Logo absoluto (Culqi requiere URL pública accesible)
    const logoUrl = `${window.location.origin}/assets/logo-color.png`;

    // Configurar y abrir el Custom Checkout
    window.Culqi.publicKey = CULQI_PUBLIC_KEY;
    window.Culqi.settings({
      title: "NeoSer",
      currency: "PEN",
      amount: amountCents,
    });
    window.Culqi.options({
      lang: "es",
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: true,
        bancaMovil: false,
        agente: false,
        billetera: false,
        cuotealo: false,
      },
      style: {
        logo: logoUrl,
        bannerColor: "#1b3a6b",
        buttonBackground: "#1b3a6b",
        menuColor: "#e8879b",
        linksColor: "#e8879b",
        // Culqi anexa el monto al final del buttonText automaticamente.
        // No incluir el precio aqui (sino sale duplicado: "Pagar S/. 350 S/ 350.00").
        buttonText: "Pagar",
        buttonTextColor: "#FFFFFF",
        priceColor: "#1b3a6b",
      },
      // Pre-fill del customer; Culqi lo usa para la pantalla de tarjeta
      customer: {
        email: payload.guestEmail,
        phoneNumber: payload.guestPhone,
      },
    });
    window.Culqi.open();
  }

  return (
    <>
      <Script
        src="https://checkout.culqi.com/js/v4"
        strategy="afterInteractive"
        onError={() => {
          setStatus("error");
          setError(
            "No se pudo cargar el sistema de pago. Revisa tu conexión y recarga.",
          );
        }}
      />
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
          {status === "loading" ? "Procesando pago..." : "Pagar e inscribirme"}
        </button>

        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-gray-400">
          Pago seguro procesado por Culqi. Aceptamos tarjetas y Yape.
        </p>
      </form>
    </>
  );
}
