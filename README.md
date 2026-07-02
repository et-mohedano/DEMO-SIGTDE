# SIGTDE — Prueba de Concepto (PDC)

Sistema Integral de Gestión del Talento Deportivo Escolar. Plataforma SaaS conceptual para instituciones de educación media superior y superior que evalúa desempeño físico, construye perfiles deportivos comparables (basquetbol, voleibol y futbol) y apoya decisiones de becas y seguimiento longitudinal.

Esta PDC es **100% estática**: HTML, CSS y JavaScript vanilla, sin frameworks, sin build y sin backend. Se abre con doble clic en `index.html` y funciona completa en el navegador (`file://`), salvo la carga de la tipografía desde Google Fonts.

> ⚠️ Todos los datos (alumnos, evaluaciones, índices, noticias, blog) son **simulados**. Ningún dato corresponde a personas reales.

## Cómo abrir el proyecto

No requiere instalación ni servidor. Basta con:

1. Abrir `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox).
2. Desde ahí, el botón **"Probar el demo"** lleva a `demo.html`.

Opcionalmente puede servirse con cualquier servidor estático (Live Server, `python -m http.server`, etc.) para evitar restricciones de `file://` en algunos navegadores, pero no es necesario.

## Estructura de archivos

```
/
├── index.html          Landing comercial (hero, cifras, cómo funciona, para quién,
│                        blog, noticias, confianza, planes, formulario de demo)
├── blog-post.html       Página single de artículo del blog (?post=<slug>)
├── demo.html            Selector de rol + shell del demo interactivo (SPA de una sola página)
├── css/
│   └── styles.css       Sistema de diseño compartido (tokens, componentes, layout)
├── js/
│   ├── data.js           Dataset simulado (14 alumnos), normas por prueba, cálculo de
│   │                      percentiles/índices, estado en memoria compartido, alertas
│   ├── charts.js          Radar, línea, dona y barras — SVG dibujado a mano, sin librerías
│   ├── landing.js         Interacciones de index.html (nav, cifras animadas, form, noticias)
│   ├── blog.js            Render del artículo single + datos de los 4 posts del blog
│   ├── demo.js            Controlador de rol/vistas + utilidades de UI (toast, modal)
│   ├── vista-alumno.js       Vista Alumno-atleta
│   ├── vista-entrenador.js   Vista Entrenador
│   ├── vista-directivo.js    Vista Directivo
│   └── vista-padres.js       Vista Padres/Madres
└── README.md
```

## El demo interactivo (`demo.html`)

Es una única página (no hay recarga entre roles) para que el estado en memoria —check-ins, decisiones de becas, alineación armada— se comparta entre vistas durante la sesión. Se puede llegar directo a un rol con `demo.html?rol=alumno|entrenador|directivo|padres`.

- **Alumno** (persona: Diego Hernández): radar de 6 dimensiones, índices IPF/IPB/IPV con desglose transparente, evolución de sprint/CMJ, meta activa y check-in semanal de bienestar.
- **Entrenador** (persona: Coach Mariana Ruiz): captura en cancha con recálculo de percentiles/índices en vivo (marca valores atípicos), ranking del equipo, compatibilidad por posición, constructor de alineación (cancha SVG) y panel de alertas de bienestar.
- **Directivo** (persona: Dir. Alejandro Fuentes): KPIs institucionales, top 10 talentos, flujo de becas con bitácora de decisiones y reporte ejecutivo imprimible (`window.print()`).
- **Padres** (persona: Familia Hernández): solo lectura en lenguaje llano, próxima evaluación, reporte semestral descargable (simulado) y panel de consentimiento.

## Restricciones técnicas respetadas

- Sin frameworks ni librerías de gráficas: radares, líneas, donas y barras son SVG generado por JavaScript.
- Sin `localStorage` ni `sessionStorage`: todo el estado vive en memoria y se reinicia al recargar (a propósito).
- Sin peticiones a servidores, salvo Google Fonts.
- Nombres e interfaz en español.

## Notas de esta PDC

- El blog y la sección de noticias son contenido **ilustrativo** para mostrar cómo lucirían esas secciones; no son artículos ni noticias reales.
- El formulario de "Agenda una demo" no envía datos a ningún servidor: guarda el objeto en memoria (`window.SIGTDE_SOLICITUDES_DEMO`) y lo imprime en consola.
- Los reportes descargables (padres) y el reporte ejecutivo (directivo) son simulaciones generadas en el navegador, sin backend.
