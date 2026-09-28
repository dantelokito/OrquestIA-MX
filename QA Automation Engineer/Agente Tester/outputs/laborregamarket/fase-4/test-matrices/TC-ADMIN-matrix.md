# Matriz de Casos de Prueba: TC-ADMIN-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Admin analytics plataforma  
> **Historia / Contrato:** `US-ADMIN-01`, `API-ADMIN-ANALYTICS-01`, `UF-ADMIN-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 8 |
| Happy path | 3/3 |
| Negativos / edge | 2/2 |
| Seguridad | 3/3 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-ADM-F4-001 | GET range=7d envelope + GMV o empty | Positivo | P1 | admin-analytics.spec.ts |
| TC-ADM-F4-002 | range=today y 30d | Positivo | P1 | admin-analytics.spec.ts |
| TC-ADM-F4-003 | range=year → 400 | Negativo | P1 | admin-analytics.spec.ts |
| TC-ADM-F4-004 | CLIENT → 403 | Seguridad | P1 | admin-analytics.spec.ts |
| TC-ADM-F4-005 | sin token → 401 | Seguridad | P1 | admin-analytics.spec.ts |
| HP-ADMIN-01 | UI Hoy/7d/30d + empty o KPIs | Positivo | P1 | e2e/admin-analytics.spec.ts |
| HP-ADMIN-01b | Distinto de `/proveedor/dashboard` | Positivo | P1 | e2e/admin-analytics.spec.ts |
| EC-06 | range=year | Edge Case | P1 | TC-ADM-F4-003 |

GMV excluye `CANCELLED`. Empty: `empty: true`, no ceros fingidos.

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
