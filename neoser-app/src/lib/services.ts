export type ServiceCategory = "medica" | "somatica" | "comunidad";

export type Service = {
  slug: string;
  title: string;
  summary: string; // 1-2 líneas para la home
  description: string[]; // párrafos completos para /servicios
  image: string; // path relativo a /public
  category: ServiceCategory;
};

export const services: Service[] = [
  // --- A. ATENCIÓN MÉDICA CLÍNICA ---
  {
    slug: "gineco-obstetricia",
    title: "Servicio de Gineco-Obstetricia",
    summary:
      "Atención integral y preventiva para tu salud ginecológica en cada etapa de vida.",
    description: [
      "Brindamos atención ginecológica a la mujer en sus diferentes etapas de vida, desde una atención integral, preventiva y centrada en el bienestar físico, emocional, hormonal y corporal.",
    ],
    image: "/assets/servicios/neoser-334.webp",
    category: "medica",
  },
  {
    slug: "atencion-prenatal",
    title: "Atención Prenatal",
    summary:
      "Cuidado integral de madre y bebé con enfoque perinatal y participación familiar.",
    description: [
      "Brindamos atención prenatal orientada al cuidado integral de la madre y el bebé, promoviendo la salud materna y fetal, la salud mental perinatal, la educación perinatal y la preparación consciente para el nacimiento, junto a la participación activa de la pareja y familia.",
    ],
    image: "/assets/servicios/neoser-330.webp",
    category: "medica",
  },
  {
    slug: "partos-humanizados",
    title: "Atención de Partos Humanizados",
    summary:
      "Acompañamiento del nacimiento respetando los derechos biológicos de mamá y bebé.",
    description: [
      "Atendemos el nacimiento desde una mirada centrada en los derechos biológicos de la madre y su bebé, promoviendo la cero separación durante los primeros mil minutos de vida, el contacto piel con piel inmediato, el corte oportuno del cordón umbilical y el inicio temprano de la lactancia materna.",
      "Estas prácticas favorecen el vínculo temprano, la adaptación neonatal, el desarrollo de la microbiota y el bienestar físico y emocional de la madre y el bebé.",
    ],
    image: "/assets/servicios/DSC_8490.webp",
    category: "medica",
  },
  {
    slug: "cesareas-humanizadas",
    title: "Atención de Cesáreas Humanizadas",
    summary:
      "Cesárea Túnel: piel con piel inmediato y cero separación durante el nacimiento.",
    description: [
      "Desde 2020 implementamos la Cesárea Humanizada Túnel, técnica innovadora que nos ha permitido favorecer el contacto piel con piel inmediato, la cero separación mamá-bebé, la recepción temprana del calostro y el inicio oportuno de la lactancia materna durante el nacimiento por cesárea.",
      "Estas prácticas promueven el desarrollo de la microbiota y un nacimiento centrado en los derechos biológicos de la madre y su bebé.",
    ],
    image: "/assets/servicios/cesarea-humanizada.webp",
    category: "medica",
  },

  // --- B. PROGRAMAS DE EDUCACIÓN SOMÁTICA ---
  {
    slug: "preparacion-integral-parto",
    title: "Programa de Preparación Integral para el Parto",
    summary:
      "Programa de 8-10 sesiones con tu pareja, basado en Educación Somática Prenatal.",
    description: [
      "Brindamos un programa basado en la Educación Somática Prenatal, orientado a acompañar a la gestante y su pareja mediante herramientas corporales, emocionales y neurobiológicas que favorecen la conciencia corporal, el movimiento, la respiración y el vínculo prenatal.",
      "A través de un programa personalizado de 8 a 10 sesiones teóricas y vivenciales, promovemos una preparación consciente para el nacimiento, facilitando un entorno de seguridad que favorezca el flujo hormonal del parto, la confianza corporal y una vivencia fisiológica del trabajo de parto.",
      "Integramos activamente a la pareja como acompañante clave del proceso, favoreciendo su participación en el sostén emocional, físico y relacional durante el embarazo, el nacimiento y el inicio de la lactancia materna.",
    ],
    image: "/assets/servicios/neoser-172.webp",
    category: "somatica",
  },
  {
    slug: "perine-y-movimiento",
    title: "Periné y Movimiento®",
    summary:
      "Método Calais-Germain para conciencia y cuidado del suelo pélvico.",
    description: [
      "Programa basado en la metodología de Anatomía para el Movimiento® de Blandine Calais-Germain, orientado a favorecer la conciencia y el cuidado del suelo pélvico mediante principios de educación somática, percepción corporal y biomecánica femenina.",
      "A través de ejercicios específicos, respiración consciente y movimiento guiado, este método contribuye a mejorar la postura, la movilidad y la integración del suelo pélvico con el cuerpo en movimiento, favoreciendo la prevención de prolapsos, incontinencia urinaria y otras disfunciones del periné, promoviendo el bienestar integral de la mujer en sus diferentes etapas de vida.",
    ],
    image: "/assets/servicios/neoser-4.webp",
    category: "somatica",
  },
  {
    slug: "rebozo-educacion-somatica",
    title: "Rebozo desde la Educación Somática",
    summary:
      "Uso consciente del rebozo como herramienta de movimiento y sostén.",
    description: [
      "Programa basado en la educación somática y el uso consciente del rebozo como herramienta de percepción corporal, movimiento y sostén, orientado a favorecer la conciencia corporal, la movilidad, la respiración y la autorregulación física y emocional de la mujer.",
      "A través del balanceo, la suspensión, el movimiento guiado y las técnicas de sostén con rebozo, este método contribuye al bienestar integral durante el embarazo, parto y posparto, favoreciendo una vivencia más consciente del cuerpo, el nacimiento y la maternidad.",
    ],
    image: "/assets/servicios/neoser-108.webp",
    category: "somatica",
  },
  {
    slug: "canto-prenatal",
    title: "Canto Prenatal® desde la Psicofonía de Marie-Louise Aucher",
    summary:
      "Psicofonía de Marie-Louise Aucher: voz, vibración y vínculo prenatal.",
    description: [
      "Programa basado en la Psicofonía de Marie-Louise Aucher, metodología que utiliza la vibración de la voz, el canto y la conciencia corporal para favorecer la percepción vibratoria del cuerpo, la respiración, la relajación y el vínculo prenatal.",
      "A través de la práctica vocal consciente, este método contribuye al bienestar físico y emocional de la gestante, favorece la movilidad y apertura corporal para el nacimiento, fortalece la comunicación afectiva con el bebé y promueve una vivencia más consciente de la gestación y el parto.",
    ],
    image: "/assets/servicios/neoser-157.webp",
    category: "somatica",
  },
  {
    slug: "somaesfera",
    title: "SomaEsfera® Movimiento Somático con Balones",
    summary:
      "Movimiento somático con balones para embarazo, parto y postparto.",
    description: [
      "Programa corporal basado en principios de educación somática y movimiento consciente con balones, orientado a favorecer la conciencia corporal, el bienestar físico y emocional y la preparación corporal durante el embarazo, parto y postparto.",
      "A través del movimiento, la respiración y la exploración corporal, favorecemos el descubrimiento de los puntos de apoyo y su integración con las diferentes partes del cuerpo, promoviendo la relajación, la movilidad y el alivio de tensiones físicas durante las diferentes etapas de la maternidad.",
      "Integramos además la participación activa de la pareja como acompañante y sostén durante el proceso de gestación, nacimiento y postparto.",
    ],
    image: "/assets/servicios/neoser-132.webp",
    category: "somatica",
  },

  // --- C. ACOMPAÑAMIENTO Y COMUNIDAD ---
  {
    slug: "lactancia-prenatal",
    title: "Consejería y Asesoría en Lactancia Prenatal",
    summary:
      "Preparación consciente para una lactancia informada desde el embarazo.",
    description: [
      "Programa orientado a preparar a la gestante y su familia para el inicio fisiológico de la lactancia materna desde el embarazo, favoreciendo una comprensión consciente de las primeras horas de vida del bebé y la importancia del contacto piel con piel, la cero separación y la recepción temprana del calostro.",
      "A través de sesiones educativas y vivenciales, se abordan aspectos relacionados con el agarre, las posiciones de amamantamiento, la producción de leche y las necesidades biológicas del recién nacido, promoviendo el vínculo temprano, el desarrollo de la microbiota y una lactancia informada y respetada.",
    ],
    image: "/assets/servicios/lactancia-prenatal.webp",
    category: "comunidad",
  },
  {
    slug: "circulos-meditacion",
    title: "Círculos de Meditación – Mamá NeoSer",
    summary:
      "Espacios quincenales de meditación y conexión para madres NeoSer.",
    description: [
      "Espacios de encuentro y acompañamiento para madres, orientados a favorecer la conexión emocional, espiritual y corporal a través de la meditación, el dibujo consciente y técnicas de contención con fulares.",
      "Cada 15 días compartimos meditaciones inspiradas en la historia de vida de la Sagrada Familia, promoviendo espacios de pausa, escucha, sostén emocional y reflexión en comunidad.",
      "A través de la respiración, el movimiento suave, el arte y el compartir entre madres, favorecemos experiencias de bienestar, contención y conexión consigo mismas y con su maternidad desde una mirada sensible y respetuosa.",
    ],
    image: "/assets/servicios/IMG_2544.webp",
    category: "comunidad",
  },
];

export const categoryLabels: Record<
  ServiceCategory,
  { title: string; tag: string; description: string }
> = {
  medica: {
    tag: "Atención clínica",
    title: "Atención Médica Humanizada",
    description:
      "Servicios médicos especializados con enfoque humanizado, centrados en los derechos biológicos de mamá y bebé.",
  },
  somatica: {
    tag: "Programas vivenciales",
    title: "Educación Somática",
    description:
      "Programas corporales y vivenciales para gestantes y sus parejas, basados en metodologías internacionales reconocidas.",
  },
  comunidad: {
    tag: "Acompañamiento",
    title: "Comunidad y Soporte",
    description:
      "Espacios de encuentro y consejería que sostienen a la mujer durante el embarazo, el parto y la maternidad.",
  },
};
