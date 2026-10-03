# Handoff de Feature: FEAT-DASH-11

> **Proyecto:** laborregamarket  
> **Feature:** DASH reportes generales  
> **Stack UI:** Next.js 15 / React 19 / Tailwind  
> **Fecha:** 2026-09-12  
> **Wireframe de referencia:** `WF-DASH-11-reportes-globales.md`  
> **Contrato de referencia:** `API-PROVIDER-REPORTS-03.md`

## Inputs Utilizados

- **US:** `US-DASH-11`
- **Handoff UX** y notas Arch fase 11

---

## 1. Pantallas y componentes

| Pantalla | Wireframe | Ruta | Estado |
|----------|-----------|------|--------|
| Reportes generales | `WF-DASH-11` | `/proveedor/reportes-generales` | OK Must |
| Quinto tab SubNav | `WF-DASH-11` | solo N>1 | OK |
| Reportes F10 | intacto | `/proveedor/dashboard?view=reportes` | Sin rediseño |

**Componentes:** `GlobalReportsPageClient`, `BranchBreakdownTable`, `GlobalReportsNavItem` (tab en `SubNavProveedor`), reuso `ReportKpiCard` F3 (no `KpiCardAdmin`).

Print consolidado = **Should**: `window.print()` + clases `no-print` existentes. Sin PDF Must.

---

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/provider/reports/global` | GET `from`/`to` | `getGlobalProviderReport` | Real; 404 → mock vacío alineado al contrato |
| `/api/provider/reports` | GET | F10 sin cambio | Intacta |

N=1: tab oculto; deep-link redirige a Reportes F10. 403 `GLOBAL_REPORTS_NOT_AVAILABLE`: copy «Esta vista no está disponible para una sola frutería».

---

## 3. Estados UI

| Loading | Empty | Error | Success |
|---------|-------|-------|---------|
| Skeleton 3 KPI + filas | KPIs en cero + copy «Sin ventas consolidadas en este corte» | Banner + Reintentar | Totales + tabla por `businessName` |

---

## 4. Formularios

Mes-atajo + `DateRangeFields` (validación rango F10: 366 días, no futuro).

---

## 5. Responsive / a11y

- Móvil: KPI stack; tabla `overflow-x-auto`; filtros `w-full`
- Escritorio: KPI fila `max-w-7xl`
- `<th>` reales; caption «Ventas por sucursal»

---

## 6. Pruebas

Helpers N>1 en `tests/unit/provider-f11-ui.test.ts`.

---

## 7. DoD

Must de módulo nuevo cubierto. Print Should no bloquea.

## Outputs Generados

- **Archivo:** `fase-11/feature-handoffs/FEAT-DASH-11-handoff.md`
- **Agente Downstream:** QA Tester
