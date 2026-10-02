# PRD Corto — LaBorregaMarket Fase 8

> **Proyecto:** LaBorregaMarket
> **Fecha:** 24/08/2026
> **Versión:** 0.8.3
> **Agente:** Product Manager
> **Objetivo del Negocio:** Que `/explorar` se sienta marketplace de descubrimiento: ubicación clara, radio compacto 500 m–10 km, mapa en México y preview de frutería al pasar el mouse o mantener presionado.
> **Público Objetivo:** visitante y CLIENT en `/explorar`; CLIENT autenticado al guardar / borrar favoritas.

## Resumen ejecutivo

F7 dejó `/explorar` funcional. F8 se entrega **por partes**.

**Parte 1:** chrome de ubicación → control único (chip + panel).

**Parte 2:** overlay de radio compacto; clamp **500 m–10 km**. Slider manda `radiusKm`; pan/zoom no (`CO-F7-001`).

**Parte 3:** mapa acotado a **México**; encuadre al círculo al cambiar centro/radio.

**Parte 4:** se descarta el botón «Vista rápida». Hover (desktop) y long-press (móvil/tablet) abren un **preview anclado a la card** con el contenido de `US-EXPLORE-05`. Clic/tap corto sigue a `/fruteria/[id]`.

Change orders: [`CO-F8-001`](./change-orders/CO-F8-001-rango-radio.md), [`CO-F8-002`](./change-orders/CO-F8-002-mapa-mexico.md), [`CO-F8-003`](./change-orders/CO-F8-003-preview-hover.md).

#### 1. Alcance (MVP)

* **Incluido (Parte 1):** IDs 013–016 — chip de ubicación, favoritas distinguibles, guardar in-app, copy de contexto.
* **Incluido (Parte 2):** IDs 017–018 — overlay compacto; clamp 0.5–10 km.
* **Incluido (Parte 3):** ID019 — `maxBounds` México; FitCircle; rechazo GPS/geocode/pin/URL fuera de MX.
* **Incluido (Parte 4):** ID020 — preview hover/long-press anclado a la card; sin botón «Vista rápida»; tap corto = detalle; mismo contenido `US-EXPLORE-05`; marker abre el mismo preview.
* **Fuera de Alcance:**
  - FilterBar, chips, búsqueda de producto (`US-EXPLORE-06` ya es F7)
  - Recortar campos de `US-EXPLORE-05`; sustituir navegación al detalle por solo preview
  - AUTH-09, DASH F6, deuda Redis/CI, pagos (`BL-040`)
  - Clustering, bbox Must de API, Google Maps JS, Places, polígono INEGI Must
  - Reabrir pan → radio (`US-GEO-07`)

#### 2. Módulos Principales

1. `[GEO] Parte 1`: Chrome de ubicación (`US-GEO-17` … `20`)
2. `[GEO] Parte 2`: Overlay y rango de radio (`US-GEO-21`, `US-GEO-22`)
3. `[GEO] Parte 3`: Mapa México + encuadre (`US-GEO-23`)
4. `[EXPLORE] Parte 4`: Preview hover / long-press (`US-EXPLORE-07`)

## Objetivo

Saber dónde y hasta dónde se busca, no salir de México, y previsualizar la frutería sin un botón extra.

## Fuera de alcance (Won't)

Ver arriba. `CO-F7-001` intacto (pan ≠ radio, limitado a MX). Contenido preview = F7.

## Decisiones cerradas

| # | Decisión | Cierre |
|---|----------|--------|
| D-F8-1 | F8 por partes | P1–P4. No adelantar FilterBar |
| D-F8-2 … D-F8-14 | P1–P3 | Sin cambio (ubicación, radio 0.5–10, mapa MX) |
| D-F8-15 | Sin botón | «Vista rápida» se descarta (`CO-F8-003`) |
| D-F8-16 | Disparador | Hover / long-press → preview anclado. Tap/clic corto → `/fruteria/[id]`. Contenido = `US-EXPLORE-05` |

## Priorización MoSCoW

| Prioridad | Items |
|-----------|-------|
| **Must** | US-GEO-17 … 23, US-EXPLORE-07 |
| **Should** | Filtro favoritas; badge last-used; Ampliar radio ≤ 10; BE URL fuera de MX; debounce GET preview |
| **Could** | Renombrar favorita; GPS en panel de ubicación |
| **Won't** | FilterBar nuevo, recortar preview, Places, merge BE, DASH, pagos, pan→radio, 25 km, bbox API Must |

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| En reposo, un solo control de ubicación | 100% |
| Overlay radio más bajo; clamp 0.5–10; pan no cambia R | 100% |
| Viewport no sale de México | 100% |
| Botón «Vista rápida» ausente | 100% |
| Hover / long-press abre preview anclado con datos `US-EXPLORE-05` | 100% |
| Clic/tap corto en la card va a `/fruteria/[id]` | 100% |
| Scroll en touch no abre preview; post-long-press no navega | 100% |
| Teclado puede abrir preview sin el botón | 100% |

## Referencias

- CO: [`CO-F8-001`](./change-orders/CO-F8-001-rango-radio.md), [`CO-F8-002`](./change-orders/CO-F8-002-mapa-mexico.md), [`CO-F8-003`](./change-orders/CO-F8-003-preview-hover.md)
- F7 (solo lectura): `US-EXPLORE-05`, `US-GEO-10`, `CO-F7-001`
- Código: `ProviderCard.tsx` (botón a quitar), `ProviderPreviewSheet.tsx` (contenido a reanclar)
