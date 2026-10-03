# QA Sign-off: QA-F8-signoff

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 8 — Explorar polish (ubicación, radio 0.5–10, mapa MX, preview hover)  
> **Sprint / Release:** v0.8.3  
> **Ambiente evaluado:** `http://127.0.0.1:8080` (app local, seed Demo1234!)  
> **Fecha:** 2026-08-24  
> **Evaluado por:** Agente QA / Tester Senior

---

## 1. Resumen ejecutivo

Apertura y ejecución F8 contra Must v0.8.3. Suite focal **76 passed / 0 failed**. Clamp API 0.5–10, CDMX 200, `33.0,-99.0` 400, LocationChip, overlay radio, URL fuera de MX, preview hover y clic corto verificados. Zero Blocker **PASS**. Sin bugs F8 abiertos.

**Recomendación:** **APROBADO CON CONDICIONES** — long-press/marker en dispositivo real y Quality Gate UX siguen pendientes; EC-AUTH-09 (F7) no es gate F8.

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path Must auto | 100% | GEO/EXPLORE/ADDRESSES auto Pass | Sí |
| Negativos / edge | ≥ 85% | clamp, geocode corto, fuera MX, 500 lista, RBAC | Sí |
| Regresión focal F8 | 100% pass | **76/76** | Sí |
| CO-F7-001 pan ≠ radio | Evidencia test | HP-GEO-10 Pass | Sí |
| CO-F8-001 clamp 0.5–10 | API + slider | Pass | Sí |
| CO-F8-002 México | URL 33,-99 + API 400 | Pass (maxBounds visual = Should) | Sí |
| CO-F8-003 sin Vista rápida | Hover + clic corto | Pass | Sí |

**Comando corrida (24/08):**  
`npx playwright test tests/api/geo.spec.ts tests/api/addresses.spec.ts tests/api/providers.spec.ts tests/e2e/explore-f8.spec.ts tests/e2e/explore-f7.spec.ts tests/e2e/explore-geo.spec.ts tests/e2e/explore.spec.ts --workers=1`  
**Cwd:** `outputs/laborregamarket/tests`  
**Base URL:** `http://127.0.0.1:8080`

---

## 3. Bugs

| Severidad | Abiertos F8 | Cerrados verificados |
|-----------|-------------|----------------------|
| Blocker | 0 | — |
| Critical | 0 | — |
| Major | 0 | — |
| Minor | 0 | — |

**Bugs Blocker/Critical abiertos:** ninguno.

---

## 4. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker Policy | Sin bugs Blocker ni Critical abiertos | **PASS** |
| Cobertura happy path | 100% ejecutado (set auto Must) | **PASS** |
| Cobertura edge/negativos | ≥ 85% ejecutado | **PASS** |
| Regresión automatizada | 100% pass en local/QA | **PASS** 76/76 |
| Automatización actualizada | Specs API/E2E + POM F8 | **PASS** |
| Dictamen final | — | **APROBADO CON CONDICIONES** |

### Condiciones

- Smoke manual HP-EXPLORE-07c (long-press vs scroll) y HP-EXPLORE-07e (marker) en móvil/tablet real
- HP-GEO-18b: DELETE de favorita activa deja el pin (flujo UI autenticado, no cubierto E2E)
- Quality Gate UX F8 aún no emitido; si llega P0, re-probar el delta
- Condición arrastrada F7: EC-AUTH-09 cookies bloqueadas en dispositivo real (no es gate F8)

### Observación (no bloquea)

Cookie `lbm_token` es `Secure` con `NODE_ENV=production`. La suite API reenvía el token en header `Cookie` (`withAuth`). Chromium E2E no lo necesita (localhost es contexto seguro).

---

## 5. Dictamen

**Resultado:** **APROBADO CON CONDICIONES**

Must F8 (chip/panel, clamp 0.5–10, CDMX válida, rechazo fuera de MX, overlay sin 25 km, preview hover sin «Vista rápida», `CO-F7-001`) cubierto en automatización. No hay Blocker/Critical abiertos.

---

## 6. DoD QA

- [x] Matrices F8 diseñadas
- [x] Ejecución completa set focal
- [x] Bugs documentados (ninguno)
- [x] Automatización actualizada (`explore-f8.spec.ts` + deltas API + POM)
- [x] Dictamen emitido

**Siguiente paso:** PM/Orquestación puede cerrar F8 hacia release con las condiciones de smoke. QA no abre `fase-9/` hasta `STATUS.md`.

---

*Sign-off 24/08/2026.*
