# User Story — US-CAT-23

> **ID:** US-CAT-23  
> **Título:** Error al eliminar sección con productos es visible  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** ver un mensaje claro cuando intento borrar una sección que todavía tiene productos  
> **Para:** entender el 409 (regla F10) en lugar de creer que el borrado «no hizo nada»  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado una sección **vacía** de la sucursal activa, cuando la elimino, entonces desaparece (2xx) como hoy F10 y el listado se actualiza. El empty de «sin secciones» no oculta los GLOBAL de plataforma (F13 intacto).
> - [ ] **Escenario 2 (Validación/Error):** Dado una sección **con** al menos un producto (visible o archivado, según la regla F10 vigente: 409 si tiene productos), cuando pulso eliminar sección, entonces la API sigue respondiendo **409** y **ese** error se muestra **fuera** del formulario colapsado «Nueva sección»: toast, banner o texto junto a la sección, visible sin abrir ese form. La sección y sus productos **permanecen**. Sucursal ajena → 403. Sin auth → 401/403.
> - [ ] **Regla de Negocio:** D-F14-15. No se cambia la regla F10 de «no borrar sección con productos». No hard-delete de productos. `sectionError` no puede vivir solo dentro de un form cerrado. Envelope ADR-003. IDOR F11.

>
> **UX:** mensaje accionable («mueve o quita los productos de la sección antes de eliminarla»); no genérico. **Arquitecto:** contrato 409 intacto; opcional `error.details`. **QA:** 409 visible con form cerrado; sección vacía sí borra.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` D-27
- **Código hoy:** `sectionError` solo en form «Nueva sección» de `ProviderCatalogF10.tsx`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-CAT-23-error-eliminar-seccion.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
