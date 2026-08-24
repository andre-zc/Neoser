import { LEGAL } from "@/lib/legal";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

function getEmailProvider() {
  return (process.env.EMAIL_PROVIDER || "hubspot").toLowerCase();
}

function getEmailApiKey() {
  return process.env.EMAIL_API_KEY;
}

function getEmailFrom() {
  // El remitente debe estar verificado en Brevo o el envio se rechaza; el de
  // respaldo es el mismo que hay configurado en EMAIL_FROM.
  return process.env.EMAIL_FROM || "neoser.admin@gmail.com";
}

async function sendViaBrevo(input: SendEmailInput) {
  const apiKey = getEmailApiKey();
  if (!apiKey) {
    throw new Error("EMAIL_API_KEY is missing for Brevo");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { email: getEmailFrom(), name: "NeoSer" },
      to: [{ email: input.to }],
      subject: input.subject,
      htmlContent: input.html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo send failed: ${details}`);
  }

  return response.json().catch(() => ({ ok: true }));
}

async function sendViaHubspot(input: SendEmailInput) {
  // HubSpot puede requerir config de transactional/marketing API fuera del MVP tecnico.
  // Se retorna "queued" para mantener flujo de automatizacion y auditoria de eventos.
  return {
    queued: true,
    provider: "hubspot",
    to: input.to,
  };
}

export async function sendEmail(input: SendEmailInput) {
  const provider = getEmailProvider();

  if (provider === "brevo") {
    const data = await sendViaBrevo(input);
    return { provider, status: "sent" as const, data };
  }

  const data = await sendViaHubspot(input);
  return { provider: "hubspot", status: "queued" as const, data };
}

type EnrollmentEmailInput = {
  guestName: string;
  courseTitle: string;
  amount: number;
  currency: string;
  orderReference: string;
};

function formatPrice(amount: number, currency: string) {
  if (currency === "PEN") {
    return `S/. ${Number(amount).toLocaleString("es-PE")}`;
  }
  return `${currency} ${Number(amount).toLocaleString("es-PE")}`;
}

export function buildEnrollmentConfirmationEmail(input: EnrollmentEmailInput) {
  const subject = `Inscripción confirmada — ${input.courseTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #FFF8F2; padding: 32px;">
      <div style="background: #FFFFFF; border-radius: 16px; padding: 32px;">
        <h1 style="color: #1F2A44; font-size: 22px; margin: 0 0 16px;">¡Gracias por inscribirte, ${input.guestName}!</h1>
        <p style="color: #4A5568; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Tu pago fue confirmado y tu lugar en <strong>${input.courseTitle}</strong> está reservado.
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1F2A44;">
          <tr>
            <td style="padding: 8px 0; color: #718096;">Curso</td>
            <td style="padding: 8px 0; text-align: right;"><strong>${input.courseTitle}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;">Monto pagado</td>
            <td style="padding: 8px 0; text-align: right;"><strong>${formatPrice(input.amount, input.currency)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;">Orden</td>
            <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${input.orderReference}</td>
          </tr>
        </table>
        <p style="color: #4A5568; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
          En las próximas 24 horas te contactaremos por WhatsApp para coordinar el inicio y enviarte el material.
        </p>
        <p style="color: #4A5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0;">
          Si tienes alguna duda, escríbenos a <a href="mailto:${LEGAL.email}" style="color: #E89BAB;">${LEGAL.email}</a>.
        </p>
      </div>
      <p style="color: #A0AEC0; font-size: 12px; text-align: center; margin: 24px 0 0;">
        NeoSer — Maternidad y Medicina Humanizada · Chiclayo, Perú
      </p>
    </div>
  `.trim();

  return { subject, html };
}

type PaypalPendingInput = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  courseTitle: string;
  amountUsd: number;
  reference: string;
  country?: string;
  paypalUrl: string;
};

/**
 * Correo INTERNO para NeoSer: alguien inició un pago internacional por PayPal.
 * Es la pieza clave del flujo manual — sin esto Diana vería un ingreso en
 * PayPal sin saber de quién es ni a qué curso corresponde.
 */
export function buildPaypalPendingInternalEmail(input: PaypalPendingInput) {
  const subject = `PAGO PENDIENTE (PayPal ${input.reference}) — ${input.guestName} · ${input.courseTitle}`;
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 8px 0; color: #718096; vertical-align: top; width: 38%;">${label}</td>
      <td style="padding: 8px 0; color: #1F2A44; font-weight: 600;">${value}</td>
    </tr>`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #FFF8F2; padding: 32px;">
      <div style="background: #FFFFFF; border-radius: 16px; padding: 32px;">
        <div style="background:#FFF4E5;border-left:4px solid #F0A020;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
          <p style="margin:0;color:#8A5A00;font-size:14px;font-weight:bold;">Falta verificar el pago en PayPal</p>
          <p style="margin:6px 0 0;color:#8A5A00;font-size:13px;line-height:1.5;">
            Esta persona llenó el formulario y fue enviada a PayPal. PayPal no nos
            avisa si pagó: revisa tu cuenta y confirma la inscripción.
          </p>
        </div>
        <h1 style="color: #1F2A44; font-size: 20px; margin: 0 0 16px;">Nueva inscripción internacional</h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${row("Referencia", input.reference)}
          ${row("Nombre", input.guestName)}
          ${row("Curso", input.courseTitle)}
          ${row("Monto esperado", `USD ${input.amountUsd}`)}
          ${row("Correo", input.guestEmail)}
          ${row("WhatsApp / teléfono", input.guestPhone)}
          ${input.country ? row("País", input.country) : ""}
        </table>
        <p style="color:#4A5568;font-size:13px;line-height:1.6;margin:20px 0 0;">
          Cuando confirmes el pago en PayPal, marca la inscripción como pagada en
          Supabase y mueve el negocio en HubSpot a «Cierre ganado».
        </p>
      </div>
    </div>
  `.trim();

  return { subject, html };
}

/**
 * Correo al cliente con las instrucciones para completar el pago internacional.
 * Incluye la referencia para que podamos cruzar su pago con su inscripción.
 */
export function buildPaypalInstructionsEmail(input: PaypalPendingInput) {
  const subject = `Completa tu pago — ${input.courseTitle} (ref. ${input.reference})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #FFF8F2; padding: 32px;">
      <div style="background: #FFFFFF; border-radius: 16px; padding: 32px;">
        <h1 style="color: #1F2A44; font-size: 22px; margin: 0 0 16px;">¡Hola ${input.guestName}!</h1>
        <p style="color: #4A5568; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          Recibimos tu solicitud de inscripción a <strong>${input.courseTitle}</strong>.
          Para reservar tu cupo solo falta completar el pago.
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1F2A44; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #718096;">Monto</td>
            <td style="padding: 8px 0; text-align: right;"><strong>USD ${input.amountUsd}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;">Tu referencia</td>
            <td style="padding: 8px 0; text-align: right;"><strong>${input.reference}</strong></td>
          </tr>
        </table>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${input.paypalUrl}" style="display:inline-block;background:#0070BA;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 32px;border-radius:999px;">
            Pagar con PayPal
          </a>
        </div>
        <div style="background:#FFF8F2;border-radius:12px;padding:16px 20px;">
          <p style="margin:0 0 8px;color:#1F2A44;font-size:14px;font-weight:bold;">Importante</p>
          <p style="margin:0;color:#4A5568;font-size:13px;line-height:1.6;">
            Al pagar, escribe tu referencia <strong>${input.reference}</strong> en la nota de PayPal.
            Cuando termines, envíanos el comprobante por WhatsApp para confirmar tu cupo:
            confirmamos tu inscripción apenas verifiquemos el pago.
          </p>
        </div>
        <p style="color: #4A5568; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
          Si tienes cualquier duda, respóndenos este correo o escríbenos a
          <a href="mailto:dsilva@neoserperu.com" style="color: #E89BAB;">dsilva@neoserperu.com</a>.
        </p>
      </div>
      <p style="color: #A0AEC0; font-size: 12px; text-align: center; margin: 24px 0 0;">
        NeoSer — Maternidad y Medicina Humanizada · Chiclayo, Perú
      </p>
    </div>
  `.trim();

  return { subject, html };
}

type CoordinationNotificationInput = {
  fullName: string;
  institution: string;
  position: string;
  email: string;
  phone: string;
  reason: string;
  description: string;
  createdAt: string;
};

// Email INTERNO al equipo NeoSer cuando llega una solicitud de coordinación.
export function buildCoordinationNotificationEmail(
  input: CoordinationNotificationInput,
) {
  const subject = `Nueva solicitud de coordinación — ${input.institution}`;
  const fecha = new Date(input.createdAt).toLocaleString("es-PE", {
    timeZone: "America/Lima",
  });
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 8px 0; color: #718096; vertical-align: top; width: 38%;">${label}</td>
      <td style="padding: 8px 0; color: #1F2A44; font-weight: 600;">${value}</td>
    </tr>`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #FFF8F2; padding: 32px;">
      <div style="background: #FFFFFF; border-radius: 16px; padding: 32px;">
        <h1 style="color: #1F2A44; font-size: 20px; margin: 0 0 8px;">Nueva solicitud de coordinación</h1>
        <p style="color: #4A5568; font-size: 14px; margin: 0 0 20px;">
          Recibida desde el sitio web. Gestiona el seguimiento en HubSpot.
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${row("Nombres y apellidos", input.fullName)}
          ${row("Institución", input.institution)}
          ${row("Cargo", input.position)}
          ${row("Correo", input.email)}
          ${row("Teléfono", input.phone)}
          ${row("Motivo", input.reason)}
          ${row("Fecha de registro", fecha)}
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #FFF8F2; border-radius: 12px;">
          <p style="color: #718096; font-size: 13px; margin: 0 0 6px;">Descripción de la solicitud</p>
          <p style="color: #1F2A44; font-size: 14px; line-height: 1.6; margin: 0;">${input.description}</p>
        </div>
      </div>
    </div>
  `.trim();

  return { subject, html };
}


type ComplaintEmailInput = {
  correlativo: number;
  fullName: string;
  documentType: string;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  itemType: string;
  itemDescription: string;
  claimedAmount?: number | null;
  complaintType: string;
  detail: string;
  consumerRequest: string;
  createdAt: string;
  plazoDias: number;
};

function complaintRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 8px 0; color: #718096; vertical-align: top; width: 40%;">${label}</td>
      <td style="padding: 8px 0; color: #1F2A44; font-weight: 600;">${value}</td>
    </tr>`;
}

/**
 * Constancia para el consumidor de que su Hoja de Reclamación fue registrada.
 * El Reglamento del Libro de Reclamaciones exige dejar constancia del reclamo
 * y del plazo de respuesta.
 */
export function buildComplaintAckEmail(input: ComplaintEmailInput) {
  const tipo = input.complaintType === "queja" ? "queja" : "reclamo";
  const subject = `Constancia de ${tipo} N.º ${input.correlativo} — NeoSer`;
  const fecha = new Date(input.createdAt).toLocaleString("es-PE", {
    timeZone: "America/Lima",
  });
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #FFF8F2; padding: 32px;">
      <div style="background: #FFFFFF; border-radius: 16px; padding: 32px;">
        <h1 style="color: #1F2A44; font-size: 20px; margin: 0 0 8px;">Recibimos tu ${tipo}</h1>
        <p style="color: #4A5568; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          Hola ${input.fullName}, dejamos constancia de que tu ${tipo} fue
          registrado en nuestro Libro de Reclamaciones.
        </p>
        <div style="background:#FFF8F2;border-radius:12px;padding:16px 20px;margin-bottom:20px;text-align:center;">
          <p style="margin:0;color:#718096;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Número de hoja</p>
          <p style="margin:4px 0 0;color:#1F2A44;font-size:24px;font-weight:bold;">N.º ${input.correlativo}</p>
          <p style="margin:6px 0 0;color:#718096;font-size:12px;">${fecha}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${complaintRow("Tipo", tipo === "queja" ? "Queja (atención)" : "Reclamo (producto o servicio)")}
          ${complaintRow("Bien contratado", input.itemDescription)}
          ${complaintRow("Tu pedido", input.consumerRequest)}
        </table>
        <p style="color:#4A5568;font-size:13px;line-height:1.6;margin:20px 0 0;">
          Daremos respuesta en un plazo máximo de <strong>${input.plazoDias} días hábiles</strong>,
          conforme al Código de Protección y Defensa del Consumidor (Ley 29571).
        </p>
        <p style="color:#718096;font-size:12px;line-height:1.6;margin:16px 0 0;">
          Conserva este correo como constancia. Si necesitas agregar información,
          respóndelo indicando el número de hoja.
        </p>
      </div>
      <p style="color: #A0AEC0; font-size: 12px; text-align: center; margin: 24px 0 0;">
        NeoSer — Maternidad y Medicina Humanizada · Chiclayo, Perú
      </p>
    </div>
  `.trim();

  return { subject, html };
}

/** Aviso interno con la hoja completa, para que NeoSer pueda responder a tiempo. */
export function buildComplaintInternalEmail(input: ComplaintEmailInput) {
  const tipo = input.complaintType === "queja" ? "QUEJA" : "RECLAMO";
  const subject = `[${tipo} N.º ${input.correlativo}] ${input.fullName} — responder en ${input.plazoDias} días hábiles`;
  const fecha = new Date(input.createdAt).toLocaleString("es-PE", {
    timeZone: "America/Lima",
  });
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #FFF8F2; padding: 32px;">
      <div style="background: #FFFFFF; border-radius: 16px; padding: 32px;">
        <div style="background:#FDECEC;border-left:4px solid #D64545;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
          <p style="margin:0;color:#8A2020;font-size:14px;font-weight:bold;">
            Plazo legal: ${input.plazoDias} días hábiles para responder
          </p>
          <p style="margin:6px 0 0;color:#8A2020;font-size:13px;line-height:1.5;">
            Registrado el ${fecha}. El incumplimiento del plazo es infracción
            sancionable por INDECOPI.
          </p>
        </div>
        <h1 style="color: #1F2A44; font-size: 20px; margin: 0 0 16px;">
          ${tipo} N.º ${input.correlativo}
        </h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${complaintRow("Consumidor", input.fullName)}
          ${complaintRow("Documento", `${input.documentType} ${input.documentNumber}`)}
          ${complaintRow("Domicilio", input.address)}
          ${complaintRow("Teléfono", input.phone)}
          ${complaintRow("Correo", input.email)}
          ${complaintRow("Tipo de bien", input.itemType)}
          ${complaintRow("Descripción del bien", input.itemDescription)}
          ${complaintRow("Monto reclamado", input.claimedAmount ? `S/ ${input.claimedAmount}` : "No indica")}
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #FFF8F2; border-radius: 12px;">
          <p style="color: #718096; font-size: 13px; margin: 0 0 6px;">Detalle</p>
          <p style="color: #1F2A44; font-size: 14px; line-height: 1.6; margin: 0;">${input.detail}</p>
        </div>
        <div style="margin-top: 12px; padding: 16px; background: #FFF8F2; border-radius: 12px;">
          <p style="color: #718096; font-size: 13px; margin: 0 0 6px;">Pedido del consumidor</p>
          <p style="color: #1F2A44; font-size: 14px; line-height: 1.6; margin: 0;">${input.consumerRequest}</p>
        </div>
      </div>
    </div>
  `.trim();

  return { subject, html };
}
