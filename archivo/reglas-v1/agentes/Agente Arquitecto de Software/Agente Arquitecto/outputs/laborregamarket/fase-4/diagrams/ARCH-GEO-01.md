# ARCH-GEO-01 — Mapa, radio y direcciones

> **Componente / Flujo:** `/explorar` Google Maps + filtro Haversine + UserAddress  
> **Fecha:** 14/08/2026  
> **Fase:** 4 — v0.4.0

---

## Flujo explorar con radio

```mermaid
sequenceDiagram
  participant UI as ExplorarPage
  participant Maps as GoogleMapsJS
  participant API as GET_providers
  participant DB as PostgreSQL

  UI->>Maps: load map with API key
  UI->>UI: pin GPS or favorite address
  UI->>API: lat lng radiusKm plus F2 filters
  API->>DB: active providers Haversine
  API-->>UI: data plus distanceKm
  UI->>Maps: markers and radius circle
```

---

## Guardar dirección favorita

```mermaid
flowchart TD
  Pin[Pin_en_mapa] --> Auth{Sesion_CLIENT}
  Auth -->|No| Login[401_redirect_login]
  Login --> Pin
  Auth -->|Si| POST[POST_users_me_addresses]
  POST --> DB[(user_addresses)]
  DB --> Selector[Selector_favoritas]
```

---

## ETA preview

```mermaid
flowchart LR
  Client[Cliente] -->|GET_eta_lat_lng| API[providers_id_eta]
  API --> Formula[Haversine_plus_prep]
  Formula --> JSON[etaMinutes_copyKey]
```

Leaflet **no** forma parte de este flujo (ADR-016: reemplazo único).

---

## Referencias

- [`../api/API-GEO-01.md`](../api/API-GEO-01.md)
- [`../api/API-ADDRESSES-01.md`](../api/API-ADDRESSES-01.md)
- [`../../comun/adrs/ADR-016-maps-engine.md`](../../comun/adrs/ADR-016-maps-engine.md)
- [`../../comun/adrs/ADR-017-eta-formula.md`](../../comun/adrs/ADR-017-eta-formula.md)
