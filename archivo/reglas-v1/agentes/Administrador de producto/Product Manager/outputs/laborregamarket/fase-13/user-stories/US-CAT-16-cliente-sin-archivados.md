# User Story — US-CAT-16

> **ID:** US-CAT-16  
> **Título:** Cliente y POS no venden ni listan productos ocultos  
>
> **Como:** CLIENT (y cajero POS de la sucursal)  
> **Quiero:** que un producto oculto por el proveedor se comporte como no vendible  
> **Para:** no ver ítems fantasmas en explorar, ficha, carrito, checkout ni mostrador  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que el proveedor ocultó una oferta, cuando un CLIENT abre `/explorar`, `/fruteria/[id]`, preview o arma el carrito **de nuevo**, entonces ese ítem **no** aparece. El POS de esa sucursal **no** lo ofrece en el catálogo de mostrador. No hay pantalla nueva de cliente Must: solo **ausencia correcta**.
> - [ ] **Escenario 2 (Validación/Error):** Dado un carrito **ya armado** con ese `providerProductId`, cuando confirmo Encargar o cobro POS, entonces **409** «Producto no disponible» (mismo contrato que `US-CAT-01` / ADR-022). El FE retira o marca no disponible. Líneas libres POS (ADR-013) **no** aplican esta regla. Timeout o 5xx: error recuperable, no se cobra el oculto.
> - [ ] **Regla de Negocio:** D-F13-6, D-F13-11. Vendible = `isAvailable` + `product.isActive` + **sin** `archivedAt`. Cero cambio de contrato visual de Explorar. Envelope ADR-003.

>
> **UX:** sin rediseño cliente. **Arquitecto:** `sellableProviderProductWhere` incorpora no archivado. **QA:** fruteria, explorar, carrito 409, POS.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-CAT-01` (F5), `US-CAT-14`
- **Código hoy:** `sellableProviderProductWhere` = `isAvailable` + `product.isActive`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-CAT-16-cliente-sin-archivados.md`
- **Agente Downstream:** Arquitecto, Backend, Frontend, QA
