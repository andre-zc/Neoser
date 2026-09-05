"use client";

/**
 * Form de inscripción a un curso con tres vías de pago:
 *
 *  1. Culqi PEN  — tarjeta o Yape, en soles (Perú). Cobro inmediato.
 *  2. Culqi USD  — tarjeta internacional, en dólares. Cobro inmediato.
 *                  Requiere multimoneda habilitada en la cuenta Culqi.
 *  3. PayPal     — alternativa internacional (PayPal.me).
 *
 * Culqi (1 y 2) confirma el pago en el momento: el cargo es sincrónico y la
 * inscripción se persiste solo si el banco aprueba.
 *
 * PayPal (3) NO confirma nada: PayPal.me no envía webhook, así que la
 * inscripción se guarda como PENDIENTE y NeoSer verifica el pago a mano. Por
 * eso es la opción "alternativa" y no la principal.
 */

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { formatUsd } from "@/lib/payments/paypal";
import { MarketingOptIn } from "@/components/marketing-opt-in";

type Props = {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  courseCurrency: string;
  /** Tarifa internacional (USD). Sin esto solo se ofrece el pago en soles. */
  priceUSD?: number;
  /** Enlace de WhatsApp del curso, para consultas antes de pagar. */
  whatsappHref?: string;
};

/** Vías de pago disponibles en el checkout. */
type PayMethod = "culqi-pen" | "culqi-usd" | "paypal";

type ChargePayload = {
  courseId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  currency: "PEN" | "USD";
  marketingConsent?: boolean;
  notes?: string;
  utmSource?: string;
};

type Culqi3DSParameters = {
  eci: string;
  xid: string;
  cavv: string;
  protocolVersion: string;
  directoryServerTransactionId?: string;
};

type CulqiCheckoutInstance = {
  token?: { id: string; email?: string };
  order?: unknown;
  error?: {
    type?: string;
    merchant_message?: string;
    user_message?: string;
  };
  culqi?: () => void;
  closeCheckout?: () => void;
  open: () => void;
  close: () => void;
};

type CulqiCheckoutConfig = {
  settings: { title: string; currency: "PEN" | "USD"; amount: number };
  client: { email: string };
  options: {
    lang: string;
    installments: boolean;
    modal: boolean;
    paymentMethods: Record<string, boolean>;
    paymentMethodsSort: string[];
  };
  appearance: Record<string, unknown>;
};

type Culqi3DSApi = {
  publicKey: string;
  settings: {
    charge: { totalAmount: number; returnUrl: string; currency: string };
    card: { email: string };
  };
  options: Record<string, unknown>;
  generateDevice: () => Promise<string>;
  initAuthentication: (token: string) => Promise<void> | void;
  reset: () => void;
};

// Tipos mínimos de los SDK de Culqi (ambas librerías son JS, no TS).
declare global {
  interface Window {
    CulqiCheckout?: new (
      publicKey: string,
      config: CulqiCheckoutConfig,
    ) => CulqiCheckoutInstance;
    Culqi3DS?: Culqi3DSApi;
  }
}

const CULQI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";

/**
 * Activación explícita y segura. Si la variable falta o tiene otro valor, el
 * checkout queda oculto en lugar de mostrar un medio de pago incompleto.
 */
const CULQI_ENABLED = process.env.NEXT_PUBLIC_CULQI_ENABLED === "true";

// Evita el falso positivo de HTML5 con "correo@gmail" (sin TLD), que el
// servidor rechazaría después de que la persona ya llenó todo el formulario.
const EMAIL_PATTERN = "[^@\\s]+@[^@\\s]+\\.[^@\\s]+";

function formatPrice(price: number, currency: string) {
  if (currency === "PEN") {
    return `S/. ${Number(price).toLocaleString("es-PE")}`;
  }
  return `${currency} ${Number(price).toLocaleString("es-PE")}`;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20";

function isCulqi3DSParameters(value: unknown): value is Culqi3DSParameters {
  if (!value || typeof value !== "object") return false;
  const parameters = value as Record<string, unknown>;
  return (
    typeof parameters.eci === "string" &&
    typeof parameters.xid === "string" &&
    typeof parameters.cavv === "string" &&
    typeof parameters.protocolVersion === "string" &&
    (parameters.directoryServerTransactionId === undefined ||
      typeof parameters.directoryServerTransactionId === "string")
  );
}

export function CourseEnrollmentForm({
  courseId,
  courseTitle,
  coursePrice,
  courseCurrency,
  priceUSD,
  whatsappHref,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>("");

  const usdAvailable = typeof priceUSD === "number" && priceUSD > 0;

  // Opciones visibles según lo que esté configurado para este curso.
  const methods: { id: PayMethod; label: string; detail: string }[] = [
    ...(CULQI_ENABLED
      ? [
          {
            id: "culqi-pen" as const,
            label: "Tarjeta o Yape",
            detail: `Pago en soles · ${formatPrice(coursePrice, courseCurrency)}`,
          },
        ]
      : []),
    ...(CULQI_ENABLED && usdAvailable
      ? [
          {
            id: "culqi-usd" as const,
            label: "Tarjeta internacional",
            detail: `Pago en dólares · ${formatUsd(priceUSD!)}`,
          },
        ]
      : []),
    ...(usdAvailable
      ? [
          {
            id: "paypal" as const,
            label: "PayPal",
            detail: `Alternativa internacional · ${formatUsd(priceUSD!)}`,
          },
        ]
      : []),
  ];

  const [method, setMethod] = useState<PayMethod>(
    methods[0]?.id ?? "culqi-pen",
  );

  const isPaypal = method === "paypal";
  const isUsd = method === "culqi-usd" || method === "paypal";
  const displayAmount = isUsd && usdAvailable
    ? formatUsd(priceUSD!)
    : formatPrice(coursePrice, courseCurrency);

  // Estado transitorio del SDK; no provoca renders y evita callbacks duplicados.
  const pendingChargeRef = useRef<ChargePayload | null>(null);
  const checkoutRef = useRef<CulqiCheckoutInstance | null>(null);
  const processingRef = useRef(false);
  const threeDsContextRef = useRef<{
    token: string;
    payload: ChargePayload;
    deviceFingerprintId: string;
  } | null>(null);

  const submitCharge = useCallback(
    async (
      token: string,
      payload: ChargePayload,
      deviceFingerprintId: string,
      authentication3DS?: Culqi3DSParameters,
    ) => {
      try {
        const response = await fetch("/api/payments/culqi/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            token,
            deviceFingerprintId,
            ...(authentication3DS ? { authentication3DS } : {}),
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 202 && data.requires3DS) {
          if (authentication3DS) {
            throw new Error("No se pudo completar la autenticación bancaria.");
          }

          const Culqi3DS = window.Culqi3DS;
          if (!Culqi3DS) {
            throw new Error(
              "La autenticación bancaria no está disponible. Recarga la página.",
            );
          }

          threeDsContextRef.current = { token, payload, deviceFingerprintId };
          Culqi3DS.publicKey = CULQI_PUBLIC_KEY;
          Culqi3DS.settings = {
            charge: {
              totalAmount:
                payload.currency === "USD" && usdAvailable
                  ? Math.round(priceUSD! * 100)
                  : Math.round(Number(coursePrice) * 100),
              returnUrl: window.location.href,
              currency: payload.currency,
            },
            card: { email: payload.guestEmail },
          };
          await Culqi3DS.initAuthentication(token);
          return;
        }

        if (response.ok && data.ok) {
          checkoutRef.current?.close();
          window.Culqi3DS?.reset();
          threeDsContextRef.current = null;
          const ref = encodeURIComponent(data.chargeId || "");
          window.location.href = `/checkout/success?ref=${ref}`;
          return;
        }

        // 402: tarjeta rechazada (request válido, banco dijo no) → mostrar inline
        if (response.status === 402) {
          processingRef.current = false;
          threeDsContextRef.current = null;
          window.Culqi3DS?.reset();
          setStatus("error");
          setError(data.message || "Tu tarjeta fue rechazada. Intenta con otra.");
          checkoutRef.current?.close();
          return;
        }

        throw new Error(data.error || "No se pudo procesar el pago");
      } catch (err) {
        processingRef.current = false;
        threeDsContextRef.current = null;
        window.Culqi3DS?.reset();
        setStatus("error");
        setError(err instanceof Error ? err.message : "Error inesperado");
        checkoutRef.current?.close();
      }
    },
    [coursePrice, priceUSD, usdAvailable],
  );

  // Culqi3DS publica el resultado mediante postMessage en el mismo origen.
  useEffect(() => {
    if (!CULQI_ENABLED) return;

    function handleThreeDsMessage(event: MessageEvent<unknown>) {
      if (event.origin !== window.location.origin || !event.data) return;
      const response = event.data as Record<string, unknown>;

      if (isCulqi3DSParameters(response.parameters3DS)) {
        const context = threeDsContextRef.current;
        threeDsContextRef.current = null;
        if (!context || !processingRef.current) return;
        void submitCharge(
          context.token,
          context.payload,
          context.deviceFingerprintId,
          response.parameters3DS,
        );
        return;
      }

      if (response.error) {
        processingRef.current = false;
        threeDsContextRef.current = null;
        window.Culqi3DS?.reset();
        setStatus("error");
        setError(
          "No se pudo validar la compra con tu banco. Intenta nuevamente.",
        );
      }
    }

    window.addEventListener("message", handleThreeDsMessage);
    return () => window.removeEventListener("message", handleThreeDsMessage);
  }, [submitCharge]);

  /** Lee y normaliza los campos comunes del formulario. */
  function readForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    return {
      guestName: String(formData.get("guestName") || "").trim(),
      guestEmail: String(formData.get("guestEmail") || "").trim(),
      guestPhone: String(formData.get("guestPhone") || "").trim(),
      country: String(formData.get("country") || "").trim() || undefined,
      marketingConsent: formData.get("marketingConsent") === "on",
      notes: String(formData.get("notes") || "").trim() || undefined,
    };
  }

  async function submitPaypal(form: HTMLFormElement) {
    const data = readForm(form);
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/payments/paypal/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, ...data }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "No se pudo iniciar el pago");
      }

      // PayPal se abre en pestaña nueva para no perder la página de
      // instrucciones (que lleva la referencia del pago).
      window.open(json.paypalUrl, "_blank", "noopener,noreferrer");
      // El monto viaja en la URL para que "Abrir PayPal de nuevo" (si el
      // navegador bloqueó la pestaña) lleve el importe correcto.
      window.location.href = `/checkout/paypal?ref=${encodeURIComponent(
        json.reference,
      )}&amount=${encodeURIComponent(String(json.amountUsd ?? ""))}`;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  async function submitCulqi(
    form: HTMLFormElement,
    chargeCurrency: "PEN" | "USD",
  ) {
    if (!CULQI_PUBLIC_KEY) {
      setStatus("error");
      setError("Sistema de pago no configurado. Contáctanos por WhatsApp.");
      return;
    }

    const CulqiCheckout = window.CulqiCheckout;
    const Culqi3DS = window.Culqi3DS;
    if (!CulqiCheckout || !Culqi3DS) {
      setStatus("error");
      setError(
        "El sistema de pago aún se está cargando. Espera un segundo y reintenta.",
      );
      return;
    }

    const data = readForm(form);
    const payload: ChargePayload = {
      courseId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      currency: chargeCurrency,
      marketingConsent: data.marketingConsent,
      notes: data.notes,
    };

    // El monto mostrado en el modal debe coincidir con el que cobrará el
    // backend para esa moneda (el backend es la fuente autoritativa).
    const amountValue =
      chargeCurrency === "USD" && usdAvailable ? priceUSD! : Number(coursePrice);
    const amountCents = Math.round(amountValue * 100);
    const logoUrl = `${window.location.origin}/assets/logo-color.png`;

    pendingChargeRef.current = payload;
    processingRef.current = false;
    threeDsContextRef.current = null;
    setStatus("loading");

    try {
      checkoutRef.current?.close();
      Culqi3DS.reset();
      Culqi3DS.publicKey = CULQI_PUBLIC_KEY;
      Culqi3DS.options = {
        showModal: true,
        showLoading: true,
        showIcon: true,
        style: { btnColor: "#1b3a6b", btnTextColor: "#FFFFFF" },
      };
      const deviceFingerprintId = await Culqi3DS.generateDevice();
      if (!deviceFingerprintId) {
        throw new Error("No se pudo iniciar la validación segura del pago.");
      }

      const paymentMethods = {
        tarjeta: true,
        // Yape solo opera en soles: en USD hay que ocultarlo.
        yape: chargeCurrency === "PEN",
        bancaMovil: false,
        agente: false,
        billetera: false,
        cuotealo: false,
      };
      const config: CulqiCheckoutConfig = {
        settings: {
          title: "NeoSer",
          currency: chargeCurrency,
          amount: amountCents,
        },
        client: { email: payload.guestEmail },
        options: {
          lang: "es",
          installments: false,
          modal: true,
          paymentMethods,
          paymentMethodsSort: Object.keys(paymentMethods).filter(
            (paymentMethod) =>
              paymentMethods[paymentMethod as keyof typeof paymentMethods],
          ),
        },
        appearance: {
          theme: "default",
          hiddenCulqiLogo: false,
          hiddenBannerContent: false,
          hiddenBanner: false,
          hiddenToolBarAmount: false,
          hiddenEmail: true,
          menuType: "sidebar",
          buttonCardPayText: "Pagar",
          logo: logoUrl,
          defaultStyle: {
            bannerColor: "#1b3a6b",
            buttonBackground: "#1b3a6b",
            menuColor: "#e8879b",
            linksColor: "#e8879b",
            buttonTextColor: "#FFFFFF",
            priceColor: "#1b3a6b",
          },
        },
      };

      const checkout = new CulqiCheckout(CULQI_PUBLIC_KEY, config);
      checkoutRef.current = checkout;
      checkout.closeCheckout = () => {
        if (!processingRef.current) setStatus("idle");
      };
      checkout.culqi = () => {
        if (checkout.token) {
          if (processingRef.current) return;
          const pending = pendingChargeRef.current;
          if (!pending) {
            setStatus("error");
            setError(
              "Estado de pago inválido. Recarga la página e intenta de nuevo.",
            );
            return;
          }

          processingRef.current = true;
          setStatus("loading");
          checkout.close();
          void submitCharge(
            checkout.token.id,
            pending,
            deviceFingerprintId,
          );
          return;
        }

        if (checkout.error) {
          processingRef.current = false;
          setStatus("error");
          setError(
            checkout.error.user_message ||
              checkout.error.merchant_message ||
              "No se pudo procesar el pago",
          );
          checkout.close();
        }
      };

      checkout.open();
      setStatus("idle");
    } catch (err) {
      processingRef.current = false;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;

    if (method === "paypal") {
      void submitPaypal(form);
      return;
    }
    void submitCulqi(form, method === "culqi-usd" ? "USD" : "PEN");
  }

  // Sin ninguna vía de pago disponible se deriva a coordinación directa en vez
  // de mostrar un formulario que fallaría al enviarse.
  if (methods.length === 0) {
    return (
      <div className="surface-card p-6 md:p-8">
        <div className="rounded-xl bg-cream p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Te estás inscribiendo en
          </p>
          <p className="mt-1 font-semibold text-navy">{courseTitle}</p>
          <p className="course-price mt-1 text-2xl">
            {formatPrice(coursePrice, courseCurrency)}
          </p>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-gray-600">
          La inscripción a este curso se coordina de forma directa con nuestro
          equipo, que te confirmará el cupo y las formas de pago disponibles.
        </p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:bg-[#1ebe5d]"
          >
            Coordinar por WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      {CULQI_ENABLED && (
        <>
          <Script
            src="https://js.culqi.com/checkout-js"
            strategy="afterInteractive"
            onError={() => {
              setStatus("error");
              setError(
                "No se pudo cargar el sistema de pago. Revisa tu conexión y recarga.",
              );
            }}
          />
          <Script
            src="https://3ds.culqi.com"
            strategy="afterInteractive"
            onError={() => {
              setStatus("error");
              setError(
                "No se pudo cargar la validación bancaria. Recarga la página.",
              );
            }}
          />
        </>
      )}
      <form onSubmit={onSubmit} className="surface-card space-y-4 p-6 md:p-8">
        <div className="rounded-xl bg-cream p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Te estás inscribiendo en
          </p>
          <p className="mt-1 font-semibold text-navy">{courseTitle}</p>
          <p className="course-price mt-1 text-2xl">{displayAmount}</p>
          {isUsd && usdAvailable && (
            <p className="mt-1 text-xs text-gray-500">
              Tarifa internacional · equivale a{" "}
              {formatPrice(coursePrice, courseCurrency)} en Perú
            </p>
          )}
        </div>

        {/* Selector de método de pago */}
        {methods.length > 1 && (
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold text-navy">
              ¿Cómo quieres pagar?
            </legend>
            {methods.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-pink bg-pink-light"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-pink" : "border-gray-300"
                    }`}
                  >
                    {active && (
                      <span className="h-2.5 w-2.5 rounded-full bg-pink" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-navy">
                      {m.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {m.detail}
                    </span>
                  </span>
                </button>
              );
            })}
          </fieldset>
        )}

        <input
          name="guestName"
          required
          minLength={2}
          maxLength={120}
          placeholder="Nombre completo"
          className={inputClass}
        />
        <input
          name="guestEmail"
          type="email"
          required
          pattern={EMAIL_PATTERN}
          placeholder="Correo electrónico"
          className={inputClass}
        />
        <input
          name="guestPhone"
          required
          minLength={7}
          maxLength={20}
          placeholder="Teléfono / WhatsApp (con código de país)"
          className={inputClass}
        />
        {isPaypal && (
          <input
            name="country"
            maxLength={60}
            placeholder="País de residencia (opcional)"
            className={inputClass}
          />
        )}
        <textarea
          name="notes"
          placeholder="Notas o consultas (opcional)"
          maxLength={500}
          className={`min-h-24 ${inputClass}`}
        />

        <MarketingOptIn description="Novedades de nuestros programas, nuevas ediciones y recursos para tu práctica profesional." />

        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full justify-center disabled:opacity-60 ${
            isPaypal
              ? "inline-flex items-center gap-2 rounded-full bg-[#0070BA] px-6 py-3 font-semibold text-white transition hover:bg-[#005c99]"
              : "btn-primary"
          }`}
        >
          {status === "loading"
            ? "Procesando..."
            : isPaypal
              ? "Continuar a PayPal"
              : "Pagar e inscribirme"}
        </button>

        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {isPaypal ? (
          <p className="text-center text-xs leading-relaxed text-gray-400">
            Te llevaremos a PayPal para completar el pago. Tu cupo queda
            confirmado cuando verifiquemos la transferencia.
          </p>
        ) : (
          <p className="text-center text-xs text-gray-400">
            Pago seguro procesado por Culqi.{" "}
            {method === "culqi-pen"
              ? "Aceptamos tarjetas y Yape."
              : "Aceptamos tarjetas internacionales."}
          </p>
        )}
      </form>
    </>
  );
}
