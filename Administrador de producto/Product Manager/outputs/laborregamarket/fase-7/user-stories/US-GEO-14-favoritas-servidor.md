# User Story — US-GEO-14

> **ID:** US-GEO-14  
> **Título:** Direcciones favoritas administradas en backend  
>
> **Como:** CLIENT autenticado  
> **Quiero:** crear, listar, elegir y borrar favoritas en el servidor  
> **Para:** verlas en móvil y en otro navegador, no solo en este dispositivo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (CRUD):** Dado sesión CLIENT, cuando guardo una dirección con etiqueta, entonces persiste `UserAddress` (`lat`/`lng`/`formattedAddress`/`isFavorite`) y aparece al recargar y en otro dispositivo.
> - [ ] **Escenario 2 (Invitado):** Dado sin sesión, cuando intento guardar, entonces se pide login y se preserva la ubicación para guardar después (como F4).
> - [ ] **Escenario 3 (Fuente de verdad):** Dado datos en `localStorage` viejos y datos en API, cuando cargo `/explorar`, entonces **gana la API**. No se escribe el origen de Explorar solo en disco local.
> - [ ] **Regla de Negocio:** ID007. Extiende `US-GEO-03`. Máximo una `isDefault=true`. `lastUsedAt` (o equivalente) alimenta `US-GEO-11`.
>
> **Arquitecto:** confirmar/completar API F4. **QA:** dos dispositivos misma cuenta.
