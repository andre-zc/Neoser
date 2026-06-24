import type { Metadata } from "next";
import { AntropologiaLanding } from "@/components/antropologia-landing";

export const metadata: Metadata = {
  title: "Antropología del Parto — Curso Internacional",
  description:
    "Curso Internacional Antropología del Parto, hacia un nacimiento humanizado. Paradigmas sociales y culturales del nacimiento, violencia obstétrica y partería posmoderna. Online, 48 horas académicas, certificado digital.",
  alternates: { canonical: "/cursos/antropologia-parto" },
  openGraph: {
    title: "Antropología del Parto — Curso Internacional | NeoSer",
    description:
      "Una mirada profunda a los paradigmas del nacimiento, las tendencias mundiales en obstetricia y el surgimiento de la partería posmoderna. NeoSer + Aurora Madre.",
    images: ["/assets/logo-full-color.png"],
  },
};

export default function AntropologiaPartoPage() {
  return <AntropologiaLanding />;
}
