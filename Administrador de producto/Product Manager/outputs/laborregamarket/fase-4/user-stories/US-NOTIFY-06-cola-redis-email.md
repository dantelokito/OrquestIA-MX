# User Story — US-NOTIFY-06

> **ID:** US-NOTIFY-06  
> **Título:** Emails de contacto y pedido pasan por cola Redis  
>
> **Como:** Plataforma (Backend)  
> **Quiero:** encolar los envíos de email en Redis/Upstash con un worker  
> **Para:** no perder notificaciones por cold start serverless (cierra ADR-008)  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un evento de contacto o nuevo pedido, cuando ocurre, entonces se encola un job en Redis y un worker lo procesa con reintentos (≤3) sin bloquear la respuesta HTTP (&lt; 200ms se mantiene).
> - [ ] **Escenario 2 (Fallo tras reintentos):** Dado que Resend falla las 3 veces, cuando se agotan los reintentos, entonces se registra `AuditLog` con `notificationFailed: true` (mismo patrón F2), sin reintentos infinitos.
> - [ ] **Regla de Negocio:** Reemplaza el envío in-process fire-and-forget de ADR-008; el rate limit en memoria pasa a Redis (ver US-NOTIFY-07).
>
> **UX:** N/A. **QA:** pendiente matriz (incluir caída de Redis / degradación).
