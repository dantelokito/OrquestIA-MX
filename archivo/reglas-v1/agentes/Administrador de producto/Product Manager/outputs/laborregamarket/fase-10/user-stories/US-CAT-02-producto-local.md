# User Story — US-CAT-02

> **ID:** US-CAT-02  
> **Título:** Proveedor agrega y edita un producto local  
>
> **Como:** PROVIDER  
> **Quiero:** crear un producto que solo existe en mi frutería (nombre, precio, unidad, imagen, sección, disponibilidad)  
> **Para:** vender lo que no está en el catálogo global sin esperarme a ADMIN  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que soy el dueño del negocio, cuando creo un producto local con nombre, precio ≥ 0, unidad, sección de **mi** catálogo e imagen válida **en disco** (`US-MEDIA-06`, **no** Cloudinary ni `POST /api/admin/products/.../image`), entonces aparece en `/proveedor`, en `/fruteria/[id]` (si `isAvailable`) y es vendible en Encargar y POS de **ese** negocio.
> - [ ] **Escenario 2 (Validación/Error):** Dado ese SKU local, cuando otro PROVIDER o un CLIENT lista el detalle de **otra** frutería, entonces el producto **no** aparece y no se puede vender ahí. Alta con nombre vacío, sección ajena, archivo inválido o sin auth PROVIDER → 400/403/401 y sin fila. Inhabilitar (`US-CAT-01`) oculta y bloquea venta (409 en orden/POS).
> - [ ] **Regla de Negocio:** D-F10-5. El SKU **no** entra al catálogo comparable ni al listado de activación de otras fruterías. No auto-global (D-F10-4). Rate limit de altas. Nombre sin HTML. Logo/portada e imagen de producto = `US-MEDIA-06` (disco). `US-MEDIA-03` intacta.

>
> **UX:** CTA alta en `/proveedor` junto al catálogo; formulario; toggle activo; dropzone disco. **Arquitecto:** schema dual + API provider + `US-MEDIA-06`. **QA:** aislamiento entre providers; CAT-01; POS/Encargar del dueño.
