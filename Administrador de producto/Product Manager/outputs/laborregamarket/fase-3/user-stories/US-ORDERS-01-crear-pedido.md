# User Story — US-ORDERS-01

> **ID:** US-ORDERS-01  
> **Título:** Crear pedido pickup desde carrito  
>
> **Como:** CLIENT autenticado  
> **Quiero:** confirmar los productos de una sola frutería en `/carrito`  
> **Para:** recoger el pedido en el negocio sin pagar en línea  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que tengo ítems de una frutería y sesión CLIENT, cuando pulso Confirmar pedido, entonces `POST /api/orders` crea la orden en `PENDING`, recibo id/total y voy a `/cuenta` con toast de pedido enviado.
> - [ ] **Escenario 2 (Auth gate):** Dado que el carrito tiene ítems y no hay sesión, cuando abro `/carrito`, entonces veo CTA Iniciar sesión hacia `/login?redirect=/carrito` (o `next`) y los ítems persisten.
> - [ ] **Escenario 3 (Error):** Dado un error de red o producto no disponible, cuando confirmo, entonces veo ErrorBanner o warning por línea y no se pierde el carrito.
> - [ ] **Regla de Negocio:** Un carrito = una frutería. Header `Idempotency-Key`. Notas máx. 280. Sin `customItem` en marketplace. Contacto F2 permanece secundario (D-F3-7).
>
> **UX:** UF-ORDERS-01, WF-fruteria-encargar, WF-carrito. **QA:** TC-ORD-001, TC-ORD-006.
