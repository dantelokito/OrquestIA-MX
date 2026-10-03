# User Story — US-NOTIFY-01

> **ID:** US-NOTIFY-01  
> **Título:** Email al proveedor cuando un cliente contacta la frutería  
>
> **Como:** dueño de frutería (PROVIDER)  
> **Quiero:** recibir un correo cuando un cliente hace clic en contactar/llamar desde mi página de negocio  
> **Para:** responder rápido al interés del cliente sin perder la oportunidad de venta  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que un usuario (público o CLIENT) hace clic en "Llamar" o CTA de contacto en `/fruteria/[id]`, cuando se registra el evento de contacto, entonces el proveedor asociado recibe un email en el buzón configurado del negocio/usuario dentro de 30 segundos.
> - [ ] **Escenario 2 (Contenido email):** Dado que se envía la notificación, cuando el proveedor abre el email, entonces ve nombre del negocio, fecha/hora, enlace a su panel y productos destacados de la página (sin teléfono del cliente por defecto).
> - [ ] **Escenario 3 (Validación/Error):** Dado que el proveedor no tiene email válido configurado, cuando ocurre un contacto, entonces el evento se registra en AUDIT y el sistema no falla la experiencia del cliente (sin error visible al usuario).
> - [ ] **Regla de Negocio:** La respuesta HTTP al cliente (inicio de llamada o feedback UI) no debe esperar la entrega del email; notificación en background/async.
