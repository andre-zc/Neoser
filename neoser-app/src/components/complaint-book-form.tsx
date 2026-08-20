"use client";

/**
 * Hoja de Reclamación — formulario integrado del Libro de Reclamaciones.
 *
 * Sigue el formato oficial del Reglamento del Libro de Reclamaciones:
 *   1. Identificación del consumidor (con tutor si es menor de edad)
 *   2. Identificación del bien contratado
 *   3. Detalle de la reclamación (reclamo vs. queja) y pedido
 *
 * Todo se guarda en nuestra base de datos: Culqi rechaza los comercios cuyo
 * libro depende de formularios o archivos externos.
 */

import { FormEvent, useState } from "react";
import { LEGAL, PLAZO_RECLAMO_DIAS_HABILES } from "@/lib/legal";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20";
const labelClass = "mb-1.5 block text-sm font-medium text-navy";

export function ComplaintBookForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    "idle",
  );
  const [error, setError] = useState("");
  const [correlativo, setCorrelativo] = useState<number | null>(null);
  const [isMinor, setIsMinor] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");

    const fd = new FormData(form);
    const rawAmount = String(fd.get("claimedAmount") || "").trim();

    const payload = {
      fullName: String(fd.get("fullName") || "").trim(),
      documentType: String(fd.get("documentType") || "DNI"),
      documentNumber: String(fd.get("documentNumber") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      isMinor,
      guardianName: String(fd.get("guardianName") || "").trim() || undefined,
      itemType: String(fd.get("itemType") || "servicio"),
      itemDescription: String(fd.get("itemDescription") || "").trim(),
      claimedAmount: rawAmount ? Number(rawAmount) : undefined,
      complaintType: String(fd.get("complaintType") || "reclamo"),
      detail: String(fd.get("detail") || "").trim(),
      consumerRequest: String(fd.get("consumerRequest") || "").trim(),
    };

    try {
      const res = await fetch("/api/complaint-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "No se pudo registrar la hoja");
      }

      setCorrelativo(json.correlativo ?? null);
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  if (status === "done") {
    return (
      <div className="surface-card p-8 text-center md:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-navy">
          Hoja de reclamación registrada
        </h2>
        {correlativo !== null && (
          <p className="mx-auto mb-4 inline-block rounded-xl bg-cream px-6 py-3">
            <span className="block text-xs uppercase tracking-wide text-gray-400">
              Número de hoja
            </span>
            <span className="text-2xl font-bold text-navy">N.º {correlativo}</span>
          </p>
        )}
        <p className="mx-auto max-w-md leading-relaxed text-gray-600">
          Te enviamos una constancia al correo registrado. Daremos respuesta en
          un plazo máximo de{" "}
          <strong className="text-navy">
            {PLAZO_RECLAMO_DIAS_HABILES} días hábiles
          </strong>
          , conforme a la Ley 29571.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-8 p-6 md:p-10">
      {/* 1. Consumidor */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-navy">
          1. Identificación del consumidor
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          Todos los campos de esta sección son obligatorios.
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Nombres y apellidos *
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              minLength={2}
              maxLength={160}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="documentType">
                Tipo de documento *
              </label>
              <select
                id="documentType"
                name="documentType"
                required
                defaultValue="DNI"
                className={inputClass}
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carné de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="documentNumber">
                Número de documento *
              </label>
              <input
                id="documentNumber"
                name="documentNumber"
                required
                minLength={6}
                maxLength={20}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="address">
              Domicilio *
            </label>
            <input
              id="address"
              name="address"
              required
              minLength={5}
              maxLength={240}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="phone">
                Teléfono *
              </label>
              <input
                id="phone"
                name="phone"
                required
                minLength={7}
                maxLength={20}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">
                Correo electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={isMinor}
              onChange={(e) => setIsMinor(e.target.checked)}
              className="mt-1"
            />
            <span>El consumidor es menor de edad</span>
          </label>

          {isMinor && (
            <div>
              <label className={labelClass} htmlFor="guardianName">
                Nombre del padre, madre o tutor *
              </label>
              <input
                id="guardianName"
                name="guardianName"
                required
                maxLength={160}
                className={inputClass}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Bien contratado */}
      <section className="border-t border-gray-100 pt-8">
        <h2 className="mb-5 text-lg font-bold text-navy">
          2. Identificación del bien contratado
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="itemType">
                Tipo *
              </label>
              <select
                id="itemType"
                name="itemType"
                required
                defaultValue="servicio"
                className={inputClass}
              >
                <option value="servicio">Servicio</option>
                <option value="producto">Producto</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="claimedAmount">
                Monto reclamado (S/)
              </label>
              <input
                id="claimedAmount"
                name="claimedAmount"
                type="number"
                min={0}
                step="0.01"
                placeholder="Opcional"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="itemDescription">
              Descripción del producto o servicio *
            </label>
            <input
              id="itemDescription"
              name="itemDescription"
              required
              minLength={3}
              maxLength={500}
              placeholder="Ej. Curso de Neurobiología del Parto"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* 3. Detalle */}
      <section className="border-t border-gray-100 pt-8">
        <h2 className="mb-5 text-lg font-bold text-navy">
          3. Detalle de la reclamación
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="complaintType">
              Tipo *
            </label>
            <select
              id="complaintType"
              name="complaintType"
              required
              defaultValue="reclamo"
              className={inputClass}
            >
              <option value="reclamo">
                Reclamo — disconformidad con el producto o servicio
              </option>
              <option value="queja">
                Queja — malestar respecto a la atención
              </option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="detail">
              Detalle *
            </label>
            <textarea
              id="detail"
              name="detail"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="consumerRequest">
              Pedido del consumidor *
            </label>
            <textarea
              id="consumerRequest"
              name="consumerRequest"
              required
              minLength={5}
              maxLength={2000}
              rows={3}
              placeholder="¿Qué solución esperas?"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <div className="rounded-xl bg-cream p-5 text-xs leading-relaxed text-gray-600">
        <p className="mb-2 font-semibold text-navy">
          Proveedor: {LEGAL.razonSocial} · RUC {LEGAL.ruc}
        </p>
        <p>
          {LEGAL.direccion}. La formulación del reclamo no impide acudir a otras
          vías de solución de controversias ni es requisito previo para
          denunciar ante INDECOPI. El proveedor deberá dar respuesta en un plazo
          no mayor a {PLAZO_RECLAMO_DIAS_HABILES} días hábiles.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Enviar hoja de reclamación"}
      </button>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
