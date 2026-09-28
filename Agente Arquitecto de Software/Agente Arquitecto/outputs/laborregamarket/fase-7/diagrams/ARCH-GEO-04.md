# ARCH-GEO-04 — Radio slider + default San Nicolás (Fase 7)

> **Componente / Flujo:** `/explorar` — pan solo vista; Haversine desde slider; centro SN o favorita  
> **Fecha:** 18/08/2026  
> **Fase:** 7 — v0.7.1

Motor Leaflet/OSM (ARCH-GEO-02) no cambia. F6 ARCH-GEO-03 (pan→radio) queda **histórico**.

---

## Quién dispara GET

```mermaid
flowchart LR
  subgraph cambia [Cambian centro o radio]
    Slider[Slider_1_a_25]
    Addr[Buscar_direccion]
    Gps[Usar_mi_ubicacion]
    Fav[Favorita_servidor]
  end
  subgraph noCambia [No cambian radio]
    Pan[Pan_o_zoom]
  end
  Slider --> Fit[fitBounds_circulo]
  Addr --> Center[Nuevo_centro]
  Gps --> Center
  Fav --> Center
  Fit --> Api[GET_providers]
  Center --> Api
  Pan --> ViewOnly[Solo_vista]
```

---

## Primera carga

```mermaid
sequenceDiagram
  participant FE as ExplorarPage
  participant Auth as GET_session
  participant Addr as GET_addresses
  participant API as GET_providers

  FE->>Auth: cookie JWT
  alt CLIENT con direcciones
    FE->>Addr: requireRole CLIENT
    Addr-->>FE: lastUsedAt or isDefault
    FE->>API: lat lng radiusKm 10
  else invitado o lista vacia
    FE->>FE: DEFAULT_EXPLORE_CENTER SN
    FE->>API: 25.7475 minus100.2830 radiusKm 10
  end
  API-->>FE: data plus meta.total
```

---

## Empty (US-GEO-16)

```mermaid
flowchart TD
  Fetch[GET_providers]
  Fetch -->|inFlight| Loading[Loader_size_loading]
  Fetch -->|200 total 0| Empty[Loader_size_empty]
  Fetch -->|5xx or network| Error[ErrorBanner]
```

---

## Referencias

- [`../api/API-GEO-01.md`](../api/API-GEO-01.md)
- ADR-020 append F7, ADR-026, ADR-027
