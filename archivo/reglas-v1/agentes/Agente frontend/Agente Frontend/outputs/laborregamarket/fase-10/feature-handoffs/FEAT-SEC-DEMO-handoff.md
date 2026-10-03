# Handoff de Feature: FEAT-SEC-DEMO

> **Proyecto:** laborregamarket  
> **Feature:** Higiene cuentas demo en login  
> **Stack UI:** Next.js 15 + React 19  
> **Fecha:** 2026-08-28  
> **Wireframe:** `WF-login-higiene`  
> **Contrato:** `API-ADMIN-SEC-01` (criterio entorno; UI no llama endpoint)  
> **US:** US-SEC-03

## Inputs Utilizados

- **UX:** `UF-SEC-03-higiene-demo.md`, `WF-login-higiene.md`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Login higiene | `WF-login-higiene` | `/login` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `DemoAccountsBlock` | `src/components/auth/DemoAccountsBlock.tsx` | Unmount si `NODE_ENV=production` |
| `shouldShowDemoAccounts` | `src/lib/auth/demo-accounts.ts` | Gate explícito |

Card login F1 + `SessionPersistBanner` F7 intactos.

---

## 2. Integración API

UI no llama «¿mostrar demo?». Gate compile-time `NODE_ENV`.

401/403 en rutas F10 → `ErrorBanner` con copy canónico (`mapF10ApiError`).

---

## 3. Estados UI

| Vista | Dev | Production |
|-------|-----|------------|
| Login | Atajos email/password visibles | Cero emails/passwords seed en DOM |

---

## 4. Formularios

Login existente; demo solo rellena campos en no-producción.

---

## 5. Responsive y accesibilidad

- [x] Botones de atajo teclado/click
- [x] SessionPersistBanner intacto

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/report-f10-client.test.ts`

- [x] `shouldShowDemoAccounts("production") === false`

---

## 7. Definition of Done (DoD Frontend)

- [x] Cero credenciales seed en DOM de production
- [x] Dev conserva atajos
- [x] 403 → ErrorBanner existente
