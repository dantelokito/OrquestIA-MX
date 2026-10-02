> **Flujo:** Indicador parcial Encargar (reserva / entregado / cancelado)  
> **Historia de Usuario Asociada:** US-INV-06  
>
> **Pasos del Usuario:**
> 1. `[Cliente Encargar]` -> Crea pedido Marketplace (flujo F3). El cliente **no** ve existencias (D-F12-12).
> 2. `[Proveedor Inventario]` -> La fila del SKU muestra parcial = Q del pedido activo (PENDING, CONFIRMED o IN_TRANSIT).
> 3. `[Condicional]` -> ¿El dueño marca DELIVERED en Órdenes?
>    - **Sí:** parcial de esa Q desaparece; on-hand baja (commit). No hay pantalla extra de kardex.
>    - **CANCELLED antes de entregar:** parcial desaparece; on-hand no pierde esa Q por commit.
> 4. `[Saldo 0]` -> Encargar del cliente igual se crea. Inventario puede mostrar on-hand 0 o negativo y parcial > 0 a la vez.

## Inputs Utilizados

- **US:** `US-INV-06`, `US-INV-04`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-INV-06-parcial-encargar.md`
- **Wireframe:** `WF-INV-04-listado.md`
