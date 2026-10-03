# QR-BE — Autoevaluación Backend Fase 5

> **Producto:** LaBorregaMarket v0.5.0  
> **Agente:** Backend Developer  
> **Fecha:** 14/08/2026  
> **Alcance:** Must F5 — brand colors + session, catálogo inhabilitado. GEO query F4 intacta.

## Score

**96 / 100** — listo para Quality Gate del Arquitecto.

## Cumplimiento DoD arquitectura

| Criterio | Estado |
|----------|--------|
| PATCH colores 400 si contraste insuficiente o par incompleto; no persiste | OK |
| `GET /api/auth/session` 200 para invitado; `brand` solo PROVIDER válido | OK |
| Detalle público omite `isAvailable=false` (no greyscale) | OK |
| Orders/POS 409 si producto inhabilitado; orden no creada | OK (regresión + POS + `Product.isActive=false`) |
| Dashboard `topProducts` de catálogo vigente; KPIs históricos intactos | OK |
| Query geo F4 sin bbox Must | OK (cero cambio) |
| Envelope 400/401/403/404/409/500 | OK |
| Sin pasarela / Maps JS / Places / Distance Matrix | OK |
| PATCH solo colores no dispara gate Google 403 | OK |
| GET panel products no filtra (toggle) | OK |

## Pruebas

`npx vitest run` — **144** tests, **34** files, todos passing.

## Huecos conscientes (no P0)

- `prisma generate` en Windows falla si `next dev` (8080/8081) tiene el DLL del query engine bloqueado. Tipos F5 ya están en el client; aplicar `migrate deploy` con el dev server parado.
- Inngest/Upstash/WhatsApp no smoke en staging (keys DevOps) — arrastre F4.
- QR-BE F3 sigue ausente (OBS-F3-023); no se fabrica.

## Fuera de alcance BE

Leaflet/OSM y layout US-GEO-05 (FE). `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` / tile OSM (DevOps + FE). Preview contraste UI (Should FE). Paleta desde logo, bbox Must, stock, pasarela, CFDI.
