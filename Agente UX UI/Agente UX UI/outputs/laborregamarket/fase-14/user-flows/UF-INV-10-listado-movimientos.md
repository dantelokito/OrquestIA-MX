> **Flujo:** Listar entradas, mermas y ajustes de la sucursal activa (sin ventas POS)
> **Historia de Usuario Asociada:** US-INV-10
>
> **Punto de entrada:** `/proveedor/inventario?tab=movimientos`. Sub-pestañas: **Existencias** | **Movimientos**.

> **Pasos del Usuario:**
> 1. `[SubNav interno]` → `InventorySubTabs` bajo el H1. Existencias = listado F12. Movimientos = este flujo. Query `tab=movimientos` para deep-link.
> 2. `[Copy honesto]` → «Solo ves entradas, mermas y ajustes que registraste en esta frutería. Las ventas del POS y los pedidos Encargar **no** aparecen aquí.»
> 3. `[Tabla]` → Fecha, SKU, tipo (`ENTRADA` | `MERMA` | `AJUSTE`) con texto+badge (nunca color-only), cantidad/delta firmado, motivo (si merma), nota, saldo resultante si el modelo lo trae.
> 4. `[Filtros]` → Chips tipo (Todos / Entrada / Merma / Ajuste) + `DateRangeFields` `from`/`to` (reuso F10). Default: sucursal activa, página 1.
> 5. `[Empty]` → «Aún no hay movimientos de entrada, merma o ajuste». CTA secundario «Ir a Existencias».
> 6. `[Condicional — from > to]` → 400 visible en filtros. Fallo API: Error + Reintentar; **no** tabla inventada. N sucursales: no se mezclan filas (F11).
> 7. `[Paginación]` → Visible (mismo patrón admin/reportes: page/limit). No volcar 366 días en un HTML.

> **Reglas UI:**
> - 4 estados de la sub-pestaña Movimientos.
> - No copiar «kardex de ventas». No exigir fila de descarte `US-INV-07`.
> - Reportes Inventario F13 (`US-DASH-12`) **siguen** aparte.
> - Wireframe: `WF-INV-10-movimientos.md`.

## Inputs Utilizados

- **US:** `US-INV-10-listado-movimientos.md`
- **US:** `US-DASH-12` (intacto)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-INV-10-listado-movimientos.md`
- **Agente Downstream:** Frontend Developer (tras contrato Arch de listado)
