> **Flujo:** Registrar entrada de existencias  
> **Historia de Usuario Asociada:** US-INV-02  
>
> **Pasos del Usuario:**
> 1. `[Listado inventario]` -> En una fila, pulsa el CTA dominante **Registrar entrada**.
> 2. `[Sheet / drawer Entrada]` -> Ve unidad de catálogo del SKU (solo lectura: KG, PIEZA, MANOJO, CAJA, LITRO o GRAMO) y campo cantidad.
> 3. `[Condicional]` -> ¿El SKU se vende en kg/pieza y entra en caja?
>    - **Sí:** hint «1 caja = {factor} {unidad de venta}». El factor se edita en la **ficha**, no en cada carga.
>    - **No:** no se muestra campo de factor en el formulario de entrada.
> 4. `[Condicional]` -> ¿Cantidad > 0 y numérica?
>    - **Sí:** guarda; toast «Entrada registrada»; on-hand aumenta; se puede guardar aunque el saldo previo esté mal o negativo.
>    - **No:** error inline «Indica una cantidad mayor que cero»; no muta; CTA permanece enabled tras corregir.
> 5. `[Ficha inventario]` -> Desde la fila, **Editar ficha** abre tope, umbral, alerta y **factor caja fijo** (si aplica). Guardar factor no registra movimiento.

## Inputs Utilizados

- **PRD:** `fase-12/prd.md` (workspace PM)
- **US:** `US-INV-02`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-INV-02-entrada-factor-caja.md`
- **Wireframe:** `WF-INV-02-entrada.md`, `WF-INV-03-ficha-capacidad.md`
