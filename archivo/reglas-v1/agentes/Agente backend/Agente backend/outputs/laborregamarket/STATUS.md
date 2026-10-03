# STATUS — LaBorregaMarket (Backend)

| Campo | Valor |
|-------|-------|
| **Fase activa** | **14** — mejoras panel PROVIDER (datos negocio, merma/ajuste, movimientos, PDF from/to, precio > 0) |
| **Estado** | Must Backend cerrado. Handoffs FE/QA listos. Fase **no** cerrada (QA no signa desde Backend). |
| **QR-BE F14** | [`fase-14/quality/QR-BE.md`](./fase-14/quality/QR-BE.md) |
| **MOD** | [`fase-14/module-handoffs/MOD-INVENTORY-F14-handoff.md`](./fase-14/module-handoffs/MOD-INVENTORY-F14-handoff.md) |
| **JSON FE** | [`fase-14/handoff-frontend.md`](./fase-14/handoff-frontend.md) |
| **Tests** | `npx vitest run` → **401 passed** / 86 files |
| **Rama app** | `feat/f14-panel-proveedor` desde `origin/main` @ `0eda84c` (PR #13). Sin push/merge a `main`. |
| **Fecha** | 17/09/2026 |

Código: `C:\Users\PC GAMER\LaBorregaMarket`. `fase-13/` solo lectura.

`isVerified` intacto al mudar pin (ADR-039). Merma/ajuste aditivos en `InventoryEntry` (ADR-040). Venta POS sigue sin 4xx de stock.
