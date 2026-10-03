# STATUS — LaBorregaMarket (Arquitecto)

> Actualizar este archivo en cada handoff.

| Campo | Valor |
|-------|-------|
| **Fase activa (producto)** | **14** — Perfil PROVIDER, merma aditiva, series pintadas, PDF `from`/`to` |
| **Arquitectura F14** | QG-correcciones 18/09: **sin deltas** (QA APROBADO, zero bugs). Espera PM. **No promover.** |
| **Fase 13** | **Solo lectura.** QG-correcciones 16/09 histórico. PR #13 en `main` (`0eda84c`). No reabrir US F13 |
| **Fase 12** | **Solo lectura.** QG-correcciones 15/09 histórico. No reabrir US F12 |
| **Fase 11** | **Solo lectura.** Contratos 12/09/2026. No reabrir US F11 |
| **Fase 10** | **Solo lectura.** Contratos 28/08/2026. No reabrir US F10 |
| **Fase 9** | **Solo lectura.** Contratos 25/08/2026. No reabrir US F9 |
| **Fase 8** | **Solo lectura.** Contratos 24/08/2026. No reabrir US F8 |
| **Fase 7** | **Solo lectura.** Contratos 18/08/2026. No reabrir US F7 |
| **Fase 6** | **Congelada** (solo lectura) |
| **Fecha** | 18/09/2026 |

## Qué sigue

| Agente | Acción |
|--------|--------|
| **Arquitecto** | QG F14 emitido ([`fase-14/quality/QG-correcciones.md`](./fase-14/quality/QG-correcciones.md)). **Espera PM.** **No promover.** |
| Backend | F14 implementado; sin cola de bugs. No reabrir |
| UX | Debe emitir su `QG-correcciones.md` (paralelo). Arquitecto no actúa por UX |
| Frontend | F14 implementado; sin cola de bugs. No reabrir |
| **PM** | Cierra fase cuando exista también QG UX. Arquitecto **no** promueve |
| DevOps | **No lanzar** desde Arquitecto. Sin env nueva |

## Lectura mínima

Este archivo + [`fase-14/README.md`](./fase-14/README.md) + [`comun/sad.md`](./comun/sad.md).

`fase-13/` solo lectura. Sin Cloudinary. Sin `/api/v1/` (ADR-002). `isAvailable` intacto (ADR-022). `isVerified` intacto al mudar pin (ADR-039). Inventario blando en **venta** (ADR-036). Merma/ajuste en `InventoryEntry.kind` (ADR-040).
