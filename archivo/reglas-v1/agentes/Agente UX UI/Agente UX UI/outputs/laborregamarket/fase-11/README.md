# Fase 11 — UX/UI: 1 proveedor → N fruterías

**Estado:** diseño Must listo + **QG-correcciones** post-QA APROBADO (12/09/2026).  
**Handoff FE:** [`handoff-frontend-fase-11.md`](./handoff-frontend-fase-11.md) (histórico).  
**QG UX:** [`quality/QG-correcciones.md`](./quality/QG-correcciones.md).  
Este workspace **no activa** Frontend ni DevOps.

Fase 10 y anteriores: **solo lectura**.

## User flows

| ID | Archivo |
|----|---------|
| UF-HEADER-01 | [user-flows/UF-HEADER-01-switcher-fruteria.md](./user-flows/UF-HEADER-01-switcher-fruteria.md) |
| UF-ISO-01 | [user-flows/UF-ISO-01-aislamiento.md](./user-flows/UF-ISO-01-aislamiento.md) |
| UF-DASH-11 | [user-flows/UF-DASH-11-reportes-globales.md](./user-flows/UF-DASH-11-reportes-globales.md) |
| UF-ONB-01 | [user-flows/UF-ONB-01-alta-sucursal.md](./user-flows/UF-ONB-01-alta-sucursal.md) |
| UF-SEED-01 | [user-flows/UF-SEED-01-login-demo.md](./user-flows/UF-SEED-01-login-demo.md) |
| UF-ADMIN-11 | [user-flows/UF-ADMIN-11-filas-sucursal.md](./user-flows/UF-ADMIN-11-filas-sucursal.md) |
| UF-EXPLORE-11 | [user-flows/UF-EXPLORE-11-tarjeta-provider.md](./user-flows/UF-EXPLORE-11-tarjeta-provider.md) |

## Wireframes

| ID | Archivo |
|----|---------|
| WF-HEADER-01 | [wireframes/WF-HEADER-01-switcher.md](./wireframes/WF-HEADER-01-switcher.md) |
| WF-ISO-01 | [wireframes/WF-ISO-01-contexto-sucursal.md](./wireframes/WF-ISO-01-contexto-sucursal.md) |
| WF-DASH-11 | [wireframes/WF-DASH-11-reportes-globales.md](./wireframes/WF-DASH-11-reportes-globales.md) |
| WF-ONB-01 | [wireframes/WF-ONB-01-nueva-fruteria.md](./wireframes/WF-ONB-01-nueva-fruteria.md) |
| WF-SEED-01 | [wireframes/WF-SEED-01-login-demo.md](./wireframes/WF-SEED-01-login-demo.md) |
| WF-ADMIN-11 | [wireframes/WF-ADMIN-11-filas-sucursal.md](./wireframes/WF-ADMIN-11-filas-sucursal.md) |
| WF-EXPLORE-11 | [wireframes/WF-EXPLORE-11-cards-provider.md](./wireframes/WF-EXPLORE-11-cards-provider.md) |

## Visibilidad

N = número de `Provider` del user. No es flag admin.  
N=1: chrome y Reportes F10 intactos. N>1: switcher + módulo Reportes generales.

## Inputs Utilizados

- Handoff PM `fase-11/handoff-ux-ui.md`
- PRD, 8 US, impacto, seed (workspace PM)
- Tokens/IA `comun/` v0.11.0

## Outputs Generados

- Este índice + UF/WF + handoff Frontend
- `quality/QG-correcciones.md` (BUG-017 / BUG-018)
