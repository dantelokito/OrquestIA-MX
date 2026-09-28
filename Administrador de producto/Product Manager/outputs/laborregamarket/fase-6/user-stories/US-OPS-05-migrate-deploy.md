# User Story — US-OPS-05

> **ID:** US-OPS-05  
> **Título:** Cadena `migrate deploy` F2→F5 en cada entorno  
>
> **Como:** PROVIDER / ADMIN en un entorno que no es el laptop de QA  
> **Quiero:** que el schema de reviews, direcciones y colores exista  
> **Para:** no ver 500 en picker de marca, sesión `brand` o reseñas como si “la UI estuviera rota”  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Cadena):** Dado un entorno con migraciones pendientes F2→F5, cuando se corre `npx prisma migrate deploy`, entonces aplican en orden: audit/contact/media, orders F3, reviews/addresses/notify-scale F4, `primary_color`/`secondary_color` F5 (cierra espíritu **OBS-F5-023** / **DEV-P1-003**).
> - [ ] **Escenario 2 (CI/staging):** Dado el pipeline de `US-OPS-04`, cuando el job llega a tests, entonces migrate ya corrió; no se asume schema “porque QA local lo tenía”.
> - [ ] **Regla de Negocio:** Sin migración de **producto** nueva en este US. Script opcional `"db:migrate": "prisma migrate deploy"`. Windows: parar `next dev` antes de `prisma generate` (DLL).

>
> **Backend + DevOps.** **UX:** 500 de session/colores se cubre en `US-BRAND-03`, no aquí.
