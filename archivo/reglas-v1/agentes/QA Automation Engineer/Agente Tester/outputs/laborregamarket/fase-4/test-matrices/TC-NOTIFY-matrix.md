# Matriz de Casos de Prueba: TC-NOTIFY-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Contacto Inngest + rate limit  
> **Historia / Contrato:** `US-NOTIFY-06, 07`, `API-NOTIFY-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 6 |
| Happy path | 2/2 |
| Negativos / edge | 2/3 |
| Seguridad | — |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-NOT-001 | POST contact 200 `{ data.notified: true }` | Positivo | P1 | notify.spec.ts |
| TC-NOT-002 | provider 404 | Negativo | P2 | notify.spec.ts |
| TC-NOT-003 | 6º en 10 min → 429 | Edge Case | P1 | notify.spec.ts |
| HP-NOTIFY-01 | Respuesta rápida sin `after()` | Positivo | P1 | TC-NOT-001 |
| HP-REG-01 | Llamar / WhatsApp / Encargar | Positivo | P1 | contact-f2-regression.spec.ts |
| EC-09 | Redis caído en production → 503 | Edge Case | P2 | Blocked local |

Local: rate limit in-memory. Staging Upstash: OBS-F4-022.

*Matriz Fase 4 — LaBorregaMarket v0.4.0*
