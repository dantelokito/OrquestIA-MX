# User Story — US-EXPLORE-10

> **ID:** US-EXPLORE-10  
> **Título:** Card Explorar muestra distancia pin→frutería + ETA (sin precio mínimo visual)  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** ver cuánto hay entre mi punto de búsqueda y la frutería, no un «$X MXN desde» genérico  
> **Para:** comparar cercanía y tiempo de traslado  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Sin minPrice visual):** Dado una card en el listado geo, entonces **no** muestra `minPrice` ni «$X MXN desde» / «Consultar precios» en el slot semibold. `minPrice` puede seguir en API.
> - [ ] **Escenario 2 (Con pin):** Dado `distanceKm` del listing, entonces una sola fila muestra distancia Haversine pin→sucursal: «A {n} km de tu búsqueda» o «A {m} m» si &lt; 1 km (mismo criterio de formato que el radio) **y** ETA (`computeEtaMinutes` / ADR-017): «~{min} min en auto»; si caminata a 5 km/h &lt; 15 min, preferir «~{min} min a pie». No duplicar un km gris aparte.
> - [ ] **Escenario 3 (Sin pin):** Dado listing sin `lat`/`lng`, entonces no se inventa distancia (ocultar fila o copy «Elige una ubicación para ver la distancia»).
> - [ ] **Regla de Negocio:** DT-F9-003 / BL-162. `CO-F9-001`. Sin API Must. Should: barra proporción `distanceKm / radiusKm`. Sign-off F8 **intacto**.
>
> **UX:** copy distancia + ETA; tipografía del slot. **Arquitecto:** sin delta Must. **QA:** con pin hay km/m + ETA; sin pin no inventa; no hay «$X MXN desde».
