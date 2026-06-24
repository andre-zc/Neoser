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
  triggerEvent: z.string().optional(),
  payload: z.object({
    uid: z.string().min(1),
    title: z.string().optional(),
    status: z.string().optional(),
    // Cal manda fechas con offset de zona (ej. "...-05:00") en eventos con
    // timezone America/Lima; z.string() (no .datetime()) las acepta tal cual.
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    // Cal puede mandar eventTypeId como number o string segun la version.
    eventTypeId: z.coerce.number().int().optional(),
    // email no estricto: Cal a veces incluye formatos que .email() rechaza.
    responses: z.record(z.string(), z.unknown()).optional(),
    attendees: z
      .array(
        z.object({
          name: z.string().optional(),
          email: z.string().optional(),
          phoneNumber: z.string().optional(),
        }),
      )
      .optional(),
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

export const izipayWebhookSchema = z.object({
  transactionId: z.string().min(1),
  status: z.enum(["AUTHORIZED", "REFUSED", "CANCELLED", "PENDING", "REFUNDED"]),
  orderReference: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(3),
  metadata: z.object({
    courseId: z.string().uuid(),
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string().min(7),
    notes: z.string().optional(),
    utmSource: z.string().optional(),
  }),
  raw: z.record(z.string(), z.unknown()).optional(),
});
