# QR-FE — Informe de calidad Frontend Fase 8

> **Proyecto:** LaBorregaMarket
> **Fase:** 8 — Explorar polish (v0.8.3)
> **Fecha:** 2026-08-24
> **Agente:** Frontend Developer
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad a wireframes F8 | 9 | LocationChip en reposo; overlay una fila `px-3 py-1.5`; maxBounds MX; preview anclado. Sheet vs popover usa `md` (768) como tokens. |
| 2 | `CO-F7-001` pan ≠ radio | 10 | Sin ViewportReporter; FitCircle solo por `fitToken` (slider / GPS / dirección / favorita). |
| 3 | Clamp 0.5–10 + copy | 10 | `clampRadiusKm` sin `Math.round`; `formatRadius`; Ampliar radio +0.5 oculto en 10; cero “25 km” en el overlay. |
| 4 | Chrome de ubicación | 9 | Un chip; panel sheet/popover; diálogo in-app; DELETE deja el pin. CompactAddressBar ya no se monta. |
| 5 | Mapa México | 10 | `maxBounds` + viscosity 1 + `minZoom` 5; Nominatim `MEXICO_VIEWBOX`; FE no GET fuera de MX; banner ≠ GPS denegado. |
| 6 | Preview hover / long-press | 9 | Sin «Vista rápida»; delays 300/150/500; Eye `aria-label="Vista previa"`; mismo `GET /api/providers/[id]`; cache + un inflight. |
| 7 | Empty vs loading vs error | 10 | Loader 64 / empty 80; empty radio + Ampliar (≤10); 4xx/5xx ErrorBanner. |
| 8 | Copy canónico F8 | 9 | Conteo con metros si R&lt;1; tope 20; fuera de MX; geocode 3 chars. GPS denegado sin coords crudas. |
| 9 | Accesibilidad WCAG AA basal | 8 | Targets ≥44px; Escape; `aria-expanded`; range `aria-valuetext`; reduced-motion. Falta auditoría con lector de pantalla real y RTL de hover. |
| 10 | Código modular y tests | 9 | Componentes F8 en `components/explore` + `lib/maps`. 49 archivos / **223 tests** en verde; `next build` limpio. Residual tsc en `rate-limit.contact.test.ts` (Backend, previo). |

**Total: 93 / 100**

---

## P0 / P1

Ningún P0.

- **P1:** no hay tests de componente con Testing Library (el repo no la incluye). Hover/long-press se verificaron en browser.
- **P1 (layout F7):** el mapa desktop sigue sin `position: sticky` (decisión F7).
- Residual Won't: clustering, bbox Must, Maps JS, FilterBar nuevo, recorte `US-EXPLORE-05`.
- BUG-012/013/014 FilterBar: **no reabiertos** (fuera de F8).

---

## Prompt para UX

Revisar implementación F8 en `LaBorregaMarket` (`/explorar`) contra `fase-8/handoff-frontend-fase-8.md`, `WF-explorar-ubicacion`, `WF-explorar-radio`, `WF-explorar-mapa-mexico` y `WF-explorar-preview-card`. Emitir Quality Gate (rúbrica 10×10, umbral 80%, 0 P0).

Handoffs: `fase-8/feature-handoffs/FEAT-GEO-LOCATION-handoff.md`, `FEAT-GEO-RADIUS-handoff.md`, `FEAT-GEO-MEXICO-handoff.md`, `FEAT-PREVIEW-HOVER-handoff.md`.

**No invocar QA** hasta `READY-FOR-QA.md` de UX + Arquitecto.
