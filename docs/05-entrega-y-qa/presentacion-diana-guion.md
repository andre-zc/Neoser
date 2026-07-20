# 🎤 Presentación final a Diana — Guion completo

> Documento de preparación para **André** (UI/UX, diseño, web) y **Álvaro** (backend, integraciones, RevOps).
> Objetivo: presentarle a Diana el trabajo terminado del V1 de NeoSer de forma clara, ordenada y bonita.
> Público: **Diana** — dueña del centro, nivel técnico bajo, opera sola 10–15 min/día. Habla en beneficios, no en tecnicismos.

---

## 0. Lo primero: qué es este documento y qué NO es

- **SÍ es:** el guion + reparto + cronograma + índice del material que hay que presentar. Léelo entero antes de armar tus slides.
- **NO es:** los slides ya hechos. Los slides los armamos con el índice de la sección 5.

**Regla de oro de la presentación:** Diana no quiere saber *cómo* funciona por dentro. Quiere ver que **su web se ve bonita, capta clientas, y ella la puede operar sin morir en el intento**. Todo lo que digamos se traduce a eso.

---

## 1. Situación actual del proyecto (dónde estamos hoy)

Estamos en la **recta final del V1**. La web está construida, funcionando y desplegada. Esto es lo que existe hoy, verificado en el código:

### ✅ Lo que está terminado y se puede mostrar en vivo

| Bloque | Estado | Qué ve Diana |
|---|---|---|
| **Web institucional** | ✅ Listo | Home multi-sección (Hero con carrusel, Servicios, Escuela, Quiénes Somos, Noticias, Reserva, Contacto), páginas de Servicios con detalle, y Cursos con landings dedicadas. Responsive (celular, tablet, PC). |
| **Captación de leads** | ✅ Listo | Formulario de contacto + botón/modal de WhatsApp que guarda el dato **antes** de abrir el chat. Cada lead cae en la base de datos y sube al CRM. |
| **Reservas** | ✅ Listo | Sección de reserva con calendario Cal.com embebido, con dos vías: cita médica y coordinación institucional. La reserva se confirma sola y queda registrada. |
| **Cursos e inscripción** | ✅ Listo | Catálogo de cursos publicado desde base de datos + landings dedicadas (Rebozo, Antropología del parto) + formulario de inscripción. |
| **Pagos** | ✅ Listo | Pago online con **Culqi** (Custom Checkout) integrado de punta a punta: cobra, confirma, y registra la inscripción pagada. |
| **CRM (HubSpot)** | ✅ Conectado | Cada lead, reserva e inscripción se sincroniza a HubSpot automáticamente (sin frenar la web si HubSpot falla). |
| **Email marketing (Brevo)** | ✅ Conectado | Contactos segmentados por listas + plantillas de email (bienvenida, confirmación de reserva, seguimiento). |
| **Mapa + Contacto** | ✅ Listo | Google Maps embebido con fallback. |

### 🔧 Stack técnico real (para que André lo tenga claro, NO para decírselo así a Diana)

- **La web:** Next.js 16 + Supabase (base de datos) + desplegada en Vercel.
- **Pagos:** Culqi (reemplazó a Izipay en el camino — este es el proveedor final y único que funciona).
- **Reservas:** Cal.com.
- **CRM:** HubSpot.
- **Email:** Brevo.
- **Mapa:** Google Maps.

---

## 2. ⚠️ El punto ManyChat — leer con atención (para no prometer de más)

Diana asocia el proyecto con **ManyChat, HubSpot y "esas cosas"**. Hay que ser precisos, porque el proyecto tiene **dos capas** y conviene no mezclarlas:

### Capa 1 — La web (lo que construimos nosotros en código)
Todo lo de la sección 1. Aquí, WhatsApp funciona por **enlace directo** (`wa.me`): la clienta llena un mini-formulario, el dato se guarda como lead, y recién ahí se abre el chat de WhatsApp con un mensaje ya escrito. Es simple, confiable y no depende de terceros.

### Capa 2 — El marketing conversacional (plataformas externas, NO son código de la web)
Aquí viven **ManyChat** y **HubSpot** como herramientas de operación:
- **ManyChat** automatiza conversaciones en **redes sociales** (Instagram/Facebook/WhatsApp): responde comentarios, DMs, y arma flujos automáticos desde los anuncios de Meta.
- **HubSpot** es el **CRM central** donde termina cayendo todo: los leads de la web *y* los que vienen de ManyChat/redes.

> **📌 Cómo decirlo ante Diana (frase segura):**
> *"Tu operación tiene dos motores conectados: la **web**, que capta y cobra, y tu **capa de marketing** (ManyChat en redes + HubSpot como CRM), que conversa y hace seguimiento. Todo termina ordenado en un solo lugar: HubSpot."*

> **🚫 Lo que NO debemos decir:** que "la web usa ManyChat" o que "programamos ManyChat dentro de la página". Eso no es cierto — ManyChat es una plataforma aparte que se configura en su propio panel. Si Diana pregunta por automatización de WhatsApp *dentro de la web*, la respuesta honesta es: la web capta el lead y abre el chat; la automatización conversacional avanzada vive en ManyChat (capa de marketing) o entra como mejora del V2.

Esto nos protege: prometer solo lo que existe evita problemas después de la entrega.

---

## 3. 👥 Reparto de roles

| | **André** | **Álvaro** |
|---|---|---|
| **Rol en la presentación** | La cara / el recorrido visual | El cerebro / cómo opera el negocio |
| **De qué habla** | Diseño, navegación, cómo se ve y se siente la web, experiencia de la clienta | Captación, CRM, reservas, pagos, automatizaciones, próximos pasos |
| **Tono** | Emocional, visual ("mira qué bonito y fácil") | Práctico, de beneficio ("esto te ahorra tiempo y no pierdes clientas") |

**Idea clave:** André abre y enamora con lo visual; Álvaro cierra mostrando que detrás hay una máquina de captar y ordenar clientas.

---

## 4. 🕐 Cronograma de la presentación (~25–30 min)

Duración objetivo: **20 min de presentación + 8–10 min de preguntas**. Ritmo tranquilo, sin tecnicismos.

| # | Momento | Quién | Tiempo | Qué pasa |
|---|---|---|---|---|
| 1 | **Bienvenida y objetivo** | André | 2 min | Saludo, "hoy te mostramos tu web terminada y cómo te va a traer clientas". Marca la agenda en una frase. |
| 2 | **Recorrido visual en vivo** | André | 6 min | Navega la web real en pantalla: Home → Servicios → Cursos → Reserva → Contacto. Enfatiza que se ve igual de bien en celular. |
| 3 | **Cómo entran las clientas (captación + CRM)** | Álvaro | 4 min | Muestra el formulario y el WhatsApp. Explica que cada dato cae en HubSpot solo. Aquí se menciona ManyChat como capa de redes (según sección 2). |
| 4 | **Reservas y pagos** | Álvaro | 4 min | Demo de la reserva con Cal.com + explica el pago con Culqi en cursos. "La clienta agenda y paga sola, tú solo confirmas." |
| 5 | **Seguimiento automático (email + segmentación)** | Álvaro | 2 min | Brevo + plantillas + listas segmentadas. "Los correos de bienvenida y seguimiento salen solos." |
| 6 | **Cierre: qué queda y qué sigue (V2)** | André + Álvaro | 2 min | Resumen de lo entregado + qué es mejora futura (V2). Deja claro el límite del V1. |
| 7 | **Preguntas** | Ambos | 8–10 min | André toma las de diseño; Álvaro las de funcionamiento/negocio. |

> **Truco de turnos:** el que no está hablando **no interrumpe**; solo apoya si el otro le pasa la palabra ("Álvaro, cuéntale tú cómo llega eso al CRM"). Se ve profesional y coordinado.

---

## 5. 🎬 Numeración del material (PPT) — índice slide por slide

Arma la presentación con **estos 12 slides**. Numéralos tal cual para que en el ensayo digamos "vamos al slide 7".

| Slide | Título | Contenido | Responsable de armarlo |
|---|---|---|---|
| **1** | Portada | Logo NeoSer + "Entrega del sitio web V1" + fecha + nombres (André y Álvaro) | André |
| **2** | Agenda | Los 6 momentos de la sección 4, en lista simple con íconos | André |
| **3** | "Tu web, terminada" | 3–4 capturas grandes de la home (desktop + celular lado a lado) | André |
| **4** | Recorrido: Servicios | Captura de la sección Servicios + detalle de un servicio | André |
| **5** | Recorrido: Cursos | Captura del catálogo + una landing de curso (Rebozo o Antropología) | André |
| **6** | Recorrido: Reserva y Contacto | Captura del calendario Cal.com + mapa + formulario | André |
| **7** | "Cómo entran tus clientas" | Diagrama simple: Anuncio/Redes → Web/WhatsApp → **HubSpot (CRM)**. Aquí ubicar ManyChat en la parte de redes | Álvaro |
| **8** | Reservas y pagos | Íconos Cal.com + Culqi. Frase: "Agenda sola, paga sola, tú confirmas" | Álvaro |
| **9** | Seguimiento automático | Brevo + ejemplos de los 3 correos (bienvenida, confirmación, seguimiento) | Álvaro |
| **10** | "Todo ordenado en un solo lugar" | Captura o mock de HubSpot con leads/deals. El mensaje: no se pierde ninguna clienta | Álvaro |
| **11** | Qué incluye tu V1 / Qué viene en V2 | Dos columnas: ✅ Entregado (lista sección 1) vs 🔮 Futuro (aula virtual, automatización avanzada de chat, etc.) | Ambos |
| **12** | Cierre + gracias + próximos pasos | "¿Qué necesitamos de ti para salir a producción?" + datos de contacto | André |

> **Estilo visual (André):** usa la identidad de `branding/` (logos, fuentes, colores del sitio). Menos texto, más captura real de la web. Diana debe *ver* su web, no leer bullets.

---

## 6. 📝 Script — qué dice cada uno (palabra por palabra sugerida)

Esto es una **guía**, no un libreto rígido. Adáptenlo a su forma de hablar. En **negrita** las frases que sí conviene decir tal cual.

### 🟦 André — Apertura (Slide 1–2)
> "Hola Diana, gracias por tu tiempo. Hoy te queremos mostrar **tu página web ya terminada** y, sobre todo, cómo va a trabajar para ti trayéndote clientas. Te vamos a llevar en un recorrido de unos 20 minutos y al final resolvemos todas tus dudas."

### 🟦 André — Recorrido visual (Slide 3–6)
> "Esta es tu casa digital. **Mira que se ve igual de bonita en la computadora y en el celular** — y la mayoría de tus clientas van a entrar desde el celular. Acá arriba está lo primero que ven..."
> *(Navega en vivo: Home → Servicios → detalle → Cursos → landing → Reserva → Contacto.)*
> "Cada sección está pensada para que la mamá gestante entienda rápido qué haces y sienta confianza."

*Cierra tu parte pasando la palabra:* > **"Y ahora Álvaro te va a mostrar la parte que más te va a gustar: cómo esta web te consigue y te ordena las clientas sin que tú hagas nada."**

### 🟩 Álvaro — Captación y CRM (Slide 7)
> "Diana, mira este flujo. Cuando una mamá llega a tu web —venga de un anuncio, de Instagram o de Google— tiene dos formas de contactarte: **el formulario y el WhatsApp**. Lo importante: **antes de abrir el chat, ya guardamos su dato**. Nunca pierdes a nadie."
> "Todos esos contactos, más los que te llegan por **redes con ManyChat**, terminan ordenados en un solo lugar: **HubSpot, tu CRM**. Ahí ves quién te escribió, en qué está interesada y en qué punto va. Todo automático."

### 🟩 Álvaro — Reservas y pagos (Slide 8)
> "Acá tienes tu **calendario de reservas**. La clienta elige día y hora, y **la cita se confirma sola** y te queda registrada. Y en los cursos, **puede pagar online con tarjeta** de forma segura con Culqi. Tú solo confirmas — no persigues a nadie para cobrar."

### 🟩 Álvaro — Seguimiento (Slide 9–10)
> "Y no queda ahí: **los correos de bienvenida, de confirmación y de seguimiento salen automáticamente**. Tus contactos quedan separados por listas, así puedes mandar campañas al grupo correcto. Todo desemboca en HubSpot: **no se te escapa ninguna clienta**."

### 🟦🟩 Cierre — André + Álvaro (Slide 11–12)
> **André:** "Esto es lo que te entregamos en esta primera versión: tu web completa, captación, reservas, pagos y seguimiento."
> **Álvaro:** "Y lo que viene más adelante, cuando quieras dar el siguiente paso, es el **aula virtual completa y automatizaciones de chat más avanzadas** — eso es una fase 2."
> **André:** "Para salir en vivo solo necesitamos [accesos/contenido pendiente]. ¿Qué dudas tienes?"

---

## 7. ✅ Checklist de André antes de la presentación

Marca cada punto. Esto es lo que **tú** tienes que dejar listo:

- [ ] **Slides (PPT) armados** — los 12 de la sección 5, con la identidad visual de `branding/`.
- [ ] **Capturas de la web actualizadas** — home, servicios, cursos, reserva, contacto, en **desktop y celular**.
- [ ] **Web abierta y probada en vivo** — navegar el recorrido 1 vez antes, con internet estable, por si hacemos demo real.
- [ ] **Diagrama del slide 7** (Redes/ManyChat → Web/WhatsApp → HubSpot) — simple y limpio.
- [ ] **Script leído** — al menos tu parte (apertura + recorrido + cierre).
- [ ] **Ensayo cronometrado con Álvaro** — 1 pasada completa midiendo tiempos y turnos.
- [ ] **Plan B sin internet** — si falla la conexión, tener las capturas en los slides para no depender del demo en vivo.

## 8. ✅ Checklist de Álvaro (referencia)

- [ ] Web desplegada y estable en la URL de producción/preview.
- [ ] Slides 7–10 con datos/capturas reales de HubSpot, Cal.com, Culqi, Brevo.
- [ ] Lista de accesos/pendientes que necesitamos de Diana para salir a producción (dominio, GA4/Search Console, aprobaciones).
- [ ] Respuestas preparadas para "¿y ManyChat qué hace?" (sección 2).

---

## 9. 🎯 Mensajes que Diana se tiene que llevar (los 3 imprescindibles)

1. **"Mi web está terminada y se ve profesional."** (lo emocional, lo cierra André)
2. **"Capta clientas sola y las ordena en un solo lugar, sin que yo esté encima."** (lo racional, lo cierra Álvaro)
3. **"Es simple de operar y sé qué viene después."** (confianza + puerta abierta al V2)

Si Diana termina la reunión repitiendo estas 3 ideas, la presentación fue un éxito.
