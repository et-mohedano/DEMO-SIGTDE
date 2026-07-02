/* ==========================================================================
   SIGTDE — Vista PADRES
   Persona: Familia Hernández, tutor de Diego.
   Solo lectura, lenguaje llano.
   ========================================================================== */

window.SIGTDE_VISTAS = window.SIGTDE_VISTAS || {};

(function () {
  'use strict';

  const ALUMNO_ID = 'a01';
  const FECHA_PROXIMA_EVALUACION = '17 de agosto de 2026';
  const FECHA_CONSENTIMIENTO = '12 de agosto de 2025';

  function render(container) {
    const alumno = SIGTDE.obtenerAlumno(ALUMNO_ID);
    const ini = alumno.evaluaciones[0].percentiles;
    const fin = alumno.evaluaciones[alumno.evaluaciones.length - 1].percentiles;

    container.innerHTML = `
      <div class="contenedor" style="max-width:920px;">
        <div class="aviso-simulado">🔬 Datos simulados — vista Padres/Madres</div>

        <div class="vista-cabecera tarjeta persona-card">
          <div class="avatar avatar-lg">FH</div>
          <div class="persona-datos">
            <h3>Familia Hernández</h3>
            <p class="texto-muted texto-sm">Tutor(a) de ${alumno.nombre} · ${alumno.grado}, grupo ${alumno.grupo}</p>
          </div>
        </div>

        <div class="vista-grid" style="margin-top:22px;">
          <div class="col-12 tarjeta">
            <h3>Cómo va ${alumno.nombre.split(' ')[0]} este semestre</h3>
            <p class="texto-muted texto-sm" style="margin-top:6px;">En palabras simples, sin tecnicismos.</p>
            <ul style="margin-top:16px;display:flex;flex-direction:column;gap:12px;">
              <li class="flex gap-12" style="align-items:flex-start;">
                <span style="font-size:20px;">🏃</span>
                <span>Su <strong>resistencia</strong> mejoró bastante: pasó del percentil ${ini.yoyo} al percentil ${fin.yoyo} comparado con jóvenes de su misma edad y sexo.</span>
              </li>
              <li class="flex gap-12" style="align-items:flex-start;">
                <span style="font-size:20px;">💪</span>
                <span>Su <strong>salto (potencia)</strong> también avanzó: del percentil ${ini.cmj} al percentil ${fin.cmj}.</span>
              </li>
              <li class="flex gap-12" style="align-items:flex-start;">
                <span style="font-size:20px;">⚡</span>
                <span>Su <strong>velocidad</strong> subió del percentil ${ini.sprint20} al percentil ${fin.sprint20}.</span>
              </li>
              <li class="flex gap-12" style="align-items:flex-start;">
                <span style="font-size:20px;">🏐</span>
                <span>Por su estatura, alcance y salto, el sistema encuentra el mejor ajuste de ${alumno.nombre.split(' ')[0]} en <strong>${alumno.deporteRecomendado}</strong>. ${alumno.banderaTexto}</span>
              </li>
            </ul>
          </div>

          <div class="col-6 tarjeta">
            <h3 style="font-size:17px;">Próxima evaluación</h3>
            <p class="texto-grande" style="margin-top:10px;font-size:20px;font-weight:700;color:var(--primario);">${FECHA_PROXIMA_EVALUACION}</p>
            <p class="texto-muted texto-sm" style="margin-top:6px;">Se aplica en horario de clase de Educación Física, sin costo adicional.</p>
          </div>

          <div class="col-6 tarjeta">
            <h3 style="font-size:17px;">Reporte semestral</h3>
            <p class="texto-muted texto-sm" style="margin-top:6px;">Un resumen en PDF con el progreso de ${alumno.nombre.split(' ')[0]}.</p>
            <button type="button" class="btn btn-primario" id="btnDescargarReporte" style="margin-top:14px;">⬇ Descargar reporte (simulado)</button>
          </div>

          <div class="col-12 tarjeta">
            <div class="flex-entre" style="flex-wrap:wrap;gap:16px;">
              <div>
                <h3 style="font-size:17px;">Panel de consentimiento</h3>
                <p class="texto-muted texto-sm" style="margin-top:6px;max-width:480px;">Autorizas el uso de los datos deportivos de tu hijo/a conforme al aviso de privacidad para menores.</p>
                <p class="texto-xs texto-muted" style="margin-top:8px;" id="estadoConsentimiento">Vigente desde ${FECHA_CONSENTIMIENTO}</p>
              </div>
              <label class="toggle">
                <input type="checkbox" id="toggleConsentimiento" checked aria-label="Aviso de privacidad aceptado">
                <span class="track"><span class="thumb"></span></span>
              </label>
            </div>
          </div>

          <div class="col-12 tarjeta" style="background:var(--bg-alt);border:1px dashed var(--borde);">
            <p class="texto-sm peso-600">🔒 Esta vista es de solo lectura: como tutor/a solo ves la información de ${alumno.nombre.split(' ')[0]}, nunca la de otros alumnos.</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnDescargarReporte').addEventListener('click', () => descargarReporte(alumno));

    const toggle = document.getElementById('toggleConsentimiento');
    const estado = document.getElementById('estadoConsentimiento');
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        estado.textContent = `Vigente desde ${FECHA_CONSENTIMIENTO}`;
        SIGTDE_UI.mostrarToast('Consentimiento activado.', 'exito');
      } else {
        estado.textContent = 'Retirado por el tutor — el sistema dejará de usar estos datos.';
        SIGTDE_UI.mostrarToast('Consentimiento retirado.', 'alerta');
      }
    });
  }

  function descargarReporte(alumno) {
    const fin = alumno.evaluaciones[alumno.evaluaciones.length - 1];
    const contenido = [
      `SIGTDE — Reporte semestral (simulado)`,
      `Alumno: ${alumno.nombre}`,
      `Grado / grupo: ${alumno.grado} · ${alumno.grupo}`,
      `Deporte recomendado: ${alumno.deporteRecomendado}`,
      `Bandera madurativa: ${alumno.banderaTexto}`,
      ``,
      `Índices (última evaluación — ${fin.fecha}):`,
      `  IPF (Futbol): ${fin.indices.IPF}`,
      `  IPB (Basquetbol): ${fin.indices.IPB}`,
      `  IPV (Voleibol): ${fin.indices.IPV}`,
      ``,
      `Este documento es una simulación generada en el navegador para la Prueba de Concepto de SIGTDE.`,
      `Ningún dato corresponde a una persona real.`,
    ].join('\n');
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `reporte-semestral-${alumno.nombre.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
    SIGTDE_UI.mostrarToast('Reporte descargado (simulado, sin backend).', 'exito');
  }

  window.SIGTDE_VISTAS.padres = { render, actualizar: render };
})();
