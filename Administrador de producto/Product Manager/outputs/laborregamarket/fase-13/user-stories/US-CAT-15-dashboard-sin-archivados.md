# User Story — US-CAT-15

> **ID:** US-CAT-15  
> **Título:** Dashboard sin ocultos, base GLOBAL al registrar, bandeja para restaurar  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** que el listado operativo no muestre lo que oculté, que un negocio nuevo siga viendo la base GLOBAL, y una zona mínima al pie para restaurar  
> **Para:** trabajar un catálogo usable sin arrancar vacío y sin perder lo «eliminado de la vista»  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un negocio **recién registrado** (cero ofertas, cero `archivedAt`), cuando abro `/proveedor` catálogo, entonces veo la **base GLOBAL** activa de plataforma (como hoy: filas para activar, típicamente Inactivo) **más** mis LOCAL si los creo. Dado que el admin da de alta un GLOBAL **después** de que yo ya opero, cuando recargo el dashboard, entonces esa fila **aparece** (D-F13-23); puedo ocultarla con `US-CAT-14`. Dado que oculté N productos (`US-CAT-14`), cuando recargo el GET del dashboard, entonces esas N filas **no** están en el listado ni saturan secciones. Al pie, colapsado por defecto, veo «Eliminados de la vista» (lista corta: nombre, fecha de ocultamiento, **Restaurar**). Al restaurar, la fila vuelve al dashboard con el `isAvailable` que tenía; no se crea un SKU nuevo. Si el SKU maestro está `isActive=false`, restaurar **no** lo hace vendible hasta que admin rehabilite. Inventario (`/proveedor/inventario`) y POS **no** listan ocultos como vendibles.
> - [ ] **Escenario 2 (Validación/Error):** Dado `?archived=1` (o el endpoint que defina Arquitecto) sin auth o de otra sucursal, entonces **401/403**. Restaurar un id que no es mío → **403/404**. Restaurar dos veces el mismo ítem ya visible → **409** o no-op documentado, sin duplicar unique. Bandeja vacía: empty mínimo, no spinner eterno. Copy de error recuperable si falla el PATCH de restaurar.
> - [ ] **Regla de Negocio:** D-F13-4, D-F13-6, D-F13-9, D-F13-10, D-F13-23. GET panel **excluye** `archivedAt` (enmienda ADR-022: el panel ya no es «catálogo completo» respecto a ocultos; Inactivos **sí** siguen). No es Must esconder la base GLOBAL no archivada. Envelope ADR-003. AUDIT ENABLE/`archived: false` al restaurar.

>
> **UX:** pie colapsado; no saturar el módulo. **Arquitecto:** contrato GET dashboard vs `?archived=1`. **QA:** onboarding con GLOBAL; ocultos fuera; inventario/POS.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **US:** `US-CAT-14`, `US-INV-04` (inventario no debe saturarse con ocultos)
- **Código hoy:** `getProviderCatalog` mezcla todos los GLOBAL activos

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/user-stories/US-CAT-15-dashboard-sin-archivados.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
