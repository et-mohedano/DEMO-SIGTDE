# Prompt para desarrollar la PDC (Prueba de Concepto) del sistema SIGTDE

> **Cómo usarlo:** copia todo el contenido desde `<prompt>` hasta `</prompt>` y pégalo como mensaje inicial en Claude (o la herramienta de IA/equipo de desarrollo que uses). El prompt es autocontenido: incluye todo el contexto del proyecto, los datos de ejemplo, la arquitectura de archivos y los criterios de aceptación.

---

<prompt>

## ROL Y OBJETIVO

Actúa como un equipo senior de desarrollo frontend y diseño de producto. Tu tarea es construir la **Prueba de Concepto (PDC) navegable del SIGTDE (Sistema Integral de Gestión del Talento Deportivo Escolar)**, compuesta por: (1) una landing page comercial con héroe, CTAs y formulario para agendar demo, y (2) un demo interactivo del sistema donde el visitante puede seleccionar el tipo de usuario y explorar cómo se ve la plataforma desde cada rol, con datos simulados realistas.

Todo debe construirse **únicamente con HTML, CSS y JavaScript vanilla** (sin frameworks, sin build, sin backend). Debe poder abrirse con doble clic en `index.html` y funcionar completa en el navegador. Usa **varios archivos HTML** para separar la landing del demo, con CSS y JS compartidos.

## CONTEXTO DEL PRODUCTO (léelo completo antes de programar)

**Qué es SIGTDE:** una plataforma SaaS para instituciones de educación media superior y superior (alumnos de 15 a 25 años) que captura datos de desempeño físico, construye perfiles deportivos comparables, identifica talento competitivo en **basquetbol, voleibol y futbol**, recomienda deporte y posición, apoya decisiones de becas deportivas y da seguimiento longitudinal al desarrollo de cada alumno. El piloto se realiza en una institución privada de Pachuca, Hidalgo (México). La competencia real del producto es el papel y las hojas de cálculo: la promesa es "más fácil que Excel, con ciencia detrás".

**Propuesta de valor por audiencia (usar en la landing):**
- Para directivos: diferenciación institucional ("la única escuela de la región con un sistema científico de desarrollo deportivo"), becas defendibles con datos y captación de matrícula.
- Para entrenadores: selección de equipos con evidencia, captura en cancha sin internet, alertas de bienestar.
- Para alumnos: saber qué tan competitivos pueden ser, en qué deporte y posición, y qué metas alcanzar.
- Para padres: visibilidad del desarrollo de sus hijos con datos seguros (consentimiento y privacidad de menores).

**Conceptos clave del sistema (deben aparecer en el demo):**
- **Batería núcleo de 10 pruebas:** estatura, peso, envergadura, sprint 20 m (parcial 10 m), salto CMJ, salto horizontal, lanzamiento de balón medicinal, dominadas, agilidad 5-10-5, Yo-Yo IR1, sit and reach.
- **Metodología:** cada resultado se convierte a percentil (0-100) contra la norma de edad y sexo; los índices se calculan ponderando percentiles, nunca valores crudos. Incluye "bandera madurativa" (maduración temprana/tardía vía PHV) para no descartar talento tardío.
- **Índices por deporte (0-100):** IPF (futbol), IPB (basquetbol), IPV (voleibol). Ponderaciones: Futbol = resistencia 25%, velocidad 25%, agilidad 20%, potencia 15%, coordinación 15%. Basquetbol = estatura 30%, envergadura 20%, salto vertical 20%, agilidad 15%, velocidad 15%. Voleibol = estatura 25%, alcance 25%, salto vertical 25%, potencia 15%, velocidad 10%.
- **Índices institucionales:** IPD (potencial deportivo), IRA (rendimiento actual), IPRO (proyección a 2-3 años), IBD (índice de beca: <60 sin recomendación, 60-75 prospecto, 75-90 beca parcial, 90+ beca prioritaria).
- **Compatibilidad por posición:** p. ej. "Perfil compatible 86% con lateral ofensivo". Posiciones: Futbol (portero, defensa central, lateral, medio, delantero), Basquetbol (base, escolta, alero, ala-pívot, pívot), Voleibol (armador, opuesto, central, receptor).
- **Módulo de bienestar:** check-in semanal del atleta (esfuerzo percibido PSE 1-10, sueño, ánimo, molestias) con alertas al entrenador; el sistema nunca diagnostica, solo señala patrones.
- **Principio de transparencia:** todo índice puede desglosarse (qué pruebas lo componen, con qué percentil y peso). Los índices informan decisiones humanas, nunca las sustituyen.
- **Privacidad:** los alumnos no ven datos de otros alumnos; los padres solo ven a sus hijos; el flujo de becas lo decide un comité humano (el sistema propone).

## ENTREGABLES Y ESTRUCTURA DE ARCHIVOS

```
/sigtde-pdc
├── index.html          → Landing page comercial
├── demo.html           → Selector de rol + shell del demo interactivo
├── css/styles.css      → Sistema de diseño compartido (landing + demo)
├── js/data.js          → Datos simulados (alumnos, evaluaciones, índices)
├── js/landing.js       → Interacciones de la landing (form, scroll, animaciones)
├── js/demo.js          → Lógica del demo (roles, vistas, gráficas, interacciones)
└── assets/             → (opcional) SVGs inline preferidos sobre imágenes externas
```

Si consideras necesario, puedes separar cada rol en su propio HTML (`demo-alumno.html`, `demo-entrenador.html`, `demo-directivo.html`, `demo-padres.html`) enlazados desde `demo.html`; en ese caso mantén una barra superior común para cambiar de rol en un clic.

## ESPECIFICACIÓN 1: LANDING PAGE (index.html)

1. **Navbar fija minimalista:** logo tipográfico "SIGTDE", enlaces (Cómo funciona, Para quién, Planes, Contacto) y CTA primario "Probar el demo" → demo.html.
2. **Hero:** titular potente tipo "El talento de tus alumnos, medido con ciencia" + subtítulo (identifica, desarrolla y da seguimiento al talento deportivo de tu institución con datos, no con corazonadas). Dos CTAs: **"Explorar el sistema"** (→ demo.html, primario) y **"Agendar una demo"** (→ scroll al formulario, secundario). Incluye una ilustración/mock del dashboard hecha en SVG o CSS puro (nada de imágenes externas): por ejemplo, una tarjeta con un radar y barras animadas.
3. **Franja de cifras animadas (count-up al hacer scroll):** "10 pruebas físicas estandarizadas", "3 deportes, 14 posiciones", "0 a 100: índices comparables por edad y sexo", "2 sesiones de clase por evaluación".
4. **Sección "Cómo funciona" (4 pasos):** Evalúa (batería núcleo en cancha, sin internet) → Procesa (percentiles por edad y sexo) → Decide (selección, posiciones y becas con evidencia) → Da seguimiento (evolución semestre a semestre).
5. **Sección "Un sistema, cuatro miradas":** cuatro tarjetas (Alumno, Entrenador, Directivo, Padres) con micro-resumen de lo que cada uno ve; cada tarjeta enlaza directo a esa vista del demo.
6. **Sección de confianza/privacidad:** tres puntos: consentimiento de tutores para menores, los alumnos nunca ven datos de otros alumnos, algoritmo transparente y auditable.
7. **Planes (referencial, sin checkout):** Básico (hasta 500 alumnos), Institucional (501-1,500, incluye bienestar y portal de padres), Campus/Red (multi-plantel, cotización). CTA en cada plan → formulario.
8. **Formulario "Agenda una demo con el equipo" (simulado):** campos nombre, institución, cargo (select: Director/a, Coordinador/a deportivo, Docente de EF, Otro), municipio/estado, correo, teléfono, número aproximado de alumnos y mensaje. Validación en JS; al enviar NO hay backend: muestra un estado de éxito elegante ("¡Listo! Te contactaremos en menos de 24 h") con animación, y guarda el objeto en una variable en memoria + console.log. Incluye microcopy de privacidad.
9. **Footer:** logo, enlaces, leyenda "PDC / demo con datos simulados. Ningún dato mostrado corresponde a personas reales."

## ESPECIFICACIÓN 2: DEMO INTERACTIVO (demo.html)

**Pantalla de entrada:** "¿Cómo quieres ver SIGTDE?" con 4 tarjetas grandes y amigables (icono SVG + descripción de una línea): **Alumno-atleta, Entrenador, Directivo, Padre/Madre**. Barra superior persistente con selector de rol para cambiar en cualquier momento y botón "Volver al inicio".

**Vista ALUMNO (persona: "Diego Hernández, 16 años, 4º semestre"):**
- Tarjeta de perfil (edad, grupo, deporte recomendado: Voleibol; bandera madurativa: "maduración tardía: potencial de crecimiento").
- **Radar interactivo** de 6 dimensiones (velocidad, resistencia, potencia, fuerza, agilidad, flexibilidad) en percentiles; al pasar el cursor muestra el valor.
- Tarjetas de índices IPF/IPB/IPV con barras 0-100 (p. ej. 68 / 82 / 90) y el deporte recomendado destacado; al hacer clic en un índice se abre el **desglose transparente** (tabla: prueba, percentil, peso, aporte).
- **Evolución:** gráfica de línea (SVG propio o canvas) de 3 ventanas de evaluación para sprint 20 m y CMJ.
- **Metas activas:** "Bajar sprint 20 m de 3.42 s a 3.30 s (te sube al percentil 85)" con barra de progreso.
- **Check-in semanal interactivo:** sliders/emojis de PSE, sueño, ánimo, molestias; al enviar, se refleja en la vista del entrenador (mismo estado en memoria).
- Regla visible: no hay ranking ni datos de otros alumnos.

**Vista ENTRENADOR (persona: "Coach Mariana Ruiz, voleibol y basquetbol"):**
- **Modo captura en cancha:** tabla editable tipo lista con 12 alumnos y la batería núcleo; al escribir un valor se recalculan percentiles al vuelo; valores fuera de rango se marcan en ámbar ("dato atípico: revalidar"); badge de "modo sin conexión" simulado.
- **Ranking del equipo por índice** con filtros por deporte y por prueba.
- **Compatibilidad por posición:** al seleccionar un alumno, radar superpuesto contra el perfil ideal de cada posición con % de compatibilidad ("86% lateral", "74% medio"...).
- **Constructor de alineación:** cancha esquemática en SVG donde arrastra (o asigna por clic) alumnos a posiciones; el sistema sugiere el mejor candidato disponible por posición y muestra "perfil faltante: necesitas más potencia de salto en central".
- **Panel de bienestar:** semáforo de alertas (p. ej., "Sofía: ánimo bajo 3 semanas seguidas → hablar con ella"; "Diego: carga aguda/crónica en amarillo").

**Vista DIRECTIVO (persona: "Dir. Alejandro Fuentes"):**
- KPIs institucionales: alumnos evaluados (312/380), distribución por deporte (dona), talentos por grado y sexo (barras), evolución institucional anual.
- **Top 10 talentos** (tabla con IPD, tendencia ↑↓ y deporte).
- **Flujo de becas:** lista de candidatos por IBD con banda (prospecto/parcial/prioritaria); botones "Aprobar/Rechazar/Solicitar más información" que piden un motivo (modal) y registran la decisión en una bitácora visible: "el sistema propone, el comité decide".
- Botón "Generar reporte ejecutivo" que abre una vista imprimible limpia (window.print()).

**Vista PADRES (persona: "Familia Hernández, tutor de Diego"):**
- Solo lectura y en lenguaje llano: progreso del semestre ("Diego mejoró su resistencia un 12%"), próximas evaluaciones, reporte semestral descargable simulado y **panel de consentimiento** (toggle de aviso de privacidad con estado "vigente desde 12/ago/2026").

## DATOS SIMULADOS (js/data.js)

Genera un dataset coherente y verosímil, con nombres mexicanos ficticios: **12 a 16 alumnos** (mixto hombres/mujeres, 15-18 años) con: datos generales, resultados de 3 ventanas de evaluación de la batería núcleo (valores realistas: sprint 20 m entre 2.9 y 3.9 s, CMJ 22-48 cm, Yo-Yo 400-1,600 m, etc.), percentiles, índices IPF/IPB/IPV/IPD/IRA/IPRO/IBD, bandera madurativa, deporte recomendado, compatibilidades por posición y checkins de bienestar. Todos los cálculos del demo pueden ser precalculados en data.js, pero la recalculación al capturar en la vista de entrenador debe ser funcional (aunque simplificada). Marca en la interfaz, discreto pero visible: "Datos simulados".

## SISTEMA DE DISEÑO (css/styles.css)

- **Estilo:** minimalista, muy gráfico, amigable y deportivo-tecnológico. Mucho espacio en blanco, tarjetas con bordes suaves (radio 12-16 px), sombras sutiles, microinteracciones (hover, transiciones 150-250 ms), animaciones de entrada discretas.
- **Paleta:** fondo #FFFFFF y #F8F9FB; texto #111318 y #5B6472; primario azul #2D5BE3; acento violeta #6B35D9; éxito #22C55E; alerta #F59E0B; navy #0A0F2E para el hero. Degradado permitido solo en hero y CTAs primarios (azul→violeta).
- **Tipografía:** una sola familia vía Google Fonts (Plus Jakarta Sans o Inter); jerarquía clara (48/32/22/16 px).
- **Componentes reutilizables:** botones (primario, secundario, fantasma), tarjeta, badge, tabla, modal, toast, tabs, slider, barra de progreso, radar (SVG generado por JS, sin librerías).
- **Responsive:** mobile-first; la landing perfecta en móvil; el demo usable en tablet/desktop con aviso amable en pantallas muy pequeñas.
- **Accesibilidad:** contraste AA, focus visible, labels en formularios, navegación por teclado en el selector de rol.

## RESTRICCIONES TÉCNICAS

- HTML5, CSS3 y JS ES6+ vanilla. **Sin frameworks ni librerías de gráficas**: los radares, líneas, donas y barras se dibujan con SVG generado por JavaScript (es parte del reto y del look artesanal).
- **No usar localStorage ni sessionStorage:** todo el estado vive en memoria (objetos JS); al recargar se reinicia, y está bien para una PDC.
- Sin peticiones a servidores (salvo Google Fonts); todo funciona en file://.
- Código comentado por secciones, nombres en español, semántico (header, main, section, nav, footer).

## CRITERIOS DE ACEPTACIÓN

1. `index.html` abre y se ve impecable en móvil y desktop; el formulario valida, simula el envío y muestra confirmación.
2. Desde la landing llego al demo en un clic y puedo cambiar entre los 4 roles sin recargar mentalmente el contexto.
3. En la vista de entrenador puedo capturar un valor y ver percentil e índice recalcularse; un valor absurdo se marca como atípico.
4. En la vista de alumno puedo abrir el desglose transparente de un índice y enviar un check-in que aparece como alerta/registro en la vista del entrenador.
5. En la vista de directivo puedo aprobar una beca con motivo y verla en la bitácora.
6. Cero errores en consola; ninguna dependencia rota; leyenda de "datos simulados" visible.

Antes de escribir código, responde en 5 líneas con tu plan de archivos y orden de construcción; después entrega los archivos completos, uno por uno, listos para guardar.

</prompt>
