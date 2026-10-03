# API-GEO-01 — Delta Explorar (Fase 9)

> **Endpoint:** `GET` `/api/providers`  
> **Módulo:** `GEO`, `EXPLORE`  
> **Versión:** 0.9.0  
> **Fecha:** 25/08/2026  
> **US:** US-EXPLORE-09, US-EXPLORE-11  
> **Base F8:** [`../../fase-8/api/API-GEO-01.md`](../../fase-8/api/API-GEO-01.md)  
> **CO:** CO-F9-001  
> **Autenticación:** Pública

Envelope [ADR-003](../../comun/adrs/ADR-003-error-envelope.md). Paginación [ADR-004](../../comun/adrs/ADR-004-pagination-strategy.md).

Este documento **añade** filtros de vitrina al listing y fija la política de typeahead. Clamp 0.5–10, `MEXICO_BOUNDS`, Haversine, `q` unión, `meta.total`, empty `US-GEO-16` y `CO-F7-001` (pan ≠ radio) de F8 **siguen vigentes**. **No** hay endpoint `/suggest`. **No** hay bbox Must de lista. **No** hay schema orgánico.

---

## GET `/api/providers`

> **Descripción:** Listar fruterías activas; con coords, filtrar por radio Haversine y ordenar por cercanía.  
> **Autenticación:** Pública

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `lat` | number | — | Centro (pin / GPS / favorita / SN en FE) |
| `lng` | number | — | Longitud |
| `radiusKm` | number (decimal) | `10` si hay `lat`+`lng` | Radio de búsqueda (clamp F8 0.5–10) |
| `q` | string | — | Min **2** chars. Unión nombre comercial **o** producto vendible (F7) |
| `category` | enum | — | `FRUTA` \| `VERDURA` \| `AGRICOLA` |
| `city` | string | — | F2 |
| `verified` | boolean | — | Solo verificados si `true` |
| `offersWholesale` | boolean | — | **F9.** Si `true`, solo `Provider.offersWholesale === true` |
| `offersDelivery` | boolean | — | **F9.** Si `true`, solo `Provider.offersDelivery === true` |
| `page` | number | `1` | 1-indexed |
| `limit` | number | `20` | Explorar lista = 20. Typeahead recomendado = **10**. Max global = **50** |

Todos los filtros presentes se combinan con **AND** (`isActive=true`, geo, `q`, `category`, `verified`, `offersWholesale`, `offersDelivery`). `q` sigue siendo **unión** (F7).

#### Parsing booleanos (Must)

| Valor query | Comportamiento |
|-------------|----------------|
| ausente | no filtra por ese flag |
| `true` / `1` | filtrar `=== true` |
| `false` / `0` | **no** aplicar filtro de “solo false” en Must F9 (chips solo encienden); si se envía `false`, tratar como ausente **o** 400 — documentar en tests la opción elegida; recomendado: **ausente** |
| otro string | **400** envelope ADR-003 (`details` en el param) |

Los campos Prisma **ya existen** (settings F7). **Cero** migración.

#### Radio / coords

Igual F8: [`../../fase-8/api/API-GEO-01.md`](../../fase-8/api/API-GEO-01.md). Clamp 0.5–10 sin `Math.round`. `isInMexico` Should. Predicado lista = Haversine + filtros (no bbox nacional).

#### `q`, conteo, empty

Igual F7/F8: `q` min 2; `meta.total` = COUNT del predicado; empty = **200** + `total=0`.

---

## Typeahead (US-EXPLORE-09) — decisión

**Sin endpoint suggest.** El typeahead reutiliza este mismo `GET /api/providers`.

| Regla | Valor |
|-------|-------|
| Corpus | Predicado servidor (Haversine + `q` + filtros), **no** el array paginado ya cargado en FE |
| Request | Debounce al tipear; `q` ≥ 2; `lat`/`lng`/`radiusKm` válidos; `limit=10` recomendado; `page=1` |
| Filas UI | Solo fruterías: `id`, `businessName`, `coverUrl` / `logoUrl` (ya en listing) |
| Productos | Índice **interno** del predicado `q` (unión F7); **prohibido** listar SKUs como filas del desplegable |
| Sin pin/radio | No inventar matches; no llamar o mostrar empty |
| Selección | FE aplica `q` (y/o id) a URL + refetch del listado de cards |
| Clear (tacha) | Quita `q` y filtros de chips alineados; vuelve al geo del radio |
| Ranking similitud nombre | **Should** FE (p. ej. priorizar `businessName` que empieza por `q`); no ADR Must |

Motivo: F7 ya busca en **todo el radio** con `q`. La deuda QA era índice cliente sobre la página visible.

Diagrama: [`../diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md`](../diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md)

---

## 200 Success:

```json
{
  "data": [
    {
      "id": "clx...",
      "businessName": "Frutas El Paraíso",
      "latitude": 25.6714,
      "longitude": -100.3089,
      "logoUrl": null,
      "coverUrl": "https://…",
      "rating": 4.5,
      "reviewCount": 12,
      "isVerified": true,
      "offersWholesale": true,
      "offersDelivery": false,
      "distanceKm": 0.4
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1,
    "radiusKm": 10
  }
}
```

`distanceKm` a 1 decimal (F4). Resto de campos F2/F7/F8 se mantienen. Exponer `offersWholesale` / `offersDelivery` en el item facilita UI de chips; si el código ya los serializa, no cambiar shape.

#### 400 Bad Request:

Coords XOR, `q` de 1 char, `page`/`limit` inválidos, booleano mal formado, coords `!isInMexico` (Should). Envelope ADR-003. Radio fuera de rango **no** es 400 (clamp F8).

---

## Tests Backend (Must F9)

| Caso | Esperado |
|------|----------|
| `offersWholesale=true` + geo | Solo providers con flag true; `meta.total` = COUNT |
| `offersDelivery=true` + geo | Idem domicilio |
| ambos `=true` | AND de ambos flags |
| `offersWholesale=true` + `q=mango` + geo | AND con unión `q` |
| AND deja 0 | **200** + `total=0` |
| param booleano inválido (p. ej. `offersWholesale=maybe`) | **400** |
| typeahead | **No** hay ruta `/suggest`; mismo GET con `limit=10` |

Clamp / MX: tests F8 siguen vigentes (no reabrir).

---

## Implementación sugerida

| Capa | Nota |
|------|------|
| BE | `ListProvidersFilters` + `buildWhere`: `offersWholesale` / `offersDelivery`; parse en schema geo/query de la route |
| FE lista | URL shareable `?offersWholesale=true&offersDelivery=true` (paridad `US-EXPLORE-03`) |
| FE typeahead | Segundo fetch debounced; **prohibido** filtrar solo `providers` de la página actual |

---

## Referencias

- Notas sin API: [`API-EXPLORE-NOTES-01.md`](./API-EXPLORE-NOTES-01.md)
- Handoff: [`../handoff-backend-fase-9.md`](../handoff-backend-fase-9.md)
- F8 clamp/MX: [`../../fase-8/api/API-GEO-01.md`](../../fase-8/api/API-GEO-01.md)
- Settings flags: [`../../fase-7/api/API-PROVIDER-SETTINGS-01.md`](../../fase-7/api/API-PROVIDER-SETTINGS-01.md)
