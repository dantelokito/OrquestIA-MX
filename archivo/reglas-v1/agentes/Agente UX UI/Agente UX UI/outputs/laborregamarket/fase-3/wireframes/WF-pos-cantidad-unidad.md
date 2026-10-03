> **Pantalla:** POS — cantidad y unidad (modal/sheet)
> **Objetivo Principal:** Capturar cantidad y unidad antes de agregar al ticket
> **Trigger:** Clic producto sin venta rápida en grid POS
>
> ```text
> +-----------------------------------------------------------------------+
> |  Agregar: Mango                                              [ ✕ ]   |
> +-----------------------------------------------------------------------+
> |  Cantidad                                                             |
> |  [ − ]     [  1.5  ]     [ + ]     ← QuantityStepper                  |
> |                                                                       |
> |  — o ingreso manual —                                                 |
> |  ┌─────────────────────────────────────────────────────────────────┐ |
> |  │                        1.5                                      │ |
> |  │              QuantityInput (font-mono 2xl)                      │ |
> |  └─────────────────────────────────────────────────────────────────┘ |
> |  ┌───────┬───────┬───────┐                                           |
> |  │   1   │   2   │   3   │                                           |
> |  ├───────┼───────┼───────┤                                           |
> |  │   4   │   5   │   6   │     NumericKeypad 48px keys               |
> |  ├───────┼───────┼───────┤                                           |
> |  │   7   │   8   │   9   │                                           |
> |  ├───────┼───────┼───────┤                                           |
> |  │   .   │   0   │   ⌫   │                                           |
> |  └───────┴───────┴───────┘                                           |
> +-----------------------------------------------------------------------+
> |  Unidad — UnitSelector (segmented)                                    |
> |  [ kg ]  [ pz ]  [ manojo ]  [ caja ]                                 |
> +-----------------------------------------------------------------------+
> |  Subtotal preview: $67.50                                             |
> |  [ Agregar al ticket ]  PRIMARY w-full                                |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados del componente
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Default** | Cantidad 1; unidad default del producto preseleccionada |
> | **Stepper sync** | Cambio stepper actualiza input y viceversa |
> | **Invalid qty** | Inline error "Cantidad mínima 0.25"; Agregar disabled |
> | **Submit** | Cierra sheet; línea en ticket |
>
> #### Componentes Requeridos para Frontend:
> * **QuantityStepper**, **QuantityInput**, **NumericKeypad**, **UnitSelector**.
> * Subtotal live = qty × unitPrice.
>
> #### Responsividad:
> * **Mobile:** Bottom sheet full-width.
> * **Desktop:** Modal centrado `max-w-md`.
>
> #### A11y:
> * Keypad keys con `aria-label="número N"`.
> * UnitSelector como `radiogroup`.
>
> #### Referencias:
> * Flujo: `../user-flows/UF-POS-01-mostrador.md`
> * Tokens: §6b QuantityStepper, NumericKeypad, UnitSelector
