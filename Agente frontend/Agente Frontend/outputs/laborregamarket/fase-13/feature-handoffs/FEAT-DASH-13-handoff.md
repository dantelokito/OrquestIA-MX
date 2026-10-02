# Handoff de Feature: FEAT-DASH-13

> **Proyecto:** laborregamarket  
> **Feature:** DASH inventario en reportes (US-DASH-10/12/13)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-16  
> **Wireframe de referencia:** `WF-DASH-12-inventario-sucursal.md`, `WF-DASH-13-inventario-generales.md`  
> **Contrato de referencia:** `API-PROVIDER-REPORTS-INV-13.md`, `API-SELLABLE-13.md` (KPIs no evaporan)

## Inputs Utilizados

- Handoff UX F13
- API-PROVIDER-REPORTS-INV-13

---

## 1. Pantallas

| Vista | WF | Ruta | Estado |
|-------|----|------|--------|
| Tabs Ventas \| Inventario | WF-DASH-12 | `/proveedor/dashboard?view=reportes` | OK |
| On-hand + entradas + print | WF-DASH-12 | tab Inventario | OK 4 estados |
| Inventario actual N>1 | WF-DASH-13 | `/proveedor/reportes-generales` | OK; copy sin historial entradas |
| KPIs ventas | US-DASH-10 | tab Ventas intacta | Sin rediseño; no se filtra UI por archivo |

**Componentes:** `ReportsViewTabs`, `InventoryReportsPanel`, `GlobalOnHandBlock`.

---

## 2. API

| Endpoint | Método | Service |
|----------|--------|---------|
| `/api/provider/reports/inventory` | GET | `getBranchInventoryReport` |
| `/api/provider/reports/global/inventory` | GET | `getGlobalInventoryReport` |

JSON Backend: `data.balances` + `data.entries` (meta.total = entradas). Global N>1 sin `entries`; N=1 → 403 `GLOBAL_REPORTS_NOT_AVAILABLE`. Inventario listado: `unit` = `effectiveSaleUnit` + `masterUnit` / `saleUnit`.

Print = FE (`window.print`). Sin kardex.

---

## 3. Estados UI

Sucursal: loading dos skeletons; empty saldos / empty entradas; error Reintentar; success tablas.

N>1: empty «No hay existencias registradas.»; error Reintentar.

---

## 4. Pruebas

`npx vitest run` → 373 passed / 80 files.

## Outputs Generados

- **Archivo:** `fase-13/feature-handoffs/FEAT-DASH-13-handoff.md`
