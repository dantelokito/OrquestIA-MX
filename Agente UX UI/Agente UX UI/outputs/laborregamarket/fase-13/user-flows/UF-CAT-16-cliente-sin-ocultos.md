> **Flujo:** Cliente y POS no listan ni venden ocultos (sin pantallas nuevas)
> **Historia de Usuario Asociada:** US-CAT-16
>
> **Punto de entrada:** `/explorar`, `/fruteria/[id]`, preview in-card, `/carrito`, `/proveedor/pos`. **No rediseñar** esas pantallas.

> **Pasos del Usuario:**
> 1. `[Descubrimiento]` → Producto oculto **ausente** en explorar, ficha, preview. Cero wireframe nuevo Must.
> 2. `[Carrito stale]` → Si el ítem ya estaba en carrito: al Confirmar Encargar o cobrar POS → 409 «Producto no disponible» (mismo patrón F5). FE retira o marca no disponible. Líneas libres POS (ADR-013) no aplican.
> 3. `[POS]` → Catálogo de mostrador no ofrece ocultos. Empty F5 intacto si no hay activos vendibles.
> 4. `[Timeout 5xx]` → Error recuperable; no se cobra el oculto.
>
> **Reglas UI:**
> - Vendible visual = activo + maestro activo + no oculto.
> - WhatsApp, mapa, reseñas, existencias en `/fruteria`: **sin delta**.
> - Wireframe: `WF-CAT-16-ausencia-cliente.md` (nota de ausencia).

## Inputs Utilizados

- **US:** `US-CAT-16`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-CAT-16-cliente-sin-ocultos.md`
