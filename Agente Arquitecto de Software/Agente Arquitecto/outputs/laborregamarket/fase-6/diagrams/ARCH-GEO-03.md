# ARCH-GEO-03 — Zoom y slider = mismo radio Haversine

> **Componente / Flujo:** `/explorar` deriva `radiusKm` del viewport; reusa GET providers F4  
> **Fecha:** 16/08/2026  
> **Fase:** 6 — v0.6.1

El motor Leaflet/OSM (ARCH-GEO-02) no cambia. Este diagrama es el **sync** visualizador ↔ slider ↔ lista.

---

## Sync zoom / pan → radio

```mermaid
sequenceDiagram
  participant Map as LeafletOSM
  participant FE as ExplorarPage
  participant API as GET_providers
  participant DB as PostgreSQL

  Map->>FE: moveend or zoomend
  FE->>FE: debounce 300ms
  FE->>FE: radiusKm from pin to viewport edges
  FE->>FE: clamp round 1 to 25
  FE->>FE: hydrate URL lat lng radiusKm
  FE->>API: lat lng radiusKm plus F2 filters
  API->>DB: Haversine F4
  API-->>FE: data plus distanceKm
  FE->>Map: same markers and circle
```

Si el pin está fuera del viewport, no se recalcula el radio (se conserva el último).

---

## Slider → mapa

```mermaid
flowchart TD
  Slider[Slider_1_a_25] --> Circle[Circulo_metros]
  Slider --> Fit[fitBounds_circulo]
  Slider --> URL[URL_radiusKm]
  URL --> API[GET_providers]
  Circle --> Map[Leaflet]
  Fit --> Map
```

---

## Clamp 25 km (sin bbox)

```mermaid
flowchart LR
  ZoomOut[Zoom_out] --> Derive[min_Haversine_pin_borde]
  Derive -->|gt 25| Clamp[radiusKm_25]
  Clamp --> Hint[Hint_no_bloqueante]
  Clamp --> API[GET_providers_radiusKm_25]
  Derive -->|lte 25| API
  Clamp -.->|no| BBox[south_west_north_east]
```

---

## Loading lista (US-GEO-08)

Cero API. Durante el refetch: loop B1–B3 en la lista (`aria-busy`). Mapa y círculo visibles. Fallo: ErrorBanner + lista previa.

---

## Referencias

- [`../api/API-GEO-01.md`](../api/API-GEO-01.md)
- Append [`../../comun/adrs/ADR-020-maps-engine-leaflet.md`](../../comun/adrs/ADR-020-maps-engine-leaflet.md)
- Query F4: [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)
- Motor F5: [`../../fase-5/diagrams/ARCH-GEO-02.md`](../../fase-5/diagrams/ARCH-GEO-02.md)
