# Matriz de Casos de Prueba: TC-REPORTS-matrix (F10)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Reportes rango + venta por producto + print  
> **Historia de Usuario / Contrato:** `US-DASH-07`, `US-DASH-08`, `US-DASH-09` / `API-PROVIDER-REPORTS-02`, `API-DASH-NOTES-01`  
> **Fecha:** 2026-08-31  
> **Ambiente:** `http://127.0.0.1:8080`

## Inputs Utilizados

- ACs: `US-DASH-07` … `09`; `CO-F10-003`
- Baseline F6 (solo lectura docs): `API-PROVIDER-REPORTS-01` — grain/PDF **siguen en API**
- FE: `FEAT-REPORTES-handoff.md` — chrome **sin** GrainSelector ni PDF

Numeración continúa F6 (`TC-REP-010` último).

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 12 |
| Happy path / negativos / edge / seguridad | Auto Pass 31/08 |
| Pass / Fail / Blocked | 12 / 0 / 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-REP-011 | GET from+to 200 modo range | Positivo | P1 | api/reports.spec.ts | [ ] |
| TC-REP-012 | Periodo vacío 200 empty | Edge | P1 | api/reports.spec.ts | [ ] |
| TC-REP-013 | Mezcla grain+from 400 | Negativo | P1 | api/reports.spec.ts | [ ] |
| TC-REP-014 | from>to 400 | Negativo | P1 | api/reports.spec.ts | [ ] |
| TC-REP-015 | Span 367 días 400 | Negativo | P1 | api/reports.spec.ts | [ ] |
| TC-REP-016 | productIds ajeno 403 | Seguridad | P1 | api/reports.spec.ts | [ ] |
| TC-REP-017 | productIds recorta GMV | Positivo | P1 | api/reports.spec.ts | [ ] |
| TC-REP-018 | products[] no top-5 | Positivo | P2 | api/reports.spec.ts | [ ] |
| HP-DASH-07 | UI checklist + tabla | Positivo | P1 | e2e/dashboard-reports.spec.ts | [ ] |
| HP-DASH-08 | Mes atajo + from/to | Positivo | P1 | e2e/dashboard-reports.spec.ts | [ ] |
| HP-DASH-09 | Imprimir; sin PDF chrome | Positivo | P1 | e2e/dashboard-reports.spec.ts | [ ] |
| HP-DASH-F6-API | grain day/month/year intacto | Positivo | P1 | api/reports.spec.ts TC-REP-001…003 | F6 |

---

## 1. Casos Positivos

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-REP-011 | Rango mes actual | PROVIDER | 200; `period.mode=range`; TZ Monterrey; `products` array | [ ] |
| TC-REP-017 | Filtro SKU | POS del día + productIds | GMV = subtotales de esas líneas | [ ] |
| TC-REP-018 | Lista completa | periodo con ventas | `products.length` no recortado a 5 Must | [ ] |
| HP-DASH-07 | Checklist | `/proveedor/dashboard?view=reportes` | legend Productos del corte; «Ninguno marcado = todos» | [ ] |
| HP-DASH-08 | Atajo mes | input `type=month` | from/to visibles; sin botones Día/Mes/Año | [ ] |
| HP-DASH-09 | Print | `#report-print-f10` | botón Imprimir; **no** Descargar PDF | [ ] |

---

## 2. Casos Negativos

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-REP-013 | `grain=day` + `from` | XOR | 400 | [ ] |
| TC-REP-014 | from posterior a to | `from>to` | 400 `details.field=from` | [ ] |
| TC-REP-015 | 367 días inclusive | to-from+1 > 366 | 400 | [ ] |

---

## 3. Casos Límite

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-REP-012 | 2020-01-01 … 2020-01-02 | sin ventas | 200 `empty=true`; no 404 | [ ] |

---

## 4. Seguridad

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-REP-016 | productIds de otro negocio | cuid ajeno o inexistente | 403 | [ ] |
| TC-RBAC-026…028 | reports sin token / CLIENT / ADMIN | F6 intacto | 401 / 403 | Pass histórico; se re-ejecuta |

---

## Notas

UI F6 grain/PDF **no** se aserta en E2E F10. API PDF (`TC-REP-008`) permanece; no es Must F10 chrome.
