> **Pantalla:** Drawer Agregar (LOCAL) / Editar LOCAL / Editar GLOBAL (unidad de oferta)
> **Objetivo Principal:** Capturar unidad completa (CAJA) y factor de **esta** sucursal

```text
EDITAR GLOBAL (oferta)
+------------------------------------------+
| Editar oferta · Mango Kent               |
| Unidad y factor de TU frutería.          |
| No cambia el catálogo del administrador. |
| Maestro (solo lectura): KG               |
|                                          |
| Unidad de tu oferta  [ CAJA        v ]   |
| Factor caja *        [ 12          ]     |
| «Cuántos kg o piezas trae una caja»      |
| * obligatorio si unidad = CAJA           |
|                                          |
| [ Cancelar ]     [ Guardar oferta ] CTA  |
+------------------------------------------+

EDITAR / ALTA LOCAL
+------------------------------------------+
| Agregar producto (solo este negocio)     |
| Nombre *                                 |
| Sección *                                |
| Precio de tu frutería *                  |
| Unidad *  KG|PIEZA|MANOJO|CAJA|LITRO|GRAMO|
| Factor caja  (req. si CAJA)              |
| [ Cancelar ]      [ Guardar producto ]   |
+------------------------------------------+
```

#### Componentes:
* **OfferUnitSelect:** enum completo; CAJA visible.
* **BoxFactorField:** number; `aria-required` si CAJA; empty permitido si no CAJA.
* **MasterUnitHint:** texto muted en GLOBAL; campos nombre/unidad maestro **ausentes**.
* **CTA:** un dominante Guardar. Foto F10 fuera de este drawer (flujo existente).
* Mobile: drawer full-width; selects y botones `w-full` ≥44px.

## Inputs Utilizados

- **UF:** `UF-CAT-18`

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-CAT-18-drawer-editar.md`
