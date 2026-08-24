// API: https://developers.brevo.com/reference/createcontact
// Reusamos EMAIL_API_KEY (misma key que usa email.ts para envíos transaccionales).

const BREVO_BASE_URL = "https://api.brevo.com/v3";

type BrevoContactInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  attributes?: Record<string, string | number | boolean>;
  listIds: number[];
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "NeoSer" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) ?? "NeoSer",
  };
}

// Brevo SMS field requires E.164 format (e.g. +51999999000). Normalizamos
// número peruano de 9 dígitos al prefijo +51. Si no se puede normalizar,
// devolvemos null y se omite el campo SMS (no rompe el sync).
function normalizePhoneE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9) return `+51${digits}`;
  if (digits.length === 11 && digits.startsWith("51")) return `+${digits}`;
  if (digits.length === 12 && digits.startsWith("051")) return `+${digits.slice(1)}`;
  if (phone.trim().startsWith("+") && digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

async function postBrevoContact(apiKey: string, body: Record<string, unknown>) {
  const response = await fetch(`${BREVO_BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const ok = response.ok || response.status === 204;
  return { ok, status: response.status, details: ok ? "" : await response.text() };
}

// Brevo exige que SMS sea único entre contactos. Se detecta ese caso concreto
// (no cualquier 400) para no enmascarar otros errores de la API.
function isDuplicateSmsError(result: { status: number; details: string }) {
  if (result.status !== 400) return false;
  const d = result.details.toLowerCase();
  return (
    d.includes("sms") &&
    (d.includes("duplicate_parameter") || d.includes("already associated"))
  );
}

export async function upsertBrevoContact(input: BrevoContactInput) {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) return { skipped: true as const, reason: "no_api_key" };
  if (!input.email) return { skipped: true as const, reason: "no_email" };
  if (input.listIds.length === 0)
    return { skipped: true as const, reason: "no_list_ids" };

  const normalizedPhone = input.phone ? normalizePhoneE164(input.phone) : null;

  // Los nombres de atributo deben existir en la cuenta de Brevo: los que no
  // existen se descartan EN SILENCIO, la API responde 201 igual. Esta cuenta
  // usa NOMBRE/APELLIDOS (los de la interfaz en español), no FIRSTNAME/LASTNAME.
  const attributes: Record<string, string | number | boolean> = {
    ...(input.firstName ? { NOMBRE: input.firstName } : {}),
    ...(input.lastName ? { APELLIDOS: input.lastName } : {}),
    // Teléfono crudo como texto: visible en la UI y sin la validación de
    // unicidad que Brevo impone al campo SMS.
    ...(input.phone ? { TELEFONO: input.phone } : {}),
    ...(input.attributes ?? {}),
  };

  const base = {
    email: input.email,
    listIds: input.listIds,
    updateEnabled: true, // si ya existe, actualiza en vez de error
  };

  // SMS solo si pudimos normalizar a E.164 (Brevo lo valida estrictamente).
  let result = await postBrevoContact(apiKey, {
    ...base,
    attributes: normalizedPhone
      ? { ...attributes, SMS: normalizedPhone }
      : attributes,
  });

  // Dos personas con el mismo teléfono — o alguien que reenvía el formulario
  // corrigiendo su correo — hacían fallar el alta entera y el contacto se
  // perdía sin rastro. Se reintenta sin SMS: el número igual queda en TELEFONO.
  if (!result.ok && normalizedPhone && isDuplicateSmsError(result)) {
    console.warn(
      `Brevo: el teléfono ${normalizedPhone} ya pertenece a otro contacto; ` +
        `se registra ${input.email} sin el campo SMS.`,
    );
    result = await postBrevoContact(apiKey, { ...base, attributes });
  }

  if (!result.ok) {
    throw new Error(
      `Brevo upsertContact failed: ${result.status} ${result.details}`,
    );
  }

  return { skipped: false as const, ok: true as const, status: result.status };
}

// Helpers de conveniencia para los 3 casos de uso:

export async function syncLeadToBrevo(input: {
  email: string;
  fullName: string;
  phone: string;
  source: string;
  serviceInterest?: string;
  /** Opt-in comercial. Permite segmentar campañas en Brevo sin escribir a
   *  quienes solo dieron consentimiento transaccional. */
  marketingConsent?: boolean;
}) {
  const listId = Number(process.env.BREVO_LIST_LEADS);
  if (!listId) return { skipped: true as const, reason: "no_list_env" };

  const { firstName, lastName } = splitName(input.fullName);
  return upsertBrevoContact({
    email: input.email,
    firstName,
    lastName,
    phone: input.phone,
    attributes: {
      SOURCE: input.source,
      MARKETING_OPTIN: Boolean(input.marketingConsent),
      ...(input.serviceInterest ? { SERVICE_INTEREST: input.serviceInterest } : {}),
    },
    listIds: [listId],
  });
}

export async function syncEnrollmentToBrevo(input: {
  email: string;
  fullName: string;
  phone: string;
  courseName: string;
  amount: number;
  marketingConsent?: boolean;
}) {
  const listId = Number(process.env.BREVO_LIST_ENROLLMENTS);
  if (!listId) return { skipped: true as const, reason: "no_list_env" };

  const { firstName, lastName } = splitName(input.fullName);
  return upsertBrevoContact({
    email: input.email,
    firstName,
    lastName,
    phone: input.phone,
    attributes: {
      COURSE_NAME: input.courseName,
      AMOUNT_PAID: input.amount,
      MARKETING_OPTIN: Boolean(input.marketingConsent),
    },
    listIds: [listId],
  });
}

export async function syncBookingToBrevo(input: {
  email: string;
  fullName: string;
  phone: string;
  bookingId: string;
  serviceInterest?: string;
}) {
  const listId = Number(process.env.BREVO_LIST_BOOKINGS);
  if (!listId) return { skipped: true as const, reason: "no_list_env" };

  const { firstName, lastName } = splitName(input.fullName);
  return upsertBrevoContact({
    email: input.email,
    firstName,
    lastName,
    phone: input.phone,
    attributes: {
      BOOKING_ID: input.bookingId,
      ...(input.serviceInterest ? { SERVICE_INTEREST: input.serviceInterest } : {}),
    },
    listIds: [listId],
  });
}
