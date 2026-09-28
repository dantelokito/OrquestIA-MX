> **Flujo:** Editar visible en GLOBAL y LOCAL; unidad/factor de oferta; alta LOCAL completa
> **Historia de Usuario Asociada:** US-CAT-18
>
> **Punto de entrada:** `/proveedor` catálogo. CTA pantalla: **Agregar producto** (alta LOCAL). Por fila: **Editar**.

> **Pasos del Usuario:**
> 1. `[Fila GLOBAL o LOCAL]` → **Editar** siempre visible (regresión prohibida: no ocultar Editar en GLOBAL).
> 2. `[Alta LOCAL — Agregar producto]` → Drawer: nombre, sección, precio, **unidad** enum completo (KG, PIEZA, MANOJO, CAJA, LITRO, GRAMO), **factor caja** con ayuda «cuántos kg o piezas trae una caja». Factor obligatorio visualmente si unidad = CAJA.
> 3. `[Editar LOCAL]` → Nombre + `Product.unit` + factor de oferta. Foto F10 intacta (no rediseño).
> 4. `[Editar GLOBAL]` → Copy: «Unidad y factor de **tu** oferta / tu frutería». **No** campos nombre ni unidad del maestro. Si no hay unidad de oferta, placeholder = unidad del maestro (fallback). Primera edición sin oferta **crea** `ProviderProduct`.
> 5. `[Guardar sin existencias ni Encargar]` → Save directo. POS/inventario/catálogo usan unidad de oferta o fallback.
> 6. `[Cambio unidad/factor con on-hand o Encargar]` → `UF-INV-07` (alerta o 409). No save ciego.
> 7. `[Condicional]` → Factor ≤0 / no numérico / CAJA sin factor → 400 inline. PATCH nombre/unidad maestro GLOBAL → no expuesto en UI; 403/400 si se fuerza.
>
> **Reglas UI:**
> - Factor no se pide en cada entrada de inventario (D-F12-7). Ficha inventario puede mostrar el mismo factor.
> - Otras sucursales intactas. No SKU nuevo para cambiar unidad GLOBAL.
> - Wireframe: `WF-CAT-18-drawer-editar.md`.

## Inputs Utilizados

- **US:** `US-CAT-18`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-CAT-18-editar-unidad-oferta.md`
