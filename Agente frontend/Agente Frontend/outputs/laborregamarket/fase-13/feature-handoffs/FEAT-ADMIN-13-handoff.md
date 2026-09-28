# Handoff de Feature: FEAT-ADMIN-13

> **Proyecto:** laborregamarket  
> **Feature:** ADMIN (US-ADMIN-05/06, US-SEC-04)  
> **Stack UI:** Next.js 15 + React 19 + TypeScript + Tailwind 4  
> **Fecha:** 2026-09-16  
> **Wireframe de referencia:** `WF-ADMIN-05-catalogo-completo.md`  
> **Contrato de referencia:** `API-ADMIN-PRODUCTS-13.md`. Sin `MOD-*-handoff.md` F13 al entregar.

## Inputs Utilizados

- Handoff UX `fase-13/handoff-frontend-fase-13.md`
- Tokens/IA v0.13.0
- **JSON real:** `Agente backend/.../fase-13/handoff-frontend.md` + `API-ADMIN-PRODUCTS-13.md`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Tabla GLOBAL+LOCAL + filtros + paginación 50/100 | WF-ADMIN-05 | `/admin` (tab Productos) | OK |
| Inhabilitar / Reactivar ConfirmDialog | WF-ADMIN-05 | misma | OK |
| Alta GLOBAL (form existente, CTA Nuevo producto) | WF-ADMIN-05 | misma | OK |
| LOCAL: solo estado, no CRUD de nombre | Arch PATCH LOCAL | misma | OK |

**Componentes:** `AdminProductTableF13`, `PaginationBar`.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/admin/products` | GET | `getAdminProducts` | API-ADMIN-PRODUCTS-13 | GET con `page`/`limit` 50|100, `scope`, `ownerProviderId`. `meta.total` / `totalPages` reales. PATCH LOCAL solo `{ isActive }`. DELETE no se llama; 405 copy si llega. |
| `/api/admin/products/[id]` | PATCH | `patchAdminProduct` | API-ADMIN-PRODUCTS-13 | LOCAL solo `isActive` |
| DELETE | — | **no se llama** | US-SEC-04 | 405 copy si llega |

Sin `fetch` en la vista. Envelope ADR-003 vía `lib/api/client.ts`.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Listado admin | skeleton 8 filas | limpiar filtros | ErrorBanner + Reintentar | tabla + paginación visible |

---

## 4. Formularios

Alta/edición GLOBAL: nombre, slug, categoría, unidad enum, descripción. LOCAL no usa ese form.

---

## 5. a11y / responsive

Filtros stack en móvil; filas card; acciones ≥44px. Scope + estado con texto (no color-only).

---

## 6. Pruebas

`npx vitest run` → 373 passed. `catalog-f13.test.ts` incluye copy 405.

---

## 7. Pendientes

- Browser E2E con sesión (orquestador/QA).
- Print inventario sucursal = FE (`window.print`).

## Outputs Generados

- **Archivo:** `fase-13/feature-handoffs/FEAT-ADMIN-13-handoff.md`
- **Agente Downstream:** QA
