/**
 * Utilidades de rutas del Centro de Trazabilidad.
 * Centraliza rutas absolutas para que el servidor y las herramientas
 * no hardcodeen paths relativos frágiles.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

/** Carpeta donde vive este archivo (servidor/utilidades). */
const __nombreArchivo = fileURLToPath(import.meta.url);
const __carpetaUtilidades = path.dirname(__nombreArchivo);

/** Raíz del módulo Centro-Trazabilidad (dos niveles arriba). */
export const RAIZ_CENTRO = path.resolve(__carpetaUtilidades, "../..");

/** Raíz del monorepo OrquestIA-MX (un nivel arriba del centro). */
export const RAIZ_MONOREPO = path.resolve(RAIZ_CENTRO, "..");

/**
 * Devuelve la carpeta de datos de un proyecto (eventos JSONL).
 * @param {string} proyecto Nombre en kebab-case, ej. "laborregamarket".
 * @returns {string} Ruta absoluta a datos/<proyecto>.
 */
export function rutaDatosProyecto(proyecto) {
  return path.join(RAIZ_CENTRO, "datos", proyecto);
}

/**
 * Devuelve la ruta del archivo de eventos JSONL de un proyecto.
 * @param {string} proyecto Nombre en kebab-case.
 * @returns {string} Ruta absoluta a eventos.jsonl.
 */
export function rutaArchivoEventos(proyecto) {
  return path.join(rutaDatosProyecto(proyecto), "eventos.jsonl");
}

/**
 * Devuelve la carpeta estática del cliente (HTML/CSS/JS).
 * @returns {string} Ruta absoluta a cliente/.
 */
export function rutaCliente() {
  return path.join(RAIZ_CENTRO, "cliente");
}

/**
 * Devuelve la ruta del catálogo de agentes.
 * @returns {string} Ruta absoluta a esquema/catalogo-agentes.json.
 */
export function rutaCatalogoAgentes() {
  return path.join(RAIZ_CENTRO, "esquema", "catalogo-agentes.json");
}
