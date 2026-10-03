> **Flujo:** CRUD del catálogo **global** (comparables) + Should promover local → global
> **Historia de Usuario Asociada:** US-ADMIN-02, US-MEDIA-06, US-ADMIN-04 (Should)
>
> **Punto de entrada:** Login ADMIN → `/admin?tab=catalogos`. Chrome marca **plataforma** (`US-BRAND-02`). **No** rediseñar `/admin/analytics`.

> **Pasos del Usuario (Must — globales):**
> 1. `[Tab Catálogos]` → Lista paginada de `Product` `scope=GLOBAL` (no locales). Búsqueda `q` (nombre/slug). Filtro opcional Activo/Inactivo. CTA **Nuevo producto** ≥44px.
> 2. `[Alta]` → Formulario **de página / panel 2 cols** (distinto del drawer PROVIDER): nombre, categoría plataforma (`FRUTA` | `VERDURA` | `AGRICOLA`), unidad (`KG` | `PIEZA`), descripción opcional, dropzone imagen disco. `POST /api/admin/products` luego `POST /api/admin/products/[id]/image`.
> 3. `[Edición]` → Mismos campos. `PATCH /api/admin/products/[id]`. Imagen: preview `/api/media/…` o placeholder por categoría F2. «Cambiar imagen».
> 4. `[Retiro]` → Toggle / acción **Inhabilitar** (`isActive=false`). Deja de ofrecerse a nuevas activaciones y no es vendible (`US-CAT-01` / ADR-022). **No** hay papelera destructiva ni `DELETE`. Copy: «Inhabilitar — no se borra el historial de ventas».
> 5. `[Reactivar]` → `isActive=true`. El SKU vuelve a ser activable por PROVIDER.

> **Pasos del Usuario (Should — US-ADMIN-04):**
> 6. `[Cola locales]` → Subvista o segundo listado «Productos locales» (solo lectura de ajenos + acción promover). No mezclar visualmente con el grid de globales.
> 7. `[Promover]` → Diálogo `PromoteLocalDialog`: muestra negocio origen + nombre local; ADMIN elige categoría `FRUTA|VERDURA|AGRICOLA` y confirma slug (editable, único global). Confirmación: «Otras fruterías podrán activarlo. El negocio origen sigue vendiéndolo.»
> 8. `[Éxito]` → El `Product` queda `scope=GLOBAL` (ADR-029). Origen conserva `ProviderProduct`. AUDIT.
> 9. `[409 slug/nombre]` → Inline «Ese slug ya existe en el catálogo global». Sin duplicar `Product`.
> 10. `[PROVIDER intenta promover]` → 403; esta UI no existe en `/proveedor`.

**Condicionales:**
- **Slug duplicado alta:** → 409 «Ya existe un producto con ese identificador».
- **MEDIA-03:** mismos copy F2 (formato / 5MB) inline.
- **LOCAL en POST admin:** no. PROVIDER no usa `POST /api/admin/products` (403).
- **Hard-delete:** UI no ofrece borrar. Si 405/409: «Retira el producto inhabilitándolo».
- **401/403:** ErrorBanner «Sin permiso para este módulo» / redirect login.
- **Path promover:** **TBD Arquitecto** (Should). No inventar URL. UI lista lista; FE no implementa hasta contrato.

**Reglas UI:**
- Layout admin (superficie blanca/slate de **plataforma**, no `--brand` del negocio curado).
- Distinto del alta local: aquí hay **categoría de plataforma**, no sección del negocio.
- Copy **prohibido:** Cloudinary, nube, «eliminar para siempre» como acción Must.
- Wireframe: `WF-admin-catalogos.md`.

**API esperada:**
- `GET/POST /api/admin/products`, `PATCH /api/admin/products/[id]` — `API-ADMIN-PRODUCTS-01`
- `POST /api/admin/products/[id]/image` — `API-MEDIA-02` (solo GLOBAL)
- Promover: ADR-029; path cuando Arch active Should. Listado de locales ajenos = Could/Should — no inventar query.

**Referencias:** D-F10-2, D-F10-7, D-F10-UX-6, D-F10-UX-8, `CO-F10-001`, `CO-F10-002`.
