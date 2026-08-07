// Catálogo estático de cursos NeoSer — Listado oficial 2026.
//
// Fuente de verdad para /cursos, /cursos/[slug], la sección #cursos de la home
// y el sitemap. No depende de que la siembra de Supabase esté aplicada en cada
// entorno; los UUID coinciden con `supabase/migrations/006_cursos_2026.sql`
// para que el checkout (que necesita course_id en BD) sea consistente.
//
// Contenido tomado de la carpeta `CURSOS/` entregada por la clienta:
//   - cursos-neoser.docx (listado 2026 + ajustes de la landing de Rebozo)
//   - 1-NEUROBIOLOGÍA/Neurobiología-información.docx + brochure PDF
//   - 3-REBOZO-PRESENCIAL/Programa_Formacion_Rebozo_NeoSer.docx + fotos del
//     taller con obstetras (Chiclayo, 2025) → public/assets/cursos/rebozo-presencial/
//   - posters de cada curso (1080x1350) → public/assets/cursos/
//
// Los cursos con `landingHref` tienen su propia landing dedicada y NO usan la
// plantilla genérica [slug]. Los que tienen `enrollment: "whatsapp"` todavía no
// tienen precio/fechas confirmadas: no abren checkout, derivan a WhatsApp.

export type CoursePriceTier = {
  label: string; // "Participantes en Perú"
  value: string; // "S/ 300"
  note?: string; // "Egresadas NeoSer: S/ 220"
  tone?: "pink" | "blue";
};

export type CourseModule = {
  n: string; // "I"
  title: string;
  purpose: string; // propósito del módulo
  topics: string[]; // contenidos principales
};

export type CatalogCourse = {
  slug: string;
  id: string;
  title: string;
  /** Bajada corta bajo el título (claim del afiche). */
  tagline?: string;
  summary: string; // short_description
  description: string[]; // párrafos para el detalle
  /** Precio base para el checkout. `null` = inversión a consultar. */
  price: number | null;
  currency: string;
  /** Desglose de inversión (Perú / extranjero / egresadas). */
  priceTiers?: CoursePriceTier[];
  mode: string;
  durationLabel: string;
  startLabel?: string; // "Martes 18 de agosto de 2026"
  scheduleLabel?: string; // "Martes y jueves · 7:00 – 9:00 p. m."
  audience?: string; // dirigido a
  certification?: string;
  /** Poster oficial del curso (4:5). */
  image: string;
  icon: string; // clave de ícono lucide (mapeada en las páginas)
  includes: string[]; // "¿Qué incluye?"
  modules?: CourseModule[];
  faq?: { q: string; a: string }[];
  brochureHref?: string; // PDF descargable en /public
  landingHref?: string; // si tiene landing propia
  /** "checkout" abre el pago online; "whatsapp" deriva a coordinación manual. */
  enrollment: "checkout" | "whatsapp";
  /** Texto pre-cargado del enlace de WhatsApp (ya codificado). */
  whatsappText: string;
};

export const CONTACT_EMAIL = "dsilva@neoserperu.com";
export const CONTACT_PHONE = "+51 932 713 071";
export const CONTACT_WHATSAPP = "51932713071";

export function whatsappHref(text: string) {
  return `https://wa.me/${CONTACT_WHATSAPP}?text=${text}`;
}

export const coursesCatalog: CatalogCourse[] = [
  // ---------------------------------------------------------------------
  // 1. Neurobiología del Parto — landing propia
  // ---------------------------------------------------------------------
  {
    slug: "neurobiologia-parto",
    id: "6a7b8c9d-6666-4666-8666-666666666666",
    title: "Neurobiología del Parto y Protocolos para un Nacimiento Humanizado",
    tagline: "Actualizar la atención del nacimiento comienza por comprender su biología.",
    summary:
      "Edición 2026. Neurobiología, microbiota, epigenética y teoría del apego aplicadas a protocolos clínicos basados en evidencia.",
    description: [
      "La ciencia del nacimiento ha evolucionado. Hoy comprendemos que los procesos biológicos que ocurren durante el embarazo, el parto y el nacimiento influyen en la salud presente y futura de la madre y el recién nacido.",
      "Este curso integra los avances en neurobiología, microbiota, epigenética, neurociencias y teoría del apego para fortalecer la práctica clínica mediante protocolos basados en evidencia científica.",
    ],
    price: 300,
    currency: "PEN",
    priceTiers: [
      {
        label: "Participantes en Perú",
        value: "S/ 300",
        note: "Egresadas de cursos NeoSer: S/ 220",
        tone: "pink",
      },
      {
        label: "Participantes del extranjero",
        value: "USD 75",
        note: "Egresadas de cursos NeoSer: USD 60",
        tone: "blue",
      },
    ],
    mode: "Virtual sincrónica",
    durationLabel: "64 horas académicas · 8 sesiones",
    startLabel: "Martes 18 de agosto de 2026",
    scheduleLabel: "Martes y jueves · 7:00 – 9:00 p. m. (hora Perú)",
    audience:
      "Obstetras, médicos gineco-obstetras, neonatólogos, pediatras y profesionales vinculados a la atención materno-perinatal.",
    certification:
      "Certificado de aprobación por 64 horas académicas, equivalentes a 4 créditos académicos.",
    image: "/assets/cursos/neurobiologia-parto.jpg",
    icon: "Brain",
    includes: [
      "8 sesiones académicas en vivo",
      "Campus Virtual NeoSer durante 12 meses",
      "NeoSer Workbook",
      "Bibliografía científica",
      "Casos clínicos y prácticas guiadas",
      "Grabaciones disponibles durante 12 meses",
      "Comunidad Académica NeoSer",
      "Certificación académica (64 h · 4 créditos)",
    ],
    modules: [
      {
        n: "I",
        title: "Vínculo, Microbiota y Hormonas",
        purpose:
          "Comprender los fundamentos biológicos que regulan la microbiota, la actividad hormonal y el establecimiento del vínculo temprano, analizando su influencia en la adaptación neonatal y la salud futura.",
        topics: [
          "Microbiota y colonización inicial del recién nacido",
          "Forma de nacer y desarrollo de la microbiota",
          "Hormonas del embarazo, parto y nacimiento",
          "Adaptación neonatal",
          "Vínculo temprano y desarrollo del sistema nervioso",
        ],
      },
      {
        n: "II",
        title: "Teoría del Apego, Epigenética y Neurociencias",
        purpose:
          "Analizar la evidencia científica que vincula la teoría del apego, la epigenética y las neurociencias con el desarrollo humano, integrando estos conocimientos en la comprensión contemporánea de la atención materno-perinatal.",
        topics: [
          "Teoría del Apego: aportes de John Bowlby y Mary Ainsworth",
          "Epigenética y programación temprana de la salud",
          "Neurociencias aplicadas al embarazo, parto y nacimiento",
          "Teoría Polivagal y regulación del sistema nervioso",
          "Desarrollo cerebral desde la vida prenatal hasta la primera infancia",
          "Integración de la evidencia científica en la práctica clínica",
        ],
      },
      {
        n: "III",
        title: "Protocolos para la Humanización del Nacimiento I",
        purpose:
          "Analizar críticamente los protocolos de atención del nacimiento desde una perspectiva basada en evidencia científica, promoviendo prácticas clínicas orientadas a proteger la fisiología del parto y el nacimiento.",
        topics: [
          "Revisión crítica de protocolos y rutinas de atención del nacimiento",
          "Recomendaciones internacionales para una atención basada en evidencia",
          "Protección de la fisiología del parto y del nacimiento",
          "Análisis de intervenciones clínicas y su impacto en los resultados materno-perinatales",
          "Reflexión crítica sobre la práctica profesional",
          "Actualización de protocolos desde un enfoque científico",
        ],
      },
      {
        n: "IV",
        title: "Protocolos para la Humanización del Nacimiento II",
        purpose:
          "Integrar protocolos actualizados para fortalecer una atención segura, respetuosa y centrada en la madre, el recién nacido y la familia, favoreciendo la implementación de buenas prácticas sustentadas en evidencia científica.",
        topics: [
          "Integración de protocolos para la atención materno-perinatal",
          "Discusión académica y análisis de casos clínicos",
          "Implementación de buenas prácticas basadas en evidencia",
          "Adaptación de la práctica profesional a los desafíos actuales de la atención del nacimiento",
          "Fortalecimiento de competencias para una obstetricia del siglo XXI",
          "Construcción de propuestas de mejora para la práctica clínica",
        ],
      },
    ],
    brochureHref: "/assets/cursos/brochure-neurobiologia-parto.pdf",
    landingHref: "/cursos/neurobiologia-parto",
    enrollment: "checkout",
    whatsappText:
      "Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20curso%20Neurobiolog%C3%ADa%20del%20Parto%20y%20Protocolos%20para%20un%20Nacimiento%20Humanizado",
  },

  // ---------------------------------------------------------------------
  // 2. El Arte del Rebozo — virtual — landing propia
  // ---------------------------------------------------------------------
  {
    slug: "rebozo-cert",
    id: "3a4b5c6d-3333-4333-8333-333333333333",
    title: "El Arte del Rebozo desde la Educación Somática",
    tagline: "Deja de acompañar a ciegas. Aprende el método.",
    summary:
      "Formación especializada que integra la Técnica Rebozo, la educación somática y la atención humanizada, con certificación emitida por Maternidad y Medicina Humanizada NeoSer.",
    description: [
      "Formación especializada que integra la Técnica Rebozo, la educación somática y la atención humanizada, con certificación emitida por Maternidad y Medicina Humanizada NeoSer.",
      "Un programa que une la sabiduría del rebozo con la Educación Somática Prenatal, la Neurobiología del Parto y la Bioética Personalista, aplicado al embarazo, parto y posparto.",
    ],
    price: 300,
    currency: "PEN",
    mode: "Virtual",
    durationLabel: "1 mes · 4 seminarios",
    audience:
      "Obstetras, médicos, enfermeras, doulas y profesionales que acompañan el embarazo, parto y posparto.",
    certification: "Certificado de participación emitido por NeoSer.",
    image: "/assets/cursos/rebozo-educacion-somatica.jpg",
    icon: "HeartHandshake",
    includes: [
      "4 seminarios a lo largo de 1 mes de capacitación",
      "12 videos tutoriales de ejercicios con Rebozo para el embarazo, parto y posparto",
      "Marco clínico y seguro para profesionales de salud y doulas",
      "Acceso a la Comunidad de profesionales NeoSer",
      "Certificado de participación NeoSer",
      "Grabaciones disponibles para repaso",
    ],
    landingHref: "/cursos/rebozo-cert",
    enrollment: "checkout",
    whatsappText:
      "Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20curso%20El%20Arte%20del%20Rebozo%20desde%20la%20Educaci%C3%B3n%20Som%C3%A1tica",
  },

  // ---------------------------------------------------------------------
  // 3. Programa de Formación El Arte del Rebozo — semipresencial —
  //    landing propia. Contenido: Programa_Formacion_Rebozo_NeoSer.docx
  //    (carpeta 3-REBOZO-PRESENCIAL entregada por la clienta).
  // ---------------------------------------------------------------------
  {
    slug: "rebozo-presencial",
    id: "7a8b9c0d-7777-4777-8777-777777777777",
    title:
      "El Arte del Rebozo desde la Educación Somática para el Embarazo, Parto y Postparto",
    tagline: "Programa de Formación · La técnica en el cuerpo, con evidencia detrás.",
    summary:
      "Programa de formación de 64 horas académicas (4 créditos) en modalidad semipresencial: módulo virtual asincrónico + curso taller presencial con práctica clínica supervisada.",
    description: [
      "Programa desarrollado por Maternidad y Medicina Humanizada NeoSer Perú para fortalecer competencias profesionales mediante evidencia científica, educación somática y práctica clínica.",
      "Surge de la experiencia clínica de NeoSer e integra el arte del rebozo como herramienta de acompañamiento durante el embarazo, parto y postparto.",
      "Desarrolla las competencias necesarias para integrar el arte del rebozo como una herramienta de acompañamiento obstétrico, sustentada en evidencia científica, educación somática y práctica clínica supervisada.",
    ],
    // Inversión confirmada por la clienta, pero las fechas de la próxima
    // edición siguen en programación: el CTA deriva a WhatsApp (sin checkout).
    price: 720,
    currency: "PEN",
    priceTiers: [
      {
        label: "Módulo I · Formación virtual asincrónica (32 h)",
        value: "S/ 220",
        note: "Egresadas NeoSer: S/ 180",
        tone: "blue",
      },
      {
        label: "Módulo II · Curso taller presencial (32 h)",
        value: "S/ 500",
        note: "Egresadas NeoSer: S/ 400",
        tone: "blue",
      },
      {
        label: "Programa completo (64 h · 4 créditos)",
        value: "S/ 720",
        note: "Egresadas NeoSer: S/ 580",
        tone: "pink",
      },
    ],
    mode: "Semipresencial",
    durationLabel: "64 horas académicas · 4 créditos",
    audience:
      "Obstetras y bachilleres en Obstetricia que acompañan el embarazo, parto y postparto.",
    certification:
      "Certificado por 64 horas académicas, equivalentes a 4 créditos académicos.",
    image: "/assets/cursos/rebozo-embarazo-parto-posparto.jpg",
    icon: "Hand",
    includes: [
      "Acceso al Campus Virtual NeoSer",
      "Material académico del programa",
      "Bibliografía científica de respaldo",
      "12 videos tutoriales de ejercicios con rebozo",
      "Curso taller presencial (32 h)",
      "Práctica clínica supervisada",
      "Certificado por 64 horas académicas (4 créditos)",
      "Beneficios de la Comunidad Académica NeoSer",
    ],
    modules: [
      {
        n: "I",
        title: "Formación Virtual Asincrónica (32 h)",
        purpose:
          "Construir la base teórica del programa: educación somática prenatal, neurobiología del parto, biomecánica de la pelvis y bioética personalista, a tu propio ritmo desde el Campus Virtual.",
        topics: [
          "Seminario 1 — Fundamentos de la Educación Somática Prenatal",
          "Seminario 2 — Neurobiología del Parto y el rol del movimiento",
          "Seminario 3 — Biomecánica de la pelvis y técnica del rebozo",
          "Seminario 4 — Bioética Personalista y nacimiento respetado",
          "12 videos tutoriales de ejercicios con rebozo",
          "Bibliografía científica y material académico descargable",
        ],
      },
      {
        n: "II",
        title: "Curso Taller Presencial (32 h)",
        purpose:
          "Llevar la teoría al cuerpo: cuatro unidades prácticas con acompañamiento directo de la facilitadora y práctica clínica supervisada aplicada al embarazo, parto y postparto.",
        topics: [
          "Unidad 1 — Fundamentos prácticos y manejo del rebozo",
          "Unidad 2 — Aplicación en el embarazo",
          "Unidad 3 — Aplicación en el trabajo de parto y parto",
          "Unidad 4 — Aplicación en el postparto",
          "Práctica supervisada con retroalimentación directa",
        ],
      },
    ],
    faq: [
      {
        q: "¿A quién está dirigido el programa?",
        a: "A obstetras y bachilleres en Obstetricia que acompañan procesos de embarazo, parto y postparto y buscan incorporar el arte del rebozo con respaldo científico.",
      },
      {
        q: "¿Cómo es la modalidad?",
        a: "Semipresencial. El Módulo I son 32 horas de formación virtual asincrónica en el Campus Virtual NeoSer, que avanzas a tu ritmo; el Módulo II son 32 horas de curso taller presencial con práctica supervisada. En total, 64 horas académicas.",
      },
      {
        q: "¿Es obligatorio llevar el módulo virtual antes del presencial?",
        a: "Sí. El Módulo I es requisito previo del Módulo II: llegas al taller presencial con la base teórica resuelta, de modo que las 32 horas presenciales se dedican íntegramente a la práctica.",
      },
      {
        q: "¿Qué certificación recibo?",
        a: "Al completar el programa recibes un certificado por 64 horas académicas, equivalentes a 4 créditos académicos, emitido por Maternidad y Medicina Humanizada NeoSer Perú.",
      },
      {
        q: "¿Cuándo son las próximas fechas?",
        a: "La próxima edición está en programación. Escríbenos por WhatsApp al +51 932 713 071 o a dsilva@neoserperu.com y te avisamos apenas se abra la convocatoria y se confirme la sede.",
      },
      {
        q: "¿Necesito experiencia previa con el rebozo?",
        a: "No. El programa parte desde los fundamentos: el Módulo I construye la base teórica y el Módulo II acompaña la técnica paso a paso con corrección directa de la facilitadora.",
      },
    ],
    landingHref: "/cursos/rebozo-presencial",
    enrollment: "whatsapp",
    whatsappText:
      "Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Programa%20de%20Formaci%C3%B3n%20El%20Arte%20del%20Rebozo%20desde%20la%20Educaci%C3%B3n%20Som%C3%A1tica",
  },

  // ---------------------------------------------------------------------
  // 4. Antropología y Sociología del Nacimiento — landing propia
  // ---------------------------------------------------------------------
  {
    slug: "antropologia-parto",
    id: "5a6b7c8d-5555-4555-8555-555555555555",
    title: "Antropología y Sociología del Nacimiento",
    tagline: "Una mirada profunda a los paradigmas del nacimiento.",
    summary:
      "Curso Internacional: paradigmas culturales del nacimiento, violencia obstétrica y el surgimiento de la partería posmoderna.",
    description: [
      "Curso Internacional dictado por NeoSer en alianza con Aurora Madre. Una visión integral sobre los modelos de atención, las dinámicas sociales y culturales que rodean el nacimiento y la violencia obstétrica desde una perspectiva de derechos humanos.",
    ],
    price: 200,
    currency: "PEN",
    priceTiers: [
      { label: "Participantes en Perú", value: "S/ 200", tone: "pink" },
      { label: "Participantes del extranjero", value: "USD 60", tone: "blue" },
    ],
    mode: "Online",
    durationLabel: "1 mes · 8 sesiones",
    scheduleLabel: "Martes y jueves · 7:00 – 9:00 p. m. (hora Perú)",
    audience:
      "Profesionales del sector salud, educación y desarrollo social que desean profundizar en los enfoques de atención reproductiva.",
    certification:
      "Certificado digital por 48 horas académicas, equivalentes a 3 créditos académicos.",
    image: "/assets/cursos/antropologia-nacimiento.jpg",
    icon: "Globe",
    includes: [
      "8 sesiones en vivo a lo largo de 1 mes",
      "Material de estudio complementario",
      "Facilitadores internacionales",
      "Certificado digital (48 h · 3 créditos)",
    ],
    landingHref: "/cursos/antropologia-parto",
    enrollment: "checkout",
    whatsappText:
      "Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Curso%20Internacional%20Antropolog%C3%ADa%20y%20Sociolog%C3%ADa%20del%20Nacimiento",
  },

  // ---------------------------------------------------------------------
  // 5. Herramientas para un Nacimiento Humanizado — jornada
  // ---------------------------------------------------------------------
  {
    slug: "herramientas-nacimiento-humanizado",
    id: "8a9b0c1d-8888-4888-8888-888888888888",
    title: "Herramientas para un Nacimiento Humanizado",
    tagline: "Una jornada con profesores especialistas.",
    summary:
      "Jornada académica con la participación de profesores especialistas invitados, centrada en herramientas prácticas para la atención del nacimiento.",
    description: [
      "Una jornada académica que reúne a profesores especialistas invitados alrededor de un mismo eje: las herramientas concretas que sostienen una atención del nacimiento respetuosa, segura y basada en evidencia.",
      "A diferencia de nuestros cursos por módulos, la jornada es un encuentro intensivo: varias voces, distintas especialidades y un formato pensado para llevarse recursos aplicables desde el día siguiente.",
      "El programa detallado, la fecha y la inversión de la edición 2026 se confirman por WhatsApp. Escríbenos para quedar en la lista de avisos.",
    ],
    price: null,
    currency: "PEN",
    mode: "Jornada académica",
    durationLabel: "Edición 2026 · fecha por confirmar",
    audience:
      "Profesionales de la salud y estudiantes vinculados a la atención materno-perinatal.",
    image: "/assets/cursos/herramientas-nacimiento-humanizado.jpg",
    icon: "Users",
    includes: [
      "Ponencias de profesores especialistas invitados",
      "Herramientas prácticas para la atención del nacimiento",
      "Constancia de participación NeoSer",
    ],
    faq: [
      {
        q: "¿Quiénes son los profesores invitados?",
        a: "El panel de la edición 2026 se anuncia junto con el programa. Escríbenos por WhatsApp para recibir el aviso apenas se confirme.",
      },
      {
        q: "¿Cuándo se realiza la jornada?",
        a: "La fecha está en programación. Consúltanos por WhatsApp al +51 932 713 071 y te avisamos en cuanto se publique.",
      },
      {
        q: "¿Cuál es la inversión?",
        a: "Se confirma junto con la convocatoria. Escríbenos a dsilva@neoserperu.com o por WhatsApp para más información.",
      },
    ],
    enrollment: "whatsapp",
    whatsappText:
      "Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20la%20jornada%20Herramientas%20para%20un%20Nacimiento%20Humanizado",
  },
];

export function getCatalogCourse(slug: string): CatalogCourse | undefined {
  return coursesCatalog.find((c) => c.slug === slug);
}

/** Formatea un precio del catálogo; `null` => "Inversión a consultar". */
export function formatCoursePrice(
  price: number | null,
  currency: string,
): string {
  if (price === null) return "A consultar";
  if (currency === "PEN") return `S/. ${Number(price).toLocaleString("es-PE")}`;
  return `${currency} ${Number(price).toLocaleString("es-PE")}`;
}
