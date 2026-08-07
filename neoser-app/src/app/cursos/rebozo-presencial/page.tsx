import type { Metadata } from "next";
import { RebozoPresencialLanding } from "@/components/rebozo-presencial-landing";

export const metadata: Metadata = {
  title:
    "Programa de Formación: El Arte del Rebozo desde la Educación Somática",
  description:
    "Programa de formación NeoSer de 64 horas académicas (4 créditos) en modalidad semipresencial: módulo virtual asincrónico de 32 h y curso taller presencial de 32 h con práctica clínica supervisada. Dirigido a obstetras y bachilleres en Obstetricia.",
  alternates: { canonical: "/cursos/rebozo-presencial" },
  openGraph: {
    title:
      "El Arte del Rebozo desde la Educación Somática para el Embarazo, Parto y Postparto | NeoSer",
    description:
      "64 horas académicas · 4 créditos · modalidad semipresencial. Evidencia científica, educación somática y práctica clínica supervisada con la Obsta. Diana Silva Mejía.",
    images: ["/assets/cursos/rebozo-embarazo-parto-posparto.jpg"],
  },
};

export default function RebozoPresencialPage() {
  return <RebozoPresencialLanding />;
}
