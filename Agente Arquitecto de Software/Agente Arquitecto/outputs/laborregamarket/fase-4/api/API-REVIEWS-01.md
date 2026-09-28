# API-REVIEWS-01 — Reseñas nativas

> **Endpoint:** varios bajo `/api/orders/*` y `/api/providers/[id]/reviews`  
> **Módulo:** `REVIEWS`  
> **Versión:** 0.4.0  
> **Fecha:** 14/08/2026  
> **US:** US-REV-01, US-REV-02  
> **ADR:** [ADR-018](../../comun/adrs/ADR-018-google-reviews.md)  
> **Autenticación:** Según endpoint (pública o CLIENT / ADMIN)

Envelope [ADR-003](../../comun/adrs/ADR-003-error-envelope.md). Paginación [ADR-004](../../comun/adrs/ADR-004-pagination-strategy.md).

---

## POST `/api/orders/[id]/reviews`

> **Descripción:** Crear reseña del pedido propio en `DELIVERED`. Recalcula `Provider.rating` / `reviewCount` en la misma transacción.  
> **Autenticación:** Requerida — Rol `CLIENT` → Header: cookie JWT

#### Path Parameters:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | string (cuid) | `Order.id` |

#### Body de Solicitud (Request Payload):

```json
{
  "rating": 5,
  "comment": "Muy fresca la fruta"
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `rating` | integer | Sí | 1–5 |
| `comment` | string | No | max 1000; blank → `null` |

#### Respuestas del Servidor:

* **201 Success:**

```json
{
  "data": {
    "id": "clx...",
    "orderId": "clx...",
    "providerId": "clx...",
    "rating": 5,
    "comment": "Muy fresca la fruta",
    "createdAt": "2026-08-14T18:00:00.000Z"
  }
}
```

* **400 Bad Request:** `rating` fuera de rango o `comment` inválido.

```json
{
  "error": "Validation failed",
  "details": [{ "field": "rating", "message": "Debe ser un entero entre 1 y 5" }]
}
```

* **401 Unauthorized:** Sin sesión.

* **403 Forbidden:** El pedido no pertenece al usuario, o `source=POS` / `clientId` null.

```json
{ "error": "No puedes reseñar este pedido" }
```

* **404 Not Found:** Pedido inexistente.

* **409 Conflict:** Pedido no `DELIVERED`, o ya existe reseña.

```json
{ "error": "Solo se puede reseñar un pedido entregado" }
```

```json
{ "error": "Este pedido ya tiene una reseña" }
```

En 409 por duplicado, Frontend puede `GET /api/orders/[id]/review` (Must: solo lectura).

* **500 Internal Error**

Must F4: **no hay PATCH**. Edición es Should futuro.

---

## GET `/api/orders/[id]/review`

> **Descripción:** Obtener la reseña del pedido (dueño CLIENT) o 404 si no existe.  
> **Autenticación:** Requerida — Rol `CLIENT`

* **200 Success:** mismo `data` que 201.
* **401 / 403 / 404**

ADMIN puede usar el mismo path o `GET /api/providers/[id]/reviews`.

---

## GET `/api/providers/[id]/reviews`

> **Descripción:** Listar reseñas públicas del negocio (para `/fruteria/[id]`).  
> **Autenticación:** Pública

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | number | `1` | 1-indexed |
| `limit` | number | `10` | Max 50 |

#### Respuestas:

* **200 Success:**

```json
{
  "data": [
    {
      "id": "clx...",
      "rating": 5,
      "comment": "Muy fresca la fruta",
      "authorName": "María G.",
      "createdAt": "2026-08-14T18:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2,
    "rating": 4.5,
    "reviewCount": 12
  }
}
```

`authorName`: primer nombre + inicial del apellido (no email). Orden: `createdAt DESC`.

Provider inactivo → 404 (igual que detalle F1).

* **400:** `page`/`limit` inválidos.

---

## DELETE `/api/admin/reviews/[id]`

> **Descripción:** Moderación. Recalcula agregado del proveedor.  
> **Autenticación:** Requerida — Rol `ADMIN`

* **200:** `{ "data": { "id": "...", "deleted": true } }`
* **404:** reseña inexistente
* **401 / 403**

AUDIT `DELETE`, `module=PROVIDERS` (o `ORDERS` si se añade módulo; F4 usa `PROVIDERS`), `entityId=review.id`.

---

## Efecto en explorar / detalle

`GET /api/providers` y `GET /api/providers/[id]` ya exponen `rating` y `reviewCount`. Tras F4 son valores reales. Si `reviewCount=0`, UI muestra "Sin reseñas todavía".

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Routes | `src/app/api/orders/[id]/reviews/route.ts`, `.../review/route.ts`, `src/app/api/providers/[id]/reviews/route.ts`, `src/app/api/admin/reviews/[id]/route.ts` |
| Service | `src/lib/services/review.service.ts` — `createReview`, `recomputeProviderRating` |

Thin handler → Zod → transacción Prisma.

---

## Referencias

- Schema: [`../data-model/DB-reviews.md`](../data-model/DB-reviews.md)
- Settings Google: [`API-PROVIDER-SETTINGS-01.md`](./API-PROVIDER-SETTINGS-01.md)
- Diagrama: [`../diagrams/ARCH-REVIEWS-01.md`](../diagrams/ARCH-REVIEWS-01.md)
