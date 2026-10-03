# Matriz de Casos de Prueba: TC-RBAC-matrix (F6)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** RBAC reportes PROVIDER  
> **Historia / Contrato:** DEV-P2-011, API-PROVIDER-REPORTS-01 / PDF-01  
> **Fecha:** 2026-08-17  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 6 |
| Seguridad ejecutados | 5/6 auto + 1 implícito Pass |
| Pass / Fail / Blocked | 6 / 0 / 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-RBAC-026 | reports JSON sin token 401 | Seguridad | P1 | api/rbac.spec.ts | Pass |
| TC-RBAC-027 | reports JSON CLIENT 403 | Seguridad | P1 | api/rbac.spec.ts | Pass |
| TC-RBAC-028 | reports JSON ADMIN 403 | Seguridad | P1 | api/rbac.spec.ts | Pass |
| TC-RBAC-029 | reports.pdf CLIENT 403 | Seguridad | P1 | api/rbac.spec.ts | Pass |
| TC-RBAC-030 | reports.pdf sin token 401 | Seguridad | P1 | api/rbac.spec.ts | Pass |
| TC-RBAC-031 | PROVIDER solo su negocio | Seguridad | P1 | implícito TC-REP (resolveProviderByUserId) | Pass (JSON propio 200) |

---

## 4. Seguridad

| ID | Escenario | Esperado | Estado |
|----|-----------|----------|--------|
| TC-RBAC-026 | GET reports anónimo | 401 | Pass |
| TC-RBAC-027 | CLIENT | 403 | Pass |
| TC-RBAC-028 | ADMIN no ve reporte ajeno | 403 | Pass |
| TC-RBAC-029 | PDF CLIENT | 403 | Pass |
| TC-RBAC-030 | PDF anónimo | 401 | Pass |

---

## Referencias

- No copiar `/admin/analytics` al proveedor.
- El 500 de PDF autenticado PROVIDER (BUG-009) no invalida el 401/403 de RBAC.
