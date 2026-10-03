> **Pantalla:** Admin tab Catálogos (`/admin?tab=catalogos`) — CRUD global + Should promover
> **Objetivo Principal:** Curar SKUs comparables de plataforma (imagen a disco); opcionalmente promover un local
> **Base:** [`../../fase-1/wireframes/WF-admin-panel.md`](../../fase-1/wireframes/WF-admin-panel.md) — solo lectura. Distinto visualmente del drawer PROVIDER (`WF-proveedor-catalogo-f10.md`). **No** rediseñar `/admin/analytics`.

```text
+-----------------------------------------------------------------------+
| [Header ADMIN — marca plataforma]                                     |
+-----------------------------------------------------------------------+
|  Panel de administración                                              |
|  [ Catálogos ]  [ Proveedores ]  [ Bitácora ]  [ Analítica ]          |
+-----------------------------------------------------------------------+
|  Catálogo global                           [ Nuevo producto ]         |
|  [ Buscar nombre o slug… ]   [ Activos ▾ ]                            |
|                                                                       |
|  ┌──────────┐ ┌──────────┐ ┌──────────┐                               |
|  │ thumb    │ │          │ │          │                               |
|  │ Mango    │ │ Jitomate │ │ …        │                               |
|  │ FRUTA · kg│ │ VERDURA  │ │          │                               |
|  │ Activo   │ │ Inhabil. │ │          │                               |
|  └──────────┘ └──────────┘ └──────────┘                               |
|  Paginación ADR-004                                                   |
+-----------------------------------------------------------------------+
|  Should: [ Ver productos locales ]  ← cola US-ADMIN-04                |
+-----------------------------------------------------------------------+
```

### Alta / edición (panel 2 cols, no drawer de negocio)

```text
+-----------------------------------------------------------------------+
|  Nuevo producto global                     (o Editar: {nombre})       |
|                                                                       |
|  Nombre *                    Slug (opcional)                          |
|  [ Mango Ataulfo        ]    [ mango-ataulfo     ]                    |
|  Categoría *                 Unidad *                                 |
|  [ FRUTA ▾ ]                 [ KG ▾ ]                                 |
|  Descripción                                                          |
|  [ … max 500 ]                                                        |
|                                                                       |
|  Imagen (disco)                                                       |
|  ┌────────────┐  JPEG, PNG o WebP · máx 5MB                           |
|  │ preview/PH │  [ Subir imagen ] / [ Cambiar imagen ]                |
|  └────────────┘  placeholder por categoría F2                         |
|                                                                       |
|  Estado: [● Activo ]  Inhabilitar = no activable ni vendible          |
|                                                                       |
|  [ Guardar ]     [ Inhabilitar ]  ← inhabilitar no es primary         |
+-----------------------------------------------------------------------+
```

Copy retiro: «Inhabilitar oculta el SKU a nuevas activaciones. No se borra el historial.» **Sin** botón Eliminar / DELETE.

### Should — cola locales + `PromoteLocalDialog`

```text
|  Productos locales (otras fruterías)                                  |
|  Negocio              │ Producto           │ Acción                   |
|  Frutas El Paraíso    │ Chile del rancho   │ [ Promover a catálogo ]  |
+-----------------------------------------------------------------------+

Diálogo:
+------------------------------------------------------+
|  Promover a catálogo global                     [✕]  |
|  Origen: Frutas El Paraíso                           |
|  Nombre: Chile del rancho                            |
|  Categoría de plataforma *  [ FRUTA ▾ ]              |
|  Slug  [ chile-del-rancho ]                          |
|                                                      |
|  Otras fruterías podrán activarlo. El negocio        |
|  origen sigue vendiéndolo.                           |
|                                                      |
|  [ Cancelar ]              [ Promover ]              |
+------------------------------------------------------+
```

Path API **TBD Arquitecto** (ADR-029). Marcar UI `data-should="admin-04"`; FE no implementa Must.

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton grid + search |
| **Empty globales** | «Aún no hay productos en el catálogo global» + Nuevo producto |
| **Search vacío** | «No hay coincidencias» |
| **Uploading** | Overlay spinner en thumb; botones disabled |
| **MEDIA-03** | Inline formato / 5MB |
| **409 slug** | Inline «Ya existe un producto con ese identificador» |
| **Inhabilitado** | Badge texto «Inhabilitado» + icono; card opacidad 80% no color-only |
| **401/403** | Redirect / ErrorBanner «Sin permiso para este módulo» |
| **Should 409 promover** | Inline slug en diálogo |

#### Componentes requeridos para Frontend

- **AdminCatalogGrid:** cards o tabla; paginación.
- **AdminProductForm:** 2 cols; categoría plataforma; **no** select de sección de negocio.
- **AdminProductImageUpload:** disco; copy sin nube.
- **ProductActiveAdminControl:** inhabilitar / reactivar.
- **PromoteLocalDialog:** Should.
- **AdminTabs:** `?tab=catalogos|proveedores|bitacora` (+ analítica F4).

#### Responsividad

- Mobile: CTA `w-full`; form stack; grid 1 col; cola locales cards.
- Desktop: grid 3–4 cols; form `max-w-3xl` 2 cols.

#### Accesibilidad

- Guardar ≥44px. Inhabilitar secondary. Diálogo focus trap.
- Categoría anunciada (FRUTA/VERDURA/AGRÍCOLA labels UI: Frutas / Verduras / Agrícolas).

#### API esperada

- `GET/POST /api/admin/products`, `PATCH /api/admin/products/[id]`
- `POST /api/admin/products/[id]/image`
- LOCAL no aparece en GET admin products. Promover: no inventar path.

#### Fuera de alcance

Analytics, usuarios, órdenes admin, Cloudinary, hard-delete, edición de colores de un negocio (Could).

#### Referencias

- `UF-ADMIN-02-catalogos.md` · `API-ADMIN-PRODUCTS-01` · `API-MEDIA-02` · ADR-029
