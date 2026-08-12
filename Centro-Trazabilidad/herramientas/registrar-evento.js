/**
 * CLI para que un agente (o una persona) registre un evento de traza.
 *
 * Ejemplos:
 *   node herramientas/registrar-evento.js --archivo plantillas/evento-traza.ejemplo.json
 *   node herramientas/registrar-evento.js --json '{"id":"EVT-1",...}'
 *   node herramientas/registrar-evento.js --archivo ./mi-evento.json --via api
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { agregarEvento } from "../servidor/servicios/almacen-eventos.js";

const __archivo = fileURLToPath(import.meta.url);

/**
 * Lee argumentos simples --clave valor | --clave=valor.
 * @param {string[]} argv Argumentos de process.argv (sin node ni script).
 * @returns {Record<string, string|boolean>}
 */
function parsearArgumentos(argv) {
  const salida = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const sinGuiones = token.slice(2);
    if (sinGuiones.includes("=")) {
      const [clave, ...resto] = sinGuiones.split("=");
      salida[clave] = resto.join("=");
      continue;
    }

    const siguiente = argv[i + 1];
    if (!siguiente || siguiente.startsWith("--")) {
      salida[sinGuiones] = true;
    } else {
      salida[sinGuiones] = siguiente;
      i += 1;
    }
  }

  return salida;
}

/**
 * Muestra ayuda en español.
 * @returns {void}
 */
function mostrarAyuda() {
  console.log(`
Uso:
  node herramientas/registrar-evento.js --archivo <ruta.json>
  node herramientas/registrar-evento.js --json '<objeto json>'
  node herramientas/registrar-evento.js --archivo <ruta.json> --via api

Opciones:
  --archivo   Ruta a un JSON con el evento
  --json      Evento embebido como texto JSON
  --via       "archivo" (default, append JSONL) o "api" (POST al servidor)
  --url       URL del API (default http://localhost:4177/api/eventos)
  --ayuda     Muestra esta ayuda
`);
}

/**
 * Carga el evento desde --archivo o --json.
 * @param {Record<string, string|boolean>} args Argumentos parseados.
 * @returns {Promise<object>}
 */
async function cargarEventoDesdeArgs(args) {
  if (args.json && typeof args.json === "string") {
    return JSON.parse(args.json);
  }

  if (args.archivo && typeof args.archivo === "string") {
    const ruta = path.resolve(process.cwd(), args.archivo);
    const texto = await fs.readFile(ruta, "utf8");
    return JSON.parse(texto);
  }

  throw new Error("Debes pasar --archivo o --json. Usa --ayuda para ver ejemplos.");
}

/**
 * Publica el evento vía HTTP al API local.
 * @param {object} evento Evento a enviar.
 * @param {string} url Endpoint completo.
 * @returns {Promise<object>}
 */
async function publicarViaApi(evento, url) {
  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });

  const cuerpo = await respuesta.json();
  if (!respuesta.ok) {
    const detalle = cuerpo?.detalles?.join?.(" ") || cuerpo?.error || respuesta.statusText;
    throw new Error(`API respondió ${respuesta.status}: ${detalle}`);
  }

  return cuerpo.evento;
}

/**
 * Punto de entrada del CLI.
 * @returns {Promise<void>}
 */
async function main() {
  const args = parsearArgumentos(process.argv.slice(2));

  if (args.ayuda || args.help) {
    mostrarAyuda();
    return;
  }

  const evento = await cargarEventoDesdeArgs(args);
  const via = typeof args.via === "string" ? args.via : "archivo";

  let guardado;
  if (via === "api") {
    const url =
      typeof args.url === "string"
        ? args.url
        : "http://localhost:4177/api/eventos";
    guardado = await publicarViaApi(evento, url);
  } else {
    guardado = await agregarEvento(evento);
  }

  console.log("[registrar] Evento guardado:");
  console.log(JSON.stringify(guardado, null, 2));
}

main().catch((error) => {
  console.error("[registrar] Error:", error.message || error);
  process.exit(1);
});
