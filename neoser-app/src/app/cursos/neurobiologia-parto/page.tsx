import type { Metadata } from "next";
import { NeurobiologiaLanding } from "@/components/neurobiologia-landing";

export const metadata: Metadata = {
  title: "Neurobiología del Parto y Protocolos para un Nacimiento Humanizado",
  description:
    "Edición 2026 II. Curso virtual asincrónico que integra neurobiología, microbiota, epigenética, neurociencias y teoría del apego en protocolos clínicos basados en evidencia. 64 horas académicas (4 créditos), con el Dr. Beltrán Lares Díaz.",
  alternates: { canonical: "/cursos/neurobiologia-parto" },
  openGraph: {
    title:
      "Neurobiología del Parto y Protocolos para un Nacimiento Humanizado | NeoSer",
    description:
      "Actualizar la atención del nacimiento comienza por comprender su biología. Modalidad virtual asincrónica: accede hoy a las clases grabadas. 64 horas académicas.",
    images: ["/assets/cursos/neurobiologia-parto.jpg"],
  },
};

export default function NeurobiologiaPartoPage() {
  return <NeurobiologiaLanding />;
}
