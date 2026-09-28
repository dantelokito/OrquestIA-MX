> **Flujo:** Checkout con entrega a domicilio (Should)
> **Historia de Usuario Asociada:** US-ORDERS-05
>
> **Punto de entrada:** `/carrito` autenticado, **después** de tener GEO (favorita o pin) y proveedor con `offersDelivery=true`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /carrito]` → `FulfillmentToggle`: **Recoger en tienda** (default, F3) | **A domicilio**.
> 2. `[A domicilio]` → Selector de dirección favorita (`FavoriteAddressSelect`). ETA incluye traslado (UF-NOTIFY-01).
> 3. `[Confirmar]` → `POST /api/orders` con `fulfillmentType=DELIVERY` + snapshot `deliveryAddressId`. Estado inicial **PENDING** (misma máquina F3).
> 4. `[Ops proveedor]` → En `IN_TRANSIT` el badge dice **"En camino"** (no "Listo para recoger"). CTA equivalente: **Marcar en camino** → **Marcar entregado**.
>
> **Condicionales:**
> - **`offersDelivery=false`:** → Solo pickup; el toggle no se muestra (F3 intacto).
> - **Sin direcciones favoritas:** → Hint + CTA "Guardar una dirección en Explorar" → `/explorar`; Confirmar A domicilio `disabled`.
> - **Invitado:** → Auth gate F3 primero; delivery se elige después.
> - **Error validación dirección:** → Inline bajo el selector.
> - **Pickup elegido:** → Copy y máquina F3 sin cambios (`IN_TRANSIT` = "Listo para recoger").
>
> **Reglas UI:**
> - CTA dominante sigue **Confirmar pedido**.
> - No mapa de tracking, no flota, no asignación de repartidor.
> - `OrderStatusBadge` variante por `fulfillmentType` (tokens §6c).
> - Wireframes: `WF-carrito-eta.md`, `WF-cuenta-pedidos-f4.md`. Base: `UF-ORDERS-01-checkout.md`.
>
> **API esperada:**
> - `POST /api/orders` — body F3 + `{ fulfillmentType: "PICKUP"|"DELIVERY", deliveryAddressId? }`
> - `GET /api/users/me/addresses`
> - `PATCH /api/orders/[id]/status` — misma máquina; copy UI depende de `fulfillmentType`
>
> **Prioridad:** Should — implementar tras F4-A GEO.
