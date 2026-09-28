# User Story — US-GEO-13

> **ID:** US-GEO-13  
> **Título:** El copy cuenta todas las fruterías del radio, no las de la página  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** ver “N fruterías a R km” con N = todas las que caen en el radio (y filtros)  
> **Para:** no creer que solo hay las 12 de la página actual  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (total > página):** Dado `total=35`, `limit=20`, página 1, cuando renderiza el copy, entonces muestra **35** (no 20) y el radio **R** del slider (ej. 10 o 25 km).
> - [ ] **Escenario 2 (cero):** Dado `total=0`, cuando no hay matches, entonces copy coherente + empty F5 (“Ampliar radio” / limpiar filtros), no “0 de 20”. Visual de lista vacía = **US-GEO-16** (borrega reutilizada, no sustituye este copy).
> - [ ] **Escenario 3 (filtros):** Dado `q` o categoría, cuando el API filtra, entonces `total` es el conteo **filtrado** en el mismo radio.
> - [ ] **Regla de Negocio:** ID006. D-F7-5. FE no usa `items.length` como N.
>
> **Arquitecto:** envelope con `total` (y `page`/`limit`). **QA:** seed > 20 en radio.
