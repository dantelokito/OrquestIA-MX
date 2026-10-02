# Handoff de Feature: FEAT-TYPEAHEAD

> **Proyecto:** laborregamarket  
> **Feature:** EXPLORE / ExploreTypeahead  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-25  
> **Wireframe:** `WF-explorar-typeahead`  
> **Contrato:** `API-GEO-01` + `ARCH-EXPLORE-TYPEAHEAD-01`  
> **US:** US-EXPLORE-09

---

## 1. Componentes

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ExploreTypeahead` | `src/components/explore/ExploreTypeahead.tsx` | Debounce 300 ms; listbox; cover+nombre |
| Header integrar | `src/components/layout/Header.tsx` | Solo ruta `/explorar` |
| Chip «Filtro: q» | `ExplorePageClient.tsx` | Aviso + tacha parcial; typeahead clear limpia chips |

---

## 2. Integración API

`GET /api/providers?q&lat&lng&radiusKm&limit=10&page=1` (+ filtros activos). **Sin** `/suggest`.

- `q` &lt; 2 → no GET  
- Sin pin → copy «Elige una ubicación para buscar fruterías.»  
- Vacío → «No hay fruterías con ese nombre en este radio.»  
- Clear (tacha) limpia `q` + verified/category/offersWholesale/offersDelivery

---

## 3. A11y

`combobox` + `listbox`/`option`; Escape; `aria-expanded`; filas ≥44px.

---

## 4. DoD

- [x] Solo fruterías; sin SKUs  
- [x] Matches fuera de página 1 (corpus servidor)  
- [x] Selección aplica filtro + aviso  
