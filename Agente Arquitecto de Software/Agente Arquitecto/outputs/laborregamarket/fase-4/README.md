# Fase 4 — Reseñas, Geo, Notify-scale, Analytics, Báscula

> **Producto:** LaBorregaMarket v0.4.0  
> **Fecha diseño:** 14/08/2026  
> **Estado:** Contratos diseñados · Quality Gate BE **APROBADO CON OBSERVACIONES** (97/100, 0 P0)

Handoff Backend: [`handoff-backend-fase-4.md`](./handoff-backend-fase-4.md)  
QG Arquitecto: [`quality/REVIEW-ARCH.md`](./quality/REVIEW-ARCH.md)  
Estafeta QA: [`quality/READY-FOR-QA.md`](./quality/READY-FOR-QA.md)

## ADRs (vivos en `comun/adrs/`)

| ADR | Archivo |
|-----|---------|
| 015 Cola Redis + Inngest | [`../comun/adrs/ADR-015-notification-queue.md`](../comun/adrs/ADR-015-notification-queue.md) |
| 016 Google Maps JS | [`../comun/adrs/ADR-016-maps-engine.md`](../comun/adrs/ADR-016-maps-engine.md) |
| 017 ETA Haversine | [`../comun/adrs/ADR-017-eta-formula.md`](../comun/adrs/ADR-017-eta-formula.md) |
| 018 Reseñas + Google gate | [`../comun/adrs/ADR-018-google-reviews.md`](../comun/adrs/ADR-018-google-reviews.md) |
| 019 Báscula drivers | [`../comun/adrs/ADR-019-scale-drivers.md`](../comun/adrs/ADR-019-scale-drivers.md) |

ADR-008 queda **Reemplazado** por 015.

## Contratos API

| ID | Archivo |
|----|---------|
| API-REVIEWS-01 | [`api/API-REVIEWS-01.md`](./api/API-REVIEWS-01.md) |
| API-GEO-01 | [`api/API-GEO-01.md`](./api/API-GEO-01.md) |
| API-ADDRESSES-01 | [`api/API-ADDRESSES-01.md`](./api/API-ADDRESSES-01.md) |
| API-ADMIN-ANALYTICS-01 | [`api/API-ADMIN-ANALYTICS-01.md`](./api/API-ADMIN-ANALYTICS-01.md) |
| API-PROVIDER-SETTINGS-01 | [`api/API-PROVIDER-SETTINGS-01.md`](./api/API-PROVIDER-SETTINGS-01.md) |
| API-ORDERS-01 (delta Should) | [`api/API-ORDERS-01.md`](./api/API-ORDERS-01.md) |
| API-NOTIFY-01 (delta) | [`api/API-NOTIFY-01.md`](./api/API-NOTIFY-01.md) |

## Modelo de datos

| ID | Archivo |
|----|---------|
| DB-reviews | [`data-model/DB-reviews.md`](./data-model/DB-reviews.md) |
| DB-addresses | [`data-model/DB-addresses.md`](./data-model/DB-addresses.md) |
| DB-providers (delta) | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |
| DB-orders (delta Should) | [`data-model/DB-orders.md`](./data-model/DB-orders.md) |

## Diagramas

| ID | Archivo |
|----|---------|
| ARCH-NOTIFY-02 | [`diagrams/ARCH-NOTIFY-02.md`](./diagrams/ARCH-NOTIFY-02.md) |
| ARCH-GEO-01 | [`diagrams/ARCH-GEO-01.md`](./diagrams/ARCH-GEO-01.md) |
| ARCH-REVIEWS-01 | [`diagrams/ARCH-REVIEWS-01.md`](./diagrams/ARCH-REVIEWS-01.md) |
| ARCH-SCALE-01 | [`diagrams/ARCH-SCALE-01.md`](./diagrams/ARCH-SCALE-01.md) |

## Quality

| Archivo | Uso |
|---------|-----|
| [`quality/REVIEW-ARCH.md`](./quality/REVIEW-ARCH.md) | Dictamen QG Backend |
| [`quality/READY-FOR-QA.md`](./quality/READY-FOR-QA.md) | Estafeta @QA Tester |

## Docs vivos

- SAD: [`../comun/sad.md`](../comun/sad.md)
- Infra: [`../comun/infra-requirements.md`](../comun/infra-requirements.md)
