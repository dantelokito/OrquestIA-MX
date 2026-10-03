# QA Sign-off: QA-F6-progreso (parcial)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 6 — confiabilidad + reportes + GEO (v0.6.1)  
> **Sprint / Release:** v0.6.1  
> **Ambiente evaluado:** `http://localhost:8080` (200 estable)  
> **Fecha:** 2026-08-19 (actualización escalado BUG-010)  
> **Evaluado por:** Agente QA / Tester Senior

---

## 1. Resumen ejecutivo

Re-ejecución F6 (17/08): suite focal **49 passed / 4 failed / 53**. Tras reporte manual de Dante (19/08), **BUG-010 escalado a Blocker**: `/explorar` crashea al entrar (no solo con slider). Causa: `FitCircle` usa `L.circle().getBounds()` sin mapa Leaflet. Intento FE previo solo añadió instrumentación debug.

Fallos abiertos: **BUG-010** (Blocker, Explorar FE) y **BUG-009** (Major, PDF 500 BE). **No hay dictamen APROBADO.**

**Recomendación:** **EN PROGRESO** — Zero Blocker **FAIL**.

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path ejecutados | 100% | JSON/UI reportes + GEO query + contacto; PDF y Explorar Fail | No |
| Negativos / edge | ≥ 85% | grain/date/futuro + RBAC Pass | Sí (set auto) |
| Seguridad | 100% | TC-RBAC-026..030 Pass | Sí |
| Regresión Playwright F6 | 100% pass | 49/53 pass | No |
| Smoke `/explorar` (19/08) | Sin overlay | **Fail** — Blocker BUG-010 | No |

**Comando última corrida automatizada (17/08):**  
`PLAYWRIGHT_BASE_URL=http://localhost:8080 npx playwright test tests/api/reports.spec.ts tests/api/rbac.spec.ts tests/e2e/dashboard-reports.spec.ts tests/e2e/explore-geo.spec.ts tests/e2e/contact-resilience.spec.ts --workers=1`  
**Cwd:** `outputs/laborregamarket/tests`

| Spec | Resultado |
|------|-----------|
| api/rbac.spec.ts | 27/27 Pass (incl. F6 026–030) |
| api/reports.spec.ts | 9/10 Pass; TC-REP-008 Fail BUG-009 |
| e2e/contact-resilience.spec.ts | 2/2 Pass |
| e2e/dashboard-reports.spec.ts | 2/3 Pass; HP-DASH-06 Fail BUG-009 |
| e2e/explore-geo.spec.ts | 9/11 Pass; HP-GEO-07/08 Fail BUG-010 |

---

## 3. Bugs

| Severidad | Abiertos F6 |
|-----------|-------------|
| Blocker | **1** — BUG-010 (crash `/explorar`, FE) |
| Critical | 0 |
| Major | 1 — BUG-009 (PDF 500, BE) + BUG-008 no-repro |
| Minor | 0 |

Cerrados corrida 17/08: BUG-005, BUG-006 (deps), BUG-007.

---

## 4. Quality gates

| Gate | Estado |
|------|--------|
| Zero Blocker | **FAIL** — BUG-010 Blocker Explorar |
| Cobertura happy path ejecutada | FAIL (PDF Must + Explorar Blocker) |
| Automatización actualizada | PASS |
| Dictamen final | **No emitido — no APROBADO** |

---

## 6. DoD QA

- [x] Matriz diseñada
- [x] Ejecución completa del set F6 (17/08)
- [x] Bugs documentados (BUG-010 escalado 19/08)
- [ ] Verificación de fixes (009/010)
- [x] Automatización actualizada
- [ ] Dictamen emitido

**Siguiente paso:** Frontend corrige BUG-010 (`toBounds` + `whenReady`, quitar debug); Backend corrige BUG-009. QA re-corre smoke `/explorar`, HP-GEO-07/08, TC-REP-008, HP-DASH-06.

**Handoffs:** [QA-F6-handoff-frontend.md](../QA-F6-handoff-frontend.md) · [QA-F6-handoff-backend.md](../QA-F6-handoff-backend.md)

**Firma QA:** Agente QA / Tester Senior  
**Fecha:** 2026-08-19
