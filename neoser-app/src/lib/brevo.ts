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

export async function upsertBrevoContact(input: BrevoContactInput) {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) return { skipped: true as const, reason: "no_api_key" };
  if (!input.email) return { skipped: true as const, reason: "no_email" };
  if (input.listIds.length === 0)
    return { skipped: true as const, reason: "no_list_ids" };

  const normalizedPhone = input.phone ? normalizePhoneE164(input.phone) : null;

  const body = {
    email: input.email,
    attributes: {
      ...(input.firstName ? { FIRSTNAME: input.firstName } : {}),
      ...(input.lastName ? { LASTNAME: input.lastName } : {}),
      // SMS solo si pudimos normalizar a E.164 (Brevo lo valida estrictamente)
      ...(normalizedPhone ? { SMS: normalizedPhone } : {}),
      // Guardamos el teléfono crudo como atributo custom (visible en UI sin validación)
      ...(input.phone ? { TELEFONO: input.phone } : {}),
      ...(input.attributes ?? {}),
    },
    listIds: input.listIds,
    updateEnabled: true, // si ya existe, actualiza en vez de error
  };

  const response = await fetch(`${BREVO_BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok && response.status !== 204) {
    const details = await response.text();
    throw new Error(`Brevo upsertContact failed: ${response.status} ${details}`);
  }

  return { skipped: false as const, ok: true as const, status: response.status };
}

// Helpers de conveniencia para los 3 casos de uso:

export async function syncLeadToBrevo(input: {
  email: string;
  fullName: string;
  phone: string;
  source: string;
  serviceInterest?: string;
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
