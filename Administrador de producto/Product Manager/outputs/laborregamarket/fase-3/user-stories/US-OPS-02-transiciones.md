# User Story — US-OPS-02

> **ID:** US-OPS-02  
> **Título:** Transiciones de estado de orden  
>
> **Como:** PROVIDER  
> **Quiero:** Confirmar → Listo para recoger → Entregado  
> **Para:** cumplir el pedido  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1:** PENDING → CONFIRMED; CONFIRMED → IN_TRANSIT (copy **"Listo para recoger"**); IN_TRANSIT → COMPLETED (pasa a Historial).
> - [ ] **Escenario 2:** Transición inválida → toast/409; la card no cambia.
> - [ ] **Regla de Negocio:** Máquina de estados en servidor. Enum `IN_TRANSIT` no se renombra.
