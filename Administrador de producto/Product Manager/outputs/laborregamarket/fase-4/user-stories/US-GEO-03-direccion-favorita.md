# User Story — US-GEO-03

> **ID:** US-GEO-03  
> **Título:** Cliente guarda una dirección como favorita  
>
> **Como:** CLIENT autenticado  
> **Quiero:** guardar mi ubicación actual o un pin del mapa como dirección favorita con una etiqueta  
> **Para:** reutilizarla después en `/explorar` sin volver a ubicarme manualmente  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que estoy autenticado y tengo un pin/ubicación activa en `/explorar`, cuando pulso "Guardar dirección" y le doy una etiqueta (ej. "Casa"), entonces se crea `UserAddress` con `lat`/`lng`/`formattedAddress`/`isFavorite=true`.
> - [ ] **Escenario 2 (Invitado):** Dado que no tengo sesión, cuando intento guardar, entonces se me pide login/registro y se preserva la ubicación seleccionada para guardar después de autenticarme.
> - [ ] **Escenario 3 (Selección rápida):** Dado que tengo direcciones favoritas guardadas, cuando abro `/explorar`, entonces puedo elegir una desde un selector en vez de repetir el picker de mapa.
> - [ ] **Regla de Negocio:** Un usuario puede tener varias direcciones favoritas; máximo una marcada `isDefault=true` a la vez.
>
> **UX:** Pendiente diseño (`UF-GEO-01`, selector de favoritas). **QA:** pendiente matriz.
