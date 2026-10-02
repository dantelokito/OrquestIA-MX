# User Story — US-ORDERS-02

> **ID:** US-ORDERS-02  
> **Título:** Historial de pedidos en cuenta  
>
> **Como:** CLIENT  
> **Quiero:** ver mis pedidos en `/cuenta`  
> **Para:** saber estado y recoger  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que tengo pedidos, cuando abro `/cuenta`, entonces `GET /api/orders` lista mis órdenes con `OrderStatusBadge` (texto + icono).
> - [ ] **Escenario 2 (Vacío):** Dado que no tengo pedidos, entonces empty "Todavía no tienes pedidos".
> - [ ] **Regla de Negocio:** Solo el dueño CLIENT ve sus órdenes. `IN_TRANSIT` se muestra como "Listo para recoger".
>
> **UX:** WF-cuenta-pedidos. **QA:** TC-ORD-003, TC-ORD-012.
