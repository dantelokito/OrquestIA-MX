> **Flujo:** Sesión expirada y protección de rutas
> **Historia de Usuario Asociada:** US-AUTH-07
>
> **Punto de entrada:** Usuario sin cookie JWT intenta acceder a ruta protegida (`/proveedor`, `/admin`, `/cuenta`)
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor sin sesión]` → Middleware intercepta → redirect a `/login?redirect=/proveedor`.
> 2. `[Pantalla: /login]` → Usuario ve mensaje informativo: "Inicia sesión para continuar" (opcional, no bloqueante).
> 3. `[Pantalla: /login]` → Usuario ingresa credenciales → clic "Ingresar".
> 4. `[Condicional]` → ¿Login exitoso?
>    - **No:** → permanece en `/login` con errores inline.
>    - **Sí:** → evaluar rol vs ruta destino (`redirect` param).
> 5. `[Condicional rol]` → ¿Rol coincide con ruta destino?
>    - **Sí (PROVIDER → /proveedor):** → destino original.
>    - **Sí (CLIENT → /cuenta):** → destino original.
>    - **Sí (ADMIN → /admin):** → destino original.
>    - **No (CLIENT intenta /proveedor):** → redirect a `/` — evitar acceso cruzado.
>    - **No (PROVIDER intenta /admin):** → redirect a `/proveedor` o `/`.
>
> **Casos adicionales:**
> - Sesión expirada (cookie > 7 días): mismo flujo que sin sesión.
> - `redirect` con URL externa: ignorar param, ir a home del rol (anti open-redirect — BL-010).
> - API sin guard middleware: UI no depende de esto; Backend debe retornar 401/403.
