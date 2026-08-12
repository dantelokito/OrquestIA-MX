/**
 * Almacén de eventos en disco (JSONL por proyecto).
 * Cada línea del archivo es un evento JSON completo.
 * Así se puede append-only desde cualquier agente sin base de datos.
 */

import fs from "node:fs/promises";
import path from "node:path";
import {
  RAIZ_CENTRO,
  rutaArchivoEventos,
  rutaDatosProyecto,
} from "../utilidades/rutas-proyecto.js";
import { validarEvento } from "../utilidades/validar-evento.js";

/**
 * Asegura que exista la carpeta de datos de un proyecto.
 * @param {string} proyecto Nombre del proyecto en kebab-case.
 * @returns {Promise<void>}
 */
export async function asegurarCarpetaProyecto(proyecto) {
  await fs.mkdir(rutaDatosProyecto(proyecto), { recursive: true });
}

/**
 * Lista los proyectos que ya tienen carpeta en datos/.
 * @returns {Promise<string[]>} Nombres de proyecto ordenados.
 */
export async function listarProyectos() {
  const carpetaDatos = path.join(RAIZ_CENTRO, "datos");

  try {
    const entradas = await fs.readdir(carpetaDatos, { withFileTypes: true });
    return entradas
      .filter((entrada) => entrada.isDirectory())
      .map((entrada) => entrada.name)
      .sort((a, b) => a.localeCompare(b, "es"));
  } catch (error) {
    // Si aún no existe datos/, devolvemos lista vacía (arranque en frío).
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Lee todos los eventos de un proyecto desde el JSONL.
 * Las líneas vacías o corruptas se omiten con aviso en consola.
 * @param {string} proyecto Nombre del proyecto.
 * @returns {Promise<object[]>} Eventos ordenados por marca_tiempo.
 */
export async function leerEventos(proyecto) {
  const archivo = rutaArchivoEventos(proyecto);

  let contenido;
  try {
    contenido = await fs.readFile(archivo, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const eventos = [];
  const lineas = contenido.split("\n");

  for (let indice = 0; indice < lineas.length; indice += 1) {
    const linea = lineas[indice].trim();
    if (!linea) {
      continue;
    }

    try {
      const parseado = JSON.parse(linea);
      const { valido, eventoNormalizado, errores } = validarEvento(parseado);
      if (!valido) {
        console.warn(
          `[almacen] Proyecto ${proyecto}, línea ${indice + 1}: ${errores.join(" ")}`,
        );
        continue;
      }
      eventos.push(eventoNormalizado);
    } catch {
      console.warn(
        `[almacen] Proyecto ${proyecto}, línea ${indice + 1}: JSON inválido.`,
      );
    }
  }

  // Orden cronológico para el visualizador y la línea de tiempo.
  eventos.sort((a, b) => {
    const ta = Date.parse(a.marca_tiempo) || 0;
    const tb = Date.parse(b.marca_tiempo) || 0;
    return ta - tb;
  });

  return eventos;
}

/**
 * Agrega (append) un evento válido al JSONL del proyecto.
 * @param {object} eventoCandidato Evento crudo a validar y guardar.
 * @returns {Promise<object>} Evento normalizado ya persistido.
 */
export async function agregarEvento(eventoCandidato) {
  const { valido, errores, eventoNormalizado } = validarEvento(eventoCandidato);

  if (!valido) {
    const error = new Error(errores.join(" "));
    error.codigo = "EVENTO_INVALIDO";
    error.errores = errores;
    throw error;
  }

  await asegurarCarpetaProyecto(eventoNormalizado.proyecto);
  const archivo = rutaArchivoEventos(eventoNormalizado.proyecto);
  const linea = `${JSON.stringify(eventoNormalizado)}\n`;
  await fs.appendFile(archivo, linea, "utf8");

  return eventoNormalizado;
}

/**
 * Construye un resumen de trazabilidad: estado por agente y handoffs.
 * @param {object[]} eventos Lista de eventos del proyecto.
 * @param {object} catalogo Catálogo de agentes cargado desde JSON.
 * @returns {object} Resumen listo para el panel del visualizador.
 */
export function construirResumenTrazabilidad(eventos, catalogo) {
  const flujo = catalogo.flujo_canónico || [];
  const porAgente = {};

  for (const agenteId of flujo) {
    const meta = catalogo.agentes[agenteId] || { nombre: agenteId };
    porAgente[agenteId] = {
      agente_id: agenteId,
      nombre: meta.nombre,
      nombre_corto: meta.nombre_corto,
      color: meta.color,
      estado: "sin_actividad",
      ultimo_evento: null,
      total_eventos: 0,
      handoffs_enviados: 0,
      handoffs_recibidos: 0,
    };
  }

  const handoffs = [];

  for (const evento of eventos) {
    const ficha = porAgente[evento.agente_id];
    if (!ficha) {
      // Agente desconocido: lo registramos al vuelo para no perder señal.
      porAgente[evento.agente_id] = {
        agente_id: evento.agente_id,
        nombre: evento.agente_id,
        nombre_corto: evento.agente_id.slice(0, 3).toUpperCase(),
        color: "#8899AA",
        estado: evento.estado || "info",
        ultimo_evento: evento,
        total_eventos: 1,
        handoffs_enviados: evento.tipo === "handoff_enviado" ? 1 : 0,
        handoffs_recibidos: evento.tipo === "handoff_recibido" ? 1 : 0,
      };
      continue;
    }

    ficha.total_eventos += 1;
    ficha.ultimo_evento = evento;
    ficha.estado = evento.estado || ficha.estado;

    if (evento.tipo === "handoff_enviado") {
      ficha.handoffs_enviados += 1;
      handoffs.push({
        id: evento.id,
        de: evento.agente_id,
        a: evento.destino_agente_id,
        titulo: evento.titulo,
        marca_tiempo: evento.marca_tiempo,
        ruta_artefacto: evento.ruta_artefacto,
        modulo: evento.modulo,
      });
    }

    if (evento.tipo === "handoff_recibido") {
      ficha.handoffs_recibidos += 1;
    }
  }

  return {
    total_eventos: eventos.length,
    agentes: flujo.map((id) => porAgente[id]).filter(Boolean),
    handoffs,
    ultimo_evento: eventos.length > 0 ? eventos[eventos.length - 1] : null,
  };
}
