# Handoff de Feature: FEAT-GEO-EXPLORE

> **Proyecto:** laborregamarket
> **Feature:** GEO / EXPLORE (delta F7: mapa-primero, pan ≠ radio, conteo real)
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4 + Leaflet + react-leaflet
> **Fecha:** 2026-08-18
> **Wireframe:** `WF-explorar-mapa-primero`
> **Contrato:** `API-GEO-01` (F7) + `MOD-GEO-handoff`
> **US:** US-GEO-09 / 10 / 12 / 13 / 15 / 16 · US-EXPLORE-06 · `CO-F7-001`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Explorar mapa-primero | `WF-explorar-mapa-primero` | `/explorar` | OK |
| Leaflet/OSM invariante | F5 | `/explorar` | OK (cero Maps JS) |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ExploreCount` | `src/components/explore/ExploreCount.tsx` | Copy `{N} fruterías a {R} km` desde `meta` |
| `ExploreMap` | `src/components/explore/ExploreMap.tsx` | Marker `Store` 28px + `Tooltip`; sin `ViewportReporter` |
| `CompactAddressBar` | `src/components/explore/CompactAddressBar.tsx` | Acepta `children` (conteo + hint `q`); copy de radio duplicado retirado |
| `BrandLoader` | `src/components/ui/BrandLoader.tsx` | Tamaños `loading` 64px / `empty` 80px (`md` 96px intacto) |

**Retirado (`CO-F7-001`):** `src/lib/maps/radius-from-viewport.ts` y `tests/unit/radius-from-viewport.test.ts`. El `.price-bubble` del marker se sustituye por `.store-pin` en `globals.css`; token nuevo `--explore-map-min-h-mobile: 360px`.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers?lat&lng&radiusKm&q&category&verified&page&limit=20` | GET | `getProviders` | API-GEO-01 F7 | OK |

- `limit` fijo **20** (`EXPLORE_PAGE_SIZE`).
- Copy de conteo usa `meta.total` y `meta.radiusKm` (nunca `data.length`).
- `q` de 1 carácter: no se envía y se muestra hint; ≥2 va como unión nombre ∪ producto (servidor).
- Pan/zoom: **cero** query. Slider / GPS / dirección / favorita: `setPin` → URL → GET + `fitBounds`.
- Paginación toca solo `page`: el mapa conserva viewport y radio.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Lista Explorar | `BrandLoader size="loading"` 64px + `aria-busy="true"` | 200 + `meta.total===0` → loader 80px + "No hay fruterías en este radio" + Ampliar radio / Limpiar búsqueda / Limpiar filtros | ErrorBanner + Reintentar (nunca empty borrega) | ≤20 cards + markers |
| Mapa | círculo y slider intactos durante refetch | sin markers | teselas caídas → "El mapa no cargó; usa la lista" | tooltip por marker |

Reduced motion: BrandLoader B1 estático; `fitBounds` con `animate: false`; `.store-pin` sin transición.

---

## 4. Formularios y validación

Slider 1–25 con clamp cliente + `RadiusClampHint` ("Máximo 25 km"). Búsqueda de dirección ≥3 caracteres (Nominatim); búsqueda de fruterías `q` ≥2 con hint "Escribe al menos 2 caracteres".

---

## 5. Responsive y accesibilidad

- [x] Móvil: mapa **arriba** `h-[var(--explore-map-min-h-mobile)]` = 360px; lista debajo full-width
- [x] Desktop: mapa dominante `lg:h-[calc(100vh-200px)]`, lista grid 2–3 cols, `max-w-7xl`
- [x] Markers sin label permanente; `aria-label` nombre + distancia; tooltip en hover/focus/tap
- [x] `aria-busy` en la región de lista; sr-only "Buscando fruterías"
- [x] Slider y CTA ubicación ≥44px, operables por teclado
- [x] Attribution OSM (topright) nunca tapada por el overlay del slider

**Desviación consciente:** el mapa desktop no usa `position: sticky`. En layout de una sola columna el sticky superpone la lista al hacer scroll; se prioriza que la lista quede legible. El mapa sigue siendo la primera región de contenido y conserva el alto +20% del token.

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/providers-query.test.ts tests/unit/explore-center.test.ts`

- [x] `q` de 1 carácter no viaja en la query
- [x] `limit=20` en la query de Explorar
- [x] Clamp 1–25 y geo solo con `lat`+`lng`

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

- Panear y hacer zoom: el slider, el copy `{N} fruterías a {R} km` y la lista **no** cambian; DevTools no debe registrar GET.
- Mover el slider / usar GPS / elegir favorita: refetch + reencuadre del círculo.
- Paginar: el mapa mantiene centro y zoom.
- 500 en `/api/providers` muestra ErrorBanner, **no** el empty de la borrega.

### DevOps

Sin variables nuevas. `NEXT_PUBLIC_OSM_TILE_URL` sigue siendo opcional.

---

## 9. Fix BUG-012 — FilterBar chrome fijo (23/08/2026)

**Ticket QA:** `BUG-012` Critical P1 — regresión post BUG-011.

**Síntoma:** chips de filtro y «Usar mi ubicación» scrolleaban con el contenido en `/explorar`.

**Causa:** `FilterBar` estaba dentro de `.explore-main-scroll`; `sticky top-[80px]` anclaba al contenedor con overflow, no al Header.

**Cambios:**

| Archivo | Cambio |
|---------|--------|
| `src/app/explorar/ExplorePageClient.tsx` | Wrapper `flex min-h-0 flex-1 flex-col`; `FilterBar` hermano `shrink-0` **fuera** de `.explore-main-scroll` |
| `src/components/explore/FilterBar.tsx` | Eliminado `sticky top-[80px]` (chrome estático bajo Header) |

**Sin tocar:** `MapFocusGuard` (`.explore-main-scroll`), `CO-F7-001`, `FitCircle`, API GEO.

**Verificación Frontend (23/08):**

- EC-GEO-18 Pass manual: `filterDelta=0`, `locationDelta=0` tras scroll 400px; `addrDelta=400`.
- EC-GEO-17 Pass manual: `scrollTop` estable (±0px) tras zoom en mapa.
- Unit tests: 202/202 Pass.
- Playwright `explore-f7.spec.ts`: 7/8 (EC-GEO-17 falla en spec por chequear `.explore-results-panel` en lugar de `.explore-main-scroll`; comportamiento manual correcto).

**Pendiente:** QA cierra BUG-012 tras re-prueba manual EC-GEO-18 + EC-GEO-17.

**Nota Frontend (23/08):** fix verificado en código; evidencia manual arriba. Listo para cierre formal QA.

---

## 10. Mejora BUG-013 — FilterBar colapsable (23/08/2026)

**Ticket QA:** `BUG-013` Major P2 — mejora UX (no Blocker).

**Objetivo:** al scroll hacia abajo en `.explore-main-scroll`, ocultar FilterBar para ganar viewport en mapa/cards; pestaña central «Filtros» para re-expandir sin perder chips activos.

**Prerrequisito:** BUG-012 (chrome fijo fuera del scroll).

**Cambios:**

| Archivo | Cambio |
|---------|--------|
| `src/hooks/useFilterBarCollapse.ts` | Scroll direccional + rAF (colapsa al bajar >48px; expande al subir o cerca del tope ≤8px) |
| `src/app/explorar/ExplorePageClient.tsx` | Integra hook; elimina umbrales binarios 100/40px |
| `src/components/explore/FilterBar.tsx` | Shell grid `0fr/1fr`; pestaña siempre en DOM con crossfade; badge filtros activos |
| `src/app/globals.css` | `.explore-filterbar-shell`, `.explore-filter-tab-row`; easing `cubic-bezier(0.4,0,0.2,1)`; `prefers-reduced-motion` |

**Refinamiento animación (23/08):** reemplazado `max-height` fijo por grid `0fr/1fr` y detección de dirección de scroll para transiciones más fluidas sin zona muerta ni saltos de layout al montar la pestaña.

**Overlay flotante (23/08):** chrome colapsado con `height: 0` en layout; pestaña «Filtros» como pill `position: absolute` con `background: rgba(255,255,255,0.88)` + `backdrop-filter: blur(8px)` — sin franja blanca full-width; mapa/cards recuperan viewport hasta el Header.

**Corrección in-flow strip (23/08):** abandonado modelo overlay (`height:0` + `absolute` + `z-index:50`) por grid dual-row en chrome (`1fr/0fr` ↔ `0fr/1fr`): pill en franja mínima (~48px) en flujo del documento; `CompactAddressBar` y mapa siempre debajo sin superposición. Umbrales scroll más estables en `useFilterBarCollapse`.

**Chrome zero-height + pill flotante (23/08):** colapsado = chrome y wrapper `h-0`; pill `position:absolute` centrada con glass (`rgba` + `backdrop-blur`); laterales transparentes — mapa/cards ocupan el espacio hasta el Header; solo el botón «Filtros» flota encima (`z-40`, Header `z-50`).

**Pulido fluidez (23/08):** panel slide-up (`translateY`) + pill scale-in con delay 100ms; lock scroll 320ms post-toggle; wrapper sin salto `h-0` abrupto (chrome `height:0` natural en flex).

**Anti-parpadeo scroll (24/08):** fases `expanded` → `collapsing` → `collapsed` → `expanding`; expand por scroll solo si `scrollTop ≤ 16`; colapsar con acumulación `scrollDown ≥ 48px`; sin expand en scroll up lejos del tope; `transitionend` + fallback 350ms.

**Layout fluido sin salto (24/08):** wrapper `.explore-filterbar-layout` en `ExplorePageClient` anima liberación de espacio con grid `1fr` ↔ `0fr` (sustituye `height: 0` instantáneo en chrome); `onLayoutTransitionEnd` en wrapper cierra fases `collapsing`/`expanding`; compensación `scrollTop` al cambiar altura del wrapper para que mapa/cards no se desplacen en pantalla; shell sin transición de grid (solo fade/slide del panel); pill flotante con `z-40` solo en fase `collapsed`.

**Scrollbar sin interferencia (24/08):** detección de `pointerdown` en gutter del scrollbar (`src/lib/scroll-gutter.ts`); durante arrastre del thumb no se evalúa colapso/expansión ni compensación de scroll; al soltar, expand si `scrollTop ≤ 16` y flush de compensación pendiente; rueda/touchpad sin cambios.

**Sin tocar:** Header, `CompactAddressBar`, API GEO, `CO-F7-001`, `MapFocusGuard`.

**Verificación Frontend (23/08):**

- HP-GEO-19: scroll ≥100px en `.explore-main-scroll` colapsa FilterBar; mapa/cards ganan altura.
- EC-GEO-19: pestaña «Filtros» re-expande; chips `aria-pressed` y URL (`verified`, `category`) intactos.
- EC-GEO-18 / EC-GEO-17: regresión manual — chrome fijo + zoom mapa no altera scroll.

**Pendiente QA:** cerrar BUG-013 tras re-prueba manual `HP-GEO-19`, `EC-GEO-19`, regresiones `EC-GEO-18`/`EC-GEO-17`. Actualizar matriz `TC-GEO-matrix.md` y checklist en `BUG-013.md`.

---

## 11. Mejora BUG-014 — CompactAddressBar fila horizontal (24/08/2026)

**Ticket QA:** `BUG-014` Major P2 — mejora UX (no Blocker). Independiente de BUG-012 / BUG-013.

**Objetivo:** en `/explorar`, buscar dirección + `#favorite-address` + «Guardar dirección» comparten **una sola fila** desde viewport ≥640px; reducir padding vertical; copy/errores debajo.

**Cambios:**

- `src/components/explore/CompactAddressBar.tsx` — `flex-col` → `sm:flex-row sm:items-center`; padding `py-2 sm:py-3` (antes `py-4`); retirado wrapper `lg:w-[280px]`.
- `src/components/explore/FavoriteAddressSelect.tsx` — prop `inline`; label `sm:sr-only`; select `sm:w-[180px]` shrink-0; `aria-label="Domicilios favoritos"`; móvil `items-end` + wrap permitido.
- `src/app/globals.css` — token `--explore-addressbar-controls-h: 2.75rem` (44px) en input/select/botones.

**Sin tocar:** FilterBar, Header, API GEO, `CO-F7-001`, MapFocusGuard, IDs e2e (`#geocode-query`, `#favorite-address`, texto «Guardar dirección»). Sigue dentro de `.explore-main-scroll`.

**Verificación Frontend (24/08, Chrome headless CDP):**

- 360×640: stack buscar arriba / favoritas+guardar abajo; label «Favoritas» visible; targets 44px; IDs intactos.
- 640×800 / 768×1024 / 1280×800: Δy centros = 0px (misma fila); altura wrapper controles = 44px (≤ ~56px); label sr-only; select 180px; input `flex-1` crece en desktop.
- Error búsqueda: `role="alert"` «Escribe al menos 3 caracteres».
- Tab DOM: geocode → lupa → favoritas → guardar.

**Pendiente QA:** cerrar BUG-014 tras `HP-GEO-20`, `EC-GEO-20` y regresiones `HP-GEO-03`, `EC-GEO-17`, `CO-F7-001`, `HP-GEO-09`.
