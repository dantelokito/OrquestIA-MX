# User Story — US-EXPLORE-02

> **ID:** US-EXPLORE-02  
> **Título:** Búsqueda por producto específico  
>
> **Como:** cliente que busca un producto concreto (ej. mango)  
> **Quiero:** ver fruterías que venden ese producto  
> **Para:** comparar precios y opciones cerca de mí  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que busco "mango" en header o explorar, cuando envío búsqueda, entonces `GET /api/providers?q=mango` (o `product=mango`) retorna proveedores con producto activo cuyo nombre/slug coincide.
> - [ ] **Escenario 2 (Sin resultados):** Dado que busco producto que ningún negocio ofrece activo, cuando la API responde vacía, entonces UI muestra empty state con CTA "Limpiar filtros".
> - [ ] **Escenario 3 (Combinación):** Dado que aplico categoría FRUTA y `q=mango`, cuando filtro, entonces resultados cumplen ambos criterios.
> - [ ] **Regla de Negocio:** Búsqueda case-insensitive; mínimo 2 caracteres para disparar query.
