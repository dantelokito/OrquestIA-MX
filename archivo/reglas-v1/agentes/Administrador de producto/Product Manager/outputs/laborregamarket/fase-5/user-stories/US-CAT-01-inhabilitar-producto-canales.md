# User Story — US-CAT-01

> **ID:** US-CAT-01  
> **Título:** Inhabilitar producto lo oculta en todos los canales  
>
> **Como:** PROVIDER  
> **Quiero:** inhabilitar un producto de mi catálogo y que deje de aparecer y de venderse en cualquier canal  
> **Para:** no ofrecer algo que ya no manejo, sin borrar el producto del catálogo global  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un `ProviderProduct` activo, cuando lo inhabilito desde el panel proveedor, entonces desaparece de `/explorar` (si se listaba por producto), de `/fruteria/[id]`, del carrito del cliente (línea retirada o marcada no disponible) y del catálogo del POS; no se puede agregar de nuevo hasta reactivar.
> - [ ] **Escenario 2 (Pedido / POS bloqueados):** Dado un producto inhabilitado, cuando un CLIENT confirma `POST /api/orders` o el PROVIDER cobra en POS con ese `productId`, entonces la API responde error de validación (envelope ADR-003) y **no** se crea la orden ni la venta.
> - [ ] **Escenario 3 (Reactivar):** Dado un producto inhabilitado, cuando lo vuelvo a activar, entonces reaparece en detalle, explorar (si aplica), carrito elegible y POS, con el precio vigente.
> - [ ] **Regla de Negocio:** D-F5-5. No es un módulo nuevo de inventario ni "agotado/stock": es el toggle F1 endurecido en todos los canales. El producto global (ADMIN) no se borra. Un inhabilitado no entra en top productos del dashboard si la métrica es de catálogo vigente (ventas históricas ya cobradas no se reescriben).

>
> **UX:** Clarificar el toggle existente (activo/inactivo) y empty state en POS si el catálogo queda vacío. **QA:** matriz CAT — explorar, detalle, carrito, `POST /api/orders`, POS.
