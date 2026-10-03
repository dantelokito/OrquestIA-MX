# User Story — US-NOTIFY-07

> **ID:** US-NOTIFY-07  
> **Título:** Rate limit de contacto compartido entre instancias  
>
> **Como:** Plataforma (Backend)  
> **Quiero:** mover el rate limit de contacto del `Map` in-memory a Redis  
> **Para:** que el límite (5/10min por proveedor+IP, 20/hora por IP) sea consistente entre instancias serverless  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que un usuario supera el límite configurado, cuando intenta contactar de nuevo, entonces recibe 429 con el mismo envelope de error de hoy, sin importar qué instancia atendió la petición.
> - [ ] **Escenario 2 (Reinicio de instancia):** Dado un cold start de la función serverless, cuando ocurre, entonces el conteo de rate limit **no se pierde** (a diferencia del `Map` in-memory actual).
> - [ ] **Regla de Negocio:** Mismos límites y ventanas que ADR-008; solo cambia el store.
>
> **UX:** N/A. **QA:** pendiente matriz.
