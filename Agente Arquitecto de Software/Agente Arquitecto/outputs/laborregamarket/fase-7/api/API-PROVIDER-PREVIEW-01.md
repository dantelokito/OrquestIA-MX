# API-PROVIDER-PREVIEW-01 — Detalle / preview Explorar (Fase 7)

> **Endpoint:** `GET` `/api/providers/[id]` (extensión)  
> **Módulo:** `EXPLORE`, `PROVIDERS`  
> **Versión:** 0.7.1  
> **Fecha:** 18/08/2026  
> **US:** US-EXPLORE-05  
> **Base:** [`../../fase-1/api/API-PROVIDERS-01.md`](../../fase-1/api/API-PROVIDERS-01.md), F4 detalle, F5 CAT  
> **Autenticación:** Pública  
> **Sin** Google Maps JS. Sin modelo de pagos.

Envelope ADR-003. Schema: [`../data-model/DB-providers.md`](../data-model/DB-providers.md). Escritura dueño: [`API-PROVIDER-SETTINGS-01.md`](./API-PROVIDER-SETTINGS-01.md).

---

## GET `/api/providers/[id]`

> **Descripción:** Vitrina pública de la frutería (preview y página detalle).  
> **Autenticación:** Pública

Provider inactivo o inexistente → **404**.

`products[]`: solo vendibles (`isAvailable` + `Product.isActive`). Orden F1.

`isOpenNow` se calcula **en servidor** con TZ `America/Monterrey`. Si `hoursPublished=false` (horario vacío/null): `isOpenNow` = `null` (UI: “horario no publicado”, no crash).

WhatsApp: afirmar **solo** si `whatsappEnabled === true` **y** hay `phone` E.164. Si `whatsappEnabled` es false o null → no mostrar icono WA.

Copy verificación: si `isVerified` y `verifiedAt` → “verificado a la borrega desde MM/AAAA” (mes/año de `verifiedAt`). Si verificado sin fecha (datos viejos): copy genérico sin mes; BE backfill `verifiedAt = updatedAt` o `now()` al verificar ADMIN.

`reviewsPreview`: últimas **3** reseñas (`createdAt DESC`), mismo shape público que F4 (`authorName`, no email). CTA FE → ancla `#resenas` (listado completo sigue `GET /api/providers/[id]/reviews`).

#### 200 `data` (campos extra F7; se suman a F1/F4):

```json
{
  "id": "clx...",
  "businessName": "Frutas El Paraíso",
  "phone": "+528112345678",
  "offersDelivery": true,
  "whatsappEnabled": true,
  "acceptsCardAtStore": false,
  "offersWholesale": true,
  "offersRetail": true,
  "isVerified": true,
  "verifiedAt": "2026-03-12T00:00:00.000Z",
  "hoursPublished": true,
  "isOpenNow": true,
  "openingHours": [
    { "day": 1, "open": "08:00", "close": "18:00", "closed": false },
    { "day": 0, "open": null, "close": null, "closed": true }
  ],
  "reviewsPreview": [
    {
      "id": "clx...",
      "rating": 5,
      "comment": "Muy fresca",
      "authorName": "María G.",
      "createdAt": "2026-08-14T18:00:00.000Z"
    }
  ],
  "products": []
}
```

`day`: 0 = domingo … 6 = sábado (ISO-like JS `getDay`). `open`/`close`: `HH:mm` 24h. Día cerrado: `closed: true`.

`offersRetail` default **true**. Mayoreo y menudeo son flags independientes (pueden ser ambos true).

**No** exponer `primaryColor` / `secondaryColor` al público (F5).

---

## Referencias

- Diagrama: [`../diagrams/ARCH-PREVIEW-01.md`](../diagrams/ARCH-PREVIEW-01.md)
- Reviews list: [`../../fase-4/api/API-REVIEWS-01.md`](../../fase-4/api/API-REVIEWS-01.md)
