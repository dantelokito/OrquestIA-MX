# User Story — US-MEDIA-06

> **ID:** US-MEDIA-06  
> **Título:** Imágenes en disco local (logo, portada y productos)  
>
> **Como:** PROVIDER o ADMIN  
> **Quiero:** subir logo, portada y fotos de los productos que ofrezco y que se sirvan desde el propio servidor  
> **Para:** tener vitrina visual sin contratar cloud de imágenes en esta fase  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Logo y portada):** Dado sesión PROVIDER dueño, cuando subo JPEG/PNG/WebP ≤ 5MB como logo (perfil) o portada, entonces el archivo queda en almacenamiento **local**, `logoUrl` / `coverUrl` apuntan a ese recurso (mismo origin o path `/uploads/…` que Arquitecto defina), y se ve en panel, `/explorar` (tarjeta) y hero de `/fruteria/[id]`. Reemplazar borra o sustituye el archivo anterior. Otro PROVIDER recibe 403 si intenta escribir mis archivos.
> - [ ] **Escenario 2 (Productos del catálogo que ofrezco):** Dado un producto **local** (`US-CAT-02`) o un global que ya activé, cuando subo imagen válida, entonces se guarda en disco y se muestra en `/proveedor`, detalle y POS/Encargar de **mi** negocio. ADMIN sube imagen de `Product` **global** por el mismo mecanismo de disco (no Cloudinary). `US-MEDIA-03` aplica (formato/tamaño → 400, sin mutar URL previa).
> - [ ] **Regla de Negocio:** D-F10-8 / `CO-F10-002`. **Won't F10:** Cloudinary, S3, Imgix, CDN. Validar MIME real (no solo extensión); nombres de archivo opacos (sin path traversal). AUDIT `MEDIA_UPLOAD`. Rate limit. Placeholders F2 si no hay imagen. No ejecutar archivos subidos.

>
> **UX:** dropzone existentes; preview local; sin copy de “nube”. **Arquitecto:** ADR disco vs ADR-006 aparcado; cómo se sirve el estático. **QA:** cero SDK cloud; aislamiento entre providers; MEDIA-03.
