# User Story — US-DASH-15

> **ID:** US-DASH-15  
> **Título:** Ventas: gráfica unificada (tendencia, mix canal, top) sobre series existentes  
>
> **Como:** PROVIDER en `/proveedor/dashboard` (sucursal activa)  
> **Quiero:** una gráfica reutilizable que muestre tendencia, mix Encargar/Mostrador y top productos con los datos que **ya** llegan  
> **Para:** no mantener dos SVG duplicados y ver el mix de canal que hoy solo vive en KPIs  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `GET /api/provider/dashboard` y/o `GET /api/provider/reports?from&to` con `series` / `series7d`, `kpis.bySource` y `products`/`topProducts`, cuando abro Ventas (Resumen y/o Reportes), entonces veo **tendencia** (GMV por día/bucket), **mix de canal** (marketplace vs POS) y **top productos** (ingreso y cantidad). `BarChartIlustrativo` y `ReportBarChart` se reemplazan por **un** componente parametrizable. Arquitecto elige SVG unificado **o** librería; PM **no** fija paquete npm. Cada gráfica tiene `<details>` con tabla (`role="img"` + `aria-label`) y **no** rompe `@media print` (`#report-print-f10` / inventario F13).
> - [ ] **Escenario 2 (Validación/Error):** Dado rango sin ventas, cuando cargo Reportes, entonces la gráfica muestra empty (ceros o empty state), no un crash por `max=0`. Fallo API: Error recuperable. CLIENT → 403. Sucursal B no ve series de A. Si Arch elige librería y el bundle falla al cargar, el `<details>` sigue siendo la tabla de respaldo (degradación visible, no página en blanco).
> - [ ] **Regla de Negocio:** D-F14-7, D-F14-8. Must = tendencia + mix canal + top sobre **series existentes**. Comparativa GMV por sucursal = **Should** (D-F14-20). **No** semanal, **no** periodo anterior, **no** agrupación por sección, **no** margen. Envelope ADR-003. IDOR F11.

>
> **UX:** tres bloques en Ventas; 4 estados; print usable. **Arquitecto:** decisión SVG vs librería en ADR; restricciones a11y/print no negociables. **QA:** print; empty; no-regresión KPIs F10.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §4.2–4.3, D-20
- **US previa:** `US-DASH-07`…`09`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-DASH-15-ventas-grafica-unificada.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
