# QA Sign-off: QA-F10-signoff

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 10 — Admin seguro + catálogo local + media disco + reportes DASH  
> **Sprint / Release:** v0.10.2  
> **Ambiente evaluado:** `http://127.0.0.1:8080`  
> **Fecha:** 2026-09-12 (Must 31/08; re-test 015/016 12/09; cierre documental 12/09)  
> **Evaluado por:** Agente QA / Tester Senior

---

## 1. Resumen ejecutivo

Must F10 (SEC, ADMIN CRUD global, SKU local, secciones, media disco, reportes `from`/`to` + print) se ejecutó el 31/08: suite focal Playwright **89 passed / 0 failed**.

El 31/08 se reportó [BUG-015](../bug-reports/BUG-015.md) (`crypto.randomUUID` en `/carrito`) y [BUG-016](../bug-reports/BUG-016.md) (NFR 20 MiB). El dictamen pasó a **RECHAZADO** (Zero Blocker). El 12/09 el re-test confirmó: Encargar usable en Chrome+localhost; BE disco 20 MiB (`TC-MED-008` Pass); copy FE y `bodySizeLimit` pendientes.

**Criterio de cierre (stakeholder 12/09):** el ambiente de instalación/prueba es **localhost / 127.0.0.1**. Encargar y fotos ≤5 MB (y API 6 MiB) son usables. No se exige fallback UUID ni copy 20 MB para firmar v0.10.2.

BUG-015 y el resto de BUG-016 se reciclan a deuda técnica ([DT-F10-001](../deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md), [DT-F10-002](../deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md)). Tickets **Diferidos** (no Verificados). Lista de bugs **abiertos** F10: vacía.

Smoke Explorar F7/F8: **17/23** pass; 6 fallos alineados a chrome F9 — **no** se reabre F8.

**Recomendación:** **APROBADO CON CONDICIONES**. Zero Blocker **PASS** para release localhost. F10 queda **cerrada documentalmente**. F11 **no** se abre en esta sesión (el merge a GitHub es DevOps).

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path Must F10 ejecutados | 100% | Must seedable SEC/ADMIN/CAT/MEDIA/DASH 100% | Sí |
| Negativos / edge Must F10 | ≥ 85% | ≥ 90% del set auto; 4 TCs Blocked sin fixture | Sí |
| Casos de seguridad Must F10 | 100% seedable | 401/403/IDOR Pass | Sí |
| Regresión API+E2E F10 | 100% pass | **89/89** (suite focal Must) | Sí |
| Encargar `/carrito` en localhost | Usable en `127.0.0.1` | PASS en Chrome+localhost; DT-F10-001 fuera de secure context | Sí (release) |
| Media diaria + API 6 MiB | Flujo usable | `TC-MED-008` Pass; copy 20 MB / `TC-MED-009` → DT-F10-002 | Sí (release) |
| Smoke Explorar F7/F8 | 100% pass | 17/23 | No (deuda F9; condición) |

**Matrices Must:** `fase-10/test-matrices/TC-SEC|ADMIN|CAT|MEDIA|REPORTS-matrix.md`  
**Regresión Encargar:** `fase-10/test-matrices/TC-CART-regresion.md` (cobertura DT; no bloquea dictamen)

**Comando focal Must F10:** cwd `outputs/laborregamarket/tests`  
`npx playwright test --workers=1 tests/api/admin-products.spec.ts tests/api/local-products.spec.ts tests/api/sections.spec.ts tests/api/media.spec.ts tests/api/reports.spec.ts tests/api/rbac.spec.ts tests/e2e/dashboard-reports.spec.ts tests/e2e/provider-catalog-f10.spec.ts tests/e2e/fruteria-sections.spec.ts tests/e2e/admin-catalog-f10.spec.ts`

**Cobertura DT (pueden fallar):** `npx playwright test tests/e2e/cart-uuid.spec.ts` · `HP-MED-02` · `TC-MED-009`

---

## 3. Bugs abiertos por severidad

| Severidad | Abiertos | Resueltos | Verificados | Diferidos |
|-----------|----------|-----------|-------------|-----------|
| Blocker | 0 | 0 | 0 | 1 ([BUG-015](../bug-reports/BUG-015.md) → [DT-F10-001](../deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md)) |
| Critical | 0 | 0 | 0 | 0 |
| Major | 0 | 0 | 0 | 1 ([BUG-016](../bug-reports/BUG-016.md) → [DT-F10-002](../deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md); BE disco aceptado) |
| Minor | 0 | 0 | 0 | 0 |

**Bugs Blocker/Critical abiertos:** ninguno (release localhost).

**Lista abiertos F10:** vacía.

**Diferidos (no Verificados):**

- [BUG-015](../bug-reports/BUG-015.md) → [DT-F10-001](../deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md)
- [BUG-016](../bug-reports/BUG-016.md) → [DT-F10-002](../deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md)

**TCs Blocked (sin fixture, no bug):** `TC-SEC-006` ADMIN sin PRODUCTS/view; `TC-SEC-007` último ADMIN; `TC-ADM-026` hard-delete Prisma; `TC-SEC-010` DemoAccountsBlock en production.

---

## 4. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker Policy | Sin bugs Blocker ni Critical **abiertos** (release localhost) | **PASS** — 015 Diferido a DT-F10-001 |
| Cobertura happy path Must F10 | 100% Must F10 ejecutado | PASS |
| Cobertura edge/negativos Must F10 | ≥ 85% ejecutado | PASS |
| Regresión automatizada F10 Must | 100% pass suite focal | PASS |
| Encargar (regresión F3) en localhost | `/carrito` usable en `127.0.0.1` | PASS (release); DT fuera de localhost |
| Automatización actualizada | Specs API/E2E F10 + cobertura DT | PASS |
| Fixes Verificados | 015/016 no Verificados | N/A — Diferidos a DT |
| Smoke Explorar F7/F8 | 100% pass | FAIL — chrome F9 vs specs F7/F8 (condición) |

---

## 5. Dictamen

**Resultado:** **APROBADO CON CONDICIONES** (12/09/2026)

El **RECHAZADO** del 31/08 queda **superado** por el criterio de ambiente localhost. No se anula la evidencia histórica de 015/016: se recicla a DT.

### Condiciones (siguen abiertas; no bloquean merge GitHub)

1. **[DT-F10-001](../deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md)** — fallback UUID fuera de secure context (`http://IP` / navegadores viejos). Specs `cart-uuid.spec.ts` / `EC-CART-015` pueden fallar.
2. **[DT-F10-002](../deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md)** — copy FE 20 MB + `bodySizeLimit` (oversize → 400). `HP-MED-02` / `TC-MED-009` pueden fallar. BE disco 20 MiB ya aceptado.
3. **F9 sin sign-off QA.** E2E Explorar F7/F8 desfasado vs chrome F9.
4. **`READY-FOR-QA.md` F10 ausente** (UX/Arquitecto).
5. **`US-ADMIN-04`** = Should, no validado.
6. TCs último ADMIN / permiso módulo sin seed.

### Fuera de este dictamen

- Código de producto (uuid helper, copy 20MB, `bodySizeLimit`) — no lo toca QA.
- Abrir `fase-11/` — el merge es DevOps.
- DT-F10 **no** es P0 de CI.

Handoff merge: [`QA-F10-handoff-devops.md`](../QA-F10-handoff-devops.md) · [`activation-prompt-devops-merge-F10.txt`](../activation-prompt-devops-merge-F10.txt).

---

## 6. DoD QA

- [x] Matriz diseñada (4 dimensiones Must F10 + matriz regresión carrito)
- [x] Ejecución Must F10 en local (89/89)
- [x] Bugs: BUG-015 + BUG-016 **Diferidos** → DT-F10-001 / DT-F10-002
- [x] Automatización: suite focal + cobertura DT (`cart-uuid.spec.ts`, media 008/009, HP-MED-02)
- [x] Dictamen emitido (**APROBADO CON CONDICIONES**)
- [x] Handoff DevOps para merge GitHub

**Firma QA:** Agente QA / Tester Senior  
**Fecha:** 2026-09-12
