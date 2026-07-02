/* ==========================================================================
   SIGTDE — Vista DIRECTIVO
   Persona: Dir. Alejandro Fuentes.
   ========================================================================== */

window.SIGTDE_VISTAS = window.SIGTDE_VISTAS || {};

(function () {
  'use strict';

  // KPIs de escala institucional (ilustrativos, la matrícula completa no está
  // modelada alumno por alumno en esta PDC — el detalle individual sí lo está).
  const KPI_INSTITUCION = {
    evaluados: 312,
    totalAlumnos: 380,
    distribucionDeporte: [
      { etiqueta: 'Voleibol', valor: 128, color: '#2D5BE3' },
      { etiqueta: 'Basquetbol', valor: 98, color: '#6B35D9' },
      { etiqueta: 'Futbol', valor: 86, color: '#22C55E' },
    ],
    talentosPorGrado: [
      { etiqueta: '2° sem · M', valor: 9 }, { etiqueta: '2° sem · F', valor: 7 },
      { etiqueta: '4° sem · M', valor: 12 }, { etiqueta: '4° sem · F', valor: 10 },
      { etiqueta: '6° sem · M', valor: 14 }, { etiqueta: '6° sem · F', valor: 11 },
      { etiqueta: '8° sem · M', valor: 8 }, { etiqueta: '8° sem · F', valor: 6 },
    ],
  };

  function promedioDimensiones(dimensiones) {
    const valores = Object.values(dimensiones);
    return valores.reduce((s, v) => s + v, 0) / valores.length;
  }
  function calcularTendencia(alumno) {
    const ini = promedioDimensiones(alumno.evaluaciones[0].dimensiones);
    const fin = promedioDimensiones(alumno.evaluaciones[alumno.evaluaciones.length - 1].dimensiones);
    const diff = fin - ini;
    if (diff >= 2) return { icono: '↑', clase: 'badge-exito' };
    if (diff <= -2) return { icono: '↓', clase: 'badge-peligro' };
    return { icono: '→', clase: 'badge-neutro' };
  }

  function render(container) {
    const alumnos = SIGTDE.estado.alumnos;
    const evolucionAnual = [0, 1, 2].map(i => Math.round(
      alumnos.reduce((s, a) => s + promedioDimensiones(a.evaluaciones[i].dimensiones), 0) / alumnos.length
    ));

    container.innerHTML = `
      <div class="contenedor">
        <div class="aviso-simulado no-imprimir">🔬 Datos simulados — vista Directivo</div>

        <div class="vista-cabecera tarjeta persona-card no-imprimir">
          <div class="avatar avatar-lg">AF</div>
          <div class="persona-datos flex-entre" style="width:100%;flex-wrap:wrap;gap:14px;">
            <div>
              <h3>Dir. Alejandro Fuentes</h3>
              <p class="texto-muted texto-sm">Dirección institucional</p>
            </div>
            <button type="button" class="btn btn-secundario btn-sm" id="btnReporte">🖨️ Generar reporte ejecutivo</button>
          </div>
        </div>

        <div id="reporteEjecutivo">
          <h2 class="solo-impresion" style="display:none;">Reporte ejecutivo SIGTDE — ${KPI_INSTITUCION.evaluados}/${KPI_INSTITUCION.totalAlumnos} alumnos evaluados</h2>

          <div class="vista-grid" style="margin-top:22px;">
            <div class="col-4 tarjeta">
              <h3 style="font-size:15px;">Alumnos evaluados</h3>
              <div class="indice-valor" style="margin-top:10px;">${KPI_INSTITUCION.evaluados}<span class="texto-muted" style="font-size:16px;"> / ${KPI_INSTITUCION.totalAlumnos}</span></div>
              <div class="barra-progreso" style="margin-top:10px;"><div class="barra-progreso-relleno" style="width:${Math.round(KPI_INSTITUCION.evaluados / KPI_INSTITUCION.totalAlumnos * 100)}%"></div></div>
            </div>
            <div class="col-4 tarjeta flex-col" style="align-items:center;">
              <h3 style="font-size:15px;align-self:flex-start;">Distribución por deporte</h3>
              <div id="donaDeporte" style="margin-top:6px;"></div>
              <div class="flex gap-12" style="flex-wrap:wrap;justify-content:center;margin-top:6px;">
                ${KPI_INSTITUCION.distribucionDeporte.map(d => `<span class="texto-xs texto-muted"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${d.color};margin-right:4px;"></span>${d.etiqueta}</span>`).join('')}
              </div>
            </div>
            <div class="col-4 tarjeta">
              <h3 style="font-size:15px;">Evolución institucional — índice de forma</h3>
              <div id="lineaEvolucion" style="margin-top:6px;"></div>
            </div>

            <div class="col-12 tarjeta">
              <h3 style="font-size:15px;">Talentos por grado y sexo (IPD ≥ 70)</h3>
              <div id="barrasTalentos" style="margin-top:14px;"></div>
            </div>

            <div class="col-12 tarjeta">
              <h3>Top 10 talentos</h3>
              <div class="tabla-wrap" style="margin-top:14px;">
                <table class="tabla">
                  <thead><tr><th>#</th><th>Alumno</th><th>IPD</th><th>Tendencia</th><th>Deporte recomendado</th></tr></thead>
                  <tbody>${topTalentos(alumnos)}</tbody>
                </table>
              </div>
            </div>

            <div class="col-6 tarjeta no-imprimir">
              <h3>Flujo de becas</h3>
              <p class="texto-muted texto-sm" style="margin-top:6px;">El sistema propone por IBD; el comité humano decide.</p>
              <div id="listaBecas" style="margin-top:14px;">${listaBecas(alumnos)}</div>
            </div>
            <div class="col-6 tarjeta no-imprimir">
              <h3>Bitácora de decisiones</h3>
              <div id="bitacoraBecas" style="margin-top:14px;max-height:420px;overflow-y:auto;">${bitacoraHtml()}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('donaDeporte').appendChild(SIGTDE_CHARTS.dona({
      datos: KPI_INSTITUCION.distribucionDeporte, tam: 170, grosor: 24,
      tituloCentro: 'evaluados', valorCentro: KPI_INSTITUCION.evaluados,
    }));
    document.getElementById('lineaEvolucion').appendChild(SIGTDE_CHARTS.linea({
      series: [{ etiqueta: 'Índice de forma promedio', color: '#2D5BE3', valores: evolucionAnual }],
      etiquetasX: alumnos[0].evaluaciones.map(v => v.fecha), yMin: 0, yMax: 100,
    }));
    document.getElementById('barrasTalentos').appendChild(SIGTDE_CHARTS.barras({
      datos: KPI_INSTITUCION.talentosPorGrado, max: 16, altoBarra: 20, espacio: 10,
    }));

    document.getElementById('btnReporte').addEventListener('click', () => window.print());
    wireBecas(container, alumnos);
  }

  function topTalentos(alumnos) {
    const ordenados = [...alumnos].sort((a, b) => b.indices.IPD - a.indices.IPD).slice(0, 10);
    return ordenados.map((a, i) => {
      const tendencia = calcularTendencia(a);
      return `<tr>
        <td>${i + 1}</td>
        <td><strong>${a.nombre}</strong></td>
        <td>${a.indices.IPD}</td>
        <td><span class="badge ${tendencia.clase}">${tendencia.icono}</span></td>
        <td>${a.deporteRecomendado}</td>
      </tr>`;
    }).join('');
  }

  function listaBecas(alumnos) {
    const candidatos = alumnos.filter(a => a.indices.bandaBeca !== 'sin_recomendacion').sort((a, b) => b.indices.IBD - a.indices.IBD);
    if (!candidatos.length) return '<p class="texto-muted texto-sm">Sin candidatos por ahora.</p>';
    return candidatos.map(a => `
      <div class="flex-entre" style="padding:12px 0;border-bottom:1px solid var(--borde);flex-wrap:wrap;gap:10px;" data-fila-beca="${a.id}">
        <div>
          <strong>${a.nombre}</strong>
          <div class="flex gap-8" style="margin-top:4px;"><span class="badge badge-${SIGTDE_UI.colorBanda(a.indices.bandaBeca)}">${SIGTDE_UI.etiquetaBanda(a.indices.bandaBeca)}</span><span class="texto-xs texto-muted">IBD ${a.indices.IBD}</span></div>
        </div>
        <div class="flex gap-8">
          <button type="button" class="btn btn-sm btn-exito" data-decision="aprobada" data-id="${a.id}">Aprobar</button>
          <button type="button" class="btn btn-sm btn-peligro" data-decision="rechazada" data-id="${a.id}">Rechazar</button>
          <button type="button" class="btn btn-sm btn-secundario" data-decision="mas_informacion" data-id="${a.id}">Más información</button>
        </div>
      </div>`).join('');
  }

  function bitacoraHtml() {
    const etiquetas = { aprobada: 'Aprobada ✅', rechazada: 'Rechazada ❌', mas_informacion: 'Solicitó más información ℹ️' };
    if (!SIGTDE.estado.bitacoraBecas.length) return '<p class="texto-muted texto-sm">Aún no hay decisiones registradas.</p>';
    return SIGTDE.estado.bitacoraBecas.map(entrada => {
      const alumno = SIGTDE.obtenerAlumno(entrada.alumnoId);
      return `<div class="bitacora-item">
        <p class="texto-sm peso-700">${alumno.nombre} — ${etiquetas[entrada.decision] || entrada.decision}</p>
        <p class="texto-xs texto-muted" style="margin-top:2px;">${entrada.motivo}</p>
        <p class="texto-xs texto-muted" style="margin-top:4px;">${entrada.autor} · ${entrada.fecha}</p>
      </div>`;
    }).join('');
  }

  function wireBecas(container, alumnos) {
    document.getElementById('listaBecas').addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-decision]');
      if (!boton) return;
      const alumno = SIGTDE.obtenerAlumno(boton.dataset.id);
      abrirModalMotivo(alumno, boton.dataset.decision, container, alumnos);
    });
  }

  function abrirModalMotivo(alumno, decision, container, alumnos) {
    const titulos = { aprobada: 'Aprobar beca', rechazada: 'Rechazar beca', mas_informacion: 'Solicitar más información' };
    const contenido = SIGTDE_UI.abrirModal(`
      <h3>${titulos[decision]} — ${alumno.nombre}</h3>
      <p class="texto-muted texto-sm" style="margin-top:6px;">El sistema propone con base en IBD ${alumno.indices.IBD}; esta decisión la registra el comité humano.</p>
      <form id="formMotivo" style="margin-top:16px;">
        <div class="campo">
          <label for="inputMotivo">Motivo <span class="req">*</span></label>
          <textarea id="inputMotivo" required placeholder="Explica brevemente la decisión..."></textarea>
        </div>
        <button type="submit" class="btn btn-primario btn-block">Confirmar y registrar en bitácora</button>
      </form>
    `);
    contenido.querySelector('#formMotivo').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const motivo = contenido.querySelector('#inputMotivo').value.trim();
      if (!motivo) { SIGTDE_UI.mostrarToast('Escribe un motivo para continuar.', 'alerta'); return; }
      SIGTDE.registrarDecisionBeca(alumno.id, decision, motivo, 'Comité de becas');
      SIGTDE_UI.cerrarModal();
      SIGTDE_UI.mostrarToast('Decisión registrada en la bitácora.', 'exito');
      document.getElementById('bitacoraBecas').innerHTML = bitacoraHtml();
    });
  }

  window.SIGTDE_VISTAS.directivo = { render, actualizar: render };
})();
