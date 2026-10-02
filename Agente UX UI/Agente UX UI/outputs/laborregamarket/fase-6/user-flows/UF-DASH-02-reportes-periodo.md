> **Flujo:** Reportes de ventas por día, mes o año concreto (panel PROVIDER)
> **Historia de Usuario Asociada:** US-DASH-04, US-DASH-05, US-DASH-06
>
> **Punto de entrada:** Login PROVIDER → SubNavProveedor → `/proveedor/dashboard` (tab Dashboard activo). Vista por defecto = **Resumen** F3 (`UF-DASH-01`, hoy + 7d).
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor/dashboard]` → Switcher local **Resumen | Reportes** (`role="tablist"`). Resumen deja intacto el dashboard F3. No hay quinta pestaña en SubNav ni ruta `/proveedor/reportes`.
> 2. `[Tab Reportes]` → Hidrata `?view=reportes`. Toolbar: `GrainSelector` (Día | Mes | Año) + `ReportPeriodPicker` (fecha concreta, TZ America/Monterrey). Default: grano **día** + hoy Monterrey. Periodo en curso permitido; fechas estrictamente futuras **deshabilitadas**.
> 3. `[KPIs]` → GMV, ticket promedio, # órdenes (`status ≠ CANCELLED`) y split **Encargar** (`MARKETPLACE`) vs **Mostrador** (`POS`) del periodo. Reusa `KpiCard` + `OriginBadge` / split PROVIDER (no `KpiCardAdmin` ni slate de `/admin/analytics`).
> 4. `[Serie]` → **Mes:** barras por día. **Año:** barras por mes. **Día:** sin chart (serie horaria = Could, fuera). Tabla `sr-only` con los mismos buckets.
> 5. `[Top productos]` → Top 5 por ingreso del periodo, **incluye venta rápida** (`QuickSaleBadge` si `providerProductId === null`).
> 6. `[Acciones de documento]` → Botones secundarios **Imprimir** y **Descargar PDF** (≥44px), juntos a la derecha de la toolbar. No son CTA primary de cobro. Dashboard sigue informativo.
> 7. `[Imprimir]` → `window.print()`. `@media print` oculta Header + SubNav + switcher + toolbar de acciones; imprime encabezado (nombre de frutería, periodo, TZ, fecha de generación) + mismo set que pantalla. Ver `WF-proveedor-reportes-print.md`.
> 8. `[Descargar PDF]` → `GET /api/provider/reports.pdf?grain=&date=` (misma query que el JSON en pantalla). Descarga `reporte-{slug}-{grain}-{date}.pdf`. Empty del periodo = PDF válido, no 500.
>
> **Condicionales:**
> - **Loading JSON:** → Skeleton KPIs + chart + 5 filas. Switcher y pickers siguen operables; no splash.
> - **Empty periodo (`empty: true`):** → KPIs `0` / `—`; chart "Sin ventas en este periodo"; tabla "No hubo ventas en este periodo". Copy amigable — **no** empty POS de "No hay productos activos". Imprimir y PDF siguen habilitados.
> - **Error 500 / red:** → ErrorBanner + **Reintentar**. No fingir ceros de plataforma. No empty POS. Imprimir/PDF deshabilitados hasta que haya payload.
> - **400 (fecha futura o formato):** → Inline en el picker ("Elige un periodo que no sea futuro"); no se dispara el GET. Controles corrigen la fecha.
> - **401:** → Redirect login con `redirect=/proveedor/dashboard?view=reportes`.
> - **403 (CLIENT / ADMIN / otro rol):** → ErrorBanner "Esta vista es solo para tu negocio" + enlace al panel correspondiente. Un PROVIDER no ve otro negocio (ownership por sesión; no hay selector de frutería).
> - **PDF loading:** → Spinner en **Descargar PDF**; botón `aria-busy`; no abrir pestaña vacía.
> - **PDF 500:** → ErrorBanner "No pudimos generar el PDF. Intenta de nuevo."; no archivo a medias.
> - **Proveedor nuevo / cero historial:** → Mismo empty amigable; hint "Cuando registres ventas en POS o Encargar, aparecerán aquí".
>
> **Reglas UI:**
> - Un solo negocio: el del dueño logueado. Distinto de `/admin/analytics` (plataforma, F4).
> - Vista Resumen F3 **no se rediseña**. Query `view` ausente = Resumen.
> - URL hidrata `view`, `grain`, `date`; back/forward restaura el reporte.
> - Split Encargar vs POS: texto + icono (`OriginBadge` / barra); nunca solo color.
> - `KpiCard` sin delta "vs periodo anterior" (Should, no bloquea).
> - Wireframes: `WF-proveedor-reportes.md`, `WF-proveedor-reportes-print.md`. Base F3 (solo lectura): `../../fase-3/wireframes/WF-proveedor-dashboard.md`.
>
> **API esperada:**
> - `GET /api/provider/reports?grain=day|month|year&date=` — JSON KPIs, split, series, topProducts. `date`: `YYYY-MM-DD` | `YYYY-MM` | `YYYY`.
> - `GET /api/provider/reports.pdf?grain=&date=` — `application/pdf` attachment. Misma validación 400.
> - `GET /api/provider/dashboard` — **sin delta**; solo vista Resumen F3.
>
> **Referencias:** `UF-DASH-01` F3 (solo lectura), D-F6-3, D-F6-4, D-F6-5, D-F6-8, `CO-F6-001`.
