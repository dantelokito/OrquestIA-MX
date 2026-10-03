# Matriz de Casos de Prueba: TC-ORDERS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Delivery Should + pickup default  
> **Historia / Contrato:** `US-ORDERS-05`, `API-ORDERS-01` delta  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 8 |
| Happy path | 3/3 |
| Negativos / edge | 4/4 |
| Seguridad | — |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-ORD-013 | Pickup default PICKUP | Positivo | P1 | orders.spec.ts |
| TC-ORD-014 | DELIVERY sin address → 400 | Negativo | P1 | orders.spec.ts |
| TC-ORD-015 | DELIVERY offersDelivery=false → 400 | Negativo | P1 | orders.spec.ts |
| TC-ORD-016 | DELIVERY + address → 201 snapshot/ETA | Positivo | P1 | orders.spec.ts |
| HP-ORD-05 | UI Recoger / A domicilio | Positivo | P1 | e2e/delivery.spec.ts |
| EC-04 | DELIVERY sin address | Edge Case | P1 | TC-ORD-014 |
| EC-05 | offersDelivery=false | Edge Case | P1 | TC-ORD-015 |
| HP-REG-01 | Encargar pickup F3 intacto | Positivo | P1 | contact-f2-regression.spec.ts |

Copy IN_TRANSIT: DELIVERY → “En camino”; pickup → “Listo para recoger” (OBS-UX-F4-012 ops proveedor).

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
