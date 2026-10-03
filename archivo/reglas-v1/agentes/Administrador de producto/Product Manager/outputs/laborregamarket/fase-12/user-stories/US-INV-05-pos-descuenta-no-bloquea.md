# User Story — US-INV-05

> **ID:** US-INV-05  
> **Título:** POS descuenta al cobrar y no bloquea por existencias  
>
> **Como:** PROVIDER  
> **Quiero:** que al cobrar en POS se descuente el on-hand de la sucursal activa, incluso si el saldo es 0 o negativo  
> **Para:** vender siempre y que el inventario sea ayuda administrativa, no un candado  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU vendible (`isAvailable=true`) con on-hand 5 (o 0, o negativo), cuando cobro N unidades/kg en POS de la sucursal activa, entonces la venta **se completa** y el on-hand disminuye en N (puede quedar negativo). Líneas libres POS (ADR-013) no exigen fila de inventario.
> - [ ] **Escenario 2 (Error no-stock):** Dado on-hand 0 o desactualizado, cuando cobro, entonces **no** hay 400/403/409 por stock. Si el producto está inhabilitado (`isAvailable=false`), entonces sigue **409** “Producto no disponible” (ADR-022), no un error de existencias.
> - [ ] **Regla de Negocio:** D-F12-4, D-F12-5 (POS descuenta al cobrar). Stock **no** es `isAvailable`. Inventario blando.

>
> **UX:** POS no muestra bloqueo de stock Must. **Arquitecto:** comando de venta nunca 4xx por saldo. **QA:** cobro con 0 y negativo.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **ADR-022:** catálogo inactivo ≠ stock
- **Backlog:** `BL-204`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-INV-05-pos-descuenta-no-bloquea.md`
- **Agente Downstream:** Arquitecto, Backend, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
