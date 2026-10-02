# User Story — US-CAT-03

> **ID:** US-CAT-03  
> **Título:** Secciones dinámicas del catálogo del negocio  
>
> **Como:** PROVIDER  
> **Quiero:** crear, renombrar, reordenar y quitar secciones de mi catálogo  
> **Para:** agrupar productos con nombres propios (no solo Fruta/Verdura/Agrícola de plataforma)  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado el panel `/proveedor`, cuando uso «Nueva sección», nombro y guardo, entonces la sección persiste con orden. Puedo renombrar y reordenar. `/fruteria/[id]` y el panel agrupan productos (globales activados y locales) **bajo esas secciones**.
> - [ ] **Escenario 2 (Validación/Error):** Dado una sección con productos, cuando intento eliminarla, entonces recibo 4xx hasta mover o reasignar esos productos (solo se borra sección **vacía**, salvo que UX+Arch definan “mover a Sin sección”). Nombre vacío, duplicado en el mismo negocio o HTML → 400. Otro PROVIDER no crea/edita mis secciones (403).
> - [ ] **Regla de Negocio:** D-F10-6. **Una** lista plana (sin anidar). Las secciones **no** se convierten en chips de FilterBar Explorar (`category` sigue `FRUTA`\|`VERDURA`\|`AGRICOLA` solo para globales / filtro F9). Sugerir Frutas/Verduras/Agrícolas al primer uso = Should, no bloquea nombres custom.

>
> **UX:** control dinámico «Nueva sección»; drag o botones de orden; empty state sin secciones. **Arquitecto:** `ProviderSection` (o equivalente) + orden persistido. **QA:** CRUD sección; aislamiento; detalle agrupado; Explorar sin chips custom.
