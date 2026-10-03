# Matriz de Casos de Prueba: TC-RBAC-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** RBAC extensión Fase 4  
> **Historia / Contrato:** transversal F4  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 6 |
| Seguridad | 6/6 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-RBAC-017 | analytics sin token → 401 | Seguridad | P1 | rbac.spec.ts |
| TC-RBAC-018 | analytics PROVIDER → 403 | Seguridad | P1 | rbac.spec.ts |
| TC-RBAC-019 | addresses PROVIDER → 403 | Seguridad | P1 | rbac.spec.ts |
| TC-RBAC-020 | POST reviews PROVIDER → 403/404 | Seguridad | P1 | rbac.spec.ts |
| TC-RBAC-021 | PATCH provider/me CLIENT → 403 | Seguridad | P1 | rbac.spec.ts |
| TC-RBAC-022 | DELETE reviews sin token → 401 | Seguridad | P1 | rbac.spec.ts |

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
