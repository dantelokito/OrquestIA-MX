/**
 * Vigilante de archivos JSONL.
 * Observa datos/<proyecto>/eventos.jsonl y, cuando crece el archivo,
 * lee solo las líneas nuevas y las difunde por SSE.
 */

import fs from "node:fs";
import path from "node:path";
import chokidar from "chokidar";
import { RAIZ_CENTRO } from "../utilidades/rutas-proyecto.js";
import { validarEvento } from "../utilidades/validar-evento.js";

/**
 * Inicia la vigilancia de la carpeta de datos.
 * @param {{ emitir: (nombre: string, carga: object) => void }} difusor Difusor SSE.
 * @returns {{ detener: () => Promise<void> }} Control para apagar el watcher.
 */
export function iniciarVigilanteArchivos(difusor) {
  const carpetaDatos = path.join(RAIZ_CENTRO, "datos");

  /** Offset por archivo: cuántos bytes ya consumimos. */
  const offsets = new Map();

  /**
   * Extrae el nombre de proyecto desde la ruta del JSONL.
   * @param {string} rutaArchivo Ruta absoluta al eventos.jsonl.
   * @returns {string|null} Nombre del proyecto o null si no aplica.
   */
  function proyectoDesdeRuta(rutaArchivo) {
    const relativa = path.relative(carpetaDatos, rutaArchivo);
    const partes = relativa.split(path.sep);
    if (partes.length >= 2 && partes[1] === "eventos.jsonl") {
      return partes[0];
    }
    return null;
  }

  /**
   * Lee bytes nuevos del JSONL y emite cada evento válido.
   * @param {string} rutaArchivo Archivo modificado.
   * @returns {void}
   */
  function procesarCrecimiento(rutaArchivo) {
    const proyecto = proyectoDesdeRuta(rutaArchivo);
    if (!proyecto) {
      return;
    }

    let estadisticas;
    try {
      estadisticas = fs.statSync(rutaArchivo);
    } catch {
      return;
    }

    const offsetPrevio = offsets.get(rutaArchivo) ?? 0;

    // Si el archivo se truncó o reescribió, reiniciamos el offset.
    if (estadisticas.size < offsetPrevio) {
      offsets.set(rutaArchivo, 0);
    }

    const desde = offsets.get(rutaArchivo) ?? 0;
    if (estadisticas.size <= desde) {
      return;
    }

    const descriptor = fs.openSync(rutaArchivo, "r");
    try {
      const longitud = estadisticas.size - desde;
      const buffer = Buffer.alloc(longitud);
      fs.readSync(descriptor, buffer, 0, longitud, desde);
      offsets.set(rutaArchivo, estadisticas.size);

      const texto = buffer.toString("utf8");
      const lineas = texto.split("\n");

      for (const linea of lineas) {
        const limpia = linea.trim();
        if (!limpia) {
          continue;
        }

        try {
          const parseado = JSON.parse(limpia);
          const { valido, eventoNormalizado } = validarEvento(parseado);
          if (valido) {
            difusor.emitir("nuevo_evento", {
              proyecto,
              evento: eventoNormalizado,
              origen: "archivo",
            });
          }
        } catch {
          // Línea incompleta o basura: se ignora hasta el próximo write.
        }
      }
    } finally {
      fs.closeSync(descriptor);
    }
  }

  /**
   * Inicializa el offset de un archivo existente sin re-emitir histórico.
   * @param {string} rutaArchivo Ruta al JSONL.
   * @returns {void}
   */
  function registrarArchivoExistente(rutaArchivo) {
    try {
      const estadisticas = fs.statSync(rutaArchivo);
      offsets.set(rutaArchivo, estadisticas.size);
    } catch {
      offsets.set(rutaArchivo, 0);
    }
  }

  // Creamos la carpeta si no existe para que chokidar no falle al arrancar.
  fs.mkdirSync(carpetaDatos, { recursive: true });

  const vigilante = chokidar.watch(path.join(carpetaDatos, "*/eventos.jsonl"), {
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 50,
    },
  });

  vigilante.on("add", (rutaArchivo) => {
    registrarArchivoExistente(rutaArchivo);
    console.log(`[vigilante] Observando ${rutaArchivo}`);
  });

  vigilante.on("change", (rutaArchivo) => {
    procesarCrecimiento(rutaArchivo);
  });

  vigilante.on("error", (error) => {
    console.error("[vigilante] Error al observar archivos:", error);
  });

  /**
   * Detiene el watcher de forma ordenada.
   * @returns {Promise<void>}
   */
  async function detener() {
    await vigilante.close();
  }

  return { detener };
}
