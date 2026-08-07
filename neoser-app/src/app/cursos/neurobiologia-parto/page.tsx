import type { Metadata } from "next";
import { NeurobiologiaLanding } from "@/components/neurobiologia-landing";

export const metadata: Metadata = {
  title: "Neurobiología del Parto y Protocolos para un Nacimiento Humanizado",
  description:
    "Edición 2026. Curso virtual sincrónico que integra neurobiología, microbiota, epigenética, neurociencias y teoría del apego en protocolos clínicos basados en evidencia. 64 horas académicas (4 créditos), con el Dr. Beltrán Lares.",
  alternates: { canonical: "/cursos/neurobiologia-parto" },
  openGraph: {
    title:
      "Neurobiología del Parto y Protocolos para un Nacimiento Humanizado | NeoSer",
    description:
      "Actualizar la atención del nacimiento comienza por comprender su biología. Inicio: 18 de agosto de 2026. Modalidad virtual sincrónica, 64 horas académicas.",
    images: ["/assets/cursos/neurobiologia-parto.jpg"],
  },
};

export default function NeurobiologiaPartoPage() {
  return <NeurobiologiaLanding />;
}
