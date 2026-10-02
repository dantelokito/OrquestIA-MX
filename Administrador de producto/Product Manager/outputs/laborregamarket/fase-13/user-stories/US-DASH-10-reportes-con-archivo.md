# User Story — US-DASH-10

> **ID:** US-DASH-10  
> **Título:** Reportes cuadran aunque el producto esté oculto o el SKU inactivo  
>
> **Como:** PROVIDER (reportes de sucursal y, si N>1, reportes generales)  
> **Quiero:** que GMV, top productos, series y la vista imprimible/PDF sigan cuadrando con pedidos históricos  
> **Para:** no perder venta ya cobrada cuando oculto un ítem o el admin inhabilita el SKU  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un `OrderItem` de un producto que después oculté (`archivedAt`) o cuyo SKU quedó `isActive=false`, cuando abro reportes de la sucursal (rango F10) o reportes generales (N>1, F11), entonces GMV, top, series y print/PDF **incluyen** esa línea con el `itemName` / `unitPrice` / `subtotal` snapshot. No desaparece el SKU del corte histórico. El ranking de «catálogo vigente» (si existe) puede excluir no vendibles; **los KPIs de ventas del rango no se reescriben**.
> - [ ] **Escenario 2 (Validación/Error):** Dado un JOIN a `products` activos que omitiría la línea, cuando se calcula el reporte, entonces **no** se usa ese JOIN como filtro obligatorio. Fallo al leer un producto maestro borrado-lógicamente: el reporte **igual** muestra el snapshot. Sin auth o sucursal ajena → **401/403**. Rango inválido → **400** (ADR-033 intacto).
> - [ ] **Regla de Negocio:** D-F13-11. `OrderItem` no se reescribe al ocultar, inhabilitar **ni** al cambiar el precio de catálogo de la oferta (`US-CAT-19`). Envelope ADR-003.

>
> **UX:** sin cambio de layout Must; los números no «se evaporan». **Arquitecto:** consultas de reporte sobre `OrderItem`. **QA:** corte con ítem oculto e ítem SKU inactivo vs baseline F10/F11.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-DASH-07` … `09` (F10), `US-DASH-11` (F11)
- **ADR:** ADR-022 (KPIs históricos no se reescriben), ADR-033, ADR-035

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-DASH-10-reportes-con-archivo.md`
- **Agente Downstream:** Arquitecto, Backend, Frontend, QA
