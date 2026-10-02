# Matriz de Casos de Prueba: TC-ADMIN-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** ADMIN  
> **Contrato:** API-ADMIN-01 / UF-ADMIN-01  
> **Fecha:** 2026-08-05  
> **Ambiente:** `http://localhost:3000`

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Total casos | 12 |
| Pass | 11 |
| Fail | 1 |
| Blocked | 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-ADM-001 | GET catálogos lista | Positivo | P1 | Pass |
| TC-ADM-002 | GET catalog=users | Positivo | P1 | Pass |
| TC-ADM-003 | GET catalog=providers | Positivo | P1 | Pass |
| TC-ADM-004 | GET catalog=audit | Positivo | P2 | Pass |
| TC-ADM-005 | GET catalogs sin sesión | Seguridad | P1 | Pass |
| TC-ADM-006 | GET catalogs rol CLIENT | Seguridad | P1 | Pass |
| TC-ADM-007 | GET admin/providers paginado | Positivo | P1 | Pass |
| TC-ADM-008 | PATCH verificar proveedor | Positivo | P1 | Pass |
| TC-ADM-009 | GET admin/audit con filtros | Positivo | P2 | Pass |
| TC-ADM-010 | UI /admin acceso ADMIN | Positivo | P1 | Pass |
| TC-ADM-011 | UI /admin bloqueado CLIENT | Seguridad | P1 | Pass |
| TC-ADM-012 | Envelope catálogo default | Negativo | P3 | Fail |

---

## Detalle TC-ADM-008

| Campo | Valor |
|-------|-------|
| **Precondiciones** | ADMIN logueado, provider `isVerified=false` en seed |
| **Pasos** | PATCH `/api/admin/providers/{id}` body `{ isVerified: true }` |
| **Resultado esperado** | 200, `{ data: { isVerified: true } }` |

## Detalle TC-ADM-012 (FAIL)

| Campo | Valor |
|-------|-------|
| **Pasos** | GET `/api/catalogs` sin query |
| **Esperado** | `{ data: { catalogs: [...] } }` envelope ADR-003 |
| **Obtenido** | `{ catalogs: [...] }` sin wrapper `data` |
| **Bug** | BUG-003 |

---

## Referencias

- `tests/api/admin.spec.ts`, `tests/api/rbac.spec.ts`
