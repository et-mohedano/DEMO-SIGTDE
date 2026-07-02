/* ==========================================================================
   SIGTDE — Vista ENTRENADOR
   Persona: Coach Mariana Ruiz, voleibol y basquetbol.
   ========================================================================== */

window.SIGTDE_VISTAS = window.SIGTDE_VISTAS || {};

(function () {
  'use strict';

  const ETIQUETAS_DIM = [
    { clave: 'velocidad', etiqueta: 'Velocidad' },
    { clave: 'resistencia', etiqueta: 'Resistencia' },
    { clave: 'potencia', etiqueta: 'Potencia' },
    { clave: 'fuerza', etiqueta: 'Fuerza' },
    { clave: 'agilidad', etiqueta: 'Agilidad' },
    { clave: 'flexibilidad', etiqueta: 'Flexibilidad' },
  ];
  const CAMPOS_BATERIA = ['estatura', 'peso', 'envergadura', 'sprint20', 'cmj', 'saltoHorizontal', 'lanzamiento', 'dominadas', 'agilidad510', 'yoyo', 'sitReach'];

  const SLOTS_DEPORTE = {
    futbol: [
      { id: 'gk', pos: 'portero', etiqueta: 'Portero', x: 200, y: 235 },
      { id: 'df1', pos: 'defensa', etiqueta: 'Defensa', x: 120, y: 178 },
      { id: 'df2', pos: 'defensa', etiqueta: 'Defensa', x: 280, y: 178 },
      { id: 'lat1', pos: 'lateral', etiqueta: 'Lateral', x: 55, y: 140 },
      { id: 'lat2', pos: 'lateral', etiqueta: 'Lateral', x: 345, y: 140 },
      { id: 'med', pos: 'medio', etiqueta: 'Medio', x: 200, y: 115 },
      { id: 'del1', pos: 'delantero', etiqueta: 'Delantero', x: 140, y: 52 },
      { id: 'del2', pos: 'delantero', etiqueta: 'Delantero', x: 260, y: 52 },
    ],
    basquetbol: [
      { id: 'base', pos: 'base', etiqueta: 'Base', x: 200, y: 225 },
      { id: 'escolta', pos: 'escolta', etiqueta: 'Escolta', x: 90, y: 165 },
      { id: 'alero', pos: 'alero', etiqueta: 'Alero', x: 310, y: 165 },
      { id: 'alapivot', pos: 'alapivot', etiqueta: 'Ala-pívot', x: 140, y: 75 },
      { id: 'pivot', pos: 'pivot', etiqueta: 'Pívot', x: 260, y: 75 },
    ],
    voleibol: [
      { id: 'receptor1', pos: 'receptor', etiqueta: 'Receptor', x: 70, y: 205 },
      { id: 'armador', pos: 'armador', etiqueta: 'Armador', x: 200, y: 205 },
      { id: 'receptor2', pos: 'receptor', etiqueta: 'Receptor', x: 330, y: 205 },
      { id: 'central1', pos: 'central', etiqueta: 'Central', x: 70, y: 80 },
      { id: 'opuesto', pos: 'opuesto', etiqueta: 'Opuesto', x: 200, y: 80 },
      { id: 'central2', pos: 'central', etiqueta: 'Central', x: 330, y: 80 },
    ],
  };

  // Estado del constructor de alineación: vive en memoria mientras dure la sesión.
  const alineacionEstado = { futbol: {}, basquetbol: {}, voleibol: {} };
  let deporteAlineacionActual = 'futbol';

  function etiquetaDimension(clave) {
    return { velocidad: 'velocidad', resistencia: 'resistencia', potencia: 'potencia de salto', fuerza: 'fuerza', agilidad: 'agilidad', flexibilidad: 'flexibilidad' }[clave] || clave;
  }

  function render(container) {
    const alumnos = SIGTDE.estado.alumnos;

    container.innerHTML = `
      <div class="contenedor">
        <div class="aviso-simulado">🔬 Datos simulados — vista Entrenador</div>

        <div class="vista-cabecera tarjeta persona-card">
          <div class="avatar avatar-lg">MR</div>
          <div class="persona-datos">
            <h3>Coach Mariana Ruiz</h3>
            <p class="texto-muted texm-sm texto-sm">Voleibol y Basquetbol · ${alumnos.length} alumnos en seguimiento</p>
          </div>
        </div>

        <div class="tabs" id="tabsEntrenador" style="margin-top:22px;">
          <button type="button" class="tab activo" data-tab="captura">Captura en cancha</button>
          <button type="button" class="tab" data-tab="ranking">Ranking del equipo</button>
          <button type="button" class="tab" data-tab="compatibilidad">Compatibilidad por posición</button>
          <button type="button" class="tab" data-tab="alineacion">Constructor de alineación</button>
          <button type="button" class="tab" data-tab="bienestar">Bienestar</button>
        </div>

        <div class="tarjeta" style="margin-top:0;border-top-left-radius:0;" id="panelCaptura"></div>
        <div class="tarjeta oculto" id="panelRanking"></div>
        <div class="tarjeta oculto" id="panelCompatibilidad"></div>
        <div class="oculto" id="panelAlineacion"></div>
        <div class="tarjeta oculto" id="panelBienestar"></div>
      </div>
    `;

    document.getElementById('panelCaptura').innerHTML = htmlCaptura(alumnos);
    document.getElementById('panelRanking').innerHTML = htmlRanking();
    document.getElementById('panelCompatibilidad').innerHTML = htmlCompatibilidad(alumnos);
    document.getElementById('panelAlineacion').innerHTML = htmlAlineacion();
    document.getElementById('panelBienestar').innerHTML = htmlBienestar(alumnos);

    wireTabs(container);
    wireCaptura(container);
    wireRanking();
    wireCompatibilidad(alumnos);
    wireAlineacion(alumnos);
  }

  function wireTabs(container) {
    const paneles = { captura: 'panelCaptura', ranking: 'panelRanking', compatibilidad: 'panelCompatibilidad', alineacion: 'panelAlineacion', bienestar: 'panelBienestar' };
    container.querySelectorAll('#tabsEntrenador .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('#tabsEntrenador .tab').forEach(t => t.classList.remove('activo'));
        tab.classList.add('activo');
        Object.values(paneles).forEach(id => document.getElementById(id).classList.add('oculto'));
        document.getElementById(paneles[tab.dataset.tab]).classList.remove('oculto');
        if (tab.dataset.tab === 'alineacion') dibujarCancha(SIGTDE.estado.alumnos);
      });
    });
  }

  /* ---------------------------------- Captura en cancha ---------------------------------- */
  function htmlCaptura(alumnos) {
    const filas = alumnos.map(a => {
      const u = a.evaluaciones[a.evaluaciones.length - 1];
      const celdas = CAMPOS_BATERIA.map(c => `<td><input type="number" step="0.01" class="input-celda" data-campo="${c}" value="${u.crudos[c]}"></td>`).join('');
      return `<tr data-id="${a.id}">
        <td><strong>${a.nombre}</strong><br><span class="texto-xs texto-muted">${a.sexo} · ${a.edad} a.</span></td>
        ${celdas}
        <td class="valor-ipf peso-700">${u.indices.IPF}</td>
        <td class="valor-ipb peso-700">${u.indices.IPB}</td>
        <td class="valor-ipv peso-700">${u.indices.IPV}</td>
      </tr>`;
    }).join('');
    return `
      <div class="flex-entre" style="margin-bottom:14px;flex-wrap:wrap;gap:10px;">
        <p class="texto-muted texto-sm" style="max-width:520px;">Edita cualquier valor de la batería núcleo: percentil e índice se recalculan al instante. Un dato fuera de rango humano se marca en ámbar como "atípico: revalidar".</p>
        <span class="badge badge-neutro">📶 Modo sin conexión (simulado)</span>
      </div>
      <div class="tabla-wrap">
        <table class="tabla" id="tablaCaptura">
          <thead><tr>
            <th>Alumno</th>
            <th title="Estatura (cm)">Est.</th><th title="Peso (kg)">Peso</th><th title="Envergadura (cm)">Env.</th>
            <th title="Sprint 20 m (s)">Sprint20</th><th title="Salto CMJ (cm)">CMJ</th><th title="Salto horizontal (cm)">SaltoH</th>
            <th title="Lanzamiento balón medicinal (m)">Lanz.</th><th title="Dominadas (rep)">Domin.</th>
            <th title="Agilidad 5-10-5 (s)">Agil.</th><th title="Yo-Yo IR1 (m)">YoYo</th><th title="Sit and reach (cm)">SitR</th>
            <th>IPF</th><th>IPB</th><th>IPV</th>
          </tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;
  }

  function wireCaptura() {
    document.getElementById('tablaCaptura').addEventListener('input', (evento) => {
      const input = evento.target;
      if (!input.matches('input[data-campo]')) return;
      const fila = input.closest('tr');
      const alumno = SIGTDE.obtenerAlumno(fila.dataset.id);
      const crudos = {};
      fila.querySelectorAll('input[data-campo]').forEach(inp => { crudos[inp.dataset.campo] = parseFloat(inp.value); });

      fila.querySelectorAll('input[data-campo]').forEach(inp => {
        const atipico = SIGTDE.esValorAtipico(inp.dataset.campo, parseFloat(inp.value), alumno.sexo);
        inp.classList.toggle('celda-atipica', atipico);
        inp.title = atipico ? 'Dato atípico: revalidar' : '';
      });

      const resultado = SIGTDE.recalcularConCaptura(alumno, crudos);
      fila.querySelector('.valor-ipf').textContent = resultado.indices.IPF;
      fila.querySelector('.valor-ipb').textContent = resultado.indices.IPB;
      fila.querySelector('.valor-ipv').textContent = resultado.indices.IPV;
    });
  }

  /* -------------------------------------- Ranking -------------------------------------- */
  function htmlRanking() {
    return `
      <div class="flex gap-12" style="margin-bottom:20px;flex-wrap:wrap;">
        <div class="campo" style="margin-bottom:0;min-width:240px;">
          <label for="selectRankingMetrica">Ordenar equipo por</label>
          <select id="selectRankingMetrica">
            <option value="IPF">Índice IPF (Futbol)</option>
            <option value="IPB">Índice IPB (Basquetbol)</option>
            <option value="IPV" selected>Índice IPV (Voleibol)</option>
            <option value="sprint20">Percentil — Sprint 20 m</option>
            <option value="cmj">Percentil — Salto CMJ</option>
            <option value="yoyo">Percentil — Yo-Yo IR1</option>
          </select>
        </div>
      </div>
      <div id="graficaRanking"></div>
    `;
  }
  function wireRanking() {
    const select = document.getElementById('selectRankingMetrica');
    select.addEventListener('change', () => pintarRanking(select.value));
    pintarRanking(select.value);
  }
  function pintarRanking(metrica) {
    const alumnos = SIGTDE.estado.alumnos;
    const esIndice = ['IPF', 'IPB', 'IPV'].includes(metrica);
    const datos = alumnos.map(a => {
      const u = a.evaluaciones[a.evaluaciones.length - 1];
      return { etiqueta: a.nombre, valor: esIndice ? u.indices[metrica] : u.percentiles[metrica] };
    }).sort((a, b) => b.valor - a.valor);
    const cont = document.getElementById('graficaRanking');
    cont.innerHTML = '';
    cont.appendChild(SIGTDE_CHARTS.barras({ datos, max: 100, altoBarra: 24, espacio: 12 }));
  }

  /* --------------------------------- Compatibilidad por posición --------------------------------- */
  function htmlCompatibilidad(alumnos) {
    const opciones = alumnos.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
    return `
      <div class="flex gap-12" style="margin-bottom:20px;flex-wrap:wrap;">
        <div class="campo" style="margin-bottom:0;min-width:220px;">
          <label for="selectCompatAlumno">Alumno</label>
          <select id="selectCompatAlumno">${opciones}</select>
        </div>
        <div class="campo" style="margin-bottom:0;min-width:200px;">
          <label for="selectCompatDeporte">Deporte</label>
          <select id="selectCompatDeporte">
            <option value="futbol">Futbol</option>
            <option value="basquetbol">Basquetbol</option>
            <option value="voleibol" selected>Voleibol</option>
          </select>
        </div>
      </div>
      <div class="vista-grid" id="gridCompatibilidad"></div>
    `;
  }
  function wireCompatibilidad(alumnos) {
    const selAlumno = document.getElementById('selectCompatAlumno');
    const selDeporte = document.getElementById('selectCompatDeporte');
    const pintar = () => pintarCompatibilidad(alumnos, selAlumno.value, selDeporte.value);
    selAlumno.addEventListener('change', pintar);
    selDeporte.addEventListener('change', pintar);
    pintar();
  }
  function pintarCompatibilidad(alumnos, alumnoId, deporteKey) {
    const alumno = SIGTDE.obtenerAlumno(alumnoId);
    const deporte = SIGTDE.PERFILES_POSICION[deporteKey];
    const dim = alumno.evaluaciones[alumno.evaluaciones.length - 1].dimensiones;
    const grid = document.getElementById('gridCompatibilidad');
    grid.innerHTML = '';
    Object.entries(deporte.posiciones).forEach(([, pos]) => {
      const compat = SIGTDE.calcularCompatibilidad(dim, pos.perfil);
      const col = document.createElement('div');
      col.className = 'col-4 tarjeta';
      col.innerHTML = `<div class="flex-entre"><h3 style="font-size:16px;">${pos.etiqueta}</h3><span class="badge ${compat >= 80 ? 'badge-exito' : compat >= 60 ? 'badge-azul' : 'badge-neutro'}">${compat}% compatible</span></div><div class="radar-mini" style="margin-top:8px;"></div>`;
      grid.appendChild(col);
      col.querySelector('.radar-mini').appendChild(SIGTDE_CHARTS.radar({
        ejes: ETIQUETAS_DIM, tam: 220,
        series: [
          { etiqueta: alumno.nombre, color: '#2D5BE3', valores: dim },
          { etiqueta: 'Perfil ideal', color: '#5B6472', valores: pos.perfil, relleno: false, punteado: true },
        ],
      }));
    });
  }

  /* --------------------------------- Constructor de alineación --------------------------------- */
  function htmlAlineacion() {
    return `
      <div class="tabs" id="tabsDeporteAlineacion" style="margin-bottom:18px;">
        <button type="button" class="tab activo" data-deporte="futbol">Futbol</button>
        <button type="button" class="tab" data-deporte="basquetbol">Basquetbol</button>
        <button type="button" class="tab" data-deporte="voleibol">Voleibol</button>
      </div>
      <div class="vista-grid">
        <div class="col-8 tarjeta cancha-svg-wrap" id="canchaWrap"></div>
        <div class="col-4 tarjeta">
          <h3>Sugerencias y alertas</h3>
          <p class="texto-muted texto-sm" style="margin-top:8px;">Clic en una posición para asignar. El sistema sugiere al mejor disponible.</p>
          <div id="notasAlineacion" style="margin-top:14px;"></div>
        </div>
      </div>
    `;
  }
  function wireAlineacion(alumnos) {
    document.querySelectorAll('#tabsDeporteAlineacion .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#tabsDeporteAlineacion .tab').forEach(t => t.classList.remove('activo'));
        tab.classList.add('activo');
        deporteAlineacionActual = tab.dataset.deporte;
        dibujarCancha(alumnos);
      });
    });
    dibujarCancha(alumnos);
  }

  function dibujarCancha(alumnos) {
    const wrap = document.getElementById('canchaWrap');
    if (!wrap) return;
    const slots = SLOTS_DEPORTE[deporteAlineacionActual];
    const asignaciones = alineacionEstado[deporteAlineacionActual];
    const ocupados = new Set(Object.values(asignaciones));
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 400 260');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '340');

    const fondo = document.createElementNS(NS, 'rect');
    Object.entries({ x: 10, y: 10, width: 380, height: 240, rx: 12, fill: '#F0FDF4', stroke: '#22C55E', 'stroke-width': 1.5 }).forEach(([k, v]) => fondo.setAttribute(k, v));
    svg.appendChild(fondo);

    const notas = [];
    slots.forEach(slot => {
      const alumnoId = asignaciones[slot.id];
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'pos-slot');

      const circle = document.createElementNS(NS, 'circle');
      Object.entries({ cx: slot.x, cy: slot.y, r: 27, fill: alumnoId ? '#2D5BE3' : '#fff', stroke: alumnoId ? '#1E44B8' : '#5B6472', 'stroke-width': 2 }).forEach(([k, v]) => circle.setAttribute(k, v));
      g.appendChild(circle);

      const texto = document.createElementNS(NS, 'text');
      Object.entries({ x: slot.x, y: alumnoId ? slot.y - 3 : slot.y + 4, 'text-anchor': 'middle', 'font-size': alumnoId ? 9 : 10.5, fill: alumnoId ? '#fff' : '#111318', 'font-weight': 700 }).forEach(([k, v]) => texto.setAttribute(k, v));
      texto.textContent = alumnoId ? SIGTDE.obtenerAlumno(alumnoId).nombre.split(' ')[0] : slot.etiqueta;
      g.appendChild(texto);

      if (alumnoId) {
        const sub = document.createElementNS(NS, 'text');
        Object.entries({ x: slot.x, y: slot.y + 10, 'text-anchor': 'middle', 'font-size': 7.5, fill: 'rgba(255,255,255,.85)' }).forEach(([k, v]) => sub.setAttribute(k, v));
        sub.textContent = slot.etiqueta;
        g.appendChild(sub);

        const alumno = SIGTDE.obtenerAlumno(alumnoId);
        const dim = alumno.evaluaciones[alumno.evaluaciones.length - 1].dimensiones;
        const ideal = SIGTDE.PERFILES_POSICION[deporteAlineacionActual].posiciones[slot.pos].perfil;
        let peorDim = null, peorGap = -Infinity;
        Object.keys(ideal).forEach(k => { const gap = ideal[k] - (dim[k] || 0); if (gap > peorGap) { peorGap = gap; peorDim = k; } });
        if (peorGap > 14) notas.push(`⚠️ Perfil faltante: necesitas más ${etiquetaDimension(peorDim)} en ${slot.etiqueta.toLowerCase()} (asignado: ${alumno.nombre}).`);
      } else {
        const disponibles = alumnos.filter(a => !ocupados.has(a.id));
        if (disponibles.length) {
          const ideal = SIGTDE.PERFILES_POSICION[deporteAlineacionActual].posiciones[slot.pos].perfil;
          let mejor = null, mejorCompat = -1;
          disponibles.forEach(a => {
            const dim = a.evaluaciones[a.evaluaciones.length - 1].dimensiones;
            const c = SIGTDE.calcularCompatibilidad(dim, ideal);
            if (c > mejorCompat) { mejorCompat = c; mejor = a; }
          });
          if (mejor) notas.push(`💡 Sugerido para ${slot.etiqueta}: <strong>${mejor.nombre}</strong> (${mejorCompat}%).`);
        }
      }
      g.addEventListener('click', () => abrirSelectorSlot(alumnos, slot));
      svg.appendChild(g);
    });

    wrap.innerHTML = '';
    wrap.appendChild(svg);
    const notasEl = document.getElementById('notasAlineacion');
    notasEl.innerHTML = notas.length
      ? notas.map(n => `<p class="texto-sm" style="margin-bottom:10px;">${n}</p>`).join('')
      : '<p class="texto-sm texto-muted">Sin observaciones por ahora.</p>';
  }

  function abrirSelectorSlot(alumnos, slot) {
    const asignaciones = alineacionEstado[deporteAlineacionActual];
    const ocupados = new Set(Object.values(asignaciones));
    const actual = asignaciones[slot.id];
    const ideal = SIGTDE.PERFILES_POSICION[deporteAlineacionActual].posiciones[slot.pos].perfil;
    const candidatos = alumnos
      .filter(a => !ocupados.has(a.id) || a.id === actual)
      .map(a => {
        const dim = a.evaluaciones[a.evaluaciones.length - 1].dimensiones;
        return { a, compat: SIGTDE.calcularCompatibilidad(dim, ideal) };
      })
      .sort((x, y) => y.compat - x.compat);

    const filas = candidatos.map(c => `
      <div class="flex-entre" style="padding:10px 0;border-bottom:1px solid var(--borde);">
        <div><strong>${c.a.nombre}</strong><br><span class="texto-xs texto-muted">Principal: ${c.a.deportePrincipal}</span></div>
        <div class="flex gap-8" style="align-items:center;">
          <span class="badge ${c.compat >= 80 ? 'badge-exito' : c.compat >= 60 ? 'badge-azul' : 'badge-neutro'}">${c.compat}%</span>
          <button type="button" class="btn btn-sm btn-primario" data-asignar="${c.a.id}">Asignar</button>
        </div>
      </div>`).join('');

    const contenido = SIGTDE_UI.abrirModal(`
      <h3>Asignar — ${slot.etiqueta}</h3>
      <p class="texto-muted texto-sm" style="margin-top:6px;">Ordenado por compatibilidad de perfil físico contra la posición.</p>
      <div style="margin-top:12px;max-height:340px;overflow-y:auto;">${filas}</div>
      ${actual ? `<button type="button" class="btn btn-secundario btn-block" id="btnQuitarSlot" style="margin-top:14px;">Quitar de la alineación</button>` : ''}
    `);
    contenido.querySelectorAll('[data-asignar]').forEach(btn => {
      btn.addEventListener('click', () => {
        asignaciones[slot.id] = btn.dataset.asignar;
        SIGTDE_UI.cerrarModal();
        dibujarCancha(alumnos);
      });
    });
    const btnQuitar = contenido.querySelector('#btnQuitarSlot');
    if (btnQuitar) btnQuitar.addEventListener('click', () => { delete asignaciones[slot.id]; SIGTDE_UI.cerrarModal(); dibujarCancha(alumnos); });
  }

  /* ------------------------------------- Bienestar ------------------------------------- */
  function htmlBienestar(alumnos) {
    const items = alumnos.map(a => ({ a, alertas: SIGTDE.calcularAlertas(a.id) })).filter(x => x.alertas.length);
    if (!items.length) return '<p class="texto-muted">Sin alertas de bienestar por ahora. 🎉</p>';
    items.sort((a, b) => (a.alertas.some(al => al.nivel === 'rojo') ? -1 : 1));
    return items.flatMap(({ a, alertas }) => alertas.map(al => `
      <div class="semaforo-item ${al.nivel}">
        <div class="semaforo-punto ${al.nivel}"></div>
        <div><strong>${a.nombre}:</strong> ${al.texto}</div>
      </div>`)).join('');
  }

  window.SIGTDE_VISTAS.entrenador = { render, actualizar: render };
})();
