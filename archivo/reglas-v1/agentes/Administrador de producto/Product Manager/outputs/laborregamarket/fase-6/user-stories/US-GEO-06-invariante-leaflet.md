# User Story — US-GEO-06

> **ID:** US-GEO-06  
> **Título:** Invariante Explorar Leaflet/OSM (no reintroducir Maps JS)  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** seguir viendo el mapa Open Source **sin** clave de Google  
> **Para:** no volver al empty “Mapa no disponible” (OBS-F4-023) si alguien completa el checklist F4  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Sin key):** Dado un entorno **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, cuando abro `/explorar`, entonces el mapa Leaflet + teselas OSM (o CDN equivalente) renderiza; la lista sigue usable si las teselas fallan.
> - [ ] **Escenario 2 (Prohibiciones):** Dado el bundle de Explorar, cuando se revisa F6, entonces **no** hay `@vis.gl/react-google-maps` en `/explorar` y **no** se exige Maps JS key como Must de GEO.
> - [ ] **Regla de Negocio:** D-F5-2 / `CO-F5-001` / **DEV-P1-006**. `NEXT_PUBLIC_OSM_TILE_URL` opcional. Embed/enlace de reseñas Google (`US-REV-03`) **intacto**. Arquitecto ya alineó el checklist F4 en `infra-requirements.md`.

>
> **UX:** ya en handoff FE 16/08. **QA:** no reabrir OBS-F4-023.
