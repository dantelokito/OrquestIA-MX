# User Story — US-DASH-05

> **ID:** US-DASH-05  
> **Título:** Imprimir el reporte de ventas desde el navegador  
>
> **Como:** PROVIDER viendo un reporte de `US-DASH-04`  
> **Quiero:** un botón **Imprimir** que abra el diálogo del navegador  
> **Para:** llevar el resumen a papel (caja, contador, archivo físico)  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Print):** Dado un reporte cargado (día, mes o año), cuando pulso **Imprimir**, entonces se abre el diálogo nativo (`window.print` o equivalente) y la hoja usa CSS `@media print`: sin header de app ni SubNavProveedor; sí nombre de frutería, periodo, TZ Monterrey y fecha de generación.
> - [ ] **Escenario 2 (Contenido):** Dado el preview de impresión, cuando lo reviso, entonces incluye los KPIs, el split Encargar vs POS, la serie (o su tabla) y el top productos del periodo seleccionado — el mismo set que en pantalla.
> - [ ] **Regla de Negocio:** D-F6-5. No es ticket térmico del POS ni CFDI. CTA de imprimir no compite como primary de cobro (dashboard sigue informativo; Imprimir / Descargar PDF son acciones de documento).

>
> **UX:** WF print del reporte. **QA:** chrome oculto en print; a11y del botón ≥44px.
