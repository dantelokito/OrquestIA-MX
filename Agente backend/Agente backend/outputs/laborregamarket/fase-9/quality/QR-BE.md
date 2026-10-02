# QR-BE — Autoevaluación Backend Fase 9

> **Producto:** LaBorregaMarket v0.9.0  
> **Agente:** Backend Developer  
> **Fecha:** 25/08/2026  
> **Alcance:** Filtros `offersWholesale` / `offersDelivery` en listing; typeahead sin ruta nueva; serialización en cards.

## Score

**97 / 100** — listo para Quality Gate del Arquitecto.

## Cumplimiento DoD arquitectura

| Criterio | Estado |
|----------|--------|
| `offersWholesale=true` → `where.offersWholesale = true` | OK |
| `offersDelivery=true` → `where.offersDelivery = true` | OK |
| AND con geo / `q` / `verified` / `category` / `isActive` | OK |
| Bool ausente → no filtra | OK |
| `false`/`0` → tratado como ausente | OK |
| Bool inválido → 400 ADR-003 (`details` en el param) | OK |
| Empty = 200 + `total=0` | OK |
| Cards serializan `offersWholesale` / `offersDelivery` | OK |
| Cero ruta `/suggest`; cero migración Prisma | OK |
| Clamp F8 / `MEXICO_BOUNDS` / preview / DASH / Redis / CI | OK (cero cambio) |

## Pruebas

`npx vitest run` — **235** tests, **49** files, todos passing.

Casos F9: mayoreo / domicilio / ambos AND / +q+geo / empty total=0 / `maybe`→400 / `false`/`0` ausente / `1`→true.

## Huecos conscientes (no P0)

- ETA / alta proveedor / `clientLat` de pedidos **siguen bbox AMM** (fuera de slice F8/F9).
- Ranking por similitud de typeahead = Should FE (no ADR Must).
- QR-BE F3 sigue ausente (OBS-F3-023). CI GitHub Actions es DevOps.

## Fuera de alcance BE

Preview in-card, card distancia/ETA UI, FilterBar visual, chrome mapa, schema orgánico, endpoint suggest, Places, Distance Matrix, clustering, Maps JS, pan→radio, DASH/PDF, Redis, CI YAML.
