# API-GEO-01 — Delta motor de mapa (Fase 5)

> **Endpoint:** `GET` `/api/providers` y `GET` `/api/providers/[id]/eta` — **sin cambio de query**  
> **Módulo:** `GEO`, `EXPLORE`  
> **Versión:** 0.5.0  
> **Fecha:** 14/08/2026  
> **US:** US-GEO-04, US-GEO-05  
> **Base F4:** [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)  
> **Autenticación:** Pública

Este documento es el **delta F5 del motor**. El contrato Haversine F4 (`lat`, `lng`, `radiusKm`, bbox Monterrey, orden `distanceKm ASC`) **sigue vigente**. No hay query nueva Must.

---

## Qué cambia

| Capa | F4 (ADR-016) | F5 (ADR-020) |
|------|----------------|--------------|
| Motor `/explorar` | Google Maps JS API | Leaflet + teselas OSM (o CDN Open Source) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Must para renderizar el mapa | **No** requerida para Explorar |
| Fallback sin key | Empty state "Mapa no disponible" (OBS-F4-023) | **Eliminado.** El mapa renderiza sin key Google |
| Fallback teselas | — | Error de red del mapa; **lista usable** |
| Attribution | Google | `© OpenStreetMap contributors` visible |
| Filtro de negocio | Radio Haversine | **Igual** |

El servidor **no** sirve teselas. Markers del mapa = mismo `data[]` que la lista.

---

## GET `/api/providers` — query (sin delta)

Parámetros, 400, Haversine, `distanceKm` y `meta.radiusKm`: ver F4.

**No** añadir `south` / `west` / `north` / `east` como Must. Bounding box API = Could (fuera de este contrato).

---

## GET `/api/providers/[id]/eta` — sin delta

Fórmula ADR-017 intacta. El cambio de motor no afecta ETA.

---

## Layout Explorar (US-GEO-05) — solo FE

Cero API:

- CTA **Usar mi ubicación** en el banner superior (no dentro del mapa).
- Slider de radio 1–25 km (default 10) en el borde inferior del mapa.
- Favoritas F4 (`API-ADDRESSES-01`) se conservan.
- Geolocation denegada: mapa centrado como hoy (Monterrey / última posición); lista no se vacía.

---

## Should UX (no contrato)

- Recortar la lista al viewport al terminar pan/zoom (debounce ~300 ms). **No** sustituye `radiusKm`.
- Clustering de markers al alejar zoom.
- Carga del mapa con `next/dynamic` `ssr: false` (idea ADR-020).

---

## Implementación sugerida

| Capa | Nota |
|------|------|
| BE | Ningún cambio de route geo |
| FE | Retirar Google Maps JS de `/explorar`; Leaflet + attribution; empty state de teselas distinto de "falta API key" |
| Teselas prod | `NEXT_PUBLIC_OSM_TILE_URL` opcional — ver infra |

---

## Referencias

- ADR-020: [`../../comun/adrs/ADR-020-maps-engine-leaflet.md`](../../comun/adrs/ADR-020-maps-engine-leaflet.md)
- ADR-016 (reemplazado): [`../../comun/adrs/ADR-016-maps-engine.md`](../../comun/adrs/ADR-016-maps-engine.md)
- Query F4: [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)
- Diagrama: [`../diagrams/ARCH-GEO-02.md`](../diagrams/ARCH-GEO-02.md)
