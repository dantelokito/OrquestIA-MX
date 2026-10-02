# User Story — US-DASH-11

> **ID:** US-DASH-11  
> **Título:** Módulo nuevo de reportes generales (todas las fruterías)  
>
> **Como:** PROVIDER con **más de una** frutería  
> **Quiero:** un **módulo distinto** de reportes generales/globales (vista consolidada / “fruterías globales”)  
> **Para:** ver ventas de **todas** mis sucursales a la vez, sin entrar sucursal por sucursal  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso N>1):** Dado un user con N>1 (El Paraíso), cuando abro el panel, entonces existe un **módulo de navegación propio** (no solo un filtro escondido dentro de Reportes F10) con KPIs/tabla que **suman** las sucursales del user en el mismo rango `from`/`to` (TZ America/Monterrey, reglas F10). Puedo distinguir o desglosar por sucursal en la vista consolidada (mínimo: total global + breakdown por `Provider`).
> - [ ] **Escenario 2 (Oculto si N=1 / 403):** Dado Campo Verde (N=1), cuando uso el panel, entonces **no** veo el módulo consolidado: la navegación de Reportes es **solo** la de F10 por sucursal. Si un cliente llama el endpoint consolidado con N=1 o sin ser dueño, **403** (o 404 de recurso no ofrecido; no 200 vacío que “parezca” el módulo). ADMIN no ve DASH ajeno (Won't F10).
> - [ ] **Regla de Negocio:** D-F11-2. Visibilidad = **función de N**, no flag admin. N=1 mantiene chrome y Reportes F10 intactos. Print del consolidado = **Should** (no bloquea). Sin CSV, email de reporte ni CFDI.

>
> **UX:** módulo/entrada propia en nav PROVIDER; 4 estados; no copiar look slate de `/admin/analytics`. **Arquitecto:** contrato nuevo o delta explícito (no reutilizar a ciegas el de sucursal). **QA:** módulo visible solo N>1.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **User Stories:** `US-AUTH-11`, `US-HEADER-01`, `US-ISO-01`
- **Backlog:** `BL-193`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-DASH-11-reportes-globales.md`
- **Agente Downstream:** UX/UI, Arquitecto, Frontend, Backend
- **Fase / Proyecto:** 11 / laborregamarket
