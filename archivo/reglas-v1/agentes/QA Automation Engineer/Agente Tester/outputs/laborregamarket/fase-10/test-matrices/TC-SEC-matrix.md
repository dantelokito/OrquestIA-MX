# Matriz de Casos de Prueba: TC-SEC-matrix (F10)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Seguridad admin (RBAC dual, AUDIT, higiene)  
> **Historia de Usuario / Contrato:** `US-SEC-01`, `US-SEC-02`, `US-SEC-03` / `API-ADMIN-SEC-01`  
> **Fecha:** 2026-08-31  
> **Ambiente:** `http://127.0.0.1:8080`

## Inputs Utilizados

- ACs: `US-SEC-01` … `03`
- Contrato: Arquitecto `fase-10/api/API-ADMIN-SEC-01.md`
- Handoff FE: `FEAT-SEC-DEMO-handoff.md`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 10 |
| Happy path ejecutados | 4/4 seedable (001, 002, 008, 009) |
| Negativos / edge ejecutados | 1/2 (010 Blocked production) |
| Seguridad ejecutados | 3/5 seedable Pass; 006–007 Blocked |
| Pass / Fail / Blocked | 7 / 0 / 3 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-SEC-001 | Catalogs products solo GLOBAL | Positivo | P1 | api/admin-products.spec.ts | [ ] |
| TC-SEC-002 | GET /api/admin/products ADMIN 200 | Positivo | P1 | api/admin-products.spec.ts | [ ] |
| TC-SEC-003 | Rutas nuevas admin sin cookie 401 | Seguridad | P1 | api/rbac.spec.ts | [ ] |
| TC-SEC-004 | CLIENT en /api/admin/products 403 | Seguridad | P1 | api/rbac.spec.ts | [ ] |
| TC-SEC-005 | PROVIDER POST local-products ADMIN 403 | Seguridad | P1 | api/rbac.spec.ts | [ ] |
| TC-SEC-006 | ADMIN sin PRODUCTS/view → catalogs=products 403 | Seguridad | P1 | — | Blocked (sin fixture; unit BE) |
| TC-SEC-007 | assertNotLastAdmin | Seguridad | P2 | — | Blocked (Won't CRUD usuarios) |
| TC-SEC-008 | AUDIT tras POST admin product | Positivo | P2 | api/admin-products.spec.ts | [ ] |
| TC-SEC-009 | DemoAccountsBlock visible en development | Positivo | P2 | e2e/admin-catalog-f10.spec.ts | [ ] |
| TC-SEC-010 | DemoAccountsBlock unmount production | Edge | P2 | — | No auto (requiere NODE_ENV=production) |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-SEC-001 | Catalogs products GLOBAL | ADMIN + SKU LOCAL existente | `GET /api/catalogs?catalog=products` 200; ningún ítem `scope=LOCAL` ni el nombre local | [ ] |
| TC-SEC-002 | Listado admin products | ADMIN | 200 envelope + `meta`; filas `scope=GLOBAL` | [ ] |
| TC-SEC-008 | Bitácora escritura | ADMIN crea producto | `GET /api/admin/audit` incluye entidad o acción reciente | [ ] |
| TC-SEC-009 | Higiene UI dev | `/login` local | Texto «Cuentas demo» visible | [ ] |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| — | Cubiertos en TC-ADMIN / TC-CAT | Body inválido | 400 | ver otras matrices |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-SEC-010 | Production | `NODE_ENV=production` | Bloque demo no se monta | No auto |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-SEC-003 | Anónimo admin products | sin cookie | 401 | [ ] |
| TC-SEC-004 | CLIENT admin products | rol CLIENT | 403 | [ ] |
| TC-SEC-005 | ADMIN no crea locales | ADMIN POST `/api/provider/local-products` | 403 | [ ] |
| TC-SEC-006 | Módulo PRODUCTS | ADMIN sin PRODUCTS/view | 403 | Blocked |
| TC-SEC-007 | Último ADMIN | mutación que dejaría 0 ADMIN | 409 | Blocked |

---

## Notas

- Dual RBAC: 401 luego 403 de rol luego 403 de módulo.
- `US-SEC-03` copy Cloudinary prohibido: cubierto en TC-MEDIA / E2E catálogo.
