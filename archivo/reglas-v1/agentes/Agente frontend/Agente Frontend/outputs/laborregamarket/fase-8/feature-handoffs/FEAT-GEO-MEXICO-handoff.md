# Handoff de Feature: FEAT-GEO-MEXICO

> **Proyecto:** laborregamarket
> **Feature:** GEO / mapa acotado a México + FitCircle
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + Leaflet + OSM
> **Fecha:** 2026-08-24
> **Wireframe:** `WF-explorar-mapa-mexico`
> **Contrato:** `API-GEO-01` F8 · ADR-028 · `CO-F8-002`
> **US:** US-GEO-23

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Mapa México | `WF-explorar-mapa-mexico` | `/explorar` | OK |

**Componentes / módulos:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ExploreMap` | `src/components/explore/ExploreMap.tsx` | `maxBounds` ADR-028; viscosity 1; `minZoom` 5 |
| `MEXICO_MAP_BOUNDS` / `MEXICO_VIEWBOX` | `src/lib/maps/constants.ts` | Leaflet + Nominatim |
| `OutOfMexicoBanner` | `src/components/explore/OutOfMexicoBanner.tsx` | Copy Must; ≠ GPS denegado |
| `geocodeAddress` | `src/lib/maps/nominatim.ts` | Viewbox México; rechazo `!isInMexico` |

Círculo = `radiusKm * 1000` m. FitCircle al cambiar slider / GPS / dirección / favorita. Pan interno = solo vista (`CO-F7-001`).

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers` | GET | `getProviders` | API-GEO-01 | OK — FE **no envía** coords fuera de MX |

- Fallback: último pin válido o San Nicolás. BE Should: 400; el servidor **no** remapea a SN.
- CDMX es válido. No usar Laredo como caso 400 (el rectángulo puede incluirlo).

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Teselas | — | — | “El mapa no cargó; usa la lista” | OSM |
| Fuera de MX | — | — | Banner ámbar; pin no cambia | — |
| GPS denegado | — | — | Copy F5/F7 (San Nicolás, sin coords) | — |

---

## 4. Formularios y validación

GPS / geocode / drag / URL: `isInMexico` antes de `setPin` / GET.

---

## 5. Responsive y accesibilidad

- [x] Rebote de borde (viscosity 1) — el usuario entiende el límite
- [x] GPS denegado ≠ GPS fuera de México
- [x] `prefers-reduced-motion`: FitCircle instantáneo
- [x] Lista alternativa al mapa (F7)

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/nominatim.test.ts tests/unit/explore-f8.test.ts tests/unit/geo.test.ts`

- [x] Nominatim `MEXICO_VIEWBOX`
- [x] SN y CDMX dentro; `33.0,-99.0` fuera

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario**
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Panear hacia Texas: el mapa rebota; N/R no cambian.
- URL `lat=33&lng=-99`: banner + fallback SN o último pin; no GET con esas coords.

### DevOps

Sin variables nuevas. Leaflet/OSM invariante — no Maps JS.
