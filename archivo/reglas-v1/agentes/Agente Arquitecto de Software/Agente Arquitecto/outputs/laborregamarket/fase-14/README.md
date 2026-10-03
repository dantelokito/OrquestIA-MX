# Fase 14 — Perfil proveedor, merma aditiva, series y PDF rango (diseño)

Índice Arquitecto. **Fase activa = 14.** `fase-13/` y anteriores solo lectura.

## Contratos API

| ID | Archivo |
|----|---------|
| SETTINGS datos negocio | [`api/API-PROVIDER-SETTINGS-14.md`](./api/API-PROVIDER-SETTINGS-14.md) |
| PERFIL (sin semántica nueva) | [`api/API-PROVIDER-PROFILE-14.md`](./api/API-PROVIDER-PROFILE-14.md) |
| PRECIO vendible | [`api/API-PROVIDER-OFFER-14.md`](./api/API-PROVIDER-OFFER-14.md) |
| SECCIÓN 409 | [`api/API-PROVIDER-SECTIONS-14.md`](./api/API-PROVIDER-SECTIONS-14.md) |
| MERMA / AJUSTE / MOV | [`api/API-INVENTORY-14.md`](./api/API-INVENTORY-14.md) |
| REPORTES / PDF | [`api/API-PROVIDER-REPORTS-14.md`](./api/API-PROVIDER-REPORTS-14.md) |

## Modelo

- [`data-model/DB-inventory-entries.md`](./data-model/DB-inventory-entries.md)
- [`data-model/DB-providers.md`](./data-model/DB-providers.md)
- [`diagrams/ARCH-INV-14.md`](./diagrams/ARCH-INV-14.md)
- [`diagrams/ARCH-PROF-14.md`](./diagrams/ARCH-PROF-14.md)

## ADR / handoff

- [`../comun/adrs/ADR-039-isverified-coords.md`](../comun/adrs/ADR-039-isverified-coords.md)
- [`../comun/adrs/ADR-040-merma-aditiva.md`](../comun/adrs/ADR-040-merma-aditiva.md)
- [`../comun/adrs/ADR-041-graficas-svg.md`](../comun/adrs/ADR-041-graficas-svg.md)
- [`handoff-backend-fase-14.md`](./handoff-backend-fase-14.md)
- [`quality/checklist-recepcion-f14.md`](./quality/checklist-recepcion-f14.md)
- [`quality/QG-correcciones.md`](./quality/QG-correcciones.md) — post-QA **18/09**: **sin deltas** de contrato/ADR/datos (zero bugs)

QG-correcciones post-QA: **emitido**. Espera PM. No promover. No reabrir F13.

## Decisiones

- Merma/ajuste: `InventoryEntry.kind` (no tabla `InventoryMovement`).
- Gráficas: SVG unificado (no librería npm).
- `isVerified` intacto al mudar pin (riesgo documentado).
