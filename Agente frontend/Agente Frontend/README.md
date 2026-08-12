# Agente Desarrollador Frontend Senior

Repositorio del **Agente Desarrollador Frontend Senior** del ecosistema de agentes de desarrollo. Transforma wireframes del UX/UI Designer y contratos de API del Arquitecto y Backend Developer en interfaces modulares, accesibles, performantes y listas para QA.

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
  Agente Arquitecto ──────────────┘
        │
        ▼
  Agente Backend
        │
        ▼
  Agente Frontend (este repo)
        │
        └──► QA Tester        (tests, flujos, build)
```

## Inputs upstream

Este agente consume los entregables de:

- [Agente UX/UI Designer](../../Agente%20UX%20UI/Agente%20UX%20UI/): Wireframes (`WF-*`), design tokens, breakpoints, estados de componentes
- [Agente Arquitecto de Software](../../Agente%20Arquitecto%20de%20Software/Agente%20Arquitecto/): Contratos API (`API-*`), estructura JSON, códigos HTTP de error
- [Agente Desarrollador Backend](../../Agente%20backend/Agente%20backend/): Handoffs de módulo (`MOD-*-handoff.md`), endpoints disponibles
- [Agente Product Manager](../../Administrador%20de%20producto/Product%20Manager/): PRD, Historias de Usuario con Criterios de Aceptación

## Cómo invocar el agente

El agente se activa **bajo demanda**. Dos formas de usarlo en Cursor:

1. **Skill:** Menciona `@frontend-developer` o pide explícitamente "actúa como desarrollador frontend senior".
2. **Prompt de activación:** Copia y pega el contenido de [`templates/activation-prompt.txt`](templates/activation-prompt.txt), completando el contexto del proyecto y el stack UI.

## Flujo de trabajo

1. **Análisis de diseño y contratos** — Mapeo de wireframes a features y endpoints a hooks/servicios.
2. **Scaffold del proyecto** — Estructura `src/` + cliente HTTP base + providers globales.
3. **Componentes base** — Design system (`components/ui/`) y layout (`components/layout/`).
4. **Features por módulo** — `features/[modulo]/` con components, hooks, services, types y 4 estados UI.
5. **Handoff** — Documentación de integración, `.env.example` y checklist DoD por feature.

## Estructura del repositorio

```
.cursor/skills/frontend-developer/
├── SKILL.md                              # Punto de entrada del skill
├── phase-1-identity.md                   # Identidad, principios, I/O, inputs upstream
├── phase-2-implementation-workflow.md    # Workflow, estructura src/, patrones, handoff
└── phase-3-testing-and-dod.md            # Testing, DoD, activación

templates/
├── activation-prompt.txt                 # Prompt de activación directa
├── feature-handoff.md                    # Checklist por feature entregable
└── env-requirements.md                   # Variables de entorno para DevOps

outputs/                                  # Código generado por proyecto
└── {nombre-proyecto}/
    ├── src/
    ├── tests/
    ├── .env.example
    ├── integration-readme.md
    └── feature-handoffs/
```

## Convención de salida

Los artefactos generados se guardan en `outputs/{nombre-proyecto}/` usando kebab-case (ej. `outputs/tienda-online/`).

| Tipo | Convención ID | Ejemplo |
|------|---------------|---------|
| Handoff de feature | `FEAT-{Feature}` | `FEAT-AUTH-handoff.md` |

## Principios de desarrollo

- **Modularidad y Componentización:** Atomic Design, componentes con única responsabilidad.
- **Core Web Vitals:** Code splitting, lazy loading, memorización cuando aplique.
- **Accesibilidad WCAG 2.1 AA:** HTML semántico, foco por teclado, atributos `aria-*`.
- **Estado desacoplado:** UI local, estado global y server state (TanStack Query / SWR) separados.
- **4 estados UI obligatorios:** Loading, Empty, Error y Success en toda vista que consuma datos.
- **Stack agnóstico:** El stack se declara en el prompt de activación (React, Next.js, Vue, Svelte, etc.).

## Downstream

| Agente | Entregable |
|--------|------------|
| QA Tester | Tests de componente, flujos E2E documentados, comandos de build/dev |
| DevOps | `.env.example`, `env-requirements.md`, comandos de build y despliegue |
| UX/UI Designer | `outputs/{nombre-proyecto}/handoff-ux-quality-gate-fase-2.txt` (solicitud Quality Gate) |
