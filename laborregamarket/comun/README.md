# Documentos vivos — índice

Estado vigente del producto. Lee **solo la sección** que tu tarea necesita: busca el encabezado y lee desde ahí. No leas estos archivos completos.

| Archivo | Dueño | Secciones clave |
|---------|-------|-----------------|
| `backlog.md` (~39 KB) | PM | `## Fase 14 - Mejoras y deuda panel PROVIDER (BL-230+)`, `## Orden de ejecución recomendado`, `## Leyenda` |
| `sad.md` (~33 KB) | Arch | `## 3. Stack`, `## 5. Módulos`, `## 7. Modelo de datos`, `## 8. Contratos API`, `## 9. Seguridad`, `## 10. Decisiones (ADRs)` |
| `adrs/ADR-*.md` | Arch | Un archivo por decisión (001–041). Lee solo el ADR que citas |
| `design-tokens.md` (~59 KB) | UX | `## 1. Paleta`, `## 2. Tipografía`, `## 3. Espaciado`, `## 5. Breakpoints`, `## 6. Componentes` (6b–6i por fase), `## 8. Accesibilidad`, `## 9. Referencia Tailwind` |
| `information-architecture.md` (~19 KB) | UX | `## 2. Mapa de rutas por rol`, `## 3. SubNavProveedor`, `## 7. CTAs dominantes` |
| `infra-requirements.md` (~16 KB) | Arch/DevOps | `## Runtime`, `## Variables de entorno`, `## Base de datos`, `## Despliegue sugerido` |
| `integration-readme.md` | FE | `## Comandos`, `## Variables de entorno`, rutas y flujos por fase |
| `.env.example` | FE/BE | Nombres de variables (sin secretos) |
| `env-requirements.md` | QA | Variables QA, prerrequisitos locales, seeds |
| `TEST_PLAN.md` (~15 KB) | QA | `## 7. Criterios de entrada / salida`, `## 8. Quality gates` |
| `brand/` | PM | Assets del loader (no leer, solo referenciar) |

## Reglas

- Un documento = un estado vigente. No crear copias versionadas (`*-v0.9.0.md`); el historial está en git.
- Al cambiar algo, edita la sección correspondiente y anota una línea de delta en tu archivo de fase (`fase-N/{rol}.md` → `Verificación`).
- Suite Playwright viva: `../tests/` (código, no documento de fase).
