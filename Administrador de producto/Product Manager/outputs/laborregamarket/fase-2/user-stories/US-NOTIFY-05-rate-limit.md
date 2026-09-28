# User Story — US-NOTIFY-05

> **ID:** US-NOTIFY-05  
> **Título:** Rate limit anti-spam en eventos de contacto  
>
> **Como:** operador de plataforma (ADMIN)  
> **Quiero:** limitar contactos repetidos desde la misma sesión o IP  
> **Para:** proteger proveedores de spam y abuso del sistema de notificaciones  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Límite por sesión):** Dado que la misma sesión/IP hace más de 5 clics de contacto al mismo proveedor en 10 minutos, cuando intenta contactar de nuevo, entonces el evento no genera nuevo email pero la llamada `tel:` sigue funcionando.
> - [ ] **Escenario 2 (Límite global IP):** Dado que una IP supera 20 eventos de contacto en 1 hora, cuando intenta contactar, entonces recibe 429 o silencio en notificación con registro AUDIT `rate_limited`.
> - [ ] **Escenario 3 (Exitoso dentro de límite):** Dado que estoy dentro del límite, cuando contacto, entonces email y AUDIT se procesan con normalidad.
> - [ ] **Regla de Negocio:** Límites configurables vía env; no bloquear acceso público a teléfono del negocio.
