# User Story — US-INV-06

> **ID:** US-INV-06  
> **Título:** Encargar reserva, commit en DELIVERED y restore en CANCELLED  
>
> **Como:** PROVIDER  
> **Quiero:** que un Encargar activo reserve cantidad visible, que al completar se descuente de verdad y que al cancelar se reponga  
> **Para:** ver qué está comprometido sin impedir que el cliente pida  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un cliente que Encarga cantidad Q de un SKU de sucursal A (`OrderSource.MARKETPLACE`), cuando el pedido queda **activo** (PENDING, CONFIRMED o IN_TRANSIT), entonces inventario muestra Q en parcial/reservado. Cuando pasa a `DELIVERED`, entonces el on-hand se descuenta en absoluto (commit) y Q deja de ser parcial. Cuando pasa a `CANCELLED` **antes** de entregar, entonces se **repone** (sale del parcial; on-hand no pierde esa Q por commit) y deja de ser parcial.
> - [ ] **Escenario 2 (Error no-stock):** Dado on-hand 0 o negativo, cuando el cliente crea Encargar, entonces el pedido **sí se crea** (sin 4xx por stock). Si el SKU no está `isAvailable`, entonces 409 ADR-022. IDOR pedido de sucursal B con A activa = **403**.
> - [ ] **Regla de Negocio:** D-F12-4, D-F12-5. Completada = `DELIVERED`. Activas Encargar = Marketplace y no DELIVERED y no CANCELLED. Sin kardex Must.

>
> **UX:** indicador parcial en inventario (`US-INV-04`). **Arquitecto:** transiciones de status. **QA:** crear/entregar/cancelar con stock 0.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **User Stories:** `US-INV-04`
- **Backlog:** `BL-205`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-INV-06-encargar-reserva-commit-restore.md`
- **Agente Downstream:** Arquitecto, Backend, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
