# User Story — US-DASH-06

> **ID:** US-DASH-06  
> **Título:** Descargar PDF del mismo reporte de ventas  
>
> **Como:** PROVIDER con un reporte de `US-DASH-04` en pantalla  
> **Quiero:** un botón **Descargar PDF**  
> **Para:** guardar o enviar el archivo sin depender de “imprimir a PDF” a mano  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Descarga):** Dado un reporte cargado, cuando pulso **Descargar PDF**, entonces obtengo un archivo PDF del **mismo** contenido (KPIs, split, serie o tabla, top productos) con encabezado: nombre de frutería, periodo, TZ America/Monterrey, fecha/hora de generación.
> - [ ] **Escenario 2 (Vacío):** Dado un periodo sin ventas, cuando descargo, entonces el PDF refleja el empty (no un archivo corrupto ni un 500 silencioso).
> - [ ] **Regla de Negocio:** D-F6-5, D-F6-6. Must = archivo descargable. **Mecanismo** (servidor vs cliente) = ADR del Arquitecto; el PM no prescribe librería. No es CFDI. No envío por email (Won't). CSV/Excel = Won't F6.

>
> **Arquitecto:** ADR PDF + contrato si hay endpoint de descarga. **UX:** CTA junto a Imprimir. **QA:** PDF abre y coincide con el periodo seleccionado; 401/403 sin sesión o de otro rol.
