# Matriz de Casos de Prueba: TC-POS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** POS báscula (FE) + regresión cobro F3  
> **Historia / Contrato:** `US-POS-05, 06`, `API-POS-01` sin cambio  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 6 |
| Happy path | 3/3 |
| Edge | 2/2 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-POS-013 | Body venta sin VID/PID | Positivo | P1 | pos.spec.ts |
| HP-POS-01 | Badge + keypad + cobro | Positivo | P1 | e2e/pos-scale.spec.ts |
| HP-POS-01b | WebSerial unsupported fallback | Edge Case | P2 | e2e/pos-scale.spec.ts |
| F3-POS | Cobrar/Confirmar/Encargar intactos | Positivo | P1 | e2e/pos.spec.ts (F3) |
| EC-SCALE | No automatizar navigator.serial | Edge Case | P3 | N/A hardware |
| OBS-UX-F4-010 | Conectar báscula compite con Cobrar | Observación | P1 | No bug (conocido) |

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
