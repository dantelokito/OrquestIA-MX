# Fase 11 — DevOps (LaBorregaMarket)

> PR listo. **No mergeado.** El humano mergea. No se declara producción.

| Campo | Valor |
|-------|--------|
| **Producto** | LaBorregaMarket / BorregaMarket |
| **Alcance DevOps** | Rama `fase-11`, docs v0.11.0, CI existente, PR #11 |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/11 |
| **Dictamen** | [quality/QR-DEVOPS.md](./quality/QR-DEVOPS.md) |

## Qué incluye la rama

Código en `C:\Users\PC GAMER\LaBorregaMarket` (rama `fase-11`, no `main`):

- User 1:N, cookie `lbm_active_provider`, reportes globales, seed El Paraíso ×2 + Campo Verde.
- Migración `prisma/migrations/20260912160000_drop_provider_userid_unique`.
- Media disco `UPLOADS_DIR` (F10). Cloudinary no Must.
- `package.json` / README / PRODUCT / OBSERVABILITY = **0.11.0**.

Tras merge (humano): detener `next dev` en Windows, `npx prisma migrate deploy`, luego seed solo donde aplique.

## Gitignore y secretos

Sin cambios de política vs F10. No versionar `.env`, `/uploads`, `*.log`, `.npmrc`, `*.pem`. Plantilla: `.env.example` (nombres; sin valores reales).

## CI

Sin YAML nuevo. Job **Lint, test and build**: Node 20 → `npm ci` → `prisma generate` → lint → test → build. Postgres/Playwright F6 **no** están en este workflow.

## Qué no hacer

- No `git push` a `main`/`master`. No mergear este PR desde el agente.
- No reabrir handoff QA F10. No Cloudinary Must. No Redis/CI F6 extra.
