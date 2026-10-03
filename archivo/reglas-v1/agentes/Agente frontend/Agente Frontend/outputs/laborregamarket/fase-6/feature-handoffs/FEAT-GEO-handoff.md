# Handoff de Feature: FEAT-GEO

> **Proyecto:** laborregamarket  
> **Feature:** GEO (delta F6: zoom ↔ radio + BrandLoader)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + Leaflet + react-leaflet  
> **Fecha:** 2026-08-16  
> **Wireframe:** `WF-explorar-zoom-radio`  
> **Contrato:** `API-GEO-01` (sin query nueva)  
> **US:** US-GEO-06 / 07 / 08 · DEV-P1-006

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Explorar zoom↔radio | `WF-explorar-zoom-radio` | `/explorar` | OK |
| Leaflet invariante | F5 | `/explorar` | OK (cero Maps JS) |

**Componentes:** `ExploreMap` (círculo + fitBounds slider), `RadiusClampHint`, `BrandLoader`, `radiusKmFromViewport`.

PNG: `public/brand/loader-borrega/B1.png` … `B3.png` (copia 1:1 del brand PM).

F5 Should bbox-clip de lista **retirado**. Clustering Won't.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers?lat&lng&radiusKm` | GET | `getProviders` | API-GEO-01 F4 | OK (Haversine) |

Cero `south/west/north/east`. Zoom/pan derivan el mismo `radiusKm` (debounce 300 ms). Pin fuera de viewport: no recalcular.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Refetch lista | BrandLoader B1–B3; `aria-busy`; mapa visible | Empty radio F5 + Ampliar | Lista previa + Reintentar | Lista = markers |
| Reduced motion | B1 estático | — | — | — |
| Clamp 25 | — | — | — | Hint "Máximo 25 km" |
| Teselas down | — | Banner F5 | lista usable | — |

Prohibido: splash, skeleton Must de refetch, Maps JS.

---

## 4. Formularios y validación

Slider 1–25; teclado `aria-valuenow`. Radio redondeado entero.

---

## 5. Responsive y accesibilidad

- [x] Lista first (a11y); mapa 300px móvil siempre visible
- [x] Hint no tapa attribution OSM (topright) ni CTA ubicación
- [x] sr-only "Buscando fruterías"
- [x] Círculo `aria-hidden` (path Leaflet); radio en label del slider

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/radius-from-viewport.test.ts tests/unit/providers-query.test.ts`

- [x] Pin fuera → null
- [x] Clamp 1–25
- [x] Query geo sin bbox

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

- Zoom out hasta 25 km → hint; slider mueve encuadre del círculo; lista = mismos markers; refetch no tapa el mapa.
- Leaflet/OSM; no pedir Google Maps key.
- Embed reseñas Google (`US-REV-03`) intacto en detalle.

### DevOps

`NEXT_PUBLIC_OSM_TILE_URL` opcional. Ver FEAT-ENV.
