# QA Sign-off: QA-F14-signoff

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 14 — mejoras panel PROVIDER  
> **Sprint / Release:** v0.14.0  
> **Ambiente evaluado:** `http://127.0.0.1:8080` · `feat/f14-panel-proveedor` (`9f5b875` / `92cced6`) · PostgreSQL local `laborregamarket`  
> **Fecha:** 2026-09-17  
> **Evaluado por:** Agente QA / Tester Senior

---

## 1. Resumen ejecutivo

Se validó el Must F14 en las cuatro dimensiones (positivo, negativo, edge, RBAC) contra US, contratos API-*-14 y handoffs BE/FE. Perfil (GET me, Google lock, PATCH sin reset `isVerified`, geo AMM), catálogo sin identidad, `posShowImages` en POS, precio > 0 (nunca $50), 409 de sección, merma/ajuste/movimientos sin ventas, series/products/bySource, N=1 403+redirect y PDF `from`/`to` sin grain UI **cumplen**. Playwright **API 35/35** y **E2E 6/6**.

**Dictamen: APROBADO.** Zero Blocker PASS. Este sign-off **no cierra** la fase: UX y Arquitecto deben emitir `QG-correcciones.md`. QA **no** lanza DevOps.

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path ejecutados | 100% | 17/17 | Sí |
| Negativos / edge ejecutados | ≥ 85% | 19/19 | Sí |
| Casos de seguridad ejecutados | 100% | 5/5 | Sí |
| Regresión API F14 (Playwright) | 100% pass | 35/35 | Sí |
| Regresión E2E F14 (Playwright) | 100% pass | 6/6 | Sí |

**Matriz de referencia:** `test-matrices/TC-F14-matrix.md`

---

## 3. Bugs abiertos por severidad

| Severidad | Abiertos | Resueltos | Verificados | Diferidos |
|-----------|----------|-----------|-------------|-----------|
| Blocker | 0 | 0 | 0 | 0 |
| Critical | 0 | 0 | 0 | 0 |
| Major | 0 | 0 | 0 | 0 |
| Minor | 0 | 0 | 0 | 0 |

**Bugs Blocker/Critical abiertos:** Ninguno  

**Bugs Major diferidos con workaround:** Ninguno

---

## 4. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker Policy | Sin bugs Blocker ni Critical abiertos | PASS |
| Cobertura happy path | 100% ejecutado | PASS |
| Cobertura edge/negativos | ≥ 85% ejecutado | PASS |
| Regresión automatizada | 100% pass en staging/QA | PASS (local 8080) |
| Automatización actualizada | Scripts API/E2E en repo | PASS |
| Fixes verificados | No hubo bugs de producto F14 | PASS (N/A) |

---

## 5. Dictamen

**Resultado:** **APROBADO**

### Condiciones (si aplica)

Ninguna para Must F14. Ambiente: local, no staging remoto. Won't (kardex POS, Explorar, Cloudinary, BL-040, US-ADMIN-04) fuera de alcance.

### Justificación

Must de perfil, catálogo/POS, inventario recortado y reportes quedó cubierto en API+E2E. Sin Blocker/Critical. La primera corrida de merma/ajuste devolvió 500 por Prisma client desactualizado (proceso `next` bloqueaba `prisma generate`); no es defecto de producto. Tras `migrate deploy` + reinicio de Next, 41/41 Pass.

---

## 6. DoD QA

- [x] **Matriz Diseñada:** Casos positivos, negativos, edge cases y permisos documentados.
- [x] **Ejecución Completa:** API + E2E en local 8080.
- [x] **Bugs Documentados:** Ningún BUG-021+; no aplica paquete de defecto.
- [x] **Verificación de Fixes:** N/A (sin bugs de producto).
- [x] **Automatización Actualizada:** `tests/api/f14-panel.spec.ts`, `tests/e2e/f14-panel.spec.ts` (+ POM).
- [x] **Dictamen Emitido:** Sign-off al PM. APROBADO no cierra la fase.

---

**Firma QA:** Agente QA / Tester Senior  
**Fecha:** 2026-09-17
