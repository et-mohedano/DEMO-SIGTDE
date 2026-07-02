/* ==========================================================================
   SIGTDE — Vista ALUMNO
   Persona: Diego Hernández, 16 años, 4º semestre.
   ========================================================================== */

window.SIGTDE_VISTAS = window.SIGTDE_VISTAS || {};

(function () {
  'use strict';

  const ALUMNO_ID = 'a01';
  const ETIQUETAS_DIM = [
    { clave: 'velocidad', etiqueta: 'Velocidad' },
    { clave: 'resistencia', etiqueta: 'Resistencia' },
    { clave: 'potencia', etiqueta: 'Potencia' },
    { clave: 'fuerza', etiqueta: 'Fuerza' },
    { clave: 'agilidad', etiqueta: 'Agilidad' },
    { clave: 'flexibilidad', etiqueta: 'Flexibilidad' },
  ];
  const EMOJIS_ANIMO = [
    { valor: 1, emoji: '😞', texto: 'Muy bajo' },
    { valor: 2, emoji: '🙁', texto: 'Bajo' },
    { valor: 3, emoji: '😐', texto: 'Normal' },
    { valor: 4, emoji: '🙂', texto: 'Bien' },
    { valor: 5, emoji: '😄', texto: 'Muy bien' },
  ];

  function render(container) {
    const alumno = SIGTDE.obtenerAlumno(ALUMNO_ID);
    const ultima = alumno.evaluaciones[alumno.evaluaciones.length - 1];
    const primera = alumno.evaluaciones[0];

    container.innerHTML = `
      <div class="contenedor">
        <div class="aviso-simulado">🔬 Datos simulados — vista Alumno-atleta</div>

        <div class="vista-cabecera tarjeta persona-card">
          <div class="avatar avatar-lg">${SIGTDE_UI.iniciales(alumno.nombre)}</div>
          <div class="persona-datos">
            <h3>${alumno.nombre}</h3>
            <p class="texto-muted texto-sm">${alumno.edad} años · ${alumno.grado} · Grupo ${alumno.grupo}</p>
            <div class="flex gap-8" style="margin-top:10px;flex-wrap:wrap;">
              <span class="badge badge-violeta">Deporte recomendado: ${alumno.deporteRecomendado}</span>
              <span class="badge badge-azul">${alumno.banderaTexto}</span>
            </div>
          </div>
        </div>

        <div class="vista-grid" style="margin-top:22px;">
          <div class="col-6 tarjeta">
            <h3>Tu perfil físico (percentiles)</h3>
            <p class="texto-muted texto-sm" style="margin-top:4px;">Pasa el cursor sobre cada punto para ver el valor exacto.</p>
            <div id="radarAlumno" style="margin-top:10px;"></div>
          </div>

          <div class="col-6 flex-col gap-16">
            <div class="tarjeta indice-tarjeta" data-indice="IPF" tabindex="0" role="button" aria-label="Ver desglose de IPF">
              <div class="indice-fila"><span class="h4">IPF · Futbol</span><span class="indice-valor" style="color:var(--primario)">${ultima.indices.IPF}</span></div>
              <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${ultima.indices.IPF}%;background:var(--primario)"></div></div>
              <p class="texto-xs texto-muted" style="margin-top:8px;">Toca para ver el desglose transparente →</p>
            </div>
            <div class="tarjeta indice-tarjeta" data-indice="IPB" tabindex="0" role="button" aria-label="Ver desglose de IPB">
              <div class="indice-fila"><span class="h4">IPB · Basquetbol</span><span class="indice-valor" style="color:var(--acento)">${ultima.indices.IPB}</span></div>
              <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${ultima.indices.IPB}%;background:var(--acento)"></div></div>
              <p class="texto-xs texto-muted" style="margin-top:8px;">Toca para ver el desglose transparente →</p>
            </div>
            <div class="tarjeta indice-tarjeta" data-indice="IPV" tabindex="0" role="button" aria-label="Ver desglose de IPV" style="border-color:var(--exito);">
              <div class="indice-fila"><span class="h4">IPV · Voleibol <span class="badge badge-exito">Recomendado</span></span><span class="indice-valor" style="color:var(--exito)">${ultima.indices.IPV}</span></div>
              <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${ultima.indices.IPV}%;background:var(--exito)"></div></div>
              <p class="texto-xs texto-muted" style="margin-top:8px;">Toca para ver el desglose transparente →</p>
            </div>
          </div>

          <div class="col-6 tarjeta">
            <h3>Evolución — Sprint 20 m</h3>
            <div id="lineaSprint" style="margin-top:10px;"></div>
          </div>
          <div class="col-6 tarjeta">
            <h3>Evolución — Salto CMJ</h3>
            <div id="lineaCmj" style="margin-top:10px;"></div>
          </div>

          <div class="col-6 tarjeta">
            <h3>Metas activas</h3>
            <div id="metaSprint" style="margin-top:14px;"></div>
          </div>

          <div class="col-6 tarjeta">
            <h3>Check-in semanal de bienestar</h3>
            <p class="texto-muted texto-sm" style="margin-top:4px;">Se envía a tu entrenador. El sistema nunca diagnostica, solo señala patrones.</p>
            <form id="formCheckin" style="margin-top:16px;">
              <div class="slider-grupo">
                <div class="slider-cabecera"><span>Esfuerzo percibido (PSE)</span><span class="slider-valor" id="valorPse">5</span></div>
                <input type="range" min="1" max="10" value="5" id="inputPse">
              </div>
              <div class="slider-grupo">
                <div class="slider-cabecera"><span>Calidad de sueño</span><span class="slider-valor" id="valorSueno">3</span></div>
                <input type="range" min="1" max="5" value="3" id="inputSueno">
              </div>
              <div class="slider-grupo">
                <div class="slider-cabecera"><span>Ánimo</span></div>
                <div class="emoji-selector" id="selectorAnimo">
                  ${EMOJIS_ANIMO.map(e => `<button type="button" class="emoji-opcion" data-valor="${e.valor}">${e.emoji}<span>${e.texto}</span></button>`).join('')}
                </div>
              </div>
              <div class="campo" style="margin-top:4px;">
                <label for="inputMolestias">¿Alguna molestia física? (opcional)</label>
                <input type="text" id="inputMolestias" placeholder="Ej. molestia leve en rodilla">
              </div>
              <button type="submit" class="btn btn-primario btn-block">Enviar check-in</button>
            </form>
          </div>

          <div class="col-12 tarjeta" style="background:var(--bg-alt);border:1px dashed var(--borde);">
            <p class="texto-sm peso-600">🔒 Privacidad: no existe ranking ni comparación con otros alumnos en esta vista. Solo tú y tu entrenador ven tu progreso individual.</p>
          </div>
        </div>
      </div>
    `;

    // --- Radar ---
    document.getElementById('radarAlumno').appendChild(SIGTDE_CHARTS.radar({
      ejes: ETIQUETAS_DIM,
      series: [{ etiqueta: 'Diego', color: '#2D5BE3', valores: ultima.dimensiones }],
      tam: 300,
    }));

    // --- Evolución sprint / cmj ---
    const etiquetasX = alumno.evaluaciones.map(v => v.fecha);
    document.getElementById('lineaSprint').appendChild(SIGTDE_CHARTS.linea({
      series: [{ etiqueta: 'Sprint 20 m', color: '#2D5BE3', valores: alumno.evaluaciones.map(v => v.crudos.sprint20) }],
      etiquetasX, unidad: ' s',
    }));
    document.getElementById('lineaCmj').appendChild(SIGTDE_CHARTS.linea({
      series: [{ etiqueta: 'Salto CMJ', color: '#6B35D9', valores: alumno.evaluaciones.map(v => v.crudos.cmj) }],
      etiquetasX, unidad: ' cm',
    }));

    // --- Meta activa: sprint 20m ---
    const actual = ultima.crudos.sprint20;
    const meta = Math.max(2.9, +(actual - 0.12).toFixed(2));
    const percentilMeta = SIGTDE.percentil('sprint20', meta, alumno.sexo);
    const inicioVentanas = primera.crudos.sprint20;
    const distanciaTotal = inicioVentanas - meta;
    const avanzado = inicioVentanas - actual;
    const progresoMeta = distanciaTotal > 0 ? Math.min(100, Math.max(0, Math.round((avanzado / distanciaTotal) * 100))) : 100;
    document.getElementById('metaSprint').innerHTML = `
      <p class="texto-sm peso-600">Bajar sprint 20 m de ${actual.toFixed(2)} s a ${meta.toFixed(2)} s (te sube al percentil ${percentilMeta})</p>
      <div class="barra-progreso" style="margin-top:10px;"><div class="barra-progreso-relleno" style="width:${progresoMeta}%"></div></div>
      <p class="texto-xs texto-muted" style="margin-top:6px;">${progresoMeta}% de avance desde tu primera evaluación</p>
    `;

    // --- Desglose transparente al hacer clic en un índice ---
    container.querySelectorAll('.indice-tarjeta').forEach(tarjeta => {
      const activar = () => abrirDesglose(alumno, tarjeta.dataset.indice);
      tarjeta.addEventListener('click', activar);
      tarjeta.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activar(); } });
    });

    // --- Check-in interactivo ---
    const inputPse = document.getElementById('inputPse');
    const inputSueno = document.getElementById('inputSueno');
    inputPse.addEventListener('input', () => { document.getElementById('valorPse').textContent = inputPse.value; });
    inputSueno.addEventListener('input', () => { document.getElementById('valorSueno').textContent = inputSueno.value; });

    let animoSeleccionado = null;
    container.querySelectorAll('#selectorAnimo .emoji-opcion').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('#selectorAnimo .emoji-opcion').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        animoSeleccionado = Number(btn.dataset.valor);
      });
    });

    document.getElementById('formCheckin').addEventListener('submit', (evento) => {
      evento.preventDefault();
      if (!animoSeleccionado) {
        SIGTDE_UI.mostrarToast('Selecciona cómo te sientes hoy.', 'alerta');
        return;
      }
      const checkin = {
        fecha: 'Hoy',
        pse: Number(inputPse.value),
        sueno: Number(inputSueno.value),
        animo: animoSeleccionado,
        molestias: document.getElementById('inputMolestias').value.trim() || null,
      };
      SIGTDE.registrarCheckin(ALUMNO_ID, checkin);
      SIGTDE_UI.mostrarToast('Check-in enviado. Tu entrenador podrá verlo.', 'exito');
      evento.target.reset();
      document.getElementById('valorPse').textContent = '5';
      document.getElementById('valorSueno').textContent = '3';
      container.querySelectorAll('#selectorAnimo .emoji-opcion').forEach(b => b.classList.remove('activo'));
      animoSeleccionado = null;
    });
  }

  function abrirDesglose(alumno, tipo) {
    const desglose = SIGTDE.desgloseIndice(tipo, alumno.evaluaciones[alumno.evaluaciones.length - 1].crudos, alumno.sexo);
    const filas = desglose.map(f => `
      <tr>
        <td>${f.etiqueta}</td>
        <td>${f.valorCrudo}</td>
        <td>${f.percentil}</td>
        <td>${Math.round(f.peso * 100)}%</td>
        <td><strong>${f.aporte}</strong></td>
      </tr>`).join('');
    const total = desglose.reduce((s, f) => s + f.aporte, 0);
    SIGTDE_UI.abrirModal(`
      <h3>${SIGTDE.NOMBRE_INDICE[tipo]} — desglose transparente</h3>
      <p class="texto-muted texto-sm" style="margin-top:6px;">Cada índice se construye a partir de percentiles ponderados, nunca de valores crudos directos.</p>
      <div class="tabla-wrap" style="margin-top:16px;">
        <table class="tabla desglose-tabla">
          <thead><tr><th>Prueba</th><th>Valor</th><th>Percentil</th><th>Peso</th><th>Aporte</th></tr></thead>
          <tbody>${filas}</tbody>
          <tfoot><tr><td colspan="4" class="texto-sm peso-600">Total (${tipo})</td><td class="peso-700">${total}</td></tr></tfoot>
        </table>
      </div>
      <button type="button" class="btn btn-secundario btn-block" style="margin-top:18px;" onclick="SIGTDE_UI.cerrarModal()">Cerrar</button>
    `);
  }

  window.SIGTDE_VISTAS.alumno = { render, actualizar: render };
})();
