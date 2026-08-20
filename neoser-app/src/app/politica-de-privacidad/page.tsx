import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo NeoSer recopila, usa y protege tus datos personales, conforme a la Ley N.º 29733 de Protección de Datos Personales.",
};

export default function PrivacidadPage() {
  return (
    <LegalShell
      title="Política de Privacidad"
      intro="Cómo tratamos y protegemos tus datos personales, conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento."
      currentPath="/politica-de-privacidad"
    >
      <h2>1. Responsable del tratamiento</h2>
      <p>
        <strong>{LEGAL.razonSocial}</strong>, con RUC{" "}
        <strong>{LEGAL.ruc}</strong> y domicilio en {LEGAL.direccion}, es la
        responsable del tratamiento de los datos personales recopilados a través
        de este sitio web. Correo de contacto:{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>

      <h2>2. Datos que recopilamos</h2>
      <h3>Datos que nos proporcionas</h3>
      <ul>
        <li>
          <strong>De contacto:</strong> nombres y apellidos, correo electrónico,
          teléfono, país o ciudad de residencia.
        </li>
        <li>
          <strong>De inscripción y pago:</strong> curso o servicio de interés,
          monto y medio de pago. Los datos de tu tarjeta{" "}
          <strong>nunca son almacenados por NeoSer</strong>: los procesa
          directamente la pasarela de pagos.
        </li>
        <li>
          <strong>De agendamiento:</strong> fecha y hora elegida, motivo de
          consulta y comentarios adicionales.
        </li>
        <li>
          <strong>De identificación:</strong> tipo y número de documento y
          domicilio, únicamente cuando presentas una hoja del Libro de
          Reclamaciones.
        </li>
      </ul>

      <h3>Datos sensibles</h3>
      <p>
        Algunos formularios pueden incluir información relacionada con tu salud
        (por ejemplo, semanas de gestación o motivo de consulta). La Ley N.º
        29733 califica estos como <strong>datos sensibles</strong>. Solo los
        recopilamos cuando tú los proporcionas voluntariamente para poder
        brindarte la atención solicitada, y reciben el nivel más alto de
        protección: no se comparten con terceros con fines comerciales ni se
        utilizan para publicidad.
      </p>

      <h3>Datos recopilados automáticamente</h3>
      <p>
        Al navegar recopilamos datos técnicos y de uso (dirección IP
        aproximada, tipo de dispositivo y navegador, páginas visitadas) mediante
        herramientas de analítica, con fines estadísticos y de mejora del sitio.
      </p>

      <h2>3. Finalidades del tratamiento</h2>
      <ul>
        <li>Atender tus consultas y solicitudes de información.</li>
        <li>Gestionar reservas de citas y confirmarlas.</li>
        <li>
          Procesar inscripciones y pagos de los programas formativos, y emitir
          las constancias correspondientes.
        </li>
        <li>
          Enviarte comunicaciones sobre el servicio contratado (confirmaciones,
          recordatorios, accesos y material).
        </li>
        <li>
          Enviarte información sobre nuevos cursos y actividades,{" "}
          <strong>únicamente si diste tu consentimiento</strong>, con opción de
          darte de baja en cualquier momento.
        </li>
        <li>Atender reclamos y quejas conforme a la normativa vigente.</li>
        <li>Cumplir obligaciones legales, contables y tributarias.</li>
      </ul>

      <h2>4. Base legal</h2>
      <p>
        El tratamiento se sustenta en tu <strong>consentimiento</strong>{" "}
        (otorgado al completar los formularios), en la{" "}
        <strong>ejecución de la relación contractual</strong> cuando contratas un
        servicio, y en el <strong>cumplimiento de obligaciones legales</strong>{" "}
        aplicables a NeoSer.
      </p>

      <h2>5. Encargados y transferencia de datos</h2>
      <p>
        Para operar el sitio y prestar nuestros servicios utilizamos proveedores
        tecnológicos que actúan como encargados del tratamiento y que pueden
        alojar información <strong>fuera del territorio peruano</strong>:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — base de datos donde se almacenan los
          registros del sitio.
        </li>
        <li>
          <strong>HubSpot</strong> — sistema de gestión de contactos (CRM).
        </li>
        <li>
          <strong>Brevo</strong> — envío de correos transaccionales y
          comunicaciones.
        </li>
        <li>
          <strong>Cal.com</strong> — gestión de la agenda de citas.
        </li>
        <li>
          <strong>Culqi</strong> y <strong>PayPal</strong> — procesamiento de
          pagos.
        </li>
        <li>
          <strong>Google Analytics</strong> — estadísticas de uso del sitio.
        </li>
      </ul>
      <p>
        Al aceptar esta política autorizas dicho flujo transfronterizo de datos,
        que se realiza bajo compromisos contractuales de confidencialidad y
        seguridad con cada proveedor.
      </p>

      <h2>6. Conservación</h2>
      <p>
        Conservamos tus datos mientras dure la relación con NeoSer y, luego,
        durante los plazos exigidos por la normativa aplicable. Las hojas del
        Libro de Reclamaciones se conservan por un mínimo de dos (2) años,
        conforme al reglamento correspondiente.
      </p>

      <h2>7. Tus derechos (ARCO)</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de{" "}
        <strong>acceso, rectificación, cancelación y oposición</strong>, así
        como revocar tu consentimiento e impedir el uso de tus datos para fines
        publicitarios.
      </p>
      <p>
        Para ejercerlos, escríbenos a{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> indicando tu
        solicitud y adjuntando copia de tu documento de identidad. Responderemos
        dentro de los plazos legales. Si consideras que tu solicitud no fue
        atendida adecuadamente, puedes acudir a la Autoridad Nacional de
        Protección de Datos Personales.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas, organizativas y legales para proteger tus
        datos: cifrado del sitio mediante certificado SSL en todas sus páginas,
        control de accesos, y proveedores con estándares de seguridad
        reconocidos. Ningún sistema es infalible, pero trabajamos para reducir
        los riesgos de forma razonable.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Utilizamos cookies propias y de terceros para el funcionamiento del
        sitio y para obtener estadísticas de uso. Puedes configurar tu navegador
        para bloquearlas o eliminarlas; ten en cuenta que algunas funciones
        podrían dejar de operar correctamente.
      </p>

      <h2>10. Menores de edad</h2>
      <p>
        Nuestros servicios están dirigidos a personas mayores de edad. Cuando
        corresponda el tratamiento de datos de menores, se requerirá la
        autorización de su padre, madre o tutor.
      </p>

      <h2>11. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política ante cambios normativos o en nuestros
        servicios. La versión vigente será siempre la publicada en esta página,
        con su fecha de última actualización.
      </p>
    </LegalShell>
  );
}
