# User Story — US-EXPLORE-11

> **ID:** US-EXPLORE-11  
> **Título:** FilterBar sin chips muertos: Mayoreo y Domicilio filtran; Orgánico y Filtros retirados  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** que los chips visibles recorten el catálogo de verdad  
> **Para:** no ver controles disabled de adorno  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Sin adorno):** Ningún chip de FilterBar permanece `disabled` «de adorno». Los chips **Orgánico** y **«Filtros»** **no se muestran** (retirados; D-F9-2).
> - [ ] **Escenario 2 (Mayoreo / Domicilio):** Dado pin + radio, cuando activo Mayoreo o A domicilio, entonces el listing filtra por `offersWholesale=true` / `offersDelivery=true` (AND con geo, `q`, verificado y categoría). La URL refleja el estado (shareable, paridad `US-EXPLORE-03`).
> - [ ] **Escenario 3 (Empty y a11y):** Si el AND deja 0 fruterías, empty copy (no lista fantasma). Chips activos: teclado / `aria-pressed`; targets ≥44px.
> - [ ] **Regla de Negocio:** DT-F9-004 / BL-163. `CO-F9-001`. Sin esquema orgánico. Sign-off F8 **intacto** (FilterBar Won't F8 se cubre aquí, no reopen F8).
>
> **UX:** retirar Orgánico/Filtros; estados pressed de Mayoreo/Domicilio. **Arquitecto:** query listing + documentar API. **QA:** chips disabled ausentes; Mayoreo/Domicilio filtran; URL; empty.
