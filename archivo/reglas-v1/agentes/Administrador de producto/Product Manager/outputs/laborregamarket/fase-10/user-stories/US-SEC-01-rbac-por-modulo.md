# User Story — US-SEC-01

> **ID:** US-SEC-01  
> **Título:** Permiso por módulo en catálogos y APIs admin  
>
> **Como:** ADMIN  
> **Quiero:** que cada catálogo y ruta `/api/admin/*` exija el permiso del módulo correspondiente  
> **Para:** no filtrar datos de usuarios, pedidos o bitácora con un único `USERS/view`  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un ADMIN con permiso de ver `PRODUCTS` y no de ver `USERS`, cuando consulto `GET /api/catalogs?catalog=products`, entonces recibo 200 con envelope ADR-003; cuando consulto `catalog=users`, entonces recibo 403.
> - [ ] **Escenario 2 (Validación/Error):** Dado un CLIENT o PROVIDER autenticado (o sin token), cuando llamo `GET /api/catalogs` o cualquier `GET/PATCH /api/admin/*` existente o nueva de F10, entonces recibo 403 (con sesión de rol incorrecto) o 401 (sin sesión).
> - [ ] **Regla de Negocio:** D-F10-1. Dual `requireRole(ADMIN)` + `hasModulePermission(módulo, "view"|"edit")` alineado al catálogo (`users`→USERS, `products`→PRODUCTS, `providers`→PROVIDERS, `orders`→ORDERS, `audit` / bitácora→AUDIT). Cierra OBS-004. Nombres de query: Arquitecto alinea OBS-002 si aún diverge.

>
> **UX:** sin pantalla nueva; errores 403 como banner existente. **Arquitecto:** mapa catalog→SystemModule. **QA:** matriz RBAC por catálogo; 401/403.
