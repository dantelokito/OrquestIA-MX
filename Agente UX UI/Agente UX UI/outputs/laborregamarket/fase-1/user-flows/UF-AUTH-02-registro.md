> **Flujo:** Registro de cuenta CLIENT o PROVIDER + wizard onboarding negocio
> **Historia de Usuario Asociada:** US-AUTH-03, US-AUTH-04
>
> **Punto de entrada:** `/registro`, Header "Registra tu frutería" → `/registro?role=provider`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /registro paso 1]` → Usuario selecciona tipo: **Cliente** o **Proveedor** (toggle segmentado).
> 2. `[Formulario paso 1]` → Nombre, email, password (min 8), teléfono (opcional).
> 3. `[Estado Loading]` → Botón "Creando cuenta..." disabled.
> 4. `[Condicional paso 1]` → ¿Datos válidos y email único?
>    - **No (validación):** → mensajes Zod inline bajo campos.
>    - **No (email duplicado):** → error inline `"El email ya está registrado"`.
>    - **Sí (CLIENT):** → `[Pantalla: /explorar]` con sesión activa + toast/mensaje bienvenida.
>    - **Sí (PROVIDER):** → `[Pantalla: /registro paso 2]` wizard negocio (sin redirect a `/proveedor` aún).
> 5. `[Pantalla: /registro paso 2 — solo PROVIDER]` → Nombre negocio, dirección, ciudad (default Monterrey), teléfono negocio, mapa/coords.
> 6. `[Condicional paso 2]` → ¿Datos negocio válidos?
>    - **No:** → mensajes inline (dirección requerida, coords en área Monterrey).
>    - **Sí:** → `[Pantalla: /proveedor]` con entidad `Provider` creada + sesión activa.
>
> **Wizard onboarding — campos paso 2:**

| Campo | Validación UI |
|-------|---------------|
| Nombre negocio | Requerido, min 2 caracteres |
| Dirección | Requerida |
| Ciudad | Default "Monterrey", editable |
| Teléfono negocio | Opcional, formato tel |
| Ubicación mapa | Pin en mapa o coords; área Monterrey |

> **Reglas de negocio UI:**
> - CTA dominante paso 1: "Crear cuenta". Paso 2: "Finalizar registro".
> - StepIndicator visible: Paso 1 Cuenta → Paso 2 Negocio (solo PROVIDER).
> - Link "¿Ya tienes cuenta? Inicia sesión" → `/login`.
