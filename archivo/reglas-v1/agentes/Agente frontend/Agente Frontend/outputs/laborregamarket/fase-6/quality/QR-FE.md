# QR-FE — Informe de calidad Frontend Fase 6

> **Proyecto:** LaBorregaMarket  
> **Fase:** 6 — Confiabilidad + reportes + GEO zoom↔radio (v0.6.1)  
> **Fecha:** 2026-08-16  
> **Agente:** Frontend Developer  
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad a wireframes F6 | 8 | ContactCTA 429/503/500; Reportes `?view=reportes`; GrainSelector; print/PDF; círculo + clamp hint; BrandLoader. Comparativa vs periodo anterior (Should) no incluida. |
| 2 | Responsive (móvil / tablet / desktop) | 9 | Tabs/grano/PDF full-width móvil; lista explorar first; mapa 300px visible en refetch. |
| 3 | 4 estados UI | 9 | Reportes: skeleton / empty periodo / 500 ErrorBanner / success. Explorar: BrandLoader, empty radio, lista previa en error. POS 500 ≠ empty activos. |
| 4 | Consumo de API | 9 | `GET /api/provider/reports` + blob PDF; dashboard F3 intacto; providers Haversine F4 sin bbox. Contact POST ramificado por status. |
| 5 | Validación de formularios | 9 | Periodo futuro bloqueado en picker; radio 1–25; par de colores F5 intacto. |
| 6 | Accesibilidad WCAG AA basal | 9 | tablist + flechas; chart sr-only + print table; split Encargar/POS no color-only; `aria-busy` + sr-only loader; reduced-motion B1. |
| 7 | Pickup F3 / Leaflet F5 / embed Google intactos | 10 | Encargar, POS cobro, OSM, US-REV-03, ContactCTA usable en 5xx. Cero Maps JS. |
| 8 | Copy canónico F6 | 9 | Toasts 503/500; "Sin ventas en este periodo"; "Máximo 25 km"; "Buscando fruterías"; "Esta vista es solo para tu negocio". |
| 9 | Motor de mapa sin billing | 9 | Leaflet + OSM; `NEXT_PUBLIC_OSM_TILE_URL` opcional; zoom deriva `radiusKm` Haversine. |
| 10 | Código modular | 8 | `lib/ui/contact-toast`, `lib/reports/period`, `lib/maps/radius-from-viewport`, `components/provider/reports/*`, `BrandLoader`. Tests unitarios nuevos. |

**Total: 89 / 100**

---

## P0 / P1

Ningún P0. Residual: clustering (Won't); comparativa vs periodo anterior (Should); serie horaria en día (Could).

También en este slice: BrandColorPicker muestra ErrorBanner + Reintentar en 500 de `GET /api/provider/me`. Session 500 sigue cayendo a tokens plataforma.

---

## Prompt para UX

Revisar implementación F6 en `LaBorregaMarket` (rutas `/explorar`, `/fruteria/[id]`, `/proveedor`, `/proveedor/pos`, `/proveedor/dashboard?view=reportes`) contra `fase-6/handoff-frontend-fase-6.md` y `fase-6/handoff-frontend-reportes-geo.md`. Emitir Quality Gate (rúbrica 10×10, umbral 80%, 0 P0).

Handoffs: `fase-6/feature-handoffs/FEAT-CONTACT-RESILIENCE-handoff.md`, `FEAT-ENV-handoff.md`, `FEAT-REPORTS-handoff.md`, `FEAT-GEO-handoff.md`.

**No invocar QA** hasta `READY-FOR-QA.md` de UX + Arquitecto.
