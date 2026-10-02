> **Pantalla:** POS — grid catálogo y venta rápida
> **Objetivo Principal:** Seleccionar productos; venta rápida en un tap
> **Contenedor:** Panel izquierdo de `WF-pos-mostrador.md`
>
> ```text
> +-----------------------------------------------------------------------+
> |  Buscar producto…  [________________________]  (opcional Should)      |
> +-----------------------------------------------------------------------+
> |  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  |
> |  │  [thumb]    │  │  [thumb]    │  │  [thumb]    │  │  [thumb]    │  |
> |  │  Mango      │  │  Aguacate   │  │  Limón      │  │  Jícama     │  |
> |  │  $45 / kg   │  │  $65 / kg   │  │  $12 / pz   │  │  $25 / pz   │  |
> |  │             │  │ ⚡ Venta    │  │             │  │ ⚡ Venta    │  |
> |  │             │  │   rápida    │  │             │  │   rápida    │  |
> |  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  |
> |  grid-cols-2 sm:3 xl:4 · min-h 120px · tap 44px+                      |
> +-----------------------------------------------------------------------+
> |  Clic producto normal → abre WF-pos-cantidad-unidad                     |
> |  Clic producto ⚡ VR → +1 unidad default al ticket inmediato          |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados del componente
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Default** | Grid con precio y unidad default |
> | **Quick sale** | `QuickSaleBadge` icono Zap + texto |
> | **Hover/focus** | `ring-2 ring-[var(--brand)]`; shadow-md |
> | **Added feedback** | Flash borde verde 200ms en celda |
> | **Inactive** | `opacity-40 pointer-events-none` (no en catálogo POS) |
>
> #### Componentes Requeridos para Frontend:
> * **ProductGridCell:** thumb, nombre, precio, badge VR opcional.
> * **QuickSaleBadge:** nunca solo color naranja.
> * **onQuickAdd:** 1 tap → ticket sin modal.
> * **onNormalAdd:** abre sheet/modal cantidad-unidad.
>
> #### Responsividad:
> * **Mobile:** 2 cols; celdas altas para touch.
> * **Desktop:** 3–4 cols según ancho catálogo.
>
> #### API esperada:
> * Producto incluye `isQuickSale: boolean`, `defaultUnit`, `price`.
>
> #### Referencias:
> * Layout: `WF-pos-mostrador.md`
> * Cantidad: `WF-pos-cantidad-unidad.md`
> * Tokens: `QuickSaleBadge`
