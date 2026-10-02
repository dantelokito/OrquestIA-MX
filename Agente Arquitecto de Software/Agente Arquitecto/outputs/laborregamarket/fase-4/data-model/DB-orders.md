# DB-orders — Delta Fase 4 (Should + ETA snapshot)

> **Entidades:** `orders`, `order_items`  
> **Base F1/F3:** [`../../fase-1/data-model/DB-orders.md`](../../fase-1/data-model/DB-orders.md), [`../../fase-3/api/API-ORDERS-01.md`](../../fase-3/api/API-ORDERS-01.md)  
> **Fecha:** 14/08/2026  
> **Versión:** 0.4.0  
> **Prioridad:** campos nuevos son **Should** (US-ORDERS-05, US-NOTIFY-09) salvo `review` (Must, relación).  
> **No editar** fase-1; este archivo es el delta.

---

## Campos nuevos en `Order`

| Campo | Tipo de Dato | Restricción | Prioridad | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `fulfillment_type` | enum `FulfillmentType` | NOT NULL, DEFAULT `PICKUP` | Should | `PICKUP` \| `DELIVERY` |
| `delivery_address_id` | `String` | NULLABLE, FK → `user_addresses.id` | Should | Dirección viva (puede SetNull) |
| `delivery_address_snapshot` | `Json` | NULLABLE | Should | Copia inmutable al checkout |
| `eta_minutes` | `Int` | NULLABLE | Should | Snapshot ADR-017 al crear |

```prisma
enum FulfillmentType {
  PICKUP
  DELIVERY
}

model Order {
  // ... campos F3 ...
  fulfillmentType          FulfillmentType @default(PICKUP) @map("fulfillment_type")
  deliveryAddressId        String?         @map("delivery_address_id")
  deliveryAddressSnapshot  Json?           @map("delivery_address_snapshot")
  etaMinutes               Int?            @map("eta_minutes")

  deliveryAddress UserAddress? @relation("DeliveryAddress", fields: [deliveryAddressId], references: [id], onDelete: SetNull)
  review          Review?
}
```

`OrderItem` **no cambia** (Decimal 10,3 + `unitOfMeasure` F3).

---

## Snapshot de dirección (Should)

Al `POST /api/orders` con `fulfillmentType=DELIVERY`:

```json
{
  "label": "Casa",
  "formattedAddress": "Av. …",
  "lat": 25.67,
  "lng": -100.31
}
```

La UI de detalle usa el snapshot, no la fila `UserAddress` (el cliente puede editar/borrar después).

---

## Relación Review (Must)

`Order.review` 1:0..1. Restrict on delete Order si existe Review (no borrar historial calificado).

---

## Reglas Should (US-ORDERS-05)

1. Default `PICKUP` — pedidos F3 existentes migran a `PICKUP` sin cambio de comportamiento.
2. `DELIVERY` exige `Provider.offersDelivery=true` y `deliveryAddressId` del CLIENT dueño.
3. `PICKUP` ignora `deliveryAddressId` (persistir null).
4. `IN_TRANSIT` + `DELIVERY` → copy "En camino"; `IN_TRANSIT` + `PICKUP` → "Listo para recoger" (solo presentación; mismo enum F3).
5. Sin ruteo, flotilla ni tracking en vivo.
6. `etaMinutes` se calcula al crear con `computeEtaMinutes` (coords del snapshot o query; pickup sin coords = solo preparación).

---

## User (Should NOTIFY-08)

Campo opcional en la misma migración o posterior:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `whatsapp_opt_in` | `Boolean` | `false` | Consentimiento WA Business |

Sin opt-in o teléfono inválido: el job WA no-op; email sigue.

---

## Referencias

- API delta: [`../api/API-ORDERS-01.md`](../api/API-ORDERS-01.md)
- Addresses: [`DB-addresses.md`](./DB-addresses.md)
- ADR-017: [`../../comun/adrs/ADR-017-eta-formula.md`](../../comun/adrs/ADR-017-eta-formula.md)
