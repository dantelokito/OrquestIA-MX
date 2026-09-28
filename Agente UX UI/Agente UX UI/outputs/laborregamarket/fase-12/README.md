# Fase 12 — UX/UI: Inventario / almacén

**Estado:** diseño Must listo (14/09) + **QG-correcciones** post-QA APROBADO (15/09/2026).  
**Handoff FE:** [`handoff-frontend-fase-12.md`](./handoff-frontend-fase-12.md) (histórico).  
**QG UX:** [`quality/QG-correcciones.md`](./quality/QG-correcciones.md) — sin deltas de UI/flujo/tokens (BUG-019 Backend).  
Este workspace **no activa** Frontend, Backend, QA ni DevOps y **no promociona** fase.

Fase 11 y anteriores: **solo lectura**.

## User flows

| ID | Archivo |
|----|---------|
| UF-INV-01 | [user-flows/UF-INV-01-modulo-subnav.md](./user-flows/UF-INV-01-modulo-subnav.md) |
| UF-INV-02 | [user-flows/UF-INV-02-entrada-factor-caja.md](./user-flows/UF-INV-02-entrada-factor-caja.md) |
| UF-INV-03 | [user-flows/UF-INV-03-capacidad-alerta.md](./user-flows/UF-INV-03-capacidad-alerta.md) |
| UF-INV-04 | [user-flows/UF-INV-04-listado-estados.md](./user-flows/UF-INV-04-listado-estados.md) |
| UF-INV-05 | [user-flows/UF-INV-05-pos-sin-candado.md](./user-flows/UF-INV-05-pos-sin-candado.md) |
| UF-INV-06 | [user-flows/UF-INV-06-parcial-encargar.md](./user-flows/UF-INV-06-parcial-encargar.md) |
| UF-CAT-12 | [user-flows/UF-CAT-12-barra-catalogo.md](./user-flows/UF-CAT-12-barra-catalogo.md) |
| UF-CAT-13 | [user-flows/UF-CAT-13-miniatura-catalogo.md](./user-flows/UF-CAT-13-miniatura-catalogo.md) |
| UF-POS-12 | [user-flows/UF-POS-12-toggle-imagenes.md](./user-flows/UF-POS-12-toggle-imagenes.md) |

## Wireframes

| ID | Archivo |
|----|---------|
| WF-INV-01 | [wireframes/WF-INV-01-subnav.md](./wireframes/WF-INV-01-subnav.md) |
| WF-INV-02 | [wireframes/WF-INV-02-entrada.md](./wireframes/WF-INV-02-entrada.md) |
| WF-INV-03 | [wireframes/WF-INV-03-ficha-capacidad.md](./wireframes/WF-INV-03-ficha-capacidad.md) |
| WF-INV-04 | [wireframes/WF-INV-04-listado.md](./wireframes/WF-INV-04-listado.md) |
| WF-INV-05 | [wireframes/WF-INV-05-pos-sin-candado.md](./wireframes/WF-INV-05-pos-sin-candado.md) |
| WF-CAT-12-13 | [wireframes/WF-CAT-12-13-fila-catalogo.md](./wireframes/WF-CAT-12-13-fila-catalogo.md) |
| WF-POS-12 | [wireframes/WF-POS-12-cards-toggle.md](./wireframes/WF-POS-12-cards-toggle.md) |
| WF-FRUTERIA-12 | [wireframes/WF-FRUTERIA-12-sin-existencias.md](./wireframes/WF-FRUTERIA-12-sin-existencias.md) |

## DoD UX (sesión)

- Cuatro estados inventario: Empty, Loading, Error, Success (`WF-INV-04`).
- SubNav: Inventario primero; Ventas = `/proveedor/dashboard`; Reportes generales solo N>1.
- CTA entrada; toggle POS ≥44px; `/fruteria` sin barra.

## Inputs Utilizados

- Handoff PM `fase-12/handoff-ux-ui.md`
- PRD, 9 US Must, impacto (workspace PM)
- Tokens/IA `comun/` v0.12.0

## Outputs Generados

- Este índice + UF/WF + handoff Frontend
- `quality/QG-correcciones.md` (BUG-019: sin cambio de diseño)
