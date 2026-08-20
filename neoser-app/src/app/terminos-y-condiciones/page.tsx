import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { LEGAL, PLAZO_RECLAMO_DIAS_HABILES } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso y contratación de los servicios y cursos de NeoSer — Maternidad y Medicina Humanizada.",
};

export default function TerminosPage() {
  return (
    <LegalShell
      title="Términos y Condiciones"
      intro="Condiciones que regulan el uso de este sitio web y la contratación de los servicios y programas formativos de NeoSer."
      currentPath="/terminos-y-condiciones"
    >
      <h2>1. Identificación del proveedor</h2>
      <p>
        El presente sitio web es operado por <strong>{LEGAL.razonSocial}</strong>{" "}
        (en adelante, «NeoSer»), con RUC <strong>{LEGAL.ruc}</strong> y domicilio
        en {LEGAL.direccion}. Puedes contactarnos al {LEGAL.telefono} o al correo{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>, en el horario de{" "}
        {LEGAL.horario}.
      </p>

      <h2>2. Objeto y aceptación</h2>
      <p>
        Estos términos regulan el acceso y uso del sitio web, así como la
        contratación de los servicios de atención en salud materna y de los
        programas formativos (cursos, diplomados y talleres) que NeoSer ofrece.
        Al navegar por el sitio, completar un formulario o realizar una
        inscripción, declaras haber leído y aceptado estos términos.
      </p>

      <h2>3. Servicios ofrecidos</h2>
      <p>NeoSer ofrece dos líneas de servicio:</p>
      <ul>
        <li>
          <strong>Atención en salud materna:</strong> consultas de
          gineco-obstetricia, atención prenatal, acompañamiento del parto y
          cesárea humanizados, y programas de educación somática. Estos
          servicios se agendan a través del sitio y se prestan de forma
          presencial en nuestro local, salvo indicación distinta.
        </li>
        <li>
          <strong>Programas formativos:</strong> cursos, diplomados y talleres
          dirigidos a profesionales de la salud, en modalidad virtual,
          presencial o semipresencial, según se detalle en cada programa.
        </li>
      </ul>
      <p>
        Las características, duración, modalidad, contenidos, certificación e
        inversión de cada servicio o programa se describen en su página
        correspondiente dentro de este sitio.
      </p>

      <h2>4. Proceso de contratación</h2>
      <ol>
        <li>
          Seleccionas el curso o servicio de tu interés y revisas su detalle,
          modalidad y precio.
        </li>
        <li>
          Completas el formulario de inscripción con tus datos personales
          (nombres y apellidos, correo electrónico y teléfono).
        </li>
        <li>Eliges el medio de pago y completas la transacción.</li>
        <li>
          Recibes la confirmación de tu inscripción en el correo electrónico
          registrado.
        </li>
      </ol>
      <p>
        La inscripción se considera perfeccionada únicamente cuando el pago ha
        sido confirmado. En los pagos internacionales realizados por PayPal, la
        confirmación puede requerir verificación manual por parte de NeoSer.
      </p>

      <h2>5. Precios y medios de pago</h2>
      <p>
        Los precios se muestran en Soles (S/) para participantes en Perú y en
        Dólares Americanos (USD) para participantes del extranjero, e incluyen
        los impuestos aplicables. NeoSer puede ofrecer tarifas preferenciales
        (por ejemplo, para egresadas de programas anteriores), que se coordinan
        de forma directa y no se aplican automáticamente en el pago en línea.
      </p>
      <p>Aceptamos los siguientes medios de pago:</p>
      <ul>
        <li>
          <strong>Tarjeta de crédito o débito y Yape</strong>, en soles, a
          través de la pasarela de pagos Culqi.
        </li>
        <li>
          <strong>Tarjeta internacional</strong>, en dólares, a través de Culqi.
        </li>
        <li>
          <strong>PayPal</strong>, como alternativa para pagos internacionales.
        </li>
      </ul>
      <p>
        NeoSer no almacena en sus servidores los datos de tarjetas de crédito o
        débito. Dicha información es procesada directamente por la pasarela de
        pagos, que cuenta con los estándares de seguridad correspondientes.
      </p>

      <h2>6. Acceso a los programas formativos</h2>
      <p>
        Una vez confirmada la inscripción, recibirás por correo electrónico los
        accesos, el cronograma y las instrucciones de ingreso. El acceso es{" "}
        <strong>personal e intransferible</strong>. Los materiales, grabaciones
        y accesos al campus virtual estarán disponibles durante el plazo que se
        indique en cada programa.
      </p>

      <h2>7. Obligaciones del usuario</h2>
      <ul>
        <li>
          Proporcionar información veraz, exacta y actualizada en los
          formularios.
        </li>
        <li>
          No compartir, reproducir ni distribuir los materiales, grabaciones o
          accesos entregados.
        </li>
        <li>
          Usar el sitio y los servicios conforme a la ley, la buena fe y estos
          términos.
        </li>
      </ul>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Todos los contenidos del sitio y de los programas formativos —textos,
        materiales, videos, grabaciones, marcas, logotipos y metodologías— son
        titularidad de NeoSer o de sus respectivos licenciantes, y están
        protegidos por la normativa de derechos de autor y propiedad industrial.
        Su reproducción, distribución o comunicación pública sin autorización
        expresa está prohibida.
      </p>

      <h2>9. Naturaleza de la información publicada</h2>
      <p>
        La información difundida en este sitio tiene fines informativos y
        educativos. <strong>No constituye diagnóstico ni tratamiento médico</strong>{" "}
        y no sustituye la consulta con un profesional de la salud. Ante
        cualquier síntoma o urgencia, acude a un establecimiento de salud.
      </p>

      <h2>10. Protección de datos personales</h2>
      <p>
        El tratamiento de tus datos personales se rige por nuestra{" "}
        <a href="/politica-de-privacidad">Política de Privacidad</a>, elaborada
        conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su
        reglamento.
      </p>

      <h2>11. Cambios, devoluciones y cancelaciones</h2>
      <p>
        Las condiciones aplicables se detallan en nuestra{" "}
        <a href="/politica-de-cambios-y-devoluciones">
          Política de Cambios y Devoluciones
        </a>
        .
      </p>

      <h2>12. Libro de Reclamaciones</h2>
      <p>
        Conforme al Código de Protección y Defensa del Consumidor (Ley N.º
        29571), NeoSer cuenta con un{" "}
        <a href="/libro-de-reclamaciones">Libro de Reclamaciones virtual</a>{" "}
        disponible en este sitio. Los reclamos y quejas se atienden en un plazo
        máximo de {PLAZO_RECLAMO_DIAS_HABILES} días hábiles.
      </p>

      <h2>13. Modificaciones</h2>
      <p>
        NeoSer puede actualizar estos términos para reflejar cambios en sus
        servicios o en la normativa aplicable. La versión vigente es siempre la
        publicada en esta página, con su fecha de última actualización.
      </p>

      <h2>14. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por las leyes de la República del Perú.
        Cualquier controversia se someterá a los jueces y tribunales de la
        ciudad de Chiclayo, sin perjuicio del derecho del consumidor de acudir a
        INDECOPI.
      </p>
    </LegalShell>
  );
}
