# F15 · DevOps — PR 0.15.0 listo

Fecha: 2026-10-07 · Insumo: `fase-15/be.md`, `fase-15/fe.md` y `fase-15/qa.md` (solo Verificación; Ruteo A)

## Entregables

- Versión **0.15.0** en `package.json`, `package-lock.json` (solo el campo de versión), `README.md`, `PRODUCT.md` y `OBSERVABILITY.md`. Commit `a4fae9b` en `feat/f15-legal-cache`.
- PR: https://github.com/dantelokito/BorregaMarket/pull/15 hacia `main`. Sin push a `main` y sin merge.
- Checks en verde: Lint, test and build; CodeQL; Analyze (javascript-typescript).
- Migraciones: `20261003000000_f15_legal_module_enum`, `20261003000100_f15_legal_consent`.
- Post-merge: `npx prisma migrate deploy` y `npm run db:seed:legal`.
- Nombres en `.env.example`: `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SRC`, `PUBLIC_CACHE_DISABLED`. No se subió `.env`, `.npmrc`, `*.pem` ni `uploads`.
- Fuera del PR: `.cursor/` y `scripts/` de arranque local. `.gitignore` solo añade `/public/sw.js` y `/public/swe-worker-*.js` (Serwist, ADR-043).

## Para el siguiente rol

- Humano: merge del PR #15.
- Los textos legales del seed son borrador. No se declara producción hasta que un abogado mexicano los revise.
- Después del merge, en el entorno destino: `npx prisma migrate deploy` y luego `npm run db:seed:legal`.
- Umami no carga si `NEXT_PUBLIC_UMAMI_WEBSITE_ID` y `NEXT_PUBLIC_UMAMI_SRC` van vacías. `PUBLIC_CACHE_DISABLED=1` apaga la caché pública.
- El lockfile no incluye el bump ajeno de Serwist 9.5.13; la versión 0.15.0 sí está en el lockfile.

## Pendientes

- Merge del PR #15 — Humano.
- Revisión legal de los textos del seed antes de producción — Humano.

## Verificación

- `npm install` — exit 0 (postinstall generó Prisma Client v6.19.3).
- `npx prisma generate` — exit 0. Se detuvo el `node` que escuchaba en el puerto 8080 para evitar EPERM.
- `npx prisma migrate status` — exit 0. 14 migraciones; el esquema local está al día.
- `npm run lint` — exit 0 (warnings previos; 0 errores).
- `npm test` — exit 0. 89 archivos, 446 tests.
- `npm run build` — exit 0 (Next.js 15.5.22; Serwist empaquetó `/sw.js`).
- `gh pr checks` #15 — exit 0. Los tres checks en pass.
- `graphify update .` — una vez en el repo de la app.

## Bugs

Ninguno.

## Fixes

Ninguno.
