> **Pantalla:** Explorar fruterías (`/explorar`) — Fase 2 filtros + media
> **Objetivo Principal:** Descubrir fruterías con filtros API (categoría, q, verified), mapa sincronizado y cards con imagen
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header] Logo | Pill búsqueda (sync ?q=) | Acciones usuario           |
> +-----------------------------------------------------------------------+
> | FilterBar (scroll horizontal, touch ≥44px):                           |
> |  [✓ Verificadas] [Frutas] [Verduras] [Agrícolas]                      |
> |  Activo = border/bg --brand · URL: ?category=&verified=&q=            |
> +-----------------------------------------------------------------------+
> | LISTA (55%)              |  MAPA (45%)                                |
> | Más de 12 fruterías...   |  ┌────────────────────────────────────┐  |
> |                          |  │  Leaflet + OpenStreetMap           │  |
> | ┌──────┐ ┌──────┐       |  │     [$45]  [$38]                   │  |
> | │Cover/│ │Cover/│       |  │           [$52]                    │  |
> | │Logo/ │ │PH    │       |  │  price bubbles, sync hover         │  |
> | │⭐4.8 │ │⭐4.5 │       |  │  markers = resultados filtrados    │  |
> | └──────┘ └──────┘       |  └────────────────────────────────────┘  |
> | [ 1 ] [ 2 ] [ 3 ] ... →  |  sticky desktop                          |
> +-----------------------------------------------------------------------+
> ```
>
> ### Mobile (`<= 640px`) — OBS-01 P0
>
> ```text
> +-----------------------------------------------------------------------+
> | FilterBar chips scroll                                                |
> | LISTA full-width (cards)                                              |
> | MAPA debajo: h-[300px] visible — NUNCA hidden lg:block                |
> | flex-col · lista arriba · mapa abajo                                 |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | 6× SkeletonCard (incl. bloque imagen); mapa área gris `animate-pulse` |
> | **Empty filtrado** | EmptyState título `No encontramos fruterías` + descripción contextual + CTA `Limpiar filtros` → limpia URL/chips; mapa sin markers |
> | **Success** | Grid ProviderCard + mapa; hover sync; imágenes lazy |
> | **Error red** | ErrorBanner + `Reintentar` (≠ empty filtrado) |
> | **Filtered** | Contador actualizado; chips activos `--brand`; URL shareable |
>
> #### URL / sync (US-EXPLORE-03)
>
> | Param | UI |
> |-------|-----|
> | `category=FRUTA\|VERDURA\|AGRICOLA` | Chip Frutas / Verduras / Agrícolas |
> | `verified=true` | Chip Verificadas |
> | `q=` | Input explorar + pill header (≥2 chars para query) |
> | `page=` | Paginación |
>
> Hidratar chips/input desde URL al load; back/forward restaura estado.
>
> #### Componentes Requeridos para Frontend:
> * **FilterBar / FilterChip:** estados inactivo/activo; `aria-pressed`.
> * **ProviderCard:** `coverUrl` o `logoUrl` lazy + `ImagePlaceholder` on missing/error; badge verificado; link detalle.
> * **ExploreMap:** Leaflet lazy; markers solo del result set; altura móvil ~300px (**OBS-01**).
> * **EmptyState:** copy fijo + CTA Limpiar filtros.
> * **Pagination:** query `page`.
> * **Grid:** `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8`.
>
> #### Responsividad:
> * **Mobile:** Lista full-width arriba; mapa **visible** 300px debajo (`flex-col`). Cierra OBS-01.
> * **Desktop:** `lg:flex-row`; lista `lg:w-[55%]`; mapa sticky `lg:h-[calc(100vh-160px)]`.
>
> #### API esperada:
> * `GET /api/providers?city=Monterrey&category=&q=&verified=&page=1`
>
> #### Referencias:
> * Flujo: `UF-EXPLORE-02-filtros.md`, `UF-CLIENT-01-explorar.md`
> * Media display: `UF-MEDIA-01-upload-proveedor.md`
