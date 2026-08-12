# User Story — US-MEDIA-04

> **ID:** US-MEDIA-04  
> **Título:** Imágenes en explorar y detalle de frutería  
>
> **Como:** cliente que explora fruterías  
> **Quiero:** ver logos, portadas e imágenes de productos cuando existen  
> **Para:** evaluar visualmente la frescura y profesionalidad del negocio  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Card explorar):** Dado que el proveedor tiene `coverUrl` o `logoUrl`, cuando veo su tarjeta en `/explorar`, entonces la imagen se muestra con lazy loading sin bloquear el listado.
> - [ ] **Escenario 2 (Detalle frutería):** Dado que visito `/fruteria/[id]`, cuando el negocio tiene portada, entonces hero muestra cover; productos con `imageUrl` muestran thumbnail en tabla/lista.
> - [ ] **Escenario 3 (Performance):** Dado que hay 20+ tarjetas, cuando cargo explorar, entonces imágenes usan lazy load y skeleton mientras cargan.
> - [ ] **Regla de Negocio:** URLs de storage (Cloudinary/S3) deben ser HTTPS; fallback a placeholder si imagen rota (onerror).
