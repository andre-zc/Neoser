import { z } from "zod";

export const leadSourceSchema = z.enum([
  "meta_ads",
  "google_ads",
  "instagram_organico",
  "referida",
  "web",
  "otro",
]);

export const contactLeadSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7).max(20),
  message: z.string().min(5).max(2000),
  source: leadSourceSchema.default("web"),
  waConsent: z.boolean(),
  gestationWeeks: z.number().int().min(0).max(45).optional(),
  serviceInterest: z.string().min(3).max(120).optional(),
  expectedDueDate: z.string().date().optional(),
});

export const enrollmentSchema = z.object({
  courseId: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

// CRM schemas
export const leadStatusSchema = z.enum([
  "nuevo",
  "contactado",
  "interesado",
  "propuesta_enviada",
  "inscrito",
  "perdido",
]);

export const updateLeadSchema = z.object({
  leadStatus: leadStatusSchema.optional(),
  nextFollowupAt: z.string().datetime().nullable().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
});

export const createLeadNoteSchema = z.object({
  leadId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "rescheduled",
]);

export const createBookingSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7).max(20),
  preferredDate: z.string().date().optional(),
  preferredTime: z.string().max(40).optional(),
  serviceInterest: z.string().min(3).max(120).optional(),
  source: leadSourceSchema.default("web"),
  notes: z.string().max(2000).optional(),
});

export const calBookingWebhookSchema = z.object({
  // .nullish() = acepta null Y undefined. Cal.com manda varios campos como
  // null explícito (title, status, endTime, etc.), y .optional() solo acepta
  // undefined → causaba 400 "expected string, received null".
  triggerEvent: z.string().nullish(),
  payload: z.object({
    uid: z.string().min(1),
    title: z.string().nullish(),
    status: z.string().nullish(),
    // Cal manda fechas con offset de zona (ej. "...-05:00") en eventos con
    // timezone America/Lima; z.string() (no .datetime()) las acepta tal cual.
    startTime: z.string().nullish(),
    endTime: z.string().nullish(),
    // Cal puede mandar eventTypeId como number o string segun la version.
    eventTypeId: z.coerce.number().int().nullish(),
    // email no estricto: Cal a veces incluye formatos que .email() rechaza.
    responses: z.record(z.string(), z.unknown()).nullish(),
    attendees: z
      .array(
        z.object({
          name: z.string().nullish(),
          email: z.string().nullish(),
          phoneNumber: z.string().nullish(),
        }),
      )
      .nullish(),
  }),
});

export const sendEmailAutomationSchema = z.object({
  to: z.string().email(),
  templateKey: z.string().min(3).max(120),
  leadId: z.string().uuid().optional(),
  bookingId: z.string().uuid().optional(),
  variables: z.record(z.string(), z.string()).optional(),
});

export const createPaymentIntentSchema = z.object({
  courseId: z.string().uuid(),
  leadId: z.string().uuid().optional(),
});

// ============================================
// Plataforma de cursos — guest enrollment + payment
// ============================================

export const guestEnrollmentSchema = z.object({
  courseId: z.string().uuid(),
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7).max(20),
  notes: z.string().max(500).optional(),
  utmSource: z.string().max(80).optional(),
});

// ============================================
// Culqi — frontend -> /api/payments/culqi/charge
// ============================================

// Lo que el componente del checkout manda al backend tras tokenizar.
// El monto NO se manda: el backend lo lee de la tabla `courses` para evitar
// manipulacion del precio desde el cliente.
export const culqiChargeRequestSchema = z.object({
  courseId: z.string().uuid(),
  // Token emitido por Custom Checkout. Formato: tkn_test_xxx | tkn_live_xxx.
  token: z.string().min(8).max(80),
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7).max(20),
  notes: z.string().max(500).optional(),
  utmSource: z.string().max(80).optional(),
});

// ============================================
// Culqi — webhook payload (estructura minima)
// ============================================

// Culqi puede mandar campos adicionales segun el evento; usamos passthrough
// para no rechazar payloads validos por campos extra.
export const culqiWebhookSchema = z.object({
  id: z.string().min(1), // evt_xxx
  type: z.string().min(1), // 'charge.creation.succeeded' | 'charge.creation.failed' | 'refund.creation.succeeded' | ...
  data: z
    .object({
      id: z.string().min(1), // chr_xxx
      object: z.string().optional(),
      amount: z.number().int().optional(),
      currency_code: z.string().optional(),
      email: z.string().optional(),
      outcome: z
        .object({
          type: z.string().optional(),
          user_message: z.string().optional(),
        })
        .partial()
        .optional(),
      source: z
        .object({
          type: z.string().optional(),
        })
        .partial()
        .optional(),
      metadata: z.record(z.string(), z.string()).optional(),
    })
    .passthrough(),
});

