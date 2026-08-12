/**
 * Validación ligera de eventos de traza.
 * No depende de librerías externas: solo revisa campos obligatorios
 * y valores permitidos para mantener el JSONL limpio.
 */

/** Tipos de evento aceptados por el esquema OrquestIA. */
const TIPOS_VALIDOS = new Set([
  "inicio_sesion",
  "descubrimiento",
  "artefacto_creado",
  "handoff_enviado",
  "handoff_recibido",
  "calidad_evaluada",
  "bloqueo",
  "desbloqueo",
  "completado",
  "nota",
]);

/** Estados resultantes aceptados. */
const ESTADOS_VALIDOS = new Set([
  "en_curso",
  "listo",
  "bloqueado",
  "rechazado",
  "info",
]);

/**
 * Indica si un valor es un texto no vacío.
 * @param {unknown} valor Valor a evaluar.
 * @returns {boolean} true si es string con contenido.
 */
function esTextoUtil(valor) {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Valida un evento de traza y devuelve errores legibles en español.
 * @param {unknown} evento Objeto parseado desde JSON.
 * @returns {{ valido: boolean, errores: string[], eventoNormalizado?: object }}
 */
export function validarEvento(evento) {
  const errores = [];

  // Si no llega un objeto, no hay nada que salvar.
  if (!evento || typeof evento !== "object" || Array.isArray(evento)) {
    return {
      valido: false,
      errores: ["El evento debe ser un objeto JSON."],
    };
  }

  const camposObligatorios = [
    "id",
    "marca_tiempo",
    "proyecto",
    "agente_id",
    "tipo",
    "titulo",
    "mensaje",
  ];

  for (const campo of camposObligatorios) {
    if (!esTextoUtil(evento[campo])) {
      errores.push(`Falta el campo obligatorio "${campo}" o está vacío.`);
    }
  }

  if (esTextoUtil(evento.tipo) && !TIPOS_VALIDOS.has(evento.tipo)) {
    errores.push(
      `El tipo "${evento.tipo}" no es válido. Usa uno del esquema evento-traza.`,
    );
  }

  // El estado es opcional; si viene, debe ser conocido.
  if (evento.estado != null && !ESTADOS_VALIDOS.has(evento.estado)) {
    errores.push(
      `El estado "${evento.estado}" no es válido. Usa: en_curso, listo, bloqueado, rechazado o info.`,
    );
  }

  if (errores.length > 0) {
    return { valido: false, errores };
  }

  // Normalizamos con valores por defecto para el visualizador.
  const eventoNormalizado = {
    id: evento.id.trim(),
    marca_tiempo: evento.marca_tiempo.trim(),
    proyecto: evento.proyecto.trim().toLowerCase(),
    agente_id: evento.agente_id.trim(),
    tipo: evento.tipo.trim(),
    titulo: evento.titulo.trim(),
    mensaje: evento.mensaje.trim(),
    fase: esTextoUtil(evento.fase) ? evento.fase.trim() : null,
    modulo: esTextoUtil(evento.modulo) ? evento.modulo.trim() : null,
    origen_agente_id: esTextoUtil(evento.origen_agente_id)
      ? evento.origen_agente_id.trim()
      : null,
    destino_agente_id: esTextoUtil(evento.destino_agente_id)
      ? evento.destino_agente_id.trim()
      : null,
    ruta_artefacto: esTextoUtil(evento.ruta_artefacto)
      ? evento.ruta_artefacto.trim()
      : null,
    estado: esTextoUtil(evento.estado) ? evento.estado.trim() : "info",
    etiquetas: Array.isArray(evento.etiquetas)
      ? evento.etiquetas.filter((e) => esTextoUtil(e)).map((e) => e.trim())
      : [],
  };

  return { valido: true, errores: [], eventoNormalizado };
}
