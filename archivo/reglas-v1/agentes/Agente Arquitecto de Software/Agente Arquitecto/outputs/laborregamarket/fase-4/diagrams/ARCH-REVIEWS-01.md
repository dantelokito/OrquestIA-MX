# ARCH-REVIEWS-01 — Reseñas nativas y vitrina Google

> **Componente / Flujo:** Review post-DELIVERED + agregado Provider + gate isVerified  
> **Fecha:** 14/08/2026  
> **Fase:** 4 — v0.4.0

---

## Alta de reseña

```mermaid
sequenceDiagram
  participant UI as PedidoEntregado
  participant API as POST_orders_id_reviews
  participant DB as PostgreSQL

  UI->>API: rating comment
  API->>DB: load Order
  alt No DELIVERED o no dueño o POS
    API-->>UI: 403 o 409
  else Ya existe Review
    API-->>UI: 409
  else OK
    API->>DB: tx insert Review plus recompute AVG COUNT
    API-->>UI: 201
  end
```

---

## Gate Google (escritura)

```mermaid
flowchart TD
  PATCH[PATCH_provider_me_google] --> Verified{isVerified}
  Verified -->|false| F403[403_Requiere_verificacion]
  Verified -->|true| Zod[Validar_PlaceId_o_URL]
  Zod --> Save[Persistir_campos]
  AdminOff[ADMIN_isVerified_false] --> Off[googleReviewsEnabled_false]
```

---

## Lectura pública `/fruteria/[id]`

```mermaid
flowchart LR
  Page[FruteriaDetalle] --> Native[GET_providers_id_reviews]
  Page --> Detail[GET_providers_id]
  Detail --> Gate{verified_and_enabled_and_id}
  Gate -->|si| Embed[Enlace_o_iframe_Google]
  Gate -->|no| Hide[Sin_bloque_Google]
```

El promedio nativo **no** incluye reseñas de Google (solo tabla `Review`).

---

## Referencias

- [`../api/API-REVIEWS-01.md`](../api/API-REVIEWS-01.md)
- [`../api/API-PROVIDER-SETTINGS-01.md`](../api/API-PROVIDER-SETTINGS-01.md)
- [`../../comun/adrs/ADR-018-google-reviews.md`](../../comun/adrs/ADR-018-google-reviews.md)
