# User Story — US-GEO-05

> **ID:** US-GEO-05  
> **Título:** Ubicación en banner y radio al pie del mapa  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** activar "Usar mi ubicación" desde el banner superior y ajustar el radio de tiendas en la parte inferior del mapa  
> **Para:** centrar la búsqueda en donde estoy y ver el alcance geográfico sin tapar la lista ni el mapa  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso — ubicación):** Dado que concedo el permiso de geolocalización, cuando pulso **Usar mi ubicación** en el **banner superior** de `/explorar` (debajo del header / junto a FilterBar, no dentro del mapa), entonces el pin se coloca en mi posición, se actualizan `lat`/`lng` en la URL y lista + mapa se filtran con el radio vigente.
> - [ ] **Escenario 2 (Exitoso — radio):** Dado que ya hay una ubicación (geolocalización, pin o favorita F4), cuando muevo el slider de radio **sobre el borde inferior del mapa** (1–25 km, default 10), entonces el círculo y la lista se actualizan sin recargar la página; el slider no vive en la LocationBar de F4.
> - [ ] **Escenario 3 (Permiso denegado):** Dado que rechazo geolocalización, cuando pulso **Usar mi ubicación**, entonces permanece el mapa centrado como hoy (Monterrey / última posición) y un mensaje no bloqueante invita a buscar dirección o usar una favorita; la lista no se vacía.
> - [ ] **Regla de Negocio:** D-F5-4. El radio sigue siendo el filtro de negocio (`US-GEO-02`), no un bounding box. Favoritas (`US-GEO-03`) se conservan; UX decide si el selector queda en una barra compacta o sube al banner. Empty state de radio pequeño ("No hay fruterías en este radio" + Ampliar radio) se mantiene.

>
> **UX:** Nuevo layout `WF-explorar` F5 (banner + overlay radio). **QA:** TC-GEO — posición del CTA y del slider; no regresionar filtros F2 (`category`/`q`/`verified`).
