# STATUS — LaBorregaMarket (DevOps)

| Campo | Valor |
|-------|--------|
| **Fase activa (producto)** | **14** — PR **listo** (v0.14.0). **No mergeado.** |
| **PR F14** | **Abierto** — [PR #14](https://github.com/dantelokito/BorregaMarket/pull/14) (`feat/f14-panel-proveedor` → `main`) |
| **Rama de release** | `feat/f14-panel-proveedor` (`ca48135`) |
| **QR F14** | [`fase-14/quality/QR-DEVOPS.md`](./fase-14/quality/QR-DEVOPS.md) |
| **Baseline F13** | Histórico — [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) mergeado (`0eda84c`); `fase-13/` solo lectura |
| **Fecha** | 18/09/2026 |

Código: `C:\Users\PC GAMER\LaBorregaMarket` (rama feature; `main` sigue en `0eda84c`). Remoto: [dantelokito/BorregaMarket](https://github.com/dantelokito/BorregaMarket).

**No** se declara producción. **No** se abre Fase 15. **No** se mergeó el PR.

## Lectura mínima

Este archivo + [`fase-14/README.md`](./fase-14/README.md) + [`fase-14/quality/QR-DEVOPS.md`](./fase-14/quality/QR-DEVOPS.md).

## PR F14

| Ítem | Estado |
|------|--------|
| Rama `feat/f14-panel-proveedor` | Pusheada (`ca48135`) |
| CI | Lint/test/build **pass**; Analyze **pass**; CodeQL **pass** |
| Versión producto | **0.14.0** (`package.json`, README, PRODUCT, OBSERVABILITY) |
| QA | APROBADO (`QA-F14-signoff.md`, Playwright 41/41) |
| QG UX / Arch | Presentes (sin deltas) |
| Merge | **Pendiente del humano** |
| Producción | **No declarada** |

## Secretos

Solo nombres en `.env.example`. No se subieron `.env`, `.npmrc`, `*.pem` ni `/uploads`. Cloudinary no Must. Sin env Must nuevas. Excluido del PR: `.gitignore` local, `PriceInput.tsx`, `.cursor/`, `scripts/`.

## Post-merge (humano, cada entorno)

`npx prisma migrate deploy` — migración `20260918010000_f14_inventory_entry_kind`. En Windows, detener `next dev` si Prisma falla por EPERM.
