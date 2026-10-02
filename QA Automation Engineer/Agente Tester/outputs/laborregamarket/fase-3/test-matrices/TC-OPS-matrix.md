# Matriz de Casos de Prueba: TC-OPS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** OPS (órdenes proveedor)  
> **Contrato:** `API-PROVIDER-ORDERS-01`, `UF-OPS-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 12 |
| Happy path ejecutados | 1/1 (100%) |
| Negativos / edge ejecutados | 9/10 (90%) |
| Seguridad ejecutados | 2/2 (100%) |
| Pass | 11 |
| Blocked | 1 (EC-07 doble clic UI) |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-OPS-001 | GET tab active | Positivo | P1 | Pass |
| TC-OPS-002 | GET tab completed | Positivo | P2 | Pass |
| TC-OPS-003 | GET tab cancelled | Positivo | P2 | Pass |
| TC-OPS-004 | PENDING → CONFIRMED | Positivo | P1 | Pass |
| TC-OPS-005 | Ciclo hasta DELIVERED | Positivo | P1 | Pass |
| TC-OPS-006 | Sin token | Seguridad | P1 | Pass |
| TC-OPS-007 | Rol CLIENT | Seguridad | P1 | Pass |
| TC-OPS-008 | Filtro MARKETPLACE | Positivo | P2 | Pass |
| TC-OPS-009 | Transición inválida 409 | Negativo | P2 | Pass |
| TC-OPS-010 | Filtro source POS | Positivo | P2 | Pass |
| HP-OPS-01 | E2E ciclo proveedor | Positivo | P1 | Pass |
| EC-03 | Cancelar confirmado 409 | Edge Case | P2 | Pass |

---

*Matriz Fase 3 — LaBorregaMarket v0.3.0*
