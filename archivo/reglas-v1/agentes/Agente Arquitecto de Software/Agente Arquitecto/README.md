# Agente Arquitecto de Software

Repositorio del **Agente Arquitecto de Software** del ecosistema de agentes de desarrollo. Traduce requerimientos de negocio (PM) y flujos visuales (UX/UI) en una estructura técnica sólida, escalable, segura y mantenible.

## Rol en el ecosistema

```
Cliente / Stakeholder
        │
        ▼
  Agente PM ──────────────────────┐
        │                         │
        ▼                         │
  Agente UX/UI ───────────────────┤
        │                         │
        ▼                         ▼
  Agente Arquitecto (este repo)
        │
        ├──► Backend         (esquema BD, contratos API, seguridad)
        ├──► Frontend        (endpoints, JSON, errores HTTP)
        └──► DevOps          (infra, variables de entorno, servicios cloud)
```

## Inputs upstream

Este agente consume los entregables de:

- [Agente Product Manager](../Administrador%20de%20producto/Product%20Manager/): PRD, NFRs, Historias de Usuario
- [Agente UX/UI Designer](../Agente%20UX%20UI/Agente%20UX%20UI/): User flows, wireframes, necesidades de integración en tiempo real

## Cómo invocar el agente

El agente se activa **bajo demanda**. Dos formas de usarlo en Cursor:

1. **Skill:** Menciona `@software-architect` o pide explícitamente "actúa como arquitecto de software".
2. **Prompt de activación:** Copia y pega el contenido de [`templates/activation-prompt.txt`](templates/activation-prompt.txt), completando el contexto del proyecto.

## Flujo de trabajo

1. **Topología del Sistema** — Diagramas de alto nivel (cliente, servidor, BD, terceros).
2. **Modelo de Datos** — Entidades, relaciones, tipos de datos e índices ([`templates/data-schema.md`](templates/data-schema.md)).
3. **Contratos de API** — Rutas HTTP, JSON request/response, autenticación ([`templates/api-contract.md`](templates/api-contract.md)).
4. **Seguridad e Integración** — JWT, CORS, Rate Limiting, Webhooks, Queues.
5. **ADRs** — Decisiones técnicas estructurales ([`templates/adr.md`](templates/adr.md)).
6. **Handoff** — Traspaso a Backend, Frontend y DevOps tras validar el checklist DoD.

## Estructura del repositorio

```
.cursor/skills/software-architect/
├── SKILL.md                          # Punto de entrada del skill
├── phase-1-identity.md               # Identidad, principios, I/O, tono
├── phase-2-architecture-workflow.md  # Workflow, plantillas, handoff
└── phase-3-adrs-and-dod.md           # ADRs, DoD, activación

templates/
├── architecture-diagram.md           # Plantilla A: Diagrama Mermaid
├── api-contract.md                   # Plantilla B: Contrato API REST
├── data-schema.md                    # Plantilla C: Esquema de BD
├── adr.md                            # Plantilla ADR
└── activation-prompt.txt             # Prompt de activación directa

outputs/                              # Entregables generados por proyecto
└── {nombre-proyecto}/
    ├── sad.md
    ├── diagrams/
    ├── api/
    ├── data-model/
    ├── adrs/
    └── infra-requirements.md
```

## Convención de salida

Los artefactos generados se guardan en `outputs/{nombre-proyecto}/` usando kebab-case (ej. `outputs/tienda-online/`).

| Tipo | Convención ID | Ejemplo |
|------|---------------|---------|
| Diagrama de arquitectura | `ARCH-{Module}-{Number}` | `ARCH-AUTH-01.md` |
| Contrato API | `API-{Module}-{Number}` | `API-AUTH-01.md` |
| Esquema de BD | `DB-{Entity}` | `DB-users.md` |
| ADR | `ADR-{Number}` | `ADR-001.md` |

## Principios de arquitectura

- **Simplicidad Evolutiva (KISS / YAGNI):** Flexibilidad para crecer sin sobreingeniería temprana.
- **Desacoplamiento y Alta Cohesión:** Monolito modular o microservicios según escala.
- **Security by Design:** JWT/OAuth2, cifrado en tránsito/reposo, sanitización de entradas.
- **Resiliencia y Escalabilidad:** Retries, timeouts, circuit breakers, escalado horizontal/vertical.
- **Documentación Estandarizada:** Diagramas Mermaid/C4 y ADRs para decisiones técnicas relevantes.
