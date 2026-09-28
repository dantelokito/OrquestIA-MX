# Matriz de Casos de Prueba: TC-F13-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** F13 — archivo de oferta, unidad, admin catálogo, reportes inventario  
> **Historia de Usuario / Contrato:** US-ADMIN-05/06, US-CAT-14/15/16/18/19/20, US-DASH-10/12/13, US-SEC-04, US-INV-07 · API-*-13  
> **Fecha:** 2026-09-16  
> **Ambiente:** `http://127.0.0.1:8080` · rama `feat/f13-archivo-oferta-unidad` (sin staging remoto)

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 19 |
| Happy path ejecutados | 10/10 (objetivo: 100%) |
| Negativos / edge ejecutados | 6/6 (objetivo: ≥ 85%) |
| Seguridad ejecutados | 3/3 |
| Pass | 19 |
| Fail | 0 |
| Blocked | 0 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-F13-001 | Admin GET GLOBAL+LOCAL, meta, limit 50 | Positivo | P1 | Pass |
| TC-F13-002 | Admin PATCH isActive LOCAL + DELETE 405 | Positivo | P1 | Pass |
| TC-F13-003 | Archive, bandeja, restore, inventario sin oculta | Positivo | P1 | Pass |
| TC-F13-004 | DELETE panel 405; restore sin oferta 404/403 | Negativo | P1 | Pass |
| TC-F13-005 | POS/Encargar 409 y vitrina sin archivado | Positivo | P1 | Pass |
| TC-F13-006a | CAJA sin factor → 400 | Negativo | P1 | Pass |
| TC-F13-006b | confirmDiscard con onHand | Edge Case | P1 | Pass |
| TC-F13-007 | Precio + historial | Positivo | P1 | Pass |
| TC-F13-008 | Entrada persiste y reporte sucursal | Positivo | P1 | Pass |
| TC-F13-009 | Global inventario N>1 200; N=1 403 | Positivo | P1 | Pass |
| TC-F13-010 | Admin page/limit inválidos → 400 | Negativo | P2 | Pass |
| TC-F13-011 | Entrada sobre oculta → 409 | Negativo | P1 | Pass |
| TC-F13-020 | 401/403 CLIENT admin y archive | Seguridad | P1 | Pass |
| TC-F13-021 | IDOR archive LOCAL ajeno → 403 | Seguridad | P1 | Pass |
| TC-F13-022 | PROVIDER GET admin products → 403 | Seguridad | P1 | Pass |
| TC-F13-101 | Admin origen + Inhabilitar | Positivo | P1 | Pass |
| TC-F13-102 | Bandeja Eliminados de la vista | Positivo | P1 | Pass |
| TC-F13-103 | Tab Inventario reportes sucursal | Positivo | P1 | Pass |
| TC-F13-104 | Reportes generales inventario N>1 | Positivo | P1 | Pass |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-F13-001 | Listado admin completo | ADMIN + LOCAL creado | 200, scopes, meta.limit=50 | Pass |
| TC-F13-002 | Moderación isActive | LOCAL propio | PATCH 200, DELETE 405 | Pass |
| TC-F13-003 | Ocultar / restaurar | PROVIDER | Bandeja con archivedAt; visible e inventory sin fila | Pass |
| TC-F13-005 | No vendible archivado | Oferta oculta | POS 409, orders 409, GET provider sin id | Pass |
| TC-F13-007 | Precio sucursal | PATCH .../price | 200 + historial data[] | Pass |
| TC-F13-008 | Entradas + reporte | POST entries | 200 + balances/entries | Pass |
| TC-F13-009 | Inventario N>1 / N=1 | Paraíso vs Campo Verde | 200 sin entries; 403 | Pass |
| TC-F13-101 | UI admin | Login admin | Columna Origen, Inhabilitar, 0 Eliminar | Pass |
| TC-F13-102 | UI bandeja | Login proveedor | Copy Eliminados de la vista | Pass |
| TC-F13-103/104 | UI reportes | Login N>1 | Tab Inventario visible | Pass |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-F13-004 | DELETE / restore hueco | DELETE products; restore cuid inexistente | 405; 404 o 403 | Pass |
| TC-F13-006a | CAJA sin factor | saleUnit CAJA | 400 | Pass |
| TC-F13-010 | Paginación | page=0 limit=101 | 400 | Pass |
| TC-F13-011 | Entrada oculta | POST entries archivado | 409 | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| TC-F13-006b | Descarte unidad | onHand>0, confirmDiscard false | 400 luego 200 con flag | Pass |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| TC-F13-020 | Anónimo / CLIENT | GET admin; POST archive | 401 / 403 | Pass |
| TC-F13-021 | IDOR | Campo Verde archiva LOCAL Paraíso | 403 | Pass |
| TC-F13-022 | PROVIDER admin | GET /api/admin/products | 403 | Pass |

---

## Referencias upstream

- ACs: `Administrador de producto/Product Manager/outputs/laborregamarket/fase-13/user-stories/`
- Contratos: `Agente Arquitecto/.../fase-13/api/API-*-13.md`
- Handoff Backend: `MOD-CATALOG-F13-handoff.md`
- Handoff Frontend: `FEAT-ADMIN-13`, `FEAT-CAT-13`, `FEAT-DASH-13`

## Inputs Utilizados

- PRD/US Must F13, contratos API-*-13, MOD-CATALOG-F13, FEAT-*-13, QR-BE, QR-FE, handoff UX F13

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/test-matrices/TC-F13-matrix.md`
- **Agente Downstream:** PM (sign-off APROBADO); UX + Arquitecto (`QG-correcciones.md`)

## Notas

- GET `/api/provider/products` sigue envelope F10 `{ data: { provider, catalog }, meta }` (no array plano).
- POST POS vigente: `/api/provider/pos/sales`.
- Vitest app (BE): 376 passed / 81 files (evidencia). Playwright F13 **19/19** post-fix.
- Re-prueba BUG-020 con `EVIDENCIA-BUG-020.md`. Sin staging remoto.
