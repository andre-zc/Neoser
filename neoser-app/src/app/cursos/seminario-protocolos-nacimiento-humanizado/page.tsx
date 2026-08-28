import type { Metadata } from "next";
import { SeminarioProtocolosLanding } from "@/components/seminario-protocolos-landing";

export const metadata: Metadata = {
  title: "Seminario Internacional: Protocolos para un Nacimiento Humanizado",
  description:
    "Seminario virtual en vivo con el Dr. Beltrán Lares Díaz. 4 seminarios online, 32 horas académicas (2 créditos). Inicio: 8 de septiembre de 2026. Perú: S/ 150 · Internacional: USD 60.",
  alternates: {
    canonical: "/cursos/seminario-protocolos-nacimiento-humanizado",
  },
  openGraph: {
    title:
      "Seminario Internacional: Protocolos para un Nacimiento Humanizado | NeoSer",
    description:
      "Actualización profesional desde la evidencia científica y la protección de la fisiología del nacimiento. Inicio: 8 de septiembre de 2026.",
    images: ["/assets/cursos/seminario-protocolos-portada.png"],
  },
};

export default function SeminarioProtocolosPage() {
  return <SeminarioProtocolosLanding />;
}
