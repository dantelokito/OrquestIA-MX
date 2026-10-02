# User Story — US-DASH-16

> **ID:** US-DASH-16  
> **Título:** PDF del reporte de sucursal alineado a from/to  
>
> **Como:** PROVIDER en Reportes de la sucursal activa  
> **Quiero:** descargar un PDF del **mismo** corte `from`/`to` que estoy viendo  
> **Para:** archivar o compartir el periodo elegido, no un grano mensual que la UI ya no usa  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que la UI de reportes de sucursal usa `from` y `to` (F10), cuando pulso descargar PDF, entonces `GET /api/provider/reports.pdf` (o sucesor) genera el archivo de **ese** rango: mismos KPIs/series/productos del corte visible. El control de descarga está **visible** (`showPdf` deja de ser `false` en esa vista). El modo `grain` **no** se reactiva en la UI (`GrainSelector` no vuelve al flujo). Print HTML F10 **sigue** disponible.
> - [ ] **Escenario 2 (Validación/Error):** Dado `from > to`, rango sobre el máximo del contrato (366 días F10) o sin auth, cuando pido el PDF, entonces **400/401/403** y no se descarga un archivo vacío silencioso. N=1 no usa el PDF **global** (si existiera); este Must es el PDF de **sucursal**. Fallo pdfkit/5xx: Error visible, sin blob corrupto como «éxito».
> - [ ] **Regla de Negocio:** D-F14-9. Reconectar PDF al modo rango **o** el corte visible no se puede bajar (hoy el endpoint solo habla `grain`). **No** CSV, **no** email, **no** CFDI. Envelope ADR-003. IDOR: el PDF es de la sucursal activa.

>
> **UX:** botón Descargar PDF junto a Imprimir; no reintroducir selector grain. **Arquitecto:** query `from`/`to` en el endpoint PDF; documentar content-type. **QA:** rango de 7 días en UI = 7 días en PDF; 400 rango invertido.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §4.5, D-17
- **US previa:** `US-DASH-08`, `US-DASH-09`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-DASH-16-pdf-reporte-from-to.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
