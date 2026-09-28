> **Pantalla:** POS — panel ticket y cobro
> **Objetivo Principal:** Revisar líneas, elegir pago y cobrar
> **Contenedor:** Panel derecho de `WF-pos-mostrador.md`
>
> ```text
> +-----------------------------------------------------------------------+
> |  Ticket actual                                    [ Vaciar ticket ]   |
> +-----------------------------------------------------------------------+
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │ Mango · 2 kg                                    $90.00    [🗑] │ |
> |  │ Aguacate ⚡VR · 1 kg                            $65.00    [🗑] │ |
> |  │ Limón · 3 pz                                    $36.00    [🗑] │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> |  (vacío: "Agrega productos del catálogo" centrado slate-500)         |
> +-----------------------------------------------------------------------+
> |  Método de pago — PaymentMethodSelector                               |
> |  [ 💵 Efectivo ]  [ 💳 Tarjeta ]  [ ↔ Transferencia ]               |
> +-----------------------------------------------------------------------+
> |  Total                                              $191.00          |
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │                    Cobrar                                       │ |
> |  │              PRIMARY w-full py-4                               │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> +-----------------------------------------------------------------------+
> |  Toast éxito: "Venta registrada · Ticket #POS-0088"                   |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados del componente
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Empty** | Sin líneas; Cobrar disabled; mensaje centrado |
> | **Con ítems** | TicketLine list + total live |
> | **Sin pago** | Error inline bajo selector; Cobrar disabled |
> | **Cobrando** | Spinner en Cobrar |
> | **Success** | Limpia ticket; toast con receiptNumber |
> | **Error** | ErrorBanner; ticket preservado |
> | **Eliminar línea** | ConfirmDialog si ticket >3 ítems |
> | **Vaciar** | ConfirmDialog destructivo |
>
> #### Componentes Requeridos para Frontend:
> * **TicketLine:** nombre, qty×unidad, subtotal, QuickSaleBadge, delete.
> * **PaymentMethodSelector:** radio cards; required.
> * **CobrarCTA:** `POST /api/pos/sales`.
> * **ConfirmDialog:** vaciar / eliminar.
>
> #### Responsividad:
> * **Mobile:** Panel sticky bottom; Cobrar siempre visible.
> * **Desktop:** Columna derecha `bg-slate-100` full height.
>
> #### API esperada:
> * `POST /api/pos/sales` — ver UF-POS-01.
>
> #### Referencias:
> * Layout: `WF-pos-mostrador.md`
> * Tokens: `TicketLine`, `PaymentMethodSelector`, `ConfirmDialog`
