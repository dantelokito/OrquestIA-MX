# User Story — US-ORDERS-04

> **ID:** US-ORDERS-04  
> **Título:** Email al proveedor de nuevo pedido  
>
> **Como:** PROVIDER  
> **Quiero:** recibir aviso asíncrono cuando un cliente encarga  
> **Para:** preparar el pedido  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un `POST /api/orders` exitoso y email de proveedor, entonces el envío corre en `after()` y no bloquea la respuesta HTTP.
> - [ ] **Escenario 2:** Dado proveedor sin email, entonces no se falla el pedido; queda observación de AUDIT `notificationFailed` (OBS-F3-022).
> - [ ] **Regla de Negocio:** POS no dispara este email. Misma infra async que NOTIFY F2.
>
> **Arquitecto:** REVIEW-ARCH F3 criterio 8.
