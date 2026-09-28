# User Story — US-OPS-06

> **ID:** US-OPS-06  
> **Título:** Secretos de staging para notify / media / Redis / Inngest  
>
> **Como:** operador de un entorno compartido  
> **Quiero:** Resend, Cloudinary, Upstash e Inngest configurados  
> **Para:** no desplegar “para ver la UI” y creer que contacto, email o jobs funcionan  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Must staging):** Dado staging/prod, cuando el entorno está listo, entonces existen `RESEND_API_KEY` + `EMAIL_FROM`, `CLOUDINARY_*` si MEDIA está activo, `UPSTASH_REDIS_REST_URL` + `TOKEN`, `INNGEST_EVENT_KEY` + `SIGNING_KEY` (registrar `{APP_URL}/api/inngest`).
> - [ ] **Escenario 2 (WhatsApp):** Dado F6, cuando faltan `WHATSAPP_*`, entonces es no-op **Should** (no bloquea este US ni F5).
> - [ ] **Regla de Negocio:** Should F6 (**DEV-P1-004**). Local sin valor = no-op documentado F2/F4. Prod sin Redis = 503 (`US-NOTIFY-10`), no memoria. Dueño: **DevOps**.

>
> **No es Frontend.** No publicar secretos como `NEXT_PUBLIC_*`.
