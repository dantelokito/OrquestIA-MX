# User Story — US-EXPLORE-03

> **ID:** US-EXPLORE-03  
> **Título:** Filtros persistentes en URL  
>
> **Como:** cliente que comparte o guarda una búsqueda  
> **Quiero:** que los filtros queden en la URL del navegador  
> **Para:** volver a la misma búsqueda o compartir el enlace con otra persona  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que aplico filtros `?q=mango&category=FRUTA&verified=true`, cuando copio la URL y abro en nueva pestaña, entonces explorar muestra el mismo listado filtrado y chips activos.
> - [ ] **Escenario 2 (Navegación atrás):** Dado que cambio filtros, cuando uso botón atrás del navegador, entonces la UI restaura filtros anteriores desde URL.
> - [ ] **Escenario 3 (Header → explorar):** Dado que busco desde Header, cuando navego a `/explorar?q=...`, entonces el input de explorar refleja el query param.
> - [ ] **Regla de Negocio:** Solo query params documentados en API-PROVIDERS-01; sin open redirect.
