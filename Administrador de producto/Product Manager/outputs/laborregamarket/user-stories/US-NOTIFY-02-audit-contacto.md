# User Story — US-NOTIFY-02

> **ID:** US-NOTIFY-02  
> **Título:** Registro en bitácora de eventos de contacto  
>
> **Como:** operador de plataforma (ADMIN)  
> **Quiero:** que cada intento de contacto quede registrado en la bitácora  
> **Para:** auditar actividad, detectar spam y medir conversión explorar → contacto  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que un usuario hace clic en contacto en `/fruteria/[id]`, cuando se procesa el evento, entonces se crea entrada en `AuditLog` con módulo `PROVIDERS` o acción `CONTACT`/`VIEW`, `entityId` del proveedor, IP opcional y timestamp.
> - [ ] **Escenario 2 (Admin consulta):** Dado que soy ADMIN, cuando filtro bitácora por módulo o acción de contacto, entonces veo los eventos de contacto con proveedor, fecha y metadatos.
> - [ ] **Escenario 3 (Validación/Error):** Dado que falla el envío de email, cuando el evento de contacto se registra, entonces la entrada AUDIT se crea igualmente con flag o detalle de fallo de notificación.
> - [ ] **Regla de Negocio:** No almacenar PII del cliente en bitácora salvo consentimiento explícito futuro.
