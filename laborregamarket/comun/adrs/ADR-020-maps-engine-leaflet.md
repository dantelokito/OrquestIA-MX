# ADR-020 — Motor de mapa: Leaflet + OpenStreetMap

> **Estado:** Aceptado  
> **Fecha:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 5 — v0.5.0 · **Append F6:** 2026-08-16 (v0.6.1, CO-F6-002) · **Append F7:** 2026-08-18 (v0.7.1, CO-F7-001) · **Append F8:** 2026-08-24 (v0.8.3, CO-F8-001 / CO-F8-002)  
> **Reemplaza:** [ADR-016](./ADR-016-maps-engine.md)  
> **CO:** CO-F5-001 (revoca D-F4-2); F6 ajustaba D-F5-3 via CO-F6-002; **F7 revoca el modelo pan→radio** via CO-F7-001; **F8** acota clamp 0.5–10 y viewport a México

---

#### 1. Contexto y Problema:

Fase 4 eligió Google Maps JS API como motor único de `/explorar` (ADR-016). Sin clave de facturación el mapa cae al empty state "Mapa no disponible" (**OBS-F4-023**). Dante confirma que **no se pagará** esa API. El filtro de negocio (`GET /api/providers?lat&lng&radiusKm`, Haversine) y el embed/URL de reseñas Google (ADR-018 / US-REV-03) **no** deben cambiar. Hace falta un motor de mapa usable en local, QA y producción **sin clave de facturación**.

---

#### 2. Opciones Consideradas:

* **Opción A — Leaflet + teselas OSM (o equivalente Open Source):** Pros: cero billing Maps JS; cierra OBS-F4-023; el código F1/F3 ya usó Leaflet; attribution conocida. Contras: política de uso de teselas OSMF en producción; sin Places autocomplete nativo.
* **Opción B — Mantener Google Maps JS y exigir billing:** Pros: un SDK con pin/radio nativos. Contras: incompatible con la restricción de no pagar; el mapa sigue roto en local/QA.
* **Opción C — Mapa raster estático / sin mapa:** Pros: cero dependencia. Contras: no cumple US-GEO-04 (mapa interactivo); degrada descubrimiento.

---

#### 3. Decisión Elegida:

**Opción A.** `/explorar` renderiza Leaflet + teselas OpenStreetMap (o CDN Open Source equivalente). No hay feature flag de mapa dual con Google JS. El servidor **no** sirve teselas ni cambia el query geo.

### Reglas

| Aspecto | Valor |
|---------|-------|
| SDK | Leaflet en el cliente. Idea de implementación (no contrato ni AC): `leaflet` + `react-leaflet`, clustering, debounce 300 ms en `moveend`, `next/dynamic` con `ssr: false` |
| Teselas local/QA | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |
| Teselas prod | Respetar [OSMF Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) (User-Agent identificable, no hammering). Env opcional `NEXT_PUBLIC_OSM_TILE_URL` hacia un CDN compliant (Carto, MapTiler free, self-hosted) |
| Attribution | Visible: `© OpenStreetMap contributors` |
| Filtro radio | Servidor (`lat`/`lng`/`radiusKm` en API-GEO-01 F4). El mapa solo visualiza círculo y markers del **mismo** result set que la lista |
| Viewport / bbox | Should UX (lista recortada al viewport con debounce). **No** sustituye el radio. API `south/west/north/east` = Could, no Must F5 |
| Clustering | Should al alejar zoom |
| Fallback teselas | Error de red del mapa → empty state del mapa; **la lista sigue usable** |
| Clave Google JS | **No** requerida para Explorar. Cierra el fallback F4 "Mapa no disponible por falta de key" |

### Qué NO hacer

- Volver a exigir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` para `/explorar`.
- Sustituir Haversine por bounding box como filtro Must.
- Usar Places API, Distance Matrix ni Directions (ETA sigue siendo fórmula, ADR-017).
- Tocar el embed/URL de reseñas Google de proveedores verificados (ADR-018).
- Copiar nombres de paquetes npm o rutas de archivo a las US del PM.

### Layout Explorar (US-GEO-05, FE)

Sin cambio de API. CTA **Usar mi ubicación** en el banner superior; slider de radio (1–25 km, default 10) en el borde inferior del mapa. Favoritas F4 se conservan.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Mapa usable sin tarjeta Google; local/QA dejan de bloquearse en OBS-F4-023; el contrato Haversine F4 permanece estable.
* **Riesgos / Compensaciones:** Teselas OSM no son un SLA; en producción conviene un CDN. El bundle reintroduce Leaflet. Frontend debe retirar `@vis.gl/react-google-maps` (o loader JS) de `/explorar`.

---

## Append F6 (16/08/2026) — zoom ↔ `radiusKm` (CO-F6-002)

D-F5-3 dejaba el recorte al viewport como Should y **no** sustituía el radio. F6 (`US-GEO-07`) hace Must que zoom/pan y el slider sean el **mismo** `radiusKm` Haversine. El filtro de negocio **no** cambia a bbox. Clustering sigue Won't F6. API `south/west/north/east` sigue sin ser contrato Must.

### Derivación (solo cliente)

Centro = **pin** (GPS / favorita / arrastre). No se reemplaza por `map.getCenter()` al zoomear.

```
edges = N/S en lng del pin, E/W en lat del pin (bordes del viewport Leaflet)
radiusKm = clamp(round(min Haversine(pin → edge)), 1, 25)
```

Equivalente: `map.distance` en metros / 1000, luego `Math.round` (el FE ya usa `clampRadiusKm`). El círculo Leaflet usa `radiusKm * 1000` metros.

| Caso | Comportamiento |
|------|----------------|
| Zoom/pan termina | Debounce **~300 ms** en `moveend` / `zoomend` (no por frame). Luego hidratar URL y `GET /api/providers?lat&lng&radiusKm` |
| Slider cambia | Círculo al km elegido; mapa `fitBounds` del círculo; mismo GET |
| Viewport pediría &gt; 25 km | Clamp 25; slider al tope; hint no bloqueante; **no** llamar bbox |
| Pin fuera del viewport | No recalcular radio (conservar el último); evita colapsar el círculo al panear lejos del pin |
| `US-GEO-08` | Loader B1–B3 en la **lista** (`aria-busy`); cero API |

`ViewportReporter` que ya emite bounds en el cliente **no** se convierte en query string del servidor.

### Qué NO hacer (sigue vigente + F6)

- Añadir `south` / `west` / `north` / `east` a `GET /api/providers`.
- Clustering de markers.
- Cambiar Haversine F4 ni el motor Leaflet/OSM (`US-GEO-06`).

Nota de contrato F6 (histórico): [`../../fase-6/api/API-GEO-01.md`](../../fase-6/api/API-GEO-01.md). Diagrama F6: [`../../fase-6/diagrams/ARCH-GEO-03.md`](../../fase-6/diagrams/ARCH-GEO-03.md).

## Append F7 (18/08/2026) — pan/zoom ≠ `radiusKm` (CO-F7-001)

El append F6 (`US-GEO-07` / D-F6-9) queda **revocado**. El pan y el zoom son **solo vista**: no cambian `radiusKm`, slider, URL de radio ni disparan refetch.

Fuente de `radiusKm` = **slider** (1–25). El servidor recibe el valor del cliente y **clampa** 1–25 (no 400 por fuera de rango). Centro = pin / GPS / favorita / búsqueda de dirección. Slider → círculo + `fitBounds` + GET Haversine. Leaflet/OSM **invariante**. Sin bbox Must. Sin clustering.

Si el código F6 hidrató radio desde bordes del viewport, **revertir** en Frontend.

Contrato F7 (histórico clamp 1–25): [`../../fase-7/api/API-GEO-01.md`](../../fase-7/api/API-GEO-01.md). Diagrama F7: [`../../fase-7/diagrams/ARCH-GEO-04.md`](../../fase-7/diagrams/ARCH-GEO-04.md). Centro default: [ADR-026](./ADR-026-explore-default-san-nicolas.md).

## Append F8 (24/08/2026) — clamp 0.5–10 + viewport México (CO-F8-001, CO-F8-002)

`CO-F7-001` **sigue**: pan/zoom son solo vista; no cambian `radiusKm` ni disparan refetch. El pan queda **limitado a México** ([ADR-028](./ADR-028-mexico-bounds.md)); no al mundo.

### Radio (`CO-F8-001`)

Se **revoca solo el clamp 1–25** de F7 (`D-F7-3`). Mismo param `radiusKm` (decimal). Slider y servidor usan **el mismo** clamp. **Prohibido** `Math.round` a entero (rompe 0.5 km).

```
MIN_RADIUS_KM = 0.5
MAX_RADIUS_KM = 10
DEFAULT_RADIUS_KM = 10
RADIUS_STEP_KM = 0.5

clampRadiusKm(value):
  if NaN / ausente con pin → 10
  if value < 0.5 → 0.5
  if value > 10 → 10
  return value   // conservar 0.5, 1.5, 0.7; no round
```

Círculo Leaflet: `radiusKm * 1000` metros. Bookmark `radiusKm=22` → 10; `=0` → 0.5. `meta.radiusKm` = valor ya clampeado (**no 400** por fuera de rango).

### Viewport

`maxBounds` + `minZoom` + `isInMexico`: [ADR-028](./ADR-028-mexico-bounds.md). Encuadre al círculo (`fitBounds` / FitCircle) al cambiar pin o radio (paridad F7). Filtro de lista = Haversine; **no** bbox Must.

### Qué NO hacer (F8)

- Reabrir pan→radio (`US-GEO-07`).
- `Math.round` en el clamp FE.
- Param `radiusM` nuevo.
- Bbox nacional como predicado de `GET /api/providers`.
- Places / Maps JS / clustering / polígono INEGI Must.

Contrato vivo: [`../../fase-8/api/API-GEO-01.md`](../../fase-8/api/API-GEO-01.md). Diagrama: [`../../fase-8/diagrams/ARCH-GEO-05.md`](../../fase-8/diagrams/ARCH-GEO-05.md).

## Referencias

- US-GEO-04, US-GEO-05, CO-F5-001
- US-GEO-07, US-GEO-08, CO-F6-002, D-F6-9
- Geo API F4 (query intacta): [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)
- Delta motor F5: [`../../fase-5/api/API-GEO-01.md`](../../fase-5/api/API-GEO-01.md)
- Nota F6: [`../../fase-6/api/API-GEO-01.md`](../../fase-6/api/API-GEO-01.md)
- Diagrama F5: [`../../fase-5/diagrams/ARCH-GEO-02.md`](../../fase-5/diagrams/ARCH-GEO-02.md)
- US-GEO-10, CO-F7-001 (revoca pan→radio F6)
- Geo API F7: [`../../fase-7/api/API-GEO-01.md`](../../fase-7/api/API-GEO-01.md)
- Diagrama F7: [`../../fase-7/diagrams/ARCH-GEO-04.md`](../../fase-7/diagrams/ARCH-GEO-04.md)
- US-GEO-22, US-GEO-23, CO-F8-001, CO-F8-002
- Geo API F8: [`../../fase-8/api/API-GEO-01.md`](../../fase-8/api/API-GEO-01.md)
- Diagrama F8: [`../../fase-8/diagrams/ARCH-GEO-05.md`](../../fase-8/diagrams/ARCH-GEO-05.md)
- ADR-028 bbox México: [`./ADR-028-mexico-bounds.md`](./ADR-028-mexico-bounds.md)
- Infra: [`../infra-requirements.md`](../infra-requirements.md)
