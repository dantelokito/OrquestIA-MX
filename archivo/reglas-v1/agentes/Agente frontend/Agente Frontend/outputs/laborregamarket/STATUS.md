# STATUS — LaBorregaMarket (Frontend)

> Actualizar este archivo en cada handoff. Sustituye leer la bitácora completa.

| Campo | Valor |
|-------|-------|
| **Fase activa (producto)** | **14** — Mejoras panel PROVIDER (Perfil, merma, series, PDF from/to) |
| **Implementación F14** | FEAT-PROF-14 / FEAT-CAT-14 / FEAT-INV-14 / FEAT-DASH-14 |
| **Quality Gate F14** | `fase-14/quality/QR-FE.md` (90/100, 0 P0) |
| **Fecha** | 17/09/2026 |
| **Rama app** | `feat/f14-panel-proveedor` (baseline Backend `92cced6` + UI F14) |

## Estado documental

JSON real: `Agente backend/.../fase-14/handoff-frontend.md` + MOD-INVENTORY / SETTINGS / OFFER-SECTIONS / REPORTS. UX: `handoff-frontend-fase-14.md`. Tests: `npx vitest run` → **409 passed / 87 files**. QA **no** se lanza desde este workspace.

| Carpeta | Estado |
|---------|--------|
| `comun/` | integration-readme con flujos F14 |
| `fase-1/` … `fase-13/` | Solo lectura |
| `fase-14/` | FEAT + QR-FE |
| `historial/` | Append F14 |

## Qué no hacer ahora

- No push/merge a `main`.
- No pintar existencias en `/fruteria`, kardex de ventas, Cloudinary, grain, ni rediseñar Explorar.
- No mezclar suciedad local (`.gitignore`, `PriceInput.tsx`, `.cursor/`, `scripts/`).

## Lectura mínima

`README.md` + este archivo + `comun/` + `fase-14/`.

Código: `C:\Users\PC GAMER\LaBorregaMarket`.
