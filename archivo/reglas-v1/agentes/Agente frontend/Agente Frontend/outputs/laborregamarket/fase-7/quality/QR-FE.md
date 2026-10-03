# QR-FE — Informe de calidad Frontend Fase 7

> **Proyecto:** LaBorregaMarket
> **Fase:** 7 — Explorar mapa-primero + preview + sesión portable (v0.7.1)
> **Fecha:** 2026-08-18
> **Agente:** Frontend Developer
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad a wireframes F7 | 9 | Mapa primero (360px móvil / `calc(100vh-200px)` desktop), lista debajo, preview sheet, banner de sesión. Sticky desktop no aplicado a propósito (ver P1). |
| 2 | `CO-F7-001` pan ≠ radio | 10 | `ViewportReporter`, `moveend`/`zoomend` y `radiusKmFromViewport` eliminados. `fitBounds` solo por `fitToken` (slider / GPS / dirección / favorita). |
| 3 | Conteo y paginación | 10 | `meta.total` + `meta.radiusKm` en `ExploreCount`; `limit=20`; paginar solo cambia `page` y no mueve el mapa. |
| 4 | Empty vs loading vs error | 10 | Loader 64px con `aria-busy=true`; empty solo con 200 y `total===0` (loader 80px + Ampliar radio / Limpiar búsqueda / Limpiar filtros); 4xx/5xx en ErrorBanner. |
| 5 | Centro y favoritas | 10 | `resolveExploreCenter` URL → last-used → default → SN; `POST .../use` al elegir favorita; la API gana a `sessionStorage`. |
| 6 | Preview vitrina | 9 | Sheet accesible, horario 3 cols / apilado, flags iff true, 3 reseñas, `#resenas`. Catálogo se limita a 5 productos activos por espacio (WF no fija tope). |
| 7 | Sesión portable | 9 | `getAuthSession` tras login; banner no técnico con Reintentar. Verificación en Safari real pendiente de QA. |
| 8 | Copy canónico F7 | 10 | "{N} fruterías a {R} km", "No hay fruterías en este radio", "Horario no publicado", "verificado a la borrega desde MM/AAAA", "Sin reseñas todavía", "El mapa no cargó; usa la lista", "Máximo 25 km", "Escribe al menos 2 caracteres", copy de sesión literal. |
| 9 | Accesibilidad WCAG AA basal | 9 | Markers sin label permanente con `aria-label` y tooltip; diálogo con focus trap y Escape; controles ≥44px; reduced-motion sin animación de encuadre ni de marker. Falta auditoría con lector de pantalla real. |
| 10 | Código modular y tests | 9 | `lib/maps/explore-center`, `lib/providers/hours-format`, `components/explore/{ExploreCount,HoursTable,ProviderCapabilities,ProviderPreviewSheet}`, `components/auth/SessionPersistBanner`. 46 archivos / 202 tests en verde; build limpio. |

**Total: 95 / 100**

---

## P0 / P1

Ningún P0.

- **P1 (decisión de layout):** el mapa desktop no usa `position: sticky`. En una sola columna, el sticky deja que la lista pase por debajo del mapa y la oculta. Se conserva mapa-primero y el alto +20%; si UX quiere el sticky estricto, la alternativa es volver a un contenedor con scroll independiente para la lista.
- **P1 (catálogo del preview):** se muestran hasta 5 productos activos; el wireframe no define tope.
- Residual: clustering (Won't), bbox (Won't), Google Maps JS (revocado), reportes DASH F6 sin cambios.
- Deuda ajena: `tests/unit/rate-limit.contact.test.ts` reporta 3 errores de `tsc` por asignar `NODE_ENV` (archivo de Backend, previo a F7).

---

## Prompt para UX

Revisar implementación F7 en `LaBorregaMarket` (rutas `/explorar`, `/fruteria/[id]`, `/login`) contra `fase-7/handoff-frontend-fase-7.md`, `WF-explorar-mapa-primero`, `WF-explorar-preview` y `WF-login-sesion`. Emitir Quality Gate (rúbrica 10×10, umbral 80%, 0 P0).

Handoffs: `fase-7/feature-handoffs/FEAT-GEO-EXPLORE-handoff.md`, `FEAT-ADDRESSES-handoff.md`, `FEAT-PREVIEW-handoff.md`, `FEAT-AUTH-handoff.md`.

**No invocar QA** hasta `READY-FOR-QA.md` de UX + Arquitecto.
