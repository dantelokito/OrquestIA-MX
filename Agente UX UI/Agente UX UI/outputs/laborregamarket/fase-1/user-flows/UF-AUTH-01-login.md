> **Flujo:** Login con redirección por rol
> **Historia de Usuario Asociada:** US-AUTH-01, US-AUTH-02, US-AUTH-06
>
> **Punto de entrada:** Header "Menú usuario" → `/login`, o redirect desde middleware (`/login?redirect=/ruta`)
>
> **Pasos del Usuario:**
> 1. `[Pantalla: cualquier página]` → Usuario hace clic en icono usuario del Header → navega a `/login`.
> 2. `[Pantalla: /login]` → Usuario ingresa email y password → clic "Ingresar".
> 3. `[Estado Loading]` → Botón muestra "Ingresando..." y está disabled durante la petición.
> 4. `[Condicional]` → ¿Credenciales válidas?
>    - **Sí (ADMIN):** → `[Pantalla: /admin]` — sesión JWT en cookie httpOnly.
>    - **Sí (PROVIDER con Provider):** → `[Pantalla: /proveedor]`.
>    - **Sí (PROVIDER sin Provider):** → `[Pantalla: /registro paso 2]` wizard onboarding negocio.
>    - **Sí (CLIENT sin redirect):** → `[Pantalla: /]` home.
>    - **Sí (CLIENT con ?redirect=):** → `[Pantalla: ruta redirect]` si es ruta permitida para CLIENT.
>    - **No (credenciales inválidas):** → `[Pantalla: /login]` → mensaje inline rojo `"Credenciales inválidas"`.
>    - **No (validación Zod):** → `[Pantalla: /login]` → mensajes inline bajo cada campo afectado.
> 5. `[Estado Error red]` → Mensaje banner `"Error de conexión. Intenta de nuevo."` + botón reintento.
>
> **Atajos demo (MVP):**
> - Botones en login para rellenar: Admin, Proveedor, Cliente (solo entornos dev/staging).
>
> **Reglas de negocio UI:**
> - Password mínimo 8 caracteres mostrado en hint (unificado con registro — BL-009).
> - Un solo CTA dominante: "Ingresar".
> - Link secundario: "¿No tienes cuenta? Regístrate" → `/registro`.
