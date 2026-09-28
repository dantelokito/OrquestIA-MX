> **Flujo:** Barra de capacidad en lista catálogo proveedor (nunca en vitrina)  
> **Historia de Usuario Asociada:** US-CAT-12  
>
> **Pasos del Usuario:**
> 1. `[ /proveedor Catálogo]` -> Cada fila de SKU muestra `InventoryCapacityBar` compacta, misma semántica que inventario (incluye >100%).
> 2. `[Switcher N>1]` -> Tras cambiar sucursal, las barras son de la activa.
> 3. `[Fallo capacidad]` -> La fila sigue operable (precio, Activo). Barra en estado omitido: texto «Sin capacidad» `text-secondary` o skeleton breve; **no** rompe layout.
> 4. `[ /fruteria/[id] ]` -> **Cero** barra, on-hand, umbral o parcial. Layout F10 de secciones intacto.

## Inputs Utilizados

- **US:** `US-CAT-12`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-CAT-12-barra-catalogo.md`
- **Wireframes:** `WF-CAT-12-13-fila-catalogo.md`, `WF-FRUTERIA-12-sin-existencias.md`
