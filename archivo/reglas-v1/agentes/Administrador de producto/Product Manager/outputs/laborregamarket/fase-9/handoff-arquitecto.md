# Handoff Arquitecto — Fase 9

> **De:** Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 25/08/2026 (v0.9.0 — deuda Explorar)

F9 cierra deuda UX Explorar (`CO-F9-001`). `CO-F7-001` intacto. F8 solo lectura. Sin Maps JS / Places.

## ADRs / decisiones a resolver

| Tema | US | Detalle |
|------|-----|---------|
| Preview in-card | US-EXPLORE-08 | **Sin API nueva.** Mismo `GET /api/providers/:id`. Debounce/cache (paridad F8). |
| Suggest / índice radio | US-EXPLORE-09 | El listing **paginado** no basta como único índice del typeahead. Decidir: reutilizar `q`+geo con política de página/límite **o** endpoint suggest. Ranking por similitud de nombre = Should. |
| Distancia card | US-EXPLORE-10 | **Sin API Must.** `distanceKm` ya en listing geo. ETA = cliente (`computeEtaMinutes`, ADR-017). |
| Chips listing | US-EXPLORE-11 | Query Must: `offersWholesale`, `offersDelivery` en `listProviders` / `buildWhere` + params URL. **Sin** schema orgánico (chip retirado). |
| Chrome/mapa | US-GEO-24 | **Sin API Must.** Solo FE/tokens. |

## Contratos

### Sin delta Must

| Contrato | US | Esperado |
|----------|-----|----------|
| `GET /api/providers/:id` | US-EXPLORE-08 | Shape F7/F8. FE cache/debounce. |
| `distanceKm` en listing | US-EXPLORE-10 | Ya calculado con geo; UI solo. |

### Delta Must (004) + decisión (002)

| Contrato | US | Esperado |
|----------|-----|----------|
| `GET /api/providers?…` | US-EXPLORE-11 | Params booleanos (nombres a tu criterio, p. ej. `wholesale=true`, `delivery=true`) AND con `lat`/`lng`/`radiusKm`/`q`/`verified`/`category`. Documentar API-PROVIDERS-01. |
| Suggest o listing índice | US-EXPLORE-09 | Corpus = fruterías en radio. Suggest UI = id, businessName, coverUrl/logoUrl. Productos = índice interno (no filas SKU). Envelope ADR-003. |

### Schema

- Sin migración Prisma Must (Orgánico retirado).
- `offersWholesale` / `offersDelivery` ya existen en Provider.

### NFR

| Categoría | Requerimiento |
|-----------|---------------|
| Rendimiento | Typeahead no dispara N× GET detalle; debounce; no spamear al tipear |
| Consistencia | Chips URL shareable; clear alinea con tacha header |
| Geo | Haversine; clamp 0.5–10; pan ≠ radio |

### Fuera de alcance

DASH, Redis, CI YAML, Places, Distance Matrix, clustering, Maps JS, pasarela, schema orgánico, typeahead de SKUs, bbox API Must, pan→radio.

## Entregables esperados

1. Nota US-EXPLORE-08 / 10 / 24: «sin API Must».
2. Decisión documentada suggest vs `q`+geo (US-EXPLORE-09) + handoff backend si hay contrato.
3. Delta API listing mayoreo/domicilio (US-EXPLORE-11) + tests; `handoff-backend-fase-9.md` **obligatorio** por 002/004.
4. Actualizar `sad.md` si cambia contrato de providers.
