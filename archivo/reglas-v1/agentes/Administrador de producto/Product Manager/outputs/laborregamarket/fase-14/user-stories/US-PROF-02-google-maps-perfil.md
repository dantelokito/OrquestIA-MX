# User Story — US-PROF-02

> **ID:** US-PROF-02  
> **Título:** Google Maps en Perfil (Place ID, URL, reseñas; lock si no verificado)  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** configurar Place ID, URL de Maps y el toggle de reseñas **en Perfil**, con el mismo candado de verificación que hoy  
> **Para:** que la vitrina muestre Maps/reseñas solo si el negocio está verificado, sin esconder esa config al final del Catálogo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado `isVerified === true` en la sucursal activa, cuando en Perfil guardo un `googlePlaceId` y/o `googleMapsUrl` válidos (mismas reglas `isValidGooglePlaceId` / `isValidGoogleMapsUrl`) y `googleReviewsEnabled`, entonces el PATCH existente los persiste y la vitrina los consume **sin** cambio de semántica. El bloque vive en `/proveedor/perfil`, no en Catálogo. Copy aclara que Maps/reseñas dependen de la verificación.
> - [ ] **Escenario 2 (Validación/Error):** Dado `isVerified === false` (o `googleReviewsLocked`), cuando intento editar Place ID, URL o el toggle de reseñas, entonces los controles están **bloqueados** (no editables) y un PATCH forzado responde con el error de negocio actual (`GoogleReviewsLockedError` / 403 equivalente). Place ID o URL con formato inválido → **400** y no se persiste. Sin auth / sucursal ajena → **401/403**. CLIENT no configura Maps de una frutería.
> - [ ] **Regla de Negocio:** D-F14-2, D-F14-5, D-F14-22. El gate de verificación **no** se relaja en F14. Cambiar dirección/coords en `US-PROF-03` **no** desbloquea ni bloquea este módulo por sí solo (sigue dependiendo de `isVerified`). Envelope ADR-003. UX puede añadir previsualización o validador visible de URL; **no** es rediseño de Explorar/mapa cliente.

>
> **UX:** sub-módulo Google en Perfil; estado locked vs editable evidente; 4 estados. **Arquitecto:** sin cambio de contrato salvo path de UI; conservar errores actuales. **QA:** verificado vs no verificado; 400 de formato; IDOR entre sucursales.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §2.3
- **UI hoy:** bloque Google de `ProviderSettingsForm` en Catálogo

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-PROF-02-google-maps-perfil.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
