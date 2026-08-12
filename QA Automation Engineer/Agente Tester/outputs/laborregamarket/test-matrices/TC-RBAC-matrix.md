# Matriz de Casos de Prueba: TC-RBAC-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** RBAC / Protección de rutas  
> **Historia:** US-AUTH-07  
> **Fecha:** 2026-08-05  
> **Ambiente:** `http://localhost:3000`

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Total casos | 10 |
| Pass | 10 |
| Fail | 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-RBAC-001 | Sin sesión → /admin redirect login | Seguridad | P1 | Pass |
| TC-RBAC-002 | Sin sesión → /proveedor redirect login | Seguridad | P1 | Pass |
| TC-RBAC-003 | Sin sesión → /cuenta redirect login | Seguridad | P1 | Pass |
| TC-RBAC-004 | Rutas públicas sin sesión | Positivo | P1 | Pass |
| TC-RBAC-005 | CLIENT accede /admin → redirect / | Seguridad | P1 | Pass |
| TC-RBAC-006 | CLIENT accede /proveedor → redirect / | Seguridad | P1 | Pass |
| TC-RBAC-007 | PROVIDER accede /cuenta → redirect / | Seguridad | P1 | Pass |
| TC-RBAC-008 | API /api/users/me sin token | Seguridad | P1 | Pass |
| TC-RBAC-009 | API /api/catalogs CLIENT → 403 | Seguridad | P1 | Pass |
| TC-RBAC-010 | API /api/provider/me CLIENT → 403 | Seguridad | P1 | Pass |

---

## Detalle TC-RBAC-004 (rutas públicas)

| Ruta | Sin sesión | Esperado |
|------|------------|----------|
| `/` | GET | 200, sin redirect |
| `/login` | GET | 200 |
| `/registro` | GET | 200 |
| `/explorar` | GET | 200 |
| `/fruteria/{id}` | GET | 200 o 404 si id inválido |

---

## Nota arquitectónica

Middleware **no** protege `/api/*` (by design). Cada handler implementa `requireRole`. Tests API validan guards por endpoint.

---

## Referencias

- `tests/api/rbac.spec.ts`, `tests/e2e/route-protection.spec.ts`
