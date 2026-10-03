# User Story — US-ADMIN-04

> **ID:** US-ADMIN-04  
> **Título:** Promover un producto local al catálogo global  
>
> **Como:** ADMIN  
> **Quiero:** convertir un SKU local de una frutería en producto de plataforma  
> **Para:** que otras fruterías puedan activarlo y comparar precio  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un producto local de un PROVIDER, cuando lo promuevo (categoría de plataforma + slug único), entonces existe un `Product` global activo y otras fruterías pueden crear `ProviderProduct`. El negocio origen sigue vendiéndolo (Arquitecto decide si el local se **enlaza** al global o se reemplaza).
> - [ ] **Escenario 2 (Validación/Error):** Dado un slug o nombre global ya usado, cuando promuevo, entonces 409/400 sin duplicar `Product`. Un PROVIDER no puede promover (403). PRODUCT inactivo o local ajeno mal referenciado → 404/403.
> - [ ] **Regla de Negocio:** D-F10-7. **Should:** no bloquea el Must de F10. No es auto-global. AUDIT de la promoción. Envelope ADR-003.

>
> **UX:** acción en admin (detalle de producto local o cola de promoción). **Arquitecto:** transacción y política de enlace. **QA:** solo si se implementa el Should.
