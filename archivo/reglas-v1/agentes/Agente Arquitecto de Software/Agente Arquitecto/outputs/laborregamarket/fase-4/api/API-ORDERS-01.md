# API-ORDERS-01 — Delta Fase 4 (Should delivery + ETA)

> **Endpoint:** `POST` `/api/orders` (extensión)  
> **Módulo:** `ORDERS`  
> **Versión:** 0.4.0  
> **Fecha:** 14/08/2026  
> **US:** US-ORDERS-05 (Should), US-NOTIFY-09  
> **Base F3:** [`../../fase-3/api/API-ORDERS-01.md`](../../fase-3/api/API-ORDERS-01.md)  
> **Autenticación:** Requerida — Rol `CLIENT`

Must F4 **no** obliga a implementar delivery. El schema y este contrato se diseñan para no bloquear el Should. Pickup F3 sigue siendo el default: body sin los campos nuevos = comportamiento actual.

Email de nuevo pedido deja de usar `after()` y pasa a Inngest ([ADR-015](../../comun/adrs/ADR-015-notification-queue.md)).

---

## POST `/api/orders` — campos extra (Should)

> **Descripción:** Crear pedido marketplace. Opcionalmente entrega a domicilio y snapshot de ETA.  
> **Autenticación:** Requerida — Rol `CLIENT`  
> Header `Idempotency-Key` UUID (F3, sin cambio).

#### Body de Solicitud (delta):

```json
{
  "providerId": "clx...",
  "items": [{ "productId": "clx...", "quantity": 1.5, "unit": "KG" }],
  "notes": "Sin bolsa",
  "fulfillmentType": "DELIVERY",
  "deliveryAddressId": "clx...",
  "clientLat": 25.67,
  "clientLng": -100.31
}
```

| Campo | Tipo | Default | Prioridad | Validación |
|-------|------|---------|-----------|------------|
| (campos F3) | — | — | Must | Sin cambio |
| `fulfillmentType` | enum | `PICKUP` | Should | `PICKUP` \| `DELIVERY` |
| `deliveryAddressId` | string | — | Should | Requerido si `DELIVERY`; ownership CLIENT |
| `clientLat` / `clientLng` | number | — | Should | Opcionales; para ETA pickup con pin de explorar |

#### Reglas Should

1. `DELIVERY` + `offersDelivery=false` → **400**.
2. `DELIVERY` sin `deliveryAddressId` → **400**.
3. Dirección no del usuario → **404**.
4. `PICKUP`: ignorar `deliveryAddressId` (persistir null / snapshot null).
5. Persistir `deliveryAddressSnapshot` y `etaMinutes` (ADR-017) al crear.
6. ETA pickup: si hay `clientLat`/`clientLng` o dirección, sumar traslado; si no, solo `preparationTimeMinutes`.

#### 201 / 200 replay — `data` extra:

```json
{
  "data": {
    "id": "clx...",
    "status": "PENDING",
    "source": "MARKETPLACE",
    "fulfillmentType": "DELIVERY",
    "etaMinutes": 35,
    "deliveryAddressSnapshot": {
      "label": "Casa",
      "formattedAddress": "Av. …",
      "lat": 25.67,
      "lng": -100.31
    }
  }
}
```

Pedidos F3 sin migrar: `fulfillmentType=PICKUP`, `etaMinutes=null` hasta backfill opcional.

#### 400 ejemplo:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "fulfillmentType", "message": "Este negocio no ofrece entrega a domicilio" }
  ]
}
```

GET detalle `/api/orders/[id]`: incluir los mismos campos extra cuando existan.

Copy `IN_TRANSIT`: FE usa `fulfillmentType` (delivery = "En camino", pickup = "Listo para recoger"). El enum de status **no cambia**.

---

## Notificación (Must infra, Should copy ETA)

Tras persistir: `inngest.send({ name: "notify/order.created", data: { orderId } })`. Template email puede incluir `etaMinutes` (Should US-NOTIFY-09). Fallo → AUDIT `notificationFailed` (ADR-015). HTTP no espera a Resend.

---

## Fuera de alcance

- Pagos, CFDI, rutas, tracking live, Distance Matrix.

---

## Referencias

- Schema: [`../data-model/DB-orders.md`](../data-model/DB-orders.md)
- ETA: [`API-GEO-01.md`](./API-GEO-01.md) `GET .../eta`
- Addresses: [`API-ADDRESSES-01.md`](./API-ADDRESSES-01.md)
- ADR-017: [`../../comun/adrs/ADR-017-eta-formula.md`](../../comun/adrs/ADR-017-eta-formula.md)
