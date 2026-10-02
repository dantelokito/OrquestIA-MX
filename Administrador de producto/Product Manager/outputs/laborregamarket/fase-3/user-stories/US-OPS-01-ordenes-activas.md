# User Story — US-OPS-01

> **ID:** US-OPS-01  
> **Título:** Listar órdenes activas del proveedor  
>
> **Como:** PROVIDER  
> **Quiero:** ver pedidos activos en `/proveedor/ordenes`  
> **Para:** preparar pickup  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1:** Tab Activas muestra PENDING/CONFIRMED/IN_TRANSIT con `#orden`, badges de estado y origen (ONLINE/POS).
> - [ ] **Escenario 2:** Lista vacía → empty "No hay órdenes activas".
> - [ ] **Regla de Negocio:** Solo órdenes del `Provider` de la sesión.
>
> **UX:** UF-OPS-01, WF-proveedor-ordenes. **Contrato:** API-PROVIDER-ORDERS-01.
