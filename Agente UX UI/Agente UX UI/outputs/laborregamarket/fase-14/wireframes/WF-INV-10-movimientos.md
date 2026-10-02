> **Pantalla:** Inventario → sub-pestaña Movimientos
> **Objetivo Principal:** Auditar entradas, mermas y ajustes (sin copy de ventas)
> **Flujo:** UF-INV-10

```text
/proveedor/inventario?tab=movimientos
+----------------------------------------------------------------------------------+
| Inventario — El Paraíso Centro                                                   |
| Existencias de esta frutería. No se comparte con otras sucursales.               |
| [ Existencias ] [ Movimientos ]   ← InventorySubTabs min-h-11                    |
+----------------------------------------------------------------------------------+
| Solo ves entradas, mermas y ajustes que registraste. Las ventas del POS y los    |
| pedidos Encargar no aparecen aquí.                                               |
| Filtros: [ Todos | Entrada | Merma | Ajuste ]  From [date] To [date] [Consultar] |
+----------------------------------------------------------------------------------+
| Fecha       | SKU          | Tipo    | Delta   | Motivo     | Nota | Saldo       |
| 17/09 10:02 | Mango Ataulfo| MERMA   | −5 KG   | Caducidad  | —    | 5           |
| 16/09 18:40 | Mango Ataulfo| ENTRADA | +12 KG  | —          | —    | 10          |
| 16/09 09:00 | Limón        | AJUSTE  | −2 KG   | —          | piso | 8           |
+----------------------------------------------------------------------------------+
| Paginación  ← anterior / siguiente  min-h-11                                     |
+----------------------------------------------------------------------------------+

MÓVIL: cards por movimiento (tipo badge + delta + fecha); filtros apilados.
```

Tipo: badge texto+color (Entrada `info`, Merma `warning`, Ajuste `slate`); nunca color-only.

#### Cuatro estados

| Estado | UI |
|--------|-----|
| Loading | 6 skeletons de fila `h-16 animate-pulse`, `aria-busy`. |
| Empty | Package icon 80px empty; «Aún no hay movimientos de entrada, merma o ajuste»; botón secondary **Ir a Existencias**. |
| Error | EmptyState CircleAlert + **Reintentar**. Sin filas fake. `from > to`: error en filtros. |
| Success | Tabla/cards + paginación. Isolation F11. |

#### Componentes Requeridos para Frontend:

* **InventorySubTabs:** Existencias | Movimientos; `aria-current`.
* **MovementsTable** + **MovementTypeBadge**.
* **MovementFilters:** chips tipo + `DateRangeFields`.
* Prohibido: columnas o copy de VENTA_POS / ENTREGA_PEDIDO / descarte unidad.

## Inputs Utilizados

- **UF:** `UF-INV-10`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-INV-10-movimientos.md`
- **Agente Downstream:** Frontend Developer
