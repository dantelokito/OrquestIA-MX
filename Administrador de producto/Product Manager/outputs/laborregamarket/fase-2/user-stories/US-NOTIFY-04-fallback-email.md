# User Story — US-NOTIFY-04

> **ID:** US-NOTIFY-04  
> **Título:** Fallback cuando proveedor sin email válido  
>
> **Como:** operador de plataforma (ADMIN)  
> **Quiero:** visibilidad cuando un proveedor no puede recibir notificaciones por email  
> **Para:** contactar al negocio y corregir datos antes de perder más leads  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Sin email proveedor):** Dado que el proveedor no tiene email en `User` ni teléfono de negocio usable para notificación, cuando ocurre un contacto, entonces el evento AUDIT incluye `details.notificationFailed: true` y razón `no_email`.
> - [ ] **Escenario 2 (Admin panel):** Dado que soy ADMIN, cuando reviso proveedores sin email válido, entonces puedo identificar negocios que requieren actualización de datos (lista o badge en admin).
> - [ ] **Escenario 3 (Validación/Error):** Dado que el email del proveedor es inválido en formato, cuando se intenta notificar, entonces no se envía email y se registra fallo sin exponer error al cliente.
> - [ ] **Regla de Negocio:** El cliente nunca ve datos internos del proveedor faltantes; solo feedback genérico si aplica.
