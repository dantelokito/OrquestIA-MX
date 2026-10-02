# QR-BE — Autoevaluación Backend Fase 6

> **Producto:** LaBorregaMarket v0.6.1  
> **Agente:** Backend Developer  
> **Fecha:** 16/08/2026  
> **Alcance:** Slice A deuda (Redis/503/migrate/RBAC tests) + Slice B reportes JSON/PDF. GEO query F4 intacta.

## Score

**96 / 100** — listo para Quality Gate del Arquitecto.

## Cumplimiento DoD arquitectura

| Criterio | Estado |
|----------|--------|
| `@upstash/redis` en lockfile; import estático (DEV-P0-001) | OK (ya estaba; test de import) |
| Contacto prod sin Upstash → 503 envelope, no 500 (DEV-P1-005) | OK |
| 429 no crea contacto extra ni encola Inngest | OK |
| `db:migrate:deploy` = `prisma migrate deploy`; sin schema nuevo (DEV-P1-003) | OK |
| `GET /api/provider/reports` tres granos + empty `"0.00"` | OK |
| Periodo futuro / query inválida → 400 | OK |
| 401/403 en JSON y PDF (DEV-P2-011) | OK |
| PDF 200 `application/pdf` (también vacío); pdfkit, no Chromium | OK |
| Dashboard rolling F3 sin delta | OK |
| GEO / bbox / Leaflet / CI YAML / `/health` / pasarela | OK (cero cambio) |
| Envelope 400/401/403/429/503/500 | OK |

## Pruebas

`npx vitest run` — **166** tests, **38** files, todos passing.

## Huecos conscientes (no P0)

- `prisma generate` en Windows falla si `next dev` tiene el DLL del query engine bloqueado. Parar el server antes de migrate/generate.
- `db:migrate` local sigue siendo `prisma migrate dev`; deploy es el script nuevo `db:migrate:deploy`.
- Inngest/Upstash/WhatsApp no smoke en staging (keys DevOps) — arrastre F4.
- QR-BE F3 sigue ausente (OBS-F3-023); no se fabrica.
- CI GitHub Actions (DEV-P0-002) es DevOps.

## Fuera de alcance BE

Print CSS (`US-DASH-05`), zoom↔radio/loader GEO (`US-GEO-07/08`), YAML CI, `/health`, secretos/JWT por entorno, bbox Must, CSV/email/CFDI, pasarela.
