# Agente Product Manager

Repositorio del **Agente Product Manager (PM)** del ecosistema de agentes de desarrollo. Actúa como puente estratégico entre los objetivos de negocio del cliente y el equipo técnico de ejecución.

## Rol en el ecosistema

```
Cliente / Stakeholder
        │
        ▼
  Agente PM (este repo)
        │
        ├──► UX/UI Designer    (user flows, interacción visual)
        ├──► Arquitecto        (requerimientos no funcionales)
        └──► Tech Lead / Devs  (backlog priorizado, criterios de aceptación)
```

## Cómo invocar el agente

El agente se activa **bajo demanda**. Dos formas de usarlo en Cursor:

1. **Skill:** Menciona `@product-manager` o pide explícitamente "actúa como PM".
2. **Prompt de activación:** Copia y pega el contenido de [`templates/activation-prompt.txt`](templates/activation-prompt.txt), completando el contexto del proyecto.

## Flujo de trabajo

1. **Discovery** — Entrevista de negocio, preguntas de aclaración, desglose de módulos, priorización MoSCoW.
2. **PRD** — Documento de requerimientos con alcance MVP ([`templates/prd-corto.md`](templates/prd-corto.md)).
3. **User Stories** — Historias con criterios de aceptación Given-When-Then ([`templates/user-story.md`](templates/user-story.md)).
4. **Handoff** — Traspaso a agentes downstream tras validar el checklist DoD del PM.

## Estructura del repositorio

```
.cursor/skills/product-manager/
├── SKILL.md                  # Punto de entrada del skill
├── phase-1-identity.md       # Identidad, principios, I/O, tono
├── phase-2-discovery.md      # Discovery workflow, plantillas, handoff
└── phase-3-scope-control.md  # Control de cambios, riesgos, DoD

templates/
├── prd-corto.md              # Plantilla A: PRD
├── user-story.md             # Plantilla B: User Story
├── change-order.md           # Registro de cambio de alcance
└── activation-prompt.txt     # Prompt de activación directa

outputs/                      # Entregables generados por proyecto
└── {nombre-proyecto}/
    ├── prd.md
    ├── backlog.md
    ├── user-stories/
    └── change-orders/
```

## Convención de salida

Los artefactos generados se guardan en `outputs/{nombre-proyecto}/` usando kebab-case (ej. `outputs/tienda-online/`).

## Control de alcance

Para cambios que alteren tiempo, presupuesto o alcance, usa la plantilla [`templates/change-order.md`](templates/change-order.md) y consulta las directrices en [`.cursor/skills/product-manager/phase-3-scope-control.md`](.cursor/skills/product-manager/phase-3-scope-control.md).
