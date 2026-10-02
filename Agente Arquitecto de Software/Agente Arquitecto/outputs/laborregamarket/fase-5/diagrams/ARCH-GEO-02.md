# ARCH-GEO-02 — Explorar con Leaflet/OSM

> **Componente / Flujo:** `/explorar` Leaflet + teselas OSM + filtro Haversine (query F4 intacta)  
> **Fecha:** 14/08/2026  
> **Fase:** 5 — v0.5.0

---

## Flujo explorar (motor F5)

```mermaid
sequenceDiagram
  participant UI as ExplorarPage
  participant Map as LeafletOSM
  participant API as GET_providers
  participant DB as PostgreSQL

  UI->>Map: dynamic import ssr false
  Map->>Map: teselas OSM o CDN
  UI->>UI: pin GPS banner o favorita
  UI->>API: lat lng radiusKm plus F2 filters
  API->>DB: active providers Haversine
  API-->>UI: data plus distanceKm
  UI->>Map: markers and radius circle
  Map-->>UI: tile error keeps list usable
```

El servidor no sirve teselas. Markers = mismo `data[]` que la lista. Query: [`../api/API-GEO-01.md`](../api/API-GEO-01.md) (delta motor) + [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md) (Haversine).

---

## Layout (US-GEO-05, FE)

```mermaid
flowchart TD
  Banner[Banner_Usar_mi_ubicacion]
  MapBox[Mapa_Leaflet]
  Slider[Slider_radio_1_a_25]
  List[Lista_tarjetas]
  Banner --> MapBox
  MapBox --> Slider
  MapBox --> List
  Banner -->|lat lng URL| API[GET_providers]
  Slider -->|radiusKm| API
```

Favoritas F4 se conservan (selector compacto o en banner: UX). Radio **no** es bounding box.

---

## Should (no Must API)

```mermaid
flowchart LR
  PanZoom[Pan_o_zoom] -->|debounce 300ms| Viewport[Recorte_lista_viewport]
  PanZoom --> Cluster[Cluster_markers]
  Viewport -.->|no sustituye| Radio[radiusKm_Haversine]
```

API `south/west/north/east` = Could, no especificada.

---

## Qué ya no aplica

Google Maps JS en `/explorar` (ADR-016 **Reemplazado**). Embed/URL de reseñas Google en ficha de frutería verificada (ADR-018) **sí** permanece, fuera de este diagrama.

ARCH-GEO-01 F4 queda como histórico del diseño Maps JS; la narrativa F5 usa este archivo.

---

## Referencias

- [`../../comun/adrs/ADR-020-maps-engine-leaflet.md`](../../comun/adrs/ADR-020-maps-engine-leaflet.md)
- Addresses F4: [`../../fase-4/api/API-ADDRESSES-01.md`](../../fase-4/api/API-ADDRESSES-01.md)
- ETA: [`../../comun/adrs/ADR-017-eta-formula.md`](../../comun/adrs/ADR-017-eta-formula.md)
