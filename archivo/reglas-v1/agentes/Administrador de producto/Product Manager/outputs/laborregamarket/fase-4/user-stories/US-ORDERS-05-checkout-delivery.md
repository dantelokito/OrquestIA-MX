# User Story — US-ORDERS-05 (Should)

> **ID:** US-ORDERS-05  
> **Título:** Checkout con entrega a domicilio  
>
> **Como:** CLIENT  
> **Quiero:** elegir entrega a domicilio en vez de recoger en tienda, usando una dirección guardada  
> **Para:** recibir mi pedido sin ir a la frutería, cuando el proveedor lo ofrezca  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un proveedor con `offersDelivery=true` y una dirección favorita del cliente, cuando confirmo el pedido eligiendo "A domicilio", entonces `Order.fulfillmentType=DELIVERY` con `deliveryAddressId` (snapshot de la dirección) y se muestra el ETA de US-NOTIFY-09.
> - [ ] **Escenario 2 (Proveedor sin delivery):** Dado un proveedor con `offersDelivery=false`, cuando reviso las opciones de entrega, entonces solo veo pickup (comportamiento actual de F3, sin cambios).
> - [ ] **Escenario 3 (Estados)):** Dado un pedido `DELIVERY`, cuando el proveedor lo marca como en camino, entonces el copy es "En camino" (a diferencia de pickup, que sigue diciendo "Listo para recoger" en `IN_TRANSIT`).
> - [ ] **Regla de Negocio:** Depende de tener dirección guardada (US-GEO-03) y del flag de oferta del proveedor. No incluye ruteo, tracking en vivo ni asignación de repartidor (fuera de alcance F4).
>
> **UX:** Pendiente diseño (`UF-ORDERS-02`). **QA:** pendiente matriz (incluir matriz pickup vs delivery, TC-FULFILLMENT).
