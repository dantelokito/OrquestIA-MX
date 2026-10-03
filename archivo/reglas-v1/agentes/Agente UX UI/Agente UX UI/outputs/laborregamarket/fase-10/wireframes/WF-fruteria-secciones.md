> **Pantalla:** Detalle frutería (`/fruteria/[id]`) — listado por sección + hero portada disco
> **Objetivo Principal:** Ver productos vendibles agrupados como el dueño los organizó
> **Base:** [`../../fase-1/wireframes/WF-fruteria-detalle.md`](../../fase-1/wireframes/WF-fruteria-detalle.md), [`../../fase-2/wireframes/WF-contacto-cta.md`](../../fase-2/wireframes/WF-contacto-cta.md), [`../../fase-3/wireframes/WF-fruteria-encargar.md`](../../fase-3/wireframes/WF-fruteria-encargar.md), [`../../fase-4/wireframes/WF-fruteria-reviews.md`](../../fase-4/wireframes/WF-fruteria-reviews.md) — **solo lectura**. Encargar y contacto **intactos**.

```text
+-----------------------------------------------------------------------+
| [Header]                                                              |
+-----------------------------------------------------------------------+
| [COVER HERO — coverUrl = /api/media/… o ImagePlaceholder business-cover]|
|  aspect ~2:1 · object-cover · lazy                                    |
+-----------------------------------------------------------------------+
|  [logo circular] Frutas El Paraíso  ✓ Verificado   ⭐ 4.8             |
|  Centro, Monterrey                                                    |
|  [DESKTOP] [ 📞 Llamar ahora ] [ WhatsApp ]                           |
+-----------------------------------------------------------------------+
|  INFO (50%)                    |  UBICACIÓN (50%)                     |
|  (F2 intacto)                  |  Mini mapa Leaflet                   |
+-----------------------------------------------------------------------+
|  Productos                                                            |
|                                                                       |
|  Frutas de temporada                                                  |
|  ┌────┬──────────────────┬──────────┬────────┐                        |
|  │img │ Mango            │ $45.00   │ [qty]  │                        |
|  │    │ Chile del rancho │ $38.50   │ [qty]  │  ← local, sin categoría|
|  └────┴──────────────────┴──────────┴────────┘                        |
|                                                                       |
|  Verduras del día                                                     |
|  ┌────┬──────────────────┬──────────┬────────┐                        |
|  │img │ Jitomate         │ $28.00   │ [qty]  │                        |
|  └────┴──────────────────┴──────────┴────────┘                        |
|                                                                       |
|  Sin sección          ← solo si hay vendibles con sectionId null      |
|  │ … │                                                                |
|                                                                       |
|  [← Explorar más fruterías]                                           |
+-----------------------------------------------------------------------+
|  #resenas  (F4/F7 intacto)                                            |
+-----------------------------------------------------------------------+
| [MOBILE] Encargar sticky + ContactCTA  — D-F3-7                       |
+-----------------------------------------------------------------------+
```

### Headings de sección

- Orden: `sectionSortOrder` ASC, luego **Sin sección**.
- No pintar heading si el grupo no tiene ítems **vendibles** (activos).
- Locales: no mostrar `FRUTA|VERDURA|AGRICOLA` (API `category` null). Globales pueden mostrar categoría como metadata secundaria `text-sm text-slate-500` (opcional, no filtro).
- Thumb: `ProviderProduct.imageUrl ?? Product.imageUrl ?? ImagePlaceholder`. URL disco `/api/media/…`.

### Empty

```text
|  Sin productos publicados aún                                         |
|  ContactCTA visible (OBS-10)                                          |
```

No listar «Aún no hay secciones» en público (eso es copy del panel dueño).

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton cover + hero + 2 headings + 5 filas |
| **Success** | Hero + grupos + Encargar |
| **Empty productos** | Empty F2 + ContactCTA |
| **404** | «Frutería no encontrada» + `/explorar` |
| **Error red** | ErrorBanner + Reintentar |
| **Cover vacía** | ImagePlaceholder `business-cover` F2 |
| **Logo vacío** | ImagePlaceholder `business-logo` |

#### Componentes requeridos para Frontend

- **ProviderHero:** sin cambio de anatomía; `src` puede ser `/api/media/…`.
- **SectionedProductList:** grupos por `sectionId` / `sectionName` / `sectionSortOrder`.
- **ProductRow F3:** QuantityStepper + Encargar; locales incluidos si vendibles de **este** `id`.
- **ContactCTA / MiniMap / #resenas:** intactos.

#### Responsividad

- Igual F2/F3: cover full-bleed móvil; grid 2 cols desktop; stepper ≥44px.

#### Accesibilidad

- Headings `h2` por sección. Tabla o lista con nombre + precio anunciados.
- Encargar sigue siendo el único CTA `--brand` dominante.

#### API esperada

- `GET /api/providers/[id]` — delta `scope`, `sectionId`, `sectionName`, `sectionSortOrder`, `imageUrl` resuelto.
- Contacto F2 intacto. **No** chips de sección en `/explorar`.

#### Fuera de alcance

FilterBar secciones, Maps JS, preview Explorar, POS layout.

#### Referencias

- `UF-CAT-03-secciones.md`, `UF-CAT-02-producto-local.md`
- Tokens §6i · `API-PROVIDER-PRODUCTS-02` delta público
