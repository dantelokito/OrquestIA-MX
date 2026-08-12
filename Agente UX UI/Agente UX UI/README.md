# Agente UX/UI Designer

Repositorio del **Agente UX/UI Designer** del ecosistema de agentes de desarrollo. Transforma historias de usuario y requerimientos del PM en experiencias digitales intuitivas, accesibles y viables técnicamente.

## Rol en el ecosistema

```
Cliente / Stakeholder
        │
        ▼
  Agente PM
        │
        ▼
  Agente UX/UI (este repo)
        │
        ├──► Frontend         (wireframes, design tokens, breakpoints)
        └──► Arquitecto       (accesibilidad, lazy loading, assets)
```

## Inputs del PM

Este agente consume los entregables del [Agente Product Manager](../Administrador%20de%20producto/Product%20Manager/):

- PRD y Historias de Usuario con Criterios de Aceptación
- Branding del cliente (si existe)
- Restricciones técnicas del Arquitecto o Frontend

## Cómo invocar el agente

El agente se activa **bajo demanda**. Dos formas de usarlo en Cursor:

1. **Skill:** Menciona `@ux-ui-designer` o pide explícitamente "actúa como diseñador UX/UI".
2. **Prompt de activación:** Copia y pega el contenido de [`templates/activation-prompt.txt`](templates/activation-prompt.txt), completando el contexto del proyecto.

## Flujo de trabajo

1. **User Flow** — Mapeo del camino del usuario desde entrada hasta objetivo cumplido.
2. **Arquitectura de Información** — Organización jerárquica de menús, encabezados y CTAs.
3. **Wireframes** — Maquetas esquemáticas en Markdown ([`templates/wireframe-layout.md`](templates/wireframe-layout.md)).
4. **Design Tokens** — Paleta, tipografía, espaciado y estados de componentes.
5. **Handoff** — Traspaso a Frontend y Arquitecto tras validar el checklist DoD.

## Estructura del repositorio

```
.cursor/skills/ux-ui-designer/
├── SKILL.md                    # Punto de entrada del skill
├── phase-1-identity.md         # Identidad, principios, I/O, tono
├── phase-2-design-workflow.md  # Workflow UX, plantillas, handoff Frontend
└── phase-3-design-system.md    # Design tokens, DoD, activación

templates/
├── user-flow.md                # Plantilla A: User Flow
├── wireframe-layout.md         # Plantilla B: Wireframe Layout
└── activation-prompt.txt       # Prompt de activación directa

outputs/                        # Entregables generados por proyecto
└── {nombre-proyecto}/
    ├── user-flows/
    ├── wireframes/
    └── design-tokens.md
```

## Convención de salida

Los artefactos generados se guardan en `outputs/{nombre-proyecto}/` usando kebab-case (ej. `outputs/tienda-online/`).

| Tipo | Convención ID | Ejemplo |
|------|---------------|---------|
| User Flow | `UF-{Module}-{Number}` | `UF-AUTH-01.md` |
| Wireframe | `WF-{Module}-{Number}` | `WF-AUTH-01.md` |

## Principios de diseño

- **User-First:** Toda decisión responde a una necesidad real del usuario.
- **Claridad cognitiva:** Jerarquía visual clara, CTAs evidentes, flujos directos.
- **Design System Driven:** Componentes reutilizables para facilitar implementación Frontend.
- **WCAG 2.1 AA:** Contrastes, tipografía legible, navegación por teclado.
- **Mobile-First:** Diseño progresivo desde móvil hacia escritorio.
