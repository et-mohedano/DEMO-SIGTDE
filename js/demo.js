/* ==========================================================================
   SIGTDE — Shell del demo: selector de rol, barra superior y utilidades de UI
   compartidas (toast, modal) que usan las 4 vistas.
   ========================================================================== */

/* ------------------------------ Utilidades de UI compartidas ------------------------------ */
const SIGTDE_UI = (function () {
  'use strict';

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
    }, 3400);
  }

  const modalFondo = () => document.getElementById('modalFondo');
  const modalContenido = () => document.getElementById('modalContenido');

  function abrirModal(html) {
    const contenido = modalContenido();
    contenido.innerHTML = html;
    modalFondo().classList.add('activo');
    const primerFoco = contenido.querySelector('input, select, textarea, button');
    if (primerFoco) primerFoco.focus();
    return contenido;
  }
  function cerrarModal() {
    modalFondo().classList.remove('activo');
  }

  document.addEventListener('DOMContentLoaded', () => {
    modalFondo().addEventListener('click', (e) => { if (e.target === modalFondo()) cerrarModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });
  });

  function formatoPorcentaje(valor) { return `${Math.round(valor)}%`; }
  function iniciales(nombre) {
    return nombre.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
  function colorBanda(banda) {
    return { sin_recomendacion: 'neutro', prospecto: 'azul', parcial: 'alerta', prioritaria: 'exito' }[banda] || 'neutro';
  }
  function etiquetaBanda(banda) {
    return { sin_recomendacion: 'Sin recomendación', prospecto: 'Prospecto', parcial: 'Beca parcial', prioritaria: 'Beca prioritaria' }[banda] || banda;
  }

  return { mostrarToast, abrirModal, cerrarModal, formatoPorcentaje, iniciales, colorBanda, etiquetaBanda };
})();

/* ------------------------------ Controlador de vistas / roles ------------------------------ */
(function () {
  'use strict';

  const secciones = {
    alumno: document.getElementById('vista-alumno'),
    entrenador: document.getElementById('vista-entrenador'),
    directivo: document.getElementById('vista-directivo'),
    padres: document.getElementById('vista-padres'),
  };
  const pantallaEntrada = document.getElementById('pantallaEntrada');
  const barraDemo = document.getElementById('barraDemo');
  const inicializadas = new Set();
  let rolActual = null;

  function actualizarBotonesRol(rol) {
    document.querySelectorAll('#selectorRolMini button').forEach(btn => {
      btn.classList.toggle('activo', btn.dataset.rol === rol);
    });
  }

  function mostrarVista(rol) {
    if (!secciones[rol]) return;
    rolActual = rol;
    pantallaEntrada.classList.add('oculto');
    barraDemo.classList.remove('oculto');
    Object.entries(secciones).forEach(([r, el]) => el.classList.toggle('oculto', r !== rol));
    actualizarBotonesRol(rol);

    const vista = window.SIGTDE_VISTAS && window.SIGTDE_VISTAS[rol];
    if (vista) {
      if (!inicializadas.has(rol)) {
        vista.render(secciones[rol]);
        inicializadas.add(rol);
      } else if (vista.actualizar) {
        vista.actualizar(secciones[rol]);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Tarjetas grandes de la pantalla de entrada
  document.querySelectorAll('.tarjeta-rol').forEach(btn => {
    btn.addEventListener('click', () => mostrarVista(btn.dataset.rol));
  });
  // Selector compacto en la barra superior
  document.querySelectorAll('#selectorRolMini button').forEach(btn => {
    btn.addEventListener('click', () => mostrarVista(btn.dataset.rol));
  });

  // Entrada directa desde la landing: demo.html?rol=alumno
  // Se espera a DOMContentLoaded porque los scripts de cada vista (js/vista-*.js)
  // se cargan después de este archivo y registran window.SIGTDE_VISTAS al ejecutarse.
  document.addEventListener('DOMContentLoaded', () => {
    const parametros = new URLSearchParams(window.location.search);
    const rolInicial = parametros.get('rol');
    if (rolInicial && secciones[rolInicial]) {
      mostrarVista(rolInicial);
    }
  });

  window.SIGTDE_DEMO = { mostrarVista };
})();
