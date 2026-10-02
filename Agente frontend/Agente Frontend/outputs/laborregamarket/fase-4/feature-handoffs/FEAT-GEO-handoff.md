# Handoff de Feature: FEAT-GEO

> **Proyecto:** laborregamarket  
> **Feature:** GEO (Maps JS, radio, favoritas)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + `@vis.gl/react-google-maps`  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-explorar-geo`  
> **Contrato:** `API-GEO-01`, `API-ADDRESSES-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Explorar geo | `WF-explorar-geo` | `/explorar` | OK |
| MiniMap detalle / onboarding | — | `/fruteria/[id]`, `/registro/negocio` | OK |

**Componentes:** `LocationBar`, `RadiusSlider`, `FavoriteAddressSelect`, `ExploreMap` (Google), `MiniMap` (Google)

Leaflet / OSM eliminados del bundle.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers?lat&lng&radiusKm` | GET | `getProviders` + `buildProvidersQuery` | API-GEO-01 | OK |
| `/api/users/me/addresses` | GET/POST | `listMyAddresses` / `createAddress` | API-ADDRESSES-01 | OK |

- [x] Cookie de sesión (`credentials: include`)
- [x] 401 al guardar → `/login?redirect=/explorar` + pin en sessionStorage (`lbm.explore.pin`)
- [x] Sin `fetch` en vistas; capa `lib/api/`

URL: `?lat&lng&radiusKm` + chips F2 (`q`, `category`, `verified`, `page`). Radio default 10, rango 1–25.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| `/explorar` | 6 skeletons + mapa pulse | Radio: “No hay fruterías en este radio” + Ampliar; filtros F2 | ErrorBanner + Reintentar | Lista + Maps + distancia |
| Sin key / Maps down | — | “Mapa no disponible” | lista usable | — |
| Sin geo | — | listado F2 centro Monterrey | — | CTA ubicación |

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes |
|------------|--------|----------|
| Geocode | ≥3 caracteres | inline |
| Guardar favorita | label 1–40, bbox Monterrey (API) | 401 → login |

Geocoder JS (`google.maps.Geocoder`); **sin** Places Autocomplete.

---

## 5. Responsive y accesibilidad

- [x] Lista siempre visible (a11y); mapa 300px en móvil
- [x] Slider teclado `aria-valuenow` 1–25; touch ≥44px
- [x] Tab order: LocationBar → lista → mapa

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/providers-query.test.ts`

---

## 7. DoD Frontend

- [x] Pixel-fidelidad (LocationBar + radio)
- [x] Responsive
- [x] 4 estados
- [x] Consumo limpio de APIs
- [x] Accesibilidad basal

---

## 8. Notas para downstream

### QA Tester

- Flujos: ubicación / pin / radio / favoritas; empty radio; sin `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Preservar FilterBar F2 y ContactCTA

### DevOps

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` con restricción HTTP referrer
