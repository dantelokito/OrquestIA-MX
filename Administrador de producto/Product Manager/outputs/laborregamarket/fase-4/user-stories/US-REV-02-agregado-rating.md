# User Story — US-REV-02

> **ID:** US-REV-02  
> **Título:** Rating y conteo reales del proveedor  
>
> **Como:** CLIENT explorando fruterías  
> **Quiero:** ver un `rating` y `reviewCount` calculados de reseñas reales  
> **Para:** decidir con base en experiencias verdaderas, no valores del seed  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que se crea/edita/borra un `Review`, cuando se persiste, entonces `Provider.rating` (promedio) y `Provider.reviewCount` se recalculan de forma consistente (síncrono o job corto, a decidir con Arquitecto).
> - [ ] **Escenario 2 (Sin reseñas):** Dado un proveedor sin reseñas, cuando se muestra en `/explorar` o `/fruteria/[id]`, entonces `rating=0` y `reviewCount=0` se presentan como "Sin reseñas todavía", no como estrellas vacías engañosas.
> - [ ] **Regla de Negocio:** El valor del seed deja de usarse como dato real en producción; solo persiste como fallback de demo.
>
> **UX:** Pendiente diseño. **QA:** pendiente matriz.
