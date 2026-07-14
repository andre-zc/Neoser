export type ServiceCategory = "medica" | "somatica" | "comunidad";

// Diapositiva del carrusel de detalle ("Ver más"): foto + título + texto.
// `image` es opcional: si la foto aún no fue enviada por el cliente, el
// carrusel muestra un marcador "Foto próximamente" en vez de una imagen rota.
export type GallerySlide = {
  image?: string; // path relativo a /public; ausente => placeholder
  title: string;
  text?: string; // párrafo descriptivo (opcional)
  // Encuadre del object-cover (ej. "center 30%"). Default: center.
  objectPosition?: string;
};

// Pilar / beneficio destacado del servicio (tarjeta con ícono en el detalle).
// `icon` es la clave de un ícono de lucide-react mapeado en la página de detalle.
export type ServiceBenefit = { icon: string; title: string; text: string };

// Pregunta frecuente del servicio (acordeón nativo en el detalle).
export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  summary: string; // 1-2 líneas para la home
  description: string[]; // lead corto para "Sobre este servicio" (se muestra el primero)
  // Resumen corto para la tarjeta del catálogo /servicios (primera impresión).
  // Si falta, la tarjeta usa `description` completo como fallback.
  cardDescription?: string[];
  image: string; // path relativo a /public (portada catálogo / carrusel home)
  // Portada exclusiva del hero en /servicios/[slug]. Si falta, usa `image`.
  detailImage?: string;
  gallery?: GallerySlide[]; // carrusel de fotos con texto en el detalle
  category: ServiceCategory;
  // Orientación nativa de la foto. Default "horizontal" (contenedor 4:3).
  // "vertical" cambia el contenedor a 2:3 para que la foto encaje sin recortes.
  imageOrientation?: "horizontal" | "vertical";
  // --- Contenido enriquecido para la página de detalle ("Ver más") ---
  benefits?: ServiceBenefit[]; // pilares con ícono (3-4)
  included?: string[]; // "¿Qué incluye?" (checklist)
  forWho?: string; // "¿Para quién es?" (1 línea)
  faq?: ServiceFaq[]; // preguntas frecuentes
};

export const services: Service[] = [
  // --- A. ATENCIÓN MÉDICA CLÍNICA ---
  {
    slug: "gineco-obstetricia",
    title: "Servicio de Gineco-Obstetricia",
    summary:
      "Atención integral y preventiva para tu salud ginecológica en cada etapa de vida.",
    description: [
      "Atención ginecológica integral y preventiva, centrada en tu bienestar físico, emocional, hormonal y corporal en cada etapa de la vida.",
    ],
    image: "/assets/servicios/gineco-obstetra-01.png",
    gallery: [
      {
        image: "/assets/servicios/gineco-obstetra-01.png",
        title: "Ginecología Integral para la Mujer",
        text: "Acompañamos a la mujer en cada etapa de su vida con una atención ginecológica preventiva, integral y personalizada, orientada al bienestar físico, hormonal, emocional y corporal.",
      },
      {
        image: "/assets/servicios/IMG_9777.jpg",
        title: "Atención Interdisciplinaria y Familiar",
        text: "El trabajo conjunto de nuestros profesionales y la participación activa de la familia fortalecen la confianza, el bienestar y una vivencia respetuosa de la maternidad.",
        // Baja el encuadre: cabezas enteras + más barriguita visible
        objectPosition: "center 38%",
      },
      {
        image: "/assets/servicios/gineco-bienestar-edad.png",
        title: "Tu bienestar no tiene edad",
        text: "Que los cambios propios de los años no limiten tu bienestar ni tu vida cotidiana. Te acompañamos con prevención, evaluación y cuidado del suelo pélvico en cada etapa de la vida.",
        objectPosition: "center 40%",
      },
      {
        image: "/assets/servicios/MG_0639.jpg",
        title: "Cuando la cirugía es necesaria, estás en buenas manos",
        text: "Contamos con un equipo médico especializado en el tratamiento quirúrgico de enfermedades ginecológicas, priorizando tu seguridad, bienestar y recuperación.",
      },
    ],
    category: "medica",
    benefits: [
      {
        icon: "Stethoscope",
        title: "Atención integral y preventiva",
        text: "Evaluamos tu salud ginecológica de forma completa y con enfoque preventivo en cada etapa: adolescencia, edad fértil, gestación y madurez.",
      },
      {
        icon: "HeartHandshake",
        title: "Mirada humanizada",
        text: "Te escuchamos sin prisa y acompañamos tus decisiones, cuidando por igual tu bienestar físico, hormonal y emocional.",
      },
      {
        icon: "ShieldCheck",
        title: "Cirugía segura cuando se necesita",
        text: "Equipo especializado en el tratamiento quirúrgico de enfermedades ginecológicas, priorizando tu seguridad y recuperación.",
      },
    ],
    included: [
      "Control ginecológico preventivo y tamizaje",
      "Acompañamiento de la salud hormonal en cada etapa",
      "Evaluación y cuidado del suelo pélvico",
      "Orientación en planificación familiar",
      "Tratamiento quirúrgico especializado cuando es necesario",
    ],
    forWho:
      "Mujeres de toda edad que buscan una atención ginecológica preventiva, cercana y respetuosa.",
    faq: [
      {
        q: "¿Cada cuánto debo hacerme un control ginecológico?",
        a: "Como referencia general, una vez al año; tu profesional ajustará la frecuencia según tu edad, antecedentes y etapa de vida.",
      },
      {
        q: "¿Atienden también a adolescentes y a mujeres en menopausia?",
        a: "Sí. Acompañamos la salud ginecológica en todas las etapas, desde la adolescencia hasta la madurez.",
      },
    ],
  },
  {
    slug: "atencion-prenatal",
    title: "Atención Prenatal",
    summary:
      "Cuidado integral de madre y bebé con enfoque perinatal y participación familiar.",
    description: [
      "Controles prenatales centrados en madre, bebé y familia, con educación perinatal y participación activa de la pareja.",
    ],
    image: "/assets/servicios/MG_9793.jpg",
    gallery: [
      {
        image: "/assets/servicios/MG_9793.jpg",
        title: "Atención prenatal integral, humanizada y centrada en la familia.",
      },
      {
        image: "/assets/servicios/MG_9764.jpg",
        title: "Tu cuerpo, el primer hogar de tu bebé",
        text: "El bienestar de tu bebé comienza durante el embarazo. Cuidar la salud materna es construir bases sólidas para su desarrollo y crecimiento.",
      },
      {
        image: "/assets/servicios/neoser-330-opt.webp",
        title: "La tranquilidad de saber que tu bebé está bien",
        text: "Cada control prenatal te permite disfrutar el embarazo con más calma, confianza y seguridad.",
      },
      {
        image: "/assets/servicios/atencion-prenatal-04.png",
        title: "Tu cuerpo se prepara, tu bebé encuentra su lugar",
        text: "Favorecemos el equilibrio de tu cuerpo para crear mejores condiciones para el nacimiento de tu bebé.",
      },
    ],
    category: "medica",
    benefits: [
      {
        icon: "Baby",
        title: "Bienestar de madre y bebé",
        text: "Cuidamos tu salud y la de tu bebé en cada control, sentando bases sólidas para su desarrollo y crecimiento.",
      },
      {
        icon: "Brain",
        title: "Salud mental y educación perinatal",
        text: "Acompañamos tu bienestar emocional y te preparamos con información consciente para el nacimiento.",
      },
      {
        icon: "Users",
        title: "Participación de la pareja",
        text: "Integramos activamente a tu pareja durante todo el proceso, como sostén y acompañante clave.",
      },
    ],
    included: [
      "Controles prenatales con enfoque integral",
      "Educación perinatal y preparación para el nacimiento",
      "Acompañamiento de la salud mental materna",
      "Seguimiento del bienestar y la posición del bebé",
      "Orientación a la pareja y la familia",
    ],
    forWho:
      "Gestantes y parejas que desean vivir el embarazo de forma informada, acompañada y consciente.",
    faq: [
      {
        q: "¿Desde qué semana puedo iniciar el control prenatal?",
        a: "Lo ideal es iniciar apenas confirmas el embarazo; mientras más temprano, mejor podemos acompañar tu bienestar y el de tu bebé.",
      },
      {
        q: "¿Mi pareja puede asistir a los controles?",
        a: "Sí, y lo promovemos. La participación de la pareja fortalece el vínculo y el sostén durante todo el proceso.",
      },
    ],
  },
  {
    slug: "partos-humanizados",
    title: "Atención de Partos Humanizados",
    summary:
      "Acompañamiento del nacimiento respetando los derechos biológicos de mamá y bebé.",
    description: [
      "Acompañamos el nacimiento respetando la fisiología del parto, con libertad de movimiento, piel con piel inmediato y cero separación en los primeros minutos de vida.",
    ],
    cardDescription: [
      "Vivimos el nacimiento como el inicio de una nueva historia familiar, respetando los derechos anatómicos y biológicos de la madre y su bebé.",
      "Protegemos la Hora Dorada, la continuidad del vínculo durante los primeros mil minutos de vida y el inicio temprano de la lactancia materna.",
    ],
    image: "/assets/servicios/partos-humanizados-01.png",
    gallery: [
      {
        image: "/assets/servicios/partos-humanizados-01.png",
        title: "Protegemos el primer encuentro",
        text: "Los primeros minutos de vida son decisivos. El contacto piel con piel inmediato fortalece el vínculo y favorece la adaptación del bebé desde el nacimiento.",
      },
      {
        image: "/assets/servicios/partos-humanizados-02.png",
        title: "Nacer es encontrar a mamá",
        text: "El instinto guía al bebé hacia el calor, la voz y la protección de su madre desde el primer instante.",
      },
      {
        image: "/assets/servicios/partos-humanizados-03.png",
        title: "Aquí también nace una familia",
        text: "Con el nacimiento de un bebé, nace y renace una familia. Protegemos ese primer encuentro.",
      },
      {
        image: "/assets/servicios/partos-humanizados-04.png",
        title: "El nacimiento también construye futuro",
        text: "Las primeras experiencias de vida dejan huellas en la salud, el vínculo y el bienestar de la madre, su bebé y su familia.",
      },
    ],
    category: "medica",
    benefits: [
      {
        icon: "Activity",
        title: "Libertad de movimiento",
        text: "Respetamos la fisiología del parto mediante la libertad de movimiento y las posiciones verticales, favoreciendo el proceso natural del nacimiento.",
      },
      {
        icon: "HeartHandshake",
        title: "Hora Dorada y cero separación",
        text: "Protegemos el contacto piel con piel inmediato, el corte oportuno del cordón umbilical y la continuidad del vínculo durante los primeros mil minutos de vida.",
      },
      {
        icon: "Droplets",
        title: "Lactancia desde el nacimiento",
        text: "Promovemos el inicio temprano de la lactancia materna para favorecer un comienzo de vida saludable.",
      },
    ],
    included: [
      "Atención que respeta los derechos anatómicos y biológicos de la madre y su bebé",
      "Libertad de movimiento y atención del parto en posiciones verticales",
      "Hora Dorada: contacto piel con piel inmediato",
      "Corte oportuno del cordón umbilical",
      "Inicio temprano de la lactancia materna",
      "Protección de los primeros mil minutos de vida para favorecer el vínculo y la adaptación neonatal",
    ],
    forWho:
      "Familias que buscan un nacimiento respetado, centrado en los derechos de la madre y su bebé.",
    faq: [
      {
        q: "¿Qué significa “parto humanizado”?",
        a: "Es atender el nacimiento respetando la fisiología y los derechos de la madre y el bebé: libertad de movimiento, acompañamiento, piel con piel y mínima intervención innecesaria.",
      },
      {
        q: "¿Y si surge una complicación?",
        a: "Contamos con un equipo médico que vela por tu seguridad y la de tu bebé en todo momento; el respeto convive con la atención profesional ante cualquier necesidad.",
      },
    ],
  },
  {
    slug: "cesareas-humanizadas",
    title: "Atención de Cesáreas Humanizadas",
    summary:
      "Cesárea Túnel: piel con piel inmediato y cero separación durante el nacimiento.",
    description: [
      "Cuando la cesárea es la opción más segura, la vivimos de forma humanizada: el bebé llega directo al pecho de mamá, con piel con piel y acompañamiento de la pareja.",
    ],
    cardDescription: [
      "Desde 2020 implementamos la Cesárea Humanizada Túnel, técnica innovadora que nos ha permitido favorecer el contacto piel con piel inmediato, la cero separación mamá-bebé, la recepción temprana del calostro y el inicio oportuno de la lactancia materna durante el nacimiento por cesárea.",
    ],
    image: "/assets/servicios/cesareas-humanizadas-01.png",
    detailImage: "/assets/servicios/cesareas-humanizadas-portada.png",
    gallery: [
      {
        image: "/assets/servicios/cesareas-humanizadas-01.png",
        title: "Del vientre al pecho de mamá",
        text: "Cesárea Humanizada Túnel. Protegemos el primer encuentro.",
      },
      {
        image: "/assets/servicios/cesareas-humanizadas-02.png",
        title: "Piel con piel desde el primer instante",
        text: "El embarazo prepara biológicamente a la madre para recibir a su bebé sobre su pecho. El contacto inmediato da continuidad a este proceso, favoreciendo la salud integral del bebé.",
      },
      {
        image: "/assets/servicios/cesareas-humanizadas-03.png",
        title: "Juntos desde el primer instante",
        text: "El nacimiento de un bebé es la expresión más profunda del amor de una familia.",
      },
      {
        image: "/assets/servicios/cesareas-humanizadas-04.png",
        title: "Respetamos la Hora Dorada",
        text: "La primera hora de vida marca el comienzo de los primeros mil minutos, un periodo fundamental para la adaptación del bebé, el vínculo y la lactancia materna.",
      },
    ],
    category: "medica",
    benefits: [
      {
        icon: "HeartHandshake",
        title: "Cesárea Túnel desde 2020",
        text: "Técnica innovadora que favorece el contacto piel con piel inmediato durante el nacimiento por cesárea.",
      },
      {
        icon: "Baby",
        title: "Cero separación mamá-bebé",
        text: "Recepción temprana del calostro e inicio oportuno de la lactancia, incluso en quirófano.",
      },
      {
        icon: "Sparkles",
        title: "Microbiota y derechos biológicos",
        text: "Promovemos el desarrollo de la microbiota y un nacimiento centrado en los derechos de la madre y su bebé.",
      },
    ],
    included: [
      "Cesárea humanizada con técnica túnel",
      "Participación de la pareja",
      "Contacto piel con piel inmediato y cero separación",
      "Recepción temprana del calostro e inicio oportuno de la lactancia materna",
      "Acompañamiento de una asesora de lactancia",
    ],
    forWho:
      "Mujeres con indicación de cesárea que desean vivir el nacimiento de forma respetada y cercana.",
    faq: [
      {
        q: "¿En una cesárea también puede haber piel con piel?",
        a: "Sí. Con la Cesárea Humanizada Túnel favorecemos el contacto piel con piel inmediato y la cero separación durante el nacimiento.",
      },
      {
        q: "¿Desde cuándo aplican esta técnica?",
        a: "Desde 2020, con resultados que favorecen el vínculo, la lactancia y la adaptación del bebé.",
      },
    ],
  },

  // --- B. PROGRAMAS DE EDUCACIÓN SOMÁTICA ---
  {
    slug: "preparacion-integral-parto",
    title: "Programa de Preparación Integral para el Parto",
    summary:
      "Programa de 8-10 sesiones con tu pareja, basado en Educación Somática Prenatal.",
    description: [
      "Programa de 8 a 10 sesiones con tu pareja, basado en Educación Somática Prenatal, para prepararte de forma consciente al nacimiento.",
    ],
    image: "/assets/servicios/neoser-172.webp",
    gallery: [
      {
        image: "/assets/servicios/preparacion-parto-01.png",
        title: "Aprende a acompañar el trabajo de parto",
        text: "Practicamos posiciones, movimiento y técnicas de alivio con tu pareja, para que lleguen al nacimiento con herramientas concretas.",
      },
      {
        image: "/assets/servicios/preparacion-parto-02.png",
        title: "Conciencia corporal y vínculo prenatal",
        text: "Respiración, presencia y conexión con tu bebé: un espacio para integrar cuerpo, emoción y acompañamiento de la pareja.",
      },
      {
        image: "/assets/servicios/preparacion-parto-03.png",
        title: "Entiende cómo nace tu bebé",
        text: "Sesiones teóricas y vivenciales para comprender la biomecánica del nacimiento y ganar confianza en tu cuerpo.",
      },
      {
        image: "/assets/servicios/preparacion-parto-04.png",
        title: "Tu pareja, un sostén activo",
        text: "Integramos a tu pareja en el acompañamiento físico y emocional, para vivir el nacimiento en equipo.",
      },
    ],
    category: "somatica",
    benefits: [
      {
        icon: "Activity",
        title: "Educación Somática Prenatal",
        text: "Herramientas corporales, emocionales y neurobiológicas para conectar con tu cuerpo y tu bebé.",
      },
      {
        icon: "Calendar",
        title: "8 a 10 sesiones personalizadas",
        text: "Un programa teórico-vivencial que se adapta a ti, a tu proceso y a tu ritmo.",
      },
      {
        icon: "Users",
        title: "La pareja como acompañante clave",
        text: "Integramos a tu pareja en el sostén emocional, físico y relacional de todo el proceso.",
      },
    ],
    included: [
      "Programa personalizado de 8 a 10 sesiones",
      "Sesiones teóricas y vivenciales",
      "Trabajo de respiración, movimiento y conciencia corporal",
      "Preparación del flujo hormonal del parto",
      "Acompañamiento activo de la pareja",
    ],
    forWho:
      "Gestantes y parejas que quieren prepararse de forma consciente y activa para el nacimiento.",
    faq: [
      {
        q: "¿Cuándo conviene empezar el programa?",
        a: "Idealmente durante el segundo o tercer trimestre, para tener tiempo de integrar las herramientas antes del parto.",
      },
      {
        q: "¿Necesito experiencia previa en movimiento o respiración?",
        a: "No. El programa es vivencial y se adapta a tu punto de partida, paso a paso.",
      },
    ],
  },
  {
    slug: "perine-y-movimiento",
    title: "Periné y Movimiento®",
    summary:
      "Método Calais-Germain para conciencia y cuidado del suelo pélvico.",
    description: [
      "Método Anatomía para el Movimiento® de Blandine Calais-Germain: conciencia y cuidado del suelo pélvico con educación somática y biomecánica femenina.",
    ],
    image: "/assets/servicios/neoser-4.webp",
    gallery: [
      {
        image: "/assets/servicios/perine-movimiento-01.png",
        title: "Movimiento guiado y percepción corporal",
        text: "Ejercicios específicos que integran el suelo pélvico con el cuerpo en movimiento, en un entorno que favorece la conciencia y el bienestar.",
      },
      {
        image: "/assets/servicios/perine-movimiento-02.png",
        title: "Educación somática del periné",
        text: "Trabajamos la percepción y el cuidado del suelo pélvico con herramientas concretas, siguiendo la metodología de Anatomía para el Movimiento®.",
      },
      {
        image: "/assets/servicios/perine-movimiento-03.png",
        title: "Postura, equilibrio y movilidad",
        text: "Mejoramos la postura y la movilidad mediante respiración consciente y movimiento guiado, adaptado a cada etapa de la vida.",
      },
      {
        image: "/assets/servicios/perine-movimiento-04.png",
        title: "Biomecánica femenina en práctica",
        text: "Exploramos la anatomía en movimiento para integrar el suelo pélvico de forma segura, consciente y respetuosa con tu cuerpo.",
      },
      {
        image: "/assets/servicios/perine-movimiento-05.png",
        title: "Prevención y bienestar integral",
        text: "Favorecemos la prevención de prolapsos, incontinencia urinaria y otras disfunciones del periné, cuidando tu bienestar en cada etapa.",
      },
    ],
    category: "somatica",
    benefits: [
      {
        icon: "Flower2",
        title: "Anatomía para el Movimiento®",
        text: "Metodología de Blandine Calais-Germain orientada a la conciencia y el cuidado del suelo pélvico.",
      },
      {
        icon: "ShieldCheck",
        title: "Prevención de disfunciones",
        text: "Ayuda a prevenir prolapsos, incontinencia urinaria y otras disfunciones del periné.",
      },
      {
        icon: "Activity",
        title: "Conciencia y movilidad",
        text: "Mejora la postura, la movilidad y la integración del suelo pélvico con el cuerpo en movimiento.",
      },
    ],
    included: [
      "Principios de educación somática y percepción corporal",
      "Biomecánica femenina del suelo pélvico",
      "Ejercicios específicos y respiración consciente",
      "Movimiento guiado para la integración corporal",
      "Enfoque preventivo y de bienestar en cada etapa de la vida",
    ],
    forWho:
      "Mujeres en cualquier etapa de la vida que quieren conocer y cuidar su suelo pélvico.",
    faq: [
      {
        q: "¿Sirve también después del parto?",
        a: "Sí. El método acompaña el bienestar del periné en todas las etapas: antes, durante y después del embarazo.",
      },
      {
        q: "¿Es solo para quienes ya tienen molestias?",
        a: "No. Es tanto preventivo como de acompañamiento; conocer tu suelo pélvico es útil siempre.",
      },
    ],
  },
  {
    slug: "rebozo-educacion-somatica",
    title: "Rebozo desde la Educación Somática",
    summary:
      "Uso consciente del rebozo como herramienta de movimiento y sostén.",
    description: [
      "Uso consciente del rebozo como herramienta de percepción, movimiento y sostén, para acompañar el bienestar en el embarazo, parto y posparto.",
    ],
    image: "/assets/servicios/neoser-108.webp",
    gallery: [
      {
        image: "/assets/servicios/rebozo-somatica-01.png",
        title: "Suspensión y movimiento guiado",
        text: "El rebozo acompaña el movimiento y la movilidad, favoreciendo una vivencia más consciente del cuerpo durante el embarazo.",
      },
      {
        image: "/assets/servicios/rebozo-somatica-02.png",
        title: "Sostén y balanceo con tu pareja",
        text: "Practicamos técnicas de sostén y balanceo para integrar a la pareja como acompañante clave del proceso.",
      },
      {
        image: "/assets/servicios/rebozo-somatica-03.png",
        title: "Técnicas de sostén en la práctica",
        text: "Aprendes a usar el rebozo como herramienta de percepción corporal, movimiento y sostén en embarazo, parto y posparto.",
      },
      {
        image: "/assets/servicios/rebozo-somatica-04.png",
        title: "Conciencia corporal y autorregulación",
        text: "Favorecemos la respiración, la calma y la autorregulación física y emocional a través del uso consciente del rebozo.",
      },
    ],
    category: "somatica",
    benefits: [
      {
        icon: "Wind",
        title: "Sostén y movimiento consciente",
        text: "El rebozo como herramienta de percepción corporal, balanceo y suspensión.",
      },
      {
        icon: "HeartHandshake",
        title: "Autorregulación física y emocional",
        text: "Favorece la conciencia corporal, la respiración y la calma durante el proceso.",
      },
      {
        icon: "Baby",
        title: "Embarazo, parto y posparto",
        text: "Acompaña una vivencia más consciente del cuerpo, el nacimiento y la maternidad.",
      },
    ],
    included: [
      "Técnicas de sostén y balanceo con rebozo",
      "Suspensión y movimiento guiado",
      "Trabajo de respiración y conciencia corporal",
      "Aplicaciones para embarazo, parto y posparto",
    ],
    forWho:
      "Gestantes y mujeres en posparto que buscan sostén corporal y bienestar a través del rebozo.",
    faq: [
      {
        q: "¿Qué es el rebozo?",
        a: "Es un tejido tradicional usado como herramienta de sostén, balanceo y movimiento que favorece la relajación y el bienestar corporal.",
      },
      {
        q: "¿Se usa durante el trabajo de parto?",
        a: "Sí, entre otros momentos. Las técnicas de sostén y balanceo pueden acompañar el embarazo, el parto y el posparto.",
      },
    ],
  },
  {
    slug: "canto-prenatal",
    title: "Canto Prenatal® desde la Psicofonía de Marie-Louise Aucher",
    summary:
      "Psicofonía de Marie-Louise Aucher: voz, vibración y vínculo prenatal.",
    description: [
      "Psicofonía de Marie-Louise Aucher: voz, canto y conciencia corporal para fortalecer el vínculo prenatal y la preparación al nacimiento.",
    ],
    image: "/assets/servicios/neoser-157.webp",
    gallery: [
      {
        image: "/assets/servicios/canto-prenatal-01.png",
        title: "Voz, respiración y vínculo prenatal",
        text: "La práctica vocal consciente favorece la percepción vibratoria del cuerpo, la relajación y la comunicación afectiva con tu bebé.",
      },
    ],
    category: "somatica",
    benefits: [
      {
        icon: "Music",
        title: "Psicofonía de Marie-Louise Aucher",
        text: "La vibración de la voz y el canto al servicio de la percepción corporal y el vínculo.",
      },
      {
        icon: "Wind",
        title: "Respiración y relajación",
        text: "La práctica vocal consciente favorece la movilidad y la apertura corporal para el nacimiento.",
      },
      {
        icon: "HeartHandshake",
        title: "Vínculo con tu bebé",
        text: "Fortalece la comunicación afectiva con tu bebé desde la gestación.",
      },
    ],
    included: [
      "Fundamentos de la Psicofonía",
      "Trabajo vibratorio de la voz y el canto",
      "Respiración consciente y relajación",
      "Conexión y vínculo prenatal",
    ],
    forWho:
      "Gestantes que desean conectar con su bebé y su cuerpo a través de la voz y el canto.",
    faq: [
      {
        q: "¿Necesito saber cantar?",
        a: "No. No se trata de afinar, sino de usar la voz y la vibración como herramientas de conexión y bienestar.",
      },
      {
        q: "¿El bebé realmente percibe el canto?",
        a: "Sí. Desde la gestación el bebé percibe la vibración de la voz materna, lo que fortalece el vínculo afectivo.",
      },
    ],
  },
  {
    slug: "somaesfera",
    title: "SomaEsfera® Movimiento Somático con Balones para el Embarazo, Parto y Postparto",
    summary:
      "Movimiento somático con balones para embarazo, parto y postparto.",
    description: [
      "Movimiento somático con balones para favorecer conciencia corporal, relajación y preparación en el embarazo, parto y postparto, con participación de la pareja.",
    ],
    image: "/assets/servicios/neoser-132.webp",
    gallery: [
      {
        image: "/assets/servicios/somaesfera-01.png",
        title: "Movimiento consciente con balones",
        text: "Exploramos el cuerpo en movimiento para favorecer la conciencia corporal, la relajación y la preparación durante el embarazo, parto y postparto.",
      },
      {
        image: "/assets/servicios/somaesfera-02.png",
        title: "Puntos de apoyo y alivio de tensiones",
        text: "A través del movimiento y la respiración, favorecemos el descubrimiento de los puntos de apoyo y el alivio de tensiones físicas.",
      },
      {
        image: "/assets/servicios/somaesfera-03.png",
        title: "La pareja como acompañante y sostén",
        text: "Integramos la participación activa de la pareja durante la gestación, el nacimiento y el postparto.",
      },
      {
        image: "/assets/servicios/somaesfera-04.png",
        title: "Educación somática en la práctica",
        text: "Comprendes cómo el movimiento con balones se integra con tu cuerpo en cada etapa de la maternidad.",
      },
    ],
    category: "somatica",
    benefits: [
      {
        icon: "Activity",
        title: "Movimiento somático con balones",
        text: "Exploración corporal con balones para favorecer los puntos de apoyo, la relajación y la movilidad.",
      },
      {
        icon: "Sparkles",
        title: "Alivio de tensiones",
        text: "Ayuda a descubrir puntos de apoyo y a aliviar tensiones físicas en cada etapa de la maternidad.",
      },
      {
        icon: "Users",
        title: "Acompañamiento en pareja",
        text: "Integra a la pareja como sostén durante la gestación, el nacimiento y el postparto.",
      },
    ],
    included: [
      "Principios de educación somática con balones",
      "Exploración de los puntos de apoyo del cuerpo",
      "Respiración y movimiento consciente",
      "Aplicaciones para embarazo, parto y postparto",
      "Participación activa de la pareja",
    ],
    forWho:
      "Gestantes y parejas que buscan bienestar corporal y preparación a través del movimiento con balones.",
    faq: [
      {
        q: "¿Qué es SomaEsfera®?",
        a: "Es un programa de movimiento somático con balones orientado a la conciencia corporal y el bienestar durante el embarazo, parto y postparto.",
      },
      {
        q: "¿Es seguro durante el embarazo?",
        a: "Sí. El trabajo es suave, guiado y adaptado a cada etapa de la gestación.",
      },
    ],
  },

  // --- C. ACOMPAÑAMIENTO Y COMUNIDAD ---
  {
    slug: "lactancia-prenatal",
    title: "Consejería y Asesoría en Lactancia Prenatal",
    summary:
      "Preparación consciente para una lactancia informada desde el embarazo.",
    description: [
      "Preparación desde el embarazo para el inicio fisiológico de la lactancia: piel con piel, cero separación y recepción temprana del calostro.",
    ],
    image: "/assets/servicios/MG_4392.jpg",
    gallery: [
      {
        image: "/assets/servicios/lactancia-prenatal-01.png",
        title: "Piel con piel y el inicio de la lactancia",
        text: "Prepararte desde el embarazo para las primeras horas de vida: cero separación, calostro y un vínculo temprano informado y respetado.",
      },
    ],
    category: "comunidad",
    benefits: [
      {
        icon: "Droplets",
        title: "Lactancia desde el embarazo",
        text: "Preparación consciente para el inicio fisiológico de la lactancia materna.",
      },
      {
        icon: "Baby",
        title: "Las primeras horas de vida",
        text: "Comprende la importancia del piel con piel, la cero separación y la recepción temprana del calostro.",
      },
      {
        icon: "HeartHandshake",
        title: "Lactancia informada y respetada",
        text: "Agarre, posiciones y necesidades del recién nacido, promoviendo el vínculo temprano.",
      },
    ],
    included: [
      "Sesiones educativas y vivenciales",
      "Técnicas de agarre y posiciones de amamantamiento",
      "Producción de leche y necesidades del recién nacido",
      "Importancia del calostro y el contacto piel con piel",
    ],
    forWho:
      "Gestantes y familias que quieren prepararse para una lactancia informada y exitosa.",
    faq: [
      {
        q: "¿Por qué prepararme para la lactancia antes de que nazca el bebé?",
        a: "Porque las primeras horas son clave. Llegar informada facilita el inicio fisiológico de la lactancia y previene dificultades comunes.",
      },
      {
        q: "¿Pueden participar otros miembros de la familia?",
        a: "Sí. El acompañamiento de la familia es un sostén importante para una lactancia respetada.",
      },
    ],
  },
  {
    slug: "circulos-meditacion",
    title: "Círculos de Meditación – Mamá NeoSer",
    summary:
      "Espacios quincenales de meditación y conexión para madres NeoSer.",
    description: [
      "Espacios quincenales de meditación, dibujo consciente y contención con fulares, para conectar contigo y con tu maternidad en comunidad.",
    ],
    image: "/assets/servicios/IMG_2544-editada.png",
    gallery: [
      {
        image: "/assets/servicios/circulos-meditacion-01.png",
        title: "Dibujo consciente y expresión",
        text: "El arte como vía de conexión emocional y reflexión, en un espacio de pausa y bienestar entre madres.",
      },
      {
        image: "/assets/servicios/circulos-meditacion-02.png",
        title: "Comunidad Mamá NeoSer",
        text: "Compartimos entre madres desde una mirada sensible y respetuosa, favoreciendo contención y conexión con la maternidad.",
      },
      {
        image: "/assets/servicios/circulos-meditacion-03.png",
        title: "Meditación y reflexión en círculo",
        text: "Cada 15 días, espacios de escucha y reflexión inspirados en la historia de vida de la Sagrada Familia.",
      },
      {
        image: "/assets/servicios/circulos-meditacion-04.png",
        title: "Contención con fulares",
        text: "Técnicas de contención que favorecen la conexión emocional, espiritual y corporal a través del sostén y la presencia.",
      },
    ],
    category: "comunidad",
    benefits: [
      {
        icon: "Moon",
        title: "Pausa y conexión",
        text: "Espacios de meditación, escucha y sostén emocional pensados para madres.",
      },
      {
        icon: "Palette",
        title: "Arte y dibujo consciente",
        text: "El arte y el dibujo consciente como vías de expresión y bienestar.",
      },
      {
        icon: "Users",
        title: "Comunidad de madres",
        text: "Compartir entre madres desde una mirada sensible y respetuosa.",
      },
    ],
    included: [
      "Encuentros cada 15 días",
      "Meditaciones inspiradas en la Sagrada Familia",
      "Dibujo consciente y técnicas de contención con fulares",
      "Respiración, movimiento suave y compartir en comunidad",
    ],
    forWho:
      "Madres que buscan un espacio de pausa, contención emocional y conexión en comunidad.",
    faq: [
      {
        q: "¿Cada cuánto se realizan los círculos?",
        a: "Cada 15 días, en un espacio pensado para la pausa, la escucha y el sostén entre madres.",
      },
      {
        q: "¿Necesito experiencia en meditación?",
        a: "No. Los encuentros están guiados y son accesibles para todas, sin experiencia previa.",
      },
    ],
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
