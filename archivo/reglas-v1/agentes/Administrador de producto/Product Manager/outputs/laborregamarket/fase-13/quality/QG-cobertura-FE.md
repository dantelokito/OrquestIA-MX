# QG cobertura Frontend — Fase 13

> **Rol:** Product Manager (gate de cobertura, **no** `QG-correcciones` post-QA).
> **Fecha:** 16/09/2026
> **Implementación:** bloqueada hasta handoff UX → Frontend **y** contrato API.

## Must

- [ ] Admin Catálogos → Productos: lista GLOBAL y LOCAL; columnas origen/dueño/`isActive`/`scope`; filtros; **controles de página** (no un solo `limit:100` silencioso).
- [ ] Admin: inhabilitar/rehabilitar SKU LOCAL y GLOBAL; no botón DELETE de producto.
- [ ] Proveedor: acción **Eliminar** en la fila (GLOBAL y LOCAL). Confirmación/copy: va a «Eliminados de la vista», no se borra la base.
- [ ] Proveedor: acción **Editar** en la fila **GLOBAL y LOCAL** (hoy solo LOCAL). Foto F10 intacta. Fila usable en móvil con Editar + Foto + Eliminar + Activo (≥44px).
- [ ] Listado operativo **sin** ocultos. Inactivos **sí** se ven. Toggle Activo intacto (F10/F12). GLOBAL nuevo del admin aparece sin recargar magia de «solo mis ofertas».
- [ ] Pie colapsado «Eliminados de la vista»: nombre, fecha, Restaurar. Empty si no hay.
- [ ] Cliente `/fruteria/[id]` y `/explorar`: el ítem oculto no aparece. Carrito: ítem stale → mensaje / no checkout ciego.
- [ ] POS e inventario: no muestran ocultos como vendibles. Barras F12 y miniatura CAT **no** regresionan en filas visibles. Unidad mostrada = oferta o fallback al maestro.
- [ ] Cuatro estados UI en listados nuevos (loading, empty, error, success).
- [ ] Sin `fetch` en la vista: capa servicios/hooks. Tests de componente del flujo ocultar/restaurar **y** Editar GLOBAL.
- [ ] Drawer Agregar LOCAL: nombre + select de **todas** las `ProductUnit` (incl. CAJA) + factor caja. Drawer Editar LOCAL: igual. Drawer Editar GLOBAL: **solo** unidad de **tu** oferta + factor; **sin** campo nombre del maestro.
- [ ] Al cambiar unidad o factor con existencias: modal de alerta (descarta inventario; afecta POS/Encargar/inventario) con confirmar/cancelar. GLOBAL y LOCAL.
- [ ] Si hay Encargar activo al cambiar unidad/factor: no abre el save; mensaje de completar o cancelar encargos. Ocultar **no** usa este bloqueo.
- [ ] Ficha inventario: mismo flujo de alerta/bloqueo al editar factor (o unidad si se expone ahí).
- [ ] Precio editable en filas GLOBAL y LOCAL; no deshabilitar GLOBAL. Historial de precio accesible por oferta.
- [ ] Reportes sucursal: pestaña Inventario (saldos + entradas) + print. Tras descarte, saldo 0 **sin** fila de entrada nueva. Reportes generales N>1: bloque de inventario **actual** por sucursal, sin historial de entradas.

## No hacer

- Rediseñar Explorar, mapa, reseñas.
- Iconografía que implique basura/borrado de base como único mensaje.
- Vista default «solo mis ofertas» (Won't: escondería la base GLOBAL).
- Crear un producto nuevo solo para cambiar el precio **o la unidad** de un GLOBAL.
- Ocultar el botón Editar en filas GLOBAL.
- Kardex de ventas en la pestaña Inventario; historial de entradas en reportes generales N>1.
