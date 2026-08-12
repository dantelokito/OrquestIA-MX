# DB-products — Entidades Product y ProviderProduct

> **Entidades:** `products`, `provider_products`  
> **Módulo:** `PRODUCTS`  
> **Fecha:** 10/08/2026  
> **Versión:** 0.2.0 — `imageUrl` vía Cloudinary + filtros explorar

---

## Product — Catálogo global

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador único |
| `name` | `String` | NOT NULL | Nombre del producto (ej. Mango) |
| `slug` | `String` | UNIQUE, NOT NULL | Identificador URL-safe (ej. `mango`) |
| `description` | `String` | NULLABLE | Descripción del producto |
| `category` | `ProductCategory` | NOT NULL | `FRUTA`, `VERDURA`, `AGRICOLA` |
| `unit` | `ProductUnit` | NOT NULL, DEFAULT `KG` | Unidad de venta |
| `image_url` | `String` | NULLABLE | URL HTTPS imagen catálogo (Cloudinary — [ADR-006](../adrs/ADR-006-image-storage.md)) |
| `is_active` | `Boolean` | NOT NULL, DEFAULT `true` | Visible en catálogo global |
| `created_at` | `DateTime` | NOT NULL | Fecha creación |
| `updated_at` | `DateTime` | NOT NULL | Última modificación |

### Reglas Product

1. **Solo ADMIN** crea/edita/desactiva productos globales.
2. `is_active=false` excluye producto del panel proveedor y detalle público.
3. `slug` único — generar desde `name` en minúsculas sin espacios.
4. **MEDIA (Fase 2):** `imageUrl` solo vía `POST /api/admin/products/[id]/image`. Max 5MB JPEG/PNG/WebP; purge al reemplazar; AUDIT `MEDIA_UPLOAD` en módulo `PRODUCTS`.
5. **EXPLORE:** `category` ∈ `FRUTA` \| `VERDURA` \| `AGRICOLA` alimenta filtro `GET /api/providers?category=`.

---

## ProviderProduct — Instancia por proveedor

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador único |
| `provider_id` | `String` | FK → `providers.id`, NOT NULL | Negocio dueño |
| `product_id` | `String` | FK → `products.id`, NOT NULL | Producto global |
| `price` | `Decimal(10,2)` | NOT NULL | Precio del proveedor |
| `is_available` | `Boolean` | NOT NULL, DEFAULT `true` | Disponible para venta |
| `stock` | `Int` | NULLABLE | Stock opcional (no usado MVP) |
| `created_at` | `DateTime` | NOT NULL | Fecha activación |
| `updated_at` | `DateTime` | NOT NULL | Última modificación |

### Constraints

```prisma
@@unique([providerId, productId])
```

### Reglas ProviderProduct

1. **PROVIDER** solo puede editar `price` e `is_available` de sus propias instancias.
2. **Precio obligatorio** al activar producto nuevo (crear registro).
3. **is_available=false** oculta en detalle público y explorar.
4. Si no existe `ProviderProduct`, el producto aparece como inactivo en panel proveedor.
5. **Precio >= 0**, máximo 2 decimales.

---

## Convención nombres API vs DB

| DB (Prisma) | API JSON | UI wireframes |
|-------------|----------|---------------|
| `is_available` | `isAvailable` | A veces `isActive` — mapear en frontend |
| `is_active` (Product) | `isActive` | — |

**Decisión T9:** Mantener `isAvailable` en API/DB; frontend traduce a `isActive` si el wireframe lo requiere.

---

## Catálogo seed MVP (15 productos)

### Frutas (7)
Mango, Plátano, Naranja, Fresa, Piña, Papaya, Uva

### Verduras (5)
Tomate, Chile jalapeño, Cebolla, Lechuga, Zanahoria

### Agrícolas (3)
Maíz, Frijol negro, Arroz

Cada proveedor seed tiene `ProviderProduct` con variación de precio (~±10%) y disponibilidad aleatoria.

---

## Flujo panel proveedor

```
GET /api/provider/products
→ 15 Product activos + estado ProviderProduct del proveedor logueado

PATCH /api/provider/products
→ { productId, isAvailable, price? }
→ CREATE si no existe + price requerido
→ UPDATE si existe
→ AuditLog PRODUCTS ENABLE/DISABLE
```

---

## Response detalle frutería (productos activos)

```json
{
  "productId": "clx...",
  "name": "Mango",
  "slug": "mango",
  "category": "FRUTA",
  "unit": "KG",
  "price": 45.00,
  "isAvailable": true,
  "imageUrl": null
}
```

Solo productos con `ProviderProduct.isAvailable=true` Y `Product.isActive=true`. Incluir `imageUrl` desde `Product` (UI MEDIA).

---

## Índices

| Tabla | Índice | Estado |
|-------|--------|--------|
| `products` | UK `slug` | Existe |
| `provider_products` | UK `(provider_id, product_id)` | Existe |
| `products` | `(category, is_active)` | Opcional Fase 2 si filtro explorar &gt; 2s |

Dataset global &lt; 15 productos; join por categoría es barato en MVP.

---

## Referencias

- Catálogo flow: [`../diagrams/ARCH-CATALOG-01.md`](../diagrams/ARCH-CATALOG-01.md)
- API proveedor: [`../api/API-PROVIDER-01.md`](../api/API-PROVIDER-01.md)
- API detalle / explorar: [`../api/API-PROVIDERS-01.md`](../api/API-PROVIDERS-01.md)
- API media: [`../api/API-MEDIA-01.md`](../api/API-MEDIA-01.md)
- Schema: `LaBorregaMarket/prisma/schema.prisma`
