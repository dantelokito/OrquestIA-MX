# User Story — US-GEO-07

> **ID:** US-GEO-07  
> **Título:** Zoom y slider de radio son el mismo alcance en Explorar  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** ver siempre el círculo de cobertura y que al hacer zoom (o pan) el radio, la barra y la lista de fruterías se actualicen juntos  
> **Para:** que lo que veo en el mapa sea lo mismo que filtra el catálogo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Zoom → radio):** Dado un mapa con pin/centro y círculo visible, cuando termino de hacer zoom o pan (debounce), entonces `radiusKm` se deriva del visualizador (distancia centro→borde), el slider 1–25 km se mueve al mismo valor, el círculo se redibuja y `GET /api/providers?lat&lng&radiusKm` refresca lista y markers **al mismo result set**.
> - [ ] **Escenario 2 (Slider → mapa):** Dado el slider en el pie del mapa, cuando cambio el radio, entonces el círculo cubre ese km, el mapa **encuadra** el círculo y la lista se filtra igual (sin recargar la página). URL `lat`/`lng`/`radiusKm` hidratada; back/forward restaura.
> - [ ] **Escenario 3 (Clamp 25 km):** Dado que alejo el zoom más allá de 25 km, cuando el visualizador pediría un radio mayor, entonces `radiusKm` y el círculo se quedan en **25**, el slider en el tope, y un hint no bloqueante indica el máximo; no se llama bbox.
> - [ ] **Regla de Negocio:** D-F6-9 / `CO-F6-002`. Filtro Must = Haversine `US-GEO-02` (no API bbox). Círculo **siempre visible** si hay coords. Centro = pin / geolocalización / favorita (no se pierde al zoomear). Clustering = Won't F6. `US-GEO-06` (Leaflet/OSM, cero Maps JS) intacto. Debounce al **terminar** pan/zoom, no en cada frame (detalle FE/Arquitecto).

>
> **UX:** delta `UF-GEO-01` / `WF-explorar-leaflet` (ciclo nuevo slice C). **Arquitecto:** reusar `GET /api/providers`; documentar derivación centro→borde + clamp. **QA:** zoom in/out, slider, clamp, lista = markers.
