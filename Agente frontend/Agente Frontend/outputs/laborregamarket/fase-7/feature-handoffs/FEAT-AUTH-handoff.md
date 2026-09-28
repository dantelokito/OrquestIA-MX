# Handoff de Feature: FEAT-AUTH

> **Proyecto:** laborregamarket
> **Feature:** AUTH (sesión portable en móvil / otro navegador)
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4
> **Fecha:** 2026-08-18
> **Wireframe:** `WF-login-sesion`
> **Contrato:** `API-AUTH-01` + `MOD-AUTH-handoff` · ADR-025
> **US:** US-AUTH-09

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Login (delta F7) | `WF-login-sesion` | `/login` | OK (card F1 intacta) |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `SessionPersistBanner` | `src/components/auth/SessionPersistBanner.tsx` | `role="alert"` + `aria-live="assertive"`, `bg-red-50 text-red-800`, CTA Reintentar ≥44px |

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/auth/login` | POST | `login` | API-AUTH-01 | OK |
| `/api/auth/session` | GET | `getAuthSession` | API-AUTH-01 | OK (verificación post-login) |

Tras un login 200 se consulta la sesión: si `authenticated` es `false`, la cookie no viajó de vuelta y se muestra el banner en lugar de navegar. Todo el cliente HTTP (`src/lib/api/client.ts`) usa `credentials: "include"` same-origin; sin Bearer.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Login | Botón "Ingresando..." | — | Credenciales/red: mensaje inline F1 · Sesión no persistida: `SessionPersistBanner` | Redirección por rol o `redirect` validado |

Cookies bloqueadas (`navigator.cookieEnabled === false`): mismo banner + "Activa cookies para este sitio."

---

## 4. Formularios y validación

Formulario F1 sin cambios: email requerido, contraseña mínima 8, mensajes inline. **Ingresar** sigue siendo el único CTA primario; **Reintentar** es secundario.

---

## 5. Responsive y accesibilidad

- [x] Banner no tapa el formulario (se inserta sobre el CTA)
- [x] `role="alert"` + `aria-live="assertive"` para lectores de pantalla
- [x] Reintentar `min-h-11`
- [x] Copy sin jerga: ni SameSite, ni Secure, ni HttpOnly, ni JWT, ni CORS

---

## 6. Pruebas

Cobertura de cookie/sesión en backend: `tests/unit/session-cookie.test.ts`, `tests/integration/session.routes.test.ts`. La rama de UI se valida manualmente bloqueando cookies en el navegador.

---

## 7. Definition of Done (DoD Frontend)

- [x] **Diseño Pixel-Fidelidad**
- [x] **Responsive Design**
- [x] **Manejo de los 4 Estados UI**
- [x] **Consumo Limpio de APIs**
- [x] **Validación de Formulario**
- [x] **Accesibilidad Basal**

---

## 8. Notas para downstream

### QA Tester

- Safari iOS / Chrome con cookies de sitio bloqueadas: login 200 pero la app debe quedarse en `/login` con el banner, no navegar a una pantalla vacía.
- Con cookies permitidas: login redirige por rol y `redirect=/explorar` se respeta.
- El texto del banner no debe mencionar tecnología.

### DevOps

Sin variables nuevas. `Secure` solo en `NODE_ENV=production` (backend).
