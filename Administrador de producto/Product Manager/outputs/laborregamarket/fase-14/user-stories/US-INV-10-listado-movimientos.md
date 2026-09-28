# User Story — US-INV-10

> **ID:** US-INV-10  
> **Título:** Sub-pestaña/listado Movimientos: entradas + mermas + ajustes (sin ventas)  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** ver en Inventario un listado de **entradas**, **mermas** y **ajustes** de mi sucursal, filtrable por tipo y fechas  
> **Para:** auditar cargas y bajas que yo registré, sin un kardex de cada cobro POS o entrega Encargar  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que registré entradas F13, una merma `US-INV-08` y un ajuste `US-INV-09`, cuando abro Inventario → **Movimientos** (sub-pestaña o sección equivalente, decisión UX), entonces veo esas filas (fecha, SKU, tipo `ENTRADA`|`MERMA`|`AJUSTE`, cantidad/delta, motivo si merma, nota, saldo resultante si el modelo lo guarda). Filtros: tipo y rango `from`/`to`. Default: sucursal activa, página acotada (Arquitecto: page/limit). Empty si aún no hay movimientos de esos tipos.
> - [ ] **Escenario 2 (Validación/Error):** Dado N sucursales, cuando listo Movimientos, entonces **no** aparecen filas de la sucursal B (IDOR **403** si se fuerza `providerId` ajeno). CLIENT → 403. Fallo API: Error recuperable, no tabla inventada. Filtro `from > to` → **400**. El listado **no** incluye ventas POS, entregas `DELIVERED` ni el descarte `US-INV-07` (ese descarte sigue sin fila; F14 no lo rediseña).
> - [ ] **Regla de Negocio:** D-F14-10, D-F14-13, D-F14-16. Esto **no** es kardex completo: faltan a propósito VENTA_POS y ENTREGA_PEDIDO. El reporte de inventario F13 (`US-DASH-12`: actual + entradas) **sigue**; Movimientos añade merma/ajuste en Inventario. Envelope ADR-003. Paginación Must (sin volcar 366 días en un HTML).

>
> **UX:** 4 estados; filtros visibles; no copy que prometa «todas las ventas». **Arquitecto:** GET listado; mismos tipos persistidos en 08/09 + entradas. **QA:** aislamiento F11; ausencia de filas POS; paginación.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §3.4 (alcance recortado)
- **US:** `US-DASH-12` (entradas en Reportes, intacto), `US-INV-08`, `US-INV-09`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-INV-10-listado-movimientos.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
