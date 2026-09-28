# User Story — US-BRAND-02

> **ID:** US-BRAND-02  
> **Título:** Tema del proveedor en toda su sesión  
>
> **Como:** PROVIDER autenticado  
> **Quiero:** ver primario y secundario aplicados en panel, POS, órdenes, dashboard y también en `/explorar` si entro logueado  
> **Para:** reconocer mi marca mientras opero la plataforma  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que tengo colores válidos guardados, cuando navego panel proveedor, POS, `/proveedor/ordenes`, dashboard y `/explorar` **con sesión PROVIDER**, entonces CTAs, focus ring y acentos usan esos colores (tokens scoped a la sesión).
> - [ ] **Escenario 2 (CLIENT / ADMIN):** Dado un CLIENT o ADMIN autenticado (o invitado), cuando uso `/explorar` o `/fruteria/[id]`, entonces veo la marca de **plataforma** (`--brand` global), no los colores de cada frutería en el chrome.
> - [ ] **Escenario 3 (Fallback):** Dado que el proveedor no configuró colores o los guardados fallan contraste, cuando entra a su sesión, entonces se aplican tokens de plataforma sin romper la UI.
> - [ ] **Regla de Negocio:** D-F5-6. El tema **no** pinta el marketplace para CLIENT (cada card con una marca distinta). Estados de pedido (PENDING, etc.) siguen usando tokens de feedback F3 (nunca solo color de marca). Logout restaura marca de plataforma.

>
> **UX:** Tokens CSS por sesión; no rediseñar pantallas F3/F4, solo theming. **QA:** sesión PROVIDER vs CLIENT vs invitado; logout limpia tema.
