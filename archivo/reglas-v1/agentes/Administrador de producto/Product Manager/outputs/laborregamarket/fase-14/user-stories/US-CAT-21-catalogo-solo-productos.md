# User Story — US-CAT-21

> **ID:** US-CAT-21  
> **Título:** Catálogo solo productos; toggle fotos POS vive en POS  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** que `/proveedor` (Catálogo) muestre **solo** productos, secciones, precios, unidades y archivados, y que el toggle de fotos de card del POS se configure **en POS**  
> **Para:** no mezclar identidad del negocio ni preferencias de cobro con el trabajo diario de catálogo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado el panel F13, cuando abro `/proveedor`, entonces veo toolbar de alta, secciones, filas de producto (miniatura, GLOBAL/LOCAL, precio, historial, unidad-oferta, Foto F10, Activo, Eliminar, bandeja archivados) y **no** veo logo, portada, colores, Google, horarios, prep time ni delivery (eso está en Perfil: `US-PROF-01`…`05`). El toggle `posShowImages` aparece en `/proveedor/pos` y persiste por sucursal (misma semántica `US-POS-12`: default ON). Catálogo **no** ofrece ese toggle.
> - [ ] **Escenario 2 (Validación/Error):** Dado un deep-link antiguo a un ancla de «Operación y Google» en Catálogo, cuando navego, entonces no hay bloque huérfano: el usuario llega a Catálogo de productos o se le indica Perfil (redirect o copy, decisión UX). Sin auth → 401/403 al POS y Catálogo como hoy. Fallo al persistir `posShowImages` desde POS: Error visible en POS, el catálogo no «traga» el error.
> - [ ] **Regla de Negocio:** D-F14-1, D-F14-3. No se reabre F13: archivado, Editar GLOBAL/LOCAL, precio e historial **siguen**. Envelope ADR-003. IDOR F11: el toggle es de la sucursal activa. `PosImagesToggle` puede moverse de carpeta `inventory/`; eso es implementación FE, no cambio de producto.

>
> **UX:** Catálogo más corto; toggle fotos en chrome de POS (no esconderlo en un menú de Catálogo). **Arquitecto:** contrato `posShowImages` intacto. **QA:** no-regresión F13 filas; toggle ON/OFF sigue afectando cards POS; Perfil tiene identidad.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §2.6, D-28
- **US previa:** `US-POS-12` (F12), catálogo F13

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-CAT-21-catalogo-solo-productos.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
