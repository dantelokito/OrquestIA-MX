# User Story — US-EXPLORE-11

> **ID:** US-EXPLORE-11  
> **Título:** Explorar muestra una tarjeta por cada Provider  
>
> **Como:** CLIENT en Explorar  
> **Quiero:** ver cada sucursal como un negocio distinto  
> **Para:** encargar a la ubicación correcta (El Paraíso aparece dos veces)  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado seed F11, cuando listo `/explorar` (y el mapa), entonces hay una card/pin por `Provider`: dos de El Paraíso (Centro y Tecnológico) con nombres y coords distintas, más Campo Verde. Cada card abre `/fruteria/[id]` de **ese** id.
> - [ ] **Escenario 2 (Filtros / vacío):** Dado filtros F9 (mayoreo, domicilio, radio), cuando aplico, entonces filtran **por sucursal**, no por dueño. Si ninguna sucursal cumple, empty F9/F2 (sin inventar chips de sección).
> - [ ] **Regla de Negocio:** D-F11-1. No fusionar sucursales del mismo user. No reabrir FilterBar F9. SKU local de A no es comparable en B.

>
> **UX:** cards existentes; copy de nombre = `businessName`. **Arquitecto:** listing ya es por `Provider`. **QA:** dos cards El Paraíso.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **Seed:** `outputs/laborregamarket/fase-11/seed-demo.md`
- **Backlog:** `BL-197`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-EXPLORE-11-tarjeta-por-provider.md`
- **Agente Downstream:** UX/UI, Frontend, Backend
- **Fase / Proyecto:** 11 / laborregamarket
