> **Pantalla:** Proveedor dashboard — Reportes rango-primero (`/proveedor/dashboard?view=reportes`)
> **Objetivo Principal:** Cortar ventas por fechas reales y por producto, e imprimir esa vista
> **Base:** Switcher y Resumen F3/F6 intactos. Chrome de grano F6 **no se pinta** (`D-F10-UX-1`). Docs [`../../fase-6/wireframes/WF-proveedor-reportes.md`](../../fase-6/wireframes/WF-proveedor-reportes.md) **solo lectura**. Distinto de [`../../fase-4/wireframes/WF-admin-analytics.md`](../../fase-4/wireframes/WF-admin-analytics.md).

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]                                                     |
| [ Catálogo | POS | Órdenes | Dashboard ]  ← Dashboard activo          |
+-----------------------------------------------------------------------+
|  [ Resumen ]  [ Reportes ]     ← DashboardViewSwitcher                |
+-----------------------------------------------------------------------+
|  Reportes de ventas                          TZ America/Monterrey     |
|                                                                       |
|  Mes  [ 2026-08 ▾ ]     Inicio [ 2026-08-01 ]  Fin [ 2026-08-31 ]     |
|  MonthShortcut          DateRangeFields                               |
|                                              [ Imprimir ]  ← secondary|
|                                                                       |
|  Productos del corte (ninguno marcado = todos)                        |
|  [ ] Mango   [ ] Chile del rancho   [ ] Jitomate   [ ] Venta rápida   |
+-----------------------------------------------------------------------+
|  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  |
|  │ GMV          │ │ Ticket prom. │ │ Órdenes      │ │ Encargar|POS │  |
|  │ $12,500.50   │ │ $260.43      │ │ 48           │ │ 30 / 18      │  |
|  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  |
|  KpiCard PROVIDER (no KpiCardAdmin). OriginBadge + montos             |
+-----------------------------------------------------------------------+
|  Venta por producto                                                   |
|  ┌────────────────┬──────────┬────────────┬─────────────┬───────────┐ |
|  │ Producto       │ Unidades │ GMV        │ Encargar    │ POS       │ |
|  ├────────────────┼──────────┼────────────┼─────────────┼───────────┤ |
|  │ Mango          │ 12.000   │ $540.00    │ $300 / 8    │ $240 / 4  │ |
|  │ Venta rápida ⚡ │ 2.000    │ $20.00     │ —           │ $20 / 2   │ |
|  └────────────────┴──────────┴────────────┴─────────────┴───────────┘ |
+-----------------------------------------------------------------------+
```

**No mostrar:** GrainSelector (Día | Mes | Año), ReportPeriodPicker F6, botón **Descargar PDF**.

Atajo mes: al cambiar MM/AAAA, set `from` = día 1, `to` = último día (TZ Monterrey). Usuario puede editar las dates después.

### Mobile (`<= 640px`)

```text
+-----------------------------------------------------------------------+
| SubNav scroll · [ Resumen | Reportes ] w-full                         |
| MonthShortcut w-full min-h-11                                         |
| Inicio w-full · Fin w-full                                            |
| Checklist scroll-y max-h-40; cada fila ≥44px                          |
| [ Imprimir ] w-full min-h-11                                          |
| KPIs 1 col                                                            |
| Tabla → cards apiladas (nombre, unidades, GMV, split)                 |
+-----------------------------------------------------------------------+
```

### Vista Resumen

Sin delta: KPIs hoy+7d F3. No MonthShortcut ni Imprimir en Resumen.

#### URL / sync

| Param | UI |
|-------|-----|
| `view` | `resumen` (default) \| `reportes` |
| `from` | `YYYY-MM-DD` |
| `to` | `YYYY-MM-DD` |
| `productIds` | repetible; omitir si ninguno marcado |

Default al abrir Reportes: mes en curso Monterrey. **Nunca** `grain`/`date` en este modo.

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton 4 KPIs + 6 filas. Controles habilitados |
| **Success** | Datos del rango + predicado productos |
| **Empty corte** | KPIs `0`; «Sin ventas en este corte»; Imprimir **habilitado** |
| **from > to** | Inline inicio: «La fecha de inicio no puede ser posterior a la de fin»; no GET |
| **>366 días** | Inline fin: «El rango no puede superar 366 días» |
| **Futuro** | «Elige un periodo que no sea futuro» |
| **Error 500 / red** | ErrorBanner + Reintentar; Imprimir disabled |
| **401** | Redirect login con `view=reportes` |
| **403** | «Esta vista es solo para tu negocio» |
| **403 productIds** | ErrorBanner; no lista vacía silenciosa |

#### Componentes requeridos para Frontend

- **DashboardViewSwitcher** F6 (conservado).
- **MonthShortcut:** `input type="month"`; `max` = mes actual Monterrey.
- **DateRangeFields:** dos `input type="date"`; labels Inicio / Fin; `max` = hoy Monterrey.
- **ProductFilterChecklist:** checkboxes; vacío = todos; incluir `quickSale`.
- **DocumentActions F10:** solo **Imprimir** (Secondary).
- **KpiCard** F3 + split OriginBadge.
- **ProductSalesTable:** todas las filas `products[]` (no top 5).

#### Accesibilidad

- Labels visibles + `htmlFor`. Imprimir ≥44px.
- Checklist `fieldset`/`legend` «Productos del corte».
- Tabla: encabezados; móvil cards con dt/dd o headings.
- Look: `bg-white`; prohibido slate analytics.

#### API esperada

- `GET /api/provider/reports?from&to&productIds` — `API-PROVIDER-REPORTS-02` modo F10.
- Mes-atajo = **solo Frontend** (no param `month`).

#### Fuera de alcance

PDF corte F10, CSV, email, CFDI, multi-mes, ADMIN viendo otro DASH, reescribir `fase-6/`.

#### Referencias

- `UF-DASH-03-reportes-rango.md`, `WF-proveedor-reportes-print-f10.md`
- `CO-F10-003`, ADR-033
