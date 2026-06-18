import type { Metadata } from "next";
import { RebozoLanding } from "@/components/rebozo-landing";

export const metadata: Metadata = {
  title: "El Arte del Rebozo desde la Educación Somática",
  description:
    "Curso online III Edición: el arte del Rebozo desde la Educación Somática para el embarazo, parto y posparto. Para obstetras y doulas, con dirección médica y aval Spinning Babies.",
  alternates: { canonical: "/cursos/rebozo-cert" },
  openGraph: {
    title: "El Arte del Rebozo desde la Educación Somática | NeoSer",
    description:
      "Formación en técnica Rebozo con base en Educación Somática Prenatal, Neurobiología del Parto y Bioética Personalista. 4 seminarios, modalidad híbrida.",
    images: ["/assets/logo-full-color.png"],
  },
};

export default function RebozoCertPage() {
  return <RebozoLanding />;
}
