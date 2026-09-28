# User Story — US-GEO-01

> **ID:** US-GEO-01  
> **Título:** Explorar fruterías con mapa Google y radio ajustable  
>
> **Como:** CLIENT en `/explorar`  
> **Quiero:** ubicar mi posición en un mapa interactivo y ajustar cuántos km a la redonda quiero ver  
> **Para:** encontrar fruterías realmente cercanas sin depender solo de la ciudad  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que activo mi ubicación (o arrastro un pin manualmente), cuando muevo el slider de radio (1–25 km), entonces la lista y el mapa se filtran a proveedores dentro de ese radio, sin recargar toda la página.
> - [ ] **Escenario 2 (Sin ubicación):** Dado que rechazo el permiso de geolocalización, cuando entro a `/explorar`, entonces puedo seguir explorando por ciudad/categoría como hoy, con un CTA para activar ubicación o buscar una dirección manualmente.
> - [ ] **Escenario 3 (Sin resultados en radio)):** Dado un radio muy pequeño sin proveedores, cuando se aplica el filtro, entonces se muestra empty state sugiriendo ampliar el radio.
> - [ ] **Regla de Negocio:** El mapa reemplaza el motor Leaflet actual por Google Maps JS API (decisión D-F4-2); el radio es un filtro adicional, no sustituye `city`/`category`/`q`/`verified`.
>
> **UX:** Pendiente diseño (`UF-GEO-01`). **QA:** pendiente matriz.
