> **Flujo:** Cobrar en POS sin candado de existencias  
> **Historia de Usuario Asociada:** US-INV-05  
>
> **Pasos del Usuario:**
> 1. `[POS]` -> Agrega SKU vendible (`isAvailable`) aunque on-hand sea 0 o negativo.
> 2. `[Condicional]` -> ¿Hay UI de «sin stock», candado o disable por existencias?
>    - **No (Must):** el botón **Cobrar** sigue el flujo F3. No hay badge «Agotado» por inventario. Inactivo de catálogo (ADR-022) sigue sin aparecer en POS.
> 3. `[Cobrar éxito]` -> Ticket se cierra como hoy. No toast de «inventario insuficiente». El descuento on-hand es invisible en POS (se ve al volver a Inventario).
> 4. `[Error ADR-022]` -> Si el SKU se inhabilitó a mitad: mensaje existente «Producto no disponible», nunca copy de existencias.

## Inputs Utilizados

- **US:** `US-INV-05`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-INV-05-pos-sin-candado.md`
- **Wireframe:** `WF-INV-05-pos-sin-candado.md`
