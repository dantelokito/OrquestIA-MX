> **Pantalla:** `/proveedor/inventario` — listado y 4 estados  
> **Objetivo Principal:** Ver on-hand, barra, alerta y parcial Encargar  
> **Flujos:** UF-INV-04, UF-INV-06

### Success

```text
+-----------------------------------------------------------------------------------+
| SubNav: Inventario activo                                                         |
| Inventario — {nombre sucursal activa}                                             |
| Existencias de esta frutería. No se comparte con otras sucursales.                |
+-----------------------------------------------------------------------------------+
| Producto        On-hand     Capacidad              Alerta        Encargar  Acción |
| Mango  [thumb]  8.2 kg      [████░░░░] 82%         —             Reserva 2  [+]   |
| Chile          4 pza       [██░░░░░░] 8%          Poca existencia Reserva 0  [+] |
| Caja manzana   110 / 100   [████████] 110%         —             Reserva 5  [+]   |
+-----------------------------------------------------------------------------------+
```

`[+]` = CTA **Registrar entrada** (primary por fila; en móvil botón texto `w-full`). **Editar ficha** = ghost.

Barra >100%: track full + label numérico `110%` + `text-warning` **y** texto «Sobre tope» (nunca solo color).

Parcial: `Package` + «Reserva {n} {unidad}». n=0: «Sin reserva» `text-muted`.

### Loading

```text
| [skeleton fila ×6]  barra gris animate-pulse                                      |
```

### Empty

```text
|  [Package 48px]                                                                   |
|  Aún no hay productos en esta frutería                                            |
|  Agrega SKUs en Catálogo para ver existencias aquí.                               |
|  [ Ir a Catálogo ]  secondary → /proveedor                                        |
```

### Error

```text
|  [CircleAlert 48px]                                                               |
|  No pudimos cargar el inventario                                                  |
|  Revisa la conexión. No mostramos saldos inventados.                              |
|  [ Reintentar ]  ← único primary                                                  |
```

Móvil: cards apiladas (thumb 48px, barra full width, CTA `w-full min-h-11`). Desktop: tabla `max-w-7xl`.

#### Componentes Requeridos para Frontend:

* **InventoryPage** + **InventoryRow**
* **InventoryCapacityBar** (`role="progressbar"` `aria-valuenow` puede >100; `aria-valuemax=100` o max dinámico documentado: usar `aria-valuetext="{n} por ciento de capacidad"`)
* **LowStockBadge** (texto + icono)
* **EncargarReserveChip**
* **StockEntryCta**

## Inputs Utilizados

- **US-INV-04**, **US-INV-03**, **US-INV-06**

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-INV-04-listado.md`
