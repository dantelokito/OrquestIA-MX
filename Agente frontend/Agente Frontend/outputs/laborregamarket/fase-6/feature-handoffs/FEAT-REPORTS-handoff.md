# Handoff de Feature: FEAT-REPORTS

> **Proyecto:** laborregamarket  
> **Feature:** REPORTS (calendario PROVIDER + print/PDF)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-16  
> **Wireframe:** `WF-proveedor-reportes`, `WF-proveedor-reportes-print`  
> **Contrato:** `API-PROVIDER-REPORTS-01`, `API-PROVIDER-REPORTS-PDF-01`  
> **US:** US-DASH-04 / 05 / 06

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Resumen F3 | `WF-proveedor-dashboard` | `/proveedor/dashboard` | OK (intacto) |
| Reportes | `WF-proveedor-reportes` | `/proveedor/dashboard?view=reportes` | OK |
| Print | `WF-proveedor-reportes-print` | `window.print` `#report-print` | OK |

**Componentes:** `DashboardViewSwitcher`, `GrainSelector`, `ReportPeriodPicker`, `DocumentActions`, `ReportOriginSplit`, `ReportsView`, `ReportKpiCard`, `ReportBarChart`.

Sin 5ª pestaña SubNav. Sin `/proveedor/reportes`. Look PROVIDER (`KpiCard` / OriginBadge), no slate admin.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/provider/reports?grain=&date=` | GET | `getProviderReport` | API-PROVIDER-REPORTS-01 | OK |
| `/api/provider/reports.pdf?grain=&date=` | GET | `downloadProviderReportPdf` | API-PROVIDER-REPORTS-PDF-01 | OK (blob) |
| `/api/provider/dashboard` | GET | `getProviderDashboard` | F3 | OK (sin delta) |

- [x] Cookie JWT (`credentials: include`)
- [x] 401 → `/login?redirect=/proveedor/dashboard?view=reportes…`
- [x] PDF **no** usa `apiGet` (no es JSON)

`grain`: `day` \| `month` \| `year`. `bySource` keys `MARKETPLACE` / `POS`.

---

## 3. Estados UI (4 estados obligatorios)

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Reportes JSON | Skeleton KPIs + chart; pickers on | KPIs 0 / `—`; "Sin ventas en este periodo"; print/PDF on | ErrorBanner + Reintentar; 403 copy negocio; ≠ empty POS | Datos del periodo |
| PDF | Spinner en botón `aria-busy` | PDF 200 empty | ErrorBanner; no blob truncado | Attachment |
| Print | — | Hoja con empty | Botón disabled si no hay JSON | Diálogo nativo |
| grain=day | — | — | — | Chart oculto |

URL: `view`, `grain`, `date`. Back/forward restaura. Periodo futuro: picker inline, no GET.

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes |
|------------|--------|----------|
| ReportPeriodPicker | date / month / year; `max` = hoy Monterrey | "Elige un periodo que no sea futuro" |

Cambio de grano resetea `date` al periodo en curso.

---

## 5. Responsive y accesibilidad

- [x] Móvil: tabs w-full; GrainSelector 3 segmentos ≥44px; acciones documento stack
- [x] Desktop: toolbar grano+fecha izquierda, acciones derecha
- [x] `role="tablist"` / flechas; chart `role="img"` + tabla sr-only (visible en print)
- [x] Split Encargar/POS icono + texto (nunca color-only)
- [x] Header / SubNav / switcher / pickers: `no-print`
- [x] Encabezado hoja: negocio, periodo, TZ, `generatedAt`

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/report-period.test.ts`

- [x] Default view/grain
- [x] Periodo en curso Monterrey
- [x] Futuro rechazado

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario**
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Flujos: Resumen ↔ Reportes; día/mes/año; empty periodo; 500 ≠ "No hay productos activos"; Imprimir oculta chrome; PDF descarga con cookie.
- Usuario PROVIDER. 403 si CLIENT.
- Comandos: `npm run dev` · `npm test`

### DevOps

PDF lo genera el servidor (`application/pdf`). FE solo dispara blob.
