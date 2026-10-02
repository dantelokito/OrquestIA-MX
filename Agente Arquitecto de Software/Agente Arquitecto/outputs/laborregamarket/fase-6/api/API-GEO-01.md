# API-GEO-01 — Nota zoom ↔ radio (Fase 6)

> **Endpoint:** `GET` `/api/providers` — **sin cambio de query**  
> **Módulo:** `GEO`, `EXPLORE`  
> **Versión:** 0.6.1  
> **Fecha:** 16/08/2026  
> **US:** US-GEO-07, US-GEO-08  
> **ADR:** append [`../../comun/adrs/ADR-020-maps-engine-leaflet.md`](../../comun/adrs/ADR-020-maps-engine-leaflet.md)  
> **Base F4:** [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)  
> **Delta motor F5:** [`../../fase-5/api/API-GEO-01.md`](../../fase-5/api/API-GEO-01.md)  
> **Autenticación:** Pública

Este documento es la **nota F6 del visualizador**. El contrato Haversine (`lat`, `lng`, `radiusKm`, bbox Monterrey, orden `distanceKm ASC`) **sigue vigente**. No hay query nueva. No hay ruta nueva. Backend **no** implementa GEO en este slice.

---

## Qué no cambia (servidor)

| Capa | F4 / F5 | F6 |
|------|---------|-----|
| Query | `lat` `lng` `radiusKm` 1–25 | Igual |
| Filtro | Haversine, no bbox | Igual |
| Motor mapa | Leaflet + OSM (ADR-020) | Igual (`US-GEO-06`) |
| ETA | ADR-017 | Igual |
| `south/west/north/east` | Could, no Must | Sigue **fuera** |

400, Haversine, `distanceKm` y `meta.radiusKm`: ver F4. Markers = mismo `data[]` que la lista.

---

## Qué cambia (solo cliente, US-GEO-07)

El FE **hidrata** `radiusKm` desde el visualizador y reusa `GET /api/providers?lat&lng&radiusKm`.

| Evento | `radiusKm` | Lista / markers |
|--------|-----------|-----------------|
| Zoom o pan (debounce ~300 ms al **terminar**) | `round(min distancia pin → cuatro bordes del viewport)`, clamp 1–25 | Mismo GET; mismo result set |
| Slider 1–25 | Valor del slider | Círculo + `fitBounds`; mismo GET |
| Clamp 25 km | Tope; hint no bloqueante | No llamar bbox |
| Pin fuera del viewport | Conservar último radio | No refetch por derivación |

Centro = pin (GPS / favorita / drag). URL `lat` / `lng` / `radiusKm` hidratada; back/forward restaura. Círculo **siempre visible** si hay coords.

Fórmula y excepciones: append ADR-020. El `ViewportReporter` existente (bounds en memoria) **no** se serializa al API.

---

## US-GEO-08 — sin API

Loader borrega B1→B2→B3 en la **lista** durante el refetch (`aria-busy`, sr-only “Buscando fruterías”). Mapa y círculo siguen visibles. Error de red: ErrorBanner + lista previa. `prefers-reduced-motion: reduce` → solo B1. Runtime FE: `public/brand/loader-borrega/` (copia de `comun/brand/loader-borrega/`).

---

## Implementación sugerida

| Capa | Nota |
|------|------|
| BE | Ningún cambio de route geo |
| FE | Derivar radio en `moveend`/`zoomend` + debounce; slider → `fitBounds`; no N requests por frame |
| QA | Zoom/slider/lista = mismo set; clamp 25; `aria-busy` |

---

## Referencias

- CO-F6-002, D-F6-9, D-F6-10
- Diagrama: [`../diagrams/ARCH-GEO-03.md`](../diagrams/ARCH-GEO-03.md)
- Motor F5: [`../../fase-5/diagrams/ARCH-GEO-02.md`](../../fase-5/diagrams/ARCH-GEO-02.md)
