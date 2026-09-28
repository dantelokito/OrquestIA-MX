# User Story — US-POS-04

> **ID:** US-POS-04  
> **Título:** Cantidad por peso / unidad de medida  
>
> **Como:** PROVIDER  
> **Quiero:** capturar cantidad y unidad (kg, pza, etc.)  
> **Para:** vender a granel en mostrador  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1:** El panel cantidad usa stepper/keypad ≥48px y `UnitSelector`; el subtotal usa Decimal ROUND_HALF_UP (ADR-014).
> - [ ] **Regla de Negocio:** `UnitOfMeasure` en servidor. Sin báscula hardware (WebSerial Won't).
>
> **UX:** WF-pos-cantidad-unidad.
