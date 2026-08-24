/**
 * Datos legales y fiscales del titular del sitio.
 *
 * Fuente única para el footer, las páginas legales y el Libro de Reclamaciones.
 * Culqi exige que la razón social, el RUC y los datos de contacto sean visibles
 * y consistentes en toda la web (no solo en el inicio).
 */

export const LEGAL = {
  razonSocial: "MATERNIDAD Y MEDICINA HOLISTICA NEOSER S.A.C.",
  nombreComercial: "NeoSer",
  ruc: "20602196357",
  direccion: "Calle Los Sauces 542, Urb. Santa Victoria, Chiclayo, Lambayeque, Perú",
  direccionCorta: "Calle Los Sauces 542, Chiclayo",
  telefono: "+51 932 713 071",
  telefonoLink: "+51932713071",
  whatsapp: "51932713071",
  // contacto@neoser.pe NO existe: el dominio neoser.pe no tiene registros MX,
  // asi que nadie recibiria nada. INDECOPI exige un canal de contacto operativo
  // en el Libro de Reclamaciones y Culqi lo verifica, de modo que se usa el
  // buzon real del negocio: neoserperu.com si tiene Google Workspace.
  email: "dsilva@neoserperu.com",
  emailAcademico: "dsilva@neoserperu.com",
  horario: "Lunes a Sábado, 8:00 a. m. – 7:00 p. m.",
  ciudad: "Chiclayo, Lambayeque, Perú",
  /** Fecha de última actualización de los documentos legales. */
  actualizado: "agosto de 2026",
} as const;

/** Plazo legal de respuesta del Libro de Reclamaciones (INDECOPI). */
export const PLAZO_RECLAMO_DIAS_HABILES = 15;

export const RUTAS_LEGALES = [
  { href: "/terminos-y-condiciones", label: "Términos y Condiciones" },
  { href: "/politica-de-privacidad", label: "Política de Privacidad" },
  {
    href: "/politica-de-cambios-y-devoluciones",
    label: "Cambios y Devoluciones",
  },
  { href: "/libro-de-reclamaciones", label: "Libro de Reclamaciones" },
] as const;

export const REDES = [
  { href: "https://www.instagram.com/neoserper", label: "Instagram" },
  { href: "https://www.facebook.com/NeoSerPeru", label: "Facebook" },
  { href: "https://www.tiktok.com/@neoserperu", label: "TikTok" },
] as const;
