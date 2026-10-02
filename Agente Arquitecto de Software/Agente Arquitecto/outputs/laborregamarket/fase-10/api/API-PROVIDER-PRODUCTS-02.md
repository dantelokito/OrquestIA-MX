# API-PROVIDER-PRODUCTS-02 — Producto local y listado de panel

> **Endpoints:** `GET /api/provider/products` (delta), `POST /api/provider/local-products`, `PATCH /api/provider/local-products/[id]`  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-CAT-02, US-CAT-01  
> **ADR:** [`../../comun/adrs/ADR-029-dual-sku.md`](../../comun/adrs/ADR-029-dual-sku.md), [`../../comun/adrs/ADR-022-catalog-inactive.md`](../../comun/adrs/ADR-022-catalog-inactive.md)  
> **Autenticación:** Requerida — Rol `PROVIDER` (dueño)  
> **Toggle global F1:** [`../../fase-1/api/API-PROVIDER-01.md`](../../fase-1/api/API-PROVIDER-01.md) `PATCH /api/provider/products` **sigue** para activar GLOBAL

## Inputs Utilizados

- **US:** `US-CAT-02`
- **Base panel:** `GET /api/provider/products` F1/F5

---

## GET `/api/provider/products` — delta

Sigue autenticado PROVIDER dueño. El `catalog` ahora tiene **dos orígenes**:

1. Todos los `Product` `scope=GLOBAL` y `isActive=true`, con estado de instancia (F1: `price` null + `isAvailable` false = no activado).
2. Todos los `Product` `scope=LOCAL` con `ownerProviderId` = el negocio (incluidos `isActive=false` / `isAvailable=false` para poder reactivar).

**Prohibido** incluir LOCAL de otro `ownerProviderId`.

Cada fila añade:

```json
{
  "scope": "GLOBAL",
  "sectionId": "clx...",
  "sectionName": "Frutas de temporada",
  "imageUrl": "/api/media/clxyz.jpg",
  "providerProductId": "clx..."
}
```

`imageUrl` resuelto: `ProviderProduct.imageUrl ?? Product.imageUrl`. Locales: `product.category` es `null`. Orden: `section.sortOrder ASC NULLS LAST`, luego `name ASC`.

401 / 403 / 404 (sin Provider) igual F1.

---

## POST `/api/provider/local-products`

> **Descripción:** Crear SKU local (transacción `Product` LOCAL + `ProviderProduct`).  
> **Autenticación:** PROVIDER dueño. CLIENT/ADMIN → **403**.

#### Body (JSON; imagen aparte vía MEDIA)

```json
{
  "name": "Chile del rancho",
  "unit": "KG",
  "price": 38.5,
  "sectionId": "clx...",
  "isAvailable": true,
  "description": null
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `name` | string | Sí | 1–80, trim, sin HTML / tags |
| `unit` | enum | Sí | `ProductUnit` |
| `price` | number | Sí | ≥ 0, max 2 decimales |
| `sectionId` | cuid | Sí | Debe ser sección **de este** provider |
| `isAvailable` | boolean | No | Default `true` |
| `description` | string \| null | No | Max 500 |

`slug` generado único por negocio (`slugify(name)` + sufijo si choca). `category` se persiste `null`. `scope=LOCAL`. `ownerProviderId` = provider de la sesión.

Sección ajena → **403**. Nombre vacío → **400**. Sin auth → **401**.

#### 201

```json
{
  "data": {
    "providerProductId": "clx...",
    "productId": "clx...",
    "scope": "LOCAL",
    "name": "Chile del rancho",
    "slug": "chile-del-rancho",
    "unit": "KG",
    "price": 38.5,
    "isAvailable": true,
    "sectionId": "clx...",
    "imageUrl": null
  }
}
```

AUDIT `PRODUCTS` / `CREATE`. Rate limit: 30 altas / hora / provider → **429**.

Vendible de inmediato si `isAvailable` y `Product.isActive` (alta default true): aparece en `/fruteria/[id]`, Encargar y POS de **ese** negocio. Otro detalle de frutería **no** lo lista.

---

## PATCH `/api/provider/local-products/[id]`

`id` = `ProviderProduct.id` del local propio (no el `Product.id` global).

Body parcial: `name`, `unit`, `price`, `sectionId`, `isAvailable`, `description`. Cambiar `name` actualiza `Product.name` (y slug solo si no choca). `isAvailable=false` aplica ADR-022 (ocultar + 409 en venta).

Id de otro provider → **403**. Id GLOBAL (intento de usar esta ruta para un comparable) → **400** `{ "error": "Usa PATCH /api/provider/products para el catálogo global" }`.

AUDIT `UPDATE` o `DISABLE`/`ENABLE` según `isAvailable`.

No hay DELETE hard. Retiro = `isAvailable=false` y/o `Product.isActive=false` del LOCAL (dueño). Hard-delete con `OrderItem` → 409 (mismo espíritu ADMIN).

---

## Activación GLOBAL (sin cambio de path)

`PATCH /api/provider/products` F1 (`productId` GLOBAL, `isAvailable`, `price`) **sigue**. Si `productId` es LOCAL ajeno o propio vía esa ruta: propio LOCAL → redirigir semántica a la ruta local o **400** claro; ajeno → **403**.

Opcional F10: el mismo PATCH F1 acepta `sectionId` para asignar un GLOBAL activado a una sección.

---

## Delta público `GET /api/providers/[id]`

Cada ítem vendible incluye `scope`, `sectionId`, `sectionName`, `sectionSortOrder`. LOCAL solo del `id` pedido. `category` null en locales (FE no los usa para FilterBar).

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Validación; ruta local sobre GLOBAL |
| 401 | Sin sesión |
| 403 | Rol incorrecto; sección/producto ajeno |
| 404 | Sin Provider / id inexistente |
| 409 | Venta de inhabilitado (órdenes/POS, ADR-022); hard-delete |
| 429 | Rate limit altas |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-PROVIDER-PRODUCTS-02.md`
- **Agente Downstream:** Backend Developer, Frontend (shape)
