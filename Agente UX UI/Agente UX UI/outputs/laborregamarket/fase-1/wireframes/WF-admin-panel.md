> **Pantalla:** Panel admin (`/admin`) — Fase 2 media producto + auditoría CONTACT
> **Objetivo Principal:** Curar catálogos (incl. imagen producto), verificar proveedores y consultar bitácora
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header autenticado ADMIN]                                            |
> +-----------------------------------------------------------------------+
> |  Panel de administración                                              |
> |                                                                       |
> |  [ Catálogos ]  [ Proveedores ]  [ Bitácora ]    ← tabs              |
> |  ─────────────────────────────────────────────────────────────────    |
> +-----------------------------------------------------------------------+
> ```
>
> ### Tab Catálogos (Fase 2 — upload imagen)
>
> ```text
> |  ┌────────────┐ ┌────────────┐ ┌────────────┐                        |
> |  │ Frutas     │ │ Verduras   │ │ Agrícolas  │  ...                   |
> |  │ 8 items    │ │ 4 items    │ │ 3 items    │                        |
> |  └────────────┘ └────────────┘ └────────────┘                        |
> |                                                                       |
> |  Producto seleccionado: Mango                                         |
> |  ┌──────────┐                                                         |
> |  │ thumb/PH │  [ Subir imagen ] / [ Cambiar imagen ]                  |
> |  └──────────┘  JPEG, PNG o WebP · máx 5MB                             |
> |                (error inline validación MEDIA-03)                     |
> |  + JSON/detalle read-only del ítem (opcional)                         |
> ```
>
> ### Tab Proveedores
>
> ```text
> | Negocio           │ Ciudad     │ Verificado │ Email    │ Acción        |
> | Frutas El Paraíso │ Monterrey  │ ✓ Sí       │ OK       │ [ Revocar ]   |
> | Verduras Norte    │ Monterrey  │ ○ No       │ ⚠ Sin    │ [ Verificar ] |
> |                   │            │            │ email    │               |
> ```
>
> Badge **"Sin email"** (US-NOTIFY-04) cuando el negocio no puede recibir notificaciones.
>
> ### Tab Bitácora
>
> ```text
> | Fecha       │ Usuario / IP   │ Módulo    │ Acción       │ Detalle              |
> | 09/08 14:30 │ (público)      │ PROVIDERS │ CONTACT      │ notified / rate_lim. |
> | 09/08 14:28 │ provider@...   │ PROVIDERS │ MEDIA_UPLOAD │ logoUrl              |
> | 05/08 14:30 │ cliente@demo   │ AUTH      │ LOGIN        │ IP …                 |
> ```
>
> Filtros: módulo / acción (incl. `CONTACT`, `MEDIA_UPLOAD`). Flag fallo email en detalle si `notificationFailed`.
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton tabs + skeleton contenido |
> | **Empty bitácora** | "No hay eventos registrados" |
> | **Empty productos catálogo** | Mensaje en grid |
> | **Upload producto** | Preview / uploading / error inline (mismo patrón MEDIA) |
> | **Success** | Datos según tab |
> | **Error** | ErrorBanner en área de contenido |
>
> #### Componentes Requeridos para Frontend:
> * **AdminTabs:** `?tab=catalogos|proveedores|bitacora`.
> * **CatalogGrid:** selección de catálogo/producto.
> * **ProductImageUpload:** MediaUpload thumbnail; `POST /api/admin/products/[id]/image`.
> * **ImagePlaceholder:** variante producto por categoría.
> * **ProviderTable:** verificado + badge sin email.
> * **AuditTable:** paginada; filtros CONTACT / MEDIA_UPLOAD.
>
> #### Responsividad:
> * **Mobile:** Tabs scroll; tablas scroll horizontal; upload `w-full`.
> * **Desktop:** Layout 2 cols en catálogos (lista + preview/upload).
>
> #### API esperada:
> * Endpoints admin existentes + `POST /api/admin/products/[id]/image`.
> * Bitácora: acciones `CONTACT`, `MEDIA_UPLOAD`.
>
> #### Notas Fase 2:
> * Catálogos: ya no solo read-only — **upload imagen producto** (Should US-MEDIA-02).
> * Sin CRUD completo de productos (nombre/categoría) en este wireframe.
> * Checkout / analytics: fuera de alcance.
>
> #### Referencias:
> * `UF-MEDIA-01-upload-proveedor.md` (variante admin)
> * `UF-NOTIFY-01-contacto.md` (AUDIT)
> * Tokens: MediaUpload, ImagePlaceholder
