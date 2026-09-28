# ARCH-GEO-05 — Radio 0.5–10 km + mapa México (Fase 8)

> **Componente / Flujo:** `/explorar` — clamp decimal; pan solo vista dentro de MX; Haversine desde slider  
> **Fecha:** 24/08/2026  
> **Fase:** 8 — v0.8.3

Motor Leaflet/OSM (ARCH-GEO-02) no cambia. F7 ARCH-GEO-04 (slider 1–25, bbox AMM en API) queda **histórico**. `CO-F7-001` intacto.

---

## Quién dispara GET

```mermaid
flowchart LR
  subgraph cambia [Cambian centro o radio]
    Slider[Slider_0_5_a_10]
    Addr[Buscar_direccion]
    Gps[Usar_mi_ubicacion]
    Fav[Favorita_servidor]
  end
  subgraph noCambia [No cambian radio]
    Pan[Pan_o_zoom_dentro_MX]
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

## Clamp y México

```mermaid
flowchart TD
  Raw[radiusKm_query]
  Raw -->|lt 0.5| Min[0.5]
  Raw -->|gt 10| Max[10]
  Raw -->|0.5 a 10 decimal| Keep[valor]
  Min --> Meta[meta_radiusKm]
  Max --> Meta
  Keep --> Meta
  Pin[lat_lng]
  Pin -->|isInMexico| Hav[Haversine]
  Pin -->|fuera MX FE| Sn[SN_o_ultimo_pin]
  Pin -->|fuera MX BE Should| Err400[400_envelope]
  Hav --> List[data_plus_total]
```

`Math.round` **prohibido**. Círculo = `radiusKm * 1000` m. Bbox MX **no** es el predicado de lista.

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
  API-->>FE: data plus meta.total plus meta.radiusKm
```

URL `radiusKm=22` → FE y BE clampa a 10 **antes** del GET efectivo (`meta.radiusKm=10`).

---

## Viewport México (Must FE)

```mermaid
flowchart TD
  Map[Leaflet]
  Map --> MaxB[maxBounds MEXICO_BOUNDS]
  Map --> MinZ[minZoom 5]
  Drag[Pin_GPS_geocode_URL]
  Drag -->|isInMexico| Adopt[Adoptar_centro]
  Drag -->|fuera| Reject[Conservar_SN_o_ultimo]
  Adopt --> FitCircle[fitBounds_circulo]
```

---

## Referencias

- [`../api/API-GEO-01.md`](../api/API-GEO-01.md)
- ADR-020 append F8, ADR-028, ADR-026, ADR-027
