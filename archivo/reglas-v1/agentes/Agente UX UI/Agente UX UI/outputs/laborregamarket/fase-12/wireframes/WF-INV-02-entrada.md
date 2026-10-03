> **Pantalla:** Sheet Registrar entrada  
> **Objetivo Principal:** Sumar on-hand en unidad de catálogo (CTA único)  
> **Flujo:** UF-INV-02

```text
+------------------------------------------+
|  Registrar entrada                  [✕]  |
|  Mango Ataulfo · KG                      |
+------------------------------------------+
|  Unidad (catálogo)                       |
|  KG                          (solo lectura)
|  Cantidad *                              |
|  [ 12.5                              ]   |
|  Hint: se suma al saldo actual (puede    |
|  estar mal o negativo).                  |
|  (si aplica caja→kg)                     |
|  «1 caja = 12 kg»  [ Editar ficha → ]    |
|  (factor NO se pide aquí)                |
+------------------------------------------+
|  [ Registrar entrada ]  ← único primary  |
+------------------------------------------+
```

Móvil: sheet full-screen, CTA `w-full min-h-11`. Desktop: drawer ~400px.

Validación: vacío / ≤0 / no numérico → `border-error` + «Indica una cantidad mayor que cero».

#### Componentes Requeridos para Frontend:

* **StockEntrySheet:** formulario cantidad + unidad read-only.
* **BoxFactorHint:** solo si la oferta tiene factor caja; enlace secundario a ficha.

## Inputs Utilizados

- **US-INV-02**

## Outputs Generados

- **Archivo:** `fase-12/wireframes/WF-INV-02-entrada.md`
