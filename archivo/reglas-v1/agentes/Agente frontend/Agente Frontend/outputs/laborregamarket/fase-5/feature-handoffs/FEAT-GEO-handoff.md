# Handoff de Feature: FEAT-GEO

> **Proyecto:** laborregamarket  
> **Feature:** GEO (Leaflet/OSM, layout Explorar)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + Leaflet + react-leaflet  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-explorar-leaflet`  
> **Contrato:** `API-GEO-01` (delta motor F5), `API-ADDRESSES-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Explorar Leaflet | `WF-explorar-leaflet` | `/explorar` | OK |
| MiniMap detalle / onboarding | — | `/fruteria/[id]`, `/registro/negocio` | OK |

**Componentes:** `FilterBar` + CTA ubicación, `CompactAddressBar`, `RadiusSlider` overlay, `ExploreMap` (Leaflet, `ssr: false`), `MiniMap` Leaflet.

Google Maps JS (`@vis.gl/react-google-maps`) retirado del bundle. Geocode: Nominatim cliente.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers?lat&lng&radiusKm` | GET | `getProviders` | API-GEO-01 | OK |
| `/api/users/me/addresses` | GET/POST | `listMyAddresses` / `createAddress` | API-ADDRESSES-01 | OK |

- [x] Cookie de sesión (`credentials: include`)
- [x] 401 al guardar → `/login?redirect=/explorar` + pin en sessionStorage
- [x] Sin `fetch` en vistas; capa `lib/api/` + `lib/maps/nominatim.ts`

URL: `?lat&lng&radiusKm` + chips F2. Radio default 10, rango 1–25.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| `/explorar` | 6 skeletons + mapa pulse | Radio: “No hay fruterías en este radio” + Ampliar | ErrorBanner API | Lista + Leaflet |
| Teselas down | — | Banner “El mapa no cargó; usa la lista” | lista usable | — |
| Sin geo | — | Mensaje no bloqueante; centro Monterrey | — | CTA ubicación |

Prohibido F5: fallback “Mapa no disponible” por falta de API key — **eliminado**.

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes |
|------------|--------|----------|
| Geocode Nominatim | ≥3 caracteres | inline |
| Guardar favorita | label 1–40, bbox API | 401 → login |

---

## 5. Responsive y accesibilidad

- [x] Lista siempre visible (a11y); mapa 300px en móvil
- [x] Slider overlay teclado `aria-valuenow` 1–25; labels `text-slate-500+`
- [x] CTA ubicación ≥44px en banner FilterBar
- [x] Attribution OSM `topright` (no tapada por el slider)
- [x] Tab order: FilterBar + CTA → barra compacta → lista → mapa/slider

Should: recorte de lista al viewport (debounce 300 ms). Clustering no incluido.

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/providers-query.test.ts tests/unit/nominatim.test.ts`

---

## 7. DoD Frontend

- [x] Pixel-fidelidad (banner + overlay radio)
- [x] Responsive
- [x] 4 estados (incl. teselas red)
- [x] Consumo limpio de APIs
- [x] Validación geocode
- [x] Accesibilidad basal

---

## 8. Notas para downstream

### QA Tester

- Flujos: Explorar sin `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; CTA banner; slider pie de mapa; Nominatim; teselas down.
- No exigir Maps JS key. Embed reseñas Google intacto.

### DevOps

- `NEXT_PUBLIC_OSM_TILE_URL` opcional. Dejar de exigir Maps JS key para Explorar.
