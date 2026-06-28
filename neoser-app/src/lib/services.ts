export type ServiceCategory = "medica" | "somatica" | "comunidad";

// Diapositiva del carrusel de detalle ("Ver más"): foto + título + texto.
// `image` es opcional: si la foto aún no fue enviada por el cliente, el
// carrusel muestra un marcador "Foto próximamente" en vez de una imagen rota.
export type GallerySlide = {
  image?: string; // path relativo a /public; ausente => placeholder
  title: string;
  text?: string; // párrafo descriptivo (opcional)
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
  description: string[]; // párrafos completos para /servicios
  image: string; // path relativo a /public (portada)
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
      "Brindamos atención ginecológica a la mujer en sus diferentes etapas de vida, desde una atención integral, preventiva y centrada en el bienestar físico, emocional, hormonal y corporal.",
    ],
    image: "/assets/servicios/neoser-334.jpg",
    gallery: [
      {
        image: "/assets/servicios/neoser-334.jpg",
        title: "Ginecología Integral para la Mujer",
        text: "Acompañamos a la mujer en cada etapa de su vida con una atención ginecológica preventiva, integral y personalizada, orientada al bienestar físico, hormonal, emocional y corporal.",
      },
      {
        image: "/assets/servicios/IMG_9777.jpg",
        title: "Atención Interdisciplinaria y Familiar",
        text: "El trabajo conjunto de nuestros profesionales y la participación activa de la familia fortalecen la confianza, el bienestar y una vivencia respetuosa de la maternidad.",
      },
      {
        // Pendiente: foto por enviar (suelo pélvico / etapa madura)
        title: "Tu bienestar no tiene edad",
        text: "Que los cambios propios de los años no limiten tu bienestar ni tu vida cotidiana. Te acompañamos con prevención, evaluación y cuidado del suelo pélvico en cada etapa de la vida.",
      },
      {
        image: "/assets/servicios/MG_0639.jpg",
        title: "Cuando la cirugía es necesaria, estás en buenas manos",
        text: "Contamos con un equipo médico especializado en el tratamiento quirúrgico de enfermedades ginecológicas, priorizando tu seguridad, bienestar y recuperación.",
      },
    ],
    category: "medica",
    imageOrientation: "vertical",
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
      "Brindamos atención prenatal centrada en el bienestar integral de la madre, su bebé y su familia, promoviendo la salud mental, la educación perinatal y la preparación consciente para el nacimiento, con la participación activa de la pareja durante todo el proceso.",
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
        image: "/assets/servicios/neoser-310.jpg",
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
      "Atendemos el nacimiento desde una mirada que reconoce y protege los derechos anatómicos y biológicos de la madre y su bebé, promoviendo la libertad de movimiento, las posiciones verticales y el respeto por la fisiología del parto.",
      "Favorecemos la cero separación durante los primeros mil minutos de vida, el contacto piel con piel inmediato, el corte oportuno del cordón umbilical y el inicio temprano de la lactancia materna.",
      "Con estas prácticas protegemos el vínculo temprano entre la madre y su bebé, favorecemos la adaptación neonatal, el desarrollo de una microbiota saludable y el bienestar físico y emocional de la madre y su bebé.",
    ],
    image: "/assets/servicios/DSC_8490.webp",
    gallery: [
      {
        image: "/assets/servicios/DSC_8490.webp",
        title: "Protegemos el primer encuentro",
        text: "Los primeros minutos de vida son decisivos. El contacto piel con piel inmediato fortalece el vínculo y favorece la adaptación del bebé desde el nacimiento.",
      },
      {
        image: "/assets/servicios/DSC_8494.webp",
        title: "Nacer es encontrar a mamá",
        text: "El instinto guía al bebé hacia el calor, la voz y la protección de su madre desde el primer instante.",
      },
      {
        image: "/assets/servicios/DSC_8510.jpg",
        title: "Aquí también nace una familia",
        text: "Con el nacimiento de un bebé, nace y renace una familia. Protegemos ese primer encuentro.",
      },
      {
        image: "/assets/servicios/DSC_8638.jpg",
        title: "El nacimiento también construye futuro",
        text: "Las primeras experiencias de vida dejan huellas en la salud, el vínculo y el bienestar de la madre, su bebé y su familia.",
      },
    ],
    category: "medica",
    benefits: [
      {
        icon: "Activity",
        title: "Libertad de movimiento",
        text: "Promovemos las posiciones verticales y el respeto por la fisiología del parto, reconociendo los derechos anatómicos de la madre.",
      },
      {
        icon: "HeartHandshake",
        title: "Cero separación",
        text: "Favorecemos el contacto piel con piel inmediato durante los primeros mil minutos de vida.",
      },
      {
        icon: "Droplets",
        title: "Inicio temprano de la lactancia",
        text: "Corte oportuno del cordón e inicio temprano de la lactancia para una mejor adaptación neonatal y desarrollo de la microbiota.",
      },
    ],
    included: [
      "Acompañamiento que respeta los derechos anatómicos y biológicos",
      "Libertad de movimiento y posiciones verticales",
      "Contacto piel con piel inmediato (cero separación)",
      "Corte oportuno del cordón umbilical",
      "Inicio temprano de la lactancia materna",
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
      "Desde 2020 implementamos la Cesárea Humanizada Túnel, técnica innovadora que nos ha permitido favorecer el contacto piel con piel inmediato, la cero separación mamá-bebé, la recepción temprana del calostro y el inicio oportuno de la lactancia materna durante el nacimiento por cesárea.",
      "Estas prácticas promueven el desarrollo de la microbiota y un nacimiento centrado en los derechos biológicos de la madre y su bebé.",
    ],
    image: "/assets/servicios/MG_3845.jpeg",
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
      "Cesárea Humanizada Túnel",
      "Contacto piel con piel inmediato",
      "Cero separación mamá-bebé",
      "Recepción temprana del calostro",
      "Inicio oportuno de la lactancia materna",
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
      "Brindamos un programa basado en la Educación Somática Prenatal, orientado a acompañar a la gestante y su pareja mediante herramientas corporales, emocionales y neurobiológicas que favorecen la conciencia corporal, el movimiento, la respiración y el vínculo prenatal.",
      "A través de un programa personalizado de 8 a 10 sesiones teóricas y vivenciales, promovemos una preparación consciente para el nacimiento, facilitando un entorno de seguridad que favorezca el flujo hormonal del parto, la confianza corporal y una vivencia fisiológica del trabajo de parto.",
      "Integramos activamente a la pareja como acompañante clave del proceso, favoreciendo su participación en el sostén emocional, físico y relacional durante el embarazo, el nacimiento y el inicio de la lactancia materna.",
    ],
    image: "/assets/servicios/neoser-172.webp",
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
      "Programa basado en la metodología de Anatomía para el Movimiento® de Blandine Calais-Germain, orientado a favorecer la conciencia y el cuidado del suelo pélvico mediante principios de educación somática, percepción corporal y biomecánica femenina.",
      "A través de ejercicios específicos, respiración consciente y movimiento guiado, este método contribuye a mejorar la postura, la movilidad y la integración del suelo pélvico con el cuerpo en movimiento, favoreciendo la prevención de prolapsos, incontinencia urinaria y otras disfunciones del periné, promoviendo el bienestar integral de la mujer en sus diferentes etapas de vida.",
    ],
    image: "/assets/servicios/neoser-4.webp",
    category: "somatica",
    benefits: [
      {
        icon: "Flower2",
        title: "Método Calais-Germain",
        text: "Basado en Anatomía para el Movimiento®, referente internacional en biomecánica femenina.",
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
      "Programa basado en la educación somática y el uso consciente del rebozo como herramienta de percepción corporal, movimiento y sostén, orientado a favorecer la conciencia corporal, la movilidad, la respiración y la autorregulación física y emocional de la mujer.",
      "A través del balanceo, la suspensión, el movimiento guiado y las técnicas de sostén con rebozo, este método contribuye al bienestar integral durante el embarazo, parto y posparto, favoreciendo una vivencia más consciente del cuerpo, el nacimiento y la maternidad.",
    ],
    image: "/assets/servicios/neoser-108.webp",
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
      "Programa basado en la Psicofonía de Marie-Louise Aucher, metodología que utiliza la vibración de la voz, el canto y la conciencia corporal para favorecer la percepción vibratoria del cuerpo, la respiración, la relajación y el vínculo prenatal.",
      "A través de la práctica vocal consciente, este método contribuye al bienestar físico y emocional de la gestante, favorece la movilidad y apertura corporal para el nacimiento, fortalece la comunicación afectiva con el bebé y promueve una vivencia más consciente de la gestación y el parto.",
    ],
    image: "/assets/servicios/neoser-157.webp",
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
      "Programa orientado a preparar a la gestante y su familia para el inicio fisiológico de la lactancia materna desde el embarazo, favoreciendo una comprensión consciente de las primeras horas de vida del bebé y la importancia del contacto piel con piel, la cero separación y la recepción temprana del calostro.",
      "A través de sesiones educativas y vivenciales, se abordan aspectos relacionados con el agarre, las posiciones de amamantamiento, la producción de leche y las necesidades biológicas del recién nacido, promoviendo el vínculo temprano, el desarrollo de la microbiota y una lactancia informada y respetada.",
    ],
    image: "/assets/servicios/MG_4392.jpg",
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
      "Espacios de encuentro y acompañamiento para madres, orientados a favorecer la conexión emocional, espiritual y corporal a través de la meditación, el dibujo consciente y técnicas de contención con fulares.",
      "Cada 15 días compartimos meditaciones inspiradas en la historia de vida de la Sagrada Familia, promoviendo espacios de pausa, escucha, sostén emocional y reflexión en comunidad.",
      "A través de la respiración, el movimiento suave, el arte y el compartir entre madres, favorecemos experiencias de bienestar, contención y conexión consigo mismas y con su maternidad desde una mirada sensible y respetuosa.",
    ],
    image: "/assets/servicios/IMG_2544-editada.png",
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
