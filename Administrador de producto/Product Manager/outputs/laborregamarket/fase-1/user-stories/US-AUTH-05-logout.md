# User Story — US-AUTH-05

> **ID:** US-AUTH-05  
> **Título:** Cerrar sesión (logout)  
>
> **Como:** usuario autenticado  
> **Quiero:** cerrar mi sesión de forma segura  
> **Para:** proteger mi cuenta cuando termino de usar la plataforma o cambio de dispositivo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que tengo una sesión JWT válida en cookie httpOnly, cuando invoco `POST /api/auth/logout`, entonces la cookie de token se elimina, recibo `{ ok: true }` y ya no puedo acceder a rutas protegidas sin volver a login.
> - [ ] **Escenario 2 (Bitácora):** Dado que tengo sesión activa, cuando cierro sesión, entonces se registra evento `LOGOUT` en módulo `AUTH` con `entityId` y `userId` del usuario.
> - [ ] **Escenario 3 (Sin sesión):** Dado que no tengo cookie de sesión, cuando invoco logout, entonces la API responde `{ ok: true }` y elimina cookie si existía residual — sin error 401.
> - [ ] **Escenario 4 (UI):** Dado que estoy autenticado, cuando hago clic en "Cerrar sesión" en el Header (o menú de usuario), entonces se llama a logout y soy redirigido a `/` o `/login`.
> - [ ] **Regla de Negocio:** Tras logout, intentar acceder a `/admin`, `/proveedor` o `/cuenta` debe redirigir a `/login?redirect={pathname}`.
