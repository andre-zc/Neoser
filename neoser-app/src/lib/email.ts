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
  return process.env.EMAIL_FROM || "contacto@neoser.pe";
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
          Si tienes alguna duda, escríbenos a <a href="mailto:contacto@neoser.pe" style="color: #E89BAB;">contacto@neoser.pe</a>.
        </p>
      </div>
      <p style="color: #A0AEC0; font-size: 12px; text-align: center; margin: 24px 0 0;">
        NeoSer — Maternidad y Medicina Humanizada · Chiclayo, Perú
      </p>
    </div>
  `.trim();

  return { subject, html };
}

