> **Pantalla:** Detalle frutería — delta Fase 3 Encargar (`/fruteria/[id]`)
> **Objetivo Principal:** Agregar productos al carrito y encargar pedido; contacto F2 como secundario
> **Base:** Delta sobre [`../../fase-1/wireframes/WF-fruteria-detalle.md`](../../fase-1/wireframes/WF-fruteria-detalle.md)
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header]                                    [🛒 2]  ← badge carrito |
> +-----------------------------------------------------------------------+
> | [COVER HERO — sin cambios F2]                                         |
> +-----------------------------------------------------------------------+
> |  [logo] Frutas El Paraíso  ✓ Verificado                               |
> |  Centro, Monterrey                                                    |
> +-----------------------------------------------------------------------+
> |  Productos disponibles                                                |
> |  ┌────┬──────────┬─────────┬────────┬─────────────────────────────┐ |
> |  │img │ Producto │ Precio  │ Unidad │ Cantidad                    │ |
> |  ├────┼──────────┼─────────┼────────┼─────────────────────────────┤ |
> |  │th  │ Mango    │ $45.00  │ / kg   │ [ − ] [ 2 ] [ + ]  Encargar│ |
> |  │umb │ Aguacate │ $65.00  │ / kg   │ [ − ] [ 1 ] [ + ]  Encargar│ |
> |  └────┴──────────┴─────────┴────────┴─────────────────────────────┘ |
> |  Encargar por fila = ghost/secondary; ver sticky footer móvil        |
> +-----------------------------------------------------------------------+
> |  [DESKTOP sidebar acciones]                                           |
> |  [ 🛒 Encargar selección (3) ]  ← PRIMARY dominante F3              |
> |  [ 📞 Llamar ]  [ WhatsApp ]    ← SECONDARY (D-F3-7, F2 intacto)     |
> +-----------------------------------------------------------------------+
> | [MOBILE STICKY FOOTER]                                                |
> |  [ 🛒 Encargar — 3 productos ]  PRIMARY w-full                       |
> |  [ Llamar ]  [ WhatsApp ]      row secundaria outline/ghost          |
> +-----------------------------------------------------------------------+
> ```
>
> #### Cambios respecto a WF-fruteria-detalle (F2)
>
> | Área | F2 | F3 delta |
> |------|----|----------|
> | CTA dominante | Llamar | **Encargar** |
> | Tabla productos | Solo lectura | `QuantityStepper` por fila |
> | Header CLIENT | — | Badge carrito con contador |
> | ContactCTA | Primary Llamar | Secondary Llamar + WhatsApp |
>
> #### Estados de la pantalla
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Loading** | Skeleton cover + filas productos con stepper placeholder |
> | **Empty productos** | EmptyState + ContactCTA secundario visible |
> | **Success** | Stepper funcional + Encargar sticky/desktop |
> | **Producto no disponible** | Fila `opacity-60`; stepper disabled; hint "No disponible" |
> | **Post-encargo** | Toast "Agregado al carrito" + badge header actualiza |
> | **Error red** | ErrorBanner + Reintentar |
>
> #### Componentes Requeridos para Frontend:
> * **QuantityStepper:** por fila producto; min según unidad.
> * **EncargarCTA:** agrega ítem(s) con cantidad al carrito de `providerId`.
> * **CartBadge:** header CLIENT; link `/carrito`.
> * **ContactCTA:** sin cambios F2; jerarquía degradada a secondary (D-F3-7).
>
> #### Responsividad:
> * **Mobile:** Encargar sticky footer dominante; contacto en fila inferior menor.
> * **Desktop:** Encargar en sidebar + stepper inline en tabla.
>
> #### API esperada:
> * `GET /api/providers/[id]` — productos activos (sin cambios).
> * Carrito: client state → `POST /api/orders` en `/carrito` (UF-ORDERS-01).
> * `POST /api/providers/[id]/contact` — preservado F2.
>
> #### Referencias:
> * Base: `../../fase-1/wireframes/WF-fruteria-detalle.md`, `../../fase-2/wireframes/WF-contacto-cta.md`
> * Flujo: `../user-flows/UF-ORDERS-01-checkout.md`
> * Tokens: `QuantityStepper`, `ContactCTA` en `../../comun/design-tokens.md`
