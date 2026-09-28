> **Flujo:** Módulo nuevo Reportes generales (consolidado de todas las sucursales)
> **Historia de Usuario Asociada:** US-DASH-11
>
> **Punto de entrada:** SubNav ítem **Reportes generales** → `/proveedor/reportes-generales`. Visible **solo si N>1**. No es tab de `/proveedor/dashboard?view=reportes`.

> **Pasos del Usuario:**
> 1. `[Panel PROVIDER N>1]` → SubNav muestra cinco destinos: Catálogo, POS, Órdenes, Dashboard (F10), **Reportes generales**. **QG BUG-017:** el 5º tab usa el **mismo N rehidratado** que el switcher. Tras login El Paraíso debe existir **sin** F5. N=1 (Campo Verde) no lo muestra.
> 2. `[Abrir módulo]` → Título H1 «Reportes generales». Subtítulo «Todas tus fruterías · TZ America/Monterrey». Controles F10 reutilizados: `MonthShortcut` + `DateRangeFields` (tope 366 días, `from` ≤ `to`, no futuro). **Sin** checklist de productos Must en esta vista (el corte es de sucursales, no SKU).
> 3. `[Success]` → KPIs globales (GMV, órdenes, ticket medio) **sumando** todas las sucursales del user. Tabla desglose: una fila por `Provider` (nombre, GMV, órdenes, ticket). Total en pie.
> 4. `[Should Imprimir]` → Button Secondary «Imprimir» si hay capacidad FE; no bloquea DoD. CSS print sin chrome app. Sin CSV/CFDI/email.
> 5. `[Campo Verde N=1]` → El ítem **no existe** en SubNav. Dashboard sigue con Resumen | Reportes F10. Deep-link a `/proveedor/reportes-generales` → redirect a `/proveedor/dashboard?view=reportes` + toast informativo (no pantalla vacía que «parezca» el módulo).

**Condicionales:**
- **Empty:** rango válido sin ventas → KPIs 0; copy «Sin ventas consolidadas en este corte»; tabla con filas de sucursal en 0.
- **Loading:** skeleton 3 KPIs + 2–N filas; filtros habilitados.
- **Error 403 (N=1 o no dueño):** no pintar módulo; Banner «Esta vista no está disponible para una sola frutería».
- **401:** redirect login.
- **500 / red:** ErrorBanner + CTA «Reintentar» (primario de esta pantalla).
- **from > to / >366 / futuro:** mismos inline que F10; no fetch.

**Reglas UI:**
- Look panel PROVIDER (`surface-primary`, `KpiCard` F3). **Prohibido** look slate de `/admin/analytics` / `KpiCardAdmin`.
- CTA dominante de la pantalla = **Consultar** / aplicar rango (o el fetch automático al cambiar fechas válidas). Imprimir = secondary.
- No mezclar datos de sucursal activa: este módulo ignora el switcher para el **cálculo** (siempre todas). El switcher sigue visible (N>1) porque el chrome es global; un hint aclara «Esta vista no cambia al rotar sucursal».
- Reportes F10 por sucursal **siguen** en Dashboard para N=1 y N>1.

**API esperada:** contrato nuevo consolidado (Arquitecto). 403 si N=1. No reutilizar a ciegas `GET /api/provider/reports`.

**Wireframes:** `WF-DASH-11-reportes-globales.md`.

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/prd.md`
- **US:** `US-DASH-11`
- **Baseline F10 (solo lectura):** `fase-10/user-flows/UF-DASH-03-reportes-rango.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-flows/UF-DASH-11-reportes-globales.md`
- **Agente Downstream:** Frontend Developer
