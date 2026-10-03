# API-GEO-01 — Delta Explorar (Fase 8)

> **Endpoint:** `GET` `/api/providers`  
> **Módulo:** `GEO`, `EXPLORE`  
> **Versión:** 0.8.3  
> **Fecha:** 24/08/2026  
> **US:** US-GEO-20, US-GEO-22, US-GEO-23  
> **Base F7:** [`../../fase-7/api/API-GEO-01.md`](../../fase-7/api/API-GEO-01.md)  
> **ADR:** append [`../../comun/adrs/ADR-020-maps-engine-leaflet.md`](../../comun/adrs/ADR-020-maps-engine-leaflet.md) (`CO-F8-001`); [`../../comun/adrs/ADR-028-mexico-bounds.md`](../../comun/adrs/ADR-028-mexico-bounds.md) (`CO-F8-002`)  
> **Autenticación:** Pública

Envelope [ADR-003](../../comun/adrs/ADR-003-error-envelope.md). Paginación [ADR-004](../../comun/adrs/ADR-004-pagination-strategy.md).

Este documento **reemplaza el clamp y el bbox AMM de F7** para `/explorar`. El resto de F7 (`q` unión, `meta.total`, empty `US-GEO-16`, `CO-F7-001` pan ≠ radio) **sigue vigente**. El filtro Must sigue **Haversine**. **No** hay bbox Must de lista.

---

## GET `/api/providers`

> **Descripción:** Listar fruterías activas; con coords, filtrar por radio Haversine y ordenar por cercanía.  
> **Autenticación:** Pública

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `lat` | number | — | Centro (pin / GPS / favorita / SN en FE) |
| `lng` | number | — | Longitud |
| `radiusKm` | number (decimal) | `10` si hay `lat`+`lng` | Radio de búsqueda |
| `q` | string | — | Min **2** chars. Unión nombre comercial **o** producto vendible (F7) |
| `category` | enum | — | `FRUTA` \| `VERDURA` \| `AGRICOLA` (F2) |
| `city` | string | — | F2 |
| `verified` | boolean | — | F2 |
| `page` | number | `1` | 1-indexed |
| `limit` | number | `20` | Explorar usa 20 (`US-GEO-12`). Max global F2 = **50** |

`category`, `q`, `city`, `verified`, radio y `isActive=true` se combinan con **AND**. `q` es **unión** (F7).

#### Constantes (FE y BE, mismas)

| Constante | Valor |
|-----------|-------|
| `MIN_RADIUS_KM` | `0.5` |
| `MAX_RADIUS_KM` | `10` |
| `DEFAULT_RADIUS_KM` | `10` |
| `RADIUS_STEP_KM` | `0.5` (solo slider FE) |

**Prohibido** `Math.round` en el clamp (rompe 0.5). Param **`radiusKm`**; no existe `radiusM`.

#### Radio (`CO-F8-001`, `CO-F7-001` intacto)

El servidor **no** deriva radio del viewport. Recibe `radiusKm` del slider.

| Caso | Comportamiento F8 |
|------|-------------------|
| `lat` XOR `lng` | **400** (igual F4) |
| `lat`+`lng` sin `radiusKm` | aplicar **10** |
| `radiusKm` sin coords | **400** |
| `radiusKm` &lt; 0.5 o &gt; 10 | **clamp** a [0.5, 10]; devolver el valor aplicado en `meta.radiusKm` (**no 400**) |
| `radiusKm=0.5` / `=10` / `=0.7` | aceptar tal cual (0.7 no redondea a 1) |
| Bookmark `radiusKm=22` | clamp **10** |
| Bookmark `radiusKm=0` | clamp **0.5** |

Pan/zoom en el cliente: **cero** query. Slider / dirección / GPS / favorita: sí refetch + `fitBounds` del círculo.

#### Coords (`CO-F8-002`) — Should BE

El bbox AMM F4 (**400** si fuera de 25.4–25.9 / −100.6–−99.8) **queda revocado** para esta ruta.

| Caso | Comportamiento F8 |
|------|-------------------|
| `isInMexico(lat, lng)` (incl. CDMX) | Validar; filtrar **Haversine** (posible `total=0`) |
| Fuera de `MEXICO_BOUNDS` (p. ej. `33.0, -99.0` al norte del rectángulo) | **400** envelope ADR-003; `details` en `lat`/`lng`. **No** remap a SN en servidor |
| Predicado de lista | **Solo** Haversine + filtros F7. **Prohibido** filtrar por bbox nacional |

Must FE: no enviar coords fuera de MX; fallback SN o último pin ([ADR-028](../../comun/adrs/ADR-028-mexico-bounds.md)).

#### `q`, conteo, empty

Igual F7: `q` min 2; `meta.total` = COUNT del predicado (no `data.length`); empty = **200** + `total=0` (`US-GEO-16`). Copy UI puede decir metros si R &lt; 1 km (`US-GEO-20`); el API sigue en km.

#### 200 Success:

```json
{
  "data": [
    {
      "id": "clx...",
      "businessName": "Frutas El Paraíso",
      "latitude": 25.6714,
      "longitude": -100.3089,
      "rating": 4.5,
      "reviewCount": 12,
      "isVerified": true,
      "distanceKm": 0.4
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 35,
    "totalPages": 2,
    "radiusKm": 0.5
  }
}
```

`distanceKm` a 1 decimal (F4). Resto de campos F2/F7 se mantienen.

#### 400 Bad Request:

Coords XOR, `q` de 1 char, `page`/`limit` inválidos, coords `!isInMexico` (Should). Envelope ADR-003. Radio fuera de rango **no** es 400.

---

## Tests Backend (Must clamp; Should MX)

| Caso | Esperado |
|------|----------|
| `radiusKm=0.5` | 200; `meta.radiusKm === 0.5`; Haversine 500 m |
| `radiusKm=10` | 200; `meta.radiusKm === 10` |
| `radiusKm=22` | 200; `meta.radiusKm === 10` |
| `radiusKm=0` | 200; `meta.radiusKm === 0.5` |
| `radiusKm=0.7` | 200; `meta.radiusKm === 0.7` (no 1) |
| `lat`/`lng` CDMX (p. ej. 19.43, −99.13) | 200 (no 400 AMM); Haversine |
| `lat`/`lng` fuera del rectángulo (p. ej. 33.0, −99.0) | Should: **400** `isInMexico` |
| `meta.total` vs `limit` | Igual F7 (COUNT del predicado) |

---

## Implementación sugerida

| Capa | Nota |
|------|------|
| BE | `clampGeoRadiusKm`: 0.5–10, sin `Math.round`; `isInMexico` Should en el schema geo; **quitar** guard AMM |
| FE | `MIN_RADIUS_KM` / `MAX_RADIUS_KM` / `DEFAULT_RADIUS_KM`; `clampRadiusKm` **sin** `Math.round`; `MEXICO_BOUNDS` + `minZoom` 5; Nominatim `MEXICO_VIEWBOX` |

---

## Referencias

- Diagrama: [`../diagrams/ARCH-GEO-05.md`](../diagrams/ARCH-GEO-05.md)
- Favoritas: [`API-ADDRESSES-01.md`](./API-ADDRESSES-01.md)
- ADR-026 SN: [`../../comun/adrs/ADR-026-explore-default-san-nicolas.md`](../../comun/adrs/ADR-026-explore-default-san-nicolas.md)
