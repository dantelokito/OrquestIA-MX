> **Flujo:** Conectar báscula digital y autollenar peso en POS
> **Historia de Usuario Asociada:** US-POS-05, US-POS-06
>
> **Punto de entrada:** `/proveedor/pos` (flujo F3 vigente) → línea activa con unidad KG/GR
>
> **Pasos del Usuario:**
> 1. `[Pantalla: POS]` → `ScaleStatusBadge` en el header del ticket: **Desconectada** por defecto. CTA **Conectar báscula**.
> 2. `[Picker WebSerial/WebHID]` → El navegador pide autorizar el puerto. Si el modelo está en el registro (VID/PID), se selecciona el driver **sin diálogo extra**.
> 3. `[Lectura]` → El peso llena `quantity` de la línea activa (KG/GR). El valor sigue **editable** (QuantityInput / keypad F3).
> 4. `[Modelo desconocido]` → Modal selector de modelos soportados → se guarda en `localStorage` para la próxima vez.
> 5. `[Preferencia recordada]` → Reconexión usa el modelo guardado salvo que falle la lectura.
>
> **Condicionales:**
> - **Navegador sin WebSerial/WebHID:** → Banner info "Este navegador no conecta básculas. Captura el peso a mano." POS F3 intacto; CTA Conectar `disabled` con tooltip.
> - **Desconexión a media venta:** → Badge **Desconectada** + toast; se puede reconectar o seguir manual.
> - **Fallo de lectura / parser:** → Error inline "No leímos el peso. Elige el modelo o captura a mano" + abrir selector.
> - **Unidad PIEZA/MANOJO/CAJA:** → Lectura de báscula ignorada; hint "La báscula aplica a kg/g".
> - **Loading conectar:** → Spinner en CTA; badge "Conectando…".
>
> **Reglas UI:**
> - CTA dominante de cobro sigue siendo **Cobrar** (F3). **Conectar báscula** es secondary en el ticket.
> - `ScaleStatusBadge`: texto + icono (nunca solo color): Conectada / Desconectada / Conectando.
> - No persistir datos del periférico en la orden; solo `quantity`.
> - Wireframe: `WF-pos-bascula.md`. Base: `UF-POS-01-mostrador.md`, `WF-pos-mostrador.md`.
>
> **API esperada:**
> - Ninguna API de servidor para el periférico. Registro de drivers: `drivers/registry.ts` (Arquitecto/FE).
> - `POST /api/pos/sales` sin cambios de contrato (quantity ya existente).
