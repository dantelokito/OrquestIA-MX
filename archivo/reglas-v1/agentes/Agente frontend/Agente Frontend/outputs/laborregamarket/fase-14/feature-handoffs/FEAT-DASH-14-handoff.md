# Handoff de Feature: FEAT-DASH-14

> **Proyecto:** laborregamarket  
> **Feature:** DASH (US-DASH-14/15/16)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-17  
> **Wireframe de referencia:** `WF-DASH-14-series-generales.md`, `WF-DASH-15-ventas-graficas.md`, `WF-DASH-16-pdf.md`  
> **Contrato de referencia:** `API-PROVIDER-REPORTS-14`, `MOD-REPORTS-F14-handoff.md`, ADR-041

## Inputs Utilizados

- ADR-041 SVG unificado (cero npm charts)
- JSON vigente `series` / `products` / `bySource`; PDF `from`/`to`

---

## 1. Pantallas

| Vista | WF | Ruta | Estado |
|-------|----|------|--------|
| Reportes generales series + filtro | WF-DASH-14 | `/proveedor/reportes-generales` | OK; N=1 403 redirect intacto |
| UnifiedProviderChart | WF-DASH-15 | Ventas resumen + reportes + generales | OK `role="img"` + `<details>` |
| PDF corte from/to | WF-DASH-16 | Ventas sucursal `showPdf` | OK; **sin grain** en UI |

**Componente:** `UnifiedProviderChart` (`trend` / `mix` / `top`). Retirados `BarChartIlustrativo` y el uso de `ReportBarChart` en Ventas.

---

## 2. Integración API

| Endpoint | Método | Service |
|----------|--------|---------|
| `/api/provider/reports` | GET | `getProviderReportRange` + `productIds` |
| `/api/provider/reports/global` | GET | `getGlobalProviderReport` + `productIds` |
| `/api/provider/reports.pdf?from&to` | GET blob | `downloadProviderReportPdfRange` |

PDF global Must: no (N=1 no tiene módulo global). `GrainSelector` no se pinta.

Empty `max=0`: no crash; copy «Sin ventas en este corte».

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Series generales | skeletons | copy sin ventas | ErrorBanner; N=1 sin retry | tendencia + mix + top |
| PDF | CTA Descargando | disabled sin reporte | banner | archivo `reporte-{slug}-{from}_{to}.pdf` |

---

## 4. Pruebas

Helpers chart + URL PDF en `provider-f14-ui.test.ts`. Suite **409 passed / 87 files**.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/feature-handoffs/FEAT-DASH-14-handoff.md`
- **Agente Downstream:** QA Tester
