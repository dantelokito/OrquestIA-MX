# Matriz de Casos de Prueba: TC-ORDERS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** ORDERS (checkout pickup, carrito, historial)  
> **Historia / Contrato:** `UF-ORDERS-01`, `API-ORDERS-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 20 |
| Happy path ejecutados | 5/5 (100%) |
| Negativos / edge ejecutados | 13/15 (87%) |
| Seguridad ejecutados | 3/3 (100%) |
| Pass | 18 |
| Fail | 0 |
| Blocked | 2 (EC-02 manual, EC-07 parcial) |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-ORD-001 | POST orden marketplace válida | Positivo | P1 | Pass |
| TC-ORD-002 | Idempotency-Key replay | Edge Case | P1 | Pass |
| TC-ORD-003 | GET historial paginado | Positivo | P1 | Pass |
| TC-ORD-004 | Cancelar PENDING | Positivo | P1 | Pass |
| TC-ORD-005 | Cancelar CONFIRMED → 409 | Negativo | P1 | Pass |
| TC-ORD-006 | POST sin sesión | Seguridad | P1 | Pass |
| TC-ORD-007 | POST rol PROVIDER | Seguridad | P1 | Pass |
| TC-ORD-008 | Sin Idempotency-Key | Negativo | P2 | Pass |
| TC-ORD-009 | customItem en marketplace | Negativo | P2 | Pass |
| TC-ORD-010 | Items vacíos | Negativo | P2 | Pass |
| TC-ORD-011 | Notas > 280 chars | Negativo | P2 | Pass |
| TC-ORD-012 | GET detalle dueño | Positivo | P2 | Pass |
| HP-ORDERS-01 | Flujo E2E checkout | Positivo | P1 | Pass |
| EC-01 | Carrito vacío | Edge Case | P2 | Pass |
| EC-02 | Producto no disponible al confirmar | Edge Case | P2 | Blocked |
| EC-08 | Invitado → login | Edge Case | P1 | Pass |

---

## Happy paths obligatorios

| ID | Pasos | Resultado esperado | Estado |
|----|-------|-------------------|--------|
| HP-ORDERS-01 | Stepper → carrito → confirmar → cuenta → cancelar | Pedido Pendiente/Cancelado | Pass |

---

*Matriz Fase 3 — LaBorregaMarket v0.3.0*
