# Fase 12 — DevOps (LaBorregaMarket)

> PR listo. **No mergeado.** El humano mergea. No se declara producción.

| Campo | Valor |
|-------|--------|
| **Producto** | LaBorregaMarket / BorregaMarket |
| **Alcance DevOps** | Rama `feat/f12-inventario-blando`, docs v0.12.0, CI existente, PR #12 |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/12 |
| **SHA** | `8446245` |
| **Dictamen** | [quality/QR-DEVOPS.md](./quality/QR-DEVOPS.md) |
| **INFRA** | [infra-handoffs/INFRA-APP-handoff.md](./infra-handoffs/INFRA-APP-handoff.md) |

## Qué incluye la rama

Código en `C:\Users\PC GAMER\LaBorregaMarket` (rama **feature**, no `main`):

- Inventario blando Decimal (`on_hand`), umbral, capacidad, factor caja.
- APIs `/api/provider/inventory`, UI `/proveedor/inventario`, POS/catálogo.
- Migración `prisma/migrations/20260915010000_f12_inventario_blando`.
- `package.json` / README / PRODUCT / OBSERVABILITY = **0.12.0**.

Tras merge (humano): `npx prisma migrate deploy`.

## Gitignore y secretos

Sin cambios de política vs F11. No versionar `.env`, `/uploads`, `*.log`, `.npmrc`, `*.pem`. Plantilla: `.env.example` (nombres; sin valores reales). Cloudinary no Must.

## CI

Sin YAML nuevo. Job **Lint, test and build**: Node 20 → `npm ci` → `prisma generate` → lint → test → build.

## Qué no hacer

- No `git push` a `main`/`master`. No mergear este PR desde el agente.
- No mezclar con PR #11. No abrir Fase 13.
