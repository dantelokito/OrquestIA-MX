# User Story — US-NOTIFY-09 (Should)

> **ID:** US-NOTIFY-09  
> **Título:** Tiempo estimado de entrega visible en checkout y notificaciones  
>
> **Como:** CLIENT  
> **Quiero:** ver cuánto tardará aproximadamente mi pedido  
> **Para:** decidir si pido ahora o más tarde  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un proveedor con `preparationTimeMinutes` configurado y una dirección/ubicación del cliente, cuando llego al checkout, entonces veo "Listo aprox. en ~X min" (`preparationTimeMinutes` + tiempo de traslado estimado por distancia).
> - [ ] **Escenario 2 (Sin distancia)):** Dado que no hay ubicación del cliente (pickup sin dirección), cuando veo el ETA, entonces se muestra solo `preparationTimeMinutes` sin componente de traslado, con copy claro ("tiempo de preparación").
> - [ ] **Escenario 3 (En notificaciones):** Dado que el pedido se confirma, cuando se envía el email/WhatsApp, entonces incluye el mismo ETA mostrado en checkout.
> - [ ] **Regla de Negocio:** El cálculo de traslado usa una fórmula simple por distancia (no Distance Matrix API en este alcance — eso es Could); es una estimación, no una promesa contractual.
>
> **UX:** Pendiente diseño (`UF-NOTIFY-01`). **QA:** pendiente matriz.
