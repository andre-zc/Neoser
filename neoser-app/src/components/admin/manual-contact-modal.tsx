"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Plus, UserPlus, X } from "lucide-react";
import {
  COUNTRY_DIAL_OPTIONS,
  normalizePhoneIdentity,
} from "@/lib/country-dial-codes";

type CourseRelationship = "interes" | "inscrito";

type ExistingContact = {
  id: string;
  full_name: string;
  phone: string;
  phone_e164: string | null;
  country_code: string | null;
};

type CourseOption = {
  id: string;
  title: string;
  slug: string;
  is_published?: boolean;
};

type Draft = {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  identityDocument: string;
  profession: string;
  workplace: string;
  serviceInterest: string;
  leadStatus: "nuevo" | "propuesta_enviada" | "inscrito";
  nextFollowupAt: string;
  waConsent: boolean;
  marketingConsent: boolean;
  note: string;
};

type ServerDuplicate = {
  id: string;
  fullName: string;
  phone: string;
};

const EMPTY_DRAFT: Draft = {
  fullName: "",
  email: "",
  phone: "",
  countryCode: "PE",
  identityDocument: "",
  profession: "",
  workplace: "",
  serviceInterest: "",
  leadStatus: "nuevo",
  nextFollowupAt: "",
  waConsent: false,
  marketingConsent: false,
  note: "",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#17345f] outline-none transition focus:border-[#e8879b] focus:ring-2 focus:ring-[#e8879b]/20";

export function ManualContactModal({
  contacts,
  courses,
  onClose,
  onSaved,
  onOpenExisting,
}: {
  contacts: ExistingContact[];
  courses: CourseOption[];
  onClose: () => void;
  onSaved: (phoneE164: string) => Promise<void>;
  onOpenExisting: (contactId: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [selectedCourses, setSelectedCourses] = useState<
    Record<string, CourseRelationship>
  >({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [serverDuplicate, setServerDuplicate] =
    useState<ServerDuplicate | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, saving]);

  const normalizedPhone = useMemo(
    () =>
      normalizePhoneIdentity(draft.phone, draft.countryCode, null)?.e164 ??
      null,
    [draft.countryCode, draft.phone],
  );

  const duplicate = useMemo(() => {
    if (!normalizedPhone) return null;
    return (
      contacts.find((contact) => {
        const existingPhone = normalizePhoneIdentity(
          contact.phone_e164 ?? contact.phone,
          contact.country_code,
          null,
        )?.e164;
        return existingPhone === normalizedPhone;
      }) ?? null
    );
  }, [contacts, normalizedPhone]);

  function updateDraft<Key extends keyof Draft>(key: Key, value: Draft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
    setServerDuplicate(null);
  }

  function toggleCourse(courseId: string, checked: boolean) {
    setSelectedCourses((current) => {
      if (checked) return { ...current, [courseId]: "interes" };
      const next = { ...current };
      delete next[courseId];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!normalizedPhone) {
      setError("Ingresa un número válido para el país seleccionado.");
      return;
    }
    if (duplicate) {
      setError("Ese número ya está registrado. Abre su ficha para actualizarla.");
      return;
    }

    setSaving(true);
    setError("");
    setServerDuplicate(null);
    try {
      const response = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          nextFollowupAt: draft.nextFollowupAt
            ? new Date(draft.nextFollowupAt).toISOString()
            : null,
          courses: Object.entries(selectedCourses).map(
            ([courseId, relationship]) => ({ courseId, relationship }),
          ),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        phoneE164?: string;
        existingContact?: ServerDuplicate;
      };
      if (response.status === 409 && payload.existingContact) {
        setServerDuplicate(payload.existingContact);
        setError(payload.error ?? "Ese número ya está registrado.");
        return;
      }
      if (!response.ok || !payload.phoneE164) {
        throw new Error(payload.error ?? "No se pudo crear el contacto.");
      }
      await onSaved(payload.phoneE164);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo crear el contacto.",
      );
    } finally {
      setSaving(false);
    }
  }

  const duplicateId = duplicate?.id ?? serverDuplicate?.id ?? null;
  const duplicateName = duplicate?.full_name ?? serverDuplicate?.fullName;
  const phoneHasEnoughDigits = draft.phone.replace(/\D/g, "").length >= 6;
  const hasEnrolledCourse = Object.values(selectedCourses).includes("inscrito");

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#102949]/60 px-4 py-6 backdrop-blur-sm sm:py-10"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-contact-title"
        className="mx-auto w-full max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#fbf7f4] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#17345f]/10 bg-white px-5 py-5 sm:px-7">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fff0f3] text-[#c95f77]">
              <UserPlus size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 id="manual-contact-title" className="font-serif text-2xl font-bold text-[#17345f]">
                Añadir contacto
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Para personas que llegaron por recomendación, llamada u otro canal externo.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar formulario"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={submit} className="p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <fieldset className="rounded-2xl border border-[#17345f]/10 bg-white p-4 sm:p-5">
                <legend className="px-2 text-sm font-bold text-[#17345f]">
                  Datos del contacto
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                    Nombres y apellidos *
                    <input
                      required
                      autoFocus
                      autoComplete="name"
                      value={draft.fullName}
                      onChange={(event) => updateDraft("fullName", event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    País del número *
                    <select
                      value={draft.countryCode}
                      onChange={(event) => updateDraft("countryCode", event.target.value)}
                      className={inputClass}
                    >
                      {COUNTRY_DIAL_OPTIONS.map((country) => (
                        <option key={country.code} value={country.code}>
                          +{country.dialCode} · {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    WhatsApp / teléfono *
                    <input
                      required
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={draft.phone}
                      onChange={(event) => updateDraft("phone", event.target.value)}
                      placeholder="932 713 071"
                      aria-describedby="manual-phone-status"
                      className={inputClass}
                    />
                  </label>
                </div>

                <div id="manual-phone-status" aria-live="polite" className="mt-3">
                  {duplicate || serverDuplicate ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      <p className="font-semibold">Este número ya pertenece a {duplicateName}.</p>
                      <p className="mt-1 text-xs text-amber-800/80">
                        No se creará otra ficha. Puedes abrir el contacto y añadir allí sus cursos o notas.
                      </p>
                      {duplicateId ? (
                        <button
                          type="button"
                          onClick={() => onOpenExisting(duplicateId)}
                          className="mt-2 font-semibold underline underline-offset-2"
                        >
                          Abrir ficha existente
                        </button>
                      ) : null}
                    </div>
                  ) : normalizedPhone ? (
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <Check size={14} aria-hidden="true" />
                      Número disponible: {normalizedPhone}
                    </p>
                  ) : phoneHasEnoughDigits ? (
                    <p className="text-xs font-semibold text-red-600">
                      Revisa el número y el país seleccionado.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      El país y el número se usan para evitar fichas repetidas.
                    </p>
                  )}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Correo electrónico
                    <input
                      type="email"
                      autoComplete="email"
                      value={draft.email}
                      onChange={(event) => updateDraft("email", event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    DNI / cédula / documento
                    <input
                      minLength={6}
                      value={draft.identityDocument}
                      onChange={(event) =>
                        updateDraft("identityDocument", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Profesión u ocupación
                    <input
                      minLength={2}
                      value={draft.profession}
                      onChange={(event) => updateDraft("profession", event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Centro laboral
                    <input
                      minLength={2}
                      value={draft.workplace}
                      onChange={(event) => updateDraft("workplace", event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                    Interés o servicio adicional
                    <input
                      minLength={2}
                      value={draft.serviceInterest}
                      onChange={(event) =>
                        updateDraft("serviceInterest", event.target.value)
                      }
                      placeholder="Ej. Consulta, taller o tema de interés"
                      className={inputClass}
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset className="rounded-2xl border border-[#17345f]/10 bg-white p-4 sm:p-5">
                <legend className="px-2 text-sm font-bold text-[#17345f]">
                  Seguimiento y permisos
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Etapa actual
                    <select
                      value={draft.leadStatus}
                      onChange={(event) =>
                        updateDraft(
                          "leadStatus",
                          event.target.value as Draft["leadStatus"],
                        )
                      }
                      className={inputClass}
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="propuesta_enviada">Propuesta enviada</option>
                      <option value="inscrito">Inscrito</option>
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Próximo seguimiento
                    <input
                      type="datetime-local"
                      value={draft.nextFollowupAt}
                      onChange={(event) =>
                        updateDraft("nextFollowupAt", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={draft.waConsent}
                      onChange={(event) => updateDraft("waConsent", event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#e8879b]"
                    />
                    <span>
                      <strong className="block text-[#17345f]">Aceptó contacto por WhatsApp</strong>
                      Marcar solo si la persona dio su consentimiento.
                    </span>
                  </label>
                  <label className="flex gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={draft.marketingConsent}
                      onChange={(event) =>
                        updateDraft("marketingConsent", event.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 accent-[#e8879b]"
                    />
                    <span>
                      <strong className="block text-[#17345f]">Aceptó mensajes comerciales</strong>
                      No se activa automáticamente por registrar la ficha.
                    </span>
                  </label>
                </div>
                <label className="mt-4 block text-xs font-semibold text-slate-600">
                  Nota interna
                  <textarea
                    rows={3}
                    value={draft.note}
                    onChange={(event) => updateDraft("note", event.target.value)}
                    placeholder="Contexto útil para el equipo, sin datos clínicos innecesarios"
                    className={inputClass}
                  />
                </label>
              </fieldset>
            </div>

            <fieldset className="h-fit rounded-2xl border border-[#17345f]/10 bg-white p-4 sm:p-5">
              <legend className="px-2 text-sm font-bold text-[#17345f]">
                Cursos e inscripciones
              </legend>
              <p className="mb-4 text-xs leading-5 text-slate-500">
                Puedes registrar varios cursos actuales o pasados. “Interés” no confirma una compra; “Inscrito” sí registra la participación en el CRM.
              </p>
              {courses.length ? (
                <div className="max-h-[510px] space-y-2 overflow-y-auto pr-1">
                  {courses.map((course) => {
                    const relationship = selectedCourses[course.id];
                    return (
                      <div
                        key={course.id}
                        className={`rounded-xl border p-3 transition ${
                          relationship
                            ? "border-[#e8879b] bg-[#fff7f8]"
                            : "border-slate-200"
                        }`}
                      >
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={Boolean(relationship)}
                            onChange={(event) =>
                              toggleCourse(course.id, event.target.checked)
                            }
                            className="mt-1 h-4 w-4 accent-[#e8879b]"
                          />
                          <span className="min-w-0 flex-1">
                            <strong className="block text-sm text-[#17345f]">
                              {course.title}
                            </strong>
                            {!course.is_published ? (
                              <span className="mt-0.5 block text-[11px] text-slate-400">
                                Curso no publicado / histórico
                              </span>
                            ) : null}
                          </span>
                        </label>
                        {relationship ? (
                          <label className="mt-3 block pl-7 text-xs font-semibold text-slate-500">
                            Relación con el curso
                            <select
                              value={relationship}
                              onChange={(event) =>
                                setSelectedCourses((current) => ({
                                  ...current,
                                  [course.id]: event.target
                                    .value as CourseRelationship,
                                }))
                              }
                              className={inputClass}
                            >
                              <option value="interes">Mostró interés</option>
                              <option value="inscrito">Ya estuvo o está inscrito</option>
                            </select>
                          </label>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                  No hay cursos disponibles para asociar.
                </p>
              )}
              <div className="mt-4 rounded-xl bg-[#eef4fb] p-3 text-xs leading-5 text-[#295a8d]">
                {Object.keys(selectedCourses).length} curso(s) seleccionado(s).
                {hasEnrolledCourse
                  ? " La ficha quedará en la etapa Inscrito."
                  : " Puedes añadir o cambiar cursos después desde la ficha."}
              </div>
            </fieldset>
          </div>

          {error ? (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <footer className="mt-6 flex flex-col-reverse gap-3 border-t border-[#17345f]/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-[#17345f]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#17345f] disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || Boolean(duplicate || serverDuplicate) || !normalizedPhone}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8879b] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d66f87] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus size={17} aria-hidden="true" />
              {saving ? "Guardando…" : "Crear contacto"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
