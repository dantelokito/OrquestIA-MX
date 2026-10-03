> **Pantalla:** Panel proveedor (`/proveedor`) — Fase 2 media + OBS-04
> **Objetivo Principal:** Gestionar imagen del negocio y catálogo (precios editables, disponibilidad)
>
> ### Estado A — Sin entidad Provider (BL-003)
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header autenticado PROVIDER]                                         |
> +-----------------------------------------------------------------------+
> |  Mi panel                                                             |
> |                    ┌─────────────────────────────┐                    |
> |                    │  Completa tu registro        │                    |
> |                    │  Configura los datos de tu  │                    |
> |                    │  frutería para empezar.     │                    |
> |                    │  [ Completar registro (CTA)]│                    |
> |                    └─────────────────────────────┘                    |
> +-----------------------------------------------------------------------+
> ```
>
> ### Estado B — Panel activo (media + catálogo)
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header autenticado PROVIDER]                                         |
> +-----------------------------------------------------------------------+
> |  Mi catálogo — Frutas El Paraíso          [Ver mi negocio →]         |
> |  Activa productos y define tus precios                                |
> +-----------------------------------------------------------------------+
> |  >>> SECCIÓN MEDIA — ver wireframe dedicado WF-proveedor-media.md <<< |
> |  Imagen del negocio · Logo circular · Portada banner · upload states  |
> +-----------------------------------------------------------------------+
> |  Producto        │ Categoría  │ Precio ($)   │ Disponible │ Estado    |
> |  ───────────────────────────────────────────────────────────────────  |
> |  Mango           │ Frutas     │ [ 45.00 ]    │ [●━━━━ ON ] │ ✓ Guardado│
> |  Aguacate        │ Frutas     │ [ 65.00 ]    │ [━━━━○ OFF] │           |
> |  Jitomate        │ Verduras   │ [ 28.00 ]    │ [●━━━━ ON ] │           |
> |  ...             │            │  ↑ EDITABLE  │             │           |
> +-----------------------------------------------------------------------+
> ```
>
> #### OBS-04 (P0 Sprint 0) — PriceInput obligatorio
>
> El precio **debe ser editable** inline (`type="number"` step 0.01, min 0). Solo lectura + toggle **no cumple** el wireframe. Guardado por fila con feedback ✓ 2s.
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Sin Provider** | EmptyState + CTA wizard → `/registro/negocio` |
> | **Loading** | Skeleton media + 10 filas tabla |
> | **Empty catálogo** | "Activa tu primer producto del catálogo" + highlight primera fila |
> | **Success** | Media preview + tabla editable (precio + toggle) |
> | **Error carga** | ErrorBanner + Reintentar |
> | **Error guardado** | Inline rojo en fila afectada |
> | **Saving fila** | Toggle/input disabled + spinner en fila |
> | **Media states** | Empty / preview / uploading / error — `WF-proveedor-media.md` |
>
> #### Componentes Requeridos para Frontend:
> * **ProviderEmptyState:** ilustración + CTA onboarding.
> * **Media section:** `WF-proveedor-media.md` (MediaUpload, previews, ImagePlaceholder).
> * **ProductTable:** filas editables; `Switch` min-h 44px.
> * **PriceInput:** editable (OBS-04); validación min 0.
> * **SaveFeedback:** check verde 2s por fila.
> * **PreviewLink:** → `/fruteria/[providerId]` ("Ver mi negocio →").
>
> #### Responsividad:
> * **Mobile:** Media stack; tabla scroll horizontal; toggles ≥44px; botones upload `w-full`.
> * **Desktop:** Media 2 cols; tabla `max-w-5xl mx-auto`.
>
> #### API esperada:
> * `GET /api/provider/products` — catálogo + ProviderProduct.
> * `PATCH /api/provider/products/[id]` — precio / disponibilidad.
> * `POST /api/provider/media` — logo / cover (Fase 2).
>
> #### Referencias:
> * `UF-PROVIDER-02-catalogo.md`, `UF-MEDIA-01-upload-proveedor.md`
> * `WF-proveedor-media.md`
