# ADR-016 — Motor de mapa: Google Maps JS API

> **Estado:** Reemplazado por [ADR-020](./ADR-020-maps-engine-leaflet.md)  
> **Fecha:** 2026-08-14  
> **Reemplazado:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 4 — v0.4.0  
> **Motivo:** CO-F5-001 / D-F5-2 — no se pagará Google Maps JS; OBS-F4-023

---

#### 1. Contexto y Problema:

`/explorar` usa Leaflet + teselas OpenStreetMap. US-GEO-01 pide mapa interactivo con radio 1–25 km, pin de ubicación y direcciones favoritas. PM (D-F4-2) recomienda **reemplazo único** de Leaflet por Google Maps JS API; Arquitecto debe confirmar vs coexistencia temporal. El listado de providers sigue siendo `GET /api/providers` (filtro Haversine en servidor, ADR no cubre teselas).

---

#### 2. Opciones Consideradas:

* **Opción A — Reemplazo total Google Maps JS API:** Pros: Places autocomplete futuro, Street View/embed reseñas (US-REV-03), un solo SDK, UX de pin/radio nativa. Contras: API key, billing, restricción de dominio, quitar `leaflet`/`react-leaflet`.
* **Opción B — Coexistencia temporal Leaflet + Google:** Pros: rollback fácil. Contras: dos SDKs, bundle mayor, estados de mapa duplicados, deuda inmediata.
* **Opción C — Mantener Leaflet + overlay de radio:** Pros: cero costo Maps. Contras: no cumple D-F4-2 ni el embed Google de reseñas verificadas.

---

#### 3. Decisión Elegida:

**Opción A — reemplazo único.** Quitar Leaflet/OSM del bundle de `/explorar` en el mismo sprint F4. No hay feature flag de mapa dual.

### Reglas

| Aspecto | Valor |
|---------|-------|
| SDK | `@vis.gl/react-google-maps` o loader oficial JS API (Frontend elige; un solo wrapper) |
| Clave | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` con **restricción HTTP referrer** (dominio prod + localhost) |
| APIs habilitadas | Maps JavaScript API. **No** Places Data / Place Details para importar reseñas (D-F4-1) |
| Embed reseñas | URL o Place ID del proveedor → iframe/enlace "Ver reseñas en Google" (ADR-018) |
| Filtro radio | Servidor (`lat`/`lng`/`radiusKm` en API-GEO-01); el mapa solo visualiza círculo y markers |
| Fallback | Si la key falta en local: empty state "Mapa no disponible" + listado de tarjetas intacto |

### Qué NO hacer

- Dejar Leaflet en `/explorar` "por si acaso".
- Usar Distance Matrix ni Directions (Could; ETA es fórmula, ADR-017).
- Importar reseñas vía Places API.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Un motor; alineado a embed Google de proveedores verificados; radio/pin en el mismo SDK.
* **Riesgos / Compensaciones:** Billing Google; key pública (mitigar con referrer + cuotas). Frontend debe migrar markers/popup existentes en un PR.

## Referencias

- US-GEO-01, US-REV-03
- Geo API: [`../../fase-4/api/API-GEO-01.md`](../../fase-4/api/API-GEO-01.md)
- Diagrama: [`../../fase-4/diagrams/ARCH-GEO-01.md`](../../fase-4/diagrams/ARCH-GEO-01.md)
- Infra: [`../infra-requirements.md`](../infra-requirements.md)
