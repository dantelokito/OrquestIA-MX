> **Flujo:** POS mostrador — venta rápida en punto de venta
> **Historia de Usuario Asociada:** US-POS-01, US-POS-02, US-POS-03, US-POS-04
>
> **Punto de entrada:** Login PROVIDER → SubNavProveedor → `/proveedor/pos`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor/pos]` → Split view: catálogo izquierda (grid productos activos), ticket derecha (vacío inicial).
> 2. `[Clic producto catálogo]` → Si producto venta rápida (`QuickSaleBadge`): agrega 1 unidad default al ticket. Si no: abre panel cantidad/unidad.
> 3. `[Panel cantidad/unidad]` → Usuario elige cantidad vía `QuantityStepper` o `QuantityInput` + `NumericKeypad`; selecciona unidad en `UnitSelector` → "Agregar al ticket".
> 4. `[Ticket]` → `TicketLine` por ítem con subtotal; total actualizado en tiempo real; puede eliminar línea (ConfirmDialog si >3 ítems).
> 5. `[PaymentMethodSelector]` → Selecciona Efectivo | Tarjeta | Transferencia (requerido).
> 6. `[CTA Cobrar]` → `POST /api/pos/sales` → éxito: ticket limpio + toast "Venta registrada" + opción nueva venta.
>
> **Condicionales:**
> - **Loading catálogo:** → Skeleton grid 8 celdas.
> - **Sin productos activos:** → EmptyState en catálogo + link "Ir a catálogo" → `/proveedor`.
> - **Ticket vacío:** → Mensaje centrado; Cobrar `disabled`.
> - **Cobrar sin método pago:** → Inline error bajo selector; foco en PaymentMethodSelector.
> - **Error red cobro:** → ErrorBanner; ticket preservado.
> - **Vaciar ticket:** → ConfirmDialog "¿Vaciar ticket?" → limpia líneas.
> - **Móvil:** → Stack catálogo arriba, ticket sticky abajo con total + Cobrar.
>
> **Reglas UI:**
> - CTA dominante: **Cobrar** (primary full-width en panel ticket).
> - `QuickSaleBadge` siempre icono + texto "Venta rápida" (nunca solo color).
> - Keypad numérico: botones min 48px; ideal para tablet en mostrador.
> - SubNavProveedor visible; tab POS activo.
> - Wireframes: `WF-pos-mostrador.md`, `WF-pos-venta-rapida.md`, `WF-pos-cantidad-unidad.md`, `WF-pos-ticket.md`.
>
> **API esperada:**
> - `GET /api/provider/products?active=true` — catálogo POS (mismo proveedor sesión)
> - `POST /api/pos/sales` — body: `{ items: [{ productId, quantity, unit, unitPrice }], paymentMethod, total }` → `{ saleId, receiptNumber }`
