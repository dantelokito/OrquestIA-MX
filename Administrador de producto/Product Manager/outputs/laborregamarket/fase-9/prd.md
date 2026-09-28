# PRD Corto — LaBorregaMarket Fase 9

> **Proyecto:** LaBorregaMarket
> **Fecha:** 25/08/2026
> **Versión:** 0.9.0
> **Agente:** Product Manager
> **Objetivo del Negocio:** Cerrar la deuda UX de `/explorar` que QA documentó tras F8 (preview desanclado, header sin suggest, card con precio mínimo poco útil, chips disabled, chrome que come mapa) sin reabrir el sign-off F8.
> **Público Objetivo:** visitante y CLIENT en `/explorar`.

## Resumen ejecutivo

F8 (polish P1–P4) firmó QA **APROBADO CON CONDICIONES**. F9 = **paquete de deuda Explorar** (`CO-F9-001`) derivado de `DT-F9-001` … `DT-F9-005` del Tester. Un solo discovery; activación UX + Arquitecto en paralelo; FE tras handoff UX; BE solo si Arch exige contrato (typeahead / chips).

Change order: [`CO-F9-001`](./change-orders/CO-F9-001-deuda-explorar.md).

#### 1. Alcance (MVP)

* **Incluido:**
  - Preview hover/long-press como **animación dentro del card** (`US-EXPLORE-08`)
  - Header EXPLORAR con typeahead **solo fruterías** (portada + nombre), corpus = **todo el radio**, aviso de filtro + tacha (`US-EXPLORE-09`)
  - Card: quitar slot visual `minPrice`; fila distancia pin→sucursal + ETA (`US-EXPLORE-10`)
  - FilterBar: Mayoreo y A domicilio **filtran de verdad**; Orgánico y «Filtros» **retirados** (`US-EXPLORE-11`)
  - Chrome en **una barra horizontal** + mapa ~+10–20% (`US-GEO-24`)
* **Fuera de Alcance:**
  - Reabrir US F7/F8 o sign-off QA F8
  - Typeahead de artículos (SKU) como filas del desplegable
  - Pintar `sampleProducts` en la card de lista
  - Esquema / catálogo «orgánico»
  - AUTH-09, DASH F6, deuda Redis/CI, pagos (`BL-040`)
  - Clustering, bbox Must de API, Google Maps JS, Places, polígono INEGI Must
  - Reabrir pan → radio (`CO-F7-001` intacto)

#### 2. Módulos Principales

1. `[EXPLORE]`: Preview in-card, header typeahead, card distancia, FilterBar (`US-EXPLORE-08` … `11`)
2. `[GEO]`: Chrome compacto + altura de mapa (`US-GEO-24`)

## Objetivo

Que `/explorar` no muestre controles muertos, que el preview viva en la card, que la búsqueda sugiera fruterías en todo el radio, y que el mapa recupere viewport.

## Fuera de alcance (Won't F9)

Ver arriba. Contenido preview = `US-EXPLORE-05` (no recortar). Clamp 0.5–10 y mapa México de F8 se conservan.

## Decisiones cerradas (25/08/2026)

| # | Decisión | Cierre |
|---|----------|--------|
| D-F9-1 | Alcance | Aceptar **los 5 DT** en un solo discovery F9 |
| D-F9-2 | Orgánico + «Filtros» | **Retirar** ambos chips |
| D-F9-3 | Mayoreo / A domicilio | **Habilitar** con query listing + URL shareable |
| D-F9-4 | Preview | In-card; triggers F8; sin API Must; no recortar `US-EXPLORE-05` |
| D-F9-5 | Header | Typeahead solo fruterías; radio completo; chip/aviso + tacha; índice productos interno |
| D-F9-6 | Suggest API | Arquitecto decide `q`+geo vs endpoint suggest |
| D-F9-7 | Card distancia | Sin `minPrice` visual; distancia + ETA (ADR-017); sin API Must |
| D-F9-8 | Chrome/mapa | Una barra (breakpoint UX) + mapa ~+10–20%; no regresionar BUG-012/013 ni `CO-F7-001` |
| D-F9-9 | Fuera | SKUs en typeahead, `sampleProducts` en card, DASH/Redis/CI, `BL-040`, reopen F8 |

## Priorización MoSCoW

| Prioridad | Items |
|-----------|-------|
| **Must** | US-EXPLORE-08, US-EXPLORE-09, US-EXPLORE-10, US-EXPLORE-11, US-GEO-24 |
| **Should** | Barra relativa distancia/radio en card; debounce/cache suggest |
| **Could** | Overflow futuro de filtros extra (WhatsApp, abierta ahora) — **no** en F9 |
| **Won't** | Ver "Fuera de alcance" |

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| Preview se anima **dentro** del card (no popover desanclado) | 100% |
| Typeahead sugiere fruterías del radio completo (portada + nombre) | 100% |
| Card sin «$X MXN desde»; con distancia + ETA cuando hay pin | 100% |
| Ningún chip FilterBar `disabled` de adorno; Mayoreo/Domicilio filtran | 100% |
| Orgánico y «Filtros» ausentes | 100% |
| Chrome una barra (breakpoint); mapa visiblemente más alto (~10–20%) | 100% |
| BUG-012/013 y pan ≠ radio no regresionan | 100% |

## Referencias

- [`change-orders/CO-F9-001-deuda-explorar.md`](./change-orders/CO-F9-001-deuda-explorar.md)
- QA: `Agente Tester/.../fase-9/deuda-tecnica/DT-F9-001` … `005`, `QA-F9-handoff-pm.md`
- F8 (solo lectura): `US-EXPLORE-07`, `CO-F8-003`
- F7 (solo lectura): `US-EXPLORE-05`, `US-EXPLORE-06`, `CO-F7-001`
- Índice: [`../README.md`](../README.md)
- Backlog: [`../comun/backlog.md`](../comun/backlog.md)
