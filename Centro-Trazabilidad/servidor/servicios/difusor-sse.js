/**
 * Difusor Server-Sent Events (SSE).
 * Mantiene clientes conectados y les empuja eventos en tiempo real
 * cuando llega un nuevo registro al almacén o al watcher de archivos.
 */

/**
 * Crea un difusor SSE en memoria (suficiente para uso local / un solo proceso).
 * @returns {{
 *   agregarCliente: (respuesta: import('express').Response) => void,
 *   quitarCliente: (respuesta: import('express').Response) => void,
 *   emitir: (nombreEvento: string, carga: object) => void,
 *   cantidadClientes: () => number
 * }}
 */
export function crearDifusorSse() {
  /** @type {Set<import('express').Response>} */
  const clientes = new Set();

  /**
   * Registra una respuesta Express como suscriptor SSE.
   * @param {import('express').Response} respuesta Respuesta HTTP abierta.
   * @returns {void}
   */
  function agregarCliente(respuesta) {
    clientes.add(respuesta);
  }

  /**
   * Quita un cliente cuando cierra la pestaña o se corta la red.
   * @param {import('express').Response} respuesta Respuesta a retirar.
   * @returns {void}
   */
  function quitarCliente(respuesta) {
    clientes.delete(respuesta);
  }

  /**
   * Envía un mensaje SSE a todos los clientes conectados.
   * @param {string} nombreEvento Nombre del evento SSE (ej. "nuevo_evento").
   * @param {object} carga Objeto que se serializa a JSON.
   * @returns {void}
   */
  function emitir(nombreEvento, carga) {
    const cuerpo = `event: ${nombreEvento}\ndata: ${JSON.stringify(carga)}\n\n`;

    for (const cliente of clientes) {
      try {
        cliente.write(cuerpo);
      } catch (error) {
        // Cliente muerto: lo sacamos para no romper el bucle.
        console.warn("[sse] No se pudo escribir a un cliente; se elimina.", error);
        clientes.delete(cliente);
      }
    }
  }

  /**
   * Cuántos navegadores están escuchando en este momento.
   * @returns {number} Cantidad de clientes SSE activos.
   */
  function cantidadClientes() {
    return clientes.size;
  }

  return {
    agregarCliente,
    quitarCliente,
    emitir,
    cantidadClientes,
  };
}
