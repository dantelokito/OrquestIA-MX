> **Flujo:** Registrar merma de un SKU con motivo; 400 si superaría el saldo
> **Historia de Usuario Asociada:** US-INV-08
>
> **Punto de entrada:** `/proveedor/inventario` pestaña **Existencias** → acción secundaria **Registrar merma** en la fila/card. CTA del sheet: **Registrar merma**.

> **Pasos del Usuario:**
> 1. `[Existencias]` → Por SKU de la sucursal activa: **Registrar entrada** sigue siendo el CTA dominante de la fila. **Registrar merma** y **Ajuste por conteo** son Secondary/Ghost `min-h-11`.
> 2. `[Sheet merma]` → Patrón `StockEntrySheet`: título «Registrar merma», SKU + unidad de venta, **saldo actual** (solo lectura), cantidad > 0, select de motivo obligatorio, nota opcional.
> 3. `[Motivos]` → Caducidad (`CADUCIDAD`), Daño (`DANO`), Robo (`ROBO`), Muestra (`MUESTRA`), Otro (`OTRO`). Nota nunca sustituye al enum.
> 4. `[Condicional — cantidad válida y ≤ saldo]` → `onHand` baja; se persiste movimiento MERMA. Sheet cierra. Listado Movimientos (`UF-INV-10`) muestra la fila.
> 5. `[Condicional — cantidad > saldo, ≤ 0, motivo ausente, onHand = 0]` → Error **visible en el sheet** (no solo toast): «La cantidad supera el saldo (3 KG). No se registró merma.» o equivalente 400. Sin mutación. POS **no** se bloquea por esto.
> 6. `[SKU archivado / otra sucursal]` → 403/404; sheet no finge éxito.

> **Reglas UI:**
> - Móvil: sheet full-screen, no aplastado; CTA `w-full min-h-11`. Desktop: drawer ~400px (igual entrada F12).
> - Copy: esto **no** es una venta POS. No mencionar kardex de cobros.
> - 4 estados del sheet: Empty (cantidad vacía), Loading (busy submit), Error 400/red, Success (cierra + saldo actualizado).
> - No rediseñar `US-INV-07` (descarte unidad).
> - Wireframe: `WF-INV-08-merma.md`.

## Inputs Utilizados

- **US:** `US-INV-08-registrar-merma.md`
- **UI hoy:** `StockEntrySheet` (entrada positiva)
- **PRD:** D-F14-10, D-F14-11, D-F14-12

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-INV-08-registrar-merma.md`
- **Agente Downstream:** Frontend Developer (tras contrato Arch de merma)
