# Matriz de Casos de Prueba: TC-CAT-matrix (F10)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Producto local + secciones dinámicas  
> **Historia de Usuario / Contrato:** `US-CAT-02`, `US-CAT-03` (CAT-01 intacto) / `API-PROVIDER-PRODUCTS-02`, `API-PROVIDER-SECTIONS-01`  
> **Fecha:** 2026-08-31  
> **Ambiente:** `http://127.0.0.1:8080`

## Inputs Utilizados

- ACs: `US-CAT-02`, `US-CAT-03`, `US-CAT-01`
- FE: `FEAT-CATALOG-handoff.md`, `FEAT-FRUTERIA-handoff.md`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 14 |
| Happy path / negativos / edge / seguridad | Auto Pass 31/08 (suite focal 89/89) |
| Pass / Fail / Blocked | 14 / 0 / 0 |

Numeración continúa F5 (`TC-CAT-008` último histórico).

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-CAT-010 | POST sección 201 | Positivo | P1 | api/sections.spec.ts | [ ] |
| TC-CAT-011 | POST local-product 201 | Positivo | P1 | api/local-products.spec.ts | [ ] |
| TC-CAT-012 | Local en detalle propio + panel | Positivo | P1 | api/local-products.spec.ts | [ ] |
| TC-CAT-013 | Local no aparece en otra frutería | Positivo | P1 | api/local-products.spec.ts | [ ] |
| TC-CAT-014 | Nombre vacío / sin sección 400 | Negativo | P1 | api/local-products.spec.ts | [ ] |
| TC-CAT-015 | Sección ajena 403 | Seguridad | P1 | api/local-products.spec.ts | [ ] |
| TC-CAT-016 | PATCH local ajeno 403 | Seguridad | P1 | api/local-products.spec.ts | [ ] |
| TC-CAT-017 | Ruta local sobre GLOBAL 400 | Negativo | P1 | api/local-products.spec.ts | [ ] |
| TC-CAT-018 | Delete sección con productos 409 | Negativo | P1 | api/sections.spec.ts | [ ] |
| TC-CAT-019 | Delete sección vacía 200/204 | Positivo | P1 | api/sections.spec.ts | [ ] |
| TC-CAT-020 | Reorder permutación | Positivo | P2 | api/sections.spec.ts | [ ] |
| TC-CAT-021 | isAvailable=false → 409 Encargar/POS | Negativo | P1 | api/local-products.spec.ts | [ ] |
| HP-CAT-02 | UI alta local + badge | Positivo | P1 | e2e/provider-catalog-f10.spec.ts | [ ] |
| HP-CAT-03 | `/fruteria` heading de sección | Positivo | P1 | e2e/fruteria-sections.spec.ts | [ ] |

---

## 1. Casos Positivos

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-CAT-010 | Alta sección | PROVIDER dueño | 201; `productCount=0` | [ ] |
| TC-CAT-011 | Alta local | `sectionId` propio | 201; `scope=LOCAL` | [ ] |
| TC-CAT-012 | Visible propio | GET products + GET providers/{id} | fila con `providerProductId`; detalle público lo lista | [ ] |
| TC-CAT-013 | Aislamiento | otro providerId | detalle ajeno **no** incluye el nombre | [ ] |
| TC-CAT-019 | Delete vacía | sección sin SKUs | 200 o 204; ya no en GET | [ ] |
| TC-CAT-020 | Reorder | ≥2 secciones | PATCH `/reorder` 200 | [ ] |
| HP-CAT-02 | Drawer | `/proveedor` | CTA Agregar producto; badge Solo este negocio | [ ] |
| HP-CAT-03 | Detalle agrupado | CLIENT `/fruteria/{id}` | `h3` con nombre de sección | [ ] |

---

## 2. Casos Negativos

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-CAT-014 | name `""` | POST local | 400 | [ ] |
| TC-CAT-017 | PATCH local-products con id GLOBAL | `providerProductId` de comparable | 400 | [ ] |
| TC-CAT-018 | DELETE sección con SKUs | productCount>0 | 409 | [ ] |
| TC-CAT-021 | Venta inhabilitada | POST orders/POS | 409 producto no disponible | [ ] |

---

## 3. Casos Límite

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-CAT-010b | GET sections vacío | provider nuevo | 200 `data: []` | cubierto al crear provider de test |

---

## 4. Seguridad

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-CAT-015 | sectionId de otro negocio | POST local | 403 | [ ] |
| TC-CAT-016 | PATCH local ajeno | id de seed desde otro PROVIDER | 403 | [ ] |
| TC-CAT-S01 | sin token POST local | anónimo | 401 | api/rbac.spec.ts |
| TC-CAT-S02 | CLIENT POST local | CLIENT | 403 | api/rbac.spec.ts |
| TC-CAT-S03 | PATCH sección ajena | otro PROVIDER | 403 | api/sections.spec.ts |

---

## Notas

FilterBar Explorar **sin** chips de secciones custom (Won't). Secciones anidadas Won't.
