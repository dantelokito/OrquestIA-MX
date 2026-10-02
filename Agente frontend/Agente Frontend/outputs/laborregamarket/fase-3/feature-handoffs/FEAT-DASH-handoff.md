# Handoff de Feature: FEAT-DASH

> **Proyecto:** laborregamarket  
> **Feature:** DASH (dashboard ilustrativo)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-13  
> **Wireframe:** `WF-proveedor-dashboard`  
> **Contrato:** `API-PROVIDER-DASH-01`

---

## 1. Pantallas

| Vista | Ruta | Estado |
|-------|------|--------|
| Ventas | `/proveedor/dashboard` | OK |

**Componentes:** `KpiCard`, `BarChartIlustrativo` (SVG) + tabla en `<details>`

---

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/provider/dashboard` | GET | `getProviderDashboard` | OK |

Un solo endpoint (no `/summary` + `/daily`). `empty`, `kpis.bySource`, `series7d`, `topProducts`.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Dashboard | Skeleton KPI + gráfico | Todavía no hay ventas + Abrir POS | ErrorBanner | KPIs, barras, top 5, App vs Mostrador |

Top 5: `providerProductId === null` → `QuickSaleBadge` + "Venta rápida".

---

## 4. A11y

Gráfico `role="img"` + `aria-label`. Tabla equivalente. `prefers-reduced-motion` en `.dash-bar`. Conteos de estado enlazan a `/proveedor/ordenes?tab=`.

---

## 5. DoD

- [x] 3 KPIs + statusToday
- [x] SVG propio (sin librería de charts)
- [x] Desglose bySource (Should)
- [x] Empty `data.empty`
