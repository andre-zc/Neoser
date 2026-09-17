import type { Metadata } from "next";
import { NeurobiologiaCampaignLanding } from "@/components/neurobiologia-campaign-landing";

/**
 * Landing de campaña (Meta Ads) — conversión, sin menú institucional.
 * La página institucional del curso sigue en /cursos/neurobiologia-parto.
 */
export const metadata: Metadata = {
  title: "Neurobiología del Parto | Curso virtual NeoSer",
  description:
    "Curso virtual Edición 2026 II. Neurobiología, protocolos y nacimiento humanizado. Recibe información o inscríbete ahora.",
  alternates: { canonical: "/lp/neurobiologia-parto" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Neurobiología del Parto y Protocolos para un Nacimiento Humanizado",
    description:
      "Actualiza tu práctica clínica con evidencia científica. Inicio: 08 de octubre de 2026. Modalidad virtual.",
    images: ["/assets/cursos/neurobiologia-parto.jpg"],
    url: "/lp/neurobiologia-parto",
  },
};

export default function NeurobiologiaCampaignPage() {
  return <NeurobiologiaCampaignLanding />;
}
