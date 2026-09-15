"use client";

import { Heart } from "lucide-react";

/**
 * Casilla de opt-in para comunicaciones comerciales.
 *
 * Es OPCIONAL y nace desmarcada: la Ley 29733 exige consentimiento expreso y
 * libre para fines publicitarios, y una casilla premarcada no cuenta como tal.
 *
 * Se separa a propósito del consentimiento transaccional (`waConsent`), que
 * solo habilita responder la consulta. Quien no marque esto igual recibe sus
 * correos de confirmación; simplemente no entra a las campañas.
 *
 * El tono es cálido a pedido de la clienta: debe leerse como un acompañamiento,
 * no como una cláusula legal.
 */
export function MarketingOptIn({
  name = "marketingConsent",
  title = "Autorizo el envío de capacitaciones y novedades",
  description = "Próximas ediciones, talleres y recursos útiles. Sin spam; puedes darte de baja cuando quieras.",
  required = false,
}: {
  name?: string;
  title?: string;
  description?: string;
  /** En la página de registro el opt-in es el propósito del formulario. */
  required?: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-pink/25 bg-pink-light/50 p-4 transition hover:border-pink/50 hover:bg-pink-light/80 has-[:checked]:border-pink has-[:checked]:bg-pink-light">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded"
        style={{ accentColor: "var(--pink)" }}
      />
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-bold text-navy">
          <Heart className="h-4 w-4 flex-shrink-0 text-pink" aria-hidden />
          {title}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-gray-600">
          {description}
        </span>
      </span>
    </label>
  );
}
