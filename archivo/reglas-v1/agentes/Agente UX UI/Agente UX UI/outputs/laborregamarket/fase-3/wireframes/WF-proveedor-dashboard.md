> **Pantalla:** Proveedor dashboard (`/proveedor/dashboard`)
> **Objetivo Principal:** Visualizar KPIs de ventas y top productos venta rápida
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header PROVIDER]                                                       |
> | [ Catálogo | POS | Órdenes | Dashboard ]  ← Dashboard activo          |
> +-----------------------------------------------------------------------+
> |  Resumen de ventas — últimos 7 días                                   |
> +-----------------------------------------------------------------------+
> |  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  |
> |  │ Ventas hoy   │ │ Ticket prom. │ │ Órdenes      │ │ vs Ayer      │  |
> |  │ $2,450       │ │ $127         │ │ activas: 3   │ │ +12% ↑       │  |
> |  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  |
> |  KpiCard grid: 1 col móvil · 2 col tablet · 4 col desktop             |
> +-----------------------------------------------------------------------+
> |  Ventas por día                                                       |
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │     ██                                                            │ |
> |  │   ████ ██                                                         │ |
> |  │ ██████ ██ ████                                                    │ |
> |  │ Lu  Ma  Mi  Ju  Vi  Sa  Do    BarChartIlustrativo                 │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> |  (tabla sr-only con mismos datos para a11y)                           |
> +-----------------------------------------------------------------------+
> |  Top 5 — Venta rápida (7 días)                                        |
> |  ┌────────────────┬──────────┬────────────┐                           |
> |  │ Producto       │ Unidades │ Ingreso    │                           |
> |  ├────────────────┼──────────┼────────────┤                           |
> |  │ Aguacate ⚡    │ 48       │ $3,120     │                           |
> |  │ Jícama ⚡      │ 35       │ $875       │                           |
> |  │ ...            │          │            │                           |
> |  └────────────────┴──────────┴────────────┘                           |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton KPIs + chart + 5 filas |
> | **Success** | Datos poblados |
> | **Empty período** | KPIs en 0; chart "Sin ventas"; tabla vacía |
> | **Error** | ErrorBanner + Reintentar |
> | **Proveedor nuevo** | Empty amigable con hint POS/órdenes |
>
> #### Componentes Requeridos para Frontend:
> * **KpiCard:** label, valor, delta con texto (no solo color).
> * **BarChartIlustrativo:** 7 barras; tooltip; `role="img"` + sr-only table.
> * **TopQuickSaleTable:** 5 filas max; QuickSaleBadge en nombre.
>
> #### Responsividad:
> * **Mobile:** KPIs 1 col; chart scroll-x si necesario; tabla stack cards.
> * **Desktop:** Grid 4 KPIs; chart + tabla lado a lado opcional `lg:grid-cols-2`.
>
> #### API esperada:
> * `GET /api/provider/analytics/sales?period=7d`
>
> #### Referencias:
> * Flujo: `../user-flows/UF-DASH-01-ventas.md`
> * Tokens: `KpiCard`, `BarChartIlustrativo`, `QuickSaleBadge`
