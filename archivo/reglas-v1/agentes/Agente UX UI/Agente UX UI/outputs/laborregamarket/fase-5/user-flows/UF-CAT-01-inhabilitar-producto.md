> **Flujo:** Inhabilitar producto en todos los canales (no es stock)
> **Historia de Usuario Asociada:** US-CAT-01
>
> **Punto de entrada:** Login PROVIDER → `/proveedor` (tabla catálogo F1)
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor]` → Tabla de productos globales con precio editable y toggle **Activo / Inactivo** por fila (endurece el toggle F1; no es "agotado" ni inventario).
> 2. `[Inhabilitar]` → Usuario apaga el toggle de un `ProviderProduct` activo → PATCH disponibilidad. Feedback ✓ 2s en la fila.
> 3. `[Efecto en canales]` → El producto **desaparece** de:
>    - `/explorar` (si se listaba por producto)
>    - `/fruteria/[id]` (no hay fila ni Encargar para ese ítem)
>    - Carrito CLIENT (línea **retirada** + toast)
>    - Catálogo POS (`/proveedor/pos`)
> 4. `[Reactivar]` → Usuario vuelve a encender el toggle → el producto reaparece en detalle, explorar (si aplica), carrito elegible y POS, con el precio vigente.
>
> **Condicionales:**
> - **Carrito con línea ya agregada:** → Al revalidar (abrir `/carrito`, cambiar cantidad, o antes de confirmar): se **retira la línea** + toast `"{nombre} ya no está disponible"` (`role="status"`). No se deja una fila "muerta" en el ticket.
> - **Confirmar pedido / cobrar POS con `productId` inactivo:** → API rechaza (envelope ADR-003); **no** se crea la orden ni la venta. UI: ErrorBanner / inline "Ese producto ya no está a la venta" + Reintentar / quitar ítem.
> - **POS catálogo vacío** (todos inactivos o ninguno activo): → EmptyState **"No hay productos activos"** + CTA **Ir a Catálogo** → `/proveedor`. Distinto del empty del ticket ("Agrega productos del catálogo").
> - **Dashboard top productos:** → Un inhabilitado no entra en top de catálogo vigente; ventas históricas ya cobradas no se reescriben.
> - **Loading fila:** → Toggle/input disabled + spinner en la fila.
> - **Error PATCH:** → Inline rojo en fila + Reintentar.
> - **Producto global ADMIN:** → No se borra; solo se oculta la oferta del proveedor.
>
> **Reglas UI:**
> - Copy del toggle: **Activo** / **Inactivo**. Helper bajo la columna: "Inactivo: no aparece en explorar, pedidos ni POS. No es stock."
> - Prohibido: "Agotado", "Sin inventario", badges de stock.
> - Un CTA dominante por pantalla: en panel, guardar/toggle por fila; en POS, **Cobrar** sigue dominante (empty catálogo usa secondary "Ir a Catálogo").
> - Checkout pickup F3 y POS cobro F3 se conservan; solo se endurece el filtro de `productId` activo.
> - Wireframe: `WF-catalogo-canales.md`. Base: `../../fase-1/wireframes/WF-proveedor-panel.md`, `../../fase-3/wireframes/WF-pos-mostrador.md`.
>
> **API esperada:**
> - `PATCH /api/provider/products/[id]` — `{ isActive }` (o flag F1 equivalente). Contratos: Arquitecto API-PROVIDER-PRODUCTS-01 (delta).
> - Lecturas públicas/detalle/POS omiten inactivos.
> - `POST /api/orders` y `POST /api/pos/sales` rechazan `productId` inactivo.
>
> **Referencias:** `UF-PROVIDER-02-catalogo.md` (F2), D-F5-5.
