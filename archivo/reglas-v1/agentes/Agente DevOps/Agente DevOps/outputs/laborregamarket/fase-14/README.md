# Fase 14 — DevOps (LaBorregaMarket)

> PR **listo**. **No mergeado.** El humano mergea. No se declara producción. No se abre Fase 15.

| Campo | Valor |
|-------|--------|
| **Producto** | LaBorregaMarket / BorregaMarket |
| **Alcance DevOps** | Rama `feat/f14-panel-proveedor`, docs v0.14.0, CI existente, PR #14 |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/14 |
| **SHA** | `ca48135` (docs 0.14.0 + fix href CodeQL; UI `9f5b875` / BE `92cced6`) |
| **Dictamen** | [quality/QR-DEVOPS.md](./quality/QR-DEVOPS.md) |
| **INFRA** | [infra-handoffs/INFRA-APP-handoff.md](./infra-handoffs/INFRA-APP-handoff.md) |

## Qué incluye la rama

Código en `C:\Users\PC GAMER\LaBorregaMarket` (rama **feature**, no `main`):

- Perfil PROVIDER, catálogo/POS sin identidad, merma/ajuste aditivos, series SVG, PDF `from`/`to`.
- Migración `prisma/migrations/20260918010000_f14_inventory_entry_kind`.
- `package.json` / README / PRODUCT / OBSERVABILITY = **0.14.0**.
- Roadmap: F14 Must = mejoras panel PROVIDER. «Canales y monetización» queda posterior / Won't actual.

Tras merge (humano): `npx prisma migrate deploy`. **No** aplicar en producción desde este agente (producción no declarada).

## Gitignore y secretos

Sin cambios de política vs F13. No versionar `.env`, `/uploads`, `*.log`, `.npmrc`, `*.pem`. Plantilla: `.env.example` (nombres; sin valores reales). Cloudinary no Must. Sin variables Must nuevas. Media disco F10 (`UPLOADS_DIR`).

No se subieron `.gitignore` local, `src/components/provider/PriceInput.tsx`, `.cursor/` ni `scripts/`.

## CI

Sin YAML nuevo. Job **Lint, test and build**: Node 20 → `npm ci` → `prisma generate` → lint → test → build. Sin `/api/health` Must. Sin Dockerfile nuevo (mismo patrón F11–F13).

## Qué no hacer

- No `git push` a `main`/`master`. No mergear este PR desde el agente.
- No mezclar dependabot. No reabrir F13 / PR #13.
- No abrir Fase 15. No declarar el producto en producción.
