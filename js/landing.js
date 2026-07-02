/* ==========================================================================
   SIGTDE — Interacciones de la landing page
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------ Navbar: sombra + menú móvil ------------------------------ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('con-sombra', window.scrollY > 8);
  }, { passive: true });

  const navToggle = document.getElementById('navToggle');
  const navMovil = document.getElementById('navMovil');
  navToggle.addEventListener('click', () => {
    const abierto = navMovil.classList.toggle('abierto');
    navToggle.setAttribute('aria-expanded', String(abierto));
  });
  navMovil.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMovil.classList.remove('abierto');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ------------------------------ Animación de entrada al hacer scroll ------------------------------ */
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-aparecer]').forEach(elemento => observador.observe(elemento));

  /* ------------------------------ Cifras animadas (count-up) ------------------------------ */
  function animarNumero(elemento, destino, duracionMs = 1400) {
    const inicio = performance.now();
    function paso(ahora) {
      const progreso = Math.min(1, (ahora - inicio) / duracionMs);
      const facilitado = 1 - Math.pow(1 - progreso, 3);
      elemento.textContent = Math.round(destino * facilitado);
      if (progreso < 1) requestAnimationFrame(paso);
      else elemento.textContent = destino;
    }
    requestAnimationFrame(paso);
  }
  const observadorCifras = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const destino = Number(entrada.target.dataset.cifra);
        animarNumero(entrada.target, destino);
        observadorCifras.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-cifra]').forEach(elemento => observadorCifras.observe(elemento));

  /* ------------------------------ Mock dashboard del hero (radar + valores) ------------------------------ */
  window.addEventListener('DOMContentLoaded', () => {
    const poly = document.getElementById('mockRadarPoly');
    if (poly) {
      // Perfil ilustrativo: velocidad, resistencia, potencia, agilidad, flexibilidad (5 ejes)
      const valores01 = [0.62, 0.7, 0.88, 0.66, 0.55];
      const cx = 110, cy = 90, rMax = 62;
      const pts = valores01.map((v, i) => {
        const ang = (Math.PI * 2 * i) / valores01.length - Math.PI / 2;
        return [cx + rMax * v * Math.cos(ang), cy + rMax * v * Math.sin(ang)];
      });
      setTimeout(() => poly.setAttribute('points', pts.map(p => p.join(',')).join(' ')), 250);
    }
    animarNumero(document.getElementById('mockValor1'), 90, 1200);
    animarNumero(document.getElementById('mockValor2'), 88, 1200);
  });

  /* ------------------------------ Noticias: filtro por alcance (contenido simulado) ------------------------------ */
  const NOTICIAS = {
    nacional: [
      { tag: 'Nacional', titulo: 'Programas de talento deportivo escolar crecen 18% en instituciones privadas de México', fecha: '28 jun 2026', resumen: 'Más planteles de educación media superior adoptan baterías de evaluación física estandarizadas.', fuente: 'Redacción Deportiva Escolar (simulado)' },
      { tag: 'Nacional', titulo: 'Voleibol y basquetbol lideran la preferencia de nuevas ligas estudiantiles', fecha: '21 jun 2026', resumen: 'Encuestas informales señalan un repunte de interés en deportes de conjunto entre 15 y 18 años.', fuente: 'Redacción Deportiva Escolar (simulado)' },
      { tag: 'Nacional', titulo: 'Especialistas piden estandarizar pruebas físicas en educación media superior', fecha: '10 jun 2026', resumen: 'Piden comparar resultados por edad y sexo en lugar de valores crudos entre escuelas.', fuente: 'Redacción Deportiva Escolar (simulado)' },
    ],
    estatal: [
      { tag: 'Hidalgo', titulo: 'Hidalgo impulsa evaluación física estandarizada en escuelas de nivel medio superior', fecha: '25 jun 2026', resumen: 'Instituciones del estado exploran metodologías con percentiles por edad y sexo.', fuente: 'Gaceta Escolar Hidalgo (simulado)' },
      { tag: 'Hidalgo', titulo: 'Selectivo estatal de voleibol juvenil se realizará en agosto en Pachuca', fecha: '18 jun 2026', resumen: 'Convocatoria abierta para equipos de nivel medio superior de todo el estado.', fuente: 'Gaceta Escolar Hidalgo (simulado)' },
      { tag: 'Hidalgo', titulo: 'Instituciones de Hidalgo reportan aumento en captación por programas deportivos', fecha: '05 jun 2026', resumen: 'La diferenciación con ciencia del deporte asoma como argumento de matrícula.', fuente: 'Gaceta Escolar Hidalgo (simulado)' },
    ],
    municipal: [
      { tag: 'Pachuca', titulo: 'Pachuca sede del Selectivo Regional de Basquetbol Sub-17', fecha: '29 jun 2026', resumen: 'El municipio recibirá a equipos de la región centro durante la próxima temporada.', fuente: 'Boletín Municipal de Deporte (simulado)' },
      { tag: 'Pachuca', titulo: 'Escuela piloto de SIGTDE presenta resultados de su primer semestre de evaluación', fecha: '15 jun 2026', resumen: 'Más de 300 alumnos evaluados con la batería núcleo de 10 pruebas.', fuente: 'Boletín Municipal de Deporte (simulado)' },
      { tag: 'Pachuca', titulo: 'Municipio de Pachuca amplía horarios de canchas escolares para entrenamientos', fecha: '02 jun 2026', resumen: 'La medida busca facilitar la aplicación de baterías físicas en horario extendido.', fuente: 'Boletín Municipal de Deporte (simulado)' },
    ],
  };

  function pintarNoticias(ambito) {
    const lista = document.getElementById('listaNoticias');
    lista.innerHTML = NOTICIAS[ambito].map(n => `
      <article class="tarjeta tarjeta-hover noticia-item">
        <div class="flex-entre" style="gap:10px;">
          <span class="badge badge-azul">${n.tag}</span>
          <span class="texto-xs texto-muted">${n.fecha}</span>
        </div>
        <h3 style="font-size:17px;margin-top:12px;">${n.titulo}</h3>
        <p class="texto-muted texto-sm" style="margin-top:8px;">${n.resumen}</p>
        <p class="texto-xs texto-muted" style="margin-top:12px;">${n.fuente}</p>
      </article>
    `).join('');
  }
  const tabsNoticias = document.getElementById('tabsNoticias');
  if (tabsNoticias) {
    tabsNoticias.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabsNoticias.querySelectorAll('.tab').forEach(t => t.classList.remove('activo'));
        tab.classList.add('activo');
        pintarNoticias(tab.dataset.ambito);
      });
    });
    pintarNoticias('nacional');
  }

  /* ------------------------------ Formulario "Agenda una demo" (simulado, sin backend) ------------------------------ */
  const form = document.getElementById('formDemo');
  const formCampos = document.getElementById('formCampos');
  const formExito = document.getElementById('formExito');
  const btnOtroEnvio = document.getElementById('btnOtroEnvio');

  const validadores = {
    nombre: v => v.trim().length >= 3,
    institucion: v => v.trim().length >= 2,
    cargo: v => v !== '',
    ubicacion: v => v.trim().length >= 2,
    correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    telefono: v => /^\d{10}$/.test(v.replace(/\D/g, '')),
    numAlumnos: v => Number(v) > 0,
  };

  function validarCampo(nombre) {
    const input = form.elements[nombre];
    const contenedor = form.querySelector(`[data-campo="${nombre}"]`);
    const valido = validadores[nombre](input.value);
    contenedor.classList.toggle('campo-error', !valido);
    return valido;
  }

  Object.keys(validadores).forEach(nombre => {
    const input = form.elements[nombre];
    input.addEventListener('blur', () => validarCampo(nombre));
    input.addEventListener('input', () => {
      const contenedor = form.querySelector(`[data-campo="${nombre}"]`);
      if (contenedor.classList.contains('campo-error')) validarCampo(nombre);
    });
  });

  // Variable en memoria donde "se guarda" la solicitud (no hay backend en la PDC)
  window.SIGTDE_SOLICITUDES_DEMO = [];

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombresCampos = Object.keys(validadores);
    const resultados = nombresCampos.map(validarCampo);
    if (resultados.some(r => !r)) {
      const primerError = form.querySelector('.campo-error input, .campo-error select');
      if (primerError) primerError.focus();
      mostrarToast('Revisa los campos marcados en rojo.', 'alerta');
      return;
    }

    const datos = Object.fromEntries(new FormData(form).entries());
    datos.fecha = new Date().toString();
    window.SIGTDE_SOLICITUDES_DEMO.push(datos);
    console.log('Nueva solicitud de demo (simulada, sin backend):', datos);

    formCampos.classList.add('oculto');
    formExito.classList.remove('oculto');
    mostrarToast('Solicitud enviada correctamente.', 'exito');
  });

  btnOtroEnvio.addEventListener('click', () => {
    form.reset();
    formExito.classList.add('oculto');
    formCampos.classList.remove('oculto');
    form.querySelectorAll('.campo-error').forEach(c => c.classList.remove('campo-error'));
  });

  /* ------------------------------ Toast genérico ------------------------------ */
  function mostrarToast(mensaje, tipo = 'exito') {
    const cont = document.getElementById('toastCont');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;
    cont.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('mostrar'));
    setTimeout(() => {
      toast.classList.remove('mostrar');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }
})();
