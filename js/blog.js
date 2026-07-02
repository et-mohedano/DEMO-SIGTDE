/* ==========================================================================
   SIGTDE — Blog: página single de artículo (blog-post.html)
   Contenido ilustrativo de la PDC, sin backend.
   ========================================================================== */

(function () {
  'use strict';

  const ICONOS = {
    documento: '<path d="M4 19V5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 3v6h6"/>',
    sol: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
    pulso: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    tendencia: '<path d="M3 3v18h18"/><path d="M7 15l4-6 3 4 5-8"/>',
  };

  const POSTS = {
    percentiles: {
      categoria: 'Metodología', badge: 'badge-azul', icono: ICONOS.documento,
      titulo: 'Percentiles: por qué no debes comparar peras con peras',
      fecha: '28 jun 2026', lectura: '4 min de lectura',
      cuerpo: [
        { p: 'Cuando dos alumnos corren el sprint de 20 metros, el tiempo por sí solo no dice mucho si no sabemos con quién se está comparando. Un resultado de 3.4 segundos puede ser sobresaliente para una alumna de 15 años y apenas promedio para un alumno de 18. Comparar valores crudos entre personas de distinta edad y sexo es, literalmente, comparar peras con peras de árboles distintos.' },
        { h3: 'De valor crudo a percentil' },
        { p: 'Un percentil responde una pregunta distinta: "¿qué tan bien le fue a esta persona comparada con sus pares de la misma edad y sexo?" Un percentil 80 en salto vertical significa que superó al 80% de la referencia normativa para su grupo. Ya no importa si el valor crudo fue 38 cm o 52 cm — lo que importa es la posición relativa.' },
        { p: 'SIGTDE convierte cada una de las 10 pruebas de la batería núcleo a percentil antes de construir cualquier índice. Así, cuando dos alumnos de edades distintas aparecen en el mismo radar, la comparación sigue siendo justa.' },
        { quote: '"Los índices informan decisiones humanas, nunca las sustituyen." — Principio de transparencia de SIGTDE' },
        { h3: 'Por qué esto importa para las becas' },
        { p: 'Un comité de becas que compara valores crudos sin ajustar por edad tiende a favorecer sistemáticamente a los alumnos de mayor edad o maduración más temprana. Al trabajar con percentiles ponderados, la conversación se vuelve sobre potencial real, no sobre quién ya tuvo su estirón de crecimiento.' },
        { lista: ['Percentil 0-100 por prueba, contra norma de edad y sexo', 'Índices por deporte como promedio ponderado de percentiles', 'Nunca se comparan valores crudos entre categorías distintas'] },
      ],
    },
    phv: {
      categoria: 'Ciencia del deporte', badge: 'badge-violeta', icono: ICONOS.sol,
      titulo: 'La ventana del PHV: por qué un "tardío" puede ser tu mejor fichaje',
      fecha: '21 jun 2026', lectura: '6 min de lectura',
      cuerpo: [
        { p: 'El pico de velocidad de crecimiento (PHV, por sus siglas en inglés) es el momento de mayor aceleración en la estatura durante la adolescencia. No todos los alumnos lo atraviesan al mismo tiempo: algunos maduran antes, otros después, con diferencias de hasta dos o tres años entre compañeros de la misma edad cronológica.' },
        { h3: 'El riesgo de descartar talento por edad biológica' },
        { p: 'Un entrenador que solo mira el presente puede descartar a un alumno de maduración tardía porque hoy es más bajo o menos potente que sus compañeros. Pero ese mismo alumno, una vez que atraviese su propio PHV, puede alcanzar o superar a quienes hoy destacan.' },
        { p: 'Por eso SIGTDE incorpora una "bandera madurativa" junto a cada perfil: temprana, tardía o acorde a la edad. No es un diagnóstico médico, es una señal para interpretar el potencial con más contexto.' },
        { quote: 'Ejemplo del sistema: "Diego Hernández — maduración tardía: potencial de crecimiento aún por expresarse."' },
        { h3: 'Qué hacer con esta información' },
        { p: 'La bandera madurativa no cambia el índice de potencial por sí sola, pero sí cambia la conversación: un IPD alto combinado con maduración tardía es una señal para invertir tiempo de desarrollo, no para descartar.' },
        { lista: ['Maduración temprana: ventaja física actual que puede nivelarse con la edad', 'Maduración tardía: el rendimiento actual puede subestimar el potencial futuro', 'La proyección a 2-3 años (IPRO) ajusta parcialmente por esta señal'] },
      ],
    },
    acwr: {
      categoria: 'Bienestar', badge: 'badge-exito', icono: ICONOS.pulso,
      titulo: 'ACWR en la práctica: leer la carga aguda/crónica sin salir de la cancha',
      fecha: '15 jun 2026', lectura: '5 min de lectura',
      cuerpo: [
        { p: 'La carga aguda/crónica (ACWR, por sus siglas en inglés) compara cuánto entrenó un alumno en los últimos días frente a su promedio de las últimas semanas. Cuando la carga reciente crece mucho más rápido que la carga habitual, el riesgo de lesión sube.' },
        { h3: 'Cómo lo interpreta SIGTDE' },
        { p: 'Cada check-in semanal de bienestar registra esfuerzo percibido (PSE), sueño, ánimo y molestias. El sistema compara el promedio de las últimas dos semanas contra las semanas previas: si la razón supera 1.15 marca una alerta amarilla, y si supera 1.35 marca una alerta roja.' },
        { p: 'Estas alertas no son un diagnóstico. Son una señal para que el entrenador tenga una conversación breve, ajuste el volumen de entrenamiento o pida revisión con el equipo de salud de la institución.' },
        { quote: '"El sistema nunca diagnostica, solo señala patrones."' },
        { h3: 'Una alerta real del piloto (simulada para esta PDC)' },
        { p: 'En el panel de bienestar del entrenador, un caso como "carga aguda/crónica en amarillo: vigilar volumen" aparece automáticamente en cuanto los check-ins muestran esa tendencia — sin que nadie tenga que revisar hojas de cálculo a mano.' },
        { lista: ['PSE 1-10, sueño y ánimo 1-5, molestias en texto libre', 'Alerta amarilla: razón ≥ 1.15', 'Alerta roja: razón ≥ 1.35'] },
      ],
    },
    migracion: {
      categoria: 'Casos de uso', badge: 'badge-alerta', icono: ICONOS.tendencia,
      titulo: 'De la hoja de cálculo al dashboard: así migraron 3 escuelas piloto',
      fecha: '02 jun 2026', lectura: '7 min de lectura',
      cuerpo: [
        { p: 'Antes de SIGTDE, la forma más común de registrar evaluaciones físicas escolares era una hoja de cálculo compartida por correo entre el docente de Educación Física y la coordinación deportiva. Funcionaba, hasta que dejaba de hacerlo: fórmulas rotas, columnas movidas, percentiles calculados a mano con tablas impresas.' },
        { h3: 'El punto de partida' },
        { p: 'Las tres escuelas piloto compartían un mismo dolor: podían capturar los datos, pero no podían compararlos de forma justa entre edades y sexos, ni dar seguimiento longitudinal sin reconstruir la hoja de cálculo cada semestre.' },
        { h3: 'Qué cambió con la migración' },
        { p: 'La captura en cancha se mantuvo casi igual — una tabla editable, ahora con percentiles e índices calculados al instante. Lo que cambió fue todo lo que pasaba después: desglose transparente por prueba, alertas de bienestar automáticas y un flujo de becas con bitácora de decisiones.' },
        { quote: '"Más fácil que Excel, con ciencia detrás."' },
        { p: 'En un semestre, las tres escuelas evaluaron en conjunto a más de 300 estudiantes con la misma batería núcleo de 10 pruebas, algo que antes tomaba semanas de consolidación manual.' },
        { lista: ['Captura en cancha, incluso sin internet', 'Percentiles e índices recalculados al instante', 'Bitácora de decisiones de becas con motivo registrado'] },
      ],
    },
  };

  function construirCuerpo(bloques) {
    return bloques.map(b => {
      if (b.h3) return `<h3 style="margin-top:28px;">${b.h3}</h3>`;
      if (b.quote) return `<blockquote style="margin:24px 0;padding:16px 20px;border-left:3px solid var(--primario);background:var(--bg-alt);border-radius:0 var(--radio) var(--radio) 0;font-style:italic;color:var(--text);">${b.quote}</blockquote>`;
      if (b.lista) return `<ul style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">${b.lista.map(li => `<li class="flex gap-8" style="align-items:flex-start;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="color:var(--exito);flex-shrink:0;margin-top:3px;"><path d="M20 6 9 17l-5-5"/></svg><span>${li}</span></li>`).join('')}</ul>`;
      return `<p style="margin-top:18px;color:var(--text-muted);line-height:1.7;">${b.p}</p>`;
    }).join('');
  }

  function render() {
    const parametros = new URLSearchParams(window.location.search);
    const slug = parametros.get('post');
    const post = POSTS[slug] || POSTS.percentiles;

    document.title = `${post.titulo} — Blog SIGTDE`;
    document.getElementById('catBadge').textContent = post.categoria;
    document.getElementById('catBadge').className = `badge ${post.badge}`;
    document.getElementById('fechaLectura').textContent = `${post.fecha} · ${post.lectura}`;
    document.getElementById('tituloArticulo').textContent = post.titulo;
    document.getElementById('iconoArticulo').innerHTML = post.icono;
    document.getElementById('cuerpoArticulo').innerHTML = construirCuerpo(post.cuerpo);

    const otros = Object.entries(POSTS).filter(([s]) => s !== (POSTS[slug] ? slug : 'percentiles'));
    document.getElementById('otrosArticulos').innerHTML = otros.map(([s, p]) => `
      <a href="blog-post.html?post=${s}" class="tarjeta tarjeta-hover" style="display:block;">
        <span class="badge ${p.badge}">${p.categoria}</span>
        <h3 style="font-size:16px;margin-top:10px;">${p.titulo}</h3>
        <p class="texto-xs texto-muted" style="margin-top:8px;">${p.lectura}</p>
      </a>
    `).join('');
  }

  render();

  /* ------------------------------ Navbar: sombra + menú móvil (igual que landing.js) ------------------------------ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('con-sombra', window.scrollY > 8), { passive: true });
  }
  const navToggle = document.getElementById('navToggle');
  const navMovil = document.getElementById('navMovil');
  if (navToggle && navMovil) {
    navToggle.addEventListener('click', () => {
      const abierto = navMovil.classList.toggle('abierto');
      navToggle.setAttribute('aria-expanded', String(abierto));
    });
  }
})();
