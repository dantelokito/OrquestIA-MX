> **Pantalla:** Fila lista catálogo `/proveedor` — miniatura + barra  
> **Objetivo Principal:** Reconocer SKU y ver capacidad sin salir de catálogo  
> **Flujos:** UF-CAT-12, UF-CAT-13  
> **Delta F10:** `WF-proveedor-catalogo-f10.md` (solo lectura). No reabrir Explorar.

```text
+-----------------------------------------------------------------------------------+
| [ Agregar producto ]  [ Nueva sección ]                                           |
| Pregunta extra (US-POS-12):                                                       |
|  Mostrar fotos en el POS   [● ON ]  switch ≥44px  (NO está en /proveedor/pos)     |
+-----------------------------------------------------------------------------------+
| ▾ Frutas                                                                          |
| [48px img] Mango  Solo/Catálogo  $45.00  [● Activo]  [████░░] 82%  [Editar]      |
| [ph empty] Chile  …                  $38.50  [● Activo]  [██░░░░] 8%   [Editar]  |
+-----------------------------------------------------------------------------------+
```

Miniatura **siempre** (48×48, `object-cover rounded-lg`). Placeholder si no hay foto o 404.

Barra compacta altura 8px, ancho min 80px desktop; móvil bajo el precio para no aplastarlo.

Toggle POS OFF **no** oculta thumbs de esta lista.

#### Componentes Requeridos para Frontend:

* **CatalogRowThumb** (`alt` = nombre)
* **InventoryCapacityBar** variante `compact`
* **PosImagesToggle** (vive aquí; ver `WF-POS-12`)

## Inputs Utilizados

- **US-CAT-12**, **US-CAT-13**, **US-POS-12**

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-CAT-12-13-fila-catalogo.md`
