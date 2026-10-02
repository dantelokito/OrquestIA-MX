# Handoff de Feature: FEAT-GEO-RADIUS

> **Proyecto:** laborregamarket
> **Feature:** GEO / overlay de radio compacto 0.5–10 km
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + Leaflet
> **Fecha:** 2026-08-24
> **Wireframe:** `WF-explorar-radio`
> **Contrato:** `API-GEO-01` (F8) · `CO-F8-001` · `CO-F7-001`
> **US:** US-GEO-21 · US-GEO-22 · US-GEO-20 (copy)

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Overlay radio compacto | `WF-explorar-radio` | `/explorar` | OK |

**Componentes / módulos:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `RadiusSlider` | `src/components/explore/RadiusSlider.tsx` | Una fila: valor + range 0.5–10 step 0.5 + extremos 500 m / 10 km |
| `formatRadius` | `src/lib/maps/format-radius.ts` | R&lt;1 → metros; R≥1 → km |
| `ExploreCount` | `src/components/explore/ExploreCount.tsx` | `{N} fruterías a {formatRadius(R)}` desde `meta` |
| `clampRadiusKm` | `src/lib/api/providers.ts` | Delega a `clampGeoRadiusKm` — **sin** `Math.round` |

Retirado del overlay: `RadiusClampHint` “Máximo 25 km”. Ampliar radio = **+0.5**; oculto si R = 10.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers?lat&lng&radiusKm&…&limit=20` | GET | `getProviders` | API-GEO-01 F8 | OK |

- Slider → FitCircle + GET. Pan **no** (`CO-F7-001`).
- Bookmark 22→10, 0→0.5, 0.7 se queda 0.7. Radio fuera de rango = clamp, no 400.
- Copy en metros es solo UI; el param sigue `radiusKm`.

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Lista | BrandLoader 64px | “No hay fruterías en este radio” + Ampliar radio (oculto en 10) | ErrorBanner | Conteo + cards |
| Overlay | — | — | — | Valor visible sin abrir nada |

---

## 4. Formularios y validación

`input[type=range]` min=0.5 max=10 step=0.5. `aria-valuetext` = `formatRadius`.

---

## 5. Responsive y accesibilidad

- [x] Overlay `px-3 py-1.5` `z-[400]` — más bajo que F7
- [x] Range teclado; thumb hit area `h-11`
- [x] Copy de tope = 10 km, nunca 25 km
- [x] Attribution OSM no tapada a propósito (misma ancla bottom)

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/providers-query.test.ts tests/unit/format-radius.test.ts tests/unit/explore-f8.test.ts`

- [x] Clamp 0.5 / 10 / 0.7 / 22 / 0
- [x] `formatRadius(0.5)` → `500 m`; `formatRadius(10)` → `10 km`

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

- Overlay una fila; no hint 25 km. Ampliar radio oculto en 10 km.
- Pan/zoom no cambian N ni R.

### DevOps

Sin variables nuevas.
