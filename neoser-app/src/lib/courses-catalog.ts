// Catálogo estático de cursos NeoSer.
// Fuente confiable para /cursos y /cursos/[slug] (no depende de que la siembra
// de Supabase esté aplicada en cada entorno). Los UUID coinciden con la
// migración 002/003 para mantener consistencia con la BD cuando exista.
//
// Los cursos con `landingHref` tienen su propia landing dedicada
// (rebozo-cert, antropologia-parto) y NO usan la plantilla genérica [slug].

export type CatalogCourse = {
  slug: string;
  id: string;
  title: string;
  summary: string; // short_description
  description: string[]; // párrafos para el detalle
  price: number;
  currency: string;
  mode: string;
  durationLabel: string;
  icon: string; // clave de ícono lucide (mapeada en la página)
  includes: string[]; // "¿Qué incluye?"
  faq?: { q: string; a: string }[];
  landingHref?: string; // si tiene landing propia
};

export const coursesCatalog: CatalogCourse[] = [
  {
    slug: "prep-parto",
    id: "1a2b3c4d-1111-4111-8111-111111111111",
    title: "Curso de Preparación al Parto",
    summary:
      "Técnicas de respiración, posiciones de parto, plan de nacimiento y vínculo temprano.",
    description: [
      "Un curso integral y vivencial para llegar al nacimiento con confianza, información y herramientas concretas para ti y tu pareja.",
      "Trabajamos la respiración, las posiciones que favorecen el trabajo de parto, la elaboración de tu plan de nacimiento personalizado y el fortalecimiento del vínculo temprano con tu bebé.",
    ],
    price: 350,
    currency: "PEN",
    mode: "Presencial",
    durationLabel: "6 sesiones",
    icon: "Baby",
    includes: [
      "Técnicas de respiración para cada fase del parto",
      "Posiciones y movimiento durante el trabajo de parto",
      "Elaboración de tu plan de nacimiento",
      "Vínculo temprano y piel con piel",
      "Participación activa de la pareja",
    ],
    faq: [
      {
        q: "¿Desde qué semana puedo llevarlo?",
        a: "Idealmente desde el tercer trimestre, para integrar las herramientas con tiempo antes del parto.",
      },
      {
        q: "¿Mi pareja puede acompañarme?",
        a: "Sí, y lo recomendamos. El curso integra a la pareja como acompañante clave del proceso.",
      },
    ],
  },
  {
    slug: "diplomado-parto",
    id: "2a3b4c5d-2222-4222-8222-222222222222",
    title: "Diplomado en Parto Humanizado",
    summary:
      "Formación integral para profesionales de salud en atención humanizada del nacimiento.",
    description: [
      "Diplomado certificado dirigido a obstetras, ginecólogos, enfermeras y doulas que desean transformar su práctica con un enfoque humanizado y basado en evidencia.",
      "Un programa académico completo de atención humanizada del nacimiento, con módulos teóricos, casos prácticos y acompañamiento docente a lo largo de todo el proceso.",
    ],
    price: 1200,
    currency: "PEN",
    mode: "Online",
    durationLabel: "12 semanas",
    icon: "Award",
    includes: [
      "Módulos teóricos sobre nacimiento respetado",
      "Casos clínicos y prácticas guiadas",
      "Certificado del diplomado",
      "Grabaciones disponibles para repaso",
      "Acceso a la comunidad de profesionales NeoSer",
    ],
    faq: [
      {
        q: "¿A quién está dirigido?",
        a: "A profesionales de la salud (obstetras, ginecólogos, enfermeras) y doulas con interés en la atención humanizada del nacimiento.",
      },
      {
        q: "¿Recibo certificación?",
        a: "Sí. Al completar el programa recibes el certificado del Diplomado en Parto Humanizado de NeoSer.",
      },
    ],
  },
  {
    slug: "taller-lactancia",
    id: "4a5b6c7d-4444-4444-8444-444444444444",
    title: "Taller de Lactancia Materna",
    summary:
      "Taller práctico sobre técnicas de lactancia, posiciones y resolución de problemas comunes.",
    description: [
      "Taller práctico dirigido a gestantes en el tercer trimestre y a madres en lactancia que quieren prepararse para una lactancia informada y exitosa.",
      "Cubrimos las técnicas de agarre, las posiciones de amamantamiento, la prevención de grietas, el manejo de la extracción y el banco de leche.",
    ],
    price: 180,
    currency: "PEN",
    mode: "Presencial",
    durationLabel: "1 sesión intensiva",
    icon: "Droplets",
    includes: [
      "Técnicas de agarre y posiciones de amamantamiento",
      "Prevención y manejo de grietas",
      "Extracción y conservación de leche (banco de leche)",
      "Importancia del calostro y el contacto piel con piel",
    ],
    faq: [
      {
        q: "¿Para quién es el taller?",
        a: "Para gestantes en el tercer trimestre y madres en lactancia que buscan una lactancia informada y acompañada.",
      },
      {
        q: "¿Es teórico o práctico?",
        a: "Es eminentemente práctico y vivencial, con técnicas que puedes aplicar desde el primer día.",
      },
    ],
  },
  // --- Cursos con landing propia (no usan la plantilla [slug]) ---
  {
    slug: "rebozo-cert",
    id: "3a4b5c6d-3333-4333-8333-333333333333",
    title: "Técnica Rebozo Certificación",
    summary:
      "Certificación internacional en técnica Rebozo con reconocimiento de Spinning Babies.",
    description: [
      "Programa de certificación oficial en técnica Rebozo, con aval internacional de Spinning Babies. Incluye prácticas presenciales y teoría online.",
    ],
    price: 800,
    currency: "PEN",
    mode: "Híbrido",
    durationLabel: "4 seminarios",
    icon: "HeartHandshake",
    includes: [],
    landingHref: "/cursos/rebozo-cert",
  },
  {
    slug: "antropologia-parto",
    id: "5a6b7c8d-5555-4555-8555-555555555555",
    title: "Antropología del Parto",
    summary:
      "Curso Internacional: paradigmas del nacimiento, violencia obstétrica y partería posmoderna.",
    description: [
      "Curso Internacional en alianza con Aurora Madre. Una mirada profunda a los paradigmas sociales y culturales del nacimiento, desde una perspectiva de derechos humanos.",
    ],
    price: 200,
    currency: "PEN",
    mode: "Online",
    durationLabel: "1 mes · 8 sesiones",
    icon: "Globe",
    includes: [],
    landingHref: "/cursos/antropologia-parto",
  },
];

export function getCatalogCourse(slug: string): CatalogCourse | undefined {
  return coursesCatalog.find((c) => c.slug === slug);
}
