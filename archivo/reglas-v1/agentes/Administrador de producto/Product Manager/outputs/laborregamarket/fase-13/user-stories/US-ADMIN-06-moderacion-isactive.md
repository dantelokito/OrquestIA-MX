# User Story — US-ADMIN-06

> **ID:** US-ADMIN-06  
> **Título:** Admin inhabilita un SKU LOCAL o GLOBAL  
>
> **Como:** ADMIN  
> **Quiero:** poner `isActive=false` en un producto maestro LOCAL o GLOBAL (contenido ofensivo / rechazo administrativo)  
> **Para:** que deje de ser vendible en todos los canales que ya respetan `product.isActive`, sin borrar el registro  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU GLOBAL o LOCAL activo, cuando lo inhabilito desde admin, entonces `isActive=false`, queda AUDIT `PRODUCTS` / `DISABLE` y **deja de ser vendible** en explorar, `/fruteria`, Encargar y POS (mismo efecto que `US-CAT-01`). El registro **permanece**. Si un proveedor tenía la oferta **oculta** o activa, restaurar/activar la oferta **no** vuelve a vender hasta que yo rehabilite el SKU (`ENABLE`). Puedo filtrar inactivos; no hay segunda bandeja Must.
> - [ ] **Escenario 2 (Validación/Error):** Dado un id que no existe, cuando hago PATCH, entonces **404**. Dado un PROVIDER, cuando intenta PATCH admin, entonces **403**. Dado DELETE HTTP a `/api/admin/products/[id]`, entonces **405** (no se habilita hard-delete). Nombre vacío u otros campos inválidos en PATCH de ficha GLOBAL → **400** sin mutación parcial. PATCH de `isActive` en LOCAL **no** 404 por scope (hoy sí 404 si no es GLOBAL).
> - [ ] **Regla de Negocio:** D-F13-2. Admin **no** gana en F13 CRUD de nombre/precio de un LOCAL ajeno: Must = `isActive` (y listado). Alta admin sigue solo GLOBAL. No hard-delete aunque no haya `OrderItem`. Envelope ADR-003.

>
> **UX:** acción retirar/inhabilitar en la fila o ficha; filtro Activo/Inactivo. **Arquitecto:** PATCH admin acepta LOCAL; AUDIT DISABLE/ENABLE. **QA:** LOCAL y GLOBAL; 405 DELETE; 409 venta si inactivo.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US previa:** `US-CAT-01` (F5), `US-ADMIN-02` (retiro GLOBAL)
- **Código hoy:** `src/app/api/admin/products/[id]/route.ts` (PATCH GLOBAL, DELETE 405)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-ADMIN-06-moderacion-isactive.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
