# User Story — US-MEDIA-05

> **ID:** US-MEDIA-05  
> **Título:** Placeholder cuando no hay imagen  
>
> **Como:** cliente que explora fruterías  
> **Quiero:** ver un placeholder consistente cuando el negocio o producto no tiene foto  
> **Para:** que la interfaz no se vea rota o incompleta  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Sin logo/portada):** Dado que el proveedor no tiene `logoUrl` ni `coverUrl`, cuando veo su tarjeta o detalle, entonces se muestra placeholder con icono 🍊 o ilustración neutra según `design-tokens.md`.
> - [ ] **Escenario 2 (Sin imagen producto):** Dado que `Product.imageUrl` es null, cuando veo producto en detalle frutería, entonces se muestra placeholder de categoría (fruta/verdura/agrícola).
> - [ ] **Escenario 3 (Consistencia):** Dado que múltiples negocios sin imagen, cuando exploro, entonces todos usan el mismo componente `ImagePlaceholder` con dimensiones fijas (no layout shift).
> - [ ] **Regla de Negocio:** Placeholder cumple contraste WCAG AA; no usar imágenes stock que implien producto específico.
