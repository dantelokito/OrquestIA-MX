# Matriz de Casos de Prueba: TC-ADMIN-matrix (F10)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** CRUD catálogo global + flags proveedor  
> **Historia de Usuario / Contrato:** `US-ADMIN-02`, `US-ADMIN-03` / `API-ADMIN-PRODUCTS-01`, `API-ADMIN-PROVIDERS-01`  
> **Fecha:** 2026-08-31  
> **Ambiente:** `http://127.0.0.1:8080`

## Inputs Utilizados

- ACs: `US-ADMIN-02`, `US-ADMIN-03`
- Contratos Arquitecto F10
- FE: `FEAT-ADMIN-handoff.md`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 12 |
| Happy path / negativos / seguridad | Auto Pass 31/08; TC-ADM-026 Blocked |
| Pass / Fail / Blocked | 11 / 0 / 1 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-ADM-020 | POST producto GLOBAL 201 | Positivo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-021 | PATCH nombre / isActive | Positivo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-022 | GET listado paginado GLOBAL | Positivo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-023 | Nombre vacío 400 | Negativo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-024 | Categoría inválida 400 | Negativo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-025 | DELETE HTTP 405 | Negativo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-026 | Hard-delete Prisma 409 | Edge | P2 | — | Blocked (sin DELETE HTTP; unit BE) |
| TC-ADM-027 | PROVIDER no usa POST admin products | Seguridad | P1 | api/rbac.spec.ts | [ ] |
| TC-ADM-028 | PATCH flags mayoreo/domicilio/activo | Positivo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-029 | isVerified=false apaga Google | Positivo | P1 | api/admin-products.spec.ts | [ ] |
| TC-ADM-030 | UI Catálogos CRUD | Positivo | P1 | e2e/admin-catalog-f10.spec.ts | [ ] |
| TC-ADM-031 | UI tabla flags Proveedores | Positivo | P1 | e2e/admin-catalog-f10.spec.ts | [ ] |

---

## 1. Casos Positivos

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-ADM-020 | Alta GLOBAL | ADMIN | 201; `scope=GLOBAL`; `ownerProviderId` ausente/null | [ ] |
| TC-ADM-021 | Editar / inhabilitar | id creado | PATCH 200; `isActive=false` | [ ] |
| TC-ADM-022 | Listado | ADMIN | 200 + meta; sin LOCAL | [ ] |
| TC-ADM-028 | Flags | provider seed | 200 `offersWholesale` / `offersDelivery` / `isActive` | [ ] |
| TC-ADM-029 | Unverify | seed verificado | `googleReviewsEnabled=false`; Place ID no se borra (campo intacto si existe) | [ ] |
| TC-ADM-030 | UI alta | login ADMIN `/admin` tab Catálogos → Productos | «Catálogo global»; Guardar | [ ] |
| TC-ADM-031 | UI flags | tab Proveedores | columnas Verificado, Activo, Mayoreo, A domicilio | [ ] |

---

## 2. Casos Negativos

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-ADM-023 | name vacío | `{ name: "", category, unit }` | 400 | [ ] |
| TC-ADM-024 | category `OTRO` | enum inválido | 400 | [ ] |
| TC-ADM-025 | DELETE `/api/admin/products/{id}` | método no permitido | 405 | [ ] |

---

## 3. Casos Límite

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-ADM-026 | Borrar fila con PP | script/servicio | 409 copy retirar con isActive | Blocked |

---

## 4. Seguridad

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-ADM-027 | PROVIDER POST admin products | rol PROVIDER | 403 | [ ] |

---

## Notas

`US-ADMIN-04` promover = Should, no en esta matriz.
