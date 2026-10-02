# User Story — US-GEO-23

> **ID:** US-GEO-23  
> **Título:** El mapa se queda en México y se encuadra al radio de búsqueda  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** navegar el mapa solo en México y que la vista se ajuste al círculo cuando cambio el radio o el centro  
> **Para:** no terminar en otro país y ver siempre el área que estoy buscando  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Límite México):** Dado `/explorar` con pin en territorio mexicano, cuando intento panear o alejar el zoom hacia EUA, Guatemala u otro país, entonces el viewport **no sale** del bbox canónico de México (`maxBounds` + viscosidad alta; `minZoom` o equivalente para no ver el continente). La lista, el slider y `radiusKm` **no cambian**.
> - [ ] **Escenario 2 (Encuadre al radio):** Dado un pin y un radio vigentes, cuando cambio el slider, GPS, dirección o favorita, entonces el mapa **encuadra el círculo** (`fitBounds` / `FitCircle`, paridad F7). Pan o pinch **dentro de México** no disparan refetch ni mueven `radiusKm` (`CO-F7-001`).
> - [ ] **Escenario 3 (Fuera de México):** Dado GPS, geocode, arrastre del pin o `?lat&lng` fuera del bbox, cuando se resuelve el punto, entonces **no** se adopta: copy no técnico, se conserva SN o el último pin válido. No se acepta un centro en Laredo TX ni equivalente.
> - [ ] **Regla de Negocio:** ID019. `CO-F8-002`. Filtro = Haversine, **no** bbox Must de API. Leaflet/OSM. Sin Places, sin clustering, sin pan→radio (`US-GEO-07`).
>
> **UX:** rebote en el borde; mensaje GPS/dirección fuera. **Arquitecto:** constante bbox + minZoom (no polígono INEGI Must). **QA:** no se ve Texas; slider encuadra; pan en AMM no cambia N/R.
