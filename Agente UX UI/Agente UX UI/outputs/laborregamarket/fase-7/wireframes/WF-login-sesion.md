> **Pantalla:** Login (`/login`) — delta sesión portable F7
> **Objetivo Principal:** Autenticar en móvil u otro navegador con mensajes no técnicos si la sesión no persiste
> **Base:** [`../../fase-1/wireframes/WF-login.md`](../../fase-1/wireframes/WF-login.md) (solo lectura). No rediseñar card ni demo buttons.

```text
+-----------------------------------------------------------------------+
| [Header público] Logo | Pill | Registra frutería | Menú               |
+-----------------------------------------------------------------------+
|                    ┌─────────────────────────────┐                    |
|                    │  Iniciar sesión             │                    |
|                    │  Email / Contraseña         │                    |
|                    │  [ ERROR INLINE / BANNER ]  │                    |
|                    │  [    Ingresar     ]        │                    |
|                    │  ¿No tienes cuenta?         │                    |
|                    └─────────────────────────────┘                    |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla (delta F7)

| Estado | Comportamiento UI |
|--------|-------------------|
| **Default / Loading / credenciales / validación / red** | Igual F1. |
| **Sesión no persistió** | Tras 200 de login, session GET 401 o cookie ausente: banner `role="alert"`: **“No pudimos mantener tu sesión en este navegador. Revisa que las cookies estén permitidas e intenta de nuevo.”** CTA **Reintentar** (secondary, ≥44px). |
| **Cookies bloqueadas** | Mismo banner + “Activa cookies para este sitio.” |
| **Prohibido** | Copy con SameSite, Secure, HttpOnly, JWT, CORS, stack. |

#### Componentes Requeridos para Frontend:
* Formulario F1 intacto.
* **SessionPersistBanner:** solo F7; `aria-live="assertive"`.
* Fetch: `credentials: 'include'`; same-origin.

#### Responsividad:
* Igual F1: móvil card `px-4` CTA `w-full`; desktop `max-w-md`.

#### Accesibilidad:
* Un CTA dominante Ingresar. Banner no tapa el formulario.
* Reintentar no sustituye Ingresar como primary.

#### API esperada:
* `POST /api/auth/login`, `GET /api/auth/session` — sin path nuevo.

#### Referencias:
* Flujo: `../user-flows/UF-AUTH-09-sesion-movil.md`
* ADR-025 (Arquitecto)
