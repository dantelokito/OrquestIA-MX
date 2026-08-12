# Agente Desarrollador Backend Senior

Repositorio del **Agente Desarrollador Backend Senior** del ecosistema de agentes de desarrollo. Transforma contratos de API, esquemas de BD e historias de usuario del Arquitecto y PM en código sólido, seguro, escalable y listo para QA y Frontend.

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
  Agente Backend (este repo)
        │
        ├──► Frontend         (endpoints, JSON, errores HTTP)
        ├──► QA Tester        (tests, casos límite)
        └──► DevOps           (.env, migraciones, seeds)
```

## Inputs upstream

Este agente consume los entregables de:

- [Agente Arquitecto de Software](../../Agente%20Arquitecto%20de%20Software/Agente%20Arquitecto/): Contratos API (`API-*`), esquemas de BD (`DB-*`), ADRs, requerimientos de seguridad
- [Agente Product Manager](../../Administrador%20de%20producto/Product%20Manager/): PRD, Historias de Usuario con Criterios de Aceptación

## Cómo invocar el agente

El agente se activa **bajo demanda**. Dos formas de usarlo en Cursor:

1. **Skill:** Menciona `@backend-developer` o pide explícitamente "actúa como desarrollador backend senior".
2. **Prompt de activación:** Copia y pega el contenido de [`templates/activation-prompt.txt`](templates/activation-prompt.txt), completando el contexto del proyecto y el stack técnico.

## Flujo de trabajo

1. **Análisis de Contratos** — Mapeo de endpoints y entidades de BD desde entregables del Arquitecto.
2. **Scaffold de Módulo** — Estructura Clean Architecture en `outputs/{nombre-proyecto}/src/`.
3. **Implementación por Capas** — DTOs, Repository, Service, Controller, Routes y migraciones.
4. **Pruebas** — Unit tests para servicios; integration tests para endpoints HTTP.
5. **Handoff** — Documentación de integración, `.env.example` y checklist DoD por módulo.

## Estructura del repositorio

```
.cursor/skills/backend-developer/
├── SKILL.md                          # Punto de entrada del skill
├── phase-1-identity.md               # Identidad, principios, I/O, inputs upstream
├── phase-2-implementation-workflow.md # Workflow, estructura src/, patrones, handoff
└── phase-3-testing-and-dod.md        # Testing, DoD, activación

templates/
├── activation-prompt.txt             # Prompt de activación directa
├── module-handoff.md                 # Checklist por módulo entregable
├── env-requirements.md               # Variables .env para DevOps
└── integration-readme.md             # README de integración por proyecto

outputs/                              # Código generado por proyecto
└── {nombre-proyecto}/
    ├── src/
    ├── tests/
    ├── .env.example
    ├── integration-readme.md
    └── module-handoffs/
```

## Convención de salida

Los artefactos generados se guardan en `outputs/{nombre-proyecto}/` usando kebab-case (ej. `outputs/tienda-online/`).

| Tipo | Convención ID | Ejemplo |
|------|---------------|---------|
| Handoff de módulo | `MOD-{Module}` | `MOD-AUTH-handoff.md` |

## Principios de desarrollo

- **Clean Architecture & SOLID:** Separación clara entre Controladores, Servicios, Repositorios y Modelos.
- **Security by Design:** Validación de entradas, hashing seguro (Argon2/bcrypt), secrets en `.env`.
- **Manejo Centralizado de Errores:** Respuestas HTTP estructuradas con códigos de estado relevantes.
- **Optimización de BD:** Sin N+1 queries; paginación obligatoria en listados; ORM con consultas preparadas.
- **Stack agnóstico:** El stack se declara en el prompt de activación (Express, NestJS, Prisma, etc.).

## Formato de respuestas API

Todas las respuestas siguen el contrato unificado definido por el Agente Arquitecto:

- **Éxito:** `{ success, data, message, meta? }`
- **Error:** `{ success, error: { code, message, details? }, timestamp }`

Ver detalle en [phase-2-implementation-workflow.md](.cursor/skills/backend-developer/phase-2-implementation-workflow.md).
