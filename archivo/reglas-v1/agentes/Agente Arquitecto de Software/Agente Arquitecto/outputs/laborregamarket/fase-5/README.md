# Fase 5 — GEO Leaflet/OSM, catálogo inhabilitado, marca PROVIDER

> **Producto:** LaBorregaMarket v0.5.0  
> **Fecha diseño:** 14/08/2026  
> **Estado:** Contratos diseñados · Quality Gate BE **APROBADO CON OBSERVACIONES** (97/100, 0 P0)

Handoff Backend: [`handoff-backend-fase-5.md`](./handoff-backend-fase-5.md)  
QG Arquitecto: [`quality/REVIEW-ARCH.md`](./quality/REVIEW-ARCH.md)  
Estafeta QA: [`quality/READY-FOR-QA.md`](./quality/READY-FOR-QA.md)

## ADRs (vivos en `comun/adrs/`)

| ADR | Archivo |
|-----|---------|
| 020 Leaflet + OSM | [`../comun/adrs/ADR-020-maps-engine-leaflet.md`](../comun/adrs/ADR-020-maps-engine-leaflet.md) |
| 021 Colores marca | [`../comun/adrs/ADR-021-provider-brand-colors.md`](../comun/adrs/ADR-021-provider-brand-colors.md) |
| 022 Catálogo inhabilitado | [`../comun/adrs/ADR-022-catalog-inactive.md`](../comun/adrs/ADR-022-catalog-inactive.md) |

ADR-016 queda **Reemplazado** por 020 (CO-F5-001). Índice: [`adrs/README.md`](./adrs/README.md).

## Contratos API

| ID | Archivo |
|----|---------|
| API-GEO-01 (delta motor) | [`api/API-GEO-01.md`](./api/API-GEO-01.md) |
| API-PROVIDER-PRODUCTS-01 | [`api/API-PROVIDER-PRODUCTS-01.md`](./api/API-PROVIDER-PRODUCTS-01.md) |
| API-PROVIDER-SETTINGS-01 (delta brand) | [`api/API-PROVIDER-SETTINGS-01.md`](./api/API-PROVIDER-SETTINGS-01.md) |
| API-SESSION-THEME-01 | [`api/API-SESSION-THEME-01.md`](./api/API-SESSION-THEME-01.md) |

## Modelo de datos

| ID | Archivo |
|----|---------|
| DB-providers (delta) | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |

## Diagramas

| ID | Archivo |
|----|---------|
| ARCH-GEO-02 | [`diagrams/ARCH-GEO-02.md`](./diagrams/ARCH-GEO-02.md) |
| ARCH-BRAND-01 | [`diagrams/ARCH-BRAND-01.md`](./diagrams/ARCH-BRAND-01.md) |

## Docs vivos

- SAD: [`../comun/sad.md`](../comun/sad.md)
- Infra: [`../comun/infra-requirements.md`](../comun/infra-requirements.md)

## Quality

| Archivo | Uso |
|---------|-----|
| [`quality/REVIEW-ARCH.md`](./quality/REVIEW-ARCH.md) | Dictamen QG Backend |
| [`quality/READY-FOR-QA.md`](./quality/READY-FOR-QA.md) | Estafeta @QA Tester |

## Fuera de alcance

Pasarela de pagos, CFDI, Google Maps JS API, Places, Distance Matrix, bbox Must, stock.
