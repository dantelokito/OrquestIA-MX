> **Flujo:** Dashboard de analítica de plataforma (ADMIN)
> **Historia de Usuario Asociada:** US-ADMIN-01
>
> **Punto de entrada:** Login ADMIN → `/admin` → tab **Analítica** o ruta `/admin/analytics`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /admin/analytics]` → Título "Analítica de plataforma" (no "Resumen de ventas"). Periodo: **Hoy | 7 días | 30 días**.
> 2. `[KpiCardAdmin]` → GMV (excluye `CANCELLED`), # órdenes, # proveedores activos, tasa de cancelación.
> 3. `[Split origen]` → Barras o stacked: **Marketplace** vs **POS** en el periodo.
> 4. `[Tabla opcional]` → Top fruterías por GMV (máx. 5) — informativo, no CTA.
>
> **Condicionales:**
> - **Sin órdenes en el periodo:** → EmptyState "No hay actividad en este periodo" + hint cambiar rango. **No** mostrar $0 / 0 órdenes como KPIs reales.
> - **Loading:** → Skeleton 4 KPIs + bloque split + tabla.
> - **Error red:** → ErrorBanner + Reintentar.
> - **Periodo vacío parcial:** → KPIs con valor 0 solo si hay dataset pero GMV=0 por cancelaciones; copy aclara "Sin GMV (órdenes canceladas excluidas)".
>
> **Reglas UI:**
> - Diferenciar visualmente del dashboard F3 proveedor: superficie `slate-50`, título "plataforma", sin SubNavProveedor, sin `BarChartIlustrativo` de 7d de un solo negocio.
> - `KpiCardAdmin` usa borde `slate-200` y label uppercase small; no reutilizar copy "Ventas hoy / vs Ayer".
> - Sin CTA dominante (pantalla informativa); periodo es el control principal.
> - Nunca color-only en split MARKETPLACE vs POS: leyenda con texto + icono (`ShoppingBag` / `Store`).
> - Wireframe: `WF-admin-analytics.md`. Distinto de `WF-proveedor-dashboard.md` (F3).
>
> **API esperada:**
> - `GET /api/admin/analytics?period=today|7d|30d` — `{ gmv, orderCount, activeProviders, cancelRate, split: { marketplace, pos } }`
>
> **Nota de ID:** Archivo en `fase-4/`; F1 usa `UF-ADMIN-01-operacion.md` para curación. No confundir.
