> **Flujo:** Ventas con gráfica unificada: tendencia, mix de canal y top productos
> **Historia de Usuario Asociada:** US-DASH-15
>
> **Punto de entrada:** `/proveedor/dashboard` vistas Resumen y Reportes (sucursal activa).

> **Pasos del Usuario:**
> 1. `[Un componente]` → `BarChartIlustrativo` y `ReportBarChart` se reemplazan por `UnifiedProviderChart` (SVG unificado o librería: **Arch decide**). Misma piel PROVIDER.
> 2. `[Tres bloques Must]` → Tendencia GMV por día/bucket; mix Encargar vs Mostrador (`bySource`); top productos (ingreso y cantidad). Comparativa por sucursal = Should, **no** se pinta en F14.
> 3. `[a11y / print]` → Cada gráfica: `role="img"`, `aria-label`, `<details>` tabla. CSS `#report-print-f10` e inventario F13 **no se rompen**.
> 4. `[Empty]` → Rango sin ventas: empty state o barras en cero; no crash por `max=0`.
> 5. `[Fallo librería]` → Si Arch elige paquete y el chunk falla, `<details>` sigue visible (degradación, no página en blanco).
> 6. `[IDOR]` → Sucursal B no ve series de A.

> **Reglas UI:**
> - 4 estados en Resumen y en Reportes (ventas).
> - No semanal, no periodo anterior, no sección, no margen.
> - Wireframe: `WF-DASH-15-ventas-graficas.md`.

## Inputs Utilizados

- **US:** `US-DASH-15-ventas-grafica-unificada.md`
- **PRD:** D-F14-7, D-F14-8, D-F14-20

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-DASH-15-ventas-grafica-unificada.md`
- **Agente Downstream:** Frontend Developer (tras ADR SVG vs librería)
