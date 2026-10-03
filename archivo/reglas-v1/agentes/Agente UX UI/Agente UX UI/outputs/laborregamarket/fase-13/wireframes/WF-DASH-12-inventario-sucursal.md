> **Pantalla:** Reportes sucursal — pestaña Inventario
> **Objetivo Principal:** Ver saldo ahora + entradas registradas; imprimir esa vista

```text
+-----------------------------------------------------------------------+
| Ventas (F12 label) · vista Reportes                                   |
| [ Ventas ] [ Inventario* ]                         [ Imprimir ] sec.  |
+-----------------------------------------------------------------------+
| Inventario actual (sucursal activa)                                   |
| SKU            Unidad oferta     On-hand    Tope                      |
| Mango Kent     CAJA              4          20                        |
+-----------------------------------------------------------------------+
| Entradas / cargas (desde go-live F13; sin backfill F12)               |
| Fecha              SKU         Cant.   Caja?   Delta                  |
| 16/09/2026 10:12   Mango Kent  2 cajas Sí      +24 kg                 |
+-----------------------------------------------------------------------+

EMPTY actual: «Sin SKUs visibles (los ocultos no se listan).»
EMPTY entradas: «Aún no hay entradas registradas.»
LOADING: dos skeletons
ERROR: Reintentar; no kardex inventado
PRINT: mismas dos tablas; look proveedor
```

#### Componentes:
* **ReportsViewTabs:** Ventas | Inventario; `aria-current` en activa.
* **OnHandTable** + **StockEntriesTable:** unidad = oferta o fallback.
* **DocumentActions Imprimir:** Button Secondary (no primary de cobro).
* Mobile: tablas scroll horizontal o stacked cards. 4 estados Must.

## Inputs Utilizados

- **UF:** `UF-DASH-12`

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-DASH-12-inventario-sucursal.md`
