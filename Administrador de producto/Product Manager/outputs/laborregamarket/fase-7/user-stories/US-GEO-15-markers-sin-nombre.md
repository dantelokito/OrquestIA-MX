# User Story — US-GEO-15

> **ID:** US-GEO-15  
> **Título:** Markers sin nombre permanente; icono de negocio pequeño  
>
> **Como:** visitante en el mapa  
> **Quiero:** ver iconos sin nombres empalmados, y el nombre al pasar el cursor o al tocar  
> **Para:** leer el mapa cuando hay muchas fruterías juntas  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Descanso):** Dado N markers, cuando no hay hover/focus/tap, entonces **no** se muestran nombres de frutería sobre el mapa.
> - [ ] **Escenario 2 (Hover/tap):** Dado desktop, cuando hago hover (o focus teclado), entonces aparece el nombre (tooltip/popup). En táctil, tap en el icono muestra el nombre; segundo tap o CTA abre preview (`US-EXPLORE-05`).
> - [ ] **Escenario 3 (Icono):** Dado el marker, cuando renderiza, entonces es un **icono/emoji de negocio pequeño** (no el label de texto actual). Consistente en todos los markers.
> - [ ] **Regla de Negocio:** ID011. Sin clustering Must. Leaflet/OSM.
>
> **UX:** token de icono; contraste sobre teselas. **QA:** zoom cercano con 10+ markers.
