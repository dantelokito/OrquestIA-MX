# Matriz de Casos de Prueba: TC-DASH-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** DASH (dashboard ventas)  
> **Contrato:** `API-PROVIDER-DASH-01`, `UF-DASH-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 8 |
| Happy path ejecutados | 1/1 (100%) |
| Negativos / edge ejecutados | 2/2 (100%) |
| Seguridad ejecutados | 2/2 (100%) |
| Pass | 8 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-DASH-001 | GET dashboard envelope | Positivo | P1 | Pass |
| TC-DASH-002 | kpis.bySource | Positivo | P2 | Pass |
| TC-DASH-003 | Sin token | Seguridad | P1 | Pass |
| TC-DASH-004 | Rol CLIENT | Seguridad | P1 | Pass |
| TC-DASH-005 | Refleja venta POS | Positivo | P1 | Pass |
| TC-DASH-006 | Query range 7d | Positivo | P2 | Pass |
| HP-DASH-01 | E2E KPIs + tabla | Positivo | P1 | Pass |
| EC-06 | Empty sin ventas | Edge Case | P2 | Pass |

---

*Matriz Fase 3 — LaBorregaMarket v0.3.0*
