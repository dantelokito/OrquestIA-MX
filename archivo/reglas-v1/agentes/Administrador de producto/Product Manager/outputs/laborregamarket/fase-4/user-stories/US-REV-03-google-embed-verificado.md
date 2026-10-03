# User Story — US-REV-03

> **ID:** US-REV-03  
> **Título:** Proveedor verificado vincula sus reseñas de Google Maps  
>
> **Como:** PROVIDER con `isVerified=true`  
> **Quiero:** configurar la URL o Place ID de mi negocio en Google Maps  
> **Para:** mostrar mi reputación externa junto a las reseñas nativas  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `isVerified=true`, cuando capturo `googlePlaceId` o `googleMapsUrl` y activo el toggle, entonces `/fruteria/[id]` muestra un enlace/embed "Ver reseñas en Google" y `Provider.googleReviewsEnabled=true`.
> - [ ] **Escenario 2 (Formato inválido):** Dado un valor que no es una URL de Google Maps válida ni un Place ID con formato esperado, cuando guardo, entonces se rechaza con mensaje de error inline.
> - [ ] **Escenario 3 (Pérdida de verificación):** Dado un proveedor que tenía Google vinculado y ADMIN le quita `isVerified`, cuando se guarda el cambio, entonces `googleReviewsEnabled` pasa a `false` automáticamente (no se borra el dato, solo se apaga la vitrina).
> - [ ] **Regla de Negocio:** Solo enlace/embed — no se sincronizan reseñas de Google vía API en este alcance.
>
> **UX:** Pendiente diseño (`UF-REV-02`). **QA:** pendiente matriz.
