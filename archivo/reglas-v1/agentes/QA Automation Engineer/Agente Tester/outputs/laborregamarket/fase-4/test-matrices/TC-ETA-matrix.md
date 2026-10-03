# Matriz de Casos de Prueba: TC-ETA-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** ETA checkout  
> **Historia / Contrato:** `US-NOTIFY-09`, `API-GEO-01` eta, `UF-NOTIFY-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 6 |
| Happy path | 2/2 |
| Negativos / edge | 4/4 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-ETA-001 | Sin coords → eta_prep_only | Positivo | P1 | eta.spec.ts |
| TC-ETA-002 | Con pin → eta_ready_approx | Positivo | P1 | eta.spec.ts |
| TC-ETA-003 | lat XOR lng → 400 | Negativo | P2 | eta.spec.ts |
| TC-ETA-004 | DELIVERY sin offersDelivery → 400 | Negativo | P1 | eta.spec.ts |
| HP-ETA-01 | Chip carrito + Confirmar enabled | Positivo | P1 | e2e/checkout-eta.spec.ts |
| EC-ETA | Falla ETA no bloquea confirmar | Edge Case | P1 | HP-ETA-01 |

Copy UI: “Tiempo de preparación: ~Y min” vs “Listo aprox. en ~X min”.

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
