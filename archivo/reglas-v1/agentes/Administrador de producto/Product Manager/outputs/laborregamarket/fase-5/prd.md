# PRD Corto — LaBorregaMarket Fase 5

> **Proyecto:** LaBorregaMarket
> **Fecha:** 14/08/2026
> **Versión:** 0.5.0
> **Agente:** Product Manager
> **Objetivo del Negocio:** Quitar la dependencia de una API de mapas de pago, hacer usable el descubrimiento geográfico en local/QA, y dar al proveedor control real de su oferta (productos visibles) y de su identidad visual en su sesión.
> **Público Objetivo:** CLIENT en `/explorar`; PROVIDER en panel, POS y sesión autenticada.

## Resumen ejecutivo

Fase 4 dejó `/explorar` atado a Google Maps JS API. Sin clave de facturación el mapa no renderiza (**OBS-F4-023**). Dante confirma que **no se pagará** esa API y que **no hay pasarela de pagos** en esta fase.

F5 cierra tres huecos de producto: (1) mapa Open Source + recorte de layout (ubicación arriba, radio abajo), (2) producto inhabilitado realmente desaparece de todos los canales, (3) colores primario/secundario del proveedor en toda su sesión.

Change order: [`CO-F5-001`](./change-orders/CO-F5-001-revertir-google-maps.md) revoca D-F4-2.

#### 1. Alcance (MVP)

* **Incluido:**
  - Mapa de `/explorar` con motor sin clave de facturación (Leaflet + teselas OSM)
  - CTA **Usar mi ubicación** en el banner superior de Explorar
  - Slider de radio 1–25 km en el borde inferior del mapa; filtro Haversine F4 intacto
  - Producto inhabilitado oculto en explorar, detalle, carrito y POS; pedido/POS rechazan ese `productId`
  - Colores primario y secundario configurables por proveedor, aplicados a su sesión (incluido `/explorar` si entra logueado como PROVIDER)
* **Fuera de Alcance:**
  - Pasarela de pagos, CFDI, PWA, flotilla/rutas, impresora, lector de barras
  - Google Maps JS API en Explorar; Places API; Distance Matrix
  - API de bounding box como contrato Must
  - Tema del proveedor pintando el marketplace cuando el usuario es CLIENT o ADMIN
  - Stock / "agotado temporal" (el modelo sigue siendo on/off)

#### 2. Módulos Principales

1. `[GEO]`: Motor de mapa sin API paga + layout Explorar (`US-GEO-04`, `US-GEO-05`)
2. `[CAT]`: Consistencia del toggle de producto F1 en todos los canales (`US-CAT-01`)
3. `[BRAND]`: Primario/secundario por proveedor en sesión PROVIDER (`US-BRAND-01`, `US-BRAND-02`)

## Objetivo

Hacer que Explorar funcione sin tarjeta de crédito de Google, que el dueño de la frutería pueda apagar un producto de verdad, y que su marca se vea en su propio espacio de trabajo.

## Fuera de alcance (Won't F5)

Pasarela de pagos (`BL-040` → F6+), CFDI, PWA instalable, logística de reparto real, Google Maps JS API, Places API, Distance Matrix, bounding-box API Must, tema de proveedor para CLIENT/ADMIN.

## Decisiones cerradas (14/08/2026)

| # | Decisión | Cierre |
|---|----------|--------|
| D-F5-1 | Pagos | Fuera de F5 |
| D-F5-2 | Motor de mapa | Leaflet + OSM; **revoca D-F4-2** (`CO-F5-001`) |
| D-F5-3 | Filtro geo | Radio Haversine (`US-GEO-02`) se mantiene. Viewport/bbox = Should UX, no contrato Must |
| D-F5-4 | Layout Explorar | Ubicación = banner superior. Radio = overlay inferior del mapa. Favoritas F4: UX decide si quedan en barra compacta o suben al banner |
| D-F5-5 | Catálogo | Toggle F1 se endurece en todos los canales; no hay stock |
| D-F5-6 | Branding | Scoped a sesión PROVIDER. Fallback a tokens de plataforma si no hay colores o fallan contraste |
| D-F5-7 | Spec Leaflet | Paquetes, debounce y `ssr: false` son input al Arquitecto, no AC del PM |

## Priorización MoSCoW

| Prioridad | Items |
|-----------|-------|
| **Must** | US-GEO-04, US-GEO-05, US-CAT-01, US-BRAND-01, US-BRAND-02 |
| **Should** | Lista lateral recortada al viewport al pan/zoom (debounce); clustering de markers; preview WCAG AA al elegir colores |
| **Could** | API bbox `south/west/north/east`; paleta derivada del logo |
| **Won't** | Ver "Fuera de alcance" |

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| Mapa usable en local/QA **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 100% de sesiones Explorar (cierra OBS-F4-023) |
| Producto inhabilitado visible en explorar/detalle/carrito/POS | 0 ocurrencias en 14 días post-lanzamiento |
| Proveedores con par de colores guardado y contraste válido | > 40% de proveedores activos en 30 días |

## Referencias

- Change order: [`change-orders/CO-F5-001-revertir-google-maps.md`](./change-orders/CO-F5-001-revertir-google-maps.md)
- Índice: [`../README.md`](../README.md)
- Backlog: [`../comun/backlog.md`](../comun/backlog.md)
- F4 GEO (solo lectura): [`../fase-4/prd.md`](../fase-4/prd.md), `US-GEO-01…03`
- QA: OBS-F4-023 / EC-08 en matriz `TC-GEO-matrix.md`

---

*PRD Fase 5 — Agente Product Manager, LaBorregaMarket v0.5.0.*
