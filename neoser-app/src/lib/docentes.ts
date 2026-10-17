/**
 * Fichas de docentes compartidas entre landings de cursos.
 * Fuente: resumen de CV enviado por Diana Silva (octubre 2026).
 */

export type Docente = {
  name: string;
  shortName: string;
  photo: string;
  role: string;
  affiliation: string;
  /** Resumen de una línea para tarjetas compactas. */
  summary: string;
  /** Biografía completa, un párrafo por elemento. */
  bio: string[];
  /** Hitos del CV para listas destacadas. */
  highlights: string[];
};

export const BELTRAN_LARES: Docente = {
  name: "Dr. Beltrán Lares Díaz",
  shortName: "Dr. Beltrán Lares",
  photo: "/assets/cursos/dr-beltran-lares.jpg",
  role: "Médico gineco-obstetra · Pionero del parto humanizado",
  affiliation: "Fundador de AuroraMadre",
  summary:
    "Pionero de la humanización del parto en Venezuela desde 1989, con más de 30 años de experiencia en obstetricia y ginecología.",
  bio: [
    "Médico Cirujano especialista en Obstetricia y Ginecología de la Universidad de Oriente de Venezuela. Trabajó como ecografista y docente en el Instituto Venezolano de Ultrasonidos en Medicina (IVUM).",
    "Pionero de la humanización del parto y el nacimiento en Venezuela desde 1989, acumula más de 30 años de experiencia en la práctica de obstetricia y ginecología. Se destaca por su experiencia en nacimientos en agua y en casa, promoviendo mínimas intervenciones y altos índices de éxito en la lactancia.",
    "Fundó Aquamater, clínica de maternidad humanizada y cirugía ambulatoria de bajo riesgo en Caracas, donde ejerció la dirección durante 6 años. También fundó AuroraMadre, asociación civil dedicada a promover la humanización del parto y el nacimiento.",
  ],
  highlights: [
    "Especialista en Obstetricia y Ginecología (Universidad de Oriente, Venezuela)",
    "Pionero de la humanización del parto en Venezuela desde 1989",
    "Fundador y director de la clínica Aquamater (Caracas) durante 6 años",
    "Fundador de AuroraMadre",
    "Experiencia en nacimientos en agua y en casa",
    "Ex ecografista y docente del IVUM",
  ],
};
