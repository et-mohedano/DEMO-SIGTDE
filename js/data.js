/* ==========================================================================
   SIGTDE — Datos simulados y estado en memoria
   Ningún dato corresponde a personas reales. Nada se guarda en disco:
   todo vive en el objeto SIGTDE.estado y se pierde al recargar (a propósito).
   ========================================================================== */

const SIGTDE = (function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. NORMAS DE REFERENCIA POR PRUEBA (percentil 1 → percentil 99)
   *    "invertido: true" = un valor MENOR es mejor (tiempos)
   * ------------------------------------------------------------------ */
  const NORMAS = {
    sprint20:   { M: { min: 4.05, max: 2.95, invertido: true } , F: { min: 4.25, max: 3.15, invertido: true } },
    cmj:        { M: { min: 20,   max: 55 }, F: { min: 16,   max: 46 } },
    saltoHorizontal: { M: { min: 150, max: 265 }, F: { min: 130, max: 235 } },
    lanzamiento: { M: { min: 4.0, max: 11.5 }, F: { min: 3.2, max: 9.2 } },
    dominadas:  { M: { min: 0,   max: 16 },  F: { min: 0, max: 9, } },
    agilidad510: { M: { min: 5.6, max: 4.15, invertido: true }, F: { min: 5.9, max: 4.4, invertido: true } },
    yoyo:       { M: { min: 400, max: 1680 }, F: { min: 320, max: 1360 } },
    sitReach:   { M: { min: -6,  max: 30 },  F: { min: -2, max: 34 } },
    estatura:   { M: { min: 158, max: 196 }, F: { min: 148, max: 180 } },
    envergadura: { M: { min: 158, max: 202 }, F: { min: 148, max: 186 } },
  };

  function percentil(prueba, valor, sexo) {
    const norma = NORMAS[prueba] && NORMAS[prueba][sexo];
    if (!norma || valor === null || valor === undefined || isNaN(valor)) return null;
    const { min, max, invertido } = norma;
    let p;
    if (invertido) {
      p = (min - valor) / (min - max) * 100;
    } else {
      p = (valor - min) / (max - min) * 100;
    }
    return Math.round(Math.max(0, Math.min(100, p)));
  }

  /** ¿El valor capturado está fuera de un rango humanamente plausible? */
  function esValorAtipico(prueba, valor, sexo) {
    const norma = NORMAS[prueba] && NORMAS[prueba][sexo];
    if (!norma || valor === null || valor === '' || isNaN(valor)) return false;
    const lo = Math.min(norma.min, norma.max);
    const hi = Math.max(norma.min, norma.max);
    const margen = (hi - lo) * 0.22;
    return valor < lo - margen || valor > hi + margen;
  }

  const ETIQUETAS_PRUEBA = {
    estatura: 'Estatura (cm)', peso: 'Peso (kg)', envergadura: 'Envergadura (cm)',
    sprint20: 'Sprint 20 m (s)', cmj: 'Salto CMJ (cm)', saltoHorizontal: 'Salto horizontal (cm)',
    lanzamiento: 'Lanzamiento balón medicinal (m)', dominadas: 'Dominadas (rep)',
    agilidad510: 'Agilidad 5-10-5 (s)', yoyo: 'Yo-Yo IR1 (m)', sitReach: 'Sit and reach (cm)',
  };

  /* ------------------------------------------------------------------ *
   * 2. TABLAS DE PONDERACIÓN — desglose transparente por índice
   * ------------------------------------------------------------------ */
  const PESOS_INDICE = {
    IPF: [
      { prueba: 'yoyo', peso: .25 },
      { prueba: 'sprint20', peso: .25 },
      { prueba: 'agilidad510', peso: .20 },
      { prueba: 'cmj', peso: .15 },
      { prueba: 'lanzamiento', peso: .15 },
    ],
    IPB: [
      { prueba: 'estatura', peso: .30 },
      { prueba: 'envergadura', peso: .20 },
      { prueba: 'cmj', peso: .20 },
      { prueba: 'agilidad510', peso: .15 },
      { prueba: 'sprint20', peso: .15 },
    ],
    IPV: [
      { prueba: 'estatura', peso: .25 },
      { prueba: 'envergadura', peso: .25 },
      { prueba: 'cmj', peso: .25 },
      { prueba: 'lanzamiento', peso: .15 },
      { prueba: 'sprint20', peso: .10 },
    ],
  };
  const NOMBRE_INDICE = { IPF: 'Índice de Potencial en Futbol', IPB: 'Índice de Potencial en Basquetbol', IPV: 'Índice de Potencial en Voleibol' };

  function calcularIndice(tipo, percentiles, sexo) {
    const tabla = PESOS_INDICE[tipo];
    let total = 0;
    tabla.forEach(fila => { total += (percentiles[fila.prueba] || 0) * fila.peso; });
    return Math.round(total);
  }

  function desgloseIndice(tipo, pruebasCrudas, sexo) {
    const tabla = PESOS_INDICE[tipo];
    return tabla.map(fila => {
      const p = percentil(fila.prueba, pruebasCrudas[fila.prueba], sexo);
      return {
        prueba: fila.prueba,
        etiqueta: ETIQUETAS_PRUEBA[fila.prueba],
        valorCrudo: pruebasCrudas[fila.prueba],
        percentil: p,
        peso: fila.peso,
        aporte: Math.round((p || 0) * fila.peso),
      };
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. DIMENSIONES FÍSICAS (radar de 6 ejes) a partir de percentiles crudos
   * ------------------------------------------------------------------ */
  function calcularDimensiones(percentiles) {
    return {
      velocidad: percentiles.sprint20,
      resistencia: percentiles.yoyo,
      potencia: Math.round((percentiles.cmj + percentiles.saltoHorizontal) / 2),
      fuerza: percentiles.dominadas,
      agilidad: percentiles.agilidad510,
      flexibilidad: percentiles.sitReach,
    };
  }

  /* ------------------------------------------------------------------ *
   * 4. PERFILES IDEALES POR POSICIÓN (percentiles 0-100, 6 dimensiones)
   * ------------------------------------------------------------------ */
  const PERFILES_POSICION = {
    futbol: {
      etiqueta: 'Futbol',
      posiciones: {
        portero:   { etiqueta: 'Portero',         perfil: { velocidad: 60, resistencia: 55, potencia: 80, fuerza: 60, agilidad: 88, flexibilidad: 55 } },
        defensa:   { etiqueta: 'Defensa central', perfil: { velocidad: 55, resistencia: 68, potencia: 75, fuerza: 85, agilidad: 60, flexibilidad: 45 } },
        lateral:   { etiqueta: 'Lateral',         perfil: { velocidad: 85, resistencia: 82, potencia: 60, fuerza: 55, agilidad: 76, flexibilidad: 50 } },
        medio:     { etiqueta: 'Medio',           perfil: { velocidad: 65, resistencia: 90, potencia: 55, fuerza: 55, agilidad: 70, flexibilidad: 55 } },
        delantero: { etiqueta: 'Delantero',       perfil: { velocidad: 90, resistencia: 60, potencia: 80, fuerza: 60, agilidad: 75, flexibilidad: 50 } },
      },
    },
    basquetbol: {
      etiqueta: 'Basquetbol',
      posiciones: {
        base:     { etiqueta: 'Base',      perfil: { velocidad: 80, resistencia: 70, potencia: 65, fuerza: 55, agilidad: 87, flexibilidad: 55 } },
        escolta:  { etiqueta: 'Escolta',   perfil: { velocidad: 80, resistencia: 65, potencia: 75, fuerza: 60, agilidad: 76, flexibilidad: 50 } },
        alero:    { etiqueta: 'Alero',     perfil: { velocidad: 70, resistencia: 65, potencia: 80, fuerza: 65, agilidad: 70, flexibilidad: 50 } },
        alapivot: { etiqueta: 'Ala-pívot', perfil: { velocidad: 55, resistencia: 60, potencia: 80, fuerza: 85, agilidad: 55, flexibilidad: 45 } },
        pivot:    { etiqueta: 'Pívot',     perfil: { velocidad: 45, resistencia: 50, potencia: 75, fuerza: 90, agilidad: 45, flexibilidad: 40 } },
      },
    },
    voleibol: {
      etiqueta: 'Voleibol',
      posiciones: {
        armador:  { etiqueta: 'Armador',  perfil: { velocidad: 75, resistencia: 65, potencia: 70, fuerza: 55, agilidad: 87, flexibilidad: 60 } },
        opuesto:  { etiqueta: 'Opuesto',  perfil: { velocidad: 65, resistencia: 60, potencia: 90, fuerza: 75, agilidad: 65, flexibilidad: 55 } },
        central:  { etiqueta: 'Central',  perfil: { velocidad: 55, resistencia: 55, potencia: 90, fuerza: 70, agilidad: 60, flexibilidad: 50 } },
        receptor: { etiqueta: 'Receptor', perfil: { velocidad: 70, resistencia: 80, potencia: 70, fuerza: 60, agilidad: 76, flexibilidad: 55 } },
      },
    },
  };

  function calcularCompatibilidad(dimensionesAlumno, perfilPosicion) {
    const claves = Object.keys(perfilPosicion);
    let sumaDiff = 0;
    claves.forEach(c => { sumaDiff += Math.abs((dimensionesAlumno[c] || 0) - perfilPosicion[c]); });
    const promedioDiff = sumaDiff / claves.length;
    return Math.round(Math.max(0, 100 - promedioDiff * 1.15));
  }

  function mejoresCompatibilidades(alumno, top = 3) {
    const resultado = [];
    Object.entries(PERFILES_POSICION).forEach(([deporteKey, deporte]) => {
      Object.entries(deporte.posiciones).forEach(([posKey, pos]) => {
        const dim = alumno.evaluaciones[alumno.evaluaciones.length - 1].dimensiones;
        resultado.push({
          deporte: deporteKey, deporteEtiqueta: deporte.etiqueta,
          posicion: posKey, posicionEtiqueta: pos.etiqueta,
          compatibilidad: calcularCompatibilidad(dim, pos.perfil),
        });
      });
    });
    resultado.sort((a, b) => b.compatibilidad - a.compatibilidad);
    return resultado.slice(0, top);
  }

  /* ------------------------------------------------------------------ *
   * 5. DATASET DE ALUMNOS
   * ------------------------------------------------------------------ */
  // Construye una ventana de evaluación completa a partir de valores crudos.
  function construirVentana(fecha, sexo, crudos) {
    const percentiles = {};
    Object.keys(crudos).forEach(k => {
      if (NORMAS[k]) percentiles[k] = percentil(k, crudos[k], sexo);
    });
    const dimensiones = calcularDimensiones(percentiles);
    const IPF = calcularIndice('IPF', percentiles, sexo);
    const IPB = calcularIndice('IPB', percentiles, sexo);
    const IPV = calcularIndice('IPV', percentiles, sexo);
    return { fecha, crudos, percentiles, dimensiones, indices: { IPF, IPB, IPV } };
  }

  function deporteRecomendado(indices) {
    const pares = [['Futbol', indices.IPF], ['Basquetbol', indices.IPB], ['Voleibol', indices.IPV]];
    pares.sort((a, b) => b[1] - a[1]);
    return pares[0][0];
  }

  function completarAlumno(base) {
    const ventanas = base.ventanasCrudas.map(v => construirVentana(v.fecha, base.sexo, v.crudos));
    const ultima = ventanas[ventanas.length - 1];
    const primera = ventanas[0];

    const promedioDim = Object.keys(ultima.dimensiones).reduce((s, k) => s + ultima.dimensiones[k], 0) / 6;
    const IRA = Math.round(promedioDim);

    const mejorIndice = Math.max(ultima.indices.IPF, ultima.indices.IPB, ultima.indices.IPV);
    const promedioIndices = (ultima.indices.IPF + ultima.indices.IPB + ultima.indices.IPV) / 3;
    let bonoMadurativo = base.bandera === 'tardia' ? 4 : (base.bandera === 'temprana' ? -2 : 0);
    const IPD = Math.round(Math.min(100, mejorIndice * 0.6 + promedioIndices * 0.4 + bonoMadurativo));

    const tendenciaSprint = primera.percentiles.sprint20 !== null ? (ultima.percentiles.sprint20 - primera.percentiles.sprint20) : 0;
    const tendenciaCmj = ultima.percentiles.cmj - primera.percentiles.cmj;
    const tendencia = (tendenciaSprint + tendenciaCmj) / 2;
    const IPRO = Math.round(Math.max(0, Math.min(100, IRA + tendencia * 0.35 + bonoMadurativo)));

    const IBD = Math.round(IPD * 0.4 + IRA * 0.3 + IPRO * 0.3);
    let bandaBeca = 'sin_recomendacion';
    if (IBD >= 90) bandaBeca = 'prioritaria';
    else if (IBD >= 75) bandaBeca = 'parcial';
    else if (IBD >= 60) bandaBeca = 'prospecto';

    const alumno = {
      ...base,
      evaluaciones: ventanas,
      indices: { IPD, IRA, IPRO, IBD, bandaBeca },
      deporteRecomendado: deporteRecomendado(ultima.indices),
    };
    alumno.compatibilidades = mejoresCompatibilidades(alumno, 4);
    return alumno;
  }

  const NOMBRES_MASC = ['Diego Hernández', 'Mateo Cruz', 'Santiago Vázquez', 'Emiliano Castillo', 'Leonardo Salinas', 'Rodrigo Domínguez', 'Alexis Medina'];
  const NOMBRES_FEM = ['Sofía Ramírez', 'Valeria Torres', 'Ximena Morales', 'Camila Reyes', 'Regina Ortiz', 'Fernanda Guzmán', 'Isabela Núñez'];

  const alumnosBase = [
    { id: 'a01', nombre: 'Diego Hernández', sexo: 'M', edad: 16, grado: '4º semestre', grupo: '4°A', deportePrincipal: 'voleibol',
      bandera: 'tardia', banderaTexto: 'Maduración tardía: potencial de crecimiento aún por expresarse',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 186, peso: 66, envergadura: 190, sprint20: 3.58, cmj: 42, saltoHorizontal: 225, lanzamiento: 8.7, dominadas: 5, agilidad510: 5.05, yoyo: 1020, sitReach: 15 } },
        { fecha: 'Nov 2025', crudos: { estatura: 190, peso: 68, envergadura: 195, sprint20: 3.49, cmj: 47, saltoHorizontal: 236, lanzamiento: 9.5, dominadas: 6, agilidad510: 4.94, yoyo: 1140, sitReach: 16 } },
        { fecha: 'Mar 2026', crudos: { estatura: 193, peso: 70, envergadura: 200, sprint20: 3.42, cmj: 51, saltoHorizontal: 245, lanzamiento: 10.3, dominadas: 8, agilidad510: 4.85, yoyo: 1260, sitReach: 18 } },
      ] },
    { id: 'a02', nombre: 'Sofía Ramírez', sexo: 'F', edad: 16, grado: '4º semestre', grupo: '4°A', deportePrincipal: 'voleibol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 166, peso: 54, envergadura: 168, sprint20: 3.74, cmj: 29, saltoHorizontal: 178, lanzamiento: 5.6, dominadas: 2, agilidad510: 5.25, yoyo: 780, sitReach: 24 } },
        { fecha: 'Nov 2025', crudos: { estatura: 167, peso: 55, envergadura: 169, sprint20: 3.68, cmj: 31, saltoHorizontal: 184, lanzamiento: 5.9, dominadas: 3, agilidad510: 5.14, yoyo: 830, sitReach: 25 } },
        { fecha: 'Mar 2026', crudos: { estatura: 168, peso: 55, envergadura: 170, sprint20: 3.63, cmj: 33, saltoHorizontal: 190, lanzamiento: 6.1, dominadas: 3, agilidad510: 5.05, yoyo: 870, sitReach: 26 } },
      ] },
    { id: 'a03', nombre: 'Valeria Torres', sexo: 'F', edad: 17, grado: '6º semestre', grupo: '6°B', deportePrincipal: 'basquetbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 176, peso: 62, envergadura: 179, sprint20: 3.55, cmj: 34, saltoHorizontal: 192, lanzamiento: 6.2, dominadas: 3, agilidad510: 5.1, yoyo: 850, sitReach: 20 } },
        { fecha: 'Nov 2025', crudos: { estatura: 177, peso: 62, envergadura: 180, sprint20: 3.5, cmj: 37, saltoHorizontal: 198, lanzamiento: 6.5, dominadas: 4, agilidad510: 5.0, yoyo: 900, sitReach: 21 } },
        { fecha: 'Mar 2026', crudos: { estatura: 178, peso: 63, envergadura: 182, sprint20: 3.46, cmj: 40, saltoHorizontal: 205, lanzamiento: 6.8, dominadas: 4, agilidad510: 4.92, yoyo: 950, sitReach: 22 } },
      ] },
    { id: 'a04', nombre: 'Mateo Cruz', sexo: 'M', edad: 17, grado: '6º semestre', grupo: '6°B', deportePrincipal: 'futbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 172, peso: 64, envergadura: 173, sprint20: 3.28, cmj: 40, saltoHorizontal: 222, lanzamiento: 7.5, dominadas: 7, agilidad510: 4.68, yoyo: 1280, sitReach: 14 } },
        { fecha: 'Nov 2025', crudos: { estatura: 173, peso: 65, envergadura: 174, sprint20: 3.22, cmj: 43, saltoHorizontal: 229, lanzamiento: 7.9, dominadas: 8, agilidad510: 4.6, yoyo: 1360, sitReach: 15 } },
        { fecha: 'Mar 2026', crudos: { estatura: 174, peso: 66, envergadura: 175, sprint20: 3.16, cmj: 46, saltoHorizontal: 236, lanzamiento: 8.2, dominadas: 9, agilidad510: 4.5, yoyo: 1430, sitReach: 16 } },
      ] },
    { id: 'a05', nombre: 'Ximena Morales', sexo: 'F', edad: 15, grado: '2º semestre', grupo: '2°C', deportePrincipal: 'voleibol',
      bandera: 'temprana', banderaTexto: 'Maduración temprana: ventaja física actual puede nivelarse con la edad',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 174, peso: 63, envergadura: 177, sprint20: 3.7, cmj: 33, saltoHorizontal: 188, lanzamiento: 6.0, dominadas: 2, agilidad510: 5.2, yoyo: 760, sitReach: 21 } },
        { fecha: 'Nov 2025', crudos: { estatura: 175, peso: 64, envergadura: 178, sprint20: 3.66, cmj: 34, saltoHorizontal: 191, lanzamiento: 6.1, dominadas: 2, agilidad510: 5.16, yoyo: 790, sitReach: 21 } },
        { fecha: 'Mar 2026', crudos: { estatura: 176, peso: 65, envergadura: 179, sprint20: 3.63, cmj: 35, saltoHorizontal: 194, lanzamiento: 6.2, dominadas: 3, agilidad510: 5.11, yoyo: 810, sitReach: 22 } },
      ] },
    { id: 'a06', nombre: 'Santiago Vázquez', sexo: 'M', edad: 18, grado: '8º semestre', grupo: '8°A', deportePrincipal: 'basquetbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 188, peso: 76, envergadura: 193, sprint20: 3.4, cmj: 44, saltoHorizontal: 220, lanzamiento: 8.5, dominadas: 8, agilidad510: 4.7, yoyo: 1100, sitReach: 12 } },
        { fecha: 'Nov 2025', crudos: { estatura: 189, peso: 77, envergadura: 194, sprint20: 3.35, cmj: 47, saltoHorizontal: 226, lanzamiento: 8.9, dominadas: 9, agilidad510: 4.62, yoyo: 1150, sitReach: 13 } },
        { fecha: 'Mar 2026', crudos: { estatura: 190, peso: 78, envergadura: 196, sprint20: 3.31, cmj: 50, saltoHorizontal: 232, lanzamiento: 9.2, dominadas: 10, agilidad510: 4.55, yoyo: 1190, sitReach: 13 } },
      ] },
    { id: 'a07', nombre: 'Camila Reyes', sexo: 'F', edad: 16, grado: '4º semestre', grupo: '4°A', deportePrincipal: 'futbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 160, peso: 52, envergadura: 161, sprint20: 3.5, cmj: 30, saltoHorizontal: 182, lanzamiento: 5.4, dominadas: 3, agilidad510: 4.95, yoyo: 980, sitReach: 23 } },
        { fecha: 'Nov 2025', crudos: { estatura: 161, peso: 53, envergadura: 162, sprint20: 3.45, cmj: 32, saltoHorizontal: 188, lanzamiento: 5.6, dominadas: 4, agilidad510: 4.87, yoyo: 1040, sitReach: 24 } },
        { fecha: 'Mar 2026', crudos: { estatura: 161, peso: 53, envergadura: 163, sprint20: 3.4, cmj: 34, saltoHorizontal: 193, lanzamiento: 5.8, dominadas: 4, agilidad510: 4.8, yoyo: 1090, sitReach: 25 } },
      ] },
    { id: 'a08', nombre: 'Emiliano Castillo', sexo: 'M', edad: 17, grado: '6º semestre', grupo: '6°C', deportePrincipal: 'voleibol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 182, peso: 68, envergadura: 187, sprint20: 3.44, cmj: 39, saltoHorizontal: 210, lanzamiento: 7.6, dominadas: 6, agilidad510: 4.8, yoyo: 1050, sitReach: 17 } },
        { fecha: 'Nov 2025', crudos: { estatura: 183, peso: 69, envergadura: 188, sprint20: 3.38, cmj: 42, saltoHorizontal: 216, lanzamiento: 8.0, dominadas: 7, agilidad510: 4.7, yoyo: 1110, sitReach: 18 } },
        { fecha: 'Mar 2026', crudos: { estatura: 184, peso: 70, envergadura: 190, sprint20: 3.33, cmj: 45, saltoHorizontal: 223, lanzamiento: 8.3, dominadas: 8, agilidad510: 4.62, yoyo: 1170, sitReach: 18 } },
      ] },
    { id: 'a09', nombre: 'Regina Ortiz', sexo: 'F', edad: 15, grado: '2º semestre', grupo: '2°C', deportePrincipal: 'basquetbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 172, peso: 60, envergadura: 175, sprint20: 3.62, cmj: 30, saltoHorizontal: 180, lanzamiento: 5.5, dominadas: 2, agilidad510: 5.18, yoyo: 700, sitReach: 19 } },
        { fecha: 'Nov 2025', crudos: { estatura: 173, peso: 60, envergadura: 176, sprint20: 3.58, cmj: 32, saltoHorizontal: 185, lanzamiento: 5.7, dominadas: 2, agilidad510: 5.1, yoyo: 740, sitReach: 20 } },
        { fecha: 'Mar 2026', crudos: { estatura: 174, peso: 61, envergadura: 178, sprint20: 3.54, cmj: 34, saltoHorizontal: 190, lanzamiento: 5.9, dominadas: 3, agilidad510: 5.02, yoyo: 780, sitReach: 20 } },
      ] },
    { id: 'a10', nombre: 'Leonardo Salinas', sexo: 'M', edad: 18, grado: '8º semestre', grupo: '8°A', deportePrincipal: 'futbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 180, peso: 70, envergadura: 181, sprint20: 3.10, cmj: 47, saltoHorizontal: 234, lanzamiento: 9.4, dominadas: 10, agilidad510: 4.42, yoyo: 1460, sitReach: 17 } },
        { fecha: 'Nov 2025', crudos: { estatura: 182, peso: 71, envergadura: 183, sprint20: 3.03, cmj: 50, saltoHorizontal: 242, lanzamiento: 10.1, dominadas: 11, agilidad510: 4.33, yoyo: 1540, sitReach: 18 } },
        { fecha: 'Mar 2026', crudos: { estatura: 183, peso: 72, envergadura: 184, sprint20: 2.97, cmj: 53, saltoHorizontal: 250, lanzamiento: 10.8, dominadas: 13, agilidad510: 4.25, yoyo: 1620, sitReach: 20 } },
      ] },
    { id: 'a11', nombre: 'Fernanda Guzmán', sexo: 'F', edad: 17, grado: '6º semestre', grupo: '6°B', deportePrincipal: 'voleibol',
      bandera: 'tardia', banderaTexto: 'Maduración tardía: potencial de crecimiento aún por expresarse',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 170, peso: 56, envergadura: 173, sprint20: 3.66, cmj: 32, saltoHorizontal: 185, lanzamiento: 5.8, dominadas: 3, agilidad510: 5.12, yoyo: 800, sitReach: 22 } },
        { fecha: 'Nov 2025', crudos: { estatura: 172, peso: 57, envergadura: 175, sprint20: 3.6, cmj: 35, saltoHorizontal: 192, lanzamiento: 6.1, dominadas: 4, agilidad510: 5.0, yoyo: 850, sitReach: 23 } },
        { fecha: 'Mar 2026', crudos: { estatura: 173, peso: 57, envergadura: 177, sprint20: 3.55, cmj: 38, saltoHorizontal: 199, lanzamiento: 6.4, dominadas: 4, agilidad510: 4.9, yoyo: 900, sitReach: 24 } },
      ] },
    { id: 'a12', nombre: 'Rodrigo Domínguez', sexo: 'M', edad: 16, grado: '4º semestre', grupo: '4°C', deportePrincipal: 'basquetbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 181, peso: 66, envergadura: 185, sprint20: 3.5, cmj: 36, saltoHorizontal: 205, lanzamiento: 6.8, dominadas: 5, agilidad510: 4.95, yoyo: 900, sitReach: 16 } },
        { fecha: 'Nov 2025', crudos: { estatura: 183, peso: 67, envergadura: 187, sprint20: 3.44, cmj: 39, saltoHorizontal: 211, lanzamiento: 7.1, dominadas: 6, agilidad510: 4.85, yoyo: 950, sitReach: 17 } },
        { fecha: 'Mar 2026', crudos: { estatura: 185, peso: 68, envergadura: 190, sprint20: 3.39, cmj: 42, saltoHorizontal: 217, lanzamiento: 7.4, dominadas: 6, agilidad510: 4.76, yoyo: 990, sitReach: 17 } },
      ] },
    { id: 'a13', nombre: 'Isabela Núñez', sexo: 'F', edad: 18, grado: '8º semestre', grupo: '8°B', deportePrincipal: 'futbol',
      bandera: 'normal', banderaTexto: 'Maduración acorde a edad cronológica',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 163, peso: 55, envergadura: 164, sprint20: 3.42, cmj: 33, saltoHorizontal: 195, lanzamiento: 5.9, dominadas: 4, agilidad510: 4.9, yoyo: 1120, sitReach: 21 } },
        { fecha: 'Nov 2025', crudos: { estatura: 163, peso: 55, envergadura: 165, sprint20: 3.37, cmj: 35, saltoHorizontal: 200, lanzamiento: 6.1, dominadas: 5, agilidad510: 4.82, yoyo: 1180, sitReach: 22 } },
        { fecha: 'Mar 2026', crudos: { estatura: 164, peso: 56, envergadura: 165, sprint20: 3.33, cmj: 37, saltoHorizontal: 205, lanzamiento: 6.3, dominadas: 5, agilidad510: 4.75, yoyo: 1230, sitReach: 23 } },
      ] },
    { id: 'a14', nombre: 'Alexis Medina', sexo: 'M', edad: 15, grado: '2º semestre', grupo: '2°B', deportePrincipal: 'voleibol',
      bandera: 'temprana', banderaTexto: 'Maduración temprana: ventaja física actual puede nivelarse con la edad',
      ventanasCrudas: [
        { fecha: 'Ago 2025', crudos: { estatura: 180, peso: 68, envergadura: 184, sprint20: 3.5, cmj: 36, saltoHorizontal: 202, lanzamiento: 7.0, dominadas: 5, agilidad510: 4.98, yoyo: 850, sitReach: 15 } },
        { fecha: 'Nov 2025', crudos: { estatura: 182, peso: 69, envergadura: 186, sprint20: 3.46, cmj: 38, saltoHorizontal: 207, lanzamiento: 7.3, dominadas: 5, agilidad510: 4.9, yoyo: 890, sitReach: 15 } },
        { fecha: 'Mar 2026', crudos: { estatura: 183, peso: 70, envergadura: 188, sprint20: 3.42, cmj: 40, saltoHorizontal: 212, lanzamiento: 7.5, dominadas: 6, agilidad510: 4.83, yoyo: 930, sitReach: 16 } },
      ] },
  ];

  const alumnos = alumnosBase.map(completarAlumno);

  /* ------------------------------------------------------------------ *
   * 6. CHECK-INS DE BIENESTAR (histórico semanal simulado)
   *    pse: esfuerzo percibido 1-10 · sueno: calidad 1-5 · animo: 1-5 · molestias: texto|null
   * ------------------------------------------------------------------ */
  const checkinsPorAlumno = {
    a01: [ // Diego: carga en aumento últimas 2 semanas → alerta amarilla aguda/crónica
      { fecha: '01 jun', pse: 5, sueno: 4, animo: 4, molestias: null },
      { fecha: '08 jun', pse: 5, sueno: 4, animo: 4, molestias: null },
      { fecha: '15 jun', pse: 6, sueno: 3, animo: 4, molestias: null },
      { fecha: '22 jun', pse: 8, sueno: 3, animo: 3, molestias: 'Molestia leve en rodilla derecha' },
      { fecha: '29 jun', pse: 9, sueno: 2, animo: 3, molestias: 'Molestia leve en rodilla derecha' },
    ],
    a02: [ // Sofía: ánimo bajo 3 semanas seguidas → alerta
      { fecha: '08 jun', pse: 6, sueno: 4, animo: 4, molestias: null },
      { fecha: '15 jun', pse: 6, sueno: 3, animo: 2, molestias: null },
      { fecha: '22 jun', pse: 5, sueno: 2, animo: 2, molestias: null },
      { fecha: '29 jun', pse: 6, sueno: 3, animo: 1, molestias: null },
    ],
    a03: [ { fecha: '15 jun', pse: 6, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 6, sueno: 4, animo: 4, molestias: null }, { fecha: '29 jun', pse: 5, sueno: 5, animo: 5, molestias: null } ],
    a04: [ { fecha: '15 jun', pse: 7, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 7, sueno: 3, animo: 4, molestias: null }, { fecha: '29 jun', pse: 6, sueno: 4, animo: 4, molestias: null } ],
    a05: [ { fecha: '15 jun', pse: 5, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 5, sueno: 4, animo: 3, molestias: null }, { fecha: '29 jun', pse: 5, sueno: 4, animo: 4, molestias: null } ],
    a06: [ { fecha: '15 jun', pse: 7, sueno: 3, animo: 3, molestias: 'Molestia en tobillo izquierdo' }, { fecha: '22 jun', pse: 6, sueno: 4, animo: 4, molestias: null }, { fecha: '29 jun', pse: 6, sueno: 4, animo: 4, molestias: null } ],
    a07: [ { fecha: '15 jun', pse: 5, sueno: 5, animo: 5, molestias: null }, { fecha: '22 jun', pse: 5, sueno: 4, animo: 4, molestias: null }, { fecha: '29 jun', pse: 5, sueno: 4, animo: 4, molestias: null } ],
    a08: [ { fecha: '15 jun', pse: 6, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 7, sueno: 4, animo: 4, molestias: null }, { fecha: '29 jun', pse: 6, sueno: 4, animo: 5, molestias: null } ],
    a09: [ { fecha: '15 jun', pse: 5, sueno: 3, animo: 3, molestias: null }, { fecha: '22 jun', pse: 5, sueno: 4, animo: 4, molestias: null }, { fecha: '29 jun', pse: 5, sueno: 4, animo: 4, molestias: null } ],
    a10: [ { fecha: '15 jun', pse: 7, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 6, sueno: 4, animo: 5, molestias: null }, { fecha: '29 jun', pse: 6, sueno: 4, animo: 4, molestias: null } ],
    a11: [ { fecha: '15 jun', pse: 5, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 5, sueno: 3, animo: 3, molestias: null }, { fecha: '29 jun', pse: 5, sueno: 4, animo: 4, molestias: null } ],
    a12: [ { fecha: '15 jun', pse: 6, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 6, sueno: 4, animo: 4, molestias: null }, { fecha: '29 jun', pse: 6, sueno: 4, animo: 4, molestias: null } ],
    a13: [ { fecha: '15 jun', pse: 5, sueno: 5, animo: 5, molestias: null }, { fecha: '22 jun', pse: 5, sueno: 4, animo: 4, molestias: null }, { fecha: '29 jun', pse: 5, sueno: 4, animo: 4, molestias: null } ],
    a14: [ { fecha: '15 jun', pse: 6, sueno: 4, animo: 4, molestias: null }, { fecha: '22 jun', pse: 6, sueno: 3, animo: 4, molestias: null }, { fecha: '29 jun', pse: 6, sueno: 4, animo: 4, molestias: null } ],
  };

  /* ------------------------------------------------------------------ *
   * 7. ESTADO EN MEMORIA (compartido entre vistas dentro de la sesión)
   * ------------------------------------------------------------------ */
  const estado = {
    alumnos,
    checkins: checkinsPorAlumno,
    bitacoraBecas: [
      { alumnoId: 'a10', decision: 'aprobada', motivo: 'IBD 91 sostenido dos ventanas, IPRO alto, sin observaciones.', autor: 'Comité de becas', fecha: '18 jun' },
    ],
    // Suscriptores para refrescar vistas al vivo (p.ej. Entrenador reacciona a checkin de Alumno)
    _listeners: [],
  };

  function onCambio(fn) { estado._listeners.push(fn); }
  function notificarCambio(tipo, payload) { estado._listeners.forEach(fn => { try { fn(tipo, payload); } catch (e) { /* noop */ } }); }

  function obtenerAlumno(id) { return estado.alumnos.find(a => a.id === id); }

  function registrarCheckin(alumnoId, checkin) {
    if (!estado.checkins[alumnoId]) estado.checkins[alumnoId] = [];
    estado.checkins[alumnoId].push(checkin);
    notificarCambio('checkin', { alumnoId, checkin });
  }

  function registrarDecisionBeca(alumnoId, decision, motivo, autor) {
    const entrada = { alumnoId, decision, motivo, autor: autor || 'Comité de becas', fecha: 'Hoy' };
    estado.bitacoraBecas.unshift(entrada);
    notificarCambio('beca', entrada);
    return entrada;
  }

  /** Alertas de bienestar calculadas a partir del historial real de check-ins */
  function calcularAlertas(alumnoId) {
    const hist = estado.checkins[alumnoId] || [];
    const alertas = [];
    if (hist.length >= 3) {
      const ultimas3 = hist.slice(-3);
      if (ultimas3.every(c => c.animo <= 2)) {
        alertas.push({ nivel: 'rojo', texto: 'Ánimo bajo 3 semanas seguidas → conviene una conversación breve.' });
      }
    }
    if (hist.length >= 2) {
      const reciente = hist.slice(-2).reduce((s, c) => s + c.pse, 0) / 2;
      const previo = hist.slice(0, -2).length ? hist.slice(0, -2).reduce((s, c) => s + c.pse, 0) / hist.slice(0, -2).length : reciente;
      const ratio = previo ? reciente / previo : 1;
      if (ratio >= 1.35) alertas.push({ nivel: 'rojo', texto: `Carga aguda/crónica en rojo (ratio ${ratio.toFixed(2)}): riesgo de sobrecarga.` });
      else if (ratio >= 1.15) alertas.push({ nivel: 'amarillo', texto: `Carga aguda/crónica en amarillo (ratio ${ratio.toFixed(2)}): vigilar volumen.` });
    }
    const ultimo = hist[hist.length - 1];
    if (ultimo && ultimo.molestias) {
      alertas.push({ nivel: 'amarillo', texto: `Molestia física reportada: "${ultimo.molestias}".` });
    }
    return alertas;
  }

  /** Recalcula percentiles e índices de un alumno a partir de valores capturados en cancha (simplificado). */
  function recalcularConCaptura(alumno, crudosNuevos) {
    const sexo = alumno.sexo;
    const percentiles = {};
    Object.keys(crudosNuevos).forEach(k => { percentiles[k] = percentil(k, crudosNuevos[k], sexo); });
    const dimensiones = calcularDimensiones(percentiles);
    const indices = {
      IPF: calcularIndice('IPF', percentiles, sexo),
      IPB: calcularIndice('IPB', percentiles, sexo),
      IPV: calcularIndice('IPV', percentiles, sexo),
    };
    return { percentiles, dimensiones, indices };
  }

  return {
    NORMAS, ETIQUETAS_PRUEBA, PESOS_INDICE, NOMBRE_INDICE, PERFILES_POSICION,
    percentil, esValorAtipico, calcularIndice, desgloseIndice, calcularDimensiones,
    calcularCompatibilidad, mejoresCompatibilidades, recalcularConCaptura,
    estado, onCambio, notificarCambio, obtenerAlumno, registrarCheckin, registrarDecisionBeca, calcularAlertas,
  };
})();
