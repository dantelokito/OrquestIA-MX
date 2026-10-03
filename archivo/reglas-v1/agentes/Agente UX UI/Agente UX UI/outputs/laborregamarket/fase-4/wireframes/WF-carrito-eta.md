> **Pantalla:** Carrito (`/carrito`) — ETA + delivery Should
> **Objetivo Principal:** Confirmar pedido viendo tiempo estimado y, si aplica, eligiendo entrega
> **Base:** Extiende [`../../fase-3/wireframes/WF-carrito.md`](../../fase-3/wireframes/WF-carrito.md) — auth gate, líneas y Confirmar **sin cambio**

```text
+-----------------------------------------------------------------------+
| [Header CLIENT]                              [🛒 3]                   |
+-----------------------------------------------------------------------+
|  Tu pedido · Frutas El Paraíso                                        |
|  … TicketLine F3 (sin cambio) …                                       |
|  Notas (opcional)                                                     |
+-----------------------------------------------------------------------+
|  Entrega   ← oculto si offersDelivery=false                           |
|  ( Recoger en tienda )  ( A domicilio )   FulfillmentToggle           |
|  Si delivery: [ Casa ▾ ] FavoriteAddressSelect                        |
+-----------------------------------------------------------------------+
|  Resumen                                                              |
|  Subtotal                                              $176.00        |
|  [⏱] Listo aprox. en ~35 min          EtaChip                         |
|      Estimación, no una hora exacta                                   |
|  Recoger en tienda · Pago al recoger (MVP)                            |
+-----------------------------------------------------------------------+
| [ Confirmar pedido ] PRIMARY                                          |
| [ Seguir comprando ]                                                  |
+-----------------------------------------------------------------------+
```

### Pickup sin ubicación

```text
|  [⏱] Tiempo de preparación: ~25 min                                   |
|      (sin traslado — vas a recoger)                                   |
```

### Delivery sin favoritas

```text
|  A domicilio                                                          |
|  Aún no tienes direcciones guardadas.                                 |
|  [ Guardar una en Explorar → ]  /explorar                             |
|  Confirmar disabled mientras A domicilio esté activo sin dirección    |
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading carrito** | Skeleton F3 + skeleton línea ETA |
| **Empty** | F3 "Tu carrito está vacío" |
| **Auth gate** | F3 intacto; ETA se muestra al autenticar |
| **ETA loading** | Chip skeleton; Confirmar **no** bloqueado |
| **ETA error** | Hint "No pudimos estimar el tiempo"; Confirmar ok |
| **Sin prep time** | "El tiempo lo confirma la frutería" |
| **Success / error / ítem N/A** | Igual F3 |

#### Componentes Requeridos para Frontend:
* **EtaChip:** icono `Clock` + copy canónico; `text-secondary` microcopy.
* **FulfillmentToggle:** radio group; el CTA de página sigue siendo **Confirmar pedido**.
* **FavoriteAddressSelect:** reutilizado de explorar.

#### Responsividad:
* **Mobile:** Sticky Confirmar F3; toggle `w-full`; chip encima del CTA.
* **Desktop:** `max-w-2xl` centrado.

#### API esperada:
* `POST /api/orders` — F3 + `fulfillmentType`, `deliveryAddressId?`
* `GET /api/orders/eta?providerId=&lat=&lng=&fulfillmentType=`
* `GET /api/users/me/addresses`

#### Referencias:
* Flujos: `UF-NOTIFY-01-eta.md`, `UF-ORDERS-02-checkout-delivery.md`, `UF-ORDERS-01-checkout.md`
