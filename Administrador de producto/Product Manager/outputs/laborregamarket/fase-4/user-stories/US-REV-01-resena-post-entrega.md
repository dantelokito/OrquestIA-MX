# User Story — US-REV-01

> **ID:** US-REV-01  
> **Título:** Cliente deja reseña tras pedido entregado  
>
> **Como:** CLIENT  
> **Quiero:** calificar (1–5) y comentar un pedido en estado `DELIVERED`  
> **Para:** compartir mi experiencia con la frutería  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un pedido propio en `DELIVERED` sin reseña previa, cuando califico y comento, entonces se crea un `Review` ligado a `orderId` (único) y aparece en `/fruteria/[id]`.
> - [ ] **Escenario 2 (Bloqueo duplicado):** Dado un pedido que ya tiene reseña, cuando intento reseñar de nuevo, entonces el sistema rechaza y muestra la reseña existente editable (Should) o solo lectura (Must).
> - [ ] **Escenario 3 (Estado inválido):** Dado un pedido en `PENDING`/`CONFIRMED`/`IN_TRANSIT`/`CANCELLED`, cuando intento reseñar, entonces la opción no está disponible.
> - [ ] **Regla de Negocio:** Una reseña por pedido entregado. Ventas POS (walk-in sin `clientId`) no generan opción de reseña.
>
> **UX:** Pendiente diseño (`UF-REV-01`). **QA:** pendiente matriz.
