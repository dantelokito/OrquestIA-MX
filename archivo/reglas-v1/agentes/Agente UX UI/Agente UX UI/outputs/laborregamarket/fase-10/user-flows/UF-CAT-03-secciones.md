> **Flujo:** Secciones dinámicas del catálogo del negocio (lista plana)
> **Historia de Usuario Asociada:** US-CAT-03
>
> **Punto de entrada:** `/proveedor` (siempre visible **Nueva sección**) y vitrina pública `/fruteria/[id]`.

> **Pasos del Usuario (panel):**
> 1. `[Pantalla: /proveedor]` → Bloques `SectionBlock` ordenados por `sortOrder`. CTA **Nueva sección** ≥44px siempre visible (aunque N=0).
> 2. `[Crear]` → Inline o diálogo corto: nombre 1–40, trim. `POST /api/provider/sections`. 201 → bloque vacío nuevo al final. Should «sugerir Frutas/Verduras/Agrícolas» **fuera de este paquete** (empty copy neutro).
> 3. `[Renombrar]` → Nombre editable (click-to-edit o lápiz). `PATCH /api/provider/sections/[id]` `{ name }`. Duplicado → 409 inline «Ya existe una sección con ese nombre».
> 4. `[Reordenar]` → Handles ↑↓ o drag `md+`; teclado. `PATCH /api/provider/sections/reorder` `{ ids }` permutación completa.
> 5. `[Eliminar]` → Solo si `productCount=0`. Botón papelera enabled. ConfirmDialog: «¿Eliminar la sección {nombre}?». `DELETE` → 204/200. Si hay productos: botón **disabled** + hint «Mueve los productos a otra sección antes de eliminarla» (reasignar en drawer/fila del ítem, `UF-CAT-02`). Si el usuario insiste y API 409: mismo copy, no cascade.

> **Pasos del Usuario (detalle público):**
> 6. `[Pantalla: /fruteria/[id]]` → Tras hero (portada disco o placeholder F2), listado **agrupado** por `section.sortOrder` ASC. Cada grupo: heading `sectionName` + filas vendibles (globales **activos** de este negocio + locales **activos** del dueño). Encargar / stepper F3 y ContactCTA F2 **intactos**.
> 7. `[Sin sección]` → Ítems con `sectionId` null al final bajo heading **Sin sección**.
> 8. `[Empty productos]` → «Sin productos publicados aún» (F2) si cero vendibles. Si hay secciones vacías en panel, no se listan headings vacíos en público.

**Condicionales:**
- **Empty secciones (panel):** → «Aún no hay secciones» + CTA **Nueva sección**. No anidar. No chips en FilterBar Explorar.
- **Empty bloque:** → El heading de sección se muestra en panel (para poder borrar o agregar); en público se omite si no hay vendibles.
- **HTML en nombre / vacío:** → 400 inline.
- **Id ajeno:** → 403 ErrorBanner.
- **Reorder incompleto:** → 400; no persistir orden parcial.
- **FilterBar Explorar:** **prohibido** chips de secciones custom (`D-F10-6`). Taxonomía `FRUTA|VERDURA|AGRICOLA` solo globales / filtro explorar F9.

**Reglas UI:**
- Lista **plana**. Un nivel. Headings `text-lg font-semibold`.
- CTA **Nueva sección** no sustituye **Agregar producto** como primario de catálogo cuando ambas están: Agregar producto = `--brand`; Nueva sección = secondary outline.
- Wireframes: `WF-proveedor-catalogo-f10.md`, `WF-fruteria-secciones.md`.

**API esperada:**
- `GET/POST /api/provider/sections`
- `PATCH /api/provider/sections/[id]`, `PATCH /api/provider/sections/reorder`, `DELETE /api/provider/sections/[id]`
- Público: `GET /api/providers/[id]` delta `scope`, `sectionId`, `sectionName`, `sectionSortOrder` (`API-PROVIDER-PRODUCTS-02`)

**Referencias:** ADR-030, `API-PROVIDER-SECTIONS-01.md`, D-F10-6, D-F10-UX-2, D-F10-UX-4, D-F10-UX-9.
