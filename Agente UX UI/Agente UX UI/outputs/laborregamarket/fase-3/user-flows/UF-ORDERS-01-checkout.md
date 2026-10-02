> **Flujo:** Checkout — carrito y confirmación de pedido
> **Historia de Usuario Asociada:** US-ORDERS-01, US-ORDERS-02, US-ORDERS-03, US-ORDERS-04
>
> **Punto de entrada:** `/fruteria/[id]` → QuantityStepper en producto → "Encargar" → `/carrito`; o icono carrito en header CLIENT
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /fruteria/[id]]` → Usuario ajusta cantidad con `QuantityStepper` en fila de producto y pulsa **Encargar** (CTA dominante). Ítem se agrega al carrito de esa frutería (sesión o localStorage pre-auth).
> 2. `[Navegación]` → Usuario abre `/carrito` vía badge header o CTA "Ver carrito" post-encargo.
> 3. `[Pantalla: /carrito — sin sesión]` → Auth gate: mensaje "Inicia sesión para confirmar tu pedido" + CTA **Iniciar sesión** → `/login?redirect=/carrito`. Ítems persisten.
> 4. `[Pantalla: /carrito — autenticado]` → Lista `TicketLine` con stepper por ítem, subtotal, notas opcionales, resumen frutería.
> 5. `[CTA Confirmar pedido]` → `POST /api/orders` → orden creada estado **PENDING** → redirect `/cuenta#pedidos` con toast "Pedido enviado".
> 6. `[Pantalla: /cuenta#pedidos]` → Usuario ve `OrderCard` con `OrderStatusBadge` Pendiente. Puede cancelar si sigue PENDING.
>
> **Condicionales:**
> - **Loading carrito:** → Skeleton 3× TicketLine + resumen.
> - **Carrito vacío:** → EmptyState "Tu carrito está vacío" + CTA "Explorar fruterías" → `/explorar`.
> - **Producto ya no disponible:** → Línea con warning inline + opción eliminar; bloquea Confirmar hasta resolver.
> - **Error red al confirmar:** → ErrorBanner + Reintentar; carrito intacto.
> - **Auth cancel:** → Vuelve de login sin sesión → auth gate sigue visible; ítems no se pierden.
> - **Cancelar pedido (cuenta):** → Solo si `status === PENDING` → `ConfirmDialog` → `DELETE /api/orders/[id]` → badge Cancelado.
> - **Contacto F2 (D-F3-7):** → Llamar/WhatsApp en detalle frutería permanecen secundarios; no compiten con Encargar.
>
> **Reglas UI:**
> - CTA dominante detalle: **Encargar**; contacto secundario (Llamar outline, WhatsApp ghost).
> - CTA dominante carrito: **Confirmar pedido**; "Seguir comprando" secondary → `/fruteria/[id]`.
> - Un carrito = una frutería (CO-001); mezclar proveedores → mensaje y CTA limpiar.
> - Precios MXN `$XX.XX`; unidad visible en cada línea.
> - Wireframes: `WF-fruteria-encargar.md`, `WF-carrito.md`, `WF-cuenta-pedidos.md`.
> - Tokens: `QuantityStepper`, `TicketLine`, `OrderStatusBadge`, `ConfirmDialog`.
>
> **API esperada:**
> - `POST /api/orders` — body: `{ providerId, items: [{ productId, quantity, unit }], notes? }` → `{ id, status: "PENDING", total }`
> - `GET /api/orders` — lista CLIENT (mis pedidos) con paginación
> - `DELETE /api/orders/[id]` — cancelar; solo PENDING; rol CLIENT dueño
> - `GET /api/providers/[id]` — validar disponibilidad ítems en carrito
