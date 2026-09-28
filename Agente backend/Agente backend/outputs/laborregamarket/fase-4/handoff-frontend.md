# Handoff Frontend — LaBorregaMarket Backend v0.4.0

> **De:** Backend Developer  
> **Para:** @Frontend Developer  
> **Fecha:** 14/08/2026

---

## Estado: LISTO PARA INTEGRAR — Must + Should F4

Base URL local: `http://localhost:8080`  
Envelope: `{ data }` / `{ data, meta }` / `{ error, details? }` (ADR-003). POS sales F3 **sin cambios**.

Should delivery checkout, WhatsApp Cloud API y ETA en mensajes **están implementados**. Body sin campos nuevos = pickup F3. `wa.me` F2 sigue como CTA manual.

---

## Mapa pantalla → endpoint (delta F4)

| Tema | Endpoint(s) | Notas |
|------|-------------|-------|
| Explorar radio | `GET /api/providers?lat&lng&radiusKm&city&q&category&verified&page&limit` | XOR lat/lng → 400. Radio default 10, rango 1–25. Bbox Monterrey. Con geo: `distanceKm` + `meta.radiusKm`, orden cercanía. Sin geo: F2 (`rating DESC`, sin `distanceKm`) |
| Detalle | `GET /api/providers/[id]` | + `preparationTimeMinutes`, `offersDelivery`, `googleReviews` (`enabled` false si no pasa gate ADR-018) |
| ETA | `GET /api/providers/[id]/eta?lat&lng&fulfillmentType` | Público. `copyKey`: `eta_prep_only` \| `eta_ready_approx`. No persiste |
| Favoritas | `GET/POST /api/users/me/addresses`, `PATCH/DELETE .../addresses/[id]` | CLIENT. 401 → login `redirect=/explorar`. Máx 20. DELETE cruzado = 404 |
| Reseña pedido | `POST /api/orders/[id]/reviews` | CLIENT dueño, `DELIVERED` + MARKETPLACE. 201. Sin PATCH. POS → 403 |
| Leer reseña | `GET /api/orders/[id]/review` | CLIENT dueño o ADMIN. 404 si no hay |
| Listado público | `GET /api/providers/[id]/reviews?page&limit` | `authorName` (no email). `meta.rating` / `reviewCount`. `reviewCount=0` → "Sin reseñas todavía" |
| Moderación | `DELETE /api/admin/reviews/[id]` | ADMIN |
| Settings | `GET/PATCH /api/provider/me` | PATCH Google si `isVerified=false` → **403** `"Requiere verificación de tu negocio"`. UI: `googleReviewsLocked`. No depender de la UI para seguridad |
| Analytics | `GET /api/admin/analytics?range=today\|7d\|30d` | ADMIN. Distinto de `/api/provider/dashboard`. `empty: true` + `kpis: null` (no ceros fingidos) |
| Contacto / pedido | HTTP **igual** F2/F3 | Email Inngest; 429 igual; 503 si Redis cae en prod |
| Checkout delivery | `POST /api/orders` campos extra | `fulfillmentType` `PICKUP`\|`DELIVERY` (default pickup). `DELIVERY` exige `deliveryAddressId` y `offersDelivery`. Respuesta: `etaMinutes`, `deliveryAddressSnapshot`. `IN_TRANSIT` + DELIVERY → copy FE "En camino" |
| Opt-in WA | `GET/PATCH /api/users/me` | `whatsappOptIn` boolean. Sin opt-in el job al cliente no-op |

---

## Ejemplos

### Geo listado

```http
GET /api/providers?lat=25.6714&lng=-100.3089&radiusKm=10
```

Item extra: `"distanceKm": 2.4`. Meta extra: `"radiusKm": 10`.

400 radio:

```json
{
  "error": "Validation failed",
  "details": [{ "field": "radiusKm", "message": "Debe estar entre 1 y 25" }]
}
```

### Crear reseña

```http
POST /api/orders/{id}/reviews
{ "rating": 5, "comment": "Muy fresca la fruta" }
```

201 `{ "data": { "id", "orderId", "providerId", "rating", "comment", "createdAt" } }`  
409 duplicado: `"Este pedido ya tiene una reseña"` — entonces `GET /api/orders/{id}/review`.

### Google embed (detalle)

Solo si `googleReviews.enabled === true`. Si `reviewCount === 0` no uses estrellas vacías engañosas.

### PATCH settings

```http
PATCH /api/provider/me
{ "preparationTimeMinutes": 25, "googlePlaceId": "ChIJ...", "googleReviewsEnabled": true }
```

403 si el negocio no está verificado y el body toca campos Google.

### Analytics vacío

```json
{
  "data": {
    "empty": true,
    "range": "7d",
    "timezone": "America/Monterrey",
    "from": "...",
    "to": "...",
    "kpis": null
  }
}
```

### Pedido delivery (Should)

```http
POST /api/orders
Idempotency-Key: <uuid>
{ "providerId": "...", "items": [...], "fulfillmentType": "DELIVERY", "deliveryAddressId": "..." }
```

201 extra: `"fulfillmentType": "DELIVERY"`, `"etaMinutes": 35`, `"deliveryAddressSnapshot": { "label", "formattedAddress", "lat", "lng" }`.

400 si el negocio no ofrece delivery: `details[0].field = fulfillmentType`.

---

## Errores HTTP usados F4

400 validación · 401 · 403 (rol, ownership, Google lock, POS reseña) · 404 · 409 (reseña) · 429 contacto · 503 Redis prod · 500

Maps JS (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) y báscula ADR-019 son **Frontend**. Quitar Leaflet en `/explorar`.
