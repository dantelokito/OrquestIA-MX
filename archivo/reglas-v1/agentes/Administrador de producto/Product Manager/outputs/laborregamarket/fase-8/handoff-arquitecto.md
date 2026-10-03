# Handoff Arquitecto — Fase 8

> **De:** Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 24/08/2026 (v0.8.3 — P1 ubicación + P2 radio + P3 mapa México + P4 preview)

Parte 1: contratos de favoritas **ya existen**. Parte 2: **delta clamp** `radiusKm` 0.5–10. Parte 3: **constante bbox México**. Parte 4: **sin API nueva** — mismo GET de detalle; debounce/cache al hover.

`CO-F7-001` intacto. `CO-F8-001`: clamp **0.5–10**. `CO-F8-002`: pan solo en México. `CO-F8-003`: preview sin botón.

## ADRs a resolver

| ADR | Tema | Detalle |
|-----|------|---------|
| Sin Places | Geocode | Nominatim/OSM F5. **No** Google Places / Maps JS. |
| Sin merge | Duplicados `label` | IDs distintos. No job de fusión. |
| DELETE activa | US-GEO-18 | Tras borrar la favorita en uso, el pin del cliente permanece. |
| Clamp radio | US-GEO-22 | Un solo clamp **0.5–10** en FE y BE. Decimal. **Prohibido** `Math.round` a entero (rompe 0.5). Paso 0.5 km. Default 10. |
| Bbox México | US-GEO-23 | Constante `MEXICO_BOUNDS` (SW/NE) + `minZoom` Leaflet. **No** polígono INEGI Must. Helper `isInMexico(lat,lng)` compartido FE (Must) y BE (Should URL). |
| Preview hover | US-EXPLORE-07 | Mismo contrato detalle F7 (`GET /api/providers/:id`). Debounce + cache de 1 preview a la vez. Sin endpoint nuevo. |

## Contratos

### Parte 1 (reuso)

| Contrato | US | Esperado |
|----------|-----|----------|
| `GET/POST/PATCH/DELETE /api/users/me/addresses` + `.../use` | US-GEO-17…19 | Sin endpoint nuevo. Tope 20 → envelope ADR-003. |
| Geocode | US-GEO-17 | Cliente Nominatim. Resultado fuera de MX → no aplicar pin (US-GEO-23). |
| Lista proveedores `total` | US-GEO-20 | F7; copy puede decir metros (solo UI). |

### Parte 2 (delta Must)

| Contrato | US | Esperado |
|----------|-----|----------|
| `GET /api/providers?lat&lng&radiusKm` | US-GEO-22 | Mismo predicado Haversine. `radiusKm` **decimal**. Clamp servidor **0.5 ≤ R ≤ 10**. `meta.radiusKm` = valor ya clampeado. |
| Constante FE | US-GEO-21/22 | `MIN_RADIUS_KM=0.5`, `MAX_RADIUS_KM=10`, `DEFAULT_RADIUS_KM=10`, step 0.5. |

### Parte 3 (delta Must FE; Should BE)

| Contrato | US | Esperado |
|----------|-----|----------|
| Viewport Leaflet | US-GEO-23 | `maxBounds` + `maxBoundsViscosity` alta + `minZoom`. Encuadre al círculo al cambiar pin/radio (`FitCircle`). Pan **no** envía radio. |
| Pin / GPS / geocode / URL | US-GEO-23 | Fuera de bbox → rechazo en cliente; fallback SN o último pin. Should: `GET /api/providers` con lat/lng fuera de MX usa fallback SN o 400 envelope; **no** filtrar por bbox nacional en lugar de Haversine. |

### Parte 4 (reuso Must; NFR hover)

| Contrato | US | Esperado |
|----------|-----|----------|
| `GET /api/providers/:id` | US-EXPLORE-07 | Mismo shape F7 (`US-EXPLORE-05`). FE debounce al hover; un request por id en vuelo; no spamear al cruzar el grid. |

Envelope ADR-003 en 4xx/5xx. **Sin bbox Must** como predicado de lista.

### Schema

- Sin migración Prisma Must.
- `label` máx. 40 (Parte 1).
- Radio y México: solo constantes/validación.

### NFR

| Categoría | Requerimiento |
|-----------|---------------|
| Seguridad | CRUD favoritas solo `userId`. Lista proveedores pública. |
| Consistencia | FE y BE clampean radio igual. Círculo = `radiusKm * 1000` m. Centro siempre en bbox MX. |
| Rendimiento | Haversine; 10 km máx. Bbox MX no dispara query extra. Preview: debounce hover; no N GET por cruce de cards. |
| Geo | Leaflet/OSM invariante. Pan no envía radio nuevo. |

### Fuera de alcance

DASH, Redis, CI YAML, Places, Distance Matrix, clustering, Maps JS, pasarela, merge de duplicados, bbox de API Must, polígono INEGI, reabrir pan→radio.

## Entregables esperados

1. Parte 1: nota “sin API nueva” **o** gap envelope DELETE/tope 20.
2. Parte 2: delta API-GEO-01 (clamp 0.5–10, decimal) + tests; `handoff-backend-fase-8.md` **obligatorio** por el clamp.
3. Parte 3: ADR/constante bbox + minZoom; helper `isInMexico`; Should URL en el mismo handoff backend.
4. Parte 4: nota explícita «sin API nueva»; política debounce/cache hover en handoff FE/BE.
5. Documentar en `sad.md` clamp F7 (1–25) y viewport mundial → México.
