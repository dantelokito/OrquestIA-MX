# User Story — US-NOTIFY-03

> **ID:** US-NOTIFY-03  
> **Título:** Feedback al cliente tras contactar frutería  
>
> **Como:** cliente (CLIENT o visitante)  
> **Quiero:** ver confirmación breve de que la frutería fue notificada  
> **Para:** tener confianza de que mi interés fue registrado además de iniciar la llamada  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que hago clic en "Llamar" en `/fruteria/[id]`, cuando el evento de contacto se registra, entonces veo mensaje breve no bloqueante (toast o inline) "La frutería fue notificada" y la acción de llamada (`tel:`) continúa sin impedimento.
> - [ ] **Escenario 2 (Sin sesión):** Dado que no estoy autenticado, cuando contacto, entonces recibo el mismo feedback sin requerir login.
> - [ ] **Escenario 3 (Validación/Error):** Dado que el registro de contacto falla por red, cuando hago clic, entonces la llamada telefónica sigue disponible y opcionalmente se muestra "No pudimos notificar a la frutería" sin bloquear UX.
> - [ ] **Regla de Negocio:** El mensaje debe desaparecer automáticamente en 3–5 segundos o al cerrar; `aria-live="polite` para accesibilidad.
