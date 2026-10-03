# Handoff de Feature: FEAT-CATALOG

> **Proyecto:** laborregamarket  
> **Feature:** Catálogo local + secciones + media disco  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-28  
> **Wireframe:** `WF-proveedor-catalogo-f10`  
> **Contrato:** `API-PROVIDER-PRODUCTS-02`, `API-PROVIDER-SECTIONS-01`, `API-MEDIA-02`  
> **US:** US-CAT-02, US-CAT-03, US-MEDIA-06

## Inputs Utilizados

- **UX:** `Agente UX UI/.../fase-10/handoff-frontend-fase-10.md`
- **BE:** `Agente backend/.../fase-10/handoff-frontend.md`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Catálogo proveedor F10 | `WF-proveedor-catalogo-f10` | `/proveedor` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `CatalogToolbarF10` | `src/components/provider/catalog/` | Agregar producto + Nueva sección ≥44px |
| `SectionBlock` | idem | Rename, reorder, delete vacía |
| `ProductFormDrawer` | idem | Sheet `<md` / drawer `md+` SKU LOCAL |
| `ScopeBadge` | idem | Solo este negocio + Store |
| `ProductImageDropzone` | idem | Preview `/api/media`; copy sin nube |
| `ProviderCatalogF10` | idem | Agrupa por sección; toggle Activo/Inactivo |

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/provider/products` | GET / PATCH | `getMyProducts` / `updateProduct` | API-PROVIDER-PRODUCTS-02 | OK |
| `/api/provider/local-products` | POST / PATCH | `createLocalProduct` / `patchLocalProduct` | API-PROVIDER-PRODUCTS-02 | OK |
| `/api/provider/sections` | GET/POST/PATCH/DELETE + reorder | `listSections` … | API-PROVIDER-SECTIONS-01 | OK |
| `/api/provider/media` | POST | `uploadProviderMedia` | API-MEDIA-02 | OK |
| `/api/provider/products/[id]/image` | POST | `uploadProviderProductImage` | API-MEDIA-02 | OK |

Sin fetch en la vista. Cookie `credentials: include`. LOCAL no usa `POST /api/admin/products`.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Panel | SkeletonTable | «Aún no hay secciones» | ErrorBanner 403 negocio | Catálogo agrupado |
| Media | overlay uploading | placeholder F2 | MEDIA-03 inline | preview disco |

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes |
|------------|--------|----------|
| ProductFormDrawer | nombre, precio, unidad, sección *, Activo, foto | «Elige una sección», «Indica un precio válido» |
| Nueva sección | nombre | 409 nombre duplicado |

---

## 5. Responsive y accesibilidad

- [x] CTA ≥44px; drawer full-screen `<md`
- [x] ScopeBadge nunca color-only
- [x] Toggle Activo/Inactivo (no «agotado»)

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/catalog-group.test.ts`

- [x] Orden `sortOrder` + grupo Sin sección

---

## 7. Definition of Done (DoD Frontend)

- [x] PROVIDER crea SKU local con sección; Encargar/POS del mismo negocio lo listan
- [x] Delete sección disabled o 409 si no vacía
- [x] Reorder permutación completa
- [x] Logo/portada/foto preview disco; cero copy Cloudinary
