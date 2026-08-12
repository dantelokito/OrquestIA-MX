> **Flujo:** Upload de imágenes — proveedor (logo/portada) y admin (producto)
> **Historia de Usuario Asociada:** US-MEDIA-01, US-MEDIA-02, US-MEDIA-03, US-MEDIA-04, US-MEDIA-05
>
> **Punto de entrada:** `/proveedor` sección "Imagen del negocio" (PROVIDER); `/admin?tab=catalogos` upload por producto (ADMIN)
>
> **Pasos del Usuario (variante PROVIDER):**
> 1. `[Pantalla: /proveedor]` → Proveedor con entidad Provider ve sección "Imagen del negocio" encima o junto al catálogo.
> 2. `[Logo]` → Preview circular (o `ImagePlaceholder`) + botón "Cambiar logo" (touch ≥44px). Selecciona JPEG/PNG/WebP ≤5MB.
> 3. `[Portada]` → Preview banner 16:9 / ratio portada + "Cambiar portada". Hint: formatos, 5MB, dims recomendadas 1200×600.
> 4. `[Upload]` → `POST /api/provider/media` multipart (`field=logo|cover`). Estado uploading: overlay/spinner en preview; botones disabled.
> 5. `[Success]` → Preview actualizado con nueva URL HTTPS; confirmación breve (toast o check 2s). Visible en cards `/explorar` y hero `/fruteria/[id]`.
>
> **Pasos del Usuario (variante ADMIN — US-MEDIA-02):**
> 1. `[Pantalla: /admin]` → Tab Catálogos → selecciona producto del catálogo global.
> 2. `[Upload thumbnail]` → Control "Subir imagen" + preview; mismos formatos/límite.
> 3. `[API]` → `POST /api/admin/products/[id]/image`. Success → thumbnail en detalle frutería y listados.
>
> **Condicionales:**
> - **Formato inválido (PDF/GIF/etc.):** → Error inline `"Formato no permitido. Use JPEG, PNG o WebP"`; URL previa intacta.
> - **Tamaño >5MB:** → `"El archivo supera el límite de 5MB"`; sin cambio de preview.
> - **Error red/servidor:** → Error inline genérico + Reintentar; preview anterior se mantiene.
> - **Sin imagen (display):** → `ImagePlaceholder` (negocio o por categoría producto); dims fijas anti-CLS; `onerror` → placeholder (US-MEDIA-04/05).
> - **Lazy load:** → Cards explorar con skeleton imagen mientras carga; ≥20 cards no bloquean listado.
>
> **Reglas UI:**
> - Solo dueño del Provider edita logo/portada; solo ADMIN edita `Product.imageUrl`.
> - Validación cliente (hint) + autoridad servidor.
> - Wireframes: `WF-proveedor-media.md`, actualización `WF-admin-panel.md`, display en `WF-explorar.md` / `WF-fruteria-detalle.md`.
>
> **API esperada:**
> - `POST /api/provider/media` → `{ data: { url, field: "logoUrl"|"coverUrl" } }`
> - `POST /api/admin/products/[id]/image` → `{ data: { url, field: "imageUrl" } }`
