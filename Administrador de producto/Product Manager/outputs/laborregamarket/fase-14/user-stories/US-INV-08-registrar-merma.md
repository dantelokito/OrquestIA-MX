# User Story — US-INV-08

> **ID:** US-INV-08  
> **Título:** Registrar merma con motivo; 400 si dejaría on_hand negativo  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** registrar una merma de un SKU (cantidad, motivo de lista, nota opcional) y que quede un movimiento persistido  
> **Para:** medir pérdida de fresco sin fingir una «entrada negativa» ni tocar el cobro del POS  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un `ProviderProduct` de la sucursal activa con `onHand = 10` (unidad de venta de la oferta o fallback maestro), cuando registro merma de cantidad **5** (> 0) con motivo `CADUCIDAD`|`DANO`|`ROBO`|`MUESTRA`|`OTRO` y nota opcional (texto acotado por contrato), entonces `onHand` queda **5**, se **inserta** un movimiento de tipo merma (delta −5, saldo resultante 5, motivo, nota, timestamp) y el listado `US-INV-10` lo muestra. El flujo es simétrico en captura a `StockEntrySheet` (cantidad > 0, SKU explícito). POS, Encargar y `decrementOnHandForLines` **no** se modifican.
> - [ ] **Escenario 2 (Validación/Error):** Dado `onHand = 3`, cuando pido merma de **4** (o cualquier cantidad que dejaría saldo < 0), entonces **400**, código de error de negocio documentado (ej. `INVENTORY_NEGATIVE_NOT_ALLOWED`), **sin** mutar `onHand` y **sin** fila de movimiento. Cantidad ≤ 0, motivo ausente o fuera del enum, SKU archivado/inexistente o de otra sucursal → **400/403/404** según el caso, sin merma. `onHand = 0` → cualquier merma > 0 es **400**. Sin auth PROVIDER → 401/403.
> - [ ] **Regla de Negocio:** D-F14-10, D-F14-11, D-F14-12, D-F14-16, D-F14-21. Merma **no puede** dejar `on_hand` negativo. Ventas POS **sí** pueden (ADR-022); son dos políticas a propósito. PM propone enum de motivo; Arquitecto nombra la tabla (`InventoryEntry` extendido vs `InventoryMovement` solo para estos tipos). **No** instrumentar POS ni `DELIVERED`. **No** rediseñar `confirmDiscard` (`US-INV-07`). Envelope ADR-003. IDOR F11.

>
> **UX:** sheet «Registrar merma» desde Inventario; select de motivo + nota; error 400 accionable («la cantidad supera el saldo»). **Arquitecto:** persistencia aditiva; no kardex de ventas. **QA:** 400 overflow; motivo OTRO + nota; IDOR; POS sigue cobrando con saldo 0.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §3 (alcance **recortado**: no kardex completo)
- **US previa:** `US-INV-02` (entrada), `US-INV-07` (descarte, no reabrir)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-INV-08-registrar-merma.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
