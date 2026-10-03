# Handoff de Feature: FEAT-FRUTERIA

> **Proyecto:** laborregamarket  
> **Feature:** Detalle frutería agrupado por sección  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-28  
> **Wireframe:** `WF-fruteria-secciones`  
> **Contrato:** `GET /api/providers/[id]` (delta F10)  
> **US:** US-CAT-03

## Inputs Utilizados

- **UX:** `WF-fruteria-secciones.md`
- **BE:** handoff-frontend.md — `scope`, `sectionId`, `sectionName`, `sectionSortOrder`, `imageUrl`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Detalle agrupado | `WF-fruteria-secciones` | `/fruteria/[id]` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `SectionedProductList` | `src/components/fruteria/SectionedProductList.tsx` | Grupos por `sectionSortOrder`; omite vacíos |
| `ProductTable` | `src/components/fruteria/ProductTable.tsx` | Modo `embedded`; Encargar intacto |
| `ProviderHero` | `src/components/fruteria/ProviderHero.tsx` | Cover/logo `/api/media` unoptimized |

---

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/providers/[id]` | GET | `getProviderById` | OK — usa campos sección ya en payload |

POS: `getMyProducts()` filtrado `isAvailable` lista locales del dueño sin rediseño.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Detalle | Skeleton | «Sin productos publicados aún» | ErrorBanner | Grupos + Encargar |

---

## 4. Formularios

N/A (cantidad Encargar F2–F3).

---

## 5. Responsive y accesibilidad

- [x] Headings de sección; Encargar ≥44px
- [x] FilterBar Explorar **sin** chips de sección

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/catalog-group.test.ts`

- [x] Omite headings vacíos y productos inactivos

---

## 7. Definition of Done (DoD Frontend)

- [x] Listado agrupado (globales activos + locales vendibles)
- [x] Hero disco o placeholder
- [x] Encargar dominante; contacto no bloqueado
