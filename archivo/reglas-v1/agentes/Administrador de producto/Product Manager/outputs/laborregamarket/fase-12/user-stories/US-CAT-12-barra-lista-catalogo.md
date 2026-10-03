# User Story — US-CAT-12

> **ID:** US-CAT-12  
> **Título:** Barra dinámica en cada producto de la lista catálogo proveedor  
>
> **Como:** PROVIDER  
> **Quiero:** ver la misma barra de capacidad en cada fila de mi lista de catálogo  
> **Para:** ajustar oferta sin entrar al módulo inventario cada vez  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado el catálogo proveedor de sucursal A (`/proveedor` catálogo), cuando listo productos, entonces cada fila muestra la barra de % tope coherente con `US-INV-03` (incluido >100% si aplica). Al cambiar sucursal (N>1), las barras son las de la activa.
> - [ ] **Escenario 2 (Error / Won't vitrina):** Dado un cliente en `/fruteria/[id]`, cuando ve el catálogo público, entonces **no** hay barra, on-hand, umbral ni parciales. Dado fallo al leer capacidad, entonces la lista de catálogo sigue usable (precio/toggle) y la barra muestra error/omitida sin romper la fila.
> - [ ] **Regla de Negocio:** D-F12-12. Barra **solo** panel PROVIDER (inventario + lista catálogo). No vitrina.

>
> **UX:** barra compacta en fila CAT. **Arquitecto:** mismos datos que inventario. **QA:** `/fruteria` sin payload de stock.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **User Stories:** `US-INV-03`
- **Backlog:** `BL-206`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-CAT-12-barra-lista-catalogo.md`
- **Agente Downstream:** UX/UI, Arquitecto, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
