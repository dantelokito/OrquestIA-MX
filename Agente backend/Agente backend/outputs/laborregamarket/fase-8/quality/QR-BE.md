# QR-BE — Autoevaluación Backend Fase 8

> **Producto:** LaBorregaMarket v0.8.3  
> **Agente:** Backend Developer  
> **Fecha:** 24/08/2026  
> **Alcance:** Clamp `radiusKm` 0.5–10; 400 AMM revocado; `isInMexico` en lista (Should) y favoritas (Must).

## Score

**96 / 100** — listo para Quality Gate del Arquitecto.

## Cumplimiento DoD arquitectura

| Criterio | Estado |
|----------|--------|
| `clampGeoRadiusKm` 0.5–10, sin `Math.round`; default 10 | OK |
| `radiusKm` fuera de rango → clamp, no 400; `meta.radiusKm` = aplicado | OK |
| 400 bbox AMM quitado de `GET /api/providers` y POST/PATCH addresses | OK |
| CDMX (`19.43, -99.13`) lista 200 / favoritas 201 | OK |
| `!isInMexico` (`33.0, -99.0`) → 400 envelope, `details` en `lat`/`lng` | OK |
| Lista sigue Haversine; no bbox Must de predicado | OK |
| Preview `GET /api/providers/[id]` sin cambio | OK |
| Cero migración Prisma; cero ruta nueva | OK |
| DASH/PDF/Redis/CI YAML / AUTH cookie / pan→radio | OK (cero cambio) |

## Pruebas

`npx vitest run` — **217** tests, **47** files, todos passing.

Casos F8: `0.5` / `10` / `22→10` / `0→0.5` / `0.7`; CDMX 200/201; `33.0,-99.0` 400 (lista + POST/PATCH).

## Huecos conscientes (no P0)

- ETA (`etaQuerySchema`), alta de proveedor y `clientLat`/`clientLng` de pedidos **siguen bbox AMM** — el Arquitecto solo revocó Explorar y favoritas.
- Clamp cliente FE (`clampRadiusKm` + `Math.round` en `src/lib/api/providers.ts` / `MIN_RADIUS_KM=1`) es trabajo Frontend.
- `prisma generate` / migrate en Windows falla si `next dev` bloquea el DLL. Arrastre F4: Inngest/Upstash/WhatsApp sin smoke staging.
- QR-BE F3 sigue ausente (OBS-F3-023). CI GitHub Actions es DevOps.

## Fuera de alcance BE

Leaflet `maxBounds`, Nominatim viewbox, overlay compacto, hover debounce, copy metros, FilterBar, Places, clustering, Maps JS, polígono INEGI, DASH/PDF, pasarela, CI YAML.
