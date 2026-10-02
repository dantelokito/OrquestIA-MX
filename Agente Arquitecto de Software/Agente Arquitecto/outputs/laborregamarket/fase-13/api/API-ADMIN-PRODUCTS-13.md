# API-ADMIN-PRODUCTS-13 — Listado completo y moderación isActive

> **Endpoints:** `GET /api/admin/products` (delta) · `PATCH /api/admin/products/[id]` (delta LOCAL) · `DELETE /api/admin/products/[id]`  
> **Descripción:** Admin ve **todos** los `Product` (GLOBAL y LOCAL), pagina de verdad, y retira/reactiva `isActive` en ambos orígenes. Alta admin **sigue** solo GLOBAL (F10).  
> **Autenticación:** Requerida → `Authorization: Bearer <token>` + rol ADMIN + `hasModulePermission(PRODUCTS, view|edit)`  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.13.0  
> **Fecha:** 2026-09-16  
> **US:** US-ADMIN-05, US-ADMIN-06, US-SEC-04  
> **ADR:** ADR-002, ADR-003, ADR-004, ADR-029 (enmendado por ADR-038), ADR-038  
> **Envelope:** ADR-003 (`data` / `error` + `details[]`).  
> **Base (solo lectura):** `fase-10/api/API-ADMIN-PRODUCTS-01.md`

## Inputs Utilizados

- **PRD:** fase-13 PM
- **US:** US-ADMIN-05/06, US-SEC-04

---

## GET `/api/admin/products`

> **Descripción:** Listar SKU maestro **GLOBAL y LOCAL**. No lista filas de `provider_products` como SKU distintos.  
> **Autenticación:** ADMIN + PRODUCTS/view

#### Query

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | number | 1 | ≥ 1 |
| `limit` | number | **50** | Máx. **100**. Default cambia de 20 (F10) a 50 (D-F13-12). |
| `q` | string | — | `name` / `slug` (trim, máx. 80) |
| `isActive` | boolean | — | Filtro opcional |
| `scope` | `GLOBAL` \| `LOCAL` | — | Filtro opcional |
| `ownerProviderId` | cuid | — | Solo aplica a LOCAL. GLOBAL no tiene dueño (se ignoran o 400 si `scope=GLOBAL` + este filtro). Dueño inexistente → **200** `data: []`, `total: 0` (no 500). |

`page`/`limit` inválidos (0, negativo, >100, no entero) → **400**.

#### 200

```json
{
  "data": [
    {
      "id": "clxglob01",
      "name": "Mango Ataulfo",
      "slug": "mango-ataulfo",
      "category": "FRUTA",
      "unit": "KG",
      "imageUrl": "/api/media/abc.webp",
      "isActive": true,
      "scope": "GLOBAL",
      "ownerProviderId": null,
      "ownerBusinessName": null,
      "createdAt": "2026-01-15T10:00:00.000Z"
    },
    {
      "id": "clxloc01",
      "name": "Chile del rancho",
      "slug": "chile-del-rancho",
      "category": null,
      "unit": "KG",
      "imageUrl": null,
      "isActive": true,
      "scope": "LOCAL",
      "ownerProviderId": "clxprov01",
      "ownerBusinessName": "Frutas El Paraíso Centro",
      "createdAt": "2026-09-01T10:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 50, "total": 120, "totalPages": 3 }
}
```

Prohibido recortar en silencio con `limit: 100` único. `meta.total` / `totalPages` reales.

PROVIDER → **403**. Sin JWT → **401**.

---

## PATCH `/api/admin/products/[id]`

> **Descripción:** Moderación. **GLOBAL:** body F10 (name, slug, description, category, unit, isActive). **LOCAL:** **solo** `isActive`. Admin **no** CRUD de nombre/precio/unidad de LOCAL ajeno.  
> **Autenticación:** ADMIN + PRODUCTS/edit

#### Body LOCAL (único campo permitido)

```json
{ "isActive": false }
```

Cualquier otro campo en LOCAL (`name`, `unit`, `price`, `scope`) → **400**.

Id inexistente → **404**. PROVIDER → **403**.

Retiro `isActive=false`: deja de ser vendible (ADR-022). AUDIT `PRODUCTS` `DISABLE` o `ENABLE`. LOCAL: `details.scope: "LOCAL"`.

#### 200

Mismo shape de fila que GET (un objeto en `data`).

---

## DELETE `/api/admin/products/[id]`

> **Descripción:** Prohibido.  
> **Autenticación:** si hay sesión, igual **405**.

**405 Method Not Allowed** (GLOBAL y LOCAL). No Prisma `delete`. Mensaje:

```json
{
  "error": "No se puede eliminar el producto",
  "details": [{ "field": "id", "message": "Usa isActive=false o archivo de oferta. DELETE no está permitido" }]
}
```

---

## POST `/api/admin/products`

Sin delta Must: sigue F10 (solo GLOBAL). Un GLOBAL **nuevo** aparece en paneles proveedor (D-F13-23).

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Query/body inválido; PATCH LOCAL con campos ajenos |
| 401 | Sin sesión |
| 403 | No ADMIN / sin permiso / PROVIDER |
| 404 | Id inexistente |
| 405 | DELETE |
| 409 | Slug duplicado GLOBAL (POST/PATCH F10) |
| 429 | Rate limit altas F10 |
| 500 | Error interno |

## Rendimiento

Listado: `include` dueño LOCAL en la misma query. Paginación offset ADR-004. Sin N+1.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/api/API-ADMIN-PRODUCTS-13.md`
- **Agente Downstream:** Backend Developer
