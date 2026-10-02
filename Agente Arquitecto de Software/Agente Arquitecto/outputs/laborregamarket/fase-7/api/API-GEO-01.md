# API-GEO-01 — Delta Explorar (Fase 7)

> **Endpoint:** `GET` `/api/providers`  
> **Módulo:** `GEO`, `EXPLORE`  
> **Versión:** 0.7.1  
> **Fecha:** 18/08/2026  
> **US:** US-GEO-10, US-GEO-12, US-GEO-13, US-GEO-16, US-EXPLORE-06  
> **Base F4:** [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)  
> **ADR:** append [`../../comun/adrs/ADR-020-maps-engine-leaflet.md`](../../comun/adrs/ADR-020-maps-engine-leaflet.md) (`CO-F7-001`)  
> **Autenticación:** Pública

Envelope [ADR-003](../../comun/adrs/ADR-003-error-envelope.md). Paginación [ADR-004](../../comun/adrs/ADR-004-pagination-strategy.md).

Este documento **reemplaza la nota F6** (`fase-6/api/API-GEO-01.md`, solo lectura). El filtro Must sigue Haversine. **No** hay bbox Must.

---

## GET `/api/providers`

> **Descripción:** Listar fruterías activas; con coords, filtrar por radio Haversine y ordenar por cercanía.  
> **Autenticación:** Pública

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `lat` | number | — | Centro (pin / GPS / favorita / SN en FE) |
| `lng` | number | — | Longitud |
| `radiusKm` | number | `10` si hay `lat`+`lng` | Radio de búsqueda |
| `q` | string | — | Min **2** chars. Unión nombre comercial **o** producto vendible |
| `category` | enum | — | `FRUTA` \| `VERDURA` \| `AGRICOLA` (F2) |
| `city` | string | — | F2 |
| `verified` | boolean | — | F2 |
| `page` | number | `1` | 1-indexed |
| `limit` | number | `20` | Explorar usa 20 (`US-GEO-12`). Max global F2 = **50** |

`category`, `q`, `city`, `verified`, radio y `isActive=true` se combinan con **AND**. `q` es **unión** (nombre ∪ producto), no XOR.

#### Radio (`CO-F7-001`)

El servidor **no** deriva radio del viewport. Recibe `radiusKm` del slider.

| Caso | Comportamiento F7 |
|------|-------------------|
| `lat` XOR `lng` | **400** (igual F4) |
| `lat`+`lng` sin `radiusKm` | aplicar **10** |
| `radiusKm` sin coords | **400** |
| `radiusKm` &lt; 1 o &gt; 25 | **clamp** a [1, 25]; devolver el valor aplicado en `meta.radiusKm` (**no 400**) |
| Coords fuera bbox Monterrey | **400** (igual F4) |

Pan/zoom en el cliente: **cero** query. Slider / dirección / GPS / favorita: sí refetch.

#### `q` (US-EXPLORE-06)

Case-insensitive contains. Match si:

- `businessName` **o** `description` coincide, **o**
- existe `ProviderProduct` con `isAvailable=true` **y** `Product.isActive=true` cuyo `name` o `slug` coincide.

Productos inhabilitados **no** matchean (ADR-022). `q` de 1 carácter → **400**.

#### Conteo (`US-GEO-13`)

`meta.total` = COUNT del mismo predicado (activos + radio + filtros + `q`), **independiente** de `page`/`limit`. Un `count` del set filtrado; **prohibido** `data.length` o N+1 por página. `totalPages = ceil(total / limit)`.

FE: copy “N fruterías a R km” usa `meta.total` y `meta.radiusKm`, **no** `items.length`.

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
      "distanceKm": 2.4
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 35,
    "totalPages": 2,
    "radiusKm": 10
  }
}
```

Resto de campos F2 (`sampleProducts`, etc.) se mantienen. `sampleProducts` solo vendibles.

#### US-GEO-16 — empty vs loading vs error (sin ruta nueva)

| Estado UI | Condición API |
|-----------|----------------|
| Loading (loader tamaño loading) | Request en vuelo (`aria-busy=true`). **No** interpretar lista previa como empty. |
| Empty radio (loader tamaño empty + CTA ampliar) | **200** + `data: []` + `meta.total === 0` |
| Error | 4xx/5xx o red; ErrorBanner + Reintentar. **No** empty borrega |

#### 400 Bad Request:

Coords XOR, `q` de 1 char, `page`/`limit` inválidos, bbox. Envelope ADR-003.

---

## Implementación sugerida

| Capa | Nota |
|------|------|
| BE | `listProviders`: clamp radio; `count` mismo where que el page; `q` unión F2+CAT |
| FE | Constante SN [ADR-026](../../comun/adrs/ADR-026-explore-default-san-nicolas.md); no derivar radio del mapa; `credentials` same-origin |

---

## Referencias

- Diagrama: [`../diagrams/ARCH-GEO-04.md`](../diagrams/ARCH-GEO-04.md)
- Favoritas: [`API-ADDRESSES-01.md`](./API-ADDRESSES-01.md)
