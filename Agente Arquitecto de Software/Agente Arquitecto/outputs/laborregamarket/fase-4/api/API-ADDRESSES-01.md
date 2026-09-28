# API-ADDRESSES-01 — Direcciones del cliente

> **Endpoint:** `/api/users/me/addresses`  
> **Módulo:** `GEO`, `USERS`  
> **Versión:** 0.4.0  
> **Fecha:** 14/08/2026  
> **US:** US-GEO-03  
> **Autenticación:** Requerida — Rol `CLIENT` → cookie JWT

Envelope ADR-003. Schema: [`../data-model/DB-addresses.md`](../data-model/DB-addresses.md).

Invitado: **401** (UX preserva pin en sessionStorage y redirige `/login?redirect=/explorar`).

---

## GET `/api/users/me/addresses`

> **Descripción:** Listar direcciones del cliente autenticado (selector de favoritas en `/explorar`).  
> **Autenticación:** Requerida — Rol `CLIENT`

Orden: `isDefault DESC`, `isFavorite DESC`, `createdAt DESC`.

#### 200 Success:

```json
{
  "data": [
    {
      "id": "clx...",
      "label": "Casa",
      "formattedAddress": "Av. Juárez 123, Centro, Monterrey",
      "lat": 25.6714,
      "lng": -100.3089,
      "isFavorite": true,
      "isDefault": true,
      "createdAt": "2026-08-14T18:00:00.000Z"
    }
  ]
}
```

Lista vacía: `{ "data": [] }` (empty state UX).

* **401 / 403** (rol ≠ CLIENT)

---

## POST `/api/users/me/addresses`

> **Descripción:** Guardar pin o ubicación actual como dirección.

#### Body de Solicitud (Request Payload):

```json
{
  "label": "Casa",
  "formattedAddress": "Av. Juárez 123, Centro, Monterrey",
  "lat": 25.6714,
  "lng": -100.3089,
  "isFavorite": true,
  "isDefault": true
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `label` | string | Sí | 1–40 |
| `formattedAddress` | string | Sí | 3–255 |
| `lat` / `lng` | number | Sí | Bounding box Monterrey |
| `isFavorite` | boolean | No | default `true` |
| `isDefault` | boolean | No | default `false`; si `true`, desmarcar las demás |

#### Respuestas:

* **201 Success:** `{ "data": { ...address } }`

* **400:** validación / bounding box / máximo 20 direcciones.

```json
{
  "error": "Validation failed",
  "details": [{ "field": "lat", "message": "Ubicación fuera del área de Monterrey" }]
}
```

```json
{ "error": "Límite de 20 direcciones alcanzado" }
```

* **401 / 403**

---

## PATCH `/api/users/me/addresses/[id]`

> **Descripción:** Actualizar etiqueta, pin, flags. Ownership obligatorio.

Body: mismos campos, todos opcionales. `isDefault: true` desmarca el resto.

* **200:** `{ "data": { ...address } }`
* **400 / 401 / 403 / 404**

---

## DELETE `/api/users/me/addresses/[id]`

> **Descripción:** Eliminar. Pedidos Should conservan `deliveryAddressSnapshot`.

* **200:** `{ "data": { "id": "clx...", "deleted": true } }`
* **404:** no existe o no es del usuario (no revelar cross-user: mismo 404)
* **401 / 403**

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Routes | `src/app/api/users/me/addresses/route.ts`, `.../addresses/[id]/route.ts` |
| Service | `src/lib/services/address.service.ts` |

Transacción al setear default. Guard `requireRole(CLIENT)`.

---

## Referencias

- GEO listado: [`API-GEO-01.md`](./API-GEO-01.md)
- Delivery Should: [`API-ORDERS-01.md`](./API-ORDERS-01.md)
