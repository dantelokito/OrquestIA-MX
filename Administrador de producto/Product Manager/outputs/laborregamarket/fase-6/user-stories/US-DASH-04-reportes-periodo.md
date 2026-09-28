# User Story — US-DASH-04

> **ID:** US-DASH-04  
> **Título:** Reportes de ventas por día, mes o año concreto  
>
> **Como:** PROVIDER en el apartado administrativo de mi negocio  
> **Quiero:** ver ventas y analytics de un **día**, un **mes (MM/AAAA)** o un **año (AAAA)** que yo elija  
> **Para:** saber cómo fue esa jornada, ese mes o ese año — no solo “hoy y 7 días”  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Día):** Dado que elijo grano **día** y una fecha concreta (TZ America/Monterrey), cuando cargo el reporte, entonces veo GMV, ticket promedio, # órdenes (no `CANCELLED`) y split Encargar (`MARKETPLACE`) vs Mostrador (`POS`) de ese día; top productos (incl. venta rápida) del mismo periodo. Serie horaria es Could.
> - [ ] **Escenario 2 (Mes / año):** Dado grano **mes** + MM/AAAA, o **año** + AAAA, cuando cargo el reporte, entonces las mismas métricas cubren ese mes o año; la serie es **barras por día** (mes) o **barras por mes** (año), con tabla equivalente para lectores de pantalla (mismo espíritu `US-DASH-02`).
> - [ ] **Escenario 3 (Vacío / error):** Dado un periodo sin ventas, cuando cargo, entonces empty amigable (KPIs 0/`—`), no errores ni ceros fingidos de plataforma. Si la API es 500, ErrorBanner + Reintentar — **no** empty POS de “sin activos”.
> - [ ] **Regla de Negocio:** D-F6-3, D-F6-4, D-F6-8. Solo el **propio** `Provider`. No es `/admin/analytics`. Extiende F3 (`US-DASH-01…03`); el dashboard “hoy + 7d” puede seguir como vista por defecto. Query sugerida al Arquitecto: `grain=day|month|year` + `date=` (forma exacta = contrato). RBAC: `requireRole` PROVIDER (DEV-P2-011). Comparativa vs periodo anterior = Should, no bloquea.

>
> **UX:** `UF-DASH-02` + delta `WF-proveedor-dashboard` (ciclo nuevo). **Arquitecto:** extender API-PROVIDER-DASH-01. **QA:** tres granos + empty + 403 de otro proveedor.
