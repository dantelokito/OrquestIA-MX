# User Story — US-CAT-14

> **ID:** US-CAT-14  
> **Título:** Proveedor oculta un producto de su catálogo (Eliminar ≠ borrar)  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** una acción **Eliminar** en la fila que oculte de **mi** catálogo tanto un SKU de la base GLOBAL como uno LOCAL que yo di de alta  
> **Para:** no saturar el dashboard ni las secciones, sin borrar evidencia de ventas ni el maestro que ve el admin  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un ítem en mi dashboard (GLOBAL de plataforma, con o sin oferta previa, **o** LOCAL propio), cuando pulso **Eliminar** (copy de botón puede ser «Eliminar» / «Quitar de catálogo»; ayuda: no se borra de la base), entonces se persiste `archivedAt` en **mi** `provider_products` de la sucursal activa. Si el GLOBAL **no** tenía oferta, se **crea** la fila ya archivada (D-F13-8). La fila **desaparece** del listado operativo. El SKU **sigue** en SQL y en el listado admin (`US-ADMIN-05`). Otra sucursal mía (N>1) **no** pierde ese GLOBAL. `isAvailable` **no** se usa como único flag y **no** se exige mutarlo. Si estaba a la venta, deja de ser vendible (mismo efecto que inactivo hacia el cliente).
> - [ ] **Escenario 2 (Validación/Error):** Dado un LOCAL de **otra** sucursal o un `productId` inexistente, cuando intento ocultar, entonces **403/404** y no hay fila nueva sucia. Sin sucursal activa / sin auth PROVIDER → **401/403**. Un CLIENT no puede ocultar. No existe DELETE HTTP de producto ni de oferta: si se llama, **405** o la ruta no existe (`US-SEC-04`). Confirmación UX: el usuario entiende que va a «Eliminados de la vista», no que se borra el historial.
> - [ ] **Regla de Negocio:** D-F13-3, D-F13-5, D-F13-6, D-F13-7, D-F13-8, D-F13-24. Unique `(providerId, productId)` se **conserva** (no se puede «volver a crear» el mismo SKU; se restaura). `sectionId` se conserva. **Ocultar con Encargar activo está permitido** (no cancela encargos; POS/carrito nuevos → `US-CAT-16`). Distinto de `US-INV-07` (unidad/factor sí 409). No saturar: la acción vive en la fila de acciones, no es un flujo de borrado de maestro. Envelope ADR-003. AUDIT PRODUCTS DISABLE con `details.archived: true`.

>
> **UX:** acción en fila junto a Activo/Inactivo; copy que no diga «borrar de la base». **Arquitecto:** campo `archivedAt`; alta de oferta archivada para GLOBAL sin fila. **QA:** GLOBAL con oferta, GLOBAL sin oferta, LOCAL; IDOR entre sucursales.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **UI hoy:** `ProviderCatalogF10.tsx` (solo toggle Activo/Inactivo; no hay Eliminar de producto)
- **Permisos:** seed PROVIDER `canDelete=false` en PRODUCTS

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-CAT-14-ocultar-oferta.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
