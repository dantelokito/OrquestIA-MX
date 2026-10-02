# DB-products — Delta Fase 10 (dual SKU + imagen de instancia)

> **Entidades:** `products`, `provider_products`  
> **Módulo:** `PRODUCTS`  
> **Fecha:** 28/08/2026  
> **Versión:** 0.10.2  
> **Base F1:** [`../../fase-1/data-model/DB-products.md`](../../fase-1/data-model/DB-products.md) (solo lectura)  
> **ADR:** [`../../comun/adrs/ADR-029-dual-sku.md`](../../comun/adrs/ADR-029-dual-sku.md), [`../../comun/adrs/ADR-032-disk-image-storage.md`](../../comun/adrs/ADR-032-disk-image-storage.md)

## Inputs Utilizados

- **PRD:** `Administrador de producto/.../fase-10/prd.md`
- **US:** `US-CAT-02`, `US-ADMIN-02`, `US-MEDIA-06`
- **Schema vivo:** `LaBorregaMarket/prisma/schema.prisma`

---

## Product — delta F10

Campos F1 (`id`, `name`, `slug`, `description`, `unit`, `image_url`, `is_active`, timestamps) **siguen**. Cambios:

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `scope` | `ProductScope` | NOT NULL, DEFAULT `GLOBAL` | `GLOBAL` comparable; `LOCAL` solo de un negocio |
| `owner_provider_id` | `String` | FK → `providers.id`, NULLABLE | Obligatorio si `scope=LOCAL`; `null` si GLOBAL |
| `category` | `ProductCategory` | NULLABLE | **Requerido** si GLOBAL; `null` si LOCAL |

```prisma
enum ProductScope {
  GLOBAL
  LOCAL
}
```

### Backfill

Todos los `Product` existentes → `scope=GLOBAL`, `owner_provider_id=null`, `category` intacta.

### Índices (migración SQL; Prisma no expresa parciales)

```sql
-- Quitar UNIQUE global de slug (hoy @@unique).
CREATE UNIQUE INDEX products_slug_global
  ON products (slug) WHERE scope = 'GLOBAL';

CREATE UNIQUE INDEX products_slug_local
  ON products (owner_provider_id, slug) WHERE scope = 'LOCAL';

CREATE INDEX products_owner_scope
  ON products (owner_provider_id, scope);
```

CHECK de aplicación (Must en servicio; Could trigger):

- `scope=GLOBAL` ⇒ `owner_provider_id IS NULL` y `category IS NOT NULL`
- `scope=LOCAL` ⇒ `owner_provider_id IS NOT NULL` y `category IS NULL`

### Reglas Product F10

1. ADMIN crea/edita/retira **solo** GLOBAL (`is_active=false` = retiro). Hard-delete prohibido si existe `ProviderProduct` o `OrderItem` → 409.
2. PROVIDER crea LOCAL en transacción con su `ProviderProduct`.
3. `image_url` GLOBAL = ADMIN disco (ADR-032). LOCAL puede copiar la URL de instancia.
4. PROVIDER **no** usa `POST /api/admin/products`.

---

## ProviderProduct — delta F10

Campos F1 (`id`, `provider_id`, `product_id`, `price`, `is_available`, `stock`, timestamps) **siguen**. `@@unique([providerId, productId])` **se conserva**.

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `section_id` | `String` | FK → `provider_sections.id`, NULLABLE, `ON DELETE RESTRICT` | Sección del negocio (ADR-030). Alta local Must |
| `image_url` | `String` | NULLABLE | Override de vitrina (disco). Lectura: este valor ?? `Product.imageUrl` |

### Reglas ProviderProduct F10

1. No introducir `isActive` (T9 / ADR-022).
2. Instancia sobre `Product.scope=LOCAL` de **otro** `ownerProviderId` → 403.
3. `section_id` debe pertenecer al mismo `provider_id`.
4. Vendible = `isAvailable=true` **y** `Product.isActive=true` (locales incluidos).

---

## Relación Provider

```prisma
model Provider {
  // ...
  sections       ProviderSection[]
  ownedProducts  Product[]         @relation("OwnedLocalProducts")
}
```

`Product.ownerProviderId` → `Provider` relación `"OwnedLocalProducts"`. `onDelete`: Restrict (no borrar provider con locales; el user cascade de F1 no aplica a Product).

---

## Convención nombres API vs DB

| DB | API JSON |
|----|----------|
| `scope` | `scope` (`GLOBAL` \| `LOCAL`) |
| `owner_provider_id` | `ownerProviderId` |
| `section_id` | `sectionId` |
| `image_url` (instancia) | `imageUrl` en el ítem de vitrina (resuelto) |

---

## Migración sugerida

Nombre: `add_product_scope_sections_media`

Orden: enum `ProductScope` → columnas Product (default GLOBAL) → drop unique slug → índices parciales → `provider_sections` → `section_id` + `image_url` en `provider_products`.

---

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/data-model/DB-products.md`
- **Agente Downstream:** Backend Developer
- **Inputs Requeridos:** ADR-029, ADR-032, `US-CAT-02`
