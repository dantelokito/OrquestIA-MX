# User Story — US-GEO-02

> **ID:** US-GEO-02  
> **Título:** API de proveedores filtra por distancia  
>
> **Como:** Frontend de `/explorar`  
> **Quiero:** enviar `lat`, `lng` y `radiusKm` a `GET /api/providers`  
> **Para:** recibir solo proveedores dentro del radio pedido, ya ordenados por cercanía  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `lat`, `lng` y `radiusKm` válidos, cuando se llama al endpoint, entonces responde solo proveedores con distancia (Haversine sobre `latitude`/`longitude`) ≤ `radiusKm`, ordenados por distancia ascendente, combinable con `category`/`q`/`verified`.
> - [ ] **Escenario 2 (Parámetros parciales):** Dado que solo se envía `lat`/`lng` sin `radiusKm`, cuando se llama al endpoint, entonces se aplica un radio por defecto documentado (ej. 10 km).
> - [ ] **Escenario 3 (Inválido):** Dado `radiusKm` fuera de rango (ej. 0 o > 25) o coordenadas fuera de bounding box válido, cuando se llama, entonces responde 400 con envelope de error estándar (ADR-003).
> - [ ] **Regla de Negocio:** Performance: con el volumen actual (decenas de proveedores) no se requiere índice geoespacial dedicado; documentar si escala a cientos.
>
> **UX:** N/A (contrato). **QA:** pendiente matriz (incluir límites de radio y coordenadas fuera de Nuevo León).
