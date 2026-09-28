# Handoff Frontend — LaBorregaMarket Backend v0.9.0

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 25/08/2026

---

## Estado: LISTO PARA INTEGRAR — Must F9 (chips listing)

Base URL local: `http://localhost:8080`  
Envelope JSON: `{ data }` / `{ error, details? }` (ADR-003). Cookie: `credentials: 'include'` (ADR-025).  
F6 DASH/PDF, F7 preview/AUTH y F8 clamp/MX **sin cambios**. El servidor **no** deriva `radiusKm` del viewport (`CO-F7-001`).

---

## Mapa pantalla → endpoint (delta F9)

| Tema | Endpoint(s) | Notas |
|------|-------------|-------|
| Explorar lista + chips | `GET /api/providers` | `offersWholesale=true` / `offersDelivery=true` AND con geo/`q`/`verified`/`category`. Sin schema orgánico |
| Typeahead (US-EXPLORE-09) | **mismo** `GET /api/providers` | Debounce; `q`≥2; `lat`/`lng`/`radiusKm`; `limit=10`; `page=1`. **No** hay `/suggest`. Filas = fruterías (`id`, `businessName`, `coverUrl`/`logoUrl`) |
| Empty vs error | mismo GET | **200** + `total=0` = empty. Bool mal formado → **400** |
| Preview / card distancia / chrome | — | **Sin delta BE** (US-08 / 10 / 24 = solo FE) |

Clamp F8 y `MEXICO_BOUNDS` se conservan.

---

## Query GEO (delta F9)

| Param | Default | Notas |
|-------|---------|-------|
| `offersWholesale` | — | ausente → no filtra. `true`/`1` → solo mayoreo. `false`/`0` → tratado como ausente. Otro → **400** (`details.field=offersWholesale`) |
| `offersDelivery` | — | Igual que arriba |
| `lat`+`lng` / `radiusKm` / `q` | F8 | Sin cambio |

Todos los filtros presentes se combinan con **AND**. `meta.total` = COUNT del predicado (incl. Haversine).

### Shape card (delta)

Cada item de `data[]` ahora incluye:

```json
{
  "offersWholesale": true,
  "offersDelivery": false
}
```

Resto del shape F7/F8 intacto (`distanceKm` a 1 decimal cuando hay geo).

### Casos de prueba BE (ya verdes)

| Query | Esperado |
|-------|----------|
| `offersWholesale=true` + geo | 200; solo wholesale; `meta.total` correcto |
| `offersDelivery=true` + geo | 200; solo delivery |
| ambos `true` | AND |
| + `q` + geo | AND con unión q |
| 0 matches | 200, `total=0` |
| `offersWholesale=maybe` | 400 |
| `offersWholesale=false` | 200; **sin** filtro de flag |

---

## Códigos

| Caso | HTTP |
|------|------|
| Bool inválido (`maybe`, etc.) | 400 |
| Empty predicado | **200** (`total=0`) |
| Radio fuera de [0.5, 10] | **200** (clamp F8) |
| Coords fuera de México | 400 (F8) |

---

## Fuera de alcance BE

Endpoint `/suggest`, schema orgánico, FilterBar visual, preview in-card, ETA en card, chrome mapa, DASH/PDF, CI YAML, pan→radio, Places, Distance Matrix.
