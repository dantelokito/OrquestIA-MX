# User Story — US-GEO-16

> **ID:** US-GEO-16  
> **Título:** Empty de radio reutiliza el loader borrega, un poco más grande  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** ver la misma animación de la borrega (B1 → B2 → B3) cuando no hay fruterías en el radio, un poco más grande que al cargar  
> **Para:** que el vacío no se sienta roto y se reconozca la marca  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Loading):** Dado un refetch de lista (slider, dirección, GPS, favorita — no pan), cuando la API aún no responde, entonces la zona de lista muestra el loop **B1 → B2 → B3** (`comun/brand/loader-borrega/`) en **tamaño loading** (token UX); `aria-busy="true"`; mapa y círculo visibles. Mismo componente que `US-GEO-08` (no un loader nuevo).
> - [ ] **Escenario 2 (Empty radio):** Dado `total=0` y fetch **terminado** (no error), cuando no hay proveedores en el radio, entonces se muestra el **mismo** loop borrega en **tamaño empty** (ligeramente mayor que loading; prop/`size`, **sin PNG nuevos**), más el copy y CTA de `US-GEO-13` / F5 (“Ampliar radio”). `aria-busy` **false**.
> - [ ] **Escenario 3 (Error ≠ empty):** Dado fallo de API, cuando el refetch falla, entonces ErrorBanner + Reintentar; **no** se trata como empty de borrega.
> - [ ] **Regla de Negocio:** ID012. Reutilizar, no sustituir. `prefers-reduced-motion` = solo B1. No splash. Copy de total sigue `US-GEO-13`.
>
> **UX:** tokens `loader.size.loading` vs `loader.size.empty` (~+15–25%, tú fijas). **QA:** loading vs empty vs 500.
