# User Story — US-ADMIN-03

> **ID:** US-ADMIN-03  
> **Título:** Operar proveedores con flags F5–F9  
>
> **Como:** ADMIN  
> **Quiero:** verificar o revocar, activar o desactivar un negocio, y ver/editar mayoreo y domicilio  
> **Para:** alinear el tab Proveedores con lo que Explorar y el detalle ya usan  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un proveedor en `/admin` tab Proveedores, cuando cambio `isVerified`, `isActive`, `offersWholesale` o `offersDelivery`, entonces se persisten y el listing público F9 filtra con los mismos campos. Badge de email inválido (`US-NOTIFY-04`) se conserva.
> - [ ] **Escenario 2 (Validación/Error):** Dado un proveedor con Google Reviews ligado, cuando quito `isVerified`, entonces `googleReviewsEnabled` pasa a `false` (`US-REV-04`) sin borrar el Place ID. Un CLIENT no puede PATCH estos campos (403).
> - [ ] **Regla de Negocio:** D-F10-3. Chrome ADMIN usa marca de **plataforma** (`US-BRAND-02`), no colores del negocio. Edición de `primaryColor`/`secondaryColor` por ADMIN = Could, no Must. `verifiedAt` según contrato F7 si ya existe.

>
> **UX:** columnas/acciones en tabla existente; no copiar look de `/admin/analytics` al panel proveedor. **Arquitecto:** delta `PATCH /api/admin/providers/[id]`. **QA:** flags + side-effect Google + 403.
