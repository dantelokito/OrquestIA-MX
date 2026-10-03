# Matriz de Casos de Prueba: TC-REPORTS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Reportes calendario PROVIDER  
> **Historia / Contrato:** `US-DASH-04`, `US-DASH-05`, `US-DASH-06`, `API-PROVIDER-REPORTS-01`, `API-PROVIDER-REPORTS-PDF-01`  
> **Fecha:** 2026-08-17  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 16 |
| Happy path ejecutados | 6/7 (PDF Must Fail BUG-009) |
| Negativos / edge ejecutados | 4/5 (EC-REP-FUT no auto) |
| Seguridad ejecutados | TC-RBAC F6 5/5 Pass |
| Pass / Fail / Blocked | 12 / 2 / 2 |

Corrida: `npx playwright test tests/api/reports.spec.ts tests/api/rbac.spec.ts tests/e2e/dashboard-reports.spec.ts … --workers=1` contra `localhost:8080`.

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-REP-001 | JSON day envelope TZ Monterrey | Positivo | P1 | api/reports.spec.ts | Pass |
| TC-REP-002 | JSON month series por día | Positivo | P1 | api/reports.spec.ts | Pass |
| TC-REP-003 | JSON year 12 buckets | Positivo | P1 | api/reports.spec.ts | Pass |
| TC-REP-004 | Periodo vacío 200 empty | Edge | P1 | api/reports.spec.ts | Pass |
| TC-REP-005 | grain ausente 400 | Negativo | P1 | api/reports.spec.ts | Pass |
| TC-REP-006 | desajuste grain/date 400 | Negativo | P1 | api/reports.spec.ts | Pass |
| TC-REP-007 | date futura 400 | Negativo | P1 | api/reports.spec.ts | Pass |
| TC-REP-008 | PDF 200 %PDF periodo vacío | Positivo | P1 | api/reports.spec.ts | **Fail** BUG-009 |
| TC-REP-009 | PDF query inválida 400 JSON | Negativo | P1 | api/reports.spec.ts | Pass |
| TC-REP-010 | POS del día en KPIs | Positivo | P1 | api/reports.spec.ts | Pass |
| HP-DASH-04 | Tab Reportes + grano | Positivo | P1 | e2e/dashboard-reports.spec.ts | Pass |
| HP-DASH-04b | Mes KPIs / empty | Positivo | P1 | e2e/dashboard-reports.spec.ts | Pass |
| HP-DASH-05 | Imprimir visible (print CSS) | Positivo | P2 | e2e (botón en HP-DASH-04) | Pass |
| HP-DASH-06 | Descarga PDF | Positivo | P1 | e2e/dashboard-reports.spec.ts | **Fail** BUG-009 |
| EC-REP-FUT | Picker no permite futuro | Edge | P2 | manual / FE bloquea | No auto |
| HP-REG-DASH | Dashboard F3 rolling intacto | Positivo | P1 | e2e/dashboard.spec.ts | Fuera de este set |

---

## 1. Casos Positivos

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-REP-001 | day JSON | PROVIDER seed | 200; timezone; series [] | Pass |
| TC-REP-008 | PDF vacío | PROVIDER | application/pdf; filename reporte-* | Fail — 500 `Error interno` (BUG-009) |
| HP-DASH-04 | UI Reportes | login PROVIDER | tablist; Día/Mes/Año; TZ | Pass |

---

## 2. Casos Negativos

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-REP-005 | sin grain | query incompleta | 400 | Pass |
| TC-REP-006 | month + YYYY-MM-DD | desajuste | 400 | Pass |
| TC-REP-007 | 2099-01-01 | futuro | 400 futuro | Pass |

---

## 3. Edge

| ID | Nombre | Condición | Resultado esperado | Estado |
|----|--------|-----------|-------------------|--------|
| TC-REP-004 | 2020-01-01 | sin ventas | empty true, no 404 | Pass |

---

## Referencias

- Arquitecto: `fase-6/api/API-PROVIDER-REPORTS-01.md`
- FE: `/proveedor/dashboard?view=reportes`

## Notas

- Dashboard rolling F3 (`GET /api/provider/dashboard`) **sin delta**.
- Print real (`window.print`) no se automatiza en CI; se valida botón + `#report-print`.
- `pdfkit` está en lockfile; el 500 es runtime Next (BUG-009), no módulo faltante.
