> **Flujo:** Ocultar cuentas demo en producción; 401/403 con ErrorBanner existente
> **Historia de Usuario Asociada:** US-SEC-03
>
> **Punto de entrada:** `/login` y `/registro`. Baseline F1 atajos demo + F7 SessionPersistBanner **intactos en desarrollo**.

> **Pasos del Usuario:**
> 1. `[Desarrollo / no production]` → Bloque de atajos demo (Admin / Proveedor / Cliente) **puede** permanecer. No rediseñar card F1 ni SessionPersistBanner F7.
> 2. `[Producción]` → Dado `NODE_ENV=production` (o flag documentado por Arquitecto `API-ADMIN-SEC-01`), el bloque **no se renderiza**. Cero emails demo (`cliente@demo.mx`, `admin@laborregamarket.mx`, etc.) y cero passwords (`Demo1234!`) en DOM o copy.
> 3. `[Rutas F10 nuevas sin sesión]` → UI no inventa pantallas de “forbidden”. Cliente: ErrorBanner + CTA Iniciar sesión, o redirect `/login?redirect=…` como F1.
> 4. `[Rol incorrecto]` → ErrorBanner existente: «Sin permiso para este módulo» / «Esta vista es solo para tu negocio». **No** UI de matriz de roles, 2FA ni impersonation.

**Condicionales:**
- **Hidratar mal el flag:** preferir ocultar demo si el entorno no es explícitamente development.
- **Registro:** misma regla que login (sin lista de cuentas seed).

**Reglas UI:**
- Delta mínimo. No tocar layout de card.
- Wireframe: `WF-login-higiene.md`. Base: `fase-1/wireframes/WF-login.md`, `fase-7/wireframes/WF-login-sesion.md` (solo lectura).
- 401/403 de APIs F10: envelope ADR-003; reutilizar ErrorBanner F1–F3.

**API esperada:**
- Criterio de entorno: Arquitecto `API-ADMIN-SEC-01` (higiene prod). UI no llama un endpoint «¿mostrar demo?».
- Gates 401/403 en rutas nuevas: Backend; FE solo pinta ErrorBanner.

**Referencias:** D-F10-1, OBS-05, DEV-P2-011, `API-ADMIN-SEC-01.md`.
