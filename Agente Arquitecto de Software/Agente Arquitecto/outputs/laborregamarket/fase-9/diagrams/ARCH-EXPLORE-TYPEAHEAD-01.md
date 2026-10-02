# ARCH-EXPLORE-TYPEAHEAD-01 — Typeahead header (Fase 9)

> **Componente / Flujo:** `/explorar` header typeahead; mismo `GET /api/providers`  
> **Fecha:** 25/08/2026  
> **Fase:** 9 — v0.9.0  
> **US:** US-EXPLORE-09

Sin endpoint `/suggest`. Corpus = predicado Haversine + `q` en servidor (no página FE).

---

## Flujo UI

```mermaid
flowchart TD
  Input[Header_input_q]
  Input -->|chars_lt_2| Idle[Sin_sugerencias]
  Input -->|debounce_ge_2| Gate{Pin_y_radio_validos}
  Gate -->|no| Empty[No_inventar]
  Gate -->|si| Fetch["GET_providers_q_geo_limit_10"]
  Fetch --> Rows[Filas_fruteria_portada_nombre]
  Rows -->|select| Apply[URL_q_y_refetch_lista]
  Rows -->|tacha| Clear[Quitar_q_y_chips]
  Clear --> GeoOnly[Listado_geo_sin_q]
```

---

## Sequence: debounce + corpus radio

```mermaid
sequenceDiagram
  participant H as Header
  participant L as Listing_state
  participant API as GET_providers

  Note over H,L: Prohibido filtrar L.providers de la pagina actual
  H->>H: debounce tipear
  H->>API: q lat lng radiusKm limit=10 page=1
  API-->>H: data fruterias en radio
  H->>H: map id businessName coverUrl logoUrl
  H->>L: on select set URL q plus chips
  L->>API: refetch lista limit=20
```

---

## Chips AND (US-EXPLORE-11)

```mermaid
flowchart LR
  Geo[lat_lng_radiusKm] --> Where[buildWhere]
  Q[q] --> Where
  Ver[verified] --> Where
  Cat[category] --> Where
  Wh[offersWholesale] --> Where
  Del[offersDelivery] --> Where
  Where --> List[GET_providers]
```

Orgánico y chip «Filtros» **retirados** (D-F9-2). Sin schema nuevo.

---

## Referencias

- Contrato: [`../api/API-GEO-01.md`](../api/API-GEO-01.md)
- Handoff: [`../handoff-backend-fase-9.md`](../handoff-backend-fase-9.md)
- Notas sin API: [`../api/API-EXPLORE-NOTES-01.md`](../api/API-EXPLORE-NOTES-01.md)
