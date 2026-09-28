> **Pantalla:** Sheet Registrar merma
> **Objetivo Principal:** Dar de baja cantidad con motivo, sin dejar saldo negativo
> **Flujo:** UF-INV-08

```text
FILA EXISTENCIAS (desktop)
| Producto | On-hand | … | [ Registrar entrada ] ← primary
|          |         |   | [ Registrar merma ]   ← secondary
|          |         |   | [ Ajuste por conteo ] ← ghost
|          |         |   | [ Editar ficha ]

SHEET merma (móvil full-screen / desktop drawer ~400px)
+------------------------------------------+
|  Registrar merma                    [✕]  |
|  Mango Ataulfo · KG                      |
|  Saldo actual: 10 KG  (solo lectura)     |
+------------------------------------------+
|  Cantidad *                              |
|  [ 5                                 ]   |
|  Motivo *                                |
|  [ Caducidad                      v ]    |
|    Caducidad | Daño | Robo | Muestra | Otro
|  Nota (opcional)                         |
|  [                                  ]    |
|  Esto no es una venta del POS.           |
+------------------------------------------+
|  [ Registrar merma ]  ← único primary    |
+------------------------------------------+

ERROR 400 (cantidad 4, saldo 3)
|  Cantidad *  border-error                |
|  La cantidad supera el saldo (3 KG).     |
|  No se registró merma.                   |
```

Móvil: no aplastar; scroll interno; CTA sticky inferior `w-full min-h-11`.

#### Cuatro estados

| Estado | UI |
|--------|-----|
| Empty | Cantidad vacía; motivo sin seleccionar. |
| Loading | CTA busy «Registrando…»; overlay o disabled. |
| Error | 400 overflow / motivo ausente / red: `role="alert"` en sheet. onHand no cambia. |
| Success | Cierra sheet; on-hand actualizado en listado. |

#### Componentes Requeridos para Frontend:

* **MermaSheet:** simétrico a `StockEntrySheet` + `ReasonSelect` + `NoteField`.
* Motivos: texto visible (nunca solo código enum).
* Focus trap + Esc cierra (si no busy).

## Inputs Utilizados

- **UF:** `UF-INV-08`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-INV-08-merma.md`
- **Agente Downstream:** Frontend Developer
