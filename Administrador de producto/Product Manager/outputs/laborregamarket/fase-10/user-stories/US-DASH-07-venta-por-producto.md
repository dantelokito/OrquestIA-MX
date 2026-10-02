# User Story — US-DASH-07

> **ID:** US-DASH-07  
> **Título:** Reporte de venta por producto con checkboxes  
>
> **Como:** PROVIDER en Reportes de `/proveedor/dashboard`  
> **Quiero:** ver cuánto vendió cada producto en el periodo y marcar cuáles incluir  
> **Para:** imprimir o revisar un corte de SKUs, no solo un top 5  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un rango válido (`US-DASH-08`) y sesión del dueño, cuando cargo el reporte, entonces veo una tabla por producto (nombre, unidades, GMV, split Encargar vs POS) de **mi** negocio. Incluye SKUs globales activados, **locales** (`US-CAT-02`) y venta rápida. `status ≠ CANCELLED`. Si no marco ningún checkbox, el reporte usa **todos** esos productos con movimiento (o catálogo vendible del periodo, según contrato Arch).
> - [ ] **Escenario 2 (Validación/Error):** Dado que marco uno o más productos, cuando recargo, entonces KPIs y filas corresponden **solo** a esos IDs. Un CLIENT u otro PROVIDER recibe 403. Periodo sin ventas: empty amigable, no ceros fingidos de plataforma.
> - [ ] **Regla de Negocio:** D-F10-9 / `CO-F10-003`. D-F6-3 y D-F6-8 intactos. No es `/admin/analytics`. Could: «Seleccionar todos / ninguno». Envelope ADR-003.

>
> **UX:** checkboxes ≥44px; lista desplazable. **Arquitecto:** `productIds[]` opcional. **QA:** ninguno = todos; filtro recorta; IDOR.
