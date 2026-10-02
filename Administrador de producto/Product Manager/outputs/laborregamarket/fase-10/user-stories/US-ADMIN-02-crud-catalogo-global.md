# User Story — US-ADMIN-02

> **ID:** US-ADMIN-02  
> **Título:** CRUD del catálogo global comparable  
>
> **Como:** ADMIN  
> **Quiero:** crear, editar y retirar productos del catálogo de plataforma  
> **Para:** curar SKUs que cualquier frutería pueda activar (Mango comparable)  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que soy ADMIN, cuando creo un producto global (nombre, categoría `FRUTA`\|`VERDURA`\|`AGRICOLA`, unidad) y opcionalmente subo imagen **a disco** (`US-MEDIA-06`; no Cloudinary), entonces queda `isActive=true` y los PROVIDER pueden activarlo como `ProviderProduct`. Cuando lo edito o lo retiro (`isActive=false`), deja de ofrecerse a nuevas activaciones y no es vendible (`US-CAT-01` / F5).
> - [ ] **Escenario 2 (Validación/Error):** Dado un `Product` con `ProviderProduct` o líneas de orden, cuando intento **borrar** el registro, entonces recibo 4xx y el producto no se elimina (retiro = inhabilitar). Nombre vacío, categoría inválida o imagen fuera de MEDIA-03 → 400, sin mutación parcial sucia.
> - [ ] **Regla de Negocio:** D-F10-2. Esto **no** crea SKUs locales del proveedor (`US-CAT-02`). PROVIDER no usa `POST /api/admin/products`. Envelope ADR-003. Paginación ADR-004 en listados.

>
> **UX:** tab Catálogos deja de ser solo lectura + imagen; formularios alta/edición; upload disco. **Arquitecto:** delta API-ADMIN-01 / PRODUCTS + `US-MEDIA-06`. **QA:** CRUD + no hard-delete + imagen local.
