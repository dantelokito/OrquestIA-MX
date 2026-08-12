# OrquestIA-MX

Repositorio de **orquestación de agentes de IA** para desarrollar proyectos de software con apoyo de Cursor.

## Propósito

OrquestIA no es una sola aplicación de negocio: es un **ecosistema de roles especializados** (Product Manager, UX/UI, Arquitecto, Backend, Frontend, QA y DevOps) que se activan bajo demanda, se pasan trabajo con handoffs y dejan evidencia en `outputs/{proyecto}/`.

Este monorepo también incluye un **Centro de Trazabilidad**: un visualizador en tiempo real y un formato común de eventos para ver, en español, qué hace cada agente y cómo se conectan entre sí.

## Agentes

| Agente | Carpeta | Rol breve |
|--------|---------|-----------|
| Product Manager | `Administrador de producto/Product Manager` | PRD, historias, alcance |
| UX/UI | `Agente UX UI/Agente UX UI` | Flujos, wireframes, tokens |
| Arquitecto | `Agente Arquitecto de Software/Agente Arquitecto` | API, datos, ADRs |
| Backend | `Agente backend/Agente backend` | Implementación servidor |
| Frontend | `Agente frontend/Agente Frontend` | Interfaz y features |
| QA | `QA Automation Engineer/Agente Tester` | Matrices, E2E, sign-off |
| DevOps | `Agente DevOps/Agente DevOps` | Docker, CI/CD, infra |

Las reglas fuente de cada rol están en `Notas/`.

## Centro de Trazabilidad (nuevo)

Para **seguir el proceso en vivo** y auditar handoffs:

```bash
cd Centro-Trazabilidad
npm install
npm run demo
```

Luego abre `http://localhost:4177`.

Documentación: [`Centro-Trazabilidad/README.md`](Centro-Trazabilidad/README.md).

## Flujo canónico

```text
Cliente
  → PM → UX/UI → Arquitecto
                 → Backend / Frontend
                      → QA → DevOps → Staging/Producción
```

Cada flecha debería dejar un evento `handoff_enviado` / `handoff_recibido` en el Centro de Trazabilidad.

## Proyecto de referencia

En varias carpetas `outputs/laborregamarket/` encontrarás el caso **LaBorregaMarket** (marketplace local de fruterías en Monterrey), usado para validar el flujo de agentes y la demo del visualizador.
