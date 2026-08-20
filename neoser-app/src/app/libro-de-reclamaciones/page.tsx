import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { ComplaintBookForm } from "@/components/complaint-book-form";
import { PLAZO_RECLAMO_DIAS_HABILES } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description:
    "Libro de Reclamaciones virtual de NeoSer, conforme al Código de Protección y Defensa del Consumidor (Ley N.º 29571).",
};

export default function LibroReclamacionesPage() {
  return (
    <LegalShell
      title="Libro de Reclamaciones"
      intro="Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N.º 29571), ponemos a tu disposición este Libro de Reclamaciones virtual."
      currentPath="/libro-de-reclamaciones"
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-pink-light p-5">
          <p className="mb-1 font-bold text-navy">Reclamo</p>
          <p className="text-sm leading-relaxed text-gray-600">
            Disconformidad relacionada con el producto o servicio contratado.
          </p>
        </div>
        <div className="rounded-xl bg-blue-light p-5">
          <p className="mb-1 font-bold text-navy">Queja</p>
          <p className="text-sm leading-relaxed text-gray-600">
            Malestar o descontento respecto a la atención al público, no
            vinculado al producto o servicio en sí.
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed">
        Al enviar el formulario recibirás una <strong>constancia</strong> con el
        número de tu hoja de reclamación en el correo que registres. Daremos
        respuesta en un plazo máximo de{" "}
        <strong>{PLAZO_RECLAMO_DIAS_HABILES} días hábiles</strong>.
      </p>
      <p className="text-sm leading-relaxed">
        La formulación del reclamo no impide acudir a otras vías de solución de
        controversias ni constituye requisito previo para presentar una denuncia
        ante INDECOPI.
      </p>

      <div className="mt-8">
        <ComplaintBookForm />
      </div>
    </LegalShell>
  );
}
