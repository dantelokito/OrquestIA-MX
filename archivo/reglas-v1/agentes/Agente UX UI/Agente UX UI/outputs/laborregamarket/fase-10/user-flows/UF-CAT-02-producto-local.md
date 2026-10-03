> **Flujo:** Alta y edición de producto **local** (solo este negocio)
> **Historia de Usuario Asociada:** US-CAT-02, US-MEDIA-06, US-CAT-01 (toggle intacto)
>
> **Punto de entrada:** Login PROVIDER → `/proveedor` (Catálogo). Baseline F1/F5: activar SKUs **globales** (precio + Activo/Inactivo) **sigue**. Este flujo añade SKUs propios.

> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor]` → Cabecera «Mi catálogo — {negocio}» + **Ver mi negocio →**. CTAs de catálogo: **Agregar producto** (primario, ≥44px) y **Nueva sección** (secundario; ver `UF-CAT-03`). Media logo/portada F2 (disco, `UF`/`WF` media F10).
> 2. `[Agregar producto]` → Abre `ProductFormDrawer` (sheet a pantalla completa `<md`; drawer derecho `md+`). Campos: nombre, precio (MXN, ≥0, 2 decimales), unidad (`KG` | `PIEZA`), sección (select requerido de secciones del negocio), dropzone imagen (JPEG/PNG/WebP · máx 5MB), toggle **Activo**. Badge hint: «Solo este negocio — no aparece en otras fruterías».
> 3. `[Guardar]` → CTA único **Guardar producto**. `POST /api/provider/local-products` (JSON). Si hay archivo: `POST /api/provider/products/[providerProductId]/image` después del 201. Preview inmediato `GET /api/media/{file}` same-origin.
> 4. `[Éxito]` → El ítem aparece en su `SectionBlock`. Encargar y POS **de este** negocio pueden venderlo si Activo. Cierra drawer. Feedback ✓ 2s.
> 5. `[Editar local]` → Fila local (ScopeBadge «Solo este negocio») abre el mismo drawer con datos. `PATCH /api/provider/local-products/[providerProductId]`. Cambiar sección mueve el ítem al otro bloque. Foto: «Cambiar imagen» reemplaza; placeholder F2 si vacío.
> 6. `[Inhabilitar]` → Toggle Activo/Inactivo igual que globales F5 (`US-CAT-01`): desaparece de detalle, Encargar y POS; la fila **permanece** en el panel. No es stock. No hard-delete.

**Condicionales:**
- **Sin secciones:** → Select sección vacío + error «Elige una sección» (bloquea guardar). CTA **Nueva sección** visible. Empty catálogo: «Aún no hay secciones» (`UF-CAT-03`) no sustituye el empty de globales no activados.
- **Validación inline:** precio vacío/negativo → «Indica un precio válido». Nombre vacío → «Escribe el nombre». MEDIA-03 formato → «Formato no permitido. Use JPEG, PNG o WebP». Tamaño → «El archivo supera el límite de 5MB». Sección faltante → «Elige una sección».
- **409/400 API:** envelope ADR-003 en ErrorBanner o inline del campo (`details.field`).
- **429** altas: «Espera un momento para agregar otro producto».
- **401:** redirect `/login?redirect=/proveedor`.
- **403:** ErrorBanner existente (no es dueño / rol incorrecto).
- **GLOBAL por esta ruta:** no. Activar comparable = flujo F1 `PATCH /api/provider/products`.
- **Imagen de un GLOBAL activado:** dueño puede override de vitrina `POST /api/provider/products/[providerProductId]/image` **sin** mutar `Product.imageUrl` de plataforma.

**Reglas UI:**
- Un CTA dominante en drawer: **Guardar producto**. En el panel, **Agregar producto** es el primario de catálogo; colores de marca F5 no compiten en la misma franja (siguen más abajo).
- ScopeBadge texto+icono (nunca color-only): locales = «Solo este negocio»; globales = sin badge o «Catálogo».
- Copy **prohibido:** Cloudinary, nube, CDN, «comparable en otras fruterías» como beneficio del local.
- Wireframe: `WF-proveedor-catalogo-f10.md`.

**API esperada (no inventar):**
- `GET /api/provider/products` — delta `scope`, `sectionId`, `sectionName`, `imageUrl`, `providerProductId`.
- `POST /api/provider/local-products` — `{ name, unit, price, sectionId, isAvailable, description? }`.
- `PATCH /api/provider/local-products/[id]` — parcial; `id` = `ProviderProduct.id`.
- `POST /api/provider/products/[providerProductId]/image` — disco (`API-MEDIA-02`).
- Globales: `PATCH /api/provider/products` F1 intacto. Opcional: `sectionId` en ese PATCH para asignar GLOBAL activado a sección.

**Referencias:** `CO-F10-001`, `CO-F10-002`, D-F10-5, D-F10-UX-3, ADR-029, `API-PROVIDER-PRODUCTS-02.md`, `API-MEDIA-02.md`.
