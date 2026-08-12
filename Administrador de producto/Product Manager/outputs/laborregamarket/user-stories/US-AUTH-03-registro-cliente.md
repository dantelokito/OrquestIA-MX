# User Story — US-AUTH-03

> **ID:** US-AUTH-03  
> **Título:** Registro de cuenta cliente  
>
> **Como:** persona que desea comprar frutas y verduras en LaBorregaMarket  
> **Quiero:** crear una cuenta como CLIENT  
> **Para:** explorar fruterías y (en futuro) gestionar pedidos desde mi área personal  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que completo nombre (min 2 caracteres), email válido no registrado, password de al menos 8 caracteres y rol CLIENT, cuando envío el formulario de registro, entonces recibo 201 con `user.role=CLIENT`, se establece cookie JWT httpOnly y soy redirigido a `/explorar`.
> - [ ] **Escenario 2 (Email duplicado):** Dado que el email ya existe en la base de datos, cuando intento registrarme, entonces recibo 409 con mensaje `"El email ya está registrado"` y no se crea usuario duplicado.
> - [ ] **Escenario 3 (Validación):** Dado que el password tiene menos de 8 caracteres o el nombre es muy corto, cuando envío el formulario, entonces recibo 400 con mensaje Zod correspondiente.
> - [ ] **Escenario 4 (Teléfono opcional):** Dado que omito el campo teléfono, cuando registro con datos válidos, entonces la cuenta se crea con `phone` null o vacío sin error.
> - [ ] **Regla de Negocio:** Tras registro exitoso se registra evento `CREATE` en módulo `USERS` en bitácora AUDIT. El usuario queda autenticado automáticamente (no requiere login adicional).
