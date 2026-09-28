# User Story — US-CAT-20

> **ID:** US-CAT-20  
> **Título:** Historial de cambios de precio de la oferta  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** ver cuándo cambié el precio de un producto en **mi** catálogo (precio anterior → nuevo)  
> **Para:** no depender solo del reporte de ventas si el precio de lista cambia seguido  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que cambio el precio de una oferta (`US-CAT-19`), cuando consulto el historial de **esa** oferta, entonces veo al menos: fecha/hora (TZ America/Monterrey), precio anterior, precio nuevo. La primera asignación (de vacío/null a un precio) también queda registrada. El historial es **por sucursal** (`providerProductId`). No aparece en el reporte de ventas como sustituto de `OrderItem`.
> - [ ] **Escenario 2 (Validación/Error):** Dado un `providerProductId` de otra sucursal o ajeno, cuando pido el historial, entonces **403/404**. Lista vacía si nunca hubo cambio: empty, no error. Fallo al persistir el cambio de precio: **no** se guarda precio nuevo sin rastro (transacción).
> - [ ] **Regla de Negocio:** D-F13-18, D-F13-22. Esto **no** es GMV. Arquitecto elige tabla `PriceHistory` (o equivalente) vs AUDIT estructurado; Must = consultable en UI de catálogo o ficha, no solo logs crudos. Envelope ADR-003.

>
> **UX:** acceso desde la fila o ficha (lista corta, más recientes primero). **Arquitecto:** persistencia por oferta. **QA:** A vs B; primera asignación; IDOR.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-CAT-19`, `US-DASH-10`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-CAT-20-historial-precio.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
