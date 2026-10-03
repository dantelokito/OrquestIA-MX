# User Story — US-SEED-01

> **ID:** US-SEED-01  
> **Título:** Seed y login demo El Paraíso ×2 y Campo Verde ×1  
>
> **Como:** desarrollador o QA en localhost  
> **Quiero:** cuentas demo que cubran N=2 y N=1  
> **Para:** probar switcher, módulo global y el control negativo sin seed manual  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `prisma/seed.ts` ejecutado, cuando abro `/login` en no-producción, entonces el bloque demo muestra `admin@laborregamarket.mx`, `frutas@elparaiso.mx` (2 fruterías), `verduras@campoverde.mx` (1 frutería) y `cliente@demo.mx`. Password `Demo1234!`. El Paraíso tiene `Frutas El Paraíso` (Constitución 1200, Centro) y **El Paraíso Tecnológico** (Av. Eugenio Garza Sada 2501, Tecnológico, Monterrey; coords distintas al Centro).
> - [ ] **Escenario 2 (Higiene / error):** Dado `NODE_ENV=production` (criterio `US-SEC-03`), cuando cargo `/login`, entonces el bloque demo **no** se muestra. Seed no fusiona catálogos entre las dos sucursales de El Paraíso ni convierte Campo Verde en sucursal de El Paraíso.
> - [ ] **Regla de Negocio:** D-F11-4. Campo Verde = control N=1 (sin switcher, sin módulo `US-DASH-11`). No tercer proveedor demo.

>
> **UX:** fila extra en `DemoAccountsBlock`. **Arquitecto / BE:** seed 1:N. **QA:** fixtures alineados.

## Inputs Utilizados

- **Seed:** `outputs/laborregamarket/fase-11/seed-demo.md`
- **Backlog:** `BL-195`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-SEED-01-demo-paraiso-campoverde.md`
- **Agente Downstream:** Backend, Frontend, QA
- **Fase / Proyecto:** 11 / laborregamarket
