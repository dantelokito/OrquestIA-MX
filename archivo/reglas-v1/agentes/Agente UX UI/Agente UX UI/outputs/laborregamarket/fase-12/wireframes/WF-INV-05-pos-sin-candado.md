> **Pantalla:** POS — sin candado de stock (delta F12)  
> **Objetivo Principal:** Cobrar aunque on-hand sea 0 o negativo  
> **Flujo:** UF-INV-05  
> **Base:** wireframes POS F3 (solo lectura). No rediseñar keypad/ticket.

```text
+-----------------------------------------------------------------------+
| SubNav … POS activo                                                   |
| Catálogo POS                          | Ticket                        |
| [card]  (imagen según toggle CAT)     | …                             |
|  Chile · $38.50                       | [ Cobrar ]  ← CTA dominante   |
|  SIN candado, SIN «Agotado»,          |                               |
|  SIN disable por existencias          |                               |
+-----------------------------------------------------------------------+
```

**Prohibido en F12:** overlay lock, badge stock, toast «no hay inventario», checkbox «forzar venta».

Inactivo ADR-022: el SKU **no** entra al catálogo POS (comportamiento F5).

#### Componentes Requeridos para Frontend:

* Reusar `PosProductCard`. Delta: imagen opcional (`WF-POS-12`). **Cero** props de bloqueo por on-hand.

## Inputs Utilizados

- **US-INV-05**

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-INV-05-pos-sin-candado.md`
