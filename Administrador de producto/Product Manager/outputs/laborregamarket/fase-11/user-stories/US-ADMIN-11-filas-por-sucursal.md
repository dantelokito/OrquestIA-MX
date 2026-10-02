# User Story — US-ADMIN-11

> **ID:** US-ADMIN-11  
> **Título:** Admin lista y flagea cada sucursal por separado  
>
> **Como:** ADMIN  
> **Quiero:** ver una fila por `Provider` (sucursal) con los flags F10  
> **Para:** verificar o apagar una sucursal sin afectar a las otras del mismo dueño  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado El Paraíso con 2 sucursales y Campo Verde con 1, cuando abro `/admin` tab Proveedores, entonces hay **tres** filas (dos El Paraíso + Campo Verde). Flags `isVerified`, `isActive`, mayoreo y domicilio aplican **solo** a esa fila.
> - [ ] **Escenario 2 (Error / no colateral):** Dado verifico o desactivo **El Paraíso Tecnológico**, cuando recargo, entonces la sucursal Centro y Campo Verde **no** cambian de flags. PROVIDER o CLIENT sin permiso ADMIN reciben **403** en el PATCH. 401 sin token.
> - [ ] **Regla de Negocio:** Extiende `US-ADMIN-03` (F10, no reabrir el archivo). Side-effect Google Reviews (`US-REV-04`) sigue por sucursal. Sin CRUD de usuarios ni `US-ADMIN-04`.

>
> **UX:** tabla existente + columna/nombre de sucursal. **Arquitecto:** id = `Provider.id`. **QA:** flags no cruzan sucursales.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-11/prd.md`
- **US F10 (solo lectura):** `US-ADMIN-03`
- **Backlog:** `BL-196`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/user-stories/US-ADMIN-11-filas-por-sucursal.md`
- **Agente Downstream:** UX/UI, Arquitecto, Frontend, Backend
- **Fase / Proyecto:** 11 / laborregamarket
