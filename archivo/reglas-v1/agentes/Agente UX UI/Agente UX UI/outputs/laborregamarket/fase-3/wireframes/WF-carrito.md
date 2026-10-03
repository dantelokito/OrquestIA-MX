> **Pantalla:** Carrito (`/carrito`)
> **Objetivo Principal:** Revisar ítems y confirmar pedido (auth gate si sin sesión)
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header CLIENT]                              [🛒 3]                   |
> +-----------------------------------------------------------------------+
> |  Tu pedido                                                            |
> |  Frutas El Paraíso · Centro, Monterrey                                |
> +-----------------------------------------------------------------------+
> |  [AUTH GATE — si !session]                                            |
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │  Inicia sesión para confirmar tu pedido                         │ |
> |  │  [ Iniciar sesión ]  ← PRIMARY                                    │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> +-----------------------------------------------------------------------+
> |  Ítems                                                                |
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │ Mango                                    [ − ] 2 kg [ + ]  $90 │ |
> |  │ Aguacate                                 [ − ] 1 kg [ + ]  $65 │ |
> |  │ Limón                                    [ − ] 3 pz [ + ]  $21 │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> |  Notas para la frutería (opcional)                                    |
> |  [________________________________________________]                   |
> +-----------------------------------------------------------------------+
> |  Resumen                                                              |
> |  Subtotal                                              $176.00       |
> |  Recoger en tienda · Pago al recoger (MVP)                           |
> +-----------------------------------------------------------------------+
> | [MOBILE STICKY]                                                       |
> |  [ Confirmar pedido ]  PRIMARY w-full                                   |
> |  [ Seguir comprando ]  link → /fruteria/[id]                          |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton 3× líneas + resumen |
> | **Empty** | EmptyState "Tu carrito está vacío" + CTA `/explorar` |
> | **Auth gate** | Banner login; ítems visibles read-only; Confirmar oculto |
> | **Autenticado** | Stepper editable + Confirmar habilitado |
> | **Confirmando** | Spinner en Confirmar; disabled resto |
> | **Success** | Redirect `/cuenta#pedidos` + toast |
> | **Ítem no disponible** | Warning inline en línea; Confirmar disabled |
> | **Error red** | ErrorBanner + Reintentar |
>
> #### Componentes Requeridos para Frontend:
> * **TicketLine:** nombre, stepper, subtotal, eliminar.
> * **AuthGateBanner:** foco inicial; link `/login?redirect=/carrito`.
> * **OrderSummary:** subtotal, notas textarea.
> * **ConfirmarCTA:** primary sticky; `POST /api/orders`.
>
> #### Responsividad:
> * **Mobile:** Lista full-width; sticky Confirmar + Seguir comprando.
> * **Desktop:** `max-w-2xl` centrado; resumen lateral opcional.
>
> #### API esperada:
> * `POST /api/orders` — UF-ORDERS-01.
> * `GET /api/providers/[id]` — validar stock al cargar.
>
> #### Referencias:
> * Flujo: `../user-flows/UF-ORDERS-01-checkout.md`
> * Tokens: `TicketLine`, `QuantityStepper` en `../../comun/design-tokens.md`
