# User Story — US-POS-12

> **ID:** US-POS-12  
> **Título:** Imágenes en card POS y toggle persistido por sucursal  
>
> **Como:** PROVIDER  
> **Quiero:** ver la foto en la card del POS y un interruptor en la parte superior del catálogo `/proveedor` (junto a las listas de secciones) que recuerde mi preferencia por sucursal, encendido por defecto  
> **Para:** identificar producto en mostrador o apagar fotos si estorban  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado sucursal A sin preferencia previa, cuando abro `/proveedor`, entonces el toggle está **ON** (pregunta extra junto a las listas de secciones; **no** es un control de `/proveedor/pos`). Las cards de `/proveedor/pos` muestran imagen (o placeholder). Al apagarlo, las cards POS ocultan imagen; al recargar o volver, A conserva OFF. Sucursal B (N>1) tiene su propio valor; default ON si B nunca configuró.
> - [ ] **Escenario 2 (Error):** Dado fallo al persistir el toggle, cuando lo cambio en catálogo, entonces veo error recuperable y no se aplica un default silencioso distinto al último valor conocido. Miniaturas de **lista catálogo** (`US-CAT-13`) **no** se apagan con este toggle.
> - [ ] **Regla de Negocio:** D-F12-9. El control vive en **catálogo** (`/proveedor`), no en la toolbar del POS. Persistencia **por sucursal** (`Provider` activo). Default ON. Distinto de miniaturas CAT.

>
> **UX:** toggle tipo pregunta extra on/off en toolbar de `/proveedor` (junto a secciones). **Arquitecto:** preferencia por Provider. **QA:** A vs B independencia; default ON; el control no está en `/proveedor/pos`.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **User Stories:** `US-CAT-13`
- **Backlog:** `BL-208`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-POS-12-imagenes-pos-toggle.md`
- **Agente Downstream:** UX/UI, Arquitecto, Backend, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
