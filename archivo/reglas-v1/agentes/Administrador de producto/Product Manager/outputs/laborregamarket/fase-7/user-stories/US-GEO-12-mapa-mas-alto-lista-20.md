# User Story — US-GEO-12

> **ID:** US-GEO-12  
> **Título:** Mapa más alto y lista de hasta 20 proveedores paginada  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** un mapa más grande y ver hasta 20 fruterías por página bajo el mapa  
> **Para:** aprovechar el espacio y no perder la paginación  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Alto):** Dado el layout F5/F7, cuando mido el mapa, entonces su alto es **~20% mayor** que el de F5 (token/UX fija el px o `vh`). Attribution OSM visible.
> - [ ] **Escenario 2 (Página):** Dado `total` > 20, cuando estoy en página 1, entonces la lista muestra **como máximo 20** tarjetas y hay controles de paginación.
> - [ ] **Escenario 3 (Página 2):** Dado que voy a la página siguiente, entonces cambian los 20 ítems; el mapa y el radio **no** se resetean.
> - [ ] **Regla de Negocio:** ID005. `limit` ≤ 20. `US-GEO-13` para el copy de total.
>
> **UX:** lista bajo el mapa (espacio vacío actual). **QA:** 21+ proveedores en radio de prueba.
