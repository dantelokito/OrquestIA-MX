# User Story — US-ISO-01

> **ID:** US-ISO-01  
> **Título:** Catálogo, media, POS, pedidos y reportes F10 aislados por sucursal activa  
>
> **Como:** PROVIDER  
> **Quiero:** que cada frutería tenga su propio inventario, secciones, imágenes, mostrador, pedidos y reportes F10  
> **Para:** no mezclar stock ni ventas entre sucursales  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso por activa):** Dado `activeProviderId` = sucursal A, cuando uso catálogo local, secciones, upload disco, POS, Encargar del panel o Reportes F10 (`US-DASH-07`…`09`), entonces solo leo/escribo datos de A. Un SKU local de A no aparece en B ni como comparable en Explorar de B.
> - [ ] **Escenario 2 (Error IDOR):** Dado sucursal A activa, cuando envío un `providerId`/id de producto/media/pedido de sucursal B (mismo user) o de otro dueño, entonces **403** y no hay mutación. Cliente en `/fruteria/[id]` de A encarga solo a A.
> - [ ] **Regla de Negocio:** D-F11-1. Sin catálogo compartido. F10 no se reabre: se **repite por sucursal**. N=1 no altera estas pantallas.

>
> **UX:** mismos WF F10 con contexto de sucursal en título. **Arquitecto:** ownership en cada ruta. **QA:** cruzar ids A↔B del mismo email.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-11/impacto-modulos.md`
- **User Stories F10 (solo lectura):** `US-CAT-02`, `US-CAT-03`, `US-MEDIA-06`, `US-DASH-07`…`09`
- **Backlog:** `BL-192`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-ISO-01-aislamiento-sucursal.md`
- **Agente Downstream:** Backend, Frontend, QA
- **Fase / Proyecto:** 11 / laborregamarket
