# QR-BE — Autoevaluación Backend Fase 7

> **Producto:** LaBorregaMarket v0.7.1  
> **Agente:** Backend Developer  
> **Fecha:** 18/08/2026  
> **Alcance:** Favoritas last-used, preview vitrina, GEO clamp/total/`q`, cookie ADR-025.

## Score

**95 / 100** — listo para Quality Gate del Arquitecto.

## Cumplimiento DoD arquitectura

| Criterio | Estado |
|----------|--------|
| `POST .../addresses/[id]/use` + `lastUsedAt`; PATCH no stamp | OK |
| RBAC CLIENT 401/403 en `/use` (DEV-P2-011) | OK |
| Preview: flags, horario Zod, `isOpenNow` TZ Monterrey | OK |
| ADMIN `verifiedAt` al verificar + backfill SQL | OK |
| Clamp `radiusKm` 1–25; `meta.total` ≠ `data.length` | OK |
| `q` unión nombre/descripcion ∪ producto vendible (name/slug) | OK |
| Cookie HttpOnly Path=/ SameSite=Lax; Secure solo prod; logout Max-Age=0 | OK |
| DASH/PDF/Redis/CI YAML / bbox Must / radio desde viewport | OK (cero cambio de alcance F6) |
| Envelope 400/401/403/404 | OK |

## Pruebas

`npx vitest run` — **191** tests, **45** files, todos passing.

## Huecos conscientes (no P0)

- `prisma generate` / migrate en Windows falla si `next dev` bloquea el DLL del query engine. Parar el server, luego `npx prisma generate` y `npx prisma migrate deploy`.
- Inngest/Upstash/WhatsApp no smoke en staging — arrastre F4.
- QR-BE F3 sigue ausente (OBS-F3-023).
- CI GitHub Actions es DevOps.

## Fuera de alcance BE

Leaflet, pan→radio, loader UX (`US-GEO-16` sin ruta), Places, clustering, Maps JS, DASH/PDF, pasarela, CI YAML.
