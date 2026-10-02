# User Story — US-CAT-13

> **ID:** US-CAT-13  
> **Título:** Miniatura en la lista de catálogo proveedor  
>
> **Como:** PROVIDER  
> **Quiero:** ver una miniatura de la foto del producto en cada fila de la lista (hoy casi solo al editar)  
> **Para:** reconocer SKUs rápido al administrar el catálogo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU con imagen en disco (F10), cuando veo la lista de catálogo proveedor de la sucursal activa, entonces la fila muestra miniatura **siempre** (no depende del toggle POS `US-POS-12`). Si no hay imagen, placeholder empty de media, no layout roto.
> - [ ] **Escenario 2 (Error):** Dado URL rota o 404 de archivo, cuando renderiza la lista, entonces placeholder de error/empty en esa miniatura y el resto de la fila (nombre, precio, Activo) sigue operable.
> - [ ] **Regla de Negocio:** D-F12-9 (miniaturas lista = requisito distinto del toggle POS). Sin Cloudinary/S3. Reusar media disco F10.

>
> **UX:** thumb ≥ toque 44px útil; alt texto. **Arquitecto:** misma URL media. **QA:** con y sin foto.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **CO-F10-002:** media disco (solo lectura)
- **Backlog:** `BL-207`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-CAT-13-miniatura-lista-catalogo.md`
- **Agente Downstream:** UX/UI, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
