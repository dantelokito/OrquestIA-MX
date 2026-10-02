# Handoff de Feature: FEAT-REPORTES

> **Proyecto:** laborregamarket  
> **Feature:** Reportes rango + venta por producto + print  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-28  
> **Wireframe:** `WF-proveedor-reportes-rango`, `WF-proveedor-reportes-print-f10`  
> **Contrato:** `API-PROVIDER-REPORTS-02`, `API-DASH-NOTES-01`  
> **US:** US-DASH-07, US-DASH-08, US-DASH-09

## Inputs Utilizados

- **UX:** `UF-DASH-03-reportes-rango.md`
- **CO:** `CO-F10-003`
- **No editar:** `fase-6/` (grain/PDF baseline en disco)

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Reportes rango | `WF-proveedor-reportes-rango` | `/proveedor/dashboard?view=reportes` | OK |
| Print CSS | `WF-proveedor-reportes-print-f10` | `#report-print-f10` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `MonthShortcut` | `src/components/provider/reports/` | `input type="month"` rellena from/to |
| `DateRangeFields` | idem | inicio/fin; max hoy Monterrey |
| `ProductFilterChecklist` | idem | vacío = omitir `productIds` |
| `ProductSalesTable` | idem | `products[]` completo |
| `ReportsView` | idem | Query **solo** `from`+`to` |
| `DocumentActions` | idem | `showPdf={false}` — solo Imprimir |

GrainSelector y PDF **no** se pintan. Archivos F6 permanecen en disco.

---

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/provider/reports?from&to` | GET | `getProviderReportRange` | OK XOR vs grain/date |
| Print | CSS | `window.print` | Sin endpoint |

Validación cliente **antes** del GET: from>to, >366, futuro.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Reportes | skeletons | «Sin ventas en este corte» | ErrorBanner 403 negocio | KPIs + tabla + print |

Imprimir habilitado con empty.

---

## 4. Formularios

| Control | Validación | Copy |
|---------|------------|------|
| from>to | inline, no GET | La fecha de inicio no puede ser posterior a la de fin |
| >366 | inline | El rango no puede superar 366 días |
| Futuro | inline | Elige un periodo que no sea futuro |

---

## 5. Responsive y accesibilidad

- [x] Labels + `htmlFor`; checklist `fieldset`/`legend`
- [x] Print: `.no-print` header/SubNav/filtros; `#report-print-f10`

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/report-f10-client.test.ts`

- [x] Validación rango + query sin `productIds` vacíos + sin `grain`

---

## 7. Definition of Done (DoD Frontend)

- [x] Mes rellena rango; pickers editables
- [x] Checkboxes recortan; ninguno = todos
- [x] Print sin chrome app; sí negocio, rango, TZ, Todos o nombres
