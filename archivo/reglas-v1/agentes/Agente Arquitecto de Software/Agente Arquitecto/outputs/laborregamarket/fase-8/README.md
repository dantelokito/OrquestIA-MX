# Fase 8 — Explorar polish (Arquitecto)

> **Producto:** LaBorregaMarket v0.8.3  
> **Fecha diseño:** 24/08/2026  
> **Estado:** Contratos cerrados · listo para implementar (BE clamp; FE visual espera UX)

**Fase 7 solo lectura.** Fase 6 congelada. Pagos/CFDI Won't (`CO-F6-001`). `CO-F7-001` intacto (pan ≠ radio). `CO-F8-001` clamp 0.5–10. `CO-F8-002` viewport México. `CO-F8-003` preview sin botón.

## Contratos API

| ID | Archivo | Delta |
|----|---------|-------|
| API-GEO-01 | [`api/API-GEO-01.md`](./api/API-GEO-01.md) | Clamp 0.5–10; `isInMexico` Should; no bbox de lista |
| API-ADDRESSES-01 | [`api/API-ADDRESSES-01.md`](./api/API-ADDRESSES-01.md) | **Sin endpoint nuevo.** Inventario F4+F7; lat/lng → MX; DELETE pin permanece = FE |
| API-PROVIDER-PREVIEW-01 | [`api/API-PROVIDER-PREVIEW-01.md`](./api/API-PROVIDER-PREVIEW-01.md) | **Sin API nueva.** NFR debounce/cache hover |

## ADRs (vivos en `comun/adrs/`)

Índice: [`adrs/README.md`](./adrs/README.md). 020 append F8 · 028 México.

## Diagramas

| ID | Archivo |
|----|---------|
| ARCH-GEO-05 | [`diagrams/ARCH-GEO-05.md`](./diagrams/ARCH-GEO-05.md) |
| ARCH-PREVIEW-02 | [`diagrams/ARCH-PREVIEW-02.md`](./diagrams/ARCH-PREVIEW-02.md) |

Sin data-model nuevo (cero migración Prisma).

## Handoff Backend

[`handoff-backend-fase-8.md`](./handoff-backend-fase-8.md) — **obligatorio** por el clamp.

## Notas Frontend

- `MIN_RADIUS_KM=0.5`, `MAX_RADIUS_KM=10`, `DEFAULT_RADIUS_KM=10`, step 0.5. **Quitar `Math.round`** de `clampRadiusKm` (hoy mata 0.5).
- Círculo = `radiusKm * 1000` m. Copy R &lt; 1 km en metros (solo UI). CTA «Ampliar radio» no pasa de 10.
- Pan/zoom no refetch ni cambian `radiusKm` (`CO-F7-001`), acotados a `MEXICO_BOUNDS` + `minZoom` 5 + viscosidad 1.0.
- Nominatim: `MEXICO_VIEWBOX` (no Places). Resultado fuera de MX → no aplicar pin.
- DELETE de la favorita en uso: el **pin se queda**; no rehidratar SN (revoca nota F7).
- Preview: hover ~300 ms / close ~150 ms; long-press ~500 ms; un GET en vuelo; cache por `id`; sin botón «Vista rápida». Tap corto → `/fruteria/[id]`.
- Copy N = `meta.total`; R = `meta.radiusKm`. Empty: `200` + `total=0`.
- Centro: ADR-026 o last-used. Cookie: `credentials: 'include'` (ADR-025) — no es slice F8.

UX F8 aún no entregó wireframes: **no** implementar chrome visual hasta handoff UX. Sí se puede adelantar constantes y clamp.

## Quality

No emitir `quality/REVIEW-ARCH.md` ni `READY-FOR-QA.md` hasta cierre Backend (clamp + tests).

## Fuera de alcance

Pasarela, CFDI, lockfile Redis, CI YAML, Places, Distance Matrix, clustering, Maps JS, bbox Must de lista, polígono INEGI, DASH/PDF, FilterBar, merge de duplicados, pan→radio.
