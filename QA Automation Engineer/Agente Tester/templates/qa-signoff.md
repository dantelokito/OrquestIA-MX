# QA Sign-off: QA-{Module}-signoff

> **Proyecto:** `{nombre-proyecto}`  
> **Módulo / Feature:** `{Module}` (ej. AUTH, CHECKOUT, USERS)  
> **Sprint / Release:** `[Sprint XX / vX.Y.Z]`  
> **Ambiente evaluado:** `[staging URL]`  
> **Fecha:** `{YYYY-MM-DD}`  
> **Evaluado por:** [Agente QA / Nombre]

---

## 1. Resumen ejecutivo

[Un párrafo con el resultado general de la validación: qué se probó, hallazgos principales y recomendación de liberación.]

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path ejecutados | 100% | `[N/N]` | [ ] Sí / [ ] No |
| Negativos / edge ejecutados | ≥ 85% | `[N/N]` | [ ] Sí / [ ] No |
| Casos de seguridad ejecutados | 100% | `[N/N]` | [ ] Sí / [ ] No |
| Regresión API (Playwright) | 100% pass | `[N/N]` | [ ] Sí / [ ] No |
| Regresión E2E (Playwright) | 100% pass | `[N/N]` | [ ] Sí / [ ] No |

**Matriz de referencia:** `test-matrices/TC-{Module}-matrix.md`

---

## 3. Bugs abiertos por severidad

| Severidad | Abiertos | Resueltos | Verificados | Diferidos |
|-----------|----------|-----------|-------------|-----------|
| Blocker | `[N]` | `[N]` | `[N]` | `[N]` |
| Critical | `[N]` | `[N]` | `[N]` | `[N]` |
| Major | `[N]` | `[N]` | `[N]` | `[N]` |
| Minor | `[N]` | `[N]` | `[N]` | `[N]` |

**Bugs Blocker/Critical abiertos:** [Ninguno / listar BUG-XXX]

**Bugs Major diferidos con workaround:** [Ninguno / listar BUG-XXX + workaround]

---

## 4. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker Policy | Sin bugs Blocker ni Critical abiertos | [ ] PASS / [ ] FAIL |
| Cobertura happy path | 100% ejecutado | [ ] PASS / [ ] FAIL |
| Cobertura edge/negativos | ≥ 85% ejecutado | [ ] PASS / [ ] FAIL |
| Regresión automatizada | 100% pass en staging/QA | [ ] PASS / [ ] FAIL |
| Automatización actualizada | Scripts API/E2E en repo | [ ] PASS / [ ] FAIL |
| Fixes verificados | Re-prueba de bugs resueltos | [ ] PASS / [ ] FAIL |

---

## 5. Dictamen

**Resultado:** [ **APROBADO** / **RECHAZADO** / **APROBADO CON CONDICIONES** ]

### Condiciones (si aplica)

- [Condición 1 — ej. completar TC-AUTH-015 antes de producción]
- [Condición 2 — ej. monitorear BUG-003 en producción con workaround activo]

### Justificación

[Explicación breve del dictamen basada en los quality gates y métricas anteriores.]

---

## 6. DoD QA

- [ ] **Matriz Diseñada:** Casos positivos, negativos, edge cases y permisos documentados.
- [ ] **Ejecución Completa:** Pruebas manuales y/o exploratorias en staging/QA.
- [ ] **Bugs Documentados:** Fallas reportadas con pasos, logs y payloads.
- [ ] **Verificación de Fixes:** Re-prueba de defectos corregidos verificada.
- [ ] **Automatización Actualizada:** Scripts API/E2E en repositorio de pruebas.
- [ ] **Dictamen Emitido:** Sign-off compartido con el PM.

---

**Firma QA:** _________________________  
**Fecha:** `{YYYY-MM-DD}`
