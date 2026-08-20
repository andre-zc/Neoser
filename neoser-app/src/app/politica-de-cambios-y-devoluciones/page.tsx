import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Cambios y Devoluciones",
  description:
    "Condiciones de cancelación, reprogramación y devolución de las inscripciones a cursos y de las citas de NeoSer.",
};

export default function DevolucionesPage() {
  return (
    <LegalShell
      title="Política de Cambios y Devoluciones"
      intro="Condiciones aplicables a la cancelación, reprogramación y devolución del pago de nuestros programas formativos y citas."
      currentPath="/politica-de-cambios-y-devoluciones"
    >
      <h2>1. Alcance</h2>
      <p>
        Esta política aplica a las inscripciones a los programas formativos
        (cursos, diplomados y talleres) y a las citas de atención agendadas a
        través del sitio web de <strong>{LEGAL.razonSocial}</strong>.
      </p>

      <h2>2. Programas formativos</h2>

      <h3>2.1 Cancelación antes del inicio</h3>
      <ul>
        <li>
          <strong>Con más de 7 días calendario</strong> de anticipación a la
          fecha de inicio: devolución del <strong>100 %</strong> del monto
          pagado.
        </li>
        <li>
          <strong>Entre 7 y 3 días calendario</strong> antes del inicio:
          devolución del <strong>50 %</strong> del monto pagado, o la opción de
          aplicar el <strong>100 %</strong> como crédito para una edición
          posterior.
        </li>
        <li>
          <strong>Con menos de 3 días calendario</strong> antes del inicio: no
          corresponde devolución, pero puedes solicitar el traslado de tu cupo a
          la siguiente edición por una única vez.
        </li>
      </ul>

      <h3>2.2 Una vez iniciado el programa</h3>
      <p>
        Iniciado el programa no corresponde la devolución del monto, dado que se
        habilita el acceso al material, a las grabaciones y al campus virtual.
        En situaciones de fuerza mayor debidamente acreditadas (por ejemplo,
        motivos de salud), NeoSer evaluará el traslado del cupo a una edición
        posterior.
      </p>

      <h3>2.3 Cambio de titular</h3>
      <p>
        Puedes solicitar el cambio de titular de la inscripción hasta{" "}
        <strong>3 días calendario</strong> antes del inicio, siempre que la
        nueva persona cumpla el perfil del programa.
      </p>

      <h2>3. Cancelación o reprogramación por parte de NeoSer</h2>
      <p>
        Si NeoSer cancela o reprograma un programa, podrás elegir libremente
        entre:
      </p>
      <ul>
        <li>La <strong>devolución íntegra</strong> del monto pagado, o</li>
        <li>
          Mantener tu cupo en la <strong>nueva fecha</strong> o en una edición
          posterior.
        </li>
      </ul>

      <h2>4. Citas de atención</h2>
      <ul>
        <li>
          Puedes <strong>reprogramar o cancelar</strong> tu cita sin costo
          avisando con al menos <strong>24 horas</strong> de anticipación, desde
          el enlace incluido en tu correo de confirmación o comunicándote con
          nosotros.
        </li>
        <li>
          Las citas agendadas a través del sitio no requieren pago anticipado,
          salvo indicación expresa.
        </li>
      </ul>

      <h2>5. Cómo solicitar una devolución</h2>
      <p>
        Escríbenos a <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> o al
        WhatsApp {LEGAL.telefono}, indicando:
      </p>
      <ul>
        <li>Nombres y apellidos de la persona inscrita.</li>
        <li>Programa o servicio contratado.</li>
        <li>Fecha del pago y medio utilizado.</li>
        <li>Motivo de la solicitud.</li>
      </ul>

      <h2>6. Plazos y forma de devolución</h2>
      <p>
        Las solicitudes se responden en un plazo máximo de{" "}
        <strong>5 días hábiles</strong>. Aprobada la devolución, esta se realiza
        por el <strong>mismo medio de pago</strong> utilizado en la compra:
      </p>
      <ul>
        <li>
          <strong>Tarjeta (Culqi):</strong> el abono depende de los plazos de tu
          banco emisor, habitualmente entre 7 y 15 días hábiles.
        </li>
        <li>
          <strong>PayPal:</strong> la devolución se realiza a la misma cuenta
          desde la que se efectuó el pago.
        </li>
      </ul>
      <p>
        Las comisiones cobradas por la pasarela de pagos o por conversión de
        moneda no son reembolsables cuando el proveedor no las reintegra.
      </p>

      <h2>7. Libro de Reclamaciones</h2>
      <p>
        Si no estás conforme con la respuesta a tu solicitud, puedes registrar
        tu reclamo en nuestro{" "}
        <a href="/libro-de-reclamaciones">Libro de Reclamaciones virtual</a>.
        Ello no impide acudir a otras vías de solución de controversias ni es
        requisito previo para denunciar ante INDECOPI.
      </p>
    </LegalShell>
  );
}
