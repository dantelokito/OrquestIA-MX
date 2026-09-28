# User Story — US-EXPLORE-09

> **ID:** US-EXPLORE-09  
> **Título:** Header EXPLORAR con typeahead de fruterías en todo el radio  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** sugerencias dinámicas de fruterías por producto activo o nombre similar **en todo el radio**, no solo la página actual  
> **Para:** encontrar fruterías sin depender del listado paginado  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Corpus y formato):** Dado pin + radio válidos, cuando escribo ≥2 caracteres, entonces el typeahead sugiere **solo fruterías** del radio (aunque no estén en la página actual). Cada fila: **portada a la izquierda + nombre**. No listar SKUs/frutas como filas.
> - [ ] **Escenario 2 (Intenciones):** Dado texto de producto activo (p. ej. mango) o nombre similar de frutería, cuando hay matches en radio, entonces aparecen esas fruterías. El índice de productos es **interno** (por negocio; solo activos/disponibles); no hay lista fija global de frutas.
> - [ ] **Escenario 3 (Selección y clear):** Al seleccionar una sugerencia, se aplica el filtro, el catálogo de cards se actualiza y hay **aviso ligero** en la barra de que hay filtro. La **tacha** del input vacía texto **y** filtros (vuelve al listado geo del radio sin `q`). Sin pin/radio válido: no inventar matches.
> - [ ] **Regla de Negocio:** DT-F9-002 / BL-161. `CO-F9-001`. Header enriquecido **solo** en `/explorar`. Arquitecto decide suggest vs `q`+geo. Sign-off F8 **intacto**.
>
> **UX:** typeahead minimalista; chip/aviso; tacha; empty sin pin. **Arquitecto:** contrato suggest o listing no paginado para índice. **QA:** mango sugiere fruterías fuera de página 1; tacha limpia; sin pin no inventa.
