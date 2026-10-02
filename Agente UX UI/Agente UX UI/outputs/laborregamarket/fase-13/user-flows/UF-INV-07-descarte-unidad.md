> **Flujo:** Cambio de unidad/factor descarta inventario o bloquea si Encargar activo
> **Historia de Usuario Asociada:** US-INV-07
>
> **Punto de entrada:** Drawer catálogo (`UF-CAT-18`) o ficha inventario F12 (`InventorySkuSheet`). Mismo modal.

> **Pasos del Usuario:**
> 1. `[Detectar delta]` → Usuario cambia unidad de venta (LOCAL: maestro local; GLOBAL: unidad de oferta) o factor caja y pulsa Guardar.
> 2. `[Condicional Encargar activo]` → ¿Hay encargos no DELIVERED/CANCELLED de ese SKU?
>    - **Sí:** **no** se muta. Error accionable (no genérico): «Completa o cancela los encargos de este producto antes de cambiar la unidad o el factor.» CTA: ir a Órdenes (secondary) + Cerrar. **Ocultar no usa este error.**
>    - **No:** seguir.
> 3. `[Condicional on-hand ≠ 0]` → Modal alerta (no toast). Texto: el inventario actual se descarta; afecta POS, Encargar e inventario; conviene dar de alta un producto nuevo si cambió el formato de venta. CTA dominante **Descartar inventario y guardar**; **Cancelar** secondary (sin mutación).
> 4. `[Éxito descarte]` → Unidad/factor nuevos; `onHand = 0`. **No** fila de entrada en reportes. POS sigue cobrando (blando).
> 5. `[on-hand 0 sin Encargar]` → Guardar **sin** alerta de descarte (no-op inventario).
>
> **Reglas UI:** Un CTA dominante de confirmación vs cancelar. Wireframe: `WF-INV-07-modal-descarte.md`.

## Inputs Utilizados

- **US:** `US-INV-07`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-INV-07-descarte-unidad.md`
