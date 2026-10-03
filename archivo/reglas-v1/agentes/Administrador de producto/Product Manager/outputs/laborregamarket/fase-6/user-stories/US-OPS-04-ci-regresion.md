# User Story — US-OPS-04

> **ID:** US-OPS-04  
> **Título:** Pipeline de regresión en CI  
>
> **Como:** equipo de producto / QA  
> **Quiero:** que cada push corra Postgres + migrate + `build`/`start` + Playwright  
> **Para:** no depender del laptop de QA y dejar de firmar “APROBADO CON CONDICIONES” por falta de CI  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Happy path CI):** Dado un runner limpio, cuando corre el workflow, entonces: servicio `postgres:15`, `npm ci`, `npx prisma migrate deploy`, seed de **test** (no prod), `npm run build` y `npm start` en un puerto, suite Playwright con `PLAYWRIGHT_BASE_URL` a ese servidor.
> - [ ] **Escenario 2 (Prohibido next dev):** Dado el workflow, cuando se ejecuta la suite, entonces **no** usa `next dev` (QA F5: compile on-demand + workers paralelos → 500).
> - [ ] **Regla de Negocio:** D-F6-2. Cierra **DEV-P0-002**. Condición abierta de QA F1→F5. Credenciales seed (`Demo1234!` / `cliente@demo.mx`) solo CI/local. YAML es **DevOps**, no Backend/Frontend.

>
> **DevOps:** dueño. Contrato QA: `QA Automation Engineer/.../comun/env-requirements.md` (bloque *local* no se copia a CI). **QA:** el gate “Regresión automatizada en staging/QA” deja de estar PENDIENTE cuando este US está Done.
