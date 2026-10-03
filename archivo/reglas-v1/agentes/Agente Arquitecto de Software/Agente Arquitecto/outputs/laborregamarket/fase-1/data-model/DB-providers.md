# DB-providers — Entidad Provider

> **Entidad:** `providers` (Prisma model `Provider`)  
> **Módulo:** `PROVIDERS`  
> **Fecha:** 10/08/2026  
> **Versión:** 0.2.0 — reglas MEDIA + email contacto

---

## Esquema

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador único del negocio |
| `user_id` | `String` | UNIQUE, FK → `users.id`, NOT NULL | Usuario dueño (role PROVIDER) |
| `business_name` | `String` | NOT NULL | Nombre comercial de la frutería |
| `description` | `String` | NULLABLE | Descripción del negocio |
| `address` | `String` | NOT NULL | Dirección física |
| `city` | `String` | NOT NULL, DEFAULT `'Monterrey'` | Ciudad |
| `state` | `String` | NOT NULL, DEFAULT `'Nuevo León'` | Estado |
| `latitude` | `Float` | NOT NULL | Coordenada para mapa |
| `longitude` | `Float` | NOT NULL | Coordenada para mapa |
| `phone` | `String` | NOT NULL | Teléfono de contacto del negocio |
| `logo_url` | `String` | NULLABLE | URL HTTPS logo (Cloudinary — [ADR-006](../adrs/ADR-006-image-storage.md)) |
| `cover_url` | `String` | NULLABLE | URL HTTPS portada (Cloudinary) |
| `rating` | `Float` | NOT NULL, DEFAULT `0` | Rating promedio (placeholder MVP) |
| `review_count` | `Int` | NOT NULL, DEFAULT `0` | Cantidad reseñas (placeholder MVP) |
| `is_active` | `Boolean` | NOT NULL, DEFAULT `true` | Negocio visible en explorar |
| `is_verified` | `Boolean` | NOT NULL, DEFAULT `false` | Verificado por ADMIN |
| `created_at` | `DateTime` | NOT NULL, DEFAULT now | Fecha de registro |
| `updated_at` | `DateTime` | NOT NULL, auto-update | Última modificación |

---

## Relaciones

| Relación | Entidad | Cardinalidad | On Delete |
|----------|---------|--------------|-----------|
| `user` | `User` | 1:1 | Cascade |
| `providerProducts` | `ProviderProduct` | 1:N | Cascade |
| `orders` | `Order` | 1:N | — |

---

## Reglas de dominio

1. **Relación 1:1 con User:** Un `User` con `role=PROVIDER` tiene máximo un `Provider`.
2. **Onboarding obligatorio:** Sin `Provider`, el panel `/proveedor` muestra EmptyState (BL-003).
3. **Creación:** Via `POST /api/providers` tras registro paso 1 (ADR-001). 409 si ya existe Provider para el user.
4. **is_active=false:** Excluir de `GET /api/providers` (explorar).
5. **is_verified:** Filtro opcional `?verified=true` en explorar; badge en UI.
6. **rating/reviewCount:** Valores estáticos del seed en MVP; sistema real en Fase 3.
7. **Verificación manual:** Solo ADMIN puede cambiar `is_verified` via `PATCH /api/admin/providers/[id]`.
8. **MEDIA (Fase 2):** `logoUrl` / `coverUrl` solo vía `POST /api/provider/media` (PROVIDER dueño). Max 5MB JPEG/PNG/WebP; purge Cloudinary al reemplazar. AUDIT `MEDIA_UPLOAD`.
9. **NOTIFY (Fase 2):** Email de contacto usa `Provider.user.email`. Sin tabla Contact — eventos en `AuditLog` (`CONTACT`).
10. **EXPLORE (Fase 2):** Filtro `category` = providers con ≥1 producto activo en esa `ProductCategory`; `q` también busca por nombre de producto ofertado.

---

## Validación geográfica — Bounding box Monterrey

Validación en capa aplicación (Zod), no en DB:

| Coordenada | Mínimo | Máximo |
|------------|--------|--------|
| `latitude` | 25.4 | 25.9 |
| `longitude` | -100.6 | -99.8 |

```json
// Error 400 si fuera de rango
{
  "error": "Validation failed",
  "details": [{ "field": "latitude", "message": "Ubicación fuera del área de Monterrey" }]
}
```

---

## Validaciones onboarding (paso 2)

| Campo | Regla |
|-------|-------|
| `businessName` | required, min 2 caracteres |
| `address` | required |
| `city` | required, default `Monterrey` |
| `latitude` | required, dentro bounding box |
| `longitude` | required, dentro bounding box |
| `phone` | opcional en wizard; si omitido, usar `User.phone` |
| `description` | opcional |

---

## Índices propuestos (migración Prisma)

```prisma
@@index([city])
@@index([businessName])
@@index([isActive, isVerified])
```

| Índice | Justificación | Backlog |
|--------|---------------|---------|
| `(city)` | Filtro `?city=Monterrey` | BL-011 |
| `(business_name)` | Búsqueda `?q=` por nombre | BL-011 |
| `(is_active, is_verified)` | Chip "verificado" en explorar | BL-011 |

**Estado:** Índices Fase 1 implementados o pendientes de verificación en código. Fase 2: performance de joins `ProviderProduct` vía Prisma `some` — sin índice nuevo obligatorio si p95 &lt; 2s.

---

## Proveedores demo (seed)

| Negocio | Ciudad | Verificado |
|---------|--------|------------|
| Frutas El Paraíso | Centro, Monterrey | ✅ |
| Campo Verde Frutería | San Pedro, Monterrey | ✅ |
| La Borrega Agrícola | Santa Catarina | ❌ |

---

## API response (listado explorar)

```json
{
  "id": "clx...",
  "businessName": "Frutas El Paraíso",
  "description": "Frutas frescas del centro",
  "address": "Av. Juárez 123, Centro",
  "city": "Monterrey",
  "latitude": 25.6714,
  "longitude": -100.3089,
  "phone": "+528112345678",
  "logoUrl": null,
  "coverUrl": null,
  "rating": 4.5,
  "reviewCount": 12,
  "isVerified": true,
  "productCount": 8,
  "minPrice": 18.0,
  "sampleProducts": [
    { "name": "Mango", "price": 45.0, "unit": "KG" }
  ]
}
```

---

## Referencias

- API: [`../api/API-PROVIDERS-01.md`](../api/API-PROVIDERS-01.md)
- Media: [`../api/API-MEDIA-01.md`](../api/API-MEDIA-01.md)
- Notify: [`../api/API-NOTIFY-01.md`](../api/API-NOTIFY-01.md)
- Onboarding: [`../adrs/ADR-001-provider-onboarding-two-step.md`](../adrs/ADR-001-provider-onboarding-two-step.md)
- Schema: `LaBorregaMarket/prisma/schema.prisma` (model `Provider`)
