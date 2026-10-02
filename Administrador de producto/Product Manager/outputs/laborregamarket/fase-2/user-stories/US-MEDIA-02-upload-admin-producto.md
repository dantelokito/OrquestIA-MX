# User Story — US-MEDIA-02

> **ID:** US-MEDIA-02  
> **Título:** Admin sube imagen de producto en catálogo global  
>
> **Como:** operador de plataforma (ADMIN)  
> **Quiero:** subir o actualizar la imagen de un producto del catálogo global  
> **Para:** que los clientes identifiquen visualmente frutas, verduras y productos agrícolas  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que soy ADMIN, cuando subo imagen válida para producto `Product` del catálogo global, entonces `imageUrl` se actualiza y la imagen aparece en detalle de frutería y listados donde se muestra el producto.
> - [ ] **Escenario 2 (Validación/Error):** Dado que subo archivo inválido, cuando envío, entonces recibo 400 con mensaje Zod/validación y `imageUrl` anterior no se borra.
> - [ ] **Escenario 3 (Reemplazo):** Dado que el producto ya tiene imagen, cuando subo nueva, entonces la URL anterior se reemplaza y recurso previo se purga del storage si aplica.
> - [ ] **Regla de Negocio:** Solo ADMIN puede editar `Product.imageUrl`; PROVIDER no sube imágenes al catálogo global.
