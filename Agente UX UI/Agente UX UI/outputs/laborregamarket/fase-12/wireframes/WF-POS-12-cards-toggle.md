> **Pantalla:** Cards POS + control de fotos en catálogo  
> **Objetivo Principal:** Identificar producto en mostrador o aligerar cards  
> **Flujo:** UF-POS-12

### Control (solo `/proveedor`)

```text
| Junto a secciones / CTAs Agregar producto:                                        |
|  Mostrar fotos en el POS                                                          |
|  [ switch ON ]  min-h-11 min-w-11                                                 |
|  Hint: «Aplica al mostrador de esta frutería. Las miniaturas de esta lista        |
|  no se apagan.»                                                                   |
```

Default ON. Persistido por sucursal activa. Error: alerta `role="alert"` «No se guardó la preferencia» + revert visual.

### Card POS con imágenes ON

```text
+------------------+
| [img 16:9 / ph]  |
| Chile del rancho |
| $38.50  · pza    |
+------------------+
```

### Card POS con imágenes OFF

```text
+------------------+
| Chile del rancho |
| $38.50  · pza    |
| (sin slot img)   |
+------------------+
```

**Prohibido:** colocar el switch en toolbar POS, ticket o keypad.

#### Componentes Requeridos para Frontend:

* **PosImagesToggle** en página catálogo.
* **PosProductCard** slot imagen condicional. Placeholder mismo patrón media F10.

## Inputs Utilizados

- **US-POS-12**

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-POS-12-cards-toggle.md`
