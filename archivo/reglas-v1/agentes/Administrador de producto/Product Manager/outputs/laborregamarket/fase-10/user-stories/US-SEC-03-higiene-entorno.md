# User Story — US-SEC-03

> **ID:** US-SEC-03  
> **Título:** Higiene de entorno y gates 401/403 en rutas nuevas  
>
> **Como:** operador de plataforma  
> **Quiero:** que producción no muestre cuentas demo y que toda ruta F10 nueva falle cerrado sin sesión o con rol incorrecto  
> **Para:** no filtrar secretos de seed ni dejar APIs abiertas  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `NODE_ENV=production` (o flag equivalente documentado por Arquitecto), cuando abro `/login` o `/registro`, entonces **no** se listan emails/contraseñas demo (`cliente@demo.mx`, `admin@laborregamarket.mx`, `Demo1234!`, etc.).
> - [ ] **Escenario 2 (Validación/Error):** Dado cada endpoint **nuevo** de F10 (catálogo local, secciones, CRUD global, PATCH flags), cuando llamo sin cookie JWT, entonces 401; con token CLIENT o PROVIDER en ruta solo-ADMIN, entonces 403.
> - [ ] **Regla de Negocio:** D-F10-1. Cierra OBS-05. Patrón DEV-P2-011 en rutas nuevas. Cookie JWT httpOnly intacta. **No** 2FA ni impersonation (Won't F10).

>
> **UX:** quitar bloque de cuentas demo en prod; en desarrollo puede quedar. **Arquitecto:** criterio de entorno. **QA:** smoke prod-like sin demo copy; rbac.spec en rutas nuevas.
