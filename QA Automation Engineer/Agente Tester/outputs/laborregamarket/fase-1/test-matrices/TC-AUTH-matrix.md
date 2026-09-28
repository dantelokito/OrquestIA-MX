# Matriz de Casos de Prueba: TC-AUTH-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** AUTH  
> **Historia de Usuario / Contrato:** US-AUTH-01..07 / API-AUTH-01  
> **Fecha:** 2026-08-05  
> **Ambiente:** `http://localhost:3000`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 22 |
| Happy path ejecutados | 8/8 (100%) |
| Negativos / edge ejecutados | 10/12 (83%) |
| Seguridad ejecutados | 4/4 (100%) |
| Pass | 20 |
| Fail | 1 |
| Blocked | 1 |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Estado |
|----|--------|------|-----------|--------|
| TC-AUTH-001 | Login exitoso CLIENT | Positivo | P1 | Pass |
| TC-AUTH-002 | Login exitoso PROVIDER | Positivo | P1 | Pass |
| TC-AUTH-003 | Login exitoso ADMIN | Positivo | P1 | Pass |
| TC-AUTH-004 | Login credenciales inválidas | Negativo | P1 | Pass |
| TC-AUTH-005 | Login password < 8 chars | Negativo | P2 | Pass |
| TC-AUTH-006 | Login email inválido | Negativo | P2 | Pass |
| TC-AUTH-007 | Cookie JWT httpOnly establecida | Positivo | P1 | Pass |
| TC-AUTH-008 | Registro CLIENT exitoso | Positivo | P1 | Pass |
| TC-AUTH-009 | Registro PROVIDER → wizard | Positivo | P1 | Pass |
| TC-AUTH-010 | Registro email duplicado | Negativo | P1 | Pass |
| TC-AUTH-011 | Registro password < 8 | Negativo | P2 | Pass |
| TC-AUTH-012 | Registro nombre < 2 | Negativo | P2 | Pass |
| TC-AUTH-013 | Registro sin teléfono | Positivo | P2 | Pass |
| TC-AUTH-014 | Logout elimina sesión | Positivo | P1 | Pass |
| TC-AUTH-015 | Redirect CLIENT con ?redirect= | Positivo | P2 | Pass |
| TC-AUTH-016 | Redirect inválido ignorado | Edge | P2 | Pass |
| TC-AUTH-017 | Redirect //evil.com bloqueado | Seguridad | P1 | Pass |
| TC-AUTH-018 | Audit LOGIN registrado | Positivo | P2 | Blocked |
| TC-AUTH-019 | Audit CREATE en registro | Positivo | P2 | Pass |
| TC-AUTH-020 | Sesión expirada → login | Edge | P2 | Pass |
| TC-AUTH-021 | Login cuenta desactivada | Negativo | P2 | Fail |
| TC-AUTH-022 | Logout sin sesión activa | Edge | P3 | Pass |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Pasos | Input | Resultado esperado | Criterio éxito |
|----|--------|----------------|-------|-------|-------------------|----------------|
| TC-AUTH-001 | Login CLIENT | Seed, cuenta activa | POST `/api/auth/login` | `cliente@demo.mx` / `Demo1234!` | 200, `{ data: { user: { role: CLIENT } } }`, cookie JWT | Status 200 + cookie Set-Cookie |
| TC-AUTH-002 | Login PROVIDER | Provider vinculado | POST login | `frutas@elparaiso.mx` / `Demo1234!` | 200, role PROVIDER | Redirect UI a `/proveedor` |
| TC-AUTH-003 | Login ADMIN | Cuenta admin seed | POST login | `admin@laborregamarket.mx` / `Demo1234!` | 200, role ADMIN | Redirect UI a `/admin` |
| TC-AUTH-008 | Registro CLIENT | Email único | POST `/api/auth/register` | name, email, password≥8, role CLIENT | 201, cookie JWT | Usuario en DB, redirect `/explorar` |
| TC-AUTH-009 | Registro PROVIDER | Email único | POST register role PROVIDER | datos válidos | 201, role PROVIDER | Redirect `/registro/negocio` |
| TC-AUTH-013 | Registro sin teléfono | — | POST register sin phone | phone omitido | 201, phone null | Sin error |
| TC-AUTH-014 | Logout | Sesión activa | POST `/api/auth/logout` con cookie | — | 200, `{ data: { message } }` | Cookie eliminada |
| TC-AUTH-015 | Redirect CLIENT | CLIENT logueado | UI login con `?redirect=/explorar` | credenciales válidas | Navega a `/explorar` | URL final correcta |

---

## 2. Casos Negativos

| ID | Nombre | Input inválido | Error esperado | Criterio fallo |
|----|--------|----------------|----------------|----------------|
| TC-AUTH-004 | Credenciales inválidas | email/password incorrectos | 401 `"Credenciales inválidas"` | No cookie |
| TC-AUTH-005 | Password corto login | password 7 chars | 400 Zod | Mensaje min 8 |
| TC-AUTH-006 | Email inválido | `not-an-email` | 400 | Validación email |
| TC-AUTH-010 | Email duplicado | email existente | 409 `"El email ya está registrado"` | No duplicado DB |
| TC-AUTH-011 | Password corto registro | password 7 chars | 400 | Validación |
| TC-AUTH-012 | Nombre corto | name `"A"` | 400 | min 2 chars |
| TC-AUTH-021 | Cuenta desactivada | isActive=false | 401 genérico | Sin revelar estado |

---

## 3. Edge Cases

| ID | Nombre | Condición | Resultado esperado |
|----|--------|-----------|-------------------|
| TC-AUTH-016 | Redirect inválido | `?redirect=explorar` (sin /) | Usa default `/cuenta` |
| TC-AUTH-020 | JWT expirado | Cookie corrupta | Middleware → `/login?redirect=` |
| TC-AUTH-022 | Logout sin sesión | POST logout sin cookie | 200 (idempotente) |

---

## 4. Seguridad

| ID | Nombre | Escenario | Resultado esperado |
|----|--------|-----------|-------------------|
| TC-AUTH-007 | Cookie httpOnly | Inspeccionar Set-Cookie | httpOnly, sameSite=lax |
| TC-AUTH-017 | Open redirect | `?redirect=//evil.com` | Ignorado, default por rol |
| TC-AUTH-004 | No enumeración email | email inexistente vs password mal | Mismo mensaje 401 |
| TC-AUTH-021 | Cuenta inactiva | isActive=false | Mensaje genérico 401 |

---

## Referencias upstream

- ACs: US-AUTH-01..07
- Contrato: API-AUTH-01
- Automatización: `tests/api/auth.spec.ts`, `tests/e2e/auth-login.spec.ts`
