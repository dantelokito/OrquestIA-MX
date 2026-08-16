# Centro de Trazabilidad — OrquestIA

Módulo que **complementa** el propósito de OrquestIA-MX:

1. **Más trazabilidad entre agentes** — cada handoff y artefacto puede registrarse como evento enlazado (quién → a quién).
2. **Visualizador en tiempo real** — panel web que muestra el flujo PM → UX → Arquitecto → Backend → Frontend → QA → DevOps.
3. **Español latinoamericano** — UI, mensajes, plantillas y comentarios de funciones en español claro.

## Arranque rápido

```bash
cd Centro-Trazabilidad
npm install
npm run demo
```

Abre [http://localhost:4177](http://localhost:4177).

- `npm run inicio` — solo el servidor (sin reseeding).
- `npm run sembrar` — regenera la demo de `laborregamarket`.

## Cómo encaja con los agentes

Los agentes siguen trabajando en sus carpetas (`outputs/{proyecto}/`, `OBSERVABILITY.md`, handoffs).  
Además, cuando entreguen o reciban trabajo, registran un evento en:

```text
Centro-Trazabilidad/datos/{proyecto}/eventos.jsonl
```

Guía paso a paso: [`plantillas/guia-registro-para-agentes.md`](plantillas/guia-registro-para-agentes.md).

## Estructura

```text
Centro-Trazabilidad/
├── esquema/           # Catálogo de agentes + JSON Schema del evento
├── plantillas/        # Ejemplos y guía para agentes
├── datos/             # JSONL por proyecto (fuente de la traza)
├── servidor/          # API REST + SSE + vigilante de archivos
├── cliente/           # Visualizador (HTML/CSS/JS)
├── herramientas/      # Sembrar demo y registrar eventos
└── .cursor/skills/    # Skill para activar el centro desde Cursor
```

## API útil

| Método | Ruta | Para qué |
|--------|------|----------|
| GET | `/api/salud` | ¿Está vivo el servicio? |
| GET | `/api/catalogo` | Agentes y flujo canónico |
| GET | `/api/proyectos` | Proyectos con traza |
| GET | `/api/proyectos/:p/eventos` | Historial |
| GET | `/api/proyectos/:p/resumen` | Estado por agente + handoffs |
| POST | `/api/eventos` | Alta de evento |
| GET | `/api/stream` | SSE en tiempo real |

## Registrar un evento desde terminal

```bash
node herramientas/registrar-evento.js --archivo plantillas/evento-traza.ejemplo.json
# o, con el servidor arriba:
node herramientas/registrar-evento.js --archivo plantillas/evento-traza.ejemplo.json --via api
```
