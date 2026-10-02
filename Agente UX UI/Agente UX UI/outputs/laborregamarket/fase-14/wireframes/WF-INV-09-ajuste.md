> **Pantalla:** Sheet Ajuste por conteo físico
> **Objetivo Principal:** Dejar on-hand igual al conteo de piso (≥ 0)
> **Flujo:** UF-INV-09

```text
SHEET ajuste
+------------------------------------------+
|  Ajuste por conteo                  [✕]  |
|  Mango Ataulfo · KG                      |
|  El saldo quedará exactamente en el      |
|  conteo. No es una entrada de almacén.   |
+------------------------------------------+
|  Saldo en sistema                        |
|  8 KG                         (read-only)|
|  Conteo físico *                         |
|  [ 5                                 ]   |
|  Preview: Se aplicará un ajuste de −3 KG |
|  (queda 5).                              |
+------------------------------------------+
|  [ Confirmar ajuste ]  ← único primary   |
+------------------------------------------+

Conteo = saldo → preview «Sin cambio»; CTA disabled.
Conteo 0 → preview «queda 0»; CTA enabled.
Conteo −1 → «El conteo no puede ser negativo»; CTA no envía.
```

Móvil: sheet full-screen; preview siempre visible sobre el CTA. Desktop: drawer ~400px.

#### Cuatro estados

| Estado | UI |
|--------|-----|
| Empty | Conteo vacío; preview oculta o «Indica el conteo». |
| Loading | CTA busy «Guardando…». |
| Error | `< 0` inline; 400 servidor en sheet; onHand intacto. |
| Success | Cierra; saldo = conteo; fila AJUSTE en Movimientos. |

#### Componentes Requeridos para Frontend:

* **CountAdjustSheet:** saldo sistema vs conteo + `DeltaPreview`.
* Un CTA **Confirmar ajuste**. Cancelar = ✕ / overlay.

## Inputs Utilizados

- **UF:** `UF-INV-09`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-INV-09-ajuste.md`
- **Agente Downstream:** Frontend Developer
