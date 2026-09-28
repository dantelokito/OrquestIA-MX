> **Flujo:** Órdenes activas — fulfillment proveedor
> **Historia de Usuario Asociada:** US-OPS-01, US-OPS-02, US-OPS-03
>
> **Punto de entrada:** Login PROVIDER → SubNavProveedor → `/proveedor/ordenes`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor/ordenes]` → Tab **Activas** por defecto; lista `OrderCard` ordenada por fecha desc.
> 2. `[OrderCard]` → Muestra `#orden`, `OrderStatusBadge`, `OriginBadge` (ONLINE/POS), cliente, ítems resumidos, total.
> 3. `[Orden PENDING]` → CTA **Confirmar** → `PATCH status: CONFIRMED` → badge actualiza + toast.
> 4. `[Orden CONFIRMED]` → CTA **Marcar listo para recoger** → `PATCH status: IN_TRANSIT` → badge muestra copy **"Listo para recoger"** (no "En tránsito").
> 5. `[Orden IN_TRANSIT]` → CTA **Marcar entregado** → `PATCH status: COMPLETED` → mueve a tab Historial.
> 6. `[Tab Historial]` → Órdenes COMPLETED y CANCELLED últimos 30 días; solo lectura.
>
> **Condicionales:**
> - **Loading:** → Skeleton 4× OrderCard.
> - **Activas vacías:** → EmptyState "No hay órdenes activas" + hint "Los pedidos en línea y POS aparecerán aquí".
> - **Historial vacío:** → "Sin historial reciente".
> - **Error transición inválida:** → Toast error + card sin cambio (ej. saltar PENDING→COMPLETED).
> - **Error red:** → ErrorBanner + Reintentar en lista.
> - **Orden POS origin:** → `OriginBadge` "Mostrador"; mismas transiciones excepto cancel CLIENT.
> - **Refresh:** → Polling 30s o manual pull-to-refresh móvil (Should).
>
> **Reglas UI:**
> - `OrderStatusBadge` siempre texto + icono; `IN_TRANSIT` label fijo: **Listo para recoger**.
> - `OriginBadge` distingue ONLINE vs POS; nunca solo color.
> - Una acción primaria por card según estado; sin menú overflow en MVP.
> - Tabs: Activas | Historial; contador badge en Activas si >0.
> - Wireframe: `WF-proveedor-ordenes.md`.
>
> **API esperada:**
> - `GET /api/orders?status=active` — PENDING, CONFIRMED, IN_TRANSIT del proveedor
> - `GET /api/orders?status=history` — COMPLETED, CANCELLED (30d)
> - `PATCH /api/orders/[id]/status` — body: `{ status }`; validar máquina estados servidor
