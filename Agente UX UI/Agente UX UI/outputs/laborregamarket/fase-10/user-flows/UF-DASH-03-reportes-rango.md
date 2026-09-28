> **Flujo:** Reportes por rango de fechas + venta por producto + imprimir
> **Historia de Usuario Asociada:** US-DASH-07, US-DASH-08, US-DASH-09
>
> **Punto de entrada:** `/proveedor/dashboard?view=reportes`. Switcher Resumen | Reportes F6 **sigue**. Vista Resumen F3 intacta. Grano día/mes/año + PDF F6 = baseline documental/API, **no visible** en chrome F10 (`D-F10-UX-1`).

> **Pasos del Usuario:**
> 1. `[Pestaña Reportes]` → Título «Reportes de ventas» + TZ `America/Monterrey`. Controles: `MonthShortcut` (`input type="month"`) + `DateRangeFields` (inicio y fin) + `ProductFilterChecklist` + **Imprimir** (Button Secondary ≥44px). **Sin** GrainSelector. **Sin** Descargar PDF en este paquete.
> 2. `[Atajo mes]` → Elegir MM/AAAA rellena `from` = día 1 y `to` = último día de ese mes (calendario Monterrey). Los pickers **siguen editables**.
> 3. `[Rango]` → Usuario puede acortar/alargar dentro del mes o cruzar… hasta tope **366 días** inclusive. `from` ≤ `to`. Ninguna fecha estrictamente futura vs hoy Monterrey.
> 4. `[Productos]` → Checkboxes de SKUs ofertados (globales activados + locales) + **Venta rápida**. **Ninguno marcado = todos** (omitir query `productIds`). Marcar uno o más recorta el corte (incluir sentinel `quickSale` si aplica).
> 5. `[GET]` → `GET /api/provider/reports?from&to` (`productIds` repetible si hay marcas). **Prohibido** enviar `grain`/`date` en el mismo request.
> 6. `[Tabla]` → Por producto: nombre, unidades, GMV, split Encargar vs POS. KPIs GMV / ticket / órdenes + split (recorte al predicado de ítems). Serie diaria opcional (ceros en días sin venta); no es el foco Must de la tabla.
> 7. `[Imprimir]` → `window.print`. Vista = la ya cargada. Ver `WF-proveedor-reportes-print-f10.md`.

**Condicionales:**
- **Empty corte:** → KPIs 0; copy **«Sin ventas en este corte»**; Imprimir **habilitado** (hoja con empty).
- **from > to:** → inline en inicio «La fecha de inicio no puede ser posterior a la de fin»; no GET.
- **>366 días:** → inline en fin «El rango no puede superar 366 días».
- **Fecha futura:** → inline «Elige un periodo que no sea futuro»; no GET.
- **400 mezcla grain/from:** no debe ocurrir si UI no pinta grano.
- **productIds ajeno / inexistente:** 403 ErrorBanner (no filtrar en silencio).
- **401:** redirect login con `view=reportes`.
- **403:** «Esta vista es solo para tu negocio».
- **Loading:** skeleton KPIs + tabla; pickers habilitados.
- **URL shareable Should:** `view=reportes&from&to` (+ productIds). Default al abrir: mes calendario en curso Monterrey.

**Reglas UI:**
- Look panel PROVIDER (`bg-white`, `KpiCard` F3). **Prohibido** `bg-slate-50` + `KpiCardAdmin` (analytics).
- Imprimir = documento Secondary; **no** primary de cobro.
- Checkboxes ≥44px; label visible. «Todos» es el estado vacío, no un checkbox extra Must.
- Wireframes: `WF-proveedor-reportes-rango.md`, `WF-proveedor-reportes-print-f10.md`. Docs F6 **no se editan**.

**API esperada:**
- `GET /api/provider/reports?from=YYYY-MM-DD&to=YYYY-MM-DD&productIds=` — `API-PROVIDER-REPORTS-02` modo F10.
- Print: cero endpoint — `API-DASH-NOTES-01`.
- PDF F6 `GET /api/provider/reports.pdf` **no** se reabre; PDF de este corte = Should fuera de paquete.

**Referencias:** `CO-F10-003`, D-F10-9, D-F10-UX-1, ADR-033, TZ America/Monterrey.
