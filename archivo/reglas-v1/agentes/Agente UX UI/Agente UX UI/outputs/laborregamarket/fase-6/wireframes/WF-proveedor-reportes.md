> **Pantalla:** Proveedor dashboard — vista Reportes (`/proveedor/dashboard?view=reportes`)
> **Objetivo Principal:** Ver ventas de un día, mes o año concreto e imprimir / descargar el mismo resumen
> **Base:** Extiende F3 [`../../fase-3/wireframes/WF-proveedor-dashboard.md`](../../fase-3/wireframes/WF-proveedor-dashboard.md) (solo lectura). Distinto de [`../../fase-4/wireframes/WF-admin-analytics.md`](../../fase-4/wireframes/WF-admin-analytics.md).

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]                                                       |
| [ Catálogo | POS | Órdenes | Dashboard ]  ← Dashboard activo          |
+-----------------------------------------------------------------------+
|  [ Resumen ]  [ Reportes ]     ← DashboardViewSwitcher (tabs locales) |
+-----------------------------------------------------------------------+
|  Reportes de ventas                          TZ America/Monterrey     |
|  [ Día | Mes | Año ]  [  agosto 2026 ▾ ]     [ Imprimir ] [ PDF ]     |
|   GrainSelector        ReportPeriodPicker      DocumentActions        |
+-----------------------------------------------------------------------+
|  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  |
|  │ GMV          │ │ Ticket prom. │ │ Órdenes      │ │ Encargar|POS │  |
|  │ $12,500.50   │ │ $260.43      │ │ 48           │ │ 30 / 18      │  |
|  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  |
|  KpiCard (PROVIDER, no KpiCardAdmin). Split: OriginBadge + montos     |
+-----------------------------------------------------------------------+
|  Ventas por día (agosto 2026)   ← oculta si grain=day                 |
|  ┌─────────────────────────────────────────────────────────────────┐ |
|  │     ██  ██                                                      │ |
|  │   ████  ██ ████                                                 │ |
|  │ 01  02  03  …  31     BarChartIlustrativo                       │ |
|  └─────────────────────────────────────────────────────────────────┘ |
|  (tabla sr-only con mismos buckets)                                   |
+-----------------------------------------------------------------------+
|  Top productos del periodo (incl. venta rápida)                       |
|  ┌────────────────┬──────────┬────────────┐                           |
|  │ Producto       │ Cantidad │ Ingreso    │                           |
|  ├────────────────┼──────────┼────────────┤                           |
|  │ Aguacate       │ 48.000   │ $3,120.00  │                           |
|  │ Venta rápida ⚡ │ 2.000    │ $20.00     │                           |
|  └────────────────┴──────────┴────────────┘                           |
+-----------------------------------------------------------------------+
```

### Vista Resumen (default, `?view=` ausente o `resumen`)

Sin delta de layout F3: KPIs hoy + 7d, chart 7 días, top venta rápida. El switcher es el único control nuevo encima. No mostrar GrainSelector ni Imprimir/PDF en Resumen.

### Mobile (`<= 640px`)

```text
+-----------------------------------------------------------------------+
| SubNav scroll · Dashboard activo                                      |
| [ Resumen ] [ Reportes ]     tabs w-full iguales                      |
| GrainSelector w-full (3 segmentos ≥44px)                              |
| ReportPeriodPicker w-full                                             |
| [ Imprimir ] [ Descargar PDF ]  stack; cada uno w-full min-h-11       |
| KPIs 1 col                                                            |
| Chart scroll-x si mes/año                                             |
| Top productos: cards apiladas (nombre, cantidad, ingreso)             |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton 4 KPIs + chart + 5 filas. Pickers y switcher habilitados |
| **Success** | Datos del `grain`+`date` seleccionados |
| **Empty periodo** | KPIs `0` / `—`; "Sin ventas en este periodo"; Imprimir y PDF **habilitados** |
| **Error 500 / red** | ErrorBanner + Reintentar. **No** "No hay productos activos". Acciones documento disabled |
| **400 fecha futura** | Picker: "Elige un periodo que no sea futuro"; no GET |
| **401** | Redirect `/login?redirect=/proveedor/dashboard?view=reportes` |
| **403** | ErrorBanner "Esta vista es solo para tu negocio" |
| **PDF loading** | Spinner en Descargar PDF; `aria-busy="true"` |
| **PDF error** | ErrorBanner; no archivo corrupto |
| **grain=day** | Ocultar chart; KPIs + split + top productos bastan |

#### URL / sync

| Param | UI |
|-------|-----|
| `view` | `resumen` (default) \| `reportes` |
| `grain` | `day` \| `month` \| `year` (solo vista reportes) |
| `date` | `YYYY-MM-DD` \| `YYYY-MM` \| `YYYY` según grano |

Hidratar desde URL. Back/forward restaura grano y fecha. Periodo en curso (parcial) permitido.

#### Componentes Requeridos para Frontend:
* **DashboardViewSwitcher:** tabs locales Resumen | Reportes; `role="tablist"`; activo `aria-selected`; underline `--brand` como SubNav. No es item de SubNavProveedor.
* **GrainSelector:** segmented Día | Mes | Año; `aria-pressed`; min-h 44px; al cambiar grano, adaptar el picker y resetear `date` al periodo en curso equivalente (hoy / mes actual / año actual).
* **ReportPeriodPicker:** `type="date"` (día), `type="month"` (mes), `<select>` o spinbutton de año (año). `max` = hoy Monterrey. Label visible + `htmlFor`.
* **DocumentActions:** Button Secondary **Imprimir** (`Printer`) y **Descargar PDF** (`Download`); min-h 44px; `gap-2`. Nunca Button Primary.
* **KpiCard:** reuso F3 (no `KpiCardAdmin`). Labels: GMV, Ticket promedio, Órdenes, Encargar / Mostrador.
* **ReportOriginSplit:** GMV + count Encargar vs POS; icono + texto; tabla `sr-only`.
* **BarChartIlustrativo:** buckets API `series`; empty copy distinto de POS.
* **ReportTopTable:** 5 filas; `QuickSaleBadge` si venta rápida; omitir inactivos (ya filtrados en API).

#### Responsividad:
* **Mobile:** 1 col; acciones documento full-width; chart scroll-x.
* **Desktop:** toolbar en una fila (grano + fecha a la izquierda, acciones a la derecha); 4 KPIs; chart + tabla `lg:grid-cols-1` (stack, no copiar dashboard admin 2-col slate).

#### Accesibilidad:
* Un CTA visualmente dominante **no aplica** (pantalla informativa; acciones de documento son secondary).
* Contraste body ≥ 4.5:1; labels de picker no `slate-400`.
* Chart: `role="img"` + tabla `sr-only`.
* Focus visible en tabs, segmentos, date, botones.
* `prefers-reduced-motion`: chart instantáneo (token F3).

#### API esperada:
* `GET /api/provider/reports?grain=&date=`
* `GET /api/provider/reports.pdf?grain=&date=`
* Resumen: `GET /api/provider/dashboard` (F3, sin cambio)

#### Referencias:
* Flujo: `../user-flows/UF-DASH-02-reportes-periodo.md`
* Print: `WF-proveedor-reportes-print.md`
* Tokens: `DashboardViewSwitcher`, `GrainSelector`, `ReportPeriodPicker`, `DocumentActions`, `ReportPrint`
* F3 (solo lectura): `../../fase-3/user-flows/UF-DASH-01-ventas.md`
