> **Flujo:** Reportes generales pintan series, ranking de productos y mix de canal; N=1 redirige
> **Historia de Usuario Asociada:** US-DASH-14
>
> **Punto de entrada:** `/proveedor/reportes-generales` (solo N>1). Sin pantalla nueva para N=1.

> **Pasos del Usuario:**
> 1. `[N=1]` → 403 `GLOBAL_REPORTS_NOT_AVAILABLE` + `router.replace` a `/proveedor/dashboard?view=reportes` (**intacto**). No hay empty state nuevo de «contrata otra sucursal».
> 2. `[N>1 — carga 2xx]` → Siguen KPIs + tabla por sucursal + bloque inventario actual F13. **Nuevo:** (1) tendencia `series` con `UnifiedProviderChart`, (2) ranking `products`, (3) mix Encargar vs Mostrador `bySource`.
> 3. `[Filtro productos]` → `ProductFilterChecklist` F10 envía `productIds`; la vista recorta series/ranking/mix. Checkboxes ≥44px.
> 4. `[Cada gráfica]` → `role="img"` + `aria-label` + `<details>` con tabla. Print: anclas existentes o `#report-print-global`; look PROVIDER (no slate de admin analytics).
> 5. `[Condicional — 5xx]` → Error recuperable, **no** ceros inventados. `productIds` inválidos: 400 visible.
> 6. `[Rango vacío de ventas]` → Empty «Sin ventas en este corte» + ejes en cero o empty de gráfica, sin crash.

> **Reglas UI:**
> - 4 estados de la página (loading skeletons, empty corte, error, success con series).
> - No granularidad semanal, no comparativa periodo, no agrupación por sección, no margen.
> - Wireframe: `WF-DASH-14-series-generales.md`.

## Inputs Utilizados

- **US:** `US-DASH-14-reportes-generales-series.md`
- **UI hoy:** `GlobalReportsPageClient.tsx` (descarta series/products/bySource)
- **PRD:** D-F14-7, D-F14-14

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-DASH-14-reportes-generales-series.md`
- **Agente Downstream:** Frontend Developer
