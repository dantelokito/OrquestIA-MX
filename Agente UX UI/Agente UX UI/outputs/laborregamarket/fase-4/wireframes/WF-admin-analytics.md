> **Pantalla:** Analítica de plataforma (`/admin/analytics`)
> **Objetivo Principal:** Ver salud del marketplace (GMV, órdenes, proveedores, split), no de un solo negocio
> **Contraste F3:** Distinto de [`../../fase-3/wireframes/WF-proveedor-dashboard.md`](../../fase-3/wireframes/WF-proveedor-dashboard.md)

```text
+-----------------------------------------------------------------------+
| [Header autenticado ADMIN]                                            |
+-----------------------------------------------------------------------+
|  Panel de administración                                              |
|  [ Catálogos ] [ Proveedores ] [ Bitácora ] [ Analítica ] ← activo    |
+-----------------------------------------------------------------------+
|  Analítica de plataforma                    [ Hoy | 7 días | 30 días ]|
|  bg-slate-50  ·  no SubNavProveedor  ·  no "vs Ayer"                  |
+-----------------------------------------------------------------------+
|  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  |
|  │ GMV          │ │ Órdenes      │ │ Proveedores  │ │ Cancelación  │  |
|  │ $128,400     │ │ 342          │ │ activos 18   │ │ 4.2%         │  |
|  │ (sin cancel.)│ │              │ │              │ │              │  |
|  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  |
|  KpiCardAdmin: label uppercase, borde slate, valor H3                 |
+-----------------------------------------------------------------------+
|  Origen de órdenes                                                    |
|  ┌─────────────────────────────────────────────────────────────────┐ |
|  │  🛍 Marketplace  62%   ████████████░░░░  $79,600                │ |
|  │  🏪 POS          38%   ███████░░░░░░░░░  $48,800                │ |
|  │  Leyenda texto + icono (nunca solo color)                         │ |
|  └─────────────────────────────────────────────────────────────────┘ |
+-----------------------------------------------------------------------+
|  Top 5 fruterías por GMV (periodo)                                    |
|  Negocio              │ Órdenes │ GMV                                 |
|  Frutas El Paraíso    │ 40      │ $12,100                             |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton 4 KPIs + barras + 5 filas |
| **Empty periodo** | EmptyState "No hay actividad en este periodo" + "Prueba otro rango". **No** KPIs en $0 fingiendo dato |
| **Success** | KPIs + split + tabla |
| **Error red** | ErrorBanner + Reintentar; tabs admin siguen navegables |

#### Componentes Requeridos para Frontend:
* **AdminTabs:** 4º tab Analítica; `aria-current="page"`.
* **PeriodToggle:** Hoy / 7d / 30d; `aria-pressed`.
* **KpiCardAdmin:** distinto de `KpiCard` proveedor (sin delta vs ayer).
* **OriginSplitBar:** Marketplace vs POS + tabla sr-only.
* **TopProvidersTable:** 5 filas max.

#### Responsividad:
* **Mobile:** Periodo scroll chips; KPIs 1 col; split stack.
* **Tablet:** KPIs 2×2.
* **Desktop:** KPIs 4 col; contenido `max-w-6xl`.

#### Accesibilidad:
* Chart/split: tabla `sr-only` equivalente.
* Contraste labels slate-700 sobre slate-50 ≥ 4.5:1.

#### API esperada:
* `GET /api/admin/analytics?period=today|7d|30d`

#### Referencias:
* Flujo: `../user-flows/UF-ADMIN-01-analytics.md`
* Admin F1: `../../fase-1/wireframes/WF-admin-panel.md`
