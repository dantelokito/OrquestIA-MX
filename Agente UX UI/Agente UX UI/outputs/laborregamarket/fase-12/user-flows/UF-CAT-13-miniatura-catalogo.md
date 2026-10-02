> **Flujo:** Miniatura siempre en lista catálogo  
> **Historia de Usuario Asociada:** US-CAT-13  
>
> **Pasos del Usuario:**
> 1. `[Lista catálogo]` -> Cada fila muestra thumb 48×48 (`min-w-11 min-h-11`). Independiente del toggle POS.
> 2. `[Condicional]` -> ¿Hay imagen disco F10?
>    - **Sí:** `<img>` con `alt` = nombre del producto.
>    - **No:** `ImagePlaceholder` (icono Image `aria-hidden` + texto «Sin foto»).
>    - **404:** mismo placeholder; nombre/precio/Activo siguen.
> 3. `[Toggle POS OFF]` -> Las miniaturas de esta lista **siguen visibles**.

## Inputs Utilizados

- **US:** `US-CAT-13`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-CAT-13-miniatura-catalogo.md`
- **Wireframe:** `WF-CAT-12-13-fila-catalogo.md`
