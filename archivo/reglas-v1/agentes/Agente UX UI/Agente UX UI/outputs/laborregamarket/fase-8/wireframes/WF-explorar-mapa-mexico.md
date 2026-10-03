> **Pantalla:** Mapa Explorar acotado a México + encuadre al círculo
> **Objetivo Principal:** No salir del país y ver siempre el área que se busca
> **Historia:** US-GEO-23

```text
+-----------------------------------------------------------------------+
| FilterBar + LocationChip + ExploreCount                                |
+-----------------------------------------------------------------------+
| MAPA Leaflet + OSM                                                     |
|  ┌─────────────────────────────────────────────────────────────────┐  |
|  │ maxBounds = MEXICO_BOUNDS   viscosity 1.0   minZoom 5            │  |
|  │ pin + círculo Haversine                                         │  |
|  │ pan interno = solo vista  (CO-F7-001)                           │  |
|  │ borde: rebote — no se ve Texas/Guatemala como destino            │  |
|  │ © OpenStreetMap                    overlay radio compacto        │  |
|  └─────────────────────────────────────────────────────────────────┘  |
+-----------------------------------------------------------------------+
| LISTA (N/R no cambian al panear)                                       |
+-----------------------------------------------------------------------+
```

### Constante (Arquitecto ADR-028 — no inventar)

```
MEXICO_BOUNDS = { south: 14.5329, west: -118.3649, north: 32.7187, east: -86.7104 }
minZoom = 5
maxBoundsViscosity = 1.0
Nominatim MEXICO_VIEWBOX = "-118.3649,32.7187,-86.7104,14.5329"
```

San Nicolás `25.7475, -100.2830` está dentro. CDMX es válido. Polígono INEGI = Won't.

### Encuadre (FitCircle)

Al cambiar **slider / GPS / dirección / favorita**: el círculo **llena la vista** (`fitBounds` del círculo, paridad F7). Pan o pinch **dentro de MX** no disparan refetch ni mueven `radiusKm`.

`prefers-reduced-motion`: encuadre instantáneo.

### Banners — GPS denegado ≠ fuera de México

```text
GPS denegado (F5/F7 — no sustituir):
+-----------------------------------------------------------------------+
| No pudimos usar tu ubicación. Puedes buscar una dirección o usar      |
| una favorita. Seguimos en San Nicolás.                                |
+-----------------------------------------------------------------------+

Fuera de México (GPS / geocode / pin / URL):
+-----------------------------------------------------------------------+
| Esa ubicación está fuera de México. Seguimos donde estabas.           |
+-----------------------------------------------------------------------+
```

No adoptar Laredo TX ni equivalente. No mostrar coords crudas como mensaje principal. No toast “400 isInMexico”.

FE **no envía** `lat`/`lng` fuera de `MEXICO_BOUNDS`. Fallback = último pin válido o SN. BE Should: 400 envelope; **no** remap a SN en servidor.

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Pan al borde** | Rebote viscoso. Lista, slider y copy N/R congelados. Sin error técnico. |
| **Alejar zoom** | `minZoom` 5: no se ve el continente. Radio intacto. |
| **FitCircle** | Slider/GPS/dirección/favorita → encuadra círculo. |
| **GPS denegado** | Copy F5/F7; centro SN o favorita. |
| **GPS / geocode / pin / `?lat&lng` fuera** | Copy fuera de MX; centro previo. |
| **Mapa caído** | “El mapa no cargó; usa la lista”. |
| **Pin CDMX** | Válido; Haversine local (posible `total=0`). |

#### Componentes Requeridos para Frontend:
* **ExploreMapF8:** `maxBounds` + `maxBoundsViscosity={1}` + `minZoom={5}`. Leaflet/OSM. Círculo = `radiusKm * 1000` m.
* **FitCircle:** al cambiar centro o radio (no al pan).
* **OutOfMexicoBanner:** `role="status"`; copy no técnico; distinto de GPS denegado.
* **LocationDeniedBanner:** paridad F5/F7.

#### Responsividad:
* Mismos altos F7 (`--explore-map-min-h-mobile: 360px`; desktop sticky). El overlay compacto (P2) gana viewport; este WF no cambia layout.

#### Accesibilidad:
* Feedback de borde = comportamiento del mapa, no un live-region de error.
* Banner fuera de MX: `aria-live="polite"`.
* Lista siempre alternativa al mapa.

#### API esperada:
* `GET /api/providers` — filtro Haversine; **no** bbox Must de lista. Should BE: `!isInMexico` → 400.
* Nominatim: `MEXICO_VIEWBOX` (sustituye `MONTERREY_VIEWBOX` en Explorar).

#### Referencias:
* Flujo: `../user-flows/UF-GEO-01-explorar-f8.md`
* ADR-028; `CO-F8-002`; `CO-F7-001`
* Tokens: `../../comun/design-tokens.md` §6g
