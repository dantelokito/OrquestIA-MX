# User Story — US-GEO-22

> **ID:** US-GEO-22  
> **Título:** El radio de búsqueda va de 500 m a 10 km  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** buscar fruterías desde media manzana hasta 10 km  
> **Para:** no barrer 25 km y sí poder acotar a 500 m  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Rango y búsqueda):** Dado un pin, cuando pongo el slider en el mínimo, entonces `radiusKm=0.5`, el círculo tiene **500 m** de radio, y `GET /api/providers` filtra Haversine con ese valor (mismas reglas `US-GEO-02` / `US-GEO-10`). Cuando lo pongo en el máximo, entonces `radiusKm=10` y la lista/markers coinciden con 10 km. **No** se puede elegir 1 km como mínimo ni 25 km como máximo.
> - [ ] **Escenario 2 (URL y clamp):** Dado `?radiusKm=22` o `=0` o ausente, cuando cargo `/explorar`, entonces 22 → **10**, 0 → **0.5**, ausente con pin → **10** (default `US-GEO-11`). El servidor aplica el **mismo** clamp 0.5–10. FE no redondea 0.5 a 1 (`Math.round` actual rompe el mínimo).
> - [ ] **Escenario 3 (Copy y empty):** Dado R &lt; 1 km, cuando se muestra el valor, entonces copy en **metros** (ej. “Radio: 500 m”, “N fruterías a 500 m”, extremos del slider “500 m” … “10 km”). Dado R ≥ 1 km, entonces km (ej. “1.5 km”, “10 km”) sin “25 km”. CTA “Ampliar radio” incrementa sin pasar de 10 y **no se muestra** si ya está en 10. Pan/zoom no cambian R.
> - [ ] **Regla de Negocio:** ID018. `CO-F8-001` revoca el clamp 1–25 de `D-F7-3`. Param **`radiusKm`** (decimal). Paso del slider **0.5 km**. Default **10 km**. Sin Places, sin bbox Must, sin cambiar el motor Leaflet.
>
> **Arquitecto:** un solo clamp FE+BE; tests 0.5 y 10. **QA:** seed a 500 m vs 10 km; bookmark viejo 25; pan no mueve R.
