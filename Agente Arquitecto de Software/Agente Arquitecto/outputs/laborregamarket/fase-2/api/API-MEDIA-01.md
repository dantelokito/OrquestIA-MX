# API-MEDIA-01 — Upload de imágenes

> **Módulo:** `PROVIDERS`, `PRODUCTS`  
> **Versión:** 0.2.0  
> **Fecha:** 10/08/2026  
> **Estado:** Nuevo — Fase 2  
> **Storage:** Cloudinary ([ADR-006](../adrs/ADR-006-image-storage.md))

---

## POST `/api/provider/media`

> **Descripción:** Sube o reemplaza logo o imagen de portada del Provider autenticado.  
> **Autenticación:** Requerida — Rol `PROVIDER`  
> **Content-Type:** `multipart/form-data`

#### Form fields:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `file` | File | Sí | Imagen JPEG / PNG / WebP, max **5 MB** |
| `field` | string | Sí | `logo` \| `cover` |

Mapeo `field` → columna:

| `field` | Prisma / JSON |
|---------|---------------|
| `logo` | `logoUrl` |
| `cover` | `coverUrl` |

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "url": "https://res.cloudinary.com/demo/image/upload/v1/laborregamarket/providers/clx/logo.jpg",
    "field": "logoUrl"
  }
}
```

* **400 Bad Request:** MIME no permitido, size &gt; 5MB, `field` inválido, archivo ausente.

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "file", "message": "Formato no permitido. Usa JPEG, PNG o WebP" }
  ]
}
```

* **401 Unauthorized** / **403 Forbidden**

* **404 Not Found:** PROVIDER sin entidad Provider (onboarding incompleto).

```json
{ "error": "Perfil de proveedor no encontrado" }
```

* **500 Internal Error:** Fallo Cloudinary o persistencia.

#### Side effects

1. Validar ownership: `Provider.userId === session.sub`.
2. Upload a Cloudinary (folder `laborregamarket/providers/{providerId}/`).
3. Update `logoUrl` o `coverUrl`.
4. Purge asset anterior si URL previa era Cloudinary del mismo cloud.
5. `AuditLog`: `module=PROVIDERS`, `action=MEDIA_UPLOAD`, `entityId=provider.id`, `details` según [ADR-007](../adrs/ADR-007-contact-audit-action.md).

---

## POST `/api/admin/products/[id]/image`

> **Descripción:** Sube o reemplaza imagen del producto en catálogo global.  
> **Autenticación:** Requerida — Rol `ADMIN`  
> **Content-Type:** `multipart/form-data`

#### Path Parameters:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | string (cuid) | ID del `Product` |

#### Form fields:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `file` | File | Sí | JPEG / PNG / WebP, max **5 MB** |

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "url": "https://res.cloudinary.com/demo/image/upload/v1/laborregamarket/products/clx/image.jpg",
    "field": "imageUrl"
  }
}
```

* **400 Bad Request:** Validación MIME/size.

* **401 Unauthorized** / **403 Forbidden**

* **404 Not Found:** Producto no existe.

```json
{ "error": "Producto no encontrado" }
```

* **500 Internal Error**

#### Side effects

1. Upload Cloudinary folder `laborregamarket/products/{productId}/`.
2. Update `Product.imageUrl`.
3. Purge recurso anterior si aplica.
4. `AuditLog`: `module=PRODUCTS`, `action=MEDIA_UPLOAD`, `entityId=product.id`.

---

## Validación común

| Regla | Valor | HTTP |
|-------|-------|------|
| MIME | `image/jpeg`, `image/png`, `image/webp` | 400 |
| Max size | 5_242_880 bytes (5 MB) | 400 |
| Dimensiones | Soft-check (cover sugerido 1200×600, logo 512×512) — **no** rechazar solo por px | — |
| URL guardada | Debe ser `https://` | — |

Hints de UI (no contrato estricto): cover landscape; logo cuadrado.

---

## NFR

| Área | Requisito |
|------|-----------|
| Seguridad | PROVIDER solo su Provider; ADMIN solo Product global |
| Storage | Purge al reemplazar; HTTPS only |
| Envelope | ADR-003 |
| Observabilidad | AUDIT `MEDIA_UPLOAD` |

---

## Fuera de alcance

- Galerías multi-imagen.
- Upload de imágenes por CLIENT.
- Transformaciones obligatorias server-side (Cloudinary URL transforms opcionales en Frontend).
- S3 / signed upload client-direct.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Routes | `src/app/api/provider/media/route.ts`, `src/app/api/admin/products/[id]/image/route.ts` |
| Service | `src/lib/services/media.service.ts` |
| Storage | `src/lib/storage/cloudinary.ts` |

Dependencia npm sugerida: `cloudinary`.

---

## Referencias

- ADR storage: [`../adrs/ADR-006-image-storage.md`](../adrs/ADR-006-image-storage.md)
- ADR audit: [`../adrs/ADR-007-contact-audit-action.md`](../adrs/ADR-007-contact-audit-action.md)
- Providers: [`../data-model/DB-providers.md`](../data-model/DB-providers.md)
- Products: [`../data-model/DB-products.md`](../data-model/DB-products.md)
- Envelope: [`../adrs/ADR-003-error-envelope.md`](../adrs/ADR-003-error-envelope.md)
- UX: `handoff-ux-ui-fase-2.md` (upload logo circular / cover banner)
