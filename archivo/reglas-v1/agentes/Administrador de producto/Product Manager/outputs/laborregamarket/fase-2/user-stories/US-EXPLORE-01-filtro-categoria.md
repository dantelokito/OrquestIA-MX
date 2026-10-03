# User Story — US-EXPLORE-01

> **ID:** US-EXPLORE-01  
> **Título:** Filtros por categoría en explorar  
>
> **Como:** cliente que busca frutas o verduras  
> **Quiero:** filtrar fruterías por categoría (frutas, verduras, agrícolas)  
> **Para:** ver solo negocios que ofrecen el tipo de producto que necesito  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso — frutas):** Dado que estoy en `/explorar`, cuando selecciono chip "Frutas", entonces la URL incluye `?category=FRUTA` (o equivalente) y `GET /api/providers` retorna solo proveedores con al menos un `ProviderProduct` activo de categoría FRUTA.
> - [ ] **Escenario 2 (Verduras / agrícolas):** Dado que selecciono "Verduras" o "Agrícolas", cuando la API responde, entonces el listado y mapa reflejan solo negocios con productos de esa categoría.
> - [ ] **Escenario 3 (Deselección):** Dado que tengo un chip activo, cuando lo deselecciono, entonces se elimina el filtro y se muestra listado completo.
> - [ ] **Regla de Negocio:** Cierra OBS-02 Frontend; chips deben reflejar estado activo visualmente.
