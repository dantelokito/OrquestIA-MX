> **Pantalla:** Detalle frutería (`/fruteria/[id]`) — Fase 2 media + contacto
> **Objetivo Principal:** Ver negocio con portada/productos e iniciar contacto (tel / WhatsApp) con notificación
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header]                                                              |
> +-----------------------------------------------------------------------+
> | [COVER HERO — coverUrl o ImagePlaceholder business-cover]             |
> |  aspect ~2:1 · object-cover · lazy                                    |
> +-----------------------------------------------------------------------+
> |  [logo circular] Frutas El Paraíso  ✓ Verificado   ⭐ 4.8             |
> |  Centro, Monterrey                                                    |
> |  [DESKTOP] [ 📞 Llamar ahora ] [ WhatsApp ]  ← ver WF-contacto-cta    |
> +-----------------------------------------------------------------------+
> |  INFO (50%)                    |  UBICACIÓN (50%)                     |
> |  📍 Av. Constitución 123       |  ┌──────────────────────┐            |
> |  📞 81 1234 5678               |  │  Mini mapa Leaflet   │            |
> |  🕐 Horario: Consultar         |  └──────────────────────┘            |
> +-----------------------------------------------------------------------+
> |  Productos disponibles                                                |
> |  ┌────┬────────────┬───────────┬──────────┬────────┐                 |
> |  │img │ Producto   │ Categoría │ Precio   │ Unidad │                 |
> |  │th  │ Mango      │ Frutas    │ $45.00   │ / kg   │                 |
> |  │umb │ Aguacate   │ Frutas    │ $65.00   │ / kg   │                 |
> |  └────┴────────────┴───────────┴──────────┴────────┘                 |
> |  thumb = imageUrl o ImagePlaceholder por categoría                    |
> |                                                                       |
> |  [← Explorar más fruterías]                                          |
> +-----------------------------------------------------------------------+
> | [MOBILE] ContactCTA sticky — WF-contacto-cta.md                       |
> | Toast: "La frutería fue notificada" (aria-live)                       |
> +-----------------------------------------------------------------------+
> ```
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton cover + hero + 5 filas skeleton productos |
> | **Empty productos** | `EmptyState` "Sin productos publicados aún" + ContactCTA visible (OBS-10) |
> | **Success** | Cover/logo + tabla con thumbs + ContactCTA |
> | **Error 404** | EmptyState "Frutería no encontrada" + link `/explorar` |
> | **Error red** | ErrorBanner + Reintentar |
> | **Contact success/error** | Toast según `WF-contacto-cta` — no bloquea `tel:` |
>
> #### Componentes Requeridos para Frontend:
> * **ProviderHero:** cover, logo (o placeholders), nombre, badge verificado (`Shield`), rating seed.
> * **ProductTable / ProductRow:** thumb 40–48px fijo + nombre + categoría + precio MXN.
> * **ContactCTA:** especificación completa en `WF-contacto-cta.md` (Llamar dominante, WhatsApp secundario, toast).
> * **ImagePlaceholder:** variantes `business-cover`, `business-logo`, `product-{FRUTA|VERDURA|AGRICOLA}`.
> * **MiniMap:** Leaflet pin único; lazy load.
> * **Breadcrumb:** Explorar > {nombre} (opcional).
>
> #### Responsividad:
> * **Mobile:** Cover full-bleed; info/mapa stack; ContactCTA sticky footer.
> * **Desktop:** Cover hero; grid 2 cols info/mapa; CTAs en hero/sidebar.
>
> #### API esperada:
> * `GET /api/providers/[id]` — productos activos + `logoUrl`/`coverUrl`/`imageUrl`.
> * `POST /api/providers/[id]/contact` — ver UF-NOTIFY-01.
>
> #### Referencias:
> * Contacto: `UF-NOTIFY-01-contacto.md`, `WF-contacto-cta.md`
> * Media: `UF-MEDIA-01-upload-proveedor.md`
> * Flujo base: `UF-CLIENT-02-detalle-fruteria.md`
>
> #### Fuera de alcance Fase 2:
> * Checkout, carrito, pedidos in-app.
