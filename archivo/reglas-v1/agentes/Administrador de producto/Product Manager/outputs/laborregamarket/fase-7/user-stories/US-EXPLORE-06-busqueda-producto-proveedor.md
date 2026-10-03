# User Story — US-EXPLORE-06

> **ID:** US-EXPLORE-06  
> **Título:** La barra busca fruterías y productos del catálogo  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** escribir en “Buscar fruterías, frutas, verduras” y ver proveedores que venden ese producto o coinciden en nombre  
> **Para:** encontrar mango (o la frutería) dentro del radio  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Producto):** Dado `q=mango` (≥2 caracteres), cuando busco, entonces la lista y markers son proveedores con **producto activo** cuyo nombre/slug coincide, **y** dentro del radio vigente si hay geo.
> - [ ] **Escenario 2 (Nombre de frutería):** Dado `q` que coincide con el nombre comercial, cuando busco, entonces ese proveedor entra al result set (unión con match de producto, no XOR excluyente salvo que UX documente otra cosa — **Must: unión**).
> - [ ] **Escenario 3 (Vacío):** Dado sin matches, cuando la API viene vacía, entonces empty + CTA limpiar búsqueda; `total=0` (`US-GEO-13`).
> - [ ] **Regla de Negocio:** ID010. Promueve `US-EXPLORE-02`. Case-insensitive. Combinable con `lat`/`lng`/`radiusKm`. Productos inhabilitados no matchean.
>
> **Arquitecto:** query `q` en GET providers. **QA:** mango + radio; nombre parcial.
