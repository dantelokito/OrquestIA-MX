# User Story — US-AUTH-01

> **ID:** US-AUTH-01  
> **Título:** Login exitoso con redirección por rol  
>
> **Como:** usuario registrado y activo (CLIENT, PROVIDER o ADMIN)  
> **Quiero:** iniciar sesión con mi email y contraseña  
> **Para:** acceder a las funcionalidades de mi rol en la plataforma  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso — ADMIN):** Dado que soy `admin@laborregamarket.mx` con password válido y cuenta activa, cuando envío el formulario de login, entonces recibo respuesta 200 con `user.role=ADMIN`, se establece cookie JWT httpOnly y soy redirigido a `/admin`.
> - [ ] **Escenario 2 (Exitoso — PROVIDER):** Dado que soy un proveedor con cuenta activa y entidad `Provider` vinculada, cuando inicio sesión correctamente, entonces soy redirigido a `/proveedor`.
> - [ ] **Escenario 3 (Exitoso — CLIENT):** Dado que soy un cliente con cuenta activa, cuando inicio sesión sin parámetro `redirect`, entonces soy redirigido a `/` o a la URL indicada en `?redirect=` si está presente y es una ruta permitida para CLIENT.
> - [ ] **Escenario 4 (Validación/Error):** Dado que ingreso email o password incorrectos, o la cuenta está desactivada (`isActive=false`), cuando envío el formulario, entonces recibo 401 con mensaje `"Credenciales inválidas"` y no se establece cookie de sesión.
> - [ ] **Regla de Negocio:** La contraseña en login debe tener al menos 6 caracteres (validación Zod en API). El evento `LOGIN` se registra en bitácora `AUDIT` con módulo `AUTH`, `entityId` y `userId` del usuario, e IP si está disponible.
