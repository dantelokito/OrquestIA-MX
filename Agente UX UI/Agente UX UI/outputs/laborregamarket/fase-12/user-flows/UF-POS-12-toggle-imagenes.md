> **Flujo:** Toggle de imágenes POS en `/proveedor` (no en toolbar POS)  
> **Historia de Usuario Asociada:** US-POS-12  
>
> **Pasos del Usuario:**
> 1. `[ /proveedor ]` -> Junto a las listas de secciones (toolbar de catálogo, no POS), ve pregunta extra: «Mostrar fotos en el POS» + switch ≥44px. Default **ON** si la sucursal nunca configuró.
> 2. `[POS]` -> Cards muestran imagen (o placeholder) según el valor de la sucursal activa. **No** hay interruptor en esta pantalla.
> 3. `[Apagar en catálogo]` -> Persistencia por sucursal. Al recargar, A conserva OFF. Sucursal B default ON si nunca tocó el control.
> 4. `[Error persistir]` -> Toast/alerta recuperable «No se guardó la preferencia»; el switch vuelve al último valor conocido (no default silencioso). Miniaturas CAT no cambian.

## Inputs Utilizados

- **US:** `US-POS-12`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-POS-12-toggle-imagenes.md`
- **Wireframe:** `WF-POS-12-cards-toggle.md`
