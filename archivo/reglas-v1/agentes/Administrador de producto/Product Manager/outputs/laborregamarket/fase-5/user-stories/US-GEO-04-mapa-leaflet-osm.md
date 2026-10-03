# User Story — US-GEO-04

> **ID:** US-GEO-04  
> **Título:** Explorar fruterías con mapa Leaflet/OSM sin clave de pago  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** ver un mapa interactivo de fruterías sin que la app pida una clave de Google Maps  
> **Para:** descubrir comercios cercanos en local, QA y producción sin depender de facturación externa  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un entorno **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, cuando abro `/explorar`, entonces el mapa renderiza teselas funcionales (OpenStreetMap o equivalente Open Source) y los markers corresponden al mismo result set que la lista.
> - [ ] **Escenario 2 (Fallo de red del mapa):** Dado que las teselas no cargan por red, cuando entra a `/explorar`, entonces veo un estado de error del mapa y **la lista sigue usable** (no se pierde la tarea de descubrir fruterías).
> - [ ] **Escenario 3 (Cierre OBS-F4-023):** Dado el fallback F4 "Mapa no disponible" por falta de clave Google, cuando F5 está desplegada, entonces ese fallback **ya no ocurre** por ausencia de clave; QA deja de exigir Google Maps JS key en local.
> - [ ] **Regla de Negocio:** D-F5-2 / `CO-F5-001` — Leaflet + OSM sustituye Google Maps JS en `/explorar`. El filtro de negocio sigue siendo radio Haversine (`US-GEO-02`: `lat`/`lng`/`radiusKm`). El enlace/embed de reseñas Google (`US-REV-03`) no se toca. Clustering de markers al alejar zoom es Should. Sincronizar la lista al viewport (pan/zoom) es Should; no sustituye el radio. Attribution OSM visible.

>
> **UX:** Delta de `UF-GEO-01` / `WF-explorar-geo` (motor de mapa). **QA:** actualizar `TC-GEO-matrix.md` — reemplazar EC-08 "sin Maps key" por casos del nuevo motor.
