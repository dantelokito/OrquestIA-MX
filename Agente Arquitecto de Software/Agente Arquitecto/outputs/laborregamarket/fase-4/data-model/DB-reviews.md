# DB-reviews — Entidad Review

> **Entidad:** `reviews` (Prisma model `Review`)  
> **Módulo:** `REVIEWS`  
> **Fecha:** 14/08/2026  
> **Versión:** 0.4.0  
> **ADR:** [ADR-018](../../comun/adrs/ADR-018-google-reviews.md)

---

## Esquema

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador de la reseña |
| `order_id` | `String` | UNIQUE, FK → `orders.id`, NOT NULL | Pedido reseñado (una reseña por pedido) |
| `client_id` | `String` | FK → `users.id`, NOT NULL | Autor (CLIENT dueño del pedido) |
| `provider_id` | `String` | FK → `providers.id`, NOT NULL | Negocio calificado (denormalizado para listados) |
| `rating` | `Int` | NOT NULL | Entero 1–5 |
| `comment` | `String` | NULLABLE, max 1000 | Texto libre opcional |
| `created_at` | `DateTime` | NOT NULL, DEFAULT now | Fecha de publicación |
| `updated_at` | `DateTime` | NOT NULL, auto-update | Última modificación (moderación ADMIN) |

---

## Prisma (migración sugerida)

```prisma
model Review {
  id         String   @id @default(cuid())
  orderId    String   @unique @map("order_id")
  clientId   String   @map("client_id")
  providerId String   @map("provider_id")
  rating     Int
  comment    String?
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  order    Order    @relation(fields: [orderId], references: [id], onDelete: Restrict)
  client   User     @relation("ClientReviews", fields: [clientId], references: [id], onDelete: Restrict)
  provider Provider @relation(fields: [providerId], references: [id], onDelete: Restrict)

  @@index([providerId, createdAt])
  @@map("reviews")
}
```

Nombre migración: `add_reviews_and_provider_google_fields`

---

## Relaciones

| Relación | Entidad | Cardinalidad | On Delete |
|----------|---------|--------------|-----------|
| `order` | `Order` | 1:1 | Restrict (no borrar pedido con reseña) |
| `client` | `User` | N:1 | Restrict |
| `provider` | `Provider` | N:1 | Restrict |

Añadir en `User`: `reviews Review[] @relation("ClientReviews")`.  
Añadir en `Provider` y `Order`: `reviews Review[]` / `review Review?`.

---

## Reglas de dominio

1. **Una reseña por pedido:** UNIQUE `order_id`. Segundo POST → 409.
2. **Elegibilidad:** `Order.status = DELIVERED` AND `Order.source = MARKETPLACE` AND `Order.clientId = session.userId`.
3. **POS walk-in:** `clientId` null → no hay CTA ni endpoint válido (404/403).
4. **Must F4:** sin PATCH de cliente. Solo lectura tras crear.
5. **DELETE:** solo ADMIN (moderación). Recalcular agregado en la misma transacción.
6. **Agregado atómico (US-REV-02):**

```
BEGIN
  INSERT/DELETE Review
  UPDATE providers
    SET rating = COALESCE((SELECT AVG(rating)::float FROM reviews WHERE provider_id = $p), 0),
        review_count = (SELECT COUNT(*) FROM reviews WHERE provider_id = $p)
  WHERE id = $p
COMMIT
```

7. **`rating` en Provider:** promedio aritmético de enteros (float). `reviewCount = 0` ⇒ `rating = 0` (UI: "Sin reseñas todavía", no estrellas vacías engañosas).
8. **Google embed** no entra en el promedio nativo (ADR-018).
9. **Sin fotos** en F4 (Could).

---

## Validaciones (Zod)

| Campo | Regla |
|-------|-------|
| `rating` | integer 1–5 |
| `comment` | opcional; trim; max 1000; vacío → `null` |

---

## Índices

| Índice | Justificación |
|--------|----------------|
| UNIQUE `order_id` | US-REV-01 duplicado |
| `(provider_id, created_at)` | `GET /api/providers/[id]/reviews` paginado |

---

## Referencias

- API: [`../api/API-REVIEWS-01.md`](../api/API-REVIEWS-01.md)
- Provider delta: [`DB-providers.md`](./DB-providers.md)
- ADR-018: [`../../comun/adrs/ADR-018-google-reviews.md`](../../comun/adrs/ADR-018-google-reviews.md)
