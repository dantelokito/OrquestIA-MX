# User Story — US-REV-04

> **ID:** US-REV-04  
> **Título:** Proveedor no verificado ve el vínculo a Google bloqueado  
>
> **Como:** PROVIDER con `isVerified=false`  
> **Quiero:** ver la opción de vincular Google Maps aunque esté deshabilitada  
> **Para:** entender que existe y qué necesito para desbloquearla  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `isVerified=false`, cuando abro la configuración de mi negocio, entonces veo el bloque de Google Maps deshabilitado (inputs y toggle no interactivos) con mensaje ilustrativo "Requiere verificación de tu negocio".
> - [ ] **Escenario 2 (CTA):** Dado el bloque bloqueado, cuando reviso el mensaje, entonces incluye una referencia clara a cómo solicitar verificación (enlace o texto informativo, sin prometer tiempos).
> - [ ] **Regla de Negocio:** El backend rechaza (403 o 422) cualquier intento de `PATCH` a los campos de Google si `isVerified=false`, aunque el frontend ya bloquee la UI.
>
> **UX:** Pendiente diseño (`UF-REV-02`, estado bloqueado). **QA:** pendiente matriz (incluir intento de bypass vía API directa).
