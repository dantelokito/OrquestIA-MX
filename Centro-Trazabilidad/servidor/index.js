/**
 * Punto de entrada del Centro de Trazabilidad OrquestIA-MX.
 * Sirve el visualizador estático, el API REST y el stream SSE.
 *
 * Arranque:
 *   npm run inicio
 *   # o con datos de demostración:
 *   npm run demo
 */

import express from "express";
import cors from "cors";
import { crearDifusorSse } from "./servicios/difusor-sse.js";
import { iniciarVigilanteArchivos } from "./servicios/vigilante-archivos.js";
import { crearRouterApi } from "./rutas/api-trazabilidad.js";
import { rutaCliente } from "./utilidades/rutas-proyecto.js";

/** Puerto HTTP; se puede sobreescribir con la variable de entorno PUERTO. */
const PUERTO = Number(process.env.PUERTO || 4177);

/**
 * Arranca el servidor Express con todos los servicios.
 * @returns {Promise<void>}
 */
async function iniciarServidor() {
  const app = express();
  const difusor = crearDifusorSse();

  // CORS abierto para desarrollo local (el visualizador y posibles scripts).
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  // API bajo /api/*
  app.use("/api", crearRouterApi(difusor));

  // Archivos del visualizador (HTML/CSS/JS en español).
  app.use(express.static(rutaCliente()));

  // Fallback amigable: cualquier ruta desconocida devuelve el panel.
  app.get("*", (_solicitud, respuesta) => {
    respuesta.sendFile("index.html", { root: rutaCliente() });
  });

  // Vigilamos datos/*/eventos.jsonl para empujar cambios hechos a mano o por agentes.
  const vigilante = iniciarVigilanteArchivos(difusor);

  const servidor = app.listen(PUERTO, () => {
    console.log("");
    console.log("╔══════════════════════════════════════════════════════╗");
    console.log("║   OrquestIA — Centro de Trazabilidad                 ║");
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(`║   Visualizador:  http://localhost:${PUERTO}                 ║`);
    console.log(`║   Salud API:     http://localhost:${PUERTO}/api/salud       ║`);
    console.log("║   Idioma:        Español latinoamericano             ║");
    console.log("╚══════════════════════════════════════════════════════╝");
    console.log("");
  });

  /**
   * Cierre ordenado al recibir Ctrl+C o señal de parada.
   * @returns {Promise<void>}
   */
  async function apagar() {
    console.log("\n[servidor] Apagando Centro de Trazabilidad...");
    await vigilante.detener();
    servidor.close(() => {
      console.log("[servidor] Listo. Hasta luego.");
      process.exit(0);
    });
  }

  process.on("SIGINT", apagar);
  process.on("SIGTERM", apagar);
}

iniciarServidor().catch((error) => {
  console.error("[servidor] Falló el arranque:", error);
  process.exit(1);
});
