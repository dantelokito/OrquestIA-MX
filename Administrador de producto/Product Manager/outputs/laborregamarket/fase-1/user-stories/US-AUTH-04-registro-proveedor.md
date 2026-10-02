# User Story — US-AUTH-04

> **ID:** US-AUTH-04  
> **Título:** Registro de cuenta proveedor con onboarding de negocio  
>
> **Como:** dueño de una frutería o verdulería  
> **Quiero:** registrarme como PROVIDER y configurar mi negocio  
> **Para:** dar visibilidad a mi negocio y gestionar productos del catálogo global  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Registro cuenta — actual):** Dado que selecciono rol PROVIDER en `/registro` o llego con `?role=provider`, cuando completo el formulario con datos válidos, entonces se crea `User` con `role=PROVIDER` y sesión JWT activa.
> - [ ] **Escenario 2 (Onboarding negocio — objetivo MVP):** Dado que acabo de registrarse como PROVIDER, cuando completo el wizard de onboarding (nombre negocio, dirección, ciudad, teléfono, coordenadas), entonces se crea entidad `Provider` vinculada a mi `userId` y puedo acceder al panel `/proveedor` sin error.
> - [ ] **Escenario 3 (Gap actual documentado):** Dado que registro solo crea `User` sin `Provider`, cuando soy redirigido a `/proveedor`, entonces el sistema debe mostrar estado claro (wizard de onboarding o mensaje de configuración pendiente) — **no** pantalla rota ni error silencioso.
> - [ ] **Escenario 4 (Validación):** Dado que intento registrar con email ya existente, cuando envío el formulario, entonces recibo 409 `"El email ya está registrado"`.
> - [ ] **Regla de Negocio:** Un `User` PROVIDER solo puede tener un `Provider` (relación 1:1). El negocio nuevo inicia con `isVerified=false` hasta revisión ADMIN. Password mínimo 8 caracteres en registro.
