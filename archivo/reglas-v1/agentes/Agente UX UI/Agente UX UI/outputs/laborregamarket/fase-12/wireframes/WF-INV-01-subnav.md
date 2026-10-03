> **Pantalla:** SubNavProveedor — orden F12  
> **Objetivo Principal:** Llegar a inventario primero y a Ventas (dashboard) sin cambiar rutas  
> **Flujo:** UF-INV-01

```text
+-----------------------------------------------------------------------------------+
| [Header PROVIDER]  [ProviderSwitcher N>1]  [ActiveStoreEyebrow]                   |
+-----------------------------------------------------------------------------------+
| Inventario | Catálogo | POS | Órdenes | Ventas | Reportes generales†              |
|     ●      |          |     |         |        |  †solo N>1                       |
| /proveedor/inventario     /proveedor/dashboard (label Ventas, ruta intacta)       |
+-----------------------------------------------------------------------------------+
```

Ítems ≥44px alto (`min-h-11`), scroll horizontal en móvil. Activo: `border-b-2` brand + `aria-current="page"`.

Orden fijo (D-F12-2, D-F12-11):

| Orden | Label | Ruta |
|-------|-------|------|
| 1 | Inventario | `/proveedor/inventario` |
| 2 | Catálogo | `/proveedor` |
| 3 | POS | `/proveedor/pos` |
| 4 | Órdenes | `/proveedor/ordenes` |
| 5 | Ventas | `/proveedor/dashboard` |
| 6 | Reportes generales | `/proveedor/reportes-generales` (oculto N≤1) |

#### Componentes Requeridos para Frontend:

* **InventoryNavItem:** primer tab; icono `Warehouse` opcional `aria-hidden`.
* **SalesNavItem:** mismo componente que Dashboard F11, **solo** cambia el label visible a «Ventas».
* **GlobalReportsNavItem:** sin cambio F11.

## Inputs Utilizados

- **US-INV-01**, IA v0.11.0 (delta)

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-INV-01-subnav.md`
