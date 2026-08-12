> **Flujo:** Detalle de frutería — productos y contacto
> **Historia de Usuario Asociada:** — (BL-005; persona María CLIENT)
>
> **Punto de entrada:** Clic en ProviderCard desde `/explorar` → `/fruteria/[id]`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /fruteria/[id]]` → Usuario ve info del negocio: nombre, badge verificado, rating placeholder.
> 2. `[Sección ubicación]` → Dirección, mini mapa, distancia placeholder.
> 3. `[Sección productos]` → Lista productos activos con precio por proveedor.
> 4. `[CTA Llamar]` → Usuario hace clic → abre `tel:{phone}` (sin checkout Fase 1).
> 5. `[Volver]` → Link "Explorar más fruterías" → `/explorar`.
>
> **Condicionales:**
> - **Loading:** → Skeleton hero + skeleton filas productos.
> - **404 / id inválido:** → EmptyState "Frutería no encontrada" + CTA explorar.
> - **Sin productos activos:** → Mensaje "Este negocio aún no tiene productos publicados" + CTA llamar igual.
> - **Éxito:** → Hero + grid productos + CTA llamar sticky en móvil.
>
> **Reglas UI:**
> - CTA dominante: "Llamar" (`tel:`).
> - Precios en MXN con formato `$XX.XX / kg` o unidad del producto.
> - Público: no requiere login para ver detalle.
