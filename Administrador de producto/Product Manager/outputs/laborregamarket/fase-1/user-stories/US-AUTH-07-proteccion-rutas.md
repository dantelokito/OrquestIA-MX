# User Story — US-AUTH-07

> **ID:** US-AUTH-07  
> **Título:** Protección de rutas por rol y sesión  
>
> **Como:** operador de la plataforma  
> **Quiero:** que solo usuarios autorizados accedan a cada área del sistema  
> **Para:** proteger datos de negocios, catálogos admin y operaciones sensibles  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Sin sesión):** Dado que no tengo cookie JWT válida, cuando intento acceder a `/admin`, `/proveedor` o `/cuenta`, entonces soy redirigido a `/login?redirect={pathname}`.
> - [ ] **Escenario 2 (Rutas públicas):** Dado que no tengo sesión, cuando accedo a `/`, `/login`, `/registro` o `/explorar`, entonces la página se muestra sin redirección.
> - [ ] **Escenario 3 (ADMIN-only):** Dado que soy CLIENT o PROVIDER, cuando intento acceder a `/admin` o `/api/catalogs`, entonces soy redirigido a `/` (páginas) o recibo 403/401 (APIs con guard).
> - [ ] **Escenario 4 (PROVIDER-only):** Dado que soy CLIENT o ADMIN, cuando intento acceder a `/proveedor`, entonces soy redirigido a `/`.
> - [ ] **Escenario 5 (CLIENT-only):** Dado que soy PROVIDER o ADMIN, cuando intento acceder a `/cuenta`, entonces soy redirigido a `/`.
> - [ ] **Escenario 6 (Token inválido):** Dado que tengo cookie con JWT expirado o corrupto, cuando navego a ruta protegida, entonces el middleware trata la sesión como inválida y redirige a login.
> - [ ] **Regla de Negocio:** Rutas públicas definidas: `PUBLIC_PATHS = ["/", "/login", "/registro", "/explorar"]`. Prefijos admin: `/admin`, `/api/admin`, `/api/catalogs`, `/api/permissions`, `/api/audit`. Prefijos provider: `/proveedor`, `/api/provider`. Prefijos client: `/cuenta`, `/api/orders`. **Asunción:** middleware actual no protege `/api/*`; cada API route debe implementar su propio guard de sesión y rol.
