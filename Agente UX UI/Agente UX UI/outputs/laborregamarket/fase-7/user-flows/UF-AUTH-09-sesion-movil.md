> **Flujo:** Inicio de sesión portable (móvil u otro navegador) — errores de sesión no técnicos
> **Historia de Usuario Asociada:** US-AUTH-09
>
> **Punto de entrada:** `/login` (directo, gate de favoritas, o `?redirect=/explorar`). Layout F1 vigente. **No** rediseñar el formulario. **No** exponer SameSite, Secure, Domain ni JWT al usuario.
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /login]` → Email + contraseña. CTA dominante **Ingresar**. Fetch same-origin con `credentials: 'include'` (cookie HttpOnly).
> 2. `[Éxito]` → `GET /api/auth/session` (o equivalente F1) **no** debe 401 inmediato. Redirect a `redirect` o home por rol. Favorita pendiente en sessionStorage se guarda **después** vía API (F4/F7).
> 3. `[Otro dispositivo]` → Login independiente; favoritas salen del servidor, no del disco local del primer browser.
>
> **Condicionales:**
> - **Credenciales inválidas:** → Inline F1 “Credenciales inválidas”. Sin mención de cookies.
> - **Error de red:** → Banner “Error de conexión. Intenta de nuevo.” + reintento.
> - **Sesión no persistió (401 inmediato post-login en móvil/Safari):** → Banner no técnico: **“No pudimos mantener tu sesión en este navegador. Revisa que las cookies estén permitidas e intenta de nuevo.”** CTA **Reintentar**. Nunca “SameSite”, “Secure”, “HttpOnly”, stack trace.
> - **Cookies bloqueadas (detectable):** → Mismo copy + hint “Activa cookies para este sitio”.
> - **HTTP local vs HTTPS staging:** → FE no muestra flags; DevOps/ADR-025 cubre `Secure` solo en production.
>
> **Reglas UI:**
> - Un CTA: Ingresar. Mensajes `aria-live="polite"`. No seed QA en prod (demo buttons F1 solo no-prod).
> - Wireframe: `WF-login-sesion.md`. Base: `../../fase-1/wireframes/WF-login.md` (solo lectura).
>
> **API esperada:**
> - `POST /api/auth/login`, `GET /api/auth/session`, `POST /api/auth/logout` — **sin path nuevo** (Arquitecto `API-AUTH-01`).
>
> **Referencias:** D-F7-UX-8, ADR-025, US-AUTH-09.
