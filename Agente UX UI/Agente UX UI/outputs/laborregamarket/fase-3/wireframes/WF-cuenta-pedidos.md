> **Pantalla:** Cuenta cliente — sección pedidos (`/cuenta#pedidos`)
> **Objetivo Principal:** Ver historial de pedidos y cancelar si PENDING
> **Base:** Extiende [`../../fase-1/wireframes/WF-cuenta-cliente.md`](../../fase-1/wireframes/WF-cuenta-cliente.md)
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header CLIENT]                                                       |
> +-----------------------------------------------------------------------+
> |  Mi cuenta                                                            |
> +-----------------------------------------------------------------------+
> |  Perfil                                                               |
> |  Nombre [________]  Email [________]  Tel [________]                  |
> |  [ Guardar cambios ]                                                  |
> +-----------------------------------------------------------------------+
> |  Mis pedidos                                                          |
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │ #1042  [🕐 Pendiente]  [🛍 Pedido en línea]                     │ |
> |  │ Frutas El Paraíso · 3 ítems · $176.00 · hace 2 h                │ |
> |  │ [ Cancelar pedido ]  ← destructive outline, solo PENDING        │ |
> |  ├─────────────────────────────────────────────────────────────────┤ |
> |  │ #1038  [📦 Listo para recoger]  [🛍 Pedido en línea]            │ |
> |  │ Frutas El Paraíso · 2 ítems · $98.00 · ayer                      │ |
> |  │ (sin acciones — esperar en tienda)                               │ |
> |  ├─────────────────────────────────────────────────────────────────┤ |
> |  │ #1030  [✓ Entregado]  [🏪 Mostrador]                            │ |
> |  │ Frutas El Paraíso · 1 ítem · $45.00 · 12 ago                    │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> |  [ Ver más ] paginación si >10                                        |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading pedidos** | Skeleton 3× OrderCard |
> | **Empty pedidos** | "Aún no tienes pedidos" + CTA explorar |
> | **Success** | OrderCard list con badges texto+icono |
> | **Cancel confirm** | ConfirmDialog → DELETE → badge Cancelado |
> | **Error red** | ErrorBanner en sección pedidos |
>
> #### Componentes Requeridos para Frontend:
> * **OrderCard:** resumen + `OrderStatusBadge` + `OriginBadge`.
> * **CancelOrderButton:** solo `PENDING`; abre `ConfirmDialog`.
> * **Perfil section:** sin cambios F1/F2.
>
> #### Responsividad:
> * **Mobile / Desktop:** Stack vertical; cards full-width.
>
> #### API esperada:
> * `GET /api/orders` — pedidos CLIENT paginados.
> * `DELETE /api/orders/[id]` — cancel PENDING.
>
> #### Referencias:
> * Base: `../../fase-1/wireframes/WF-cuenta-cliente.md`
> * Flujo: `../user-flows/UF-ORDERS-01-checkout.md`
