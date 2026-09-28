> **Pantalla:** Panel catálogo proveedor (`/proveedor`) — Fase 10 locales + secciones + disco
> **Objetivo Principal:** Armar el catálogo del negocio (secciones, SKUs locales, fotos en disco) sin dejar de activar el catálogo global
> **Base:** [`../../fase-1/wireframes/WF-proveedor-panel.md`](../../fase-1/wireframes/WF-proveedor-panel.md), [`../../fase-2/wireframes/WF-proveedor-media.md`](../../fase-2/wireframes/WF-proveedor-media.md), [`../../fase-5/wireframes/WF-catalogo-canales.md`](../../fase-5/wireframes/WF-catalogo-canales.md), [`../../fase-5/wireframes/WF-proveedor-marca.md`](../../fase-5/wireframes/WF-proveedor-marca.md) — **solo lectura**. No reabrir F9 Explorar.

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]  [ Catálogo | POS | Órdenes | Dashboard ]           |
+-----------------------------------------------------------------------+
|  Mi catálogo — Frutas El Paraíso              [ Ver mi negocio → ]    |
|  Activa el catálogo global o agrega productos solo de tu frutería.    |
+-----------------------------------------------------------------------+
|  Imagen del negocio                                                   |
|  LOGO (círculo)          PORTADA (banner 16:9)                        |
|  [preview / ImagePlaceholder F2]                                      |
|  [ Subir logo ]          [ Subir portada ]     JPEG, PNG o WebP · 5MB |
|  (error inline MEDIA-03)  Cero copy de nube / Cloudinary              |
+-----------------------------------------------------------------------+
|  [ Agregar producto ]     [ Nueva sección ]                           |
|   primario ≥44px           secondary ≥44px                            |
+-----------------------------------------------------------------------+
|  ▾ Frutas de temporada                         [ ⋮ rename | ↑↓ | 🗑 ] |
|  Producto              │ Precio     │ Estado      │ Foto │            |
|  Mango        Catálogo │ [ 45.00 ]  │ [● Activo]  │ th   │            |
|  Chile rancho  [Solo   │ [ 38.50 ]  │ [● Activo]  │ th   │ [Editar]   |
|                este    │            │             │      │            |
|                negocio]│            │             │      │            |
+-----------------------------------------------------------------------+
|  ▾ Sin sección                                         (si sectionId  |
|  Aguacate     Catálogo │ [ 65.00 ]  │ [○ Inactivo]│ …               |
|                        │            │             │     null)         |
+-----------------------------------------------------------------------+
|  … colores de marca F5 …  … Google / preparación F4 …                 |
+-----------------------------------------------------------------------+
```

### Empty secciones

```text
|  [Icono Folders 48px]                                                 |
|  Aún no hay secciones                                                 |
|  Crea una para agrupar tu catálogo. No se anidan.                     |
|  [ Nueva sección ]                                                    |
```

Globales de plataforma pueden listarse bajo **Sin sección** hasta asignar `sectionId` (PATCH F1 opcional).

### Drawer — Agregar / editar producto local (`ProductFormDrawer`)

```text
+------------------------------------------+
|  Producto de tu frutería            [✕]  |
|  [badge] Solo este negocio               |
+------------------------------------------+
|  Nombre *                                |
|  [ Chile del rancho                    ] |
|  Precio (MXN) *          Unidad *        |
|  [ 38.50 ]               [ KG ▾ ]        |
|  Sección *                               |
|  [ Frutas de temporada ▾ ]               |
|  Foto                                    |
|  ┌────────────┐                          |
|  │ dropzone / │  JPEG, PNG o WebP · 5MB  |
|  │ preview    │  [ Cambiar imagen ]      |
|  └────────────┘                          |
|  [● Activo ]  Inactivo: no se vende      |
|  (hint US-CAT-01; no «agotado»)          |
+------------------------------------------+
|  [ Guardar producto ]   ← único primary  |
+------------------------------------------+
```

Móvil `<md`: sheet full-screen; CTA `w-full` min-h-11. `md+`: drawer derecho ~400px.

### Media disco (delta F2)

Mismos estados Empty / Preview / Uploading / Error que `WF-proveedor-media.md`. Cambios F10:

- URL persistida `/api/media/{cuid}.{ext}`; preview `<img src>` same-origin.
- Copy ayuda: «JPEG, PNG o WebP · máx 5MB». **Prohibido:** Cloudinary, «nube», CDN, «se sube a internet».
- Foto de **ítem ofertado**: thumb 40–48px en fila; click abre dropzone o el drawer si es local.
- Override de GLOBAL: cambia vitrina del negocio, no el master de plataforma.

### Sección — acciones

| Acción | UI |
|--------|-----|
| Nueva | Diálogo/inline nombre 1–40; CTA Guardar ≥44px |
| Renombrar | click-to-edit; Enter confirma; Escape cancela |
| Reordenar | botones ↑↓ ≥44px; drag handle `md+` `aria-grabbed` |
| Eliminar | enabled solo `productCount=0`; ConfirmDialog. Disabled + tooltip/hint si hay productos |

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Sin Provider** | Empty F1 + CTA wizard (sin cambio) |
| **Loading** | Skeleton media + 2 SectionBlock + 6 filas |
| **Empty secciones** | Copy «Aún no hay secciones» + Nueva sección |
| **Empty bloque** | Heading visible en panel; «Agrega productos a esta sección» |
| **Drawer open** | Focus trap; Escape cierra; overlay |
| **Saving fila / drawer** | Disabled + spinner |
| **Success** | ✓ 2s; drawer cierra en alta |
| **Error MEDIA-03** | Inline bajo dropzone |
| **Error 409 sección** | Inline nombre duplicado / delete no vacío |
| **Error 429** | Banner «Espera un momento…» |
| **401** | Redirect login |
| **403** | ErrorBanner |

#### Componentes requeridos para Frontend

- **CatalogToolbarF10:** Agregar producto (primary) + Nueva sección (secondary).
- **SectionBlock:** heading, count, rename, reorder, delete, lista de filas.
- **ScopeBadge:** «Solo este negocio» (LOCAL) texto+icono `Store`.
- **ProductFormDrawer:** campos Must; un CTA Guardar.
- **ProductImageDropzone:** MEDIA-03; preview `/api/media/…`; placeholder F2.
- **MediaUpload F2:** logo/cover; copy sin nube.
- **ProductActiveSwitch F5:** intacto (Activo/Inactivo).
- **PriceInput F1:** intacto en filas globales y en drawer.

#### Responsividad

- **Mobile:** toolbar stack `w-full`; tabla/cards por sección scroll-x o filas apiladas (nombre, precio, toggle, thumb); drawer = sheet.
- **Desktop:** `max-w-5xl mx-auto`; media 2 cols; drawer 400px.

#### Accesibilidad

- CTAs ≥44px. Toggle `aria-checked` + nombre producto.
- Drawer `role="dialog"` `aria-modal`. Dropzone teclado / `input file` visible o asociado.
- Reorder: teclado, no solo drag.
- Never color-only en ScopeBadge ni Activo.

#### API esperada

- `GET /api/provider/products`, `POST/PATCH /api/provider/local-products`
- `GET/POST/PATCH/DELETE /api/provider/sections`, `PATCH .../reorder`
- `POST /api/provider/media`, `POST /api/provider/products/[providerProductId]/image`
- `GET /api/media/[filename]`

#### Fuera de alcance

Wizard sugerir Frutas/Verduras/Agrícolas; chips Explorar; POST admin products; Cloudinary; hard-delete.

#### Referencias

- `UF-CAT-02-producto-local.md`, `UF-CAT-03-secciones.md`
- Tokens §6i · Arquitecto `API-PROVIDER-PRODUCTS-02`, `API-PROVIDER-SECTIONS-01`, `API-MEDIA-02`
