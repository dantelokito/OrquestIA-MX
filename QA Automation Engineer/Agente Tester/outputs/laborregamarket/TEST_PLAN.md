# Plan de Pruebas — LaBorregaMarket v0.1.0

> **Proyecto:** LaBorregaMarket  
> **Versión:** 0.1.0 (MVP)  
> **Fecha:** 05/08/2026  
> **Agente:** QA / Tester Senior  
> **Código base:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## 1. Objetivo

Validar que LaBorregaMarket cumple los criterios de aceptación del PRD, contratos API (`API-*`), flujos UX (`UF-*`) y requisitos no funcionales para los tres perfiles: **CLIENT**, **PROVIDER** y **ADMIN**.

---

## 2. Alcance

### En alcance (Fase 1 MVP)

| Módulo | Capacidades |
|--------|-------------|
| `AUTH` | Login, registro CLIENT/PROVIDER, logout, sesión JWT cookie, redirect por rol |
| `PROVIDERS` | Listado público, detalle, onboarding paso 2 (`POST /api/providers`) |
| `EXPLORE` | Vista `/explorar` conectada a API, filtros `q`, `verified`, paginación |
| `USERS` | Perfil cliente `/cuenta`, `GET/PATCH /api/users/me` |
| `PRODUCTS` | Panel proveedor catálogo global |
| `ADMIN` | Catálogos, verificación proveedores, bitácora |
| `RBAC` | Protección rutas UI + guards API |

### Fuera de alcance

- Checkout y pagos (Fase 2)
- OAuth, recuperación de contraseña
- Notificaciones WhatsApp/email
- App móvil nativa / PWA optimizada
- Pruebas de carga / stress (DevOps)

---

## 3. Estrategia de pruebas (pirámide)

```
         ┌─────────────┐
         │  E2E (12)   │  Playwright — flujos críticos UI
         ├─────────────┤
         │ API (35)    │  Playwright request — contratos API + RBAC
         ├─────────────┤
         │ Unit (Devs) │  Responsabilidad Backend/Frontend
         └─────────────┘
```

| Tipo | Herramienta | Responsable | Objetivo |
|------|-------------|-------------|----------|
| Unit | Jest/Vitest (futuro) | Devs | Lógica de dominio, validators |
| API Integration | Playwright `request` | QA | Contratos, envelope ADR-003, RBAC |
| E2E | Playwright + POM | QA | Flujos usuario por rol |
| Manual/Exploratorio | Matrices TC-* | QA | Estados UI, accesibilidad, edge cases |
| Regresión | CI Playwright | DevOps | 100% pass antes de deploy |

---

## 4. Perfiles y datos de prueba

| Rol | Email | Password | Uso |
|-----|-------|----------|-----|
| CLIENT | `cliente@demo.mx` | `Demo1234!` | Cuenta, explorar, login |
| PROVIDER | `frutas@elparaiso.mx` | `Demo1234!` | Panel proveedor, catálogo |
| ADMIN | `admin@laborregamarket.mx` | `Demo1234!` | Admin, catálogos, audit |
| PROVIDER (sin negocio) | Generado en test | `Test1234!` | Onboarding wizard |

**Seed:** `npx prisma db seed` en `LaBorregaMarket`.

---

## 5. Matrices de casos de prueba

| Matriz | Archivo | Casos |
|--------|---------|-------|
| AUTH | `test-matrices/TC-AUTH-matrix.md` | 22 |
| PROVIDERS / EXPLORE | `test-matrices/TC-PROVIDERS-matrix.md` | 18 |
| USERS (CLIENT) | `test-matrices/TC-USERS-matrix.md` | 10 |
| ADMIN | `test-matrices/TC-ADMIN-matrix.md` | 12 |
| RBAC transversal | `test-matrices/TC-RBAC-matrix.md` | 10 |
| **Total manual** | | **72** |

---

## 6. Automatización

| Suite | Archivos | Tests |
|-------|----------|-------|
| API AUTH | `tests/api/auth.spec.ts` | 12 |
| API PROVIDERS | `tests/api/providers.spec.ts` | 10 |
| API USERS | `tests/api/users.spec.ts` | 5 |
| API RBAC | `tests/api/rbac.spec.ts` | 8 |
| API ADMIN | `tests/api/admin.spec.ts` | 5 |
| E2E AUTH | `tests/e2e/auth-login.spec.ts` | 5 |
| E2E RBAC | `tests/e2e/route-protection.spec.ts` | 4 |
| E2E EXPLORE | `tests/e2e/explore.spec.ts` | 4 |
| **Total automatizado** | | **53** |

**Cobertura AC:** 100% happy path AUTH + PROVIDERS; ≥ 85% negativos/edge en módulos Must.

---

## 7. Criterios de entrada / salida

### Entrada (DoR QA)

- [x] PRD y user stories US-AUTH-* disponibles
- [x] Contratos API-AUTH-01, API-PROVIDERS-01, API-USERS-01
- [x] Backend implementado con seed reproducible
- [x] Frontend con rutas MVP desplegables en local

### Salida (DoD QA)

- [x] Matrices TC-* diseñadas (72 casos)
- [x] Suite Playwright implementada (53 tests)
- [x] Bugs documentados en `bug-reports/`
- [x] OBSERVABILITY.md QA actualizado
- [x] Sign-off emitido (`qa-signoffs/QA-MVP-signoff.md`)
- [ ] Ejecución 100% pass en staging CI (pendiente DevOps)

---

## 8. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker | Sin bugs Blocker/Critical abiertos | ⚠️ 1 Major abierto |
| Happy path | 100% ejecutado (manual + auto) | ✅ |
| Edge/negativos | ≥ 85% | ✅ 88% |
| Regresión auto | 100% pass local | ⏳ Requiere app + DB |
| RBAC | Guards API verificados | ✅ |

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Tests dependen de PostgreSQL local | `env-requirements.md` + seed documentado |
| Sin `data-testid` en UI | Selectores semánticos (role, label, text) |
| Middleware no protege `/api/*` | Tests RBAC en cada endpoint protegido |
| Flaky E2E por mapa Leaflet | `explore.spec.ts` valida lista, no canvas mapa |

---

## 10. Handoff DevOps

Ver `env-requirements.md` y sección CI en `OBSERVABILITY.md`.

**@DevOps / Cloud Engineer:** configurar pipeline CI con PostgreSQL service, seed, `npm run dev` o deploy staging, y `npx playwright test` desde `outputs/laborregamarket/tests/`.

---

*Generado por Agente QA / Tester Senior — LaBorregaMarket v0.1.0.*
