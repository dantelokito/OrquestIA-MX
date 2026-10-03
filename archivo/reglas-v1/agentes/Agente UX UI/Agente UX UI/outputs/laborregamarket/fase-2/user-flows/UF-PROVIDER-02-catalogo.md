> **Flujo:** Gestión de catálogo proveedor
> **Historia de Usuario Asociada:** — (módulo PRODUCTS; persona Carlos PROVIDER)
>
> **Punto de entrada:** Login PROVIDER → `/proveedor`; Header "Mi panel"
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor]` → Usuario ve lista de productos del catálogo global (15 items seed).
> 2. `[Toggle disponibilidad]` → Usuario activa/desactiva producto para su negocio.
> 3. `[Editar precio]` → Usuario modifica precio en campo inline → blur o botón guardar.
> 4. `[Condicional guardado]` → ¿API exitosa?
>    - **Sí:** → feedback inline verde breve o check icon en fila.
>    - **No:** → error inline rojo en fila + "Reintentar".
> 5. `[Link explorar]` → "Ver cómo se ve mi negocio" → `/fruteria/[mi-id]` preview.
>
> **Condicionales estado panel:**
> - **Sin Provider:** → EmptyState + CTA wizard (ver UF-PROVIDER-01).
> - **Loading:** → Skeleton 10 filas tabla.
> - **Empty catálogo:** → "No hay productos en el catálogo global" (caso edge; seed tiene 15).
> - **Success:** → Tabla completa con toggles y precios editables.
> - **Error carga:** → ErrorBanner + Reintentar.
>
> **Reglas UI:**
> - CTA contextual: toggle activar es acción principal por fila.
> - Precio: input numérico, min 0, 2 decimales.
> - Solo productos del catálogo global; proveedor no crea productos nuevos (decisión PM #5).
