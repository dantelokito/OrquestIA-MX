# ARCH-PREVIEW-02 — Hover / long-press (Fase 8)

> **Componente / Flujo:** `/explorar` preview anclado; mismo `GET /api/providers/[id]`  
> **Fecha:** 24/08/2026  
> **Fase:** 8 — v0.8.3

El payload de vitrina no cambia (ARCH-PREVIEW-01). Solo cambia el disparador y el control de requests.

---

## Disparo (sin botón)

```mermaid
flowchart TD
  Card[ProviderCard]
  Card -->|hover 300ms| Open[Preview_anclado]
  Card -->|longpress 500ms| Open
  Card -->|tap_corto| Nav[fruteria_id]
  Marker[Marker_mapa] --> Open
  Open -->|Escape_o_leave| Close[Cerrar]
  Scroll[Scroll_touch] --> Cancel[No_abrir]
```

---

## Un GET, cache de sesión

```mermaid
sequenceDiagram
  participant UI as Card_o_marker
  participant Cache as Session_map
  participant API as GET_providers_id

  UI->>Cache: lookup id
  alt hit
    Cache-->>UI: payload F7
  else miss
    UI->>UI: abort GET previo si otro id
    UI->>API: GET id
    API-->>UI: 200 vitrina
    UI->>Cache: store id
  end
```

Cruzar el grid **no** dispara N requests. Máximo un preview abierto.

---

## Referencias

- [`../api/API-PROVIDER-PREVIEW-01.md`](../api/API-PROVIDER-PREVIEW-01.md)
- Shape F7: [`../../fase-7/api/API-PROVIDER-PREVIEW-01.md`](../../fase-7/api/API-PROVIDER-PREVIEW-01.md)
