# ADR-028 — Viewport y validación geo: bbox México

> **Estado:** Aceptado  
> **Fecha:** 2026-08-24  
> **Decisores:** Arquitecto de Software  
> **Fase:** 8 — v0.8.3  
> **US:** US-GEO-23  
> **CO:** CO-F8-002  
> **Relacionado:** [ADR-020](./ADR-020-maps-engine-leaflet.md) (append F8), [ADR-026](./ADR-026-explore-default-san-nicolas.md)

---

#### 1. Contexto y Problema:

F4/F7 rechazan `lat`/`lng` fuera del bbox AMM (25.4–25.9 / −100.6–−99.8) con **400**. `CO-F8-002` acota el mapa de `/explorar` a **México** (no al mundo, no solo AMM): pan no debe llegar a EUA/Guatemala, pero un pin en CDMX es territorio válido. Un 400 AMM haría inconsistente el mapa nacional. El filtro de negocio sigue siendo **Haversine** (`US-GEO-02`); **no** hay bbox Must de lista. Polígono INEGI es Won't F8.

---

#### 2. Opciones Consideradas:

* **Opción A — Rectángulo canónico `MEXICO_BOUNDS` (SW/NE) + `isInMexico` + `minZoom` Leaflet:** Pros: una constante FE+BE; sin dataset INEGI; Leaflet `maxBounds` nativo. Contras: el rectángulo incluye franjas de mar y un poco de frontera (Texas/Guatemala).
* **Opción B — Conservar 400 AMM en API y solo `maxBounds` MX en el mapa:** Pros: mercado local estricto. Contras: pin en CDMX (dentro de MX) → 400; choca con US-GEO-23.
* **Opción C — Polígono INEGI / Natural Earth en servidor:** Pros: borde político. Contras: peso, mantenimiento, fuera de Must F8.

---

#### 3. Decisión Elegida:

**Opción A.** Una constante compartida. El rectángulo **sustituye** el bbox AMM como guard de Explorar (lista, URL, GPS, geocode, POST/PATCH addresses). **No** sustituye Haversine como predicado de `GET /api/providers`.

### Constante canónica

Envelope WGS84 tipo OSM/Natural Earth (México admin-0, rectángulo; no polígono):

```
MEXICO_BOUNDS = {
  south: 14.5329,
  west:  -118.3649,
  north: 32.7187,
  east:  -86.7104
}
```

```
function isInMexico(lat, lng):
  return lat >= 14.5329 && lat <= 32.7187
      && lng >= -118.3649 && lng <= -86.7104
```

Leaflet `/explorar` (Must FE):

| Opción | Valor |
|--------|-------|
| `maxBounds` | `[[south, west], [north, east]]` |
| `maxBoundsViscosity` | `1.0` (rebote en el borde) |
| `minZoom` | `5` (no ver el continente; no sustituye `maxBounds`) |

Nominatim cliente (Must FE; **no** Places):

```
MEXICO_VIEWBOX = "-118.3649,32.7187,-86.7104,14.5329"
```

(`west,north,east,south`; sustituye `MONTERREY_VIEWBOX` en geocode de Explorar.)

San Nicolás ADR-026 (`25.7475, -100.2830`) **está** dentro de este rectángulo. Fallback de centro inválido = último pin válido o SN.

### Capas

| Capa | Prioridad | Comportamiento |
|------|-----------|----------------|
| FE mapa | Must | `maxBounds` + `minZoom`; pan/zoom **no** cambian `radiusKm` (`CO-F7-001`) |
| FE pin / GPS / geocode / `?lat&lng` | Must | Fuera de MX → no adoptar; copy no técnico; SN o último pin |
| BE `GET /api/providers` | Should | `lat`/`lng` con `!isInMexico` → **400** envelope ADR-003 (`details` en `lat`/`lng`). **No** remap silencioso a SN |
| BE POST/PATCH addresses | Must (mismo helper, sin ruta nueva) | Fuera de MX → 400. CDMX válido |
| Lista | Must | Solo Haversine + filtros F7. **Prohibido** `WHERE lat BETWEEN south AND north` como filtro de negocio |

### Qué NO hacer

- Polígono INEGI Must.
- Query `south`/`west`/`north`/`east` en `GET /api/providers`.
- Google Maps JS / Places / Distance Matrix.
- Clustering.
- Reabrir pan→radio (`US-GEO-07`).

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Mapa y API hablan el mismo “dentro de México”; CDMX no 400; un punto al norte del techo (p. ej. `33.0, -99.0`) sí se rechaza.
* **Riesgos / Compensaciones:** El rectángulo no es la frontera política; ciudades fronterizas de Texas (p. ej. Laredo) pueden pasar `isInMexico`. Aceptable en F8 (sin polígono INEGI). Si producto exige polígono, se abre otra fase.

Contrato: [`../../fase-8/api/API-GEO-01.md`](../../fase-8/api/API-GEO-01.md). Diagrama: [`../../fase-8/diagrams/ARCH-GEO-05.md`](../../fase-8/diagrams/ARCH-GEO-05.md).
