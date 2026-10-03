# User Story — US-DASH-09

> **ID:** US-DASH-09  
> **Título:** Imprimir el reporte filtrado (rango y productos)  
>
> **Como:** PROVIDER viendo Reportes con `US-DASH-07` y `US-DASH-08`  
> **Quiero:** un botón **Imprimir** de esa vista  
> **Para:** llevar a papel el corte de mes/rango y los productos que marqué  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Print):** Dado un reporte cargado, cuando pulso **Imprimir**, entonces se abre el diálogo nativo (`window.print` o equivalente) y `@media print` oculta header de app y SubNavProveedor. Sí: nombre de frutería, rango inicio–fin, TZ Monterrey, fecha de generación, y lista de productos incluidos o la leyenda **Todos**.
> - [ ] **Escenario 2 (Contenido):** Dado el preview de impresión, cuando lo reviso, entonces incluye los KPIs del rango y la tabla por producto **igual** que en pantalla (mismos checkboxes aplicados). Empty: mensaje de sin ventas, no página en blanco confusa.
> - [ ] **Regla de Negocio:** D-F10-9. Mismo espíritu D-F6-5: no ticket térmico ni CFDI. Imprimir es acción de documento (no primary de cobro). PDF de este corte = Should (no reabre `US-DASH-06` en `fase-6/`).

>
> **UX:** CTA ≥44px; documento legible. **QA:** chrome oculto en print; coincide con filtros.
