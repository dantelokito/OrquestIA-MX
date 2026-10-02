> **Pantalla:** Ficha inventario (tope, umbral, alerta, factor caja)  
> **Objetivo Principal:** Configurar capacidad sin bloquear cargas  
> **Flujo:** UF-INV-03, UF-INV-02 (factor)

```text
+------------------------------------------+
|  Ficha de existencias               [✕]  |
|  Chile del rancho · PIEZA                |
+------------------------------------------+
|  Tope / capacidad *                      |
|  [ 100                               ]   |
|  Umbral de alerta (%)                    |
|  [ 10  ]  default primera vez = 10       |
|  [●] Alerta de poca existencia           |
|      (apagado: nunca muestra badge)      |
|  Factor caja (si vende kg/pieza)         |
|  1 caja = [ 12 ] kg                      |
|  Hint: fijo en esta sucursal; no por     |
|  cada carga. Sin receta/BOM.             |
+------------------------------------------+
|  [ Guardar ficha ]  ← único primary      |
+------------------------------------------+
```

Tope inválido (vacío, 0, negativo): no persiste. Superar tope **no** se valida como error.

#### Componentes Requeridos para Frontend:

* **InventorySkuSheet:** campos tope, umbral, `AlertToggle`, `BoxFactorField`.
* **AlertToggle:** switch `min-h-11 min-w-11`; label visible.

## Inputs Utilizados

- **US-INV-03**, **US-INV-02**

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-INV-03-ficha-capacidad.md`
