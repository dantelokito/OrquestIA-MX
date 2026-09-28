# User Story — US-INV-07

> **ID:** US-INV-07  
> **Título:** Cambiar unidad o factor caja descarta inventario o se bloquea si hay Encargar activo  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** que, si edito la unidad de venta o el factor caja de un producto que ya tiene existencias (GLOBAL u oferta LOCAL), el sistema me avise que el inventario se va a descartar (y que eso afecta POS, Encargar e inventario); y que no me deje cambiar si aún hay encargos a medias  
> **Para:** no mezclar kilos con cajas en el mismo saldo ni romper reservas de Encargar  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU de la sucursal activa **sin** encargos activos (Marketplace no `DELIVERED` y no `CANCELLED`) y con `onHand` distinto de 0, cuando cambio **unidad** (LOCAL: `Product.unit`; GLOBAL: unidad **de mi oferta**) o **factor caja** y confirmo la alerta («el inventario actual se descarta; conviene dar de alta un producto nuevo si cambió el formato de venta; afecta POS, Encargar e inventario»), entonces se guardan unidad/factor nuevos y `onHand` queda **0**. El descarte **no** inserta fila de entrada (`US-DASH-12` muestra saldo 0, historial de entradas intacto). Puedo seguir vendiendo en POS/Encargar con la unidad nueva y saldo 0 (inventario blando D-F12-4). La alerta aparece si edito desde el drawer de catálogo **o** desde la ficha de inventario. Otras sucursales no se tocan.
> - [ ] **Escenario 2 (Validación/Error):** Dado al menos un encargo **activo** con líneas de ese `providerProductId`, cuando intento cambiar unidad o factor (con o sin existencias), entonces **no** se muta nada: **409** (o equivalente) y mensaje «completa o cancela los encargos de este producto antes de cambiar la unidad o el factor». Cancelar Encargar no es automático. Dado on-hand 0 y sin encargos activos, cuando cambio unidad/factor, entonces se guarda **sin** descarte (no hay alerta de inventario, o es no-op). Dado que cancelo el diálogo de alerta, entonces no hay mutación. **Ocultar** el producto (`US-CAT-14`) **no** usa este 409: ocultar con Encargar activo está permitido (D-F13-24).
> - [ ] **Regla de Negocio:** D-F13-14, D-F13-16, D-F13-15. No kardex. No reescribir `OrderItem` de pedidos ya hechos (unidad/precio snapshot). IDOR: 403 si el SKU es de otra sucursal. Envelope ADR-003.

>
> **UX:** modal de alerta (no toast fugaz); CTA confirmar vs cancelar; copy de bloqueo con Encargar. **Arquitecto:** transacción PATCH unidad/factor de **oferta** (GLOBAL) o LOCAL + on-hand 0; chequeo de órdenes activas; no fila de entrada por descarte. **QA:** bloqueo con parcial; descarte con on-hand GLOBAL y LOCAL; no-op con 0; POS sigue cobrando tras el 0; reportes inventario sin línea de descarte.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-CAT-18`, `US-INV-02`, `US-INV-06` (reserva Encargar), `US-DASH-12`, `US-CAT-14`
- **Código hoy:** cambio de unidad LOCAL sin alerta; factor solo en `InventorySkuSheet`; Editar GLOBAL no existe

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-INV-07-cambio-unidad-descarta-inventario.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
