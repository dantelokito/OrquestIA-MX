# User Story — US-GEO-09

> **ID:** US-GEO-09  
> **Título:** El mapa tiene prioridad visual sobre el catálogo en Explorar  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** ver el mapa primero (y arriba en móvil) sin que la lista de proveedores empuje o rompa el layout  
> **Para:** interactuar con el mapa sin que el dashboard se desplace  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Desktop):** Dado `/explorar` en viewport ≥ md, cuando cargo o actualizo markers/lista, entonces el **mapa conserva su región** (no salta por el catálogo). El catálogo está **debajo o en un panel que no gana altura sobre el mapa**.
> - [ ] **Escenario 2 (Móvil):** Dado viewport < md, cuando abro `/explorar`, entonces el **mapa está encima** del catálogo (no al pie de la página).
> - [ ] **Escenario 3 (Interacción):** Dado que muestro u oculto resultados de fruterías, cuando cambia el número de tarjetas, entonces **no** se reflowea el mapa fuera de vista ni se rompe el header.
> - [ ] **Regla de Negocio:** ID000. Leaflet/OSM. D-F7-7.
>
> **UX:** delta `UF-GEO-01` / `WF-explorar`. **QA:** desktop + móvil; no regresionar FilterBar F2.
