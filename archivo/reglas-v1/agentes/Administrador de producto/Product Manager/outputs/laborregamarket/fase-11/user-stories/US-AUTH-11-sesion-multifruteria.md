# User Story — US-AUTH-11

> **ID:** US-AUTH-11  
> **Título:** Un usuario PROVIDER opera N fruterías con sucursal activa  
>
> **Como:** usuario con rol PROVIDER  
> **Quiero:** iniciar sesión una sola vez y tener N negocios `Provider` asociados a mi `User`  
> **Para:** no crear un login por sucursal y que el sistema sepa cuál frutería está activa  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso 1:N):** Dado un `User` PROVIDER con dos o más registros `Provider` (p. ej. `frutas@elparaiso.mx`), cuando inicia sesión, entonces el modelo ya no exige `userId` único, la sesión incluye `activeProviderId` válido de **una** de sus sucursales (última usada o la primera por orden de alta), y las APIs `/api/provider/*` resuelven **esa** sucursal.
> - [ ] **Escenario 2 (Error / IDOR):** Dado un PROVIDER autenticado, cuando pide o muta un recurso de **otra** sucursal suya (id distinto de `activeProviderId`) o de otro dueño, entonces la API responde **403** (no 200 con datos ajenos). Un token inválido o ausente responde **401**.
> - [ ] **Regla de Negocio:** D-F11-1. Visibilidad de switcher y del **módulo** de reportes globales **no** es flag de admin: se deriva de N = cantidad de `Provider` del user. N=1 (Campo Verde) no crea el módulo ni el switcher. Relación: `User` 1:N `Provider`.

>
> **UX:** no rediseñar login. **Arquitecto:** quitar unique `Provider.userId`; persistir `activeProviderId` (cookie/sesión; forma = ADR). **QA:** fixtures El Paraíso N=2 y Campo Verde N=1; IDOR Must.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-11/impacto-modulos.md`
- **Seed:** `outputs/laborregamarket/fase-11/seed-demo.md`
- **Backlog:** `BL-190`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-AUTH-11-sesion-multifruteria.md`
- **Agente Downstream:** Arquitecto, Backend, Frontend
- **Fase / Proyecto:** 11 / laborregamarket
