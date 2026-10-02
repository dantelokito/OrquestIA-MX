# User Story — US-GEO-21

> **ID:** US-GEO-21  
> **Título:** El selector de radio ocupa menos alto y no tapa el mapa  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** ajustar el radio desde el pie del mapa sin una franja alta de label + slider + ticks  
> **Para:** ver más mapa y seguir buscando por distancia  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Overlay más bajo):** Dado el mapa con pin, cuando se muestra el control de radio (hoy `absolute inset-x-0 bottom-0` + label “Radio: N” + `input[type=range]` `h-11` + fila “1 km / 25 km”), entonces el bloque es **visiblemente más bajo** que F7: menos padding, sin tres filas apiladas de label + pista + extremos si se pueden fusionar. El slider **sigue** siendo un range (no se sustituye por un select de presets).
> - [ ] **Escenario 2 (Operable):** Dado el overlay compacto, cuando arrastro o uso flechas/teclado, entonces el radio cambia, el círculo se encuadra y la lista se refetcha (paridad `US-GEO-10` escenario 2, con el rango de `US-GEO-22`). El control no tapa markers del centro del mapa; z-index overlay &lt; popups de marker si aplica.
> - [ ] **Escenario 3 (Hint de máximo):** Dado que el usuario llega al máximo, cuando aplica, entonces el aviso de tope **no** añade una cuarta fila tipo `RadiusClampHint` “Máximo 25 km” con `mb-2`. El tope se lee en el propio chrome (label o extremos). Copy de tope = **10 km** (`US-GEO-22`).
> - [ ] **Regla de Negocio:** ID017. D-F8-12. `CO-F8-001`. GPS, FilterBar y mapa Leaflet no se rediseñan. Pan/zoom **no** mueven el radio (`CO-F7-001`).
>
> **UX:** compactar sin perder el valor actual a la vista. **QA:** overlay no cubre el círculo entero; teclado; no regresionar empty borrega.
