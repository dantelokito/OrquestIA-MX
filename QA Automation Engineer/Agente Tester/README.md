# Agente QA / Tester Senior

Repositorio del **Agente QA / Tester Senior** del ecosistema de agentes de desarrollo. Audita requerimientos, contratos API y entregables de Backend/Frontend; diseña matrices de prueba, reporta defectos, automatiza regresión con Playwright y emite sign-off de calidad.

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
        ▼                         │
  Agente Arquitecto ──────────────┘
        │
        ├──────────────► Agente Backend
        │                      │
        └──────────────► Agente Frontend
                               │
                               ▼
                    Agente QA (este repo)
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
              Agente PM              DevOps
           (QA Sign-off)         (env staging, CI)
```

## Inputs upstream

Este agente consume los entregables de:

- [Agente Product Manager](../../Administrador%20de%20producto/Product%20Manager/): PRD, Historias de Usuario con Criterios de Aceptación Given-When-Then
- [Agente Arquitecto de Software](../../Agente%20Arquitecto%20de%20Software/Agente%20Arquitecto/): Contratos API (`API-*`), esquemas de BD (`DB-*`), ADRs
- [Agente Backend Developer](../../Agente%20backend/Agente%20backend/): Handoffs de módulo (`MOD-*-handoff.md`), tests unit/integration, `.env.example`
- [Agente Frontend Developer](../../Agente%20frontend/Agente%20Frontend/): Handoffs de feature (`FEAT-*-handoff.md`), flujos críticos UI, comandos build/dev/test

## Cómo invocar el agente

El agente se activa **bajo demanda**. Dos formas de usarlo en Cursor:

1. **Skill:** Menciona `@qa-tester-senior` o pide explícitamente "actúa como QA tester senior".
2. **Prompt de activación:** Copia y pega el contenido de [`templates/activation-prompt.txt`](templates/activation-prompt.txt), completando el contexto del proyecto, artefacto a auditar y ambiente.

## Flujo de trabajo

1. **Shift-Left** — Auditar ACs del PM y contratos `API-*` antes de diseñar pruebas; rechazar historias ambiguas.
2. **Diseño de matriz** — Casos positivos, negativos, edge cases y seguridad en `test-matrices/TC-{Module}-matrix.md`.
3. **Ejecución** — Pruebas manuales/exploratorias en staging/QA con datos documentados.
4. **Reporte de bugs** — Defectos en `bug-reports/BUG-{NNN}.md` con pasos de reproducción y evidencia.
5. **Automatización** — Scripts Playwright (API + E2E con POM) en `tests/`.
6. **Sign-off** — Dictamen formal en `qa-signoffs/QA-{Module}-signoff.md` compartido con el PM.

## Estructura del repositorio

```
.cursor/skills/qa-tester-senior/
├── SKILL.md                              # Punto de entrada del skill
├── phase-1-identity.md                   # Identidad, principios, I/O, inputs upstream
├── phase-2-test-design-and-automation.md # Matriz, bugs, Playwright API/E2E
└── phase-3-quality-gates-and-dod.md      # Quality gates, DoD, sign-off

templates/
├── activation-prompt.txt                 # Prompt de activación directa
├── test-case.md                          # Plantilla de caso de prueba individual
├── test-matrix.md                        # Matriz de casos por módulo
├── bug-report.md                         # Reporte estandarizado de defecto
├── qa-signoff.md                         # Dictamen de liberación
└── env-requirements.md                   # Variables de ambiente QA/staging

outputs/                                  # Artefactos generados por proyecto
└── {nombre-proyecto}/
    ├── test-matrices/
    ├── bug-reports/
    ├── qa-signoffs/
    └── tests/
        ├── api/
        └── e2e/
            └── pages/
```

## Convención de salida

Los artefactos generados se guardan en `outputs/{nombre-proyecto}/` usando kebab-case (ej. `outputs/tienda-online/`).

| Tipo | Convención ID | Ejemplo |
|------|---------------|---------|
| Caso de prueba | `TC-{Module}-{NNN}` | `TC-AUTH-001` |
| Matriz | `TC-{Module}-matrix` | `TC-AUTH-matrix.md` |
| Bug | `BUG-{NNN}` | `BUG-001.md` |
| Sign-off | `QA-{Module}-signoff` | `QA-AUTH-signoff.md` |

## Principios de QA

- **Shift-Left Testing:** La prueba comienza auditando ACs y contratos API, no cuando el código está terminado.
- **Pirámide de Automatización:** Unit (Devs) → API/Integration (QA) → E2E (QA, flujos críticos).
- **Cero Asunciones:** Desviaciones vs ACs o OpenAPI se reportan como defecto o ambigüedad de negocio.
- **Reproducibilidad Rigurosa:** Todo bug incluye pasos exactos, test data, ambiente, logs y expected vs actual.

## Stack de automatización default

**Playwright + TypeScript** para pruebas API y E2E. Patrón Page Object Model (POM) para desacoplar selectores UI.

Aserciones API obligatorias: HTTP status, esquema JSON vs OpenAPI, estructura del payload, tiempo de respuesta (< 500ms en staging).

## Quality gates (resumen)

| Gate | Criterio |
|------|----------|
| Zero Blocker Policy | Sin bugs `Blocker` ni `Critical` abiertos |
| Cobertura happy path | 100% de casos ejecutados |
| Cobertura edge/negativos | Mínimo 85% ejecutados |
| Regresión automatizada | 100% pass en staging/QA |

Dictamen posible: **APROBADO** / **RECHAZADO** / **APROBADO CON CONDICIONES**

## Handoff downstream

| Agente | Entregable |
|--------|------------|
| PM | `QA-{Module}-signoff.md` |
| DevOps | `env-requirements.md`, comandos CI Playwright |
| Backend / Frontend | `bug-reports/BUG-{NNN}.md` para re-probar fixes |
