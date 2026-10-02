# User Story — US-POS-03

> **ID:** US-POS-03  
> **Título:** Línea libre / venta rápida fuera de catálogo  
>
> **Como:** PROVIDER  
> **Quiero:** cobrar un ítem que no está en el catálogo  
> **Para:** no bloquear la venta de mostrador  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1:** Dado modal Venta rápida con `customItem`/`itemName`, cuando cobro, entonces la línea tiene FKs nulos (ADR-013) y badge "Venta rápida" (texto + icono).
> - [ ] **Escenario 2:** Dado `POST /api/orders` marketplace con `customItem`, entonces 400 — XOR solo en POS.
> - [ ] **Regla de Negocio:** Marketplace rechaza línea libre.
>
> **QA:** TC-ORD-009. **FE:** QuickSaleModal.
