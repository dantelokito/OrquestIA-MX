# API-ADMIN-PRODUCTS-01 — CRUD catálogo global

> **Endpoints:** `GET/POST /api/admin/products`, `PATCH /api/admin/products/[id]`  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-ADMIN-02  
> **ADR:** [`../../comun/adrs/ADR-029-dual-sku.md`](../../comun/adrs/ADR-029-dual-sku.md), [`../../comun/adrs/ADR-004-pagination-strategy.md`](../../comun/adrs/ADR-004-pagination-strategy.md)  
> **Autenticación:** Requerida — ADMIN + `hasModulePermission(PRODUCTS, view\|create\|edit)`  
> **Imagen:** [`API-MEDIA-02.md`](./API-MEDIA-02.md)

## Inputs Utilizados

- **US:** `US-ADMIN-02`, `US-CAT-01` / ADR-022
- **Base:** F1 `DB-products` (solo ADMIN crea globales; A5 revocada **solo** para locales)

---

## GET `/api/admin/products`

> **Descripción:** Listar productos **globales** (comparables).  
> **Autenticación:** ADMIN + PRODUCTS/view

#### Query

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | number | 1 | ADR-004 |
| `limit` | number | 20 | Max 100 |
| `q` | string | — | Busca `name` / `slug` (trim, max 80) |
| `isActive` | boolean | — | Filtro opcional |

Solo `scope=GLOBAL`. LOCAL no aparecen.

#### 200

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Mango",
      "slug": "mango",
      "description": null,
      "category": "FRUTA",
      "unit": "KG",
      "imageUrl": "/api/media/clxyz.jpg",
      "isActive": true,
      "scope": "GLOBAL",
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 15, "totalPages": 1 }
}
```

---

## POST `/api/admin/products`

> **Descripción:** Alta de SKU comparable.  
> **Autenticación:** ADMIN + PRODUCTS/create

#### Body

```json
{
  "name": "Mango Ataulfo",
  "slug": "mango-ataulfo",
  "description": "Temporada",
  "category": "FRUTA",
  "unit": "KG"
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `name` | string | Sí | 1–80, trim, sin HTML |
| `slug` | string | No | `[a-z0-9-]+`; si omite, se genera del `name` |
| `description` | string \| null | No | Max 500 |
| `category` | enum | Sí | `FRUTA` \| `VERDURA` \| `AGRICOLA` |
| `unit` | enum | Sí | `ProductUnit` existente |
| `isActive` | boolean | No | Default `true` |

`scope` se fuerza `GLOBAL`. `ownerProviderId` se fuerza `null`. PROVIDER → **403**.

#### 201

```json
{
  "data": {
    "id": "clx...",
    "name": "Mango Ataulfo",
    "slug": "mango-ataulfo",
    "category": "FRUTA",
    "unit": "KG",
    "isActive": true,
    "scope": "GLOBAL",
    "imageUrl": null
  }
}
```

AUDIT `PRODUCTS` / `CREATE`. Slug duplicado GLOBAL → **409**.

Rate limit altas: 60 / hora por `userId` ADMIN → **429**.

---

## PATCH `/api/admin/products/[id]`

> **Descripción:** Editar o retirar (`isActive=false`) un GLOBAL.  
> **Autenticación:** ADMIN + PRODUCTS/edit

Body parcial: `name`, `slug`, `description`, `category`, `unit`, `isActive`. No se acepta `scope` ni `ownerProviderId`.

Retiro: `isActive=false` → deja de ofrecerse a nuevas activaciones y deja de ser vendible (ADR-022). AUDIT `DISABLE`. Reactivar: `isActive=true` + AUDIT `ENABLE`.

Id LOCAL o inexistente → **404**.

### Hard-delete

**No hay** `DELETE /api/admin/products/[id]`. Si un cliente llama DELETE → **405**. Intento de borrar fila Prisma con `ProviderProduct` u `OrderItem` existentes (scripts) debe rechazarse en servicio con **409**:

```json
{
  "error": "No se puede eliminar: el producto tiene ofertas o ventas",
  "details": [{ "field": "id", "message": "Retira el producto con isActive=false" }]
}
```

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Validación Zod / HTML en nombre / categoría inválida |
| 401 | Sin sesión |
| 403 | No ADMIN o sin permiso módulo |
| 404 | Id inexistente o no GLOBAL |
| 409 | Slug duplicado; hard-delete ilegal |
| 429 | Rate limit altas |

Imagen: no en este body; `POST /api/admin/products/[id]/image` (API-MEDIA-02).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-ADMIN-PRODUCTS-01.md`
- **Agente Downstream:** Backend Developer
