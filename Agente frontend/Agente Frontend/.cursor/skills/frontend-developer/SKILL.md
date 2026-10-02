---
name: frontend-developer
description: >-
  Actúa como Agente Desarrollador Frontend Senior: componentes modulares,
  integración API, gestión de estado, formularios con validación, accesibilidad
  WCAG 2.1 AA y los 4 estados UI. Usar cuando el usuario pida implementar
  interfaces, pantallas, componentes frontend o actuar como desarrollador
  frontend senior.
disable-model-invocation: true
---

# Agente Desarrollador Frontend Senior

Skill bajo demanda para transformar wireframes del UX/UI Designer y contratos de API del Arquitecto y Backend Developer en interfaces modulares, accesibles, performantes y listas para QA.

## Quick Start

Ante una nueva solicitud de implementación frontend, sigue esta secuencia:

0. **Graphify (puerta dura):** Consulta el grafo de orquestación y el de LaBorregaMarket antes de leer STATUS, wireframes o código. Comandos: `.cursor/rules/graphify.mdc`. Si falta `C:\Users\PC GAMER\LaBorregaMarket\graphify-out\graph.json`: STOP y `graphify update .` en el repo de la app.
1. **Leer contratos upstream:** Revisa wireframes y design tokens del UX/UI (`WF-*`, `design-tokens.md`), contratos API (`API-*`) del Arquitecto, handoffs del Backend (`MOD-*-handoff.md`) y criterios de aceptación del PM.
2. **Scaffold del proyecto:** Crea la estructura de directorios en `outputs/{nombre-proyecto}/src/` según la arquitectura modular definida.
3. **Implementar capas:** Cliente HTTP base → componentes UI/layout → features (components, hooks, services, types) con los 4 estados UI.
4. **Pruebas:** Unit/component tests con React Testing Library + Vitest; E2E opcional para flujos críticos.
5. **Handoff:** Genera `feature-handoffs/FEAT-{Feature}-handoff.md`, `.env.example` e `integration-readme.md`.

## Qué leer según el contexto

| Situación | Archivos a leer |
|-----------|-----------------|
| Nuevo feature, scaffold, arquitectura src/ | [phase-1-identity.md](phase-1-identity.md) + [phase-2-implementation-workflow.md](phase-2-implementation-workflow.md) |
| Tests, DoD, entrega a QA | [phase-3-testing-and-dod.md](phase-3-testing-and-dod.md) |
| Handoff a QA o DevOps | [phase-2-implementation-workflow.md](phase-2-implementation-workflow.md) + [phase-3-testing-and-dod.md](phase-3-testing-and-dod.md) |

## Plantillas obligatorias

Usa estrictamente estas plantillas al generar entregables:

- **Handoff de feature:** [templates/feature-handoff.md](../../templates/feature-handoff.md)
- **Variables de entorno:** [templates/env-requirements.md](../../templates/env-requirements.md)

## Convención de salida

La **fase activa N** está en `STATUS.md`. Los **markdown de este agente** van en `fase-{N}/`. El código UI vive en el repo de la app.

```
outputs/{nombre-proyecto}/
├── README.md
├── STATUS.md
├── comun/              # integration-readme.md, .env.example
├── historial/          # solo append
└── fase-{N}/
    ├── feature-handoffs/FEAT-*.md
    └── quality/
        ├── QR-FE.md
        └── EVIDENCIA-BUG-{NNN}.md   # obligatorio al atender un bug de QA
```

Prohibido: `feature-handoffs/` en la raíz; escribir otra `fase-M`.

Regla persistente: [outputs-por-fase.mdc](../../.cursor/rules/outputs-por-fase.mdc).

| Tipo | Convención ID | Ejemplo |
|------|---------------|---------|
| Handoff de feature | `FEAT-{Feature}` | `FEAT-AUTH-handoff.md` |

## Handoff checklist (DoD Frontend)

Antes de traspasar al QA Tester, verifica:

- [ ] **Diseño Pixel-Fidelidad:** El componente respeta los layouts, espacios, colores y tipografía definidos por el UX/UI Designer.
- [ ] **Responsive Design:** La pantalla se adapta fluidamente a breakpoints móviles (`<640px`), tablets y monitores (`>=1024px`).
- [ ] **Manejo de los 4 Estados UI:** Se implementaron correctamente los estados de Carga (*Loading*), Éxito (*Success*), Datos Vacíos (*Empty*) y Error de Red (*Error*).
- [ ] **Consumo Limpio de APIs:** Los datos se obtienen usando la capa de servicios/hooks, sin código de fetch embebido directamente en la vista.
- [ ] **Validación de Formulario:** Todos los campos de entrada tienen mensajes de error amigables e inline antes de permitir el *submit*.
- [ ] **Accesibilidad Basal:** Sintaxis semántica, uso de `aria-labels` donde sea necesario y navegación navegable mediante teclado (Tab/Enter/Space).
- [ ] **Evidencia de fix (si atendiste un BUG de QA):** `fase-{N}/quality/EVIDENCIA-BUG-{NNN}.md` con archivos, commit o diff y re-prueba local. QA no re-testea sin ese archivo.

## Handoff por rol

| Agente downstream | Entregable |
|-------------------|------------|
| QA Tester | Tests de componente, flujos E2E documentados, comandos de build/dev |
| DevOps | `.env.example`, `env-requirements.md`, comandos de build y despliegue |

## Activación

Para iniciar una sesión frontend, usa el prompt de [templates/activation-prompt.txt](../../templates/activation-prompt.txt).

## Recursos

- [Fase 1: Identidad y principios](phase-1-identity.md)
- [Fase 2: Workflow de implementación y patrones](phase-2-implementation-workflow.md)
- [Fase 3: Testing, DoD y activación](phase-3-testing-and-dod.md)
