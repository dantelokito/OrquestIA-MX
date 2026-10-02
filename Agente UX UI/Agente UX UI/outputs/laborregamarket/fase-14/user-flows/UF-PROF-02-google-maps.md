> **Flujo:** Configurar Google Maps y reseñas en Perfil, con candado si el negocio no está verificado
> **Historia de Usuario Asociada:** US-PROF-02
>
> **Punto de entrada:** `/proveedor/perfil` → bloque **Google Maps**. CTA: **Guardar Google**.

> **Pasos del Usuario:**
> 1. `[Perfil]` → El bloque Google vive aquí, no al final de Catálogo.
> 2. `[Condicional — isVerified === true y no locked]` → Campos Place ID, URL de Maps y toggle «Mostrar reseñas de Google» editables. Validación visible de formato (`isValidGooglePlaceId` / `isValidGoogleMapsUrl`). Enlace secundario «Abrir en Google Maps» si la URL es válida (nueva pestaña; **no** es el mapa de Explorar).
> 3. `[Guardar válidos]` → PATCH existente persiste; la vitrina consume sin cambio de semántica. Copy: «Maps y reseñas en la vitrina dependen de la verificación a la borrega».
> 4. `[Condicional — isVerified === false o googleReviewsLocked]` → Controles **bloqueados** (`disabled`, no solo visual). Banner `VerificationRequiredBanner` + texto: «Para publicar Place ID, URL y reseñas tu negocio debe estar verificado». Un PATCH forzado sigue 403 `GoogleReviewsLockedError`.
> 5. `[Condicional — formato inválido]` → 400 inline en el campo; no se persiste. Red / 5xx: Error recuperable en el bloque, valores anteriores visibles.
> 6. `[US-PROF-03]` → Cambiar dirección o coords **no** desbloquea ni bloquea este módulo por sí solo; el gate sigue siendo `isVerified`.

> **Reglas UI:**
> - Locked vs editable debe ser evidente (candado + campos disabled + banner), nunca solo color.
> - No rediseñar Explorar, mapa Leaflet ni reseñas del cliente.
> - 4 estados del bloque: Empty (sin Place ID aún, verificado), Loading (hereda skeleton de página), Error, Success.
> - Wireframe: `WF-PROF-01-05-perfil.md` (estado locked vs editable).

## Inputs Utilizados

- **US:** `US-PROF-02-google-maps-perfil.md`
- **PRD:** D-F14-2, D-F14-5
- **UI hoy:** bloque Google de `ProviderSettingsForm`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-PROF-02-google-maps.md`
- **Agente Downstream:** Frontend Developer
