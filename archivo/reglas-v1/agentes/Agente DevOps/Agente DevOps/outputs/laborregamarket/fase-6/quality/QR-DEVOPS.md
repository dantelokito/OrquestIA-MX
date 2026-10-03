# QR-DEVOPS — CI regresión Fase 6 (DEV-P0-002)

> **Proyecto:** LaBorregaMarket  
> **Fase:** 6 — US-OPS-04  
> **Fecha:** 2026-08-23  
> **Agente:** DevOps Cloud Engineer

## Dictamen

**DEV-P0-002: CERRADO**

Workflow `ci.yml` en repo app (`BorregaMarket`):

- Postgres 15 service container
- `npm ci` → `prisma migrate deploy` → `prisma db seed`
- `npm run lint` + `npm test` (vitest)
- `npm run build` + `npm start` en puerto 8080
- Smoke HTTP: `/explorar`, `/api/providers`, login + `reports.pdf` (`%PDF`)
- Playwright F6 focal vía sparse-checkout de suite QA en `OrquestIA-MX`

## Checklist infra-requirements (§ CI F6)

- [x] Servicio postgres:15
- [x] `npm ci` (lockfile incluye `@upstash/redis`)
- [x] `npx prisma migrate deploy`
- [x] `npx prisma db seed` (credenciales test)
- [x] `npm run build` y `npm start` — **no** `next dev`
- [x] Playwright con `CI=true`, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8080`
- [x] Sin exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## Notas

- Suite Playwright no se duplica en app repo; CI clona `QA Automation Engineer/.../tests` desde OrquestIA-MX.
- Requiere acceso del runner a repo `dantelokito/OrquestIA-MX` (público o token).
