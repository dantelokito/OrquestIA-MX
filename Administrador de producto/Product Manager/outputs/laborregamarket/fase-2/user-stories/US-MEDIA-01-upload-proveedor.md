# User Story — US-MEDIA-01

> **ID:** US-MEDIA-01  
> **Título:** Proveedor sube logo y portada del negocio  
>
> **Como:** dueño de frutería (PROVIDER)  
> **Quiero:** subir y actualizar el logo y la imagen de portada de mi negocio  
> **Para:** que mi frutería se vea profesional en explorar y en la página de detalle  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso — logo):** Dado que tengo entidad `Provider` y sesión PROVIDER, cuando subo un archivo JPEG/PNG/WebP ≤ 5MB como logo, entonces `logoUrl` se actualiza y la imagen aparece en panel proveedor y en mi tarjeta en `/explorar`.
> - [ ] **Escenario 2 (Exitoso — portada):** Dado que subo imagen de portada válida, cuando guardo, entonces `coverUrl` se actualiza y se muestra en hero de `/fruteria/[id]`.
> - [ ] **Escenario 3 (Validación/Error):** Dado que subo archivo > 5MB o formato no permitido, cuando envío, entonces recibo 400 con mensaje claro y no se actualiza URL.
> - [ ] **Regla de Negocio:** Solo el PROVIDER dueño del negocio puede subir media de su `Provider`; evento `MEDIA_UPLOAD` en AUDIT.
