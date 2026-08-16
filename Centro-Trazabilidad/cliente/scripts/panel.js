/**
 * Lógica del visualizador OrquestIA (cliente).
 * Carga catálogo + historial, dibuja el flujo de agentes y
 * se suscribe al stream SSE para mostrar procesos en tiempo real.
 */

/** Etiquetas legibles en español para cada tipo de evento. */
const ETIQUETAS_TIPO = {
  inicio_sesion: "Inicio de sesión",
  descubrimiento: "Descubrimiento",
  artefacto_creado: "Artefacto creado",
  handoff_enviado: "Handoff enviado",
  handoff_recibido: "Handoff recibido",
  calidad_evaluada: "Calidad evaluada",
  bloqueo: "Bloqueo",
  desbloqueo: "Desbloqueo",
  completado: "Completado",
  nota: "Nota",
};

/** Etiquetas legibles para estados de agente. */
const ETIQUETAS_ESTADO = {
  sin_actividad: "Sin actividad",
  en_curso: "En curso",
  listo: "Listo",
  bloqueado: "Bloqueado",
  rechazado: "Rechazado",
  info: "Informativo",
};

/** Estado mutable de la interfaz. */
const estado = {
  catalogo: null,
  proyecto: null,
  eventos: [],
  resumen: null,
  filtroAgente: "",
  filtroTipo: "",
  fuenteEventos: null,
};

/**
 * Formatea una fecha ISO a hora local corta en español.
 * @param {string} iso Marca de tiempo ISO-8601.
 * @returns {string} Texto legible (fecha + hora).
 */
function formatearMarcaTiempo(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(fecha);
}

/**
 * Escapa texto para insertarlo seguro en HTML.
 * @param {unknown} valor Valor crudo.
 * @returns {string} Texto escapado.
 */
function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Actualiza el chip de conexión en la cabecera.
 * @param {"ok"|"error"|"espera"} modo Estado visual.
 * @param {string} texto Mensaje a mostrar.
 * @returns {void}
 */
function pintarEstadoConexion(modo, texto) {
  const nodo = document.getElementById("estado-conexion");
  if (!nodo) {
    return;
  }

  nodo.textContent = texto;
  nodo.className = `estado-conexion estado-conexion--${modo}`;
}

/**
 * Obtiene JSON del API y lanza error claro si falla.
 * @param {string} ruta Ruta relativa del API.
 * @returns {Promise<any>} Cuerpo JSON.
 */
async function pedirJson(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) {
    throw new Error(`Falló ${ruta} (HTTP ${respuesta.status})`);
  }
  return respuesta.json();
}

/**
 * Rellena el selector de proyectos y elige el primero disponible.
 * @returns {Promise<void>}
 */
async function cargarProyectos() {
  const datos = await pedirJson("/api/proyectos");
  const selector = document.getElementById("selector-proyecto");
  selector.innerHTML = "";

  if (!datos.proyectos || datos.proyectos.length === 0) {
    const opcion = document.createElement("option");
    opcion.value = "";
    opcion.textContent = "Sin proyectos aún";
    selector.appendChild(opcion);
    estado.proyecto = null;
    return;
  }

  for (const nombre of datos.proyectos) {
    const opcion = document.createElement("option");
    opcion.value = nombre;
    opcion.textContent = nombre;
    selector.appendChild(opcion);
  }

  // Preferimos laborregamarket si existe (caso de demo del monorepo).
  const preferido = datos.proyectos.includes("laborregamarket")
    ? "laborregamarket"
    : datos.proyectos[0];

  selector.value = preferido;
  estado.proyecto = preferido;
}

/**
 * Rellena los filtros de agente y tipo a partir del catálogo / tipos conocidos.
 * @returns {void}
 */
function poblarFiltros() {
  const filtroAgente = document.getElementById("filtro-agente");
  const filtroTipo = document.getElementById("filtro-tipo");

  filtroAgente.innerHTML = '<option value="">Todos</option>';
  filtroTipo.innerHTML = '<option value="">Todos</option>';

  const flujo = estado.catalogo?.flujo_canónico || [];
  for (const id of flujo) {
    const meta = estado.catalogo.agentes[id];
    const opcion = document.createElement("option");
    opcion.value = id;
    opcion.textContent = meta?.nombre || id;
    filtroAgente.appendChild(opcion);
  }

  for (const [clave, etiqueta] of Object.entries(ETIQUETAS_TIPO)) {
    const opcion = document.createElement("option");
    opcion.value = clave;
    opcion.textContent = etiqueta;
    filtroTipo.appendChild(opcion);
  }
}

/**
 * Dibuja la pista horizontal de agentes con su estado actual.
 * @returns {void}
 */
function pintarPistaAgentes() {
  const pista = document.getElementById("pista-agentes");
  const agentes = estado.resumen?.agentes || [];

  if (agentes.length === 0) {
    pista.innerHTML =
      '<li class="vacio">Todavía no hay actividad registrada para este proyecto.</li>';
    return;
  }

  pista.innerHTML = agentes
    .map((agente) => {
      const estadoClave = agente.estado || "sin_actividad";
      const ultimo = agente.ultimo_evento
        ? escaparHtml(agente.ultimo_evento.titulo)
        : "Sin eventos";

      return `
        <li class="agente agente--${escaparHtml(estadoClave)}" style="--color-agente: ${escaparHtml(agente.color || "#E8A838")}">
          <span class="agente__corto">${escaparHtml(agente.nombre_corto)}</span>
          <p class="agente__nombre">${escaparHtml(agente.nombre)}</p>
          <p class="agente__meta">${agente.total_eventos} eventos · ${agente.handoffs_enviados} handoffs</p>
          <p class="agente__meta">${ultimo}</p>
          <p class="agente__estado">${escaparHtml(ETIQUETAS_ESTADO[estadoClave] || estadoClave)}</p>
        </li>
      `;
    })
    .join("");
}

/**
 * Dibuja la cadena de handoffs (trazabilidad entre agentes).
 * @returns {void}
 */
function pintarHandoffs() {
  const contenedor = document.getElementById("lista-handoffs");
  const handoffs = [...(estado.resumen?.handoffs || [])].reverse();

  if (handoffs.length === 0) {
    contenedor.innerHTML =
      '<p class="vacio">Aún no hay handoffs registrados. Cuando un agente entregue trabajo, aparecerá aquí.</p>';
    return;
  }

  const nombres = estado.catalogo?.agentes || {};

  contenedor.innerHTML = handoffs
    .map((item) => {
      const de = nombres[item.de]?.nombre_corto || item.de || "?";
      const a = nombres[item.a]?.nombre_corto || item.a || "?";
      const artefacto = item.ruta_artefacto
        ? `<p class="handoff__detalle">${escaparHtml(item.ruta_artefacto)}</p>`
        : "";

      return `
        <article class="handoff">
          <p class="handoff__flecha">${escaparHtml(de)} → ${escaparHtml(a)}</p>
          <div>
            <p class="handoff__titulo">${escaparHtml(item.titulo)}</p>
            ${artefacto}
          </div>
          <time class="handoff__tiempo" datetime="${escaparHtml(item.marca_tiempo)}">
            ${escaparHtml(formatearMarcaTiempo(item.marca_tiempo))}
          </time>
        </article>
      `;
    })
    .join("");
}

/**
 * Filtra eventos según los selectores de la UI.
 * @returns {object[]} Eventos visibles (más recientes primero).
 */
function eventosFiltrados() {
  return [...estado.eventos]
    .reverse()
    .filter((evento) => {
      if (estado.filtroAgente && evento.agente_id !== estado.filtroAgente) {
        return false;
      }
      if (estado.filtroTipo && evento.tipo !== estado.filtroTipo) {
        return false;
      }
      return true;
    });
}

/**
 * Dibuja la línea de tiempo de procesos.
 * @param {string|null} idDestacado Id de evento recién llegado (animación).
 * @returns {void}
 */
function pintarLineaTiempo(idDestacado = null) {
  const contenedor = document.getElementById("linea-tiempo");
  const lista = eventosFiltrados();
  const nombres = estado.catalogo?.agentes || {};

  if (lista.length === 0) {
    contenedor.innerHTML =
      '<p class="vacio">No hay eventos con estos filtros. Prueba “Todos” o registra actividad nueva.</p>';
    return;
  }

  contenedor.innerHTML = lista
    .map((evento) => {
      const nombreAgente =
        nombres[evento.agente_id]?.nombre || evento.agente_id;
      const claseNueva = evento.id === idDestacado ? " evento--nuevo" : "";
      const chips = [
        nombreAgente,
        evento.modulo,
        evento.fase,
        ...(evento.etiquetas || []),
      ]
        .filter(Boolean)
        .map((chip) => `<span class="chip">${escaparHtml(chip)}</span>`)
        .join("");

      return `
        <article class="evento${claseNueva}" data-id="${escaparHtml(evento.id)}">
          <time class="evento__hora" datetime="${escaparHtml(evento.marca_tiempo)}">
            ${escaparHtml(formatearMarcaTiempo(evento.marca_tiempo))}
          </time>
          <div>
            <span class="evento__tipo">${escaparHtml(ETIQUETAS_TIPO[evento.tipo] || evento.tipo)}</span>
            <h3 class="evento__titulo">${escaparHtml(evento.titulo)}</h3>
            <p class="evento__mensaje">${escaparHtml(evento.mensaje)}</p>
            <div class="evento__chips">${chips}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

/**
 * Recalcula el resumen localmente tras un evento en vivo
 * (evita otro round-trip si el stream ya trae el evento).
 * @returns {Promise<void>}
 */
async function refrescarResumen() {
  if (!estado.proyecto) {
    return;
  }
  const datos = await pedirJson(`/api/proyectos/${estado.proyecto}/resumen`);
  estado.resumen = datos.resumen;
  pintarPistaAgentes();
  pintarHandoffs();
}

/**
 * Carga historial + resumen del proyecto seleccionado.
 * @returns {Promise<void>}
 */
async function cargarProyectoActual() {
  if (!estado.proyecto) {
    estado.eventos = [];
    estado.resumen = null;
    pintarPistaAgentes();
    pintarHandoffs();
    pintarLineaTiempo();
    return;
  }

  const [historial, resumen] = await Promise.all([
    pedirJson(`/api/proyectos/${estado.proyecto}/eventos`),
    pedirJson(`/api/proyectos/${estado.proyecto}/resumen`),
  ]);

  estado.eventos = historial.eventos || [];
  estado.resumen = resumen.resumen;
  pintarPistaAgentes();
  pintarHandoffs();
  pintarLineaTiempo();
}

/**
 * Inserta un evento en memoria si pertenece al proyecto visible
 * y no está duplicado.
 * @param {object} evento Evento normalizado del servidor.
 * @returns {boolean} true si se agregó.
 */
function incorporarEvento(evento) {
  if (!evento || evento.proyecto !== estado.proyecto) {
    return false;
  }

  const yaExiste = estado.eventos.some((item) => item.id === evento.id);
  if (yaExiste) {
    return false;
  }

  estado.eventos.push(evento);
  return true;
}

/**
 * Abre (o reabre) la conexión SSE de tiempo real.
 * @returns {void}
 */
function conectarStream() {
  if (estado.fuenteEventos) {
    estado.fuenteEventos.close();
    estado.fuenteEventos = null;
  }

  const url = estado.proyecto
    ? `/api/stream?proyecto=${encodeURIComponent(estado.proyecto)}`
    : "/api/stream";

  const fuente = new EventSource(url);
  estado.fuenteEventos = fuente;

  fuente.addEventListener("conexion", () => {
    pintarEstadoConexion("ok", "En vivo");
  });

  fuente.addEventListener("nuevo_evento", async (mensaje) => {
    try {
      const carga = JSON.parse(mensaje.data);
      const agregado = incorporarEvento(carga.evento);
      if (agregado) {
        pintarLineaTiempo(carga.evento.id);
        await refrescarResumen();
      }
    } catch (error) {
      console.warn("No se pudo procesar evento SSE:", error);
    }
  });

  fuente.onerror = () => {
    pintarEstadoConexion("error", "Reconectando…");
  };
}

/**
 * Engancha listeners de la UI (selectores y filtros).
 * @returns {void}
 */
function enlazarControles() {
  document
    .getElementById("selector-proyecto")
    .addEventListener("change", async (evento) => {
      estado.proyecto = evento.target.value || null;
      await cargarProyectoActual();
      conectarStream();
    });

  document
    .getElementById("filtro-agente")
    .addEventListener("change", (evento) => {
      estado.filtroAgente = evento.target.value;
      pintarLineaTiempo();
    });

  document
    .getElementById("filtro-tipo")
    .addEventListener("change", (evento) => {
      estado.filtroTipo = evento.target.value;
      pintarLineaTiempo();
    });
}

/**
 * Arranque del panel: catálogo → proyectos → historial → SSE.
 * @returns {Promise<void>}
 */
async function iniciarPanel() {
  pintarEstadoConexion("espera", "Conectando…");
  enlazarControles();

  try {
    estado.catalogo = await pedirJson("/api/catalogo");
    poblarFiltros();
    await cargarProyectos();
    await cargarProyectoActual();
    conectarStream();
  } catch (error) {
    console.error(error);
    pintarEstadoConexion("error", "Sin conexión al API");
    document.getElementById("pista-agentes").innerHTML =
      '<li class="vacio">No se pudo cargar el Centro de Trazabilidad. ¿Está corriendo <code>npm run inicio</code>?</li>';
  }
}

iniciarPanel();
