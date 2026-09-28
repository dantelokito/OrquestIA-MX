# Fase 7 — Explorar UX + AUTH cross-device (Arquitecto)

> **Producto:** LaBorregaMarket v0.7.1  
> **Fecha diseño:** 18/08/2026  
> **Estado:** Contratos cerrados · listo para implementar

**Fase 6 congelada.** Pagos/CFDI Won't (`CO-F6-001`). `CO-F7-001` anula pan→radio.

## Contratos API

| ID | Archivo |
|----|---------|
| API-GEO-01 | [`api/API-GEO-01.md`](./api/API-GEO-01.md) |
| API-ADDRESSES-01 | [`api/API-ADDRESSES-01.md`](./api/API-ADDRESSES-01.md) |
| API-PROVIDER-PREVIEW-01 | [`api/API-PROVIDER-PREVIEW-01.md`](./api/API-PROVIDER-PREVIEW-01.md) |
| API-PROVIDER-SETTINGS-01 | [`api/API-PROVIDER-SETTINGS-01.md`](./api/API-PROVIDER-SETTINGS-01.md) |
| API-AUTH-01 | [`api/API-AUTH-01.md`](./api/API-AUTH-01.md) |

## ADRs (vivos en `comun/adrs/`)

Índice: [`adrs/README.md`](./adrs/README.md). 025 cookie · 026 SN · 027 lastUsed · 020 append F7.

## Diagramas / data-model

| ID | Archivo |
|----|---------|
| ARCH-GEO-04 | [`diagrams/ARCH-GEO-04.md`](./diagrams/ARCH-GEO-04.md) |
| ARCH-PREVIEW-01 | [`diagrams/ARCH-PREVIEW-01.md`](./diagrams/ARCH-PREVIEW-01.md) |
| DB-addresses | [`data-model/DB-addresses.md`](./data-model/DB-addresses.md) |
| DB-providers | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |

## Handoff Backend

[`handoff-backend-fase-7.md`](./handoff-backend-fase-7.md)

## Notas Frontend

- Pan/zoom no refetch ni cambian `radiusKm`.
- Copy N = `meta.total`; R = `meta.radiusKm`.
- Centro: ADR-026 `25.7475, -100.2830` o last-used.
- Cookie: `credentials: 'include'` (ADR-025).
- Empty: `200` + `total=0` → loader tamaño empty (`US-GEO-16`). Error ≠ empty.
- `localStorage` no es origen de favoritas.

## Quality

No emitir `quality/REVIEW-ARCH.md` ni `READY-FOR-QA.md` hasta cierre Backend.

## Fuera de alcance

Pasarela, CFDI, lockfile Redis, CI YAML, Places, Distance Matrix, clustering, Maps JS, bbox Must, DASH/PDF.
