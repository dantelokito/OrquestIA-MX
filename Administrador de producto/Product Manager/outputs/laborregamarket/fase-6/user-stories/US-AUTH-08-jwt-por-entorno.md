# User Story — US-AUTH-08

> **ID:** US-AUTH-08  
> **Título:** JWT y cookie seguros por entorno  
>
> **Como:** operador de CI, staging y producción  
> **Quiero:** un `JWT_SECRET` distinto y ≥ 32 caracteres en cada entorno  
> **Para:** no forjar tokens con el placeholder de `.env.example`  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Secretos distintos):** Dado CI, staging y prod, cuando se inspecciona config, entonces cada uno tiene `JWT_SECRET` propio en secret manager / GitHub Secrets — nunca en YAML ni commiteado.
> - [ ] **Escenario 2 (Cookie):** Dado `NODE_ENV=production`, cuando el usuario inicia sesión, entonces la cookie JWT va con `Secure`. Si staging corre como `development`, el riesgo (cookie sin Secure) está documentado; no copiar el secret de example.
> - [ ] **Regla de Negocio:** Should F6 (**DEV-P1-007**). Seed QA prohibido en prod.

>
> **DevOps.** Sin cambio de UI.
