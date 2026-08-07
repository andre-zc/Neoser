import type { Metadata } from "next";
import { RebozoLanding } from "@/components/rebozo-landing";

export const metadata: Metadata = {
  title: "El Arte del Rebozo desde la Educación Somática",
  description:
    "Formación especializada que integra la Técnica Rebozo, la educación somática y la atención humanizada, con certificación emitida por Maternidad y Medicina Humanizada NeoSer. Modalidad virtual, 4 seminarios.",
  alternates: { canonical: "/cursos/rebozo-cert" },
  openGraph: {
    title: "El Arte del Rebozo desde la Educación Somática | NeoSer",
    description:
      "Técnica Rebozo con base en Educación Somática Prenatal, Neurobiología del Parto y Bioética Personalista, para el embarazo, parto y posparto. 4 seminarios, modalidad virtual.",
    images: ["/assets/cursos/rebozo-educacion-somatica.jpg"],
  },
};

export default function RebozoCertPage() {
  return <RebozoLanding />;
}
