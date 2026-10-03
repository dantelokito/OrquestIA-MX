# Matriz de Casos de Prueba: TC-{Module}-matrix

> **Proyecto:** `{nombre-proyecto}`  
> **Módulo / Feature:** `{Module}` (ej. AUTH, CHECKOUT, USERS)  
> **Historia de Usuario / Contrato:** `[US-XXX / API-{Module}-XX]`  
> **Fecha:** `{YYYY-MM-DD}`  
> **Ambiente:** `[staging URL]`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | `[N]` |
| Happy path ejecutados | `[N/N]` (objetivo: 100%) |
| Negativos / edge ejecutados | `[N/N]` (objetivo: ≥ 85%) |
| Seguridad ejecutados | `[N/N]` |
| Pass | `[N]` |
| Fail | `[N]` |
| Blocked | `[N]` |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| `TC-{Module}-001` | [Título] | Positivo | P1 | [Pass / Fail / Blocked] |
| `TC-{Module}-002` | [Título] | Negativo | P2 | [Pass / Fail / Blocked] |
| `TC-{Module}-003` | [Título] | Edge Case | P2 | [Pass / Fail / Blocked] |
| `TC-{Module}-004` | [Título] | Seguridad | P1 | [Pass / Fail / Blocked] |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| `TC-{Module}-001` | [Título] | [Datos válidos] | [Comportamiento OK] | [ ] |

Detalle: ver [test-case.md](test-case.md) por cada caso.

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| `TC-{Module}-0XX` | [Título] | [Payload / acción inválida] | [HTTP 400 / mensaje UI] | [ ] |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| `TC-{Module}-0XX` | [Título] | [Nulo / vacío / max chars / timeout] | [Comportamiento controlado] | [ ] |

---

## 4. Casos de Seguridad / Permisos

| ID | Nombre | Escenario RBAC | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| `TC-{Module}-0XX` | [Título] | [Sin token / rol sin privilegio] | [HTTP 401 / 403 / redirect] | [ ] |

---

## Referencias upstream

- ACs del PM: `[US-XXX]`
- Contrato API: `API-{Module}-*`
- Handoff Backend: `MOD-{Module}-handoff.md`
- Handoff Frontend: `FEAT-{Feature}-handoff.md`

---

## Notas

- [Casos adicionales identificados en pruebas exploratorias]
- [Dependencias o datos seed requeridos]
