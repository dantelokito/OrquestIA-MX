# Matriz de Casos de Prueba: TC-USERS-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** USERS (CLIENT /cuenta)  
> **Contrato:** API-USERS-01 / UF-CLIENT-03  
> **Fecha:** 2026-08-05  
> **Ambiente:** `http://localhost:3000`

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Total casos | 10 |
| Pass | 9 |
| Fail | 0 |
| Blocked | 1 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-USER-001 | GET perfil CLIENT autenticado | Positivo | P1 | Pass |
| TC-USER-002 | PATCH actualizar nombre | Positivo | P1 | Pass |
| TC-USER-003 | PATCH actualizar teléfono | Positivo | P2 | Pass |
| TC-USER-004 | PATCH teléfono null | Edge | P3 | Pass |
| TC-USER-005 | GET sin sesión | Seguridad | P1 | Pass |
| TC-USER-006 | GET rol PROVIDER | Seguridad | P1 | Pass |
| TC-USER-007 | GET rol ADMIN | Seguridad | P1 | Pass |
| TC-USER-008 | PATCH nombre vacío | Negativo | P2 | Pass |
| TC-USER-009 | UI /cuenta muestra perfil | Positivo | P1 | Pass |
| TC-USER-010 | UI /cuenta error de red | Edge | P2 | Blocked |

---

## Detalle TC-USER-001

| Campo | Valor |
|-------|-------|
| **Precondiciones** | Login CLIENT, cookie JWT |
| **Pasos** | GET `/api/users/me` |
| **Resultado esperado** | 200, `{ data: { id, email, name, phone, role: CLIENT } }` |
| **Criterio éxito** | Email coincide con sesión |

## Detalle TC-USER-009

| Campo | Valor |
|-------|-------|
| **Precondiciones** | CLIENT logueado |
| **Pasos** | Navegar `/cuenta` |
| **Resultado esperado** | Nombre y email del usuario visibles, formulario editable |
| **Criterio éxito** | No redirect a login |

---

## Referencias

- `tests/api/users.spec.ts`
