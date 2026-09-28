> **Pantalla:** Proveedor órdenes (`/proveedor/ordenes`)
> **Objetivo Principal:** Gestionar fulfillment de pedidos online y POS
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header PROVIDER]                                                       |
> | [ Catálogo | POS | Órdenes | Dashboard ]  ← Órdenes activo            |
> +-----------------------------------------------------------------------+
> |  Órdenes                                                              |
> |  [ Activas (3) ]  [ Historial ]     ← tabs                            |
> +-----------------------------------------------------------------------+
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │ #1042  [🕐 Pendiente]  [🛍 Pedido en línea]                      │ |
> |  │ María G. · Mango 2kg, Aguacate 1kg +1 más                       │ |
> |  │ Total $176.00 · hace 15 min                                       │ |
> |  │ [ Confirmar pedido ]  PRIMARY                                     │ |
> |  ├─────────────────────────────────────────────────────────────────┤ |
> |  │ #1040  [✓ Confirmado]  [🛍 Pedido en línea]                      │ |
> |  │ Juan P. · Limón 3pz                                               │ |
> |  │ [ Marcar listo para recoger ]  PRIMARY                            │ |
> |  ├─────────────────────────────────────────────────────────────────┤ |
> |  │ #1039  [📦 Listo para recoger]  [🏪 Mostrador]                    │ |
> |  │ Cliente mostrador · Venta POS                                     │ |
> |  │ [ Marcar entregado ]  PRIMARY                                     │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton 4× OrderCard |
> | **Activas empty** | EmptyState "No hay órdenes activas" |
> | **Historial empty** | "Sin historial reciente" |
> | **Success** | Cards con acción según estado |
> | **Transition** | Badge cross-fade; toast confirmación |
> | **Error** | ErrorBanner + Reintentar |
>
> #### Máquina de estados (acciones UI)
>
> | Estado actual | CTA | Nuevo estado |
> |---------------|-----|--------------|
> | PENDING | Confirmar pedido | CONFIRMED |
> | CONFIRMED | Marcar listo para recoger | IN_TRANSIT |
> | IN_TRANSIT | Marcar entregado | COMPLETED |
> | COMPLETED | — (Historial) | — |
> | CANCELLED | — (Historial) | — |
>
> **Copy IN_TRANSIT:** siempre **"Listo para recoger"** en badge (CO-004).
>
> #### Componentes Requeridos para Frontend:
> * **OrderCard**, **OrderStatusBadge**, **OriginBadge**.
> * **OrderTabs:** Activas con contador; Historial.
> * **StatusActionButton:** contextual por estado.
>
> #### Responsividad:
> * **Mobile / Desktop:** Cards stack; acciones full-width móvil.
>
> #### API esperada:
> * `GET /api/orders?status=active|history`
> * `PATCH /api/orders/[id]/status`
>
> #### Referencias:
> * Flujo: `../user-flows/UF-OPS-01-ordenes-activas.md`
> * Tokens: `OrderStatusBadge`, `OriginBadge`
