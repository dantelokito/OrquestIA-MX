# User Story — US-INV-04

> **ID:** US-INV-04  
> **Título:** Listado de inventario con barra, alerta y parcial Encargar  
>
> **Como:** PROVIDER  
> **Quiero:** ver en inventario todos los productos de mi catálogo de sucursal, con barra, alerta de poca existencia y el estado parcial de Encargar  
> **Para:** saber qué hay on-hand y qué está reservado en pedidos activos  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado catálogo de sucursal A (incluidos inactivos en panel, coherente con GET proveedor F10), cuando abro `/proveedor/inventario`, entonces veo cada SKU con on-hand, barra vs tope, alerta si aplica (`US-INV-03`) y cantidad **parcial/reservada** de órdenes Encargar **activas** (`OrderSource.MARKETPLACE`, status no `DELIVERED` y no `CANCELLED`). Vacío si no hay productos: empty state, no spinner eterno.
> - [ ] **Escenario 2 (Error):** Dado fallo de red o 500 del API, cuando cargo el listado, entonces veo estado Error con reintento y no invento saldos. Dado sucursal B, no aparecen SKUs ni parciales de B.
> - [ ] **Regla de Negocio:** D-F12-5 (parcial visible). Sin kardex (D-F12-10). Parcial no se muestra en `/fruteria` (D-F12-12). Completada = `DELIVERED` deja de ser parcial.

>
> **UX:** 4 estados Empty/Loading/Error/Success. **Arquitecto:** agregar on-hand + reserved. **QA:** orden activa vs DELIVERED/CANCELLED.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **User Stories:** `US-INV-03`, `US-INV-06`
- **Backlog:** `BL-203`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-INV-04-listado-barra-alerta-parcial.md`
- **Agente Downstream:** UX/UI, Arquitecto, Backend, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
