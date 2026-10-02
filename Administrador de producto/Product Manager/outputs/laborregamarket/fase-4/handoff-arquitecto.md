# Handoff Arquitecto — Fase 4

> **De:** Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 14/08/2026

## Decisiones a resolver (ADRs)

| ADR | Tema | Detalle |
|-----|------|---------|
| ADR-015 | Cola de notificaciones | Redis/Upstash + worker (BullMQ o equivalente ligero); cierra ADR-008 (rate limit in-memory → distribuido) |
| ADR-016 | Motor de mapa | Google Maps JS API en `/explorar`: ¿reemplazo total de Leaflet o coexistencia temporal? Recomendación PM: reemplazo único |
| ADR-017 | Cálculo de ETA | `preparationTimeMinutes` (config `Provider`) + tiempo de traslado estimado por distancia (fórmula simple vs Distance Matrix API — Must = fórmula simple) |
| ADR-018 | Reseñas Google | Modelo de datos para `googlePlaceId`/`googleMapsUrl` + regla `isVerified` como gate de escritura y lectura |
| ADR-019 | Báscula digital | Arquitectura de drivers WebSerial/WebHID: registry `usbVendorId:usbProductId` → parser; fallback de selección manual |

## Contratos a documentar (`fase-4/api/`)

| Contrato | US |
|----------|-----|
| API-REVIEWS-01 | US-REV-01…04 |
| API-GEO-01 (extensión `GET /api/providers`) | US-GEO-01…02 |
| API-ADDRESSES-01 | US-GEO-03 |
| API-ADMIN-ANALYTICS-01 | US-ADMIN-01 |
| API-PROVIDER-SETTINGS-01 (extensión) | `preparationTimeMinutes`, `googlePlaceId`, `googleReviewsEnabled`, `offersDelivery` |
| API-ORDERS-01 (extensión, Should) | US-ORDERS-05 (`fulfillmentType`, `deliveryAddressId`) |

## Delta de schema propuesto (a validar/ajustar por Arquitecto)

- `Review`: `id`, `orderId` (único), `clientId`, `providerId`, `rating` (1–5), `comment`, `createdAt`
- `UserAddress`: `id`, `userId`, `label`, `formattedAddress`, `lat`, `lng`, `isFavorite`, `isDefault`, timestamps
- `Provider` (+campos): `preparationTimeMinutes` (Int, default), `offersDelivery` (Bool, default false), `googlePlaceId`/`googleMapsUrl` (String?), `googleReviewsEnabled` (Bool, solo efectivo si `isVerified=true`)
- `Order` (Should, US-ORDERS-05): + `fulfillmentType` (enum `PICKUP`|`DELIVERY`, default `PICKUP`), `deliveryAddressId` (String?, snapshot)

## Requerimientos no funcionales

| Categoría | Requerimiento |
|-----------|---------------|
| Seguridad | `PATCH` a campos de Google en `Provider` debe rechazar server-side si `isVerified=false` (US-REV-04), no solo ocultar en UI |
| Consistencia | `Provider.rating`/`reviewCount` recalculados de forma atómica al crear/editar/borrar `Review` |
| Performance | Filtro por radio (US-GEO-02): Haversine sobre `latitude`/`longitude` es aceptable al volumen actual; documentar umbral para índice geoespacial dedicado |
| Resiliencia | Cola Redis con reintentos acotados (≤3) y `AuditLog` de fallo — mismo patrón que ADR-008 |
| Extensibilidad | El contrato de peso del POS (`quantity` + `unitOfMeasure`, ya definido en CO-001/F3) no cambia; la báscula solo autollena ese mismo campo |

## Fuera de alcance F4

Pasarela de pagos, CFDI, importación de reseñas vía Google Places API, logística de reparto real (rutas/flotilla), Distance Matrix API (Could, no Must).

## Dependencia DevOps

Redis/Upstash en staging, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (con restricción de dominio), credenciales de WhatsApp Business (sandbox) — documentar en `infra-requirements.md`.

## Entregables esperados

1. `adrs/ADR-015` … `ADR-019`
2. `api/API-REVIEWS-01.md`, `API-GEO-01.md` (delta), `API-ADDRESSES-01.md`, `API-ADMIN-ANALYTICS-01.md`
3. `data-model/DB-reviews.md`, `DB-addresses.md`; actualizar `DB-providers.md` y `DB-orders.md` (delta Should)
4. `handoff-backend-fase-4.md`
5. Actualizar `sad.md` y `OBSERVABILITY.md`
