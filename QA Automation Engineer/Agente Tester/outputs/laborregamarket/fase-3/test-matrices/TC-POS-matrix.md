# Matriz de Casos de Prueba: TC-POS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** POS (venta mostrador)  
> **Contrato:** `API-POS-01`, `UF-POS-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 14 |
| Happy path ejecutados | 1/1 (100%) |
| Negativos / edge ejecutados | 11/12 (92%) |
| Seguridad ejecutados | 2/2 (100%) |
| Pass | 13 |
| Blocked | 1 (EC-07 idempotencia UI) |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-POS-001 | Venta catálogo CASH | Positivo | P1 | Pass |
| TC-POS-002 | Venta rápida customItem | Positivo | P1 | Pass |
| TC-POS-003 | Cantidad 1.250 KG | Edge Case | P1 | Pass |
| TC-POS-004 | XOR línea inválida | Negativo | P2 | Pass |
| TC-POS-005 | Idempotencia Cobrar | Edge Case | P1 | Pass |
| TC-POS-006 | UNPAID + DELIVERED | Negativo | P2 | Pass |
| TC-POS-007 | Sin sesión | Seguridad | P1 | Pass |
| TC-POS-008 | Rol CLIENT | Seguridad | P1 | Pass |
| TC-POS-009 | Ticket vacío | Negativo | P2 | Pass |
| TC-POS-010 | Cantidad 0 | Negativo | P2 | Pass |
| TC-POS-011 | Status CONFIRMED | Positivo | P2 | Pass |
| TC-POS-012 | Sin Idempotency-Key | Negativo | P2 | Pass |
| HP-POS-01 | E2E venta KG + rápida | Positivo | P1 | Pass |
| EC-04 | Buscador sin resultados | Edge Case | P2 | Pass |
| EC-05 | Cantidad inválida | Edge Case | P2 | Pass |

---

*Matriz Fase 3 — LaBorregaMarket v0.3.0*
