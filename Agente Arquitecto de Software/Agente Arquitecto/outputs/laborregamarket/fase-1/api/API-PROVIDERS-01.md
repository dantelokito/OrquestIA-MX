# API-PROVIDERS-01 — Explorar y detalle de fruterías

> **Módulo:** `PROVIDERS`, `EXPLORE`  
> **Versión:** 0.2.0  
> **Fecha:** 10/08/2026  
> **Changelog 0.2.0:** Filtros `category` + `q` (producto); `imageUrl` en detalle; contacto → [`API-NOTIFY-01`](./API-NOTIFY-01.md)

---

## GET `/api/providers`

> **Descripción:** Listar fruterías activas para vista explorar (mapa + tarjetas).  
> **Autenticación:** Pública  
> **NFR:** Respuesta filtrada **&lt; 2 s** (p95)

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `city` | string | — | Filtrar por ciudad (case-insensitive contains) |
| `q` | string | — | Búsqueda (min **2** chars). Match en `businessName` **o** `description` **o** nombre de producto activo ofertado por el provider (`ProviderProduct.isAvailable` + `Product.isActive`). Case-insensitive contains. Si `q` tiene 1 char → 400 |
| `category` | enum | — | `FRUTA` \| `VERDURA` \| `AGRICOLA`. Solo providers con ≥1 `ProviderProduct` disponible cuyo `Product.category` coincida y `Product.isActive=true` |
| `verified` | boolean | — | Si `true`, solo `isVerified=true`. Omitido = todos los activos |
| `page` | number | `1` | Página (1-indexed) |
| `limit` | number | `20` | Items por página (max 50) |

**Combinación:** `category`, `q`, `city`, `verified` son **AND**.  
**Sin alias:** no existe query `product`; usar `q`.

#### Respuestas:

* **200 Success:**

```json
{
  "data": [
    {
      "id": "clx...",
      "businessName": "Frutas El Paraíso",
      "description": "Frutas frescas del centro",
      "address": "Av. Juárez 123, Centro",
      "city": "Monterrey",
      "latitude": 25.6714,
      "longitude": -100.3089,
      "phone": "+528112345678",
      "logoUrl": "https://res.cloudinary.com/.../logo.jpg",
      "coverUrl": null,
      "rating": 4.5,
      "reviewCount": 12,
      "isVerified": true,
      "productCount": 8,
      "minPrice": 18.0,
      "sampleProducts": [
        { "name": "Mango", "price": 45.0, "unit": "KG", "imageUrl": null },
        { "name": "Plátano", "price": 18.0, "unit": "KG", "imageUrl": null }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

**Filtros aplicados siempre:** `isActive=true`

**Orden:** `rating DESC` (default)

* **400 Bad Request:** Parámetros inválidos (`page < 1`, `limit > 50`, `q` length 1, `category` no enum).

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "q", "message": "Mínimo 2 caracteres" }
  ]
}
```

* **500 Internal Error**

#### Índices / performance (Fase 2)

Evaluar en `listProviders` con join a `ProviderProduct` + `Product`:

- Índices existentes Provider: `city`, `businessName`, `(isActive, isVerified)`.
- `Product.category` + filtro `isActive` — dataset pequeño (&lt; 15 productos); índice adicional opcional si p95 &gt; 2s.
- Preferir `distinct` provider ids vía `where.providerProducts.some({ ... })` en Prisma.

---

## GET `/api/providers/[id]`

> **Descripción:** Detalle de frutería con productos activos.  
> **Autenticación:** Pública

#### Path Parameters:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID del Provider |

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "id": "clx...",
    "businessName": "Frutas El Paraíso",
    "description": "Frutas frescas del centro de Monterrey",
    "address": "Av. Juárez 123, Centro",
    "city": "Monterrey",
    "state": "Nuevo León",
    "latitude": 25.6714,
    "longitude": -100.3089,
    "phone": "+528112345678",
    "logoUrl": "https://res.cloudinary.com/.../logo.jpg",
    "coverUrl": "https://res.cloudinary.com/.../cover.jpg",
    "rating": 4.5,
    "reviewCount": 12,
    "isVerified": true,
    "products": [
      {
        "productId": "clx...",
        "name": "Mango",
        "slug": "mango",
        "category": "FRUTA",
        "unit": "KG",
        "price": 45.00,
        "isAvailable": true,
        "imageUrl": "https://res.cloudinary.com/.../mango.jpg"
      },
      {
        "productId": "clx...",
        "name": "Plátano",
        "slug": "platano",
        "category": "FRUTA",
        "unit": "KG",
        "price": 18.00,
        "isAvailable": true,
        "imageUrl": null
      }
    ]
  }
}
```

**Productos incluidos:** Solo `ProviderProduct.isAvailable=true` AND `Product.isActive=true`.  
**Orden productos:** `category ASC`, `name ASC`.  
**`imageUrl`:** desde `Product.imageUrl` (nullable) — requerido por UI MEDIA Fase 2.

* **404 Not Found:** Provider no existe o `isActive=false`.

```json
{ "error": "Frutería no encontrada" }
```

* **500 Internal Error**

---

## POST `/api/providers/[id]/contact`

Ver contrato dedicado: [`API-NOTIFY-01.md`](./API-NOTIFY-01.md).

---

## POST `/api/providers`

> **Descripción:** Crear entidad Provider (onboarding wizard paso 2).  
> **Autenticación:** Requerida — Rol `PROVIDER`

#### Body de Solicitud:

```json
{
  "businessName": "string (requerido, min 2)",
  "address": "string (requerido)",
  "city": "string (requerido, default Monterrey)",
  "latitude": "number (requerido, bounding box Monterrey)",
  "longitude": "number (requerido, bounding box Monterrey)",
  "phone": "string (opcional — fallback User.phone)",
  "description": "string (opcional)"
}
```

#### Respuestas:

* **201 Created:**

```json
{
  "data": {
    "id": "clx...",
    "businessName": "Frutas El Nuevo Sol",
    "address": "Calle Hidalgo 45",
    "city": "Monterrey",
    "latitude": 25.68,
    "longitude": -100.31,
    "phone": "+528119998877",
    "isVerified": false,
    "isActive": true
  }
}
```

* **400 Bad Request:** Validación fallida (coords fuera de Monterrey, campos requeridos).

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "latitude", "message": "Ubicación fuera del área de Monterrey" }
  ]
}
```

* **401 Unauthorized:** Sin sesión.

* **403 Forbidden:** Rol no es PROVIDER.

* **409 Conflict:** Provider ya existe para este usuario.

```json
{ "error": "Ya tienes un negocio registrado" }
```

* **500 Internal Error**

#### Side effects

- `AuditLog`: `module=PROVIDERS`, `action=CREATE`, `entityId=provider.id`

#### Bounding box Monterrey

- `latitude`: 25.4 – 25.9
- `longitude`: -100.6 – -99.8

---

## URL explorar (contrato Frontend)

Ejemplo alineado UX: `/explorar?category=FRUTA&q=mango&verified=true`

Los query params de la página deben mapear 1:1 a este GET.

---

## Referencias

- Provider entity: [`../data-model/DB-providers.md`](../data-model/DB-providers.md)
- Products: [`../data-model/DB-products.md`](../data-model/DB-products.md)
- Paginación: [`../adrs/ADR-004-pagination-strategy.md`](../adrs/ADR-004-pagination-strategy.md)
- Onboarding: [`../adrs/ADR-001-provider-onboarding-two-step.md`](../adrs/ADR-001-provider-onboarding-two-step.md)
- Contacto: [`API-NOTIFY-01.md`](./API-NOTIFY-01.md)
- Media: [`API-MEDIA-01.md`](./API-MEDIA-01.md)
- UX: `WF-explorar.md`, `handoff-ux-ui-fase-2.md`
