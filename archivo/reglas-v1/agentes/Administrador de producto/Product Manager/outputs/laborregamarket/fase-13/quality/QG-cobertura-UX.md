# QG cobertura UX — Fase 13

> **Rol:** Product Manager (gate de cobertura, **no** `QG-correcciones` post-QA).
> **Fecha:** 16/09/2026
> **Implementación de diseño:** cuando el orquestador abra chat UX.

## Must

- [ ] No saturar `/proveedor`: una acción **Eliminar** por fila; no modal de «borrar para siempre». Fila operativa: **Editar** + Foto (F10) + Eliminar + Activo; targets ≥44px en móvil.
- [ ] **Editar visible en GLOBAL y LOCAL.** Copy GLOBAL: unidad y factor de **tu** oferta / «tu frutería», no del catálogo admin. GLOBAL no ofrece editar el nombre del maestro.
- [ ] Copy primario: «Eliminar» / «Quitar de catálogo». Ayuda: «Se oculta de tu catálogo. El administrador sigue viendo el producto.» Prohibido: «borrar de la base», «eliminar permanente».
- [ ] Diferencia visible **Inactivo** vs **Eliminado de la vista** (Inactivo sigue en la lista).
- [ ] Sección pie **colapsada por defecto**: «Eliminados de la vista»; lista corta; Restaurar.
- [ ] Onboarding: el vacío de «cero secciones» no implica vacío de productos GLOBAL de plataforma.
- [ ] Admin: una tabla con origen LOCAL/GLOBAL; filtro `isActive`; paginación visible; un CTA dominante por pantalla.
- [ ] Cuatro estados (empty, loading, error, success) en admin listado y en bandeja proveedor.
- [ ] Responsive: fila de acciones usable en móvil (≥44px). Contraste WCAG AA.
- [ ] Cliente: **sin** pantallas nuevas Must.
- [ ] Drawer producto: unidad (todas las del enum, CAJA visible) + factor caja con ayuda («cuántos kg o piezas trae una caja»). Factor obligatorio visualmente si unidad = CAJA.
- [ ] Modal de cambio de unidad/factor: alerta de descarte de inventario y de impacto en POS, Encargar e inventario; sugiere alta de producto nuevo si cambió el formato de venta. CTA confirmar vs cancelar.
- [ ] Estado de error si hay Encargar activo **al cambiar unidad/factor**: copy accionable, no genérico. Ocultar no muestra este error.
- [ ] Precio: control claro en GLOBAL («precio de tu frutería», no del catálogo admin). Historial: lista corta fecha / antes / después.
- [ ] Reportes: pestaña Inventario junto a Ventas; tabla actual + tabla entradas. Generales N>1: solo actuales, copy que no prometa historial ahí.

## Tokens / baseline

Reusar tokens F10 panel proveedor y admin Catálogos. No copiar look slate de analytics. No rediseñar `/fruteria`. Foto de producto: controles F10, no rediseño F13.

## No hacer

- Kardex de ventas/POS/Encargar/descarte en Reportes. Historial de entradas en la pestaña de reportes generales N>1.
- Flujo de «crear producto nuevo» como único camino para cambiar el precio **o la unidad** de un GLOBAL.
- Dejar Editar solo en LOCAL (regresión del Must D-F13-15 enmendado).
