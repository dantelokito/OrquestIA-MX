# User Story — US-AUTH-09

> **ID:** US-AUTH-09  
> **Título:** Inicio de sesión desde móvil u otro navegador  
>
> **Como:** CLIENT o PROVIDER  
> **Quiero:** iniciar sesión en un teléfono o en otro dispositivo/navegador  
> **Para:** usar Explorar y favoritas fuera del desktop original  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Móvil):** Dado credenciales válidas, cuando envío login en Safari o Chrome móvil (mismo entorno staging/prod), entonces obtengo sesión usable (no loop, no 401 inmediato en `/api/me` o equivalente).
> - [ ] **Escenario 2 (Otro desktop):** Dado login en navegador B, cuando abro la app, entonces la sesión es independiente y válida (no “solo funciona en el primer browser”).
> - [ ] **Escenario 3 (Cookie insegura):** Dado staging/prod HTTPS, cuando se setea la cookie JWT, entonces flags (`Secure`, `SameSite`, `Path`, `Domain`) permiten first-party en móvil. Documentado en ADR si hay excepción local HTTP.
> - [ ] **Regla de Negocio:** ID008. Must F7. No seed QA en prod. Distinto de `US-AUTH-08` (secret por entorno); este es **portabilidad de sesión**.
>
> **Arquitecto:** ADR cookie/header. **FE:** credentials/cors. **QA:** matriz iOS/Android + segundo Chrome.
