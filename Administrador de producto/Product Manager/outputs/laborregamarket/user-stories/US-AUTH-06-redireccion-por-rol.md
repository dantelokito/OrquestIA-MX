# User Story — US-AUTH-06

> **ID:** US-AUTH-06  
> **Título:** Redirección post-login según rol  
>
> **Como:** usuario que acaba de autenticarse  
> **Quiero:** ser llevado automáticamente al área correcta de la aplicación  
> **Para:** no tener que navegar manualmente según mi tipo de cuenta  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (ADMIN):** Dado que inicio sesión como ADMIN, cuando el login es exitoso, entonces soy redirigido siempre a `/admin` independientemente del parámetro `redirect`.
> - [ ] **Escenario 2 (PROVIDER):** Dado que inicio sesión como PROVIDER, cuando el login es exitoso, entonces soy redirigido siempre a `/proveedor` independientemente del parámetro `redirect`.
> - [ ] **Escenario 3 (CLIENT con redirect):** Dado que inicio sesión como CLIENT y la URL de login incluye `?redirect=/explorar`, cuando el login es exitoso, entonces soy redirigido a `/explorar`.
> - [ ] **Escenario 4 (CLIENT sin redirect):** Dado que inicio sesión como CLIENT sin parámetro `redirect`, cuando el login es exitoso, entonces soy redirigido a `/` (home).
> - [ ] **Escenario 5 (Redirect desde middleware):** Dado que intento acceder a `/proveedor` sin sesión, cuando soy enviado a `/login?redirect=/proveedor` y completo login como CLIENT, entonces el redirect a `/proveedor` no debe aplicar (CLIENT no tiene acceso) — debe aplicar lógica de rol o redirigir a home.
> - [ ] **Regla de Negocio:** El parámetro `redirect` solo es efectivo para rol CLIENT. Rutas de redirect deben validarse para evitar open redirects a dominios externos (solo paths internos).
