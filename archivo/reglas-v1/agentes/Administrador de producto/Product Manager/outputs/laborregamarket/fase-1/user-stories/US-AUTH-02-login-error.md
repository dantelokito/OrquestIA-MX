# User Story — US-AUTH-02

> **ID:** US-AUTH-02  
> **Título:** Login con errores de validación y conexión  
>
> **Como:** usuario que intenta iniciar sesión  
> **Quiero:** recibir mensajes claros cuando mis datos son inválidos o hay un fallo de red  
> **Para:** corregir mi entrada o reintentar sin confusión  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Email inválido):** Dado que ingreso un email con formato incorrecto (ej. `usuario@`), cuando envío el formulario, entonces la API responde 400 con el mensaje de validación Zod (ej. `"Email inválido"`) y la UI muestra el error inline en rojo.
> - [ ] **Escenario 2 (Password corta):** Dado que ingreso un password con menos de 6 caracteres, cuando envío el formulario, entonces la API responde 400 con mensaje `"Contraseña mínima 6 caracteres"`.
> - [ ] **Escenario 3 (Campos vacíos):** Dado que dejo email o password vacíos, cuando intento enviar, entonces el navegador bloquea el envío por `required` en los inputs HTML y no se llama a la API.
> - [ ] **Escenario 4 (Error de conexión):** Dado que la petición a `/api/auth/login` falla por red o timeout, cuando el usuario envía el formulario, entonces la UI muestra `"Error de conexión"` y el botón vuelve a estado habilitado.
> - [ ] **Regla de Negocio:** Los mensajes de error de credenciales (401) y validación (400) deben ser distintos; nunca revelar si el email existe en el sistema en respuestas 401.
