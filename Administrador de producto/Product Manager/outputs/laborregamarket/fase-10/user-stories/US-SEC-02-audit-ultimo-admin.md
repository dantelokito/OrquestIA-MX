# User Story — US-SEC-02

> **ID:** US-SEC-02  
> **Título:** Bitácora de escrituras, último ADMIN y ownership de catálogo  
>
> **Como:** ADMIN  
> **Quiero:** que cada alta/edición/retiro admin o de catálogo del proveedor quede en bitácora, que no se pueda dejar la plataforma sin ADMIN, y que un PROVIDER no mute el catálogo de otro  
> **Para:** auditar operación y evitar escalada o IDOR  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un ADMIN o el PROVIDER dueño, cuando creo/edito/retiro un `Product` global, un producto local, una sección, o cambio flags de proveedor, entonces existe un `AuditLog` con módulo, acción (`CREATE`/`UPDATE`/`DISABLE`/`DELETE` según aplique), `entityId` y `userId` del actor.
> - [ ] **Escenario 2 (Validación/Error):** Dado que soy el único usuario con rol `ADMIN`, cuando intento degradar o eliminar mi propio rol ADMIN, entonces la API rechaza (4xx) y el rol no cambia. Dado un PROVIDER, cuando intento `PATCH`/`POST`/`DELETE` de productos o secciones de **otro** `providerId`, entonces recibo 403 y no hay mutación.
> - [ ] **Regla de Negocio:** D-F10-1. Sin auto-escalada (CLIENT/PROVIDER no se convierten en ADMIN vía API). Password nunca en `details` del AUDIT. IP opcional. Envelope ADR-003.

>
> **UX:** el rechazo de último ADMIN es mensaje claro, no crash. **Arquitecto:** acciones AUDIT nuevas si hace falta. **QA:** IDOR cruzado; último ADMIN; presencia de AUDIT tras escrituras F10.
