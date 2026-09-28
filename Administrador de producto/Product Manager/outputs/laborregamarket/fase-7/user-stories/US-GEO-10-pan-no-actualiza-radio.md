# User Story — US-GEO-10

> **ID:** US-GEO-10  
> **Título:** Pan y zoom no cambian el radio; el slider y la dirección sí  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** mover el mapa para mirar sin que se recalcule el radio, y al arrastrar el slider ver el círculo y el zoom en armonía  
> **Para:** no romper UX ni el sistema después de geolocalizarme  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Pan/zoom ≠ radio):** Dado un centro y `radiusKm` vigentes, cuando hago pan o pinch/zoom, entonces slider, círculo (km), URL `radiusKm` y lista **no cambian**. No hay refetch por pan.
> - [ ] **Escenario 2 (Slider → mapa):** Dado el slider 1–25 km, cuando lo arrastro, entonces el círculo cubre ese km, el mapa **encuadra** el círculo, y `GET ... lat&lng&radiusKm` refresca lista y markers al mismo result set.
> - [ ] **Escenario 3 (Dirección / GPS):** Dado “Usar mi ubicación” o una nueva dirección en “Buscar dirección”, cuando se resuelve el centro, entonces el pin se mueve, el radio vigente se aplica (default 10 si no hay valor), y el slider **sigue operable** (no crash, no NaN).
> - [ ] **Regla de Negocio:** ID001, ID002, ID004. `CO-F7-001` anula D-F6-9. Clamp 1–25. Haversine `US-GEO-02`. Círculo visible si hay coords.
>
> **UX:** delta `UF-GEO-01`. **Arquitecto:** no derivar radio del viewport. **QA:** GPS + slider; pan no cambia copy N/R.
