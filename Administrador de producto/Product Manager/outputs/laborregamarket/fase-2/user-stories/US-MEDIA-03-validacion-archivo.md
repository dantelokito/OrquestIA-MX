# User Story — US-MEDIA-03

> **ID:** US-MEDIA-03  
> **Título:** Validación de archivos de imagen  
>
> **Como:** usuario que sube imágenes (PROVIDER o ADMIN)  
> **Quiero:** recibir mensajes claros cuando mi archivo no es válido  
> **Para:** corregir el archivo sin perder el contexto del formulario  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Formato inválido):** Dado que subo PDF o GIF, cuando envío, entonces recibo error "Formato no permitido. Use JPEG, PNG o WebP".
> - [ ] **Escenario 2 (Tamaño excesivo):** Dado que subo archivo > 5MB, cuando envío, entonces recibo error "El archivo supera el límite de 5MB".
> - [ ] **Escenario 3 (Exitoso):** Dado que subo JPEG 2MB, cuando envío, entonces upload completa y UI muestra preview de la nueva imagen.
> - [ ] **Regla de Negocio:** Validación en cliente (hint) y servidor (autoridad); dimensiones máximas recomendadas en UI (ej. portada 1200×600).
