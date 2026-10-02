# User Story — US-ADMIN-01

> **ID:** US-ADMIN-01  
> **Título:** Dashboard de analítica de plataforma para ADMIN  
>
> **Como:** ADMIN  
> **Quiero:** ver GMV, número de órdenes, proveedores activos y tasa de cancelación por periodo  
> **Para:** entender la salud del negocio, no solo la de un proveedor  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que existen órdenes en la plataforma, cuando abro `/admin/analytics`, entonces veo GMV, # órdenes, # proveedores activos y split `MARKETPLACE` vs `POS` para hoy/7d/30d.
> - [ ] **Escenario 2 (Vacío):** Dado que no hay órdenes en el periodo, cuando cargo el dashboard, entonces veo empty state, no errores ni ceros confusos.
> - [ ] **Regla de Negocio:** Excluye órdenes `CANCELLED` del GMV. Es analítica de plataforma completa, distinta del dashboard ilustrativo del proveedor (F3, solo su propio negocio).
>
> **UX:** Pendiente diseño (`UF-ADMIN-01`). **QA:** pendiente matriz.
