> **Flujo:** Tiempo estimado visible en checkout, detalle de pedido y notificaciones
> **Historia de Usuario Asociada:** US-NOTIFY-09
>
> **Punto de entrada:** `/carrito` (checkout autenticado); también `/cuenta` detalle de pedido y contenido de email/WhatsApp
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /carrito]` → Bajo el resumen aparece `EtaChip`: **"Listo aprox. en ~X min"** (`preparationTimeMinutes` + traslado estimado por distancia).
> 2. `[Pickup sin ubicación del cliente]` → Solo preparación: **"Tiempo de preparación: ~Y min"** (sin componente de traslado).
> 3. `[Pedido confirmado]` → Mismo copy en OrderCard / detalle y en el cuerpo de email/WhatsApp (contenido; no se diseña plantilla HTML).
> 4. `[Delivery Should]` → X incluye traslado a la dirección elegida (UF-ORDERS-02).
>
> **Condicionales:**
> - **Proveedor sin `preparationTimeMinutes`:** → Ocultar chip o mostrar "El tiempo lo confirma la frutería" (`text-secondary`); no inventar minutos.
> - **Loading ETA:** → Skeleton línea en resumen (no bloquear Confirmar).
> - **Error cálculo:** → Hint "No pudimos estimar el tiempo"; checkout sigue disponible.
> - **Estimación, no SLA:** → Microcopy bajo el chip: "Es una estimación, no una hora exacta".
>
> **Reglas UI:**
> - Copy canónico éxito: **Listo aprox. en ~X min**.
> - Copy pickup sin distancia: **Tiempo de preparación: ~Y min**.
> - Un solo `EtaChip` por superficie; no competir con CTA **Confirmar pedido**.
> - Email/WA: mismo string; UX no entrega mockup de plantilla.
> - Wireframes: `WF-carrito-eta.md`, `WF-cuenta-pedidos-f4.md`.
>
> **API esperada:**
> - `GET /api/orders/eta?providerId=&lat=&lng=&fulfillmentType=` — `{ minutes, breakdown: { prep, travel } }` (contrato Arquitecto)
> - Campo `preparationTimeMinutes` en `GET /api/providers/[id]`
>
> **Nota:** US-NOTIFY-06/07/08 (Redis, rate limit, WhatsApp API) no tienen UI propia.
