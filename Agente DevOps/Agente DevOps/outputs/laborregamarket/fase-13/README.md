# Fase 13 — DevOps (LaBorregaMarket)

> **Mergeado en `main`.** No se declara producción. No se abre Fase 14.

| Campo | Valor |
|-------|--------|
| **Producto** | LaBorregaMarket / BorregaMarket |
| **Alcance DevOps** | Rama `feat/f13-archivo-oferta-unidad`, seguimiento `fase-13`, docs v0.13.0, CI existente, PR #13 |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/13 |
| **Merge** | `0eda84c` — `feat/f13-archivo-oferta-unidad` → `main` |
| **Feature SHA** | `48544e5` |
| **Dictamen** | [quality/QR-DEVOPS.md](./quality/QR-DEVOPS.md) |
| **INFRA** | [infra-handoffs/INFRA-APP-handoff.md](./infra-handoffs/INFRA-APP-handoff.md) |

## Qué incluye `main` (v0.13.0)

Código en `C:\Users\PC GAMER\LaBorregaMarket` (`main`):

- Archivo de oferta, unidad/precio por sucursal, reportes de inventario, admin paginado.
- Fix **BUG-020** (import `inventoryEntrySchema`).
- Migración `prisma/migrations/20260916180000_f13_archivo_oferta_unidad`.
- `package.json` / README / PRODUCT / OBSERVABILITY = **0.13.0**.

Tras clone o pull: `npx prisma migrate deploy`. **No** aplicar en producción desde este agente (producción no declarada).

## Gitignore y secretos

Sin cambios de política vs F12. No versionar `.env`, `/uploads`, `*.log`, `.npmrc`, `*.pem`. Plantilla: `.env.example` (nombres; sin valores reales). Cloudinary no Must. Sin variables Must nuevas.

No se subieron `.cursor/`, `scripts/bootstrap-local.ps1` ni `allowScripts` local de npm.

## CI

Sin YAML nuevo. Job **Lint, test and build**: Node 20 → `npm ci` → `prisma generate` → lint → test → build. Checks del PR en verde antes del merge.

## Qué no hacer

- No reabrir PR #13 ni F12. No mezclar dependabot en este cierre.
- No abrir Fase 14. No declarar el producto en producción.
