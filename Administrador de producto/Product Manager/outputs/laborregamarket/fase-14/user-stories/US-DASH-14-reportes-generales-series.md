# User Story — US-DASH-14

> **ID:** US-DASH-14  
> **Título:** Reportes generales pintan series, products, bySource + filtro productos  
>
> **Como:** PROVIDER con **más de una** frutería (N>1)  
> **Quiero:** que Reportes generales grafique y tabule la `series`, los `products` y el `bySource` que la API **ya** calcula, y filtrar por `productIds`  
> **Para:** no pagar un consolidado en backend que la UI descarta  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un usuario con N>1 y `GET /api/provider/reports/global` 2xx con `series`, `products` y `kpis.bySource` (o `bySource` en el shape vigente), cuando abro `/proveedor/reportes-generales`, entonces veo (1) tendencia de GMV/órdenes por bucket de `series`, (2) tabla o ranking de `products`, (3) mix Encargar vs Mostrador de `bySource`. El filtro de productos (checkboxes F10) envía `productIds` y la vista **respeta** el recorte. KPIs y tabla por sucursal **siguen**. Inventario actual F13 (`US-DASH-13`) **sigue**. Print de la vista conserva anclas CSS existentes o las que UX declare, más `<details>` accesible en cada gráfica.
> - [ ] **Escenario 2 (Validación/Error):** Dado N=1, cuando pido reportes generales, entonces **403** `GLOBAL_REPORTS_NOT_AVAILABLE` y la UI **redirige** al dashboard de reportes de la sucursal (**no** cambiar). Sin auth → 401/403. Fallo 5xx: Error recuperable, no gráficas con ceros inventados. `productIds` inválidos → 400 del contrato actual, mensaje visible.
> - [ ] **Regla de Negocio:** D-F14-7, D-F14-8, D-F14-14. **No** granularidad semanal. **No** comparativa vs periodo anterior. **No** agrupación por `ProviderSection`. **No** gráficos de margen. Pintar lo ya calculado; contrato de GET global **sin** ampliar Must. Envelope ADR-003.

>
> **UX:** 4 estados en la página; gráfica + tabla `<details>`; filtro productos visible. **Arquitecto:** sin endpoint nuevo Must. **QA:** N=1 403+redirect; N>1 pinta series; filtro `productIds`.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §4.1, D-16
- **US previa:** `US-DASH-11`, `US-DASH-13`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-DASH-14-reportes-generales-series.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
