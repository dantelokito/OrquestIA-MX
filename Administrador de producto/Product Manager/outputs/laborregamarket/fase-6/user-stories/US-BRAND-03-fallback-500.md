# User Story — US-BRAND-03

> **ID:** US-BRAND-03  
> **Título:** 500 de sesión/colores o catálogo no se lee como empty de negocio  
>
> **Como:** PROVIDER en panel, picker de marca o POS  
> **Quiero:** un error claro y fallback a marca de plataforma si la API falla  
> **Para:** no creer que “no hay productos activos” o que “los colores no se guardaron” cuando el schema o el servidor falló  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Tema):** Dado que `GET /api/auth/session` (brand) responde 500, cuando cargo la sesión PROVIDER, entonces se aplican tokens de **plataforma**, no un chrome roto.
> - [ ] **Escenario 2 (Picker):** Dado que guardar/leer colores falla 500, cuando estoy en el picker, entonces veo ErrorBanner + Reintentar (no un empty mudo).
> - [ ] **Escenario 3 (POS):** Dado que el catálogo API responde 500, cuando abro el POS, entonces veo ErrorBanner; **no** el empty “No hay productos activos”.
> - [ ] **Regla de Negocio:** D-F6-7 / **DEV-P1-003** (superficie UI). `/explorar` lista usable si hay error de red. Distinto de empty de negocio F5 (`US-CAT-01`).

>
> **UX:** ya diseñado — handoff FE 16/08. **QA:** 500 ≠ empty POS de “sin activos”.
