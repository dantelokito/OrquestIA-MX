# Handoff de Feature: FEAT-ADMIN

> **Proyecto:** laborregamarket  
> **Feature:** Admin catálogos CRUD + flags proveedor  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-28  
> **Wireframe:** `WF-admin-catalogos`, `WF-admin-proveedores`  
> **Contrato:** `API-ADMIN-PRODUCTS-01`, `API-ADMIN-PROVIDERS-01`  
> **US:** US-ADMIN-02, US-ADMIN-03

## Inputs Utilizados

- **UX:** handoff-frontend-fase-10.md Parte 3–4
- **BE:** handoff-frontend.md

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Catálogos globales | `WF-admin-catalogos` | `/admin` tab Catálogos → Productos | OK |
| Proveedores flags | `WF-admin-proveedores` | `/admin` tab Proveedores | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `AdminProductForm` | `src/components/admin/AdminProductForm.tsx` | 2 cols; categoría plataforma; Inhabilitar |
| `ProviderTableF10` | `src/components/admin/ProviderTableF10.tsx` | 4 flags; scroll-x |
| `AdminFlagSwitch` | `src/components/admin/AdminFlagSwitch.tsx` | ≥44px; texto + switch |

Chrome ADMIN = marca plataforma (`US-BRAND-02`). `/admin/analytics` no se rediseña. `US-ADMIN-04` Promote no implementado (path TBD).

---

## 2. Integración API

| Endpoint | Método | Service | Estado |
|----------|--------|---------|--------|
| `/api/admin/products` | GET/POST | `getAdminProducts` / `createAdminProduct` | OK |
| `/api/admin/products/[id]` | PATCH | `patchAdminProduct` | OK — sin DELETE |
| `/api/admin/products/[id]/image` | POST | `uploadAdminProductImage` | OK |
| `/api/admin/providers/[id]` | PATCH | `updateProviderFlags` | OK |

403 → «Sin permiso para este módulo». 409 slug → «Ya existe un producto con ese identificador».

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Catálogos | Skeleton | «Sin productos» | ErrorBanner | Form + lista |
| Proveedores | Skeleton | «Sin proveedores» | ErrorBanner | Tabla flags |

---

## 4. Formularios

| Formulario | Campos | Notas |
|------------|--------|-------|
| AdminProductForm | nombre, slug, categoría, unidad, descripción, Activo, imagen | Distinct vs drawer PROVIDER |
| RevokeVerifyDialog | Confirm | Copy Google Reviews `US-REV-04` |

---

## 5. Responsive y accesibilidad

- [x] 2 cols desktop; tabla `overflow-x-auto`
- [x] Flags nunca color-only; badge «Sin email válido» F2 intacto

---

## 6. Pruebas

Cubierto por integración BE existente (`admin-products.routes`, `admin-providers.routes`). UI: 403 copy en `mapF10ApiError`.

---

## 7. Definition of Done (DoD Frontend)

- [x] Alta/edición global + imagen disco
- [x] Inhabilitar ≠ DELETE
- [x] Cuatro flags operables
- [x] Revocar verificación muestra copy Google
