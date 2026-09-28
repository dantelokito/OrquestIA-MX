# DB-addresses — Entidad UserAddress

> **Entidad:** `user_addresses` (Prisma model `UserAddress`)  
> **Módulo:** `GEO`  
> **Fecha:** 14/08/2026  
> **Versión:** 0.4.0  
> **US:** US-GEO-03, US-ORDERS-05 (Should)

---

## Esquema

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador |
| `user_id` | `String` | FK → `users.id`, NOT NULL | Dueño (CLIENT) |
| `label` | `String` | NOT NULL, max 40 | Etiqueta ("Casa", "Trabajo") |
| `formatted_address` | `String` | NOT NULL, max 255 | Texto mostrable (reverse geocode o capturado) |
| `lat` | `Float` | NOT NULL | Latitud del pin |
| `lng` | `Float` | NOT NULL | Longitud del pin |
| `is_favorite` | `Boolean` | NOT NULL, DEFAULT `true` | Visible en selector de `/explorar` |
| `is_default` | `Boolean` | NOT NULL, DEFAULT `false` | Máximo uno `true` por `user_id` |
| `created_at` | `DateTime` | NOT NULL, DEFAULT now | Alta |
| `updated_at` | `DateTime` | NOT NULL, auto-update | Última edición |

---

## Prisma (migración sugerida)

```prisma
model UserAddress {
  id                String   @id @default(cuid())
  userId            String   @map("user_id")
  label             String
  formattedAddress  String   @map("formatted_address")
  lat               Float
  lng               Float
  isFavorite        Boolean  @default(true) @map("is_favorite")
  isDefault         Boolean  @default(false) @map("is_default")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders Order[] @relation("DeliveryAddress")

  @@index([userId])
  @@map("user_addresses")
}
```

Añadir en `User`: `addresses UserAddress[]`.

**Unicidad de default:** no hay UNIQUE parcial fácil en Prisma para `is_default=true`. Enforce en servicio: al marcar `isDefault=true`, `updateMany` el resto a `false` en la misma transacción.

---

## Relaciones

| Relación | Entidad | Cardinalidad | On Delete |
|----------|---------|--------------|-----------|
| `user` | `User` | N:1 | Cascade |
| `orders` | `Order` | 1:N (Should) | SetNull en `Order.deliveryAddressId` |

El pedido **no** depende de la dirección viva: `deliveryAddressSnapshot` (JSON) congela label/coords al checkout (ver [`DB-orders.md`](./DB-orders.md)).

---

## Reglas de dominio

1. Solo rol **CLIENT**. PROVIDER/ADMIN → 403.
2. Máximo **20** direcciones por usuario (400 al exceder).
3. Máximo **una** `isDefault=true` por usuario.
4. Varias pueden ser `isFavorite=true` (selector rápido en `/explorar`).
5. Bounding box Monterrey (misma que Provider, capa Zod):

| Coordenada | Mínimo | Máximo |
|------------|--------|--------|
| `lat` | 25.4 | 25.9 |
| `lng` | -100.6 | -99.8 |

6. Invitado no persiste: API 401; UX guarda pin en sessionStorage hasta post-login (US-GEO-03 escenario 2).
7. `formattedAddress` puede ser el texto que el cliente confirme o un reverse geocode opcional en Frontend (Google Geocoder). Backend no llama Geocoding API en Must.

---

## Validaciones (Zod)

| Campo | Regla |
|-------|-------|
| `label` | required, trim, 1–40 |
| `formattedAddress` | required, 3–255 |
| `lat` / `lng` | required, bounding box |
| `isFavorite` | boolean, default true |
| `isDefault` | boolean, default false |

---

## Índices

| Índice | Justificación |
|--------|----------------|
| `(user_id)` | Listado `/api/users/me/addresses` |

---

## Referencias

- API: [`../api/API-ADDRESSES-01.md`](../api/API-ADDRESSES-01.md)
- GEO: [`../api/API-GEO-01.md`](../api/API-GEO-01.md)
- Orders Should: [`DB-orders.md`](./DB-orders.md)
