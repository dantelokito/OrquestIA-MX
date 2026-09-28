> **Pantalla:** Catálogo proveedor — fila operativa + bandeja Eliminados de la vista
> **Objetivo Principal:** Editar/ocultar/activar sin saturar; restaurar desde el pie

```text
DESKTOP >=1024px
+-----------------------------------------------------------------------+
| SubNav: Inventario | Catálogo* | POS | Órdenes | Ventas | (Gral N>1) |
+-----------------------------------------------------------------------+
| Catálogo · [sucursal activa]                    [ + Agregar producto] |
| Toggle fotos POS (F12)                                                |
+-----------------------------------------------------------------------+
| Sección Frutas                                                        |
| [48px] Mango Kent  GLOBAL  [Precio tu frutería]  [Editar][Foto]       |
|         barra % F12          Activo [====]        [Eliminar]          |
|                                                                       |
| [48px] Mix LOCAL  LOCAL    [Precio]  [Editar][Foto] Activo [Eliminar] |
+-----------------------------------------------------------------------+
| v Eliminados de la vista (colapsado por defecto)                      |
|   Mix viejo · oculto 12/09/2026 18:40  [ Restaurar ]                  |
+-----------------------------------------------------------------------+

MOBILE <640px — fila no aplastar precio
+---------------------------------+
| Mini 48px  Nombre + badge       |
| Precio (w-full, no comprimir)   |
| [Editar][Foto]  row >=44px      |
| [Activo][Eliminar]              |
+---------------------------------+
```

#### Confirmación Eliminar
```text
+---------------------------------------+
| Quitar de tu catálogo                 |
| Se oculta de tu catálogo.             |
| El administrador sigue viendo         |
| el producto.                          |
| [ Cancelar ]  [ Quitar de catálogo ]  |
+---------------------------------------+
```
CTA dominante: Quitar de catálogo (`--brand`). Prohibido copy de borrado de base.

#### Cuatro estados — listado operativo
* **Empty secciones:** copy F10 + GLOBAL de plataforma siguen visibles si existen.
* **Loading:** skeleton filas + miniatura.
* **Error:** ErrorBanner + Reintentar.
* **Success:** filas sin archivados.

#### Cuatro estados — bandeja
* **Empty:** «No hay productos eliminados de la vista.»
* **Loading:** skeleton 3 filas.
* **Error:** inline + Reintentar.
* **Success:** lista corta + Restaurar ≥44px.

#### Componentes:
* **CatalogRowActionsF13:** Editar + Foto F10 + ProductActiveSwitch + Eliminar. Inactivo **permanece** en lista (texto «Inactivo»).
* **ArchivedTray:** `<details>` colapsado; `aria-expanded`.
* **RestoreButton:** secondary success, no primary de pantalla (primary sigue Agregar producto).
* Hover/focus/active/disabled: `transition-all duration-200`; focus visible.

## Inputs Utilizados

- **UF:** `UF-CAT-14`, `UF-CAT-15`, `UF-SEC` implícito

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-CAT-14-15-fila-bandeja.md`
