# QR-FE — Informe de calidad Frontend Fase 4

> **Proyecto:** LaBorregaMarket  
> **Fase:** 4 — Reseñas, Geo/Maps, ETA, Admin analytics, POS báscula (v0.4.0)  
> **Fecha:** 2026-08-14  
> **Agente:** Frontend Developer  
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad a wireframes F4 | 8 | LocationBar, radio, reseñas, EtaChip, analytics, báscula, toggle delivery. Contratos Arquitecto (no rutas UX provisionales). |
| 2 | Responsive (móvil / tablet / desktop) | 9 | Lista explorar primero; mapa 300px móvil; POS split; analytics grid. |
| 3 | 4 estados UI | 9 | Explorar geo, reseñas, carrito ETA, analytics empty real, POS báscula, settings Google. |
| 4 | Consumo de API | 9 | `/api/providers` geo, addresses, reviews, `/eta` en provider, `/provider/me`, `/admin/analytics?range=`. |
| 5 | Validación de formularios | 8 | Radio 1–25, reseña 1–5, prep 5–120, delivery address required. |
| 6 | Accesibilidad WCAG AA basal | 8 | Lista = alternativa al mapa; slider teclado; empty reviews SR; split sr-only; IN_TRANSIT copy ramificado. |
| 7 | Contacto F2 / Encargar F3 intactos | 10 | ContactCTA y Encargar conservados; POS cobro sin campos extra. |
| 8 | Copy canónico F4 | 9 | “Sin reseñas todavía”; ETA copyKey; “Requiere verificación…”; “En camino” solo DELIVERY. |
| 9 | Maps / báscula (cliente) | 8 | Leaflet fuera; Maps JS lazy; fallback sin key. WebSerial + keypad F3. |
| 10 | Código modular | 8 | `lib/api`, `lib/maps`, `lib/pos/scale`, componentes explore/reviews/admin/cart. Tests unitarios copy/geo/scale. |

**Total: 86 / 100**

---

## P0 / P1

Ningún P0. Residual: Places Autocomplete no implementado (Won't / ADR-016); geocode vía `Geocoder` JS. Moderación admin por ID (sin listado global de reseñas).

---

## Prompt para UX

Revisar implementación F4 en `LaBorregaMarket` (rutas `/explorar`, `/fruteria/[id]`, `/carrito`, `/cuenta`, `/proveedor`, `/proveedor/pos`, `/admin/analytics`) contra `fase-4/handoff-frontend.md`. Emitir `REVIEW-UX.md` (rúbrica 10×10, umbral 80%, 0 P0).

Handoffs: `fase-4/feature-handoffs/FEAT-GEO-handoff.md`, `FEAT-REVIEWS-handoff.md`, `FEAT-ETA-handoff.md`, `FEAT-ADMIN-handoff.md`, `FEAT-SCALE-handoff.md`, `FEAT-DELIVERY-handoff.md`.

**No invocar QA** hasta `READY-FOR-QA.md` de UX + Arquitecto.
