> **Pantalla:** Modal cambio de unidad/factor (catálogo o ficha inventario)
> **Objetivo Principal:** Confirmar descarte de existencias o entender bloqueo Encargar

```text
ALERTA DESCARTE (on-hand ≠ 0, sin Encargar activo)
+------------------------------------------------------------------+
| El inventario actual se descartará                               |
| El saldo pasará a 0. Afecta POS, Encargar e inventario.          |
| Si cambió el formato de venta, conviene dar de alta un           |
| producto nuevo. Esto no es una entrada de almacén.               |
|                                                                  |
| [ Cancelar ]     [ Descartar inventario y guardar ]  CTA         |
+------------------------------------------------------------------+

ERROR ENCARGAR ACTIVO (no toast)
+------------------------------------------------------------------+
| No se puede cambiar la unidad                                    |
| Completa o cancela los encargos de este producto antes de        |
| cambiar la unidad o el factor.                                   |
| [ Ir a Órdenes ]                 [ Cerrar ]                      |
+------------------------------------------------------------------+
```

#### Componentes:
* **UnitChangeConfirmDialog:** modal, no toast. CTA dominante confirmar descarte (`--brand`). Cancelar no muta.
* **ActiveOrderBlockAlert:** `role="alert"`; copy accionable. **No** se muestra al ocultar (`US-CAT-14`).
* Contraste error `#EF4444` sobre blanco + icono (nunca color-only).
* Botones ≥44px; focus trap en modal; Escape = cancelar.

## Inputs Utilizados

- **UF:** `UF-INV-07`

## Outputs Generados

- **Archivo:** `fase-13/wireframes/WF-INV-07-modal-descarte.md`
