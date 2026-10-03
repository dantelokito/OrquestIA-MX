# User Story — US-ORDERS-03

> **ID:** US-ORDERS-03  
> **Título:** Cancelar pedido PENDING  
>
> **Como:** CLIENT dueño de la orden  
> **Quiero:** cancelar mientras esté pendiente  
> **Para:** no recoger un pedido que ya no necesito  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `status === PENDING`, cuando confirmo en `ConfirmDialog`, entonces la orden pasa a CANCELLED.
> - [ ] **Escenario 2 (Error):** Dado `CONFIRMED` u otro estado, cuando intento cancelar, entonces 409 y copy "Ese cambio ya no es posible".
> - [ ] **Regla de Negocio:** Cancelación solo CLIENT dueño y solo PENDING.
>
> **QA:** TC-ORD-004, TC-ORD-005.
