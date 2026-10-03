# User Story — US-CAT-18

> **ID:** US-CAT-18  
> **Título:** Alta LOCAL y edición de oferta (GLOBAL o LOCAL) con unidad completa y factor caja  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** ver el botón **Editar** en cada fila de mi catálogo (GLOBAL y LOCAL), elegir la unidad de venta (incluyendo CAJA) y registrar el factor caja; al agregar un producto LOCAL, capturar lo mismo en el alta  
> **Para:** ajustar unidad y caja de **mi** oferta (precio y foto ya se pueden) sin cambiar el maestro GLOBAL ni a otras fruterías  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado el listado operativo de `/proveedor` catálogo, cuando veo una fila GLOBAL («Catálogo») o LOCAL («Solo este negocio»), entonces hay acción **Editar** (además de Foto si hay oferta, Activo e Eliminar). Dado que abro **Agregar producto** (LOCAL), cuando completo nombre, precio, sección, **unidad** (KG, PIEZA, MANOJO, CAJA, LITRO o GRAMO) y **factor caja**, entonces se guarda `Product.unit` (LOCAL) y el factor de **mi** oferta. Dado que abro **Editar** en LOCAL, entonces puedo cambiar nombre, unidad (`Product.unit`) y factor. Dado que abro **Editar** en GLOBAL, entonces **no** edito nombre ni `Product.unit` del maestro; sí asigno o cambio la **unidad de mi oferta** y el **factor caja** de esta sucursal. Si la oferta aún no tiene unidad propia, el formulario muestra la del maestro (fallback). La primera edición de un GLOBAL **sin** oferta **crea** la `ProviderProduct` (mismo patrón que activar precio). El factor **no** se pide de nuevo en cada carga de inventario (D-F12-7). La ficha de inventario **puede** seguir mostrando el factor (misma fuente). Otras sucursales conservan su unidad/factor. POS, Encargar, inventario y catálogo de **esta** sucursal usan la unidad de venta de la oferta (o el fallback).
> - [ ] **Escenario 2 (Validación/Error):** Dado factor ≤ 0, no numérico o con más decimales de los permitidos, cuando guardo, entonces **400** y no hay fila sucia. Unidad fuera del enum → **400**. Unidad = CAJA y factor vacío → **400** (D-F13-25). Unidad ≠ CAJA y factor vacío → **válido**. Alta LOCAL sin sección o nombre HTML → mismos errores F10. Intentar PATCH de nombre o `Product.unit` de un GLOBAL → **403/400** y el maestro intacto. Editar unidad/factor con encargos activos o existencias → `US-INV-07` (no se aplica el save ciego). Sin auth / otra sucursal → **401/403**.
> - [ ] **Regla de Negocio:** D-F13-13, D-F13-15, D-F13-25. Hoy la UI solo ofrece KG/PIEZA **y** Editar solo en LOCAL (`ProviderCatalogF10.tsx`); Must ampliar enum **y** mostrar Editar en GLOBAL. Sin BOM. No SKU LOCAL nuevo para cambiar unidad de un GLOBAL. Envelope ADR-003. Rate limit altas F10. Foto sigue F10.

>
> **UX:** botón Editar en **todas** las filas operativas. Drawer Agregar (LOCAL: nombre + unidad + factor + precio + sección) vs Editar GLOBAL (unidad de **tu** oferta + factor; copy que no diga «catálogo admin»). Ayuda factor: «cuántos kg o piezas trae una caja». Fila usable en móvil con Editar + Foto + Eliminar + Activo (≥44px). **Arquitecto:** persistir unidad de oferta (`ProviderProduct.unit` o equivalente) sin mutar `Product.unit` GLOBAL; POST/PATCH local-products y upsert GLOBAL aceptan `boxContentFactor` y unidad de oferta. **QA:** Editar visible en GLOBAL; maestro A vs sucursal B independientes; CAJA + factor; fallback al maestro.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US F12:** `US-INV-02` (factor fijo en la oferta)
- **Código hoy:** `ProductFormDrawer.tsx` (`UNITS = KG|PIEZA`); `ProviderCatalogF10.tsx` (`local &&` Editar); `createLocalProductSchema`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-CAT-18-unidad-y-factor-caja.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
