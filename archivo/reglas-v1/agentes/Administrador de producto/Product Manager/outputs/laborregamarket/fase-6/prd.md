# PRD Corto — LaBorregaMarket Fase 6

> **Proyecto:** LaBorregaMarket
> **Fecha:** 16/08/2026
> **Versión:** 0.6.1
> **Agente:** Product Manager
> **Objetivo del Negocio:** Cerrar la deuda que ya provoca 500 en contacto y deja el producto sin red de CI; dar al proveedor reportes de ventas imprimibles (día / mes / año); y homologar zoom del mapa Explorar con el radio que filtra catálogos — sin pasarela ni cobros nuevos.
> **Público Objetivo:** PROVIDER en su panel; CLIENT/visitante en `/explorar`; DevOps/QA en el primer entorno compartido.

## Resumen ejecutivo

F5 (Leaflet, catálogo, marca) está implementada y QA la aprobó **con condiciones**. F6 = **deuda + reportes del proveedor + sync zoom↔radio** (`CO-F6-001`, `CO-F6-002`). Pagos/cobros POS nuevos y pago en línea **fuera hasta nuevo aviso**.

El dashboard F3 solo muestra KPIs de hoy y 7 días, sin imprimir. El mapa F5 filtra por slider Haversine pero el zoom no mueve radio ni lista. F6 cierra ambos huecos.

Change orders: [`CO-F6-001`](./change-orders/CO-F6-001-sprint-confiabilidad.md), [`CO-F6-002`](./change-orders/CO-F6-002-zoom-radio-sync.md).

#### 1. Alcance (MVP)

* **Incluido:**
  - Slice A — Deuda: lockfile Redis; contacto 503; CI `build`/`start` + Playwright; invariante Leaflet/OSM; fallback marca/catálogo si API 500
  - Slice B — Reportes PROVIDER: día / mes / año concreto; imprimir navegador + PDF
  - Slice C — GEO: círculo de cobertura siempre visible; zoom/pan y slider de radio bidireccionales (Haversine 1–25 km); animación breve de carga al refrescar negocios
* **Fuera de Alcance:**
  - Pasarela de pagos, cobros POS nuevos, pago en línea (`BL-040` aparcado)
  - CFDI, PWA, flotilla, Places, Distance Matrix, **clustering de markers**
  - API bounding box como contrato Must
  - `/health` dedicado, PITR/nube, CSV/Excel, email del reporte, ticket térmico
  - Analytics de plataforma ADMIN; ADMIN viendo reporte de otro proveedor
  - Rediseñar el slice de deuda (handoffs UX/Arch 16/08)

#### 2. Módulos Principales

1. `[RELIAB]`: Confiabilidad (`US-NOTIFY-10`, `US-OPS-04`, `US-OPS-05`, `US-GEO-06`, `US-BRAND-03`)
2. `[DASH]`: Reportes imprimibles (`US-DASH-04`, `US-DASH-05`, `US-DASH-06`)
3. `[GEO]`: Visualizador homologado con radio (`US-GEO-07`, `US-GEO-08`)

## Objetivo

Clone/CI compilable, contacto no-500, reportes de negocio en papel/PDF, y en Explorar **ver siempre el radio que cubre el mapa**, alineado al zoom y a la lista.

## Fuera de alcance (Won't F6)

Pasarela y cobros nuevos (`BL-040` hasta nuevo aviso), CFDI, PWA, flotilla, Google Maps JS en Explorar, `/health`, PITR, **clustering**, **bbox API Must**, CSV, envío por email, comparativa vs periodo anterior (Should DASH), drill-down a cada orden (Could), horas en reporte diario (Could).

## Decisiones cerradas (16/08/2026)

| # | Decisión | Cierre |
|---|----------|--------|
| D-F6-1 | Pagos / cobros POS nuevos / pago en línea | **Fuera hasta nuevo aviso** (`CO-F6-001`). POS F3 intacto |
| D-F6-2 | Deuda P0 | Must de F6 |
| D-F6-3 | Reportes | Panel PROVIDER, solo su negocio. No copiar `/admin/analytics` |
| D-F6-4 | Periodo | Día, mes (MM/AAAA) o año (AAAA) **concreto**; TZ America/Monterrey |
| D-F6-5 | Imprimir | Navegador + CSS print **y** PDF descargable |
| D-F6-6 | PDF | AC = archivo. Mecanismo = ADR Arquitecto |
| D-F6-7 | Slice deuda | No rediseñar; handoffs UX/Arch 16/08 |
| D-F6-8 | GMV | `status ≠ CANCELLED`. Split Encargar vs POS |
| D-F6-9 | Zoom ↔ radio | Visualizador y slider son el mismo `radiusKm` Haversine (1–25, clamp). Círculo siempre visible. **No** bbox Must (`CO-F6-002`) |
| D-F6-10 | Loading geo | Loop borrega **B1→B2→B3** en la lista (`comun/brand/loader-borrega/`); componente reutilizable; `prefers-reduced-motion` = B1 estático. No splash |

## Priorización MoSCoW

| Prioridad | Items |
|-----------|-------|
| **Must** | US-NOTIFY-10, US-OPS-04, US-OPS-05, US-GEO-06, US-BRAND-03, US-DASH-04, US-DASH-05, US-DASH-06, **US-GEO-07, US-GEO-08** |
| **Should** | US-OPS-06, US-AUTH-08; comparativa vs periodo anterior |
| **Could** | US-OPS-07; serie horaria en reporte diario; drill-down a órdenes |
| **Won't** | Ver "Fuera de alcance" (clustering y bbox Must siguen aquí) |

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| Clone limpio / `npm ci` resuelve `@upstash/redis` | 100% (DEV-P0-001) |
| Contacto en prod sin Upstash | **503**, no 500 de módulo |
| Pipeline CI `build`/`start` + Playwright | Gate QA “regresión” deja de estar PENDIENTE |
| Proveedor genera reporte día/mes/año e imprime o descarga PDF | 100% happy paths US-DASH-04/05/06 |
| Zoom o slider dejan círculo, barra y lista en el mismo `radiusKm` | 100% happy path US-GEO-07 |
| Refetch geo muestra loader borrega B1–B3 (`aria-busy`) | 100% US-GEO-08 |

## Referencias

- [`change-orders/CO-F6-001-sprint-confiabilidad.md`](./change-orders/CO-F6-001-sprint-confiabilidad.md)
- [`change-orders/CO-F6-002-zoom-radio-sync.md`](./change-orders/CO-F6-002-zoom-radio-sync.md)
- Deuda DevOps: `Agente DevOps/.../comun/deuda-fases-previas.md`
- Deuda UX (ya diseñada): `Agente UX UI/.../fase-6/handoff-frontend-fase-6.md`
- Deuda Arquitecto (ya diseñada): `Agente Arquitecto/.../fase-6/handoff-backend-fase-6.md`
- GEO F5 (solo lectura): `fase-5/user-stories/US-GEO-04`, `US-GEO-05`
- Loader borrega: [`../comun/brand/loader-borrega/`](../comun/brand/loader-borrega/)
- Índice: [`../README.md`](../README.md)
- Backlog: [`../comun/backlog.md`](../comun/backlog.md)
