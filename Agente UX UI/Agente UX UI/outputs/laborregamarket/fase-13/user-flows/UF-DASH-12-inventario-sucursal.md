> **Flujo:** Pestaña Inventario en Reportes de la sucursal (actual + entradas)
> **Historia de Usuario Asociada:** US-DASH-12
>
> **Punto de entrada:** `/proveedor/dashboard` → vista Reportes → pestaña **Inventario** junto a **Ventas**. Solo sucursal activa.

> **Pasos del Usuario:**
> 1. `[Switch pestañas]` → Ventas (F10 intacto) | **Inventario** (F13). CTA documento: **Imprimir** (secondary, patrón `US-DASH-09`).
> 2. `[Tabla actual]` → SKU, unidad de venta (oferta o fallback maestro), on-hand, tope si existe. Ocultos no aparecen.
> 3. `[Tabla entradas]` → Fecha, SKU, cantidad capturada, si fue caja, delta en unidad de catálogo. Sin POS/Encargar/descarte (no kardex). Sin backfill F12: empty histórico hasta go-live F13.
> 4. `[Tras US-INV-07]` → Saldo actual 0; **cero** fila nueva de entrada por el descarte.
> 5. `[Cuatro estados]` → Empty (sin SKU / sin entradas — copy distinto), Loading skeleton, Error recuperable, Success.
> 6. `[403]` → CLIENT u otro PROVIDER.
>
> **Reglas UI:** Look panel proveedor, no slate analytics. Rango de entradas: el que fije Arquitecto (documentar en UI si es `from`/`to` F10 o «todas»). Wireframe: `WF-DASH-12-inventario-sucursal.md`.

## Inputs Utilizados

- **US:** `US-DASH-12`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-DASH-12-inventario-sucursal.md`
