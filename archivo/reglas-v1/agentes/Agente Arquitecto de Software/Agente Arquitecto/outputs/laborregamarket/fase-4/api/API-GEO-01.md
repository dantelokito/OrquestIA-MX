# API-GEO-01 — Delta explorar (radio + ETA preview)

> **Endpoint:** `GET` `/api/providers` (extensión) y `GET` `/api/providers/[id]/eta`  
> **Módulo:** `GEO`, `EXPLORE`  
> **Versión:** 0.4.0  
> **Fecha:** 14/08/2026  
> **US:** US-GEO-01, US-GEO-02, US-NOTIFY-09  
> **Base F2:** [`../../fase-1/api/API-PROVIDERS-01.md`](../../fase-1/api/API-PROVIDERS-01.md)  
> **Autenticación:** Pública

Este documento es el **delta F4**. Filtros `city`, `q`, `category`, `verified`, `page`, `limit` de F2 **siguen vigentes** y se combinan con AND.

---

## GET `/api/providers` — query geo

> **Descripción:** Listar fruterías activas; si hay coordenadas, filtrar por radio Haversine y ordenar por cercanía.  
> **Autenticación:** Pública  
> **NFR:** p95 &lt; 2 s (volumen actual: decenas de providers)

#### Query Parameters (nuevos):

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `lat` | number | — | Latitud del pin / GPS del cliente |
| `lng` | number | — | Longitud |
| `radiusKm` | number | `10` si hay `lat`+`lng` | Radio 1–25 inclusive |

#### Combinación:

- Sin `lat` y sin `lng`: comportamiento F2 (orden `rating DESC`). No enviar `distanceKm`.
- `lat` XOR `lng` (solo uno): **400**.
- `lat`+`lng` sin `radiusKm`: aplicar **10 km**.
- `radiusKm` sin coords: **400**.
- `radiusKm` &lt; 1 o &gt; 25: **400**.
- Coords fuera del bounding box Monterrey (lat 25.4–25.9, lng -100.6–-99.8): **400**.

`category`, `q`, `city`, `verified` AND radio AND `isActive=true`.

**Orden con geo:** `distanceKm ASC`, empate `rating DESC`.

#### Haversine (km)

Usar SQL parametrizado (`$queryRaw`) o filtro en aplicación si el set es &lt; ~100 filas activas. Fórmula estándar R=6371.

**Umbral índice:** ver [`../data-model/DB-providers.md`](../data-model/DB-providers.md) — PostGIS cuando &gt; 200 providers o p95 &gt; 2 s.

#### 200 Success (item extra):

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
    "total": 3,
    "totalPages": 1,
    "radiusKm": 10
  }
}
```

`distanceKm` redondeado a 1 decimal. Resto de campos F2 (`sampleProducts`, etc.) se mantienen.

#### 400 Bad Request:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "radiusKm", "message": "Debe estar entre 1 y 25" }
  ]
}
```

Coords fuera de NL:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "lat", "message": "Ubicación fuera del área de Monterrey" }
  ]
}
```

---

## GET `/api/providers/[id]/eta`

> **Descripción:** Preview de tiempo estimado (ADR-017). No persiste.  
> **Autenticación:** Pública (o CLIENT; misma respuesta)

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `lat` | number | — | Opcional. Si falta, solo preparación |
| `lng` | number | — | Requerido si hay `lat` |
| `fulfillmentType` | enum | `PICKUP` | `PICKUP` \| `DELIVERY` |

Si `fulfillmentType=DELIVERY` y el provider `offersDelivery=false` → 400.

Coords inválidas / XOR → 400 (mismas reglas que listado).

#### 200 Success:

```json
{
  "data": {
    "providerId": "clx...",
    "preparationTimeMinutes": 20,
    "travelMinutes": 8,
    "etaMinutes": 28,
    "distanceKm": 3.2,
    "fulfillmentType": "PICKUP",
    "copyKey": "eta_ready_approx"
  }
}
```

| Situación | `travelMinutes` | `copyKey` |
|-----------|-----------------|-----------|
| Sin `lat`/`lng` | 0 | `eta_prep_only` |
| Con distancia | ≥ 1 | `eta_ready_approx` |

Copy UI (UX pendiente): "tiempo de preparación" vs "Listo aprox. en ~X min". Estimación, no SLA.

Provider inactivo → 404.

Fórmula: [`ADR-017`](../../comun/adrs/ADR-017-eta-formula.md). `AVG_SPEED_KMH = 25`.

---

## GET `/api/providers/[id]` — delta detalle

Añadir al `data` existente:

```json
{
  "preparationTimeMinutes": 20,
  "offersDelivery": false,
  "googleReviews": {
    "enabled": true,
    "placeId": "ChIJ...",
    "mapsUrl": "https://maps.google.com/?cid=..."
  }
}
```

Omitir o `googleReviews.enabled=false` si no pasa el gate ADR-018.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Listado | Extender `src/lib/services/provider.service.ts` (`listProviders`) |
| ETA | `src/lib/geo/haversine.ts`, `src/lib/geo/eta.ts` |
| Route ETA | `src/app/api/providers/[id]/eta/route.ts` |

---

## Referencias

- ADR-016 mapa FE: [`../../comun/adrs/ADR-016-maps-engine.md`](../../comun/adrs/ADR-016-maps-engine.md)
- Addresses: [`API-ADDRESSES-01.md`](./API-ADDRESSES-01.md)
- Diagrama: [`../diagrams/ARCH-GEO-01.md`](../diagrams/ARCH-GEO-01.md)
