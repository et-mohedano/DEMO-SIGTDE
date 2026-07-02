/* ==========================================================================
   SIGTDE — Gráficas SVG dibujadas a mano con JavaScript (sin librerías)
   Radar, línea, dona y barras. Todas devuelven un <svg> listo para insertar.
   ========================================================================== */

const SIGTDE_CHARTS = (function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const PALETA_SERIES = ['#2D5BE3', '#6B35D9', '#22C55E', '#F59E0B'];

  function el(tag, attrs = {}) {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  }

  /* ------------------------------- Tooltip flotante compartido ------------------------------- */
  let tooltipEl = null;
  function tooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'grafica-tooltip';
      tooltipEl.style.cssText = 'position:fixed;pointer-events:none;background:#0A0F2E;color:#fff;' +
        'font-size:12.5px;font-weight:600;padding:7px 11px;border-radius:8px;z-index:400;opacity:0;' +
        'transition:opacity 120ms ease;transform:translate(-50%,-115%);white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,.25);';
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }
  function mostrarTooltip(evt, html) {
    const t = tooltip();
    t.innerHTML = html;
    t.style.left = evt.clientX + 'px';
    t.style.top = evt.clientY + 'px';
    t.style.opacity = '1';
  }
  function moverTooltip(evt) {
    const t = tooltip();
    t.style.left = evt.clientX + 'px';
    t.style.top = evt.clientY + 'px';
  }
  function ocultarTooltip() {
    if (tooltipEl) tooltipEl.style.opacity = '0';
  }

  /* ------------------------------------- RADAR --------------------------------------- */
  /**
   * ejes: [{clave, etiqueta}]
   * series: [{etiqueta, color, valores: {clave: 0-100}, relleno: bool}]
   */
  function radar({ ejes, series, tam = 280, niveles = 4 }) {
    const cx = tam / 2, cy = tam / 2, radioMax = tam / 2 - 46;
    const n = ejes.length;
    const angulo = i => (Math.PI * 2 * i) / n - Math.PI / 2;
    const punto = (i, valor01) => {
      const r = radioMax * valor01;
      return [cx + r * Math.cos(angulo(i)), cy + r * Math.sin(angulo(i))];
    };

    const svg = el('svg', { viewBox: `0 0 ${tam} ${tam}`, width: '100%', height: tam, role: 'img', 'aria-label': 'Gráfica de radar' });

    // Rejilla (anillos concéntricos)
    for (let nivel = 1; nivel <= niveles; nivel++) {
      const frac = nivel / niveles;
      const pts = ejes.map((_, i) => punto(i, frac).join(',')).join(' ');
      svg.appendChild(el('polygon', { points: pts, fill: 'none', stroke: '#E7E9EF', 'stroke-width': 1 }));
    }
    // Ejes + etiquetas
    ejes.forEach((eje, i) => {
      const [x, y] = punto(i, 1);
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: x, y2: y, stroke: '#E7E9EF', 'stroke-width': 1 }));
      const [lx, ly] = punto(i, 1.22);
      const t = el('text', {
        x: lx, y: ly, 'text-anchor': Math.abs(lx - cx) < 6 ? 'middle' : (lx > cx ? 'start' : 'end'),
        'dominant-baseline': ly < cy - 6 ? 'auto' : (ly > cy + 6 ? 'hanging' : 'middle'),
        'font-size': '11.5', fill: '#5B6472', 'font-weight': '700', 'font-family': 'inherit',
      });
      t.textContent = eje.etiqueta;
      svg.appendChild(t);
    });

    // Series
    series.forEach((serie, si) => {
      const color = serie.color || PALETA_SERIES[si % PALETA_SERIES.length];
      const pts = ejes.map((eje, i) => punto(i, Math.max(0, Math.min(100, serie.valores[eje.clave] || 0)) / 100));
      const poly = el('polygon', {
        points: pts.map(p => p.join(',')).join(' '),
        fill: serie.relleno === false ? 'none' : color, 'fill-opacity': serie.relleno === false ? 0 : 0.14,
        stroke: color, 'stroke-width': 2.4, 'stroke-dasharray': serie.punteado ? '5,4' : 'none',
      });
      svg.appendChild(poly);
      pts.forEach((p, i) => {
        const c = el('circle', { cx: p[0], cy: p[1], r: 4.5, fill: '#fff', stroke: color, 'stroke-width': 2.5, style: 'cursor:pointer' });
        c.addEventListener('mouseenter', evt => mostrarTooltip(evt, `<strong>${ejes[i].etiqueta}</strong><br>${serie.etiqueta}: ${serie.valores[ejes[i].clave]}`));
        c.addEventListener('mousemove', moverTooltip);
        c.addEventListener('mouseleave', ocultarTooltip);
        svg.appendChild(c);
      });
    });

    return svg;
  }

  /* -------------------------------------- LÍNEA --------------------------------------- */
  /**
   * series: [{etiqueta, color, valores:number[]}]
   * etiquetasX: string[]
   */
  function linea({ series, etiquetasX, ancho = 560, alto = 220, yMin = null, yMax = null, unidad = '' }) {
    const pad = { l: 40, r: 18, t: 18, b: 30 };
    const w = ancho - pad.l - pad.r, h = alto - pad.t - pad.b;
    const todos = series.flatMap(s => s.valores);
    const min = yMin !== null ? yMin : Math.min(...todos) * 0.94;
    const max = yMax !== null ? yMax : Math.max(...todos) * 1.06;

    const svg = el('svg', { viewBox: `0 0 ${ancho} ${alto}`, width: '100%', height: alto, role: 'img', 'aria-label': 'Gráfica de línea' });

    const x = i => pad.l + (w * i) / (etiquetasX.length - 1 || 1);
    const y = v => pad.t + h - ((v - min) / (max - min || 1)) * h;

    // Rejilla horizontal
    for (let i = 0; i <= 3; i++) {
      const yy = pad.t + (h * i) / 3;
      svg.appendChild(el('line', { x1: pad.l, y1: yy, x2: ancho - pad.r, y2: yy, stroke: '#E7E9EF', 'stroke-width': 1 }));
      const valor = max - ((max - min) * i) / 3;
      const t = el('text', { x: pad.l - 8, y: yy + 4, 'text-anchor': 'end', 'font-size': '10.5', fill: '#5B6472' });
      t.textContent = valor.toFixed(1);
      svg.appendChild(t);
    }
    // Etiquetas eje X
    etiquetasX.forEach((etq, i) => {
      const t = el('text', { x: x(i), y: alto - 8, 'text-anchor': 'middle', 'font-size': '11', fill: '#5B6472', 'font-weight': '600' });
      t.textContent = etq;
      svg.appendChild(t);
    });

    series.forEach((serie, si) => {
      const color = serie.color || PALETA_SERIES[si % PALETA_SERIES.length];
      const pts = serie.valores.map((v, i) => [x(i), y(v)]);
      const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
      svg.appendChild(el('path', { d, fill: 'none', stroke: color, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      pts.forEach((p, i) => {
        const c = el('circle', { cx: p[0], cy: p[1], r: 4.5, fill: color, stroke: '#fff', 'stroke-width': 2, style: 'cursor:pointer' });
        c.addEventListener('mouseenter', evt => mostrarTooltip(evt, `<strong>${etiquetasX[i]}</strong><br>${serie.etiqueta}: ${serie.valores[i]}${unidad}`));
        c.addEventListener('mousemove', moverTooltip);
        c.addEventListener('mouseleave', ocultarTooltip);
        svg.appendChild(c);
      });
    });

    return svg;
  }

  /* --------------------------------------- DONA --------------------------------------- */
  /** datos: [{etiqueta, valor, color}] */
  function dona({ datos, tam = 190, grosor = 26, tituloCentro = '', valorCentro = '' }) {
    const cx = tam / 2, cy = tam / 2, r = tam / 2 - grosor / 2 - 2;
    const total = datos.reduce((s, d) => s + d.valor, 0) || 1;
    const svg = el('svg', { viewBox: `0 0 ${tam} ${tam}`, width: '100%', height: tam, role: 'img', 'aria-label': 'Gráfica de dona' });

    let acumulado = -Math.PI / 2;
    datos.forEach((d, i) => {
      const frac = d.valor / total;
      const ang = frac * Math.PI * 2;
      const x1 = cx + r * Math.cos(acumulado), y1 = cy + r * Math.sin(acumulado);
      const x2 = cx + r * Math.cos(acumulado + ang), y2 = cy + r * Math.sin(acumulado + ang);
      const largeArc = ang > Math.PI ? 1 : 0;
      const color = d.color || PALETA_SERIES[i % PALETA_SERIES.length];
      const path = el('path', {
        d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        fill: 'none', stroke: color, 'stroke-width': grosor, style: 'cursor:pointer',
      });
      path.addEventListener('mouseenter', evt => mostrarTooltip(evt, `<strong>${d.etiqueta}</strong><br>${d.valor} (${Math.round(frac * 100)}%)`));
      path.addEventListener('mousemove', moverTooltip);
      path.addEventListener('mouseleave', ocultarTooltip);
      svg.appendChild(path);
      acumulado += ang;
    });

    if (tituloCentro || valorCentro) {
      const tv = el('text', { x: cx, y: cy - 3, 'text-anchor': 'middle', 'font-size': '22', 'font-weight': '800', fill: '#111318' });
      tv.textContent = valorCentro;
      svg.appendChild(tv);
      const tt = el('text', { x: cx, y: cy + 15, 'text-anchor': 'middle', 'font-size': '10.5', fill: '#5B6472', 'font-weight': '600' });
      tt.textContent = tituloCentro;
      svg.appendChild(tt);
    }
    return svg;
  }

  /* -------------------------------------- BARRAS -------------------------------------- */
  /** datos: [{etiqueta, valor, color}] — barras horizontales */
  function barras({ datos, ancho = 480, max = null, altoBarra = 26, espacio = 14 }) {
    const m = max || Math.max(...datos.map(d => d.valor)) * 1.15;
    const padL = 118;
    const alto = datos.length * (altoBarra + espacio);
    const svg = el('svg', { viewBox: `0 0 ${ancho} ${alto}`, width: '100%', height: alto, role: 'img', 'aria-label': 'Gráfica de barras' });

    datos.forEach((d, i) => {
      const y = i * (altoBarra + espacio);
      const anchoDisponible = ancho - padL - 46;
      const w = Math.max(2, (d.valor / m) * anchoDisponible);
      const color = d.color || PALETA_SERIES[i % PALETA_SERIES.length];

      const et = el('text', { x: padL - 10, y: y + altoBarra / 2 + 4, 'text-anchor': 'end', 'font-size': '12.5', fill: '#111318', 'font-weight': '600' });
      et.textContent = d.etiqueta;
      svg.appendChild(et);

      svg.appendChild(el('rect', { x: padL, y, width: anchoDisponible, height: altoBarra, rx: 7, fill: '#F8F9FB' }));
      const rect = el('rect', { x: padL, y, width: 0, height: altoBarra, rx: 7, fill: color, style: 'cursor:pointer;transition:width 700ms cubic-bezier(.22,1,.36,1)' });
      svg.appendChild(rect);
      requestAnimationFrame(() => rect.setAttribute('width', w));

      rect.addEventListener('mouseenter', evt => mostrarTooltip(evt, `<strong>${d.etiqueta}</strong><br>${d.valor}`));
      rect.addEventListener('mousemove', moverTooltip);
      rect.addEventListener('mouseleave', ocultarTooltip);

      const val = el('text', { x: padL + w + 10, y: y + altoBarra / 2 + 4, 'font-size': '12.5', fill: '#5B6472', 'font-weight': '700' });
      val.textContent = d.valor;
      svg.appendChild(val);
    });

    return svg;
  }

  return { radar, linea, dona, barras, mostrarTooltip, ocultarTooltip };
})();
