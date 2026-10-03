# Fase 6 — Confiabilidad + reportes + GEO zoom↔radio

> **Producto:** LaBorregaMarket v0.6.1  
> **Fecha diseño:** 16/08/2026  
> **Estado:** Diseño B+C listo — slice A (deuda) ya publicado. Quality Gate pendiente de implementación FE.

Tres slices. **No es pasarela.** Pagos/CFDI siguen Won't (`CO-F6-001`). No emitir READY-FOR-QA de checkout con DEV-P0-001 o DEV-P0-002 abiertos.

## Slices

| Slice | Diseño UX | Implementa |
|-------|-----------|------------|
| **A — Deuda** | [`handoff-frontend-fase-6.md`](./handoff-frontend-fase-6.md) | Frontend (ContactCTA, Leaflet invariante, fallback marca, `.env.example`) |
| **B — Reportes** | [`handoff-frontend-reportes-geo.md`](./handoff-frontend-reportes-geo.md) | Frontend + Backend (`GET /api/provider/reports` + `.pdf`) |
| **C — GEO zoom↔radio** | mismo delta FE | Frontend; **cero BE** |

Espejo Backend: `Agente Arquitecto/.../fase-6/handoff-backend-fase-6.md` (A) y `handoff-backend-fase-6-reportes.md` (B).

Diseño F5 (Leaflet, CAT, brand) y F3 dashboard rolling quedan **solo lectura**.

## User flows

| ID | Archivo |
|----|---------|
| UF-DASH-02 | [`user-flows/UF-DASH-02-reportes-periodo.md`](./user-flows/UF-DASH-02-reportes-periodo.md) |
| UF-GEO-01 (delta) | [`user-flows/UF-GEO-01-zoom-radio.md`](./user-flows/UF-GEO-01-zoom-radio.md) |

## Wireframes

| ID | Archivo |
|----|---------|
| WF-proveedor-reportes | [`wireframes/WF-proveedor-reportes.md`](./wireframes/WF-proveedor-reportes.md) |
| WF-proveedor-reportes-print | [`wireframes/WF-proveedor-reportes-print.md`](./wireframes/WF-proveedor-reportes-print.md) |
| WF-explorar-zoom-radio | [`wireframes/WF-explorar-zoom-radio.md`](./wireframes/WF-explorar-zoom-radio.md) |

## Decisiones UX F6

| ID | Decisión |
|----|----------|
| D-F6-UX-1 | Reportes en `/proveedor/dashboard?view=reportes` (no 5ª SubNav) |
| D-F6-UX-2 | Look PROVIDER; no copiar `/admin/analytics` |
| D-F6-UX-3 | Imprimir / PDF = secondary |
| D-F6-UX-4 | Zoom = mismo `radiusKm` Haversine; clustering Won't |
| D-F6-UX-5 | Loader borrega B1–B3 en lista; no skeleton Must |

## Fuera de alcance

Pasarela, CFDI, PWA, flotilla, clustering, bbox Must, analytics ADMIN, rediseñar slice A (ContactCTA / Leaflet / marca).

---

*Índice Fase 6 — Agente UX/UI Designer, LaBorregaMarket v0.6.1.*
