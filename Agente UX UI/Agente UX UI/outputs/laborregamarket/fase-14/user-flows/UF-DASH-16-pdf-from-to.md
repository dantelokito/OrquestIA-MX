> **Flujo:** Descargar PDF del mismo corte from/to visible en Reportes de sucursal
> **Historia de Usuario Asociada:** US-DASH-16
>
> **Punto de entrada:** `/proveedor/dashboard?view=reportes` pestaña **Ventas**. `DocumentActions`: Imprimir (secondary) + **Descargar PDF** (secondary). CTA de pantalla sigue siendo consultar/rango, no el PDF.

> **Pasos del Usuario:**
> 1. `[Visibilidad]` → `showPdf={true}` en Reportes de **sucursal** (pestaña Ventas). Deja de estar oculto. Pestaña Inventario F13 **sigue** sin PDF (`showPdf={false}`): el Must es el corte de ventas.
> 2. `[Descargar]` → GET PDF con los mismos `from`, `to` y `productIds` visibles. El archivo cubre ese rango, no un grano mensual.
> 3. `[Sin grain]` → `GrainSelector` **no** vuelve. Query `grain` no se reintroduce en la UI.
> 4. `[Print HTML]` → Imprimir F10 intacto.
> 5. `[Condicional — from > to, >366 días, 401/403]` → Error visible; no se descarga un blob vacío como éxito. 5xx pdfkit: «No pudimos generar el PDF» + Reintentar.
> 6. `[N=1]` → Usa este PDF de sucursal, **no** un PDF global (no existe Must global).

> **Reglas UI:**
> - Botones `min-h-11`; móvil `w-full` apilados como hoy `DocumentActions`.
> - Loading: `aria-busy` «Descargando…» en el botón PDF.
> - Wireframe: `WF-DASH-16-pdf.md`.

## Inputs Utilizados

- **US:** `US-DASH-16-pdf-reporte-from-to.md`
- **UI hoy:** `ReportsView` pasa `showPdf={false}`; endpoint solo `grain`
- **PRD:** D-F14-9

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-DASH-16-pdf-from-to.md`
- **Agente Downstream:** Frontend Developer (tras contrato PDF from/to)
