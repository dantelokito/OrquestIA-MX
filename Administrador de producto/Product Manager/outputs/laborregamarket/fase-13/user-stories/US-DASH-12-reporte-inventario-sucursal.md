# User Story — US-DASH-12

> **ID:** US-DASH-12  
> **Título:** Reporte de inventario del negocio (actual + entradas)  
>
> **Como:** PROVIDER en Reportes de `/proveedor/dashboard` (sucursal activa)  
> **Quiero:** una pestaña/vista de inventario junto a la de ventas, con el saldo **ahora** y las **entradas/cargas** que yo registré  
> **Para:** revisar existencias y qué se dio de alta en almacén, sin un kardex de cada venta  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado la sucursal activa, cuando abro Reportes → Inventario, entonces veo (1) tabla de **inventario actual** (SKU, **unidad de venta de la oferta** o fallback al maestro, on-hand, tope si existe) y (2) listado de **entradas** (fecha, SKU, cantidad capturada, si fue caja, delta en unidad de catálogo). Puedo imprimir esa vista (`US-DASH-09` mismo patrón). Cada `addInventoryEntry` **persiste** una fila de entrada además de sumar `onHand`. Tras un descarte `US-INV-07`, el saldo **actual** muestra **0** y **no** aparece una fila de entrada por ese descarte. Entradas posteriores a F13 aparecen; las cargas F12 previas **no** se reconstruyen (empty histórico hasta el go-live).
> - [ ] **Escenario 2 (Validación/Error):** Dado N=1 o N>1, el reporte de **esta** pestaña es **solo** la sucursal activa (no mezcla B). CLIENT u otro PROVIDER → **403**. Sin entradas: empty de historial, saldos actuales igual se muestran (pueden ser 0). Fallo API: error recuperable, no tabla inventada.
> - [ ] **Regla de Negocio:** D-F13-19, D-F13-21. **No** kardex: no listar POS, Encargar, ni descarte `US-INV-07`. Envelope ADR-003. Rango de fechas del historial de entradas: Arquitecto (default: mismo `from`/`to` de reportes F10 o «todas»; Must documentar).

>
> **UX:** pestaña Inventario junto a Ventas; 4 estados; print. **Arquitecto:** modelo `InventoryEntry` (o equivalente). **QA:** persistir entrada; IDOR; print; no backfill.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-DASH-07` … `09`, `US-INV-02`
- **Código hoy:** `addInventoryEntry` solo hace `onHand.increment`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-DASH-12-reporte-inventario-sucursal.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
