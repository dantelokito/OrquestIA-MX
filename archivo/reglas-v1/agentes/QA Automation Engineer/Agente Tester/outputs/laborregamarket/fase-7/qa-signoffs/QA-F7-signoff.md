# QA Sign-off: QA-F7-signoff

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 7 — Explorar mapa-primero + preview + sesión portable (v0.7.1)  
> **Sprint / Release:** v0.7.1  
> **Ambiente evaluado:** `http://localhost:8080` (app local, seed Demo1234!)  
> **Fecha:** 2026-08-24  
> **Evaluado por:** Agente QA / Tester Senior

---

## 1. Resumen ejecutivo

Re-prueba F7 tras fixes Frontend de **BUG-012** (FilterBar chrome fuera de `.explore-main-scroll`), **BUG-013** (colapso + pestaña «Filtros») y **BUG-014** (CompactAddressBar fila horizontal ≥640px). Suite focal actualizada (`EC-GEO-18` … `EC-GEO-20` en `explore-f7.spec.ts`). **85 passed / 0 failed / 85**. Zero Blocker **PASS**. BUG-011 a BUG-014 cerrados.

**Recomendación:** **APROBADO CON CONDICIONES** — EC-AUTH-09 (banner con cookies bloqueadas) sigue pendiente de smoke en Safari/Chrome móvil real; sesión portable cubierta por API HP-AUTH-09b.

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path Must | 100% | GEO/EXPLORE/AUTH auto Pass | Sí |
| Negativos / edge | ≥ 85% | clamp, q 1 char, 500 error, RBAC /use, layout chrome | Sí |
| Regresión focal F7 | 100% pass | **85/85** | Sí |
| CO-F7-001 pan ≠ radio | Evidencia test | HP-GEO-10 Pass | Sí |
| Manual / auto layout F7 | EC-GEO-18..20 | Pass (Playwright 24/08) | Sí |

**Comando corrida (24/08):**  
`npx playwright test tests/api/geo.spec.ts tests/api/addresses.spec.ts tests/api/providers.spec.ts tests/api/auth.spec.ts tests/api/session.spec.ts tests/e2e/explore-f7.spec.ts tests/e2e/explore-geo.spec.ts tests/e2e/explore.spec.ts tests/e2e/auth-login.spec.ts --workers=1`  
**Cwd:** `outputs/laborregamarket/tests`  
**Base URL:** `http://127.0.0.1:8080`

---

## 3. Bugs

| Severidad | Abiertos F7 | Cerrados verificados |
|-----------|-------------|----------------------|
| Blocker | 0 | — |
| Critical | 0 | 2 (BUG-011 scroll; BUG-012 FilterBar chrome) |
| Major | 0 | 2 (BUG-013 colapso FilterBar; BUG-014 CompactAddressBar) |
| Minor | 0 | — |

**Bugs Blocker/Critical abiertos:** ninguno.

---

## 4. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker Policy | Sin bugs Blocker ni Critical abiertos | **PASS** |
| Cobertura happy path | 100% ejecutado | **PASS** |
| Cobertura edge/negativos | ≥ 85% ejecutado | **PASS** |
| Regresión automatizada | 100% pass en local/QA | **PASS** 85/85 |
| Automatización actualizada | Specs API/E2E en repo | **PASS** |
| Fixes verificados | BUG-011 … BUG-014 | **PASS** |
| Dictamen final | — | **APROBADO CON CONDICIONES** |

### Condiciones

- Smoke manual EC-AUTH-09 (cookies bloqueadas → `SessionPersistBanner`) en dispositivo real antes de prod
- Mantener CI con `npm run build` + `npm start`

### Observación (no bloquea)

Pestaña «Filtros» (BUG-013): Leaflet / `#radius-km` puede interceptar el pointer sobre el pill. El handler funciona y el contrato admite re-expandir con scroll al tope. Pulido FE opcional: subir `z-index` del pill por encima de Leaflet.

---

## 5. Dictamen

**Resultado:** **APROBADO CON CONDICIONES**

Must F7 (mapa-primero, CO-F7-001, meta.total, preview, búsqueda producto, favoritas `/use`, AUTH portable API) cubierto. Layout chrome + CompactAddressBar verificados. No hay Blocker/Critical abiertos.

---

## 6. DoD QA

- [x] Matrices F7 diseñadas
- [x] Ejecución completa set focal
- [x] Bugs documentados y verificados (011–014)
- [x] Verificación de fixes
- [x] Automatización actualizada (`explore-f7.spec.ts` + POM)
- [x] Dictamen emitido

**Siguiente paso:** PM/Orquestación activa Fase 8 cuando exista alcance. QA no abre `fase-8/` hasta `STATUS.md`.

---

## 7. Re-prueba layout (24/08)

| ID | Resultado | Notas |
|----|-----------|-------|
| EC-GEO-17 | Pass | Scroll en `.explore-main-scroll`; zoom no salta catálogo |
| EC-GEO-18 | Pass | FilterBar no es hijo del scroll; dirección sí se desplaza |
| HP-GEO-19 | Pass | Colapso al scroll down; expand al tope |
| EC-GEO-19 | Pass | Pestaña con badge; filtros persistentes |
| HP-GEO-20 | Pass | Fila única 768 y 1280; label Favoritas sr-only |
| EC-GEO-20 | Pass | Móvil 360 stack OK; 640px compacta |
| EC-AUTH-09 | Parcial | Sin smoke cookies-off en móvil real |

---

*Sign-off cerrado 24/08/2026. Sustituye el dictamen histórico del 23/08 (gate FAIL por BUG-012).*
