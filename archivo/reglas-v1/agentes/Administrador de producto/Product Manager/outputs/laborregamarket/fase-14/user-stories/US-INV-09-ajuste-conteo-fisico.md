# User Story — US-INV-09

> **ID:** US-INV-09  
> **Título:** Ajuste por conteo físico (saldo resultante ≥ 0)  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** capturar el saldo **contado** en piso y que el sistema deje `on_hand` igual a ese conteo, con un movimiento de ajuste  
> **Para:** corregir diferencias sin registrar una entrada falsa ni una merma inventada  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU de la sucursal activa con `onHand = 8`, cuando capturo conteo físico **5** (≥ 0), entonces `onHand` queda **5**, se persiste un movimiento `AJUSTE` con `signedDelta = −3` (o equivalente) y `onHandAfter = 5`. Si el conteo es **12**, `onHand` queda **12** y el delta es **+4**. El saldo resultante es **siempre** el conteo, nunca un cálculo que el usuario tenga que hacer a mano. El movimiento aparece en `US-INV-10`.
> - [ ] **Escenario 2 (Validación/Error):** Dado cualquier SKU, cuando envío conteo **< 0**, entonces **400** y `onHand` no cambia. Un payload que omita el conteo o mande NaN → **400**. SKU de otra sucursal / archivado / inexistente → **403/404**. Sin auth → 401/403. El conteo **0** es válido (deja saldo 0; no es 400). No se permite un delta que el servidor resuelva a saldo negativo: si por carrera el cálculo daría < 0, **400** (misma política que merma).
> - [ ] **Regla de Negocio:** D-F14-10, D-F14-11, D-F14-16, D-F14-21. Conteo físico ≥ 0. Saldo resultante = conteo, **nunca** negativo. POS puede seguir dejando negativo **después** por ventas; este flujo no. No es `addInventoryEntry` de F13 (eso suma cantidad recibida; esto **fija** el saldo). No toca `decrementOnHandForLines`. Envelope ADR-003. IDOR F11.

>
> **UX:** sheet «Ajuste por conteo»: muestra saldo sistema vs campo conteo; confirma delta antes de guardar. **Arquitecto:** un endpoint de ajuste; transacción saldo + fila. **QA:** conteo 0; conteo mayor; conteo negativo 400; IDOR.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §3.4
- **US:** `US-INV-08`, `US-INV-02`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-INV-09-ajuste-conteo-fisico.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
