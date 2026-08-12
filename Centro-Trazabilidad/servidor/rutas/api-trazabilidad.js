/**
 * Rutas HTTP del API de trazabilidad.
 * Expone catálogo, proyectos, historial, alta de eventos y stream SSE.
 */

import fs from "node:fs/promises";
import { Router } from "express";
import {
  agregarEvento,
  construirResumenTrazabilidad,
  listarProyectos,
  leerEventos,
} from "../servicios/almacen-eventos.js";
import { rutaCatalogoAgentes } from "../utilidades/rutas-proyecto.js";

/**
 * Carga el catálogo de agentes desde disco.
 * @returns {Promise<object>} Catálogo JSON.
 */
async function cargarCatalogo() {
  const texto = await fs.readFile(rutaCatalogoAgentes(), "utf8");
  return JSON.parse(texto);
}

/**
 * Crea el router Express del API.
 * @param {{
 *   agregarCliente: Function,
 *   quitarCliente: Function,
 *   emitir: Function,
 *   cantidadClientes: Function
 * }} difusor Difusor SSE compartido con el vigilante de archivos.
 * @returns {import('express').Router}
 */
export function crearRouterApi(difusor) {
  const router = Router();

  /**
   * GET /api/salud — chequeo rápido para DevOps y el propio visualizador.
   */
  router.get("/salud", (_solicitud, respuesta) => {
    respuesta.json({
      ok: true,
      servicio: "Centro de Trazabilidad OrquestIA",
      clientes_sse: difusor.cantidadClientes(),
      marca_tiempo: new Date().toISOString(),
    });
  });

  /**
   * GET /api/catalogo — metadatos de agentes y flujo canónico.
   */
  router.get("/catalogo", async (_solicitud, respuesta) => {
    try {
      const catalogo = await cargarCatalogo();
      respuesta.json(catalogo);
    } catch (error) {
      console.error("[api] Error al leer catálogo:", error);
      respuesta.status(500).json({
        ok: false,
        error: "No se pudo leer el catálogo de agentes.",
      });
    }
  });

  /**
   * GET /api/proyectos — lista de proyectos con datos de traza.
   */
  router.get("/proyectos", async (_solicitud, respuesta) => {
    try {
      const proyectos = await listarProyectos();
      respuesta.json({ proyectos });
    } catch (error) {
      console.error("[api] Error al listar proyectos:", error);
      respuesta.status(500).json({
        ok: false,
        error: "No se pudieron listar los proyectos.",
      });
    }
  });

  /**
   * GET /api/proyectos/:proyecto/eventos — historial completo.
   */
  router.get("/proyectos/:proyecto/eventos", async (solicitud, respuesta) => {
    try {
      const { proyecto } = solicitud.params;
      const eventos = await leerEventos(proyecto);
      respuesta.json({ proyecto, eventos });
    } catch (error) {
      console.error("[api] Error al leer eventos:", error);
      respuesta.status(500).json({
        ok: false,
        error: "No se pudieron leer los eventos del proyecto.",
      });
    }
  });

  /**
   * GET /api/proyectos/:proyecto/resumen — estado por agente + handoffs.
   */
  router.get("/proyectos/:proyecto/resumen", async (solicitud, respuesta) => {
    try {
      const { proyecto } = solicitud.params;
      const [eventos, catalogo] = await Promise.all([
        leerEventos(proyecto),
        cargarCatalogo(),
      ]);
      const resumen = construirResumenTrazabilidad(eventos, catalogo);
      respuesta.json({ proyecto, resumen });
    } catch (error) {
      console.error("[api] Error al armar resumen:", error);
      respuesta.status(500).json({
        ok: false,
        error: "No se pudo construir el resumen de trazabilidad.",
      });
    }
  });

  /**
   * POST /api/eventos — registra un evento (usado por agentes o el panel demo).
   */
  router.post("/eventos", async (solicitud, respuesta) => {
    try {
      const guardado = await agregarEvento(solicitud.body || {});

      // Empujamos al instante a quien esté mirando el visualizador.
      difusor.emitir("nuevo_evento", {
        proyecto: guardado.proyecto,
        evento: guardado,
        origen: "api",
      });

      respuesta.status(201).json({ ok: true, evento: guardado });
    } catch (error) {
      if (error && error.codigo === "EVENTO_INVALIDO") {
        respuesta.status(400).json({
          ok: false,
          error: "Evento inválido.",
          detalles: error.errores,
        });
        return;
      }

      console.error("[api] Error al guardar evento:", error);
      respuesta.status(500).json({
        ok: false,
        error: "No se pudo guardar el evento.",
      });
    }
  });

  /**
   * GET /api/stream — canal SSE de tiempo real.
   * Query opcional: ?proyecto=laborregamarket para filtrar en el cliente
   * (el servidor emite todo; el filtro lo aplica el visualizador).
   */
  router.get("/stream", (solicitud, respuesta) => {
    respuesta.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    respuesta.setHeader("Cache-Control", "no-cache, no-transform");
    respuesta.setHeader("Connection", "keep-alive");
    respuesta.flushHeaders?.();

    // Comentario SSE de bienvenida (mantiene vivos algunos proxies).
    respuesta.write(": conectado al Centro de Trazabilidad OrquestIA\n\n");
    respuesta.write(
      `event: conexion\ndata: ${JSON.stringify({
        ok: true,
        mensaje: "Escuchando procesos de agentes en tiempo real.",
        proyecto_filtro: solicitud.query.proyecto || null,
      })}\n\n`,
    );

    difusor.agregarCliente(respuesta);

    // Latido cada 25s para que no cierren la conexión por inactividad.
    const latido = setInterval(() => {
      try {
        respuesta.write(": latido\n\n");
      } catch {
        clearInterval(latido);
      }
    }, 25000);

    solicitud.on("close", () => {
      clearInterval(latido);
      difusor.quitarCliente(respuesta);
    });
  });

  return router;
}
