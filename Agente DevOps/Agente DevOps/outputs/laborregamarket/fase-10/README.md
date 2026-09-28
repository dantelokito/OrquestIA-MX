# Fase 10 — DevOps (LaBorregaMarket)

> Merge a GitHub del trabajo local F6–F10. Sin Fase 11. Sin reabrir F8/F9.

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket / BorregaMarket |
| **Alcance DevOps** | Rama `fase-10`, gitignore, `UPLOADS_DIR`, CI existente, merge PR #10 |
| **PR** | https://github.com/dantelokito/BorregaMarket/pull/10 |
| **Merge** | `1132d3a` en `main` (12/09/2026) |
| **Dictamen** | [quality/QR-DEVOPS.md](./quality/QR-DEVOPS.md) |

## Qué se publicó

Código en `C:\Users\PC GAMER\LaBorregaMarket` (ya en `origin/main`):

- Admin seguro, catálogo local + secciones, media en disco, reportes DASH, explorar F8/F9.
- Scripts `dev:lan` / `start:lan` (`next … -p 8080 -H 0.0.0.0`).
- Dependencia `pdfkit` (reportes PDF).
- Migraciones Prisma:
  - `20260818010000_add_user_address_last_used_at`
  - `20260818020000_add_provider_preview_vitrine`
  - `20260828010000_add_product_scope_sections_media` (scope, secciones, `image_url`)

Tras pull de `main`: detener `next dev` en Windows, luego `npx prisma migrate deploy` (y seed solo en entornos que lo permitan).

## Gitignore y secretos

No versionar:

| Patrón | Motivo |
|--------|--------|
| `.env`, `.env.*` (salvo `.env.example`) | JWT, DB, Redis, APIs |
| `/uploads` | Archivos de media (ADR-032) |
| `*.log` | Ruido de `next dev` |
| `.npmrc` | Config local / posibles tokens de registry |
| `*.pem` | Certificados |

Plantilla pública: `.env.example`. F10 sustituye Cloudinary Must por `UPLOADS_DIR="./uploads"`.

## Storage (ADR-032)

- Local: `UPLOADS_DIR` → `./uploads` (fuera de `public/`, ignorado por git).
- API: `GET /api/media/[filename]`.
- Staging/prod: montar **volumen persistente** (bind Docker, VPS, NFS). Incompatible con FS efímero tipo Vercel serverless.
- Este agente **no** provisionó el volumen en la nube en F10.

## CI

Sin workflow nuevo. El existente hace Node 20 → `npm ci` → `prisma generate` → lint → test → build. **Nunca** `next dev` en CI.

DT-F10-001 y DT-F10-002 **no** son P0 de CI (handoff QA → DevOps 12/09). Specs de deuda pueden fallar sin bloquear el merge.

## Qué no hacer ahora

- No reabrir F8/F9 ni abrir `fase-11/`.
- No exigir fallback UUID, copy 20 MB ni `bodySizeLimit` para dar por cerrado este merge.
- No commitear `.env`, `uploads/`, logs ni `.npmrc`.
- No mergear PRs Dependabot (#2–#9) desde este cierre.
