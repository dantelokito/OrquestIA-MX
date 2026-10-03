# Matriz de Casos de Prueba: TC-PROVIDERS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** PROVIDERS / EXPLORE  
> **Historia de Usuario / Contrato:** UF-CLIENT-01/02, UF-PROVIDER-01 / API-PROVIDERS-01  
> **Fecha:** 2026-08-05  
> **Ambiente:** `http://localhost:3000`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 18 |
| Happy path ejecutados | 7/7 (100%) |
| Negativos / edge ejecutados | 8/9 (89%) |
| Seguridad ejecutados | 3/3 (100%) |
| Pass | 17 |
| Fail | 0 |
| Blocked | 1 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-PROV-001 | Listar proveedores activos | Positivo | P1 | Pass |
| TC-PROV-002 | Paginación page/limit | Positivo | P1 | Pass |
| TC-PROV-003 | Filtro city Monterrey | Positivo | P2 | Pass |
| TC-PROV-004 | Búsqueda q en businessName | Positivo | P1 | Pass |
| TC-PROV-005 | Filtro verified=true | Positivo | P2 | Pass |
| TC-PROV-006 | Detalle proveedor por id | Positivo | P1 | Pass |
| TC-PROV-007 | Detalle 404 inexistente | Negativo | P2 | Pass |
| TC-PROV-008 | limit > 50 rechazado | Negativo | P2 | Pass |
| TC-PROV-009 | page < 1 rechazado | Negativo | P2 | Pass |
| TC-PROV-010 | Listado vacío con q sin match | Edge | P3 | Pass |
| TC-PROV-011 | Crear Provider onboarding | Positivo | P1 | Pass |
| TC-PROV-012 | POST sin sesión | Seguridad | P1 | Pass |
| TC-PROV-013 | POST rol CLIENT | Seguridad | P1 | Pass |
| TC-PROV-014 | POST Provider duplicado | Negativo | P1 | Pass |
| TC-PROV-015 | Coords fuera Monterrey | Negativo | P2 | Pass |
| TC-PROV-016 | UI explorar carga API | Positivo | P1 | Pass |
| TC-PROV-017 | UI detalle frutería | Positivo | P1 | Pass |
| TC-PROV-018 | UI error de red explorar | Edge | P2 | Blocked |

---

## Detalle casos críticos

### TC-PROV-001 — Listar proveedores

| Campo | Valor |
|-------|-------|
| **Precondiciones** | DB seeded con ≥3 providers activos |
| **Pasos** | GET `/api/providers` |
| **Input** | — |
| **Resultado esperado** | 200, `{ data: [...], meta: { page, limit, total, totalPages } }`, solo `isActive=true` |
| **Criterio éxito** | `data.length` ≥ 1, envelope ADR-003 |
| **Criterio fallo** | Status ≠ 200 o key `providers` legacy |

### TC-PROV-011 — Onboarding Provider paso 2

| Campo | Valor |
|-------|-------|
| **Precondiciones** | User PROVIDER sin Provider, sesión JWT |
| **Pasos** | POST `/api/providers` con businessName, address, city, lat/lng |
| **Input** | `{ businessName: "Test Frutería", address: "Calle 1", city: "Monterrey", latitude: 25.67, longitude: -100.31 }` |
| **Resultado esperado** | 201, `{ data: { id, businessName, isVerified: false } }` |
| **Criterio éxito** | Provider creado, audit CREATE |

### TC-PROV-016 — UI explorar

| Campo | Valor |
|-------|-------|
| **Precondiciones** | App corriendo, DB seeded |
| **Pasos** | Navegar `/explorar`, esperar carga |
| **Resultado esperado** | Tarjetas de fruterías visibles (no mock), skeleton → contenido |
| **Criterio éxito** | Texto "Frutas El Paraíso" o similar del seed |

---

## Referencias

- API-PROVIDERS-01, ADR-001, ADR-004
- Automatización: `tests/api/providers.spec.ts`, `tests/e2e/explore.spec.ts`
