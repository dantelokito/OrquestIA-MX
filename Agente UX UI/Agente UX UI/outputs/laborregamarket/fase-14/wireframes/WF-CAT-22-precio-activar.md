> **Pantalla:** Diálogo precio obligatorio al activar GLOBAL sin oferta
> **Objetivo Principal:** No publicar un precio inventado de 50
> **Flujo:** UF-CAT-22

```text
FILA GLOBAL (sin precio)
+----------------------------------------------------------+
| [thumb] Mango Kent  GLOBAL   Precio: —                   |
| Activo  [----O]  off                                     |
+----------------------------------------------------------+
        | tap Activo
        v
DIÁLOGO PriceRequiredDialog
+----------------------------------------------------------+
| Poner a la venta · Mango Kent                        [✕] |
| Este producto aún no tiene precio en tu frutería.        |
| Indica un precio mayor que cero. No usamos un default.   |
| Precio de tu frutería *                                  |
| [  0.00                          ]  MXN                  |
| (error) El precio debe ser mayor que cero.               |
| [ Cancelar ]              [ Poner a la venta ]  CTA      |
+----------------------------------------------------------+
```

Móvil: diálogo full-screen o sheet inferior; inputs y botones `w-full min-h-11`. Desktop: modal centrado max-w-md.

Si ya hay precio > 0: el switch funciona sin diálogo (no pisa el precio).

#### Cuatro estados

| Estado | UI |
|--------|-----|
| Empty | Input vacío; CTA disabled hasta número > 0 (o CTA enabled + validación al submit). Preferir validación al submit para no esconder el requisito. |
| Loading | CTA `loading` «Guardando…»; campos disabled. |
| Error | ≤0 / NaN / 400 API: `border-error` + mensaje. Switch permanece OFF. `/fruteria` no lista $50. |
| Success | Diálogo cierra; switch ON; precio visible en fila; historial F13 si aplica primera asignación. |

#### Componentes Requeridos para Frontend:

* **PriceRequiredDialog:** `PriceInput` F13; un CTA **Poner a la venta**.
* **CatalogActiveSwitch:** intercepta ON si `price` ausente o ≤ 0 en GLOBAL.
* Prohibido: `price: item.price ?? 50`.

## Inputs Utilizados

- **UF:** `UF-CAT-22`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/wireframes/WF-CAT-22-precio-activar.md`
- **Agente Downstream:** Frontend Developer
