# DB-providers — Delta Fase 4

> **Entidad:** `providers` (Prisma model `Provider`)  
> **Base F1/F2:** [`../../fase-1/data-model/DB-providers.md`](../../fase-1/data-model/DB-providers.md)  
> **Fecha:** 14/08/2026  
> **Versión:** 0.4.0  
> **No editar** el documento de fase-1; este archivo es el delta vivo F4.

---

## Campos nuevos

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `preparation_time_minutes` | `Int` | NOT NULL, DEFAULT `20` | Minutos de preparación (ADR-017). Rango app 5–120 |
| `offers_delivery` | `Boolean` | NOT NULL, DEFAULT `false` | Ofrece entrega a domicilio (US-ORDERS-05 Should) |
| `google_place_id` | `String` | NULLABLE | Place ID Maps (ADR-018) |
| `google_maps_url` | `String` | NULLABLE | URL de ficha Google Maps |
| `google_reviews_enabled` | `Boolean` | NOT NULL, DEFAULT `false` | Vitrina embed/enlace; solo efectiva si `is_verified=true` |

```prisma
preparationTimeMinutes Int     @default(20) @map("preparation_time_minutes")
offersDelivery         Boolean @default(false) @map("offers_delivery")
googlePlaceId          String? @map("google_place_id")
googleMapsUrl          String? @map("google_maps_url")
googleReviewsEnabled   Boolean @default(false) @map("google_reviews_enabled")

reviews Review[]
```

---

## Cambios de semántica (campos existentes)

| Campo | Antes (F1–F3) | Ahora (F4) |
|-------|---------------|------------|
| `rating` | Placeholder seed | Promedio real `AVG(Review.rating)`; 0 si no hay reseñas |
| `review_count` | Placeholder seed | `COUNT(Review)` |

Migración: backfill `rating = 0`, `review_count = 0` en producción (el seed demo puede insertar Reviews de prueba). **Prohibido** seguir tratando el seed estático como dato de negocio.

`is_verified`: al pasar a `false` (ADMIN), setear `google_reviews_enabled = false` en la misma transacción. No nullificar Place ID / URL.

---

## Reglas nuevas

1. **PATCH Google** (`googlePlaceId`, `googleMapsUrl`, `googleReviewsEnabled`) rechazado con **403** si `isVerified=false` (US-REV-04). Validar en servicio, no solo UI.
2. Activar `googleReviewsEnabled=true` exige al menos un identificador válido (Place ID **o** URL).
3. Place ID: string 10–255, típico prefijo `ChIJ` (no se verifica contra Google).
4. URL: hostname `google.com`, `maps.google.com` o `maps.app.goo.gl`; scheme `https`.
5. `preparationTimeMinutes` usado por `computeEtaMinutes` (ADR-017).
6. `offersDelivery=false` (default): checkout solo pickup (comportamiento F3).
7. Relación nueva `reviews` 1:N.

---

## Índices

Sin índice geoespacial dedicado en F4. Filtro radio = Haversine sobre `latitude`/`longitude` existentes.

**Umbral:** si `providers` activos **> 200** o p95 `GET /api/providers` con radio **> 2 s**, introducir extensión PostGIS + índice GiST `geography`. Documentar en OBSERVABILITY cuando se cruce.

Índices F1 (`city`, `businessName`, `isActive+isVerified`) se mantienen.

---

## API response explorar / detalle (campos extra F4)

Listado: + `distanceKm` (solo si query geo). `rating`/`reviewCount` reales.

Detalle `/api/providers/[id]`:

```json
{
  "googleReviews": {
    "enabled": true,
    "placeId": "ChIJ...",
    "mapsUrl": "https://maps.google.com/..."
  },
  "preparationTimeMinutes": 20,
  "offersDelivery": false
}
```

`googleReviews` se omite o `enabled: false` si no pasa el gate `isVerified && googleReviewsEnabled && (placeId || mapsUrl)`.

---

## Referencias

- ADR-017, ADR-018
- API settings: [`../api/API-PROVIDER-SETTINGS-01.md`](../api/API-PROVIDER-SETTINGS-01.md)
- Reviews: [`DB-reviews.md`](./DB-reviews.md)
