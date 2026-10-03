> **Flujo:** Dashboard ventas — métricas proveedor
> **Historia de Usuario Asociada:** US-DASH-01, US-DASH-02, US-DASH-03
>
> **Punto de entrada:** Login PROVIDER → SubNavProveedor → `/proveedor/dashboard`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor/dashboard]` → Grid 4× `KpiCard`: Ventas hoy (MXN), Ticket promedio, Órdenes activas, Ventas ayer (comparativa).
> 2. `[Sección chart]` → `BarChartIlustrativo` ventas últimos 7 días; hover/tap barra muestra tooltip día + monto.
> 3. `[Sección tabla]` → Top 5 productos **venta rápida** por unidades vendidas período 7d; columnas: producto, unidades, ingreso.
> 4. `[Sin datos]` → KPIs en `0` o `—`; chart empty state; tabla mensaje "Sin ventas rápidas registradas".
>
> **Condicionales:**
> - **Loading:** → Skeleton 4 KPIs + chart block + 5 filas tabla.
> - **Error red:** → ErrorBanner + Reintentar; KPIs en error state.
> - **Proveedor nuevo:** → Empty amigable "Cuando registres ventas en POS o recibas pedidos, verás tus métricas aquí".
> - **Solo venta online (sin VR):** → Tabla top VR vacía con copy explicativo.
>
> **Reglas UI:**
> - Dashboard informativo; sin CTA dominante de acción (CO-005 cumple jerarquía: ningún botón primary competidor).
> - `KpiCard` delta (↑↓) siempre con texto ("+12% vs ayer"), no solo color verde/rojo.
> - `BarChartIlustrativo` incluye tabla `sr-only` para lectores de pantalla.
> - SubNavProveedor; tab Dashboard activo.
> - Wireframe: `WF-proveedor-dashboard.md`.
>
> **API esperada:**
> - `GET /api/provider/analytics/sales?period=7d` → `{ kpis: { today, yesterday, avgTicket, activeOrders }, daily: [{ date, total }], topQuickSale: [{ productId, name, units, revenue }] }`
