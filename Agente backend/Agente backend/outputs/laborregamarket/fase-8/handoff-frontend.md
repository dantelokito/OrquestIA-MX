# Handoff Frontend — LaBorregaMarket Backend v0.8.3

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 24/08/2026

---

## Estado: LISTO PARA INTEGRAR — Must F8 (clamp + México)

Base URL local: `http://localhost:8080`  
Envelope JSON: `{ data }` / `{ error, details? }` (ADR-003). Cookie: `credentials: 'include'` (ADR-025).  
F6 DASH/PDF y F7 preview/AUTH **sin cambios**. El servidor **no** deriva `radiusKm` del viewport (`CO-F7-001`).

---

## Mapa pantalla → endpoint (delta F8)

| Tema | Endpoint(s) | Notas |
|------|-------------|-------|
| Explorar lista | `GET /api/providers` | Clamp `radiusKm` a **[0.5, 10]**; `meta.radiusKm` = aplicado. Default 10 si hay coords. CDMX **200**. Fuera de `MEXICO_BOUNDS` → **400** (`details` en `lat`/`lng`, copy «Ubicación fuera de México»). Filtro sigue Haversine (no bbox de lista) |
| Empty vs error | mismo GET | **200** + `total=0` = empty. Radio fuera de rango **no** es 400 |
| Preview / detalle | `GET /api/providers/[id]` | **Sin delta F8.** Mismo shape F7. Debounce/cache es FE |
| Favoritas | POST/PATCH `/api/users/me/addresses` | `lat`/`lng` ahora México (CDMX válido). DELETE / `/use` / tope 20 **igual F7**. Tras DELETE el pin permanece = FE |

Centro SN: **FE** (ADR-026 `25.7475, -100.2830`). BE no remapea a SN.

Constantes alineadas (BE): `MIN_RADIUS_KM=0.5`, `MAX_RADIUS_KM=10`, `DEFAULT_RADIUS_KM=10`. FE debe quitar `Math.round` del clamp cliente.

---

## Query GEO

| Param | Default | Notas |
|-------|---------|-------|
| `lat`+`lng` | — | XOR → 400. `!isInMexico` → 400 (no AMM) |
| `radiusKm` | 10 con coords | <0.5 o >10 → **clamp**, no 400. `0.7` queda 0.7. Bookmark 22 → 10; 0 → 0.5 |
| `q` | — | Igual F7 (min 2; unión nombre ∪ producto vendible) |
| `limit` | 20 | Max 50 |

Copy “N fruterías a R km”: `meta.total` y `meta.radiusKm`. Copy en metros si R < 1 km es **solo UI**.

### Casos de prueba BE (ya verdes)

| Query | Esperado |
|-------|----------|
| `radiusKm=0.5` / `10` / `0.7` | 200; `meta.radiusKm` tal cual |
| `radiusKm=22` | 200; `meta.radiusKm=10` |
| `radiusKm=0` | 200; `meta.radiusKm=0.5` |
| `lat=19.43&lng=-99.13` | 200 |
| `lat=33.0&lng=-99.0` | 400 |

No usar Laredo como caso 400 (el rectángulo lo puede incluir).

---

## Códigos

| Caso | HTTP |
|------|------|
| Radio fuera de [0.5, 10] | **200** (clamp) |
| Coords fuera de México (lista o POST/PATCH favoritas) | 400 |
| Invitado en favoritas / `/use` | 401 |
| PROVIDER/ADMIN en favoritas / `/use` | 403 |

---

## Fuera de alcance BE

Leaflet `maxBounds` / `minZoom`, Nominatim viewbox, overlay radio, hover debounce, copy metros, FilterBar, DASH/PDF, CI YAML, pasarela. ETA / alta de proveedor / `clientLat` de pedidos **siguen bbox AMM** (no es slice F8).
