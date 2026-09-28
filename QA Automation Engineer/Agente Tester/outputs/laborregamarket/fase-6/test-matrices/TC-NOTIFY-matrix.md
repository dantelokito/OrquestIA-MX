# Matriz de Casos de Prueba: TC-NOTIFY-matrix (F6)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Contacto resiliente + deuda Redis  
> **Historia / Contrato:** `US-NOTIFY-10`, `US-BRAND-03`, `US-OPS-04/05`  
> **Fecha:** 2026-08-17  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 8 |
| Happy path | 2/3 (TC-NOT-001 no en este set) |
| Negativos / edge | 1/5 auto F6 + 1 ops Pass |
| Pass / Fail / Blocked | 3 / 0 / 5 (resto fuera de set / DevOps) |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| TC-NOT-001 | POST contact 200 | Positivo | P1 | api/notify.spec.ts (F4) | Fuera de este set |
| TC-NOT-003 | 429 rate limit | Negativo | P1 | api/notify.spec.ts | Fuera de este set |
| HP-NOT-10 | Toast 503 ≠ 500; CTA usable | Positivo | P1 | e2e/contact-resilience.spec.ts (mock) | Pass |
| EC-NOT-10 | Toast 500; 429 silencio | Edge | P1 | e2e/contact-resilience.spec.ts | Pass |
| TC-OPS-REDIS | `@upstash/redis` en lockfile | Seguridad/ops | P1 | inspección package.json | Pass (BUG-005 cerrado) |
| TC-OPS-MIGRATE | migrate F2→F5 | Ops | P2 | DevOps / no auto QA | Handoff |
| TC-OPS-CI | CI next start | Ops | P1 | DevOps | Handoff (BUG-008 riesgo next dev) |
| HP-REG-CONTACT | Llamar/WhatsApp F2 | Positivo | P1 | e2e/contact-f2-regression.spec.ts | Fuera de este set |

---

## 1. Positivos

| ID | Nombre | Resultado esperado | Estado |
|----|--------|-------------------|--------|
| HP-NOT-10 | 503 mock | copy “aviso… no está disponible”; Llamar sigue | Pass |
| TC-NOT-001 | happy notify | 200 notified | No corrido en set F6 |

---

## 2. Negativos / ops

| ID | Nombre | Esperado | Estado |
|----|--------|----------|--------|
| TC-OPS-REDIS | lockfile incluye Redis | DEV-P0-001 | Pass — `package.json` `@upstash/redis` ^1.38.2 |
| TC-NOT-003 | 429 | error demasiados | No corrido en set F6 |

---

## Notas

- 503 fail-closed real (prod, Redis caído) no se fuerza en local `NODE_ENV=development` (in-memory). E2E usa `page.route` para copy UI.
- CI / migrate: handoff DevOps; QA no emite pass inventado.
