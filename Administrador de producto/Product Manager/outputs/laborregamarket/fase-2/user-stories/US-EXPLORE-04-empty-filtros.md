# User Story — US-EXPLORE-04

> **ID:** US-EXPLORE-04  
> **Título:** Empty state cuando filtros no devuelven resultados  
>
> **Como:** cliente que explora con filtros restrictivos  
> **Quiero:** ver un mensaje claro cuando no hay fruterías que coincidan  
> **Para:** entender que no es un error del sistema y saber cómo ampliar la búsqueda  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Sin resultados):** Dado que filtros activos no devuelven proveedores, cuando la API responde `data: []`, entonces se muestra `EmptyState` con título "No encontramos fruterías" y descripción contextual según filtros aplicados.
> - [ ] **Escenario 2 (CTA limpiar):** Dado que veo empty state, cuando hago clic en "Limpiar filtros", entonces URL y chips se resetean y se muestra listado completo.
> - [ ] **Escenario 3 (Mapa vacío):** Dado que no hay resultados, cuando veo explorar, entonces el mapa no muestra marcadores erróneos; mensaje coherente con lista.
> - [ ] **Regla de Negocio:** Distinguir empty por filtros vs error de red (usar `ErrorBanner` solo en fallo API).
