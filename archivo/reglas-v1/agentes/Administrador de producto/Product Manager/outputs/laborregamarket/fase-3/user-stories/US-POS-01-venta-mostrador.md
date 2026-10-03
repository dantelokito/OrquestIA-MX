# User Story — US-POS-01

> **ID:** US-POS-01  
> **Título:** Venta de mostrador  
>
> **Como:** PROVIDER  
> **Quiero:** cobrar en `/proveedor/pos` contra mi catálogo  
> **Para:** registrar la venta en el mismo sistema que los pedidos online  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado catálogo con productos activos y ticket con ítems + método de pago, cuando pulso Cobrar, entonces `POST /api/provider/pos/sales` registra la venta (`source=POS`).
> - [ ] **Escenario 2:** Dado ticket vacío o sin método de pago, entonces Cobrar disabled o error inline.
> - [ ] **Regla de Negocio:** `clientId` nullable + `customerName` (ADR-009). Idempotency-Key. Sin pasarela.
>
> **UX:** UF-POS-01, WF-pos-mostrador. **Contrato:** API-POS-01.
