# QR-FE — Informe de calidad Frontend Fase 5

> **Proyecto:** LaBorregaMarket  
> **Fase:** 5 — GEO Leaflet/OSM, catálogo inhabilitado, marca PROVIDER (v0.5.0)  
> **Fecha:** 2026-08-14  
> **Agente:** Frontend Developer  
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad a wireframes F5 | 8 | Banner CTA, CompactAddressBar, slider overlay, Leaflet, toggle Activo/Inactivo, BrandColorPicker. Clustering Should no implementado. |
| 2 | Responsive (móvil / tablet / desktop) | 9 | Lista explorar primero; mapa 300px móvil; CTA `w-full` móvil; overlay radio. |
| 3 | 4 estados UI | 9 | Explorar: loading / empty radio / teselas red / success. Toggle spinner+check. POS empty activos. Picker skeleton/error/success. |
| 4 | Consumo de API | 9 | Geo Haversine F4 intacta; Nominatim cliente; session `GET /api/auth/session`; PATCH colores; 409 orders/POS. Sin rutas inventadas. |
| 5 | Validación de formularios | 9 | Radio 1–25; geocode ≥3; par de colores + contraste 4.5:1 Must; hex `#RRGGBB`. |
| 6 | Accesibilidad WCAG AA basal | 9 | Lista = alternativa al mapa; slider teclado; attribution OSM visible; CTA ≥44px; toast status; badges F3 no color-only / no `--brand` proveedor. |
| 7 | Pickup F3 / radio F4 / embed Google intactos | 10 | Encargar, POS cobro, ETA, reseñas URL Google, ContactCTA. |
| 8 | Copy canónico F5 | 9 | “No hay fruterías en este radio”; “El mapa no cargó; usa la lista”; “No es stock”; toast `"{nombre} ya no está disponible"`; “No hay productos activos”. |
| 9 | Motor de mapa sin billing | 9 | Leaflet + OSM; MiniMap migrado; `@vis.gl/react-google-maps` fuera. Cierra OBS-F4-023. |
| 10 | Código modular | 8 | `lib/maps`, `lib/color/contrast`, SessionThemeProvider, BrandColorPicker. Tests nominatim + contrast. |

**Total: 89 / 100**

---

## P0 / P1

Ningún P0. Residual: clustering de markers (Should) no incluido. Theme session consume `GET /api/auth/session` (ruta Backend presente); si el par de colores no está migrado en Prisma, el chrome queda en plataforma.

---

## Prompt para UX

Revisar implementación F5 en `LaBorregaMarket` (rutas `/explorar`, `/fruteria/[id]`, `/carrito`, `/proveedor`, `/proveedor/pos`) contra `fase-5/handoff-frontend.md`. Emitir `REVIEW-UX.md` (rúbrica 10×10, umbral 80%, 0 P0).

Handoffs: `fase-5/feature-handoffs/FEAT-GEO-handoff.md`, `FEAT-CAT-handoff.md`, `FEAT-BRAND-handoff.md`.

**No invocar QA** hasta `READY-FOR-QA.md` de UX + Arquitecto.
