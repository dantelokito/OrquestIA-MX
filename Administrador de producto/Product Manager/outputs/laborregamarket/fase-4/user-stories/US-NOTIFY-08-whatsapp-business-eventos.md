# User Story — US-NOTIFY-08 (Should)

> **ID:** US-NOTIFY-08  
> **Título:** Notificaciones de pedido por WhatsApp Business  
>
> **Como:** CLIENT y PROVIDER  
> **Quiero:** recibir un mensaje de WhatsApp (no solo `wa.me` manual) cuando hay un pedido nuevo o está listo para recoger  
> **Para:** enterarme sin depender solo del correo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que un pedido pasa a `PENDING` (nuevo) o `IN_TRANSIT` (listo para recoger), cuando ocurre la transición, entonces se envía plantilla aprobada de WhatsApp Business al número registrado (proveedor y/o cliente si opt-in).
> - [ ] **Escenario 2 (Sin opt-in o número inválido):** Dado que el usuario no dio opt-in de WhatsApp o el número no es válido, cuando ocurre el evento, entonces el flujo continúa solo con email (no bloquea el pedido).
> - [ ] **Regla de Negocio:** Reutiliza la cola Redis de US-NOTIFY-06; eventos limitados a "nuevo pedido" y "listo para recoger" en este alcance (Should).
>
> **UX:** Pendiente copy de plantillas. **QA:** pendiente matriz (mockear proveedor de WA en sandbox).
