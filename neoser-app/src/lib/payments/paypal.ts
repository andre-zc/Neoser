/**
 * PayPal — pagos internacionales de cursos (PayPal.me).
 *
 * ⚠️ LIMITACIÓN CLAVE (leer antes de tocar este archivo):
 * PayPal.me es un ENLACE DE COBRO personal, no una pasarela integrada. A
 * diferencia de Culqi:
 *   - NO hay webhook ni callback: el sitio nunca se entera de si la persona pagó.
 *   - NO se puede forzar el monto: PayPal.me lo pre-llena, pero quien paga
 *     puede editarlo antes de confirmar.
 *
 * Por eso el flujo es: se registra la inscripción como PENDIENTE, se avisa a
 * NeoSer por correo, y la confirmación del pago es MANUAL (Diana verifica en
 * PayPal y marca la inscripción como pagada).
 *
 * Si en el futuro se quiere confirmación automática, hay que migrar a PayPal
 * Checkout (cuenta Business + Client ID/Secret + webhooks), no a este enlace.
 */

/** Usuario de PayPal.me de NeoSer. Configurable por si cambia la cuenta. */
export const PAYPAL_ME_USERNAME =
  process.env.NEXT_PUBLIC_PAYPAL_ME_USERNAME || "DianaSilvaMejia";

/** Moneda de los pagos internacionales. */
export const PAYPAL_CURRENCY = "USD";

export type PaypalLinkInput = {
  /** Monto a cobrar. Si es null/0, se abre PayPal.me sin monto pre-cargado. */
  amount?: number | null;
  currency?: string;
};

/**
 * Construye el enlace de PayPal.me.
 *
 * Con monto:  https://www.paypal.com/paypalme/DianaSilvaMejia/75USD
 * Sin monto:  https://www.paypal.com/paypalme/DianaSilvaMejia
 *
 * El monto va pre-cargado como conveniencia para quien paga; PayPal permite
 * editarlo, así que la verificación del importe real siempre es manual.
 */
export function buildPaypalMeUrl(input: PaypalLinkInput = {}): string {
  const base = `https://www.paypal.com/paypalme/${PAYPAL_ME_USERNAME}`;
  const amount = Number(input.amount ?? 0);
  if (!amount || amount <= 0) return base;

  const currency = (input.currency || PAYPAL_CURRENCY).toUpperCase();
  // PayPal.me acepta el formato "75USD" (sin espacios). Se usan enteros cuando
  // el monto es exacto para que el enlace quede limpio.
  const value = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${base}/${value}${currency}`;
}

/** Formatea un monto internacional para mostrarlo en la web. */
export function formatUsd(amount: number): string {
  return `USD ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Referencia interna de la inscripción, para cruzar el pago de PayPal con el
 * registro en Supabase. Se le muestra a quien paga para que la incluya en la
 * nota de PayPal / al enviar el comprobante por WhatsApp.
 */
export function buildPaypalReference(): string {
  // Formato corto y legible por teléfono: NS-XXXXXX
  const raw = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `NS-${raw}`;
}
