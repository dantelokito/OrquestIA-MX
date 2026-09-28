# QA Sign-off: QA-F12-signoff

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 12 — Inventario / almacén  
> **Sprint / Release:** v0.12.0  
> **Ambiente evaluado:** `http://127.0.0.1:8080` · `feat/f12-inventario-blando`  
> **Fecha:** 2026-09-14 (re-prueba post-evidencia BE)  
> **Evaluado por:** Agente QA / Tester Senior

---

## 1. Resumen ejecutivo

Tras `EVIDENCIA-BUG-019.md` (Prisma client regenerado y Next en 8080), se re-ejecutó Playwright F12. **API 16/16** y **E2E 5/5**. Inventario listado/entrada/tope, POS blando, Encargar reserva/commit/restore, CAT barra, silencio `/fruteria`, toggle POS por sucursal e IDOR 403 cumplen Must.

**Dictamen: APROBADO.** Zero Blocker PASS. Este sign-off **no cierra** la fase: UX y Arquitecto deben emitir `QG-correcciones.md`. QA **no** lanza DevOps.

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path ejecutados | 100% | 15/15 | Sí |
| Negativos / edge ejecutados | ≥ 85% | 4/4 | Sí |
| Casos de seguridad ejecutados | 100% | 3/3 | Sí |
| Regresión API F12 (Playwright) | 100% pass | 16/16 | Sí |
| Regresión E2E F12 (Playwright) | 100% pass | 5/5 | Sí |

**Matriz de referencia:** `test-matrices/TC-F12-matrix.md`

---

## 3. Bugs abiertos por severidad

| Severidad | Abiertos | Resueltos | Verificados | Diferidos |
|-----------|----------|-----------|-------------|-----------|
| Blocker | 0 | 0 | 1 (019) | 0 |
| Critical | 0 | 0 | 0 | 0 |
| Major | 0 | 0 | 0 | 0 |
| Minor | 0 | 0 | 0 | 0 |

**Bugs Blocker/Critical abiertos:** Ninguno  

**Bugs Major diferidos con workaround:** Ninguno

BUG-017/018 F11 no reabiertos. F10 BUG-015/016 siguen diferidos (no P0 F12).

---

## 4. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker Policy | Sin bugs Blocker ni Critical abiertos | PASS |
| Cobertura happy path | 100% ejecutado | PASS |
| Cobertura edge/negativos | ≥ 85% ejecutado | PASS |
| Regresión automatizada | 100% pass en staging/QA | PASS |
| Automatización actualizada | Scripts API/E2E en repo | PASS |
| Fixes verificados | Re-prueba con evidencia BE | PASS |

---

## 5. Dictamen

**Resultado:** **APROBADO**

### Condiciones (si aplica)

Ninguna para Must F12. Residual observabilidad: un GET inventory superó 500 ms (aviso de umbral QA, no fallo HTTP). Regenerar Prisma en Windows exige parar Next si el DLL está bloqueado.

### Justificación

Must de inventario blando, POS no-bloqueo, Encargar, CAT/POS UI y aislamiento 403 quedó cubierto en API+E2E. BUG-019 se verificó contra evidencia Backend.

---

## 6. DoD QA

- [x] **Matriz Diseñada:** Casos positivos, negativos, edge cases y permisos documentados.
- [x] **Ejecución Completa:** Re-prueba en `127.0.0.1:8080`.
- [x] **Bugs Documentados:** BUG-019 Verificado.
- [x] **Verificación de Fixes:** Con `EVIDENCIA-BUG-019.md`.
- [x] **Automatización Actualizada:** Specs F12 21/21.
- [x] **Dictamen Emitido:** APROBADO a PM; no cierra fase; no DevOps.

---

**Firma QA:** Agente QA / Tester Senior  
**Fecha:** 2026-09-14
