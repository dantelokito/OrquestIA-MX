> **Pantalla:** Overlay de radio compacto en `/explorar`
> **Objetivo Principal:** Ajustar el radio 500 m–10 km sin tapar el mapa con tres filas
> **Historia:** US-GEO-21, US-GEO-22

```text
+-----------------------------------------------------------------------+
| FilterBar + LocationChip + ExploreCount                                |
+-----------------------------------------------------------------------+
| MAPA Leaflet + OSM                                                     |
|  ┌─────────────────────────────────────────────────────────────────┐  |
|  │ teselas OSM   pin   círculo Haversine SIEMPRE si hay coords      │  |
|  │ markers sin label permanente                                     │  |
|  │ © OpenStreetMap                                                 │  |
|  │                                                                 │  |
|  │  Radio: 10 km     500 m ———●———————— 10 km     ← UNA fila       │  |
|  └─────────────────────────────────────────────────────────────────┘  |
+-----------------------------------------------------------------------+
| LISTA  empty: Ampliar radio (oculto si ya 10 km)                       |
+-----------------------------------------------------------------------+
```

### Overlay compacto (Must — sustituye F7)

```text
F7 (no repetir):
  [Máximo 25 km]          ← fila extra RadiusClampHint  PROHIBIDO F8
  label “Radio: 22 km”
  input range min=1 max=25 h-11
  span “1 km” … “25 km”

F8:
+-----------------------------------------------------------------------+
| Radio: 10 km   500 m  ====●====================  10 km                |
| ↑ valor siempre visible    ↑ range step 0.5      ↑ extremos           |
+-----------------------------------------------------------------------+
```

Superficie: `absolute inset-x-0 bottom-0 z-[400]` **pero más baja**: `px-3 py-1.5` (F7 era `px-4 py-3` + label + extremos + hint). Attribution OSM **no** tapada. Thumb hit area ≥44px (padding), thumb visual 24px `--brand`.

### Valor &lt; 1 km

```text
+-----------------------------------------------------------------------+
| Radio: 500 m   500 m  ●==========================  10 km              |
+-----------------------------------------------------------------------+
| ExploreCount:  3 fruterías a 500 m                                     |
+-----------------------------------------------------------------------+
```

`formatRadius(0.5)` → `"500 m"`; `formatRadius(1.5)` → `"1.5 km"`; `formatRadius(10)` → `"10 km"`. Param API sigue `radiusKm` decimal. **Prohibido** `Math.round`.

### Empty radio (CTA)

```text
+-----------------------------------------------------------------------+
| BrandLoader empty 80px                                                 |
| No hay fruterías en este radio                                         |
| [ Ampliar radio ]  ← +0.5 km; OCULTO si radiusKm === 10                |
| [ Limpiar filtros ]                                                    |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Success** | Valor visible sin abrir nada. Arrastrar / flechas → círculo + `fitBounds` + refetch. Pan **no** mueve R (`CO-F7-001`). |
| **Mínimo** | `radiusKm=0.5`; círculo 500 m; extremos “500 m”. |
| **Máximo** | `radiusKm=10`; tope leído en label/extremos (“10 km”); **sin** hint extra “Máximo 25 km”. Ampliar radio oculto. |
| **URL `?radiusKm=22`** | Clamp visual y API a 10. |
| **URL `?radiusKm=0`** | Clamp a 0.5. |
| **URL ausente** | Default 10 (paridad `US-GEO-11`). |
| **Reduced-motion** | Encuadre del círculo instantáneo. |
| **Loading refetch** | Lista 64px; overlay operable; mapa intacto. |

#### Componentes Requeridos para Frontend:
* **RadiusOverlayF8:** una fila flex: label `Radio: {formatRadius(R)}` + `input[type=range]` `min=0.5` `max=10` `step=0.5` + extremos. **Sigue siendo range**, no presets.
* **formatRadius(R):** R &lt; 1 → metros enteros (`Math.round(R * 1000) + " m"`); R ≥ 1 → km con a lo sumo 1 decimal + `" km"`.
* **ExploreCount:** `{N} fruterías a {formatRadius(R)}` (+ sufijo `para "q"` si hay búsqueda).
* **AmpliarRadioCta:** +0.5 km; hidden si `R >= 10`.
* **RadiusClampHint:** **deprecado** en Explorar F8. No reintroducir “Máximo 25 km”.

Constantes (mismas FE+BE, Arquitecto `API-GEO-01`):

| Constante | Valor |
|-----------|-------|
| `MIN_RADIUS_KM` | `0.5` |
| `MAX_RADIUS_KM` | `10` |
| `DEFAULT_RADIUS_KM` | `10` |
| `RADIUS_STEP_KM` | `0.5` |

#### Responsividad:
* **Mobile:** overlay `w-full`; una fila que puede wrap el label encima del track **solo si** el ancho no alcanza — preferir una sola línea; padding vertical menor que F7.
* **Desktop:** misma fila; no tapar markers del centro del mapa.

#### Accesibilidad:
* `aria-valuemin="0.5"` `aria-valuemax="10"` `aria-valuenow` + `aria-valuetext` (“500 metros” / “10 kilómetros”).
* Teclado: flechas / PageUp-Down. z-index overlay **menor** que popups de marker y que `LocationPanel` / `ProviderPreviewPopover`.
* Contraste label `text-slate-600` (no `slate-400`).

#### API esperada:
* `GET /api/providers?...&radiusKm=` decimal 0.5–10; `meta.radiusKm` = aplicado (clamp, no 400).

#### Referencias:
* Flujo: `../user-flows/UF-GEO-01-explorar-f8.md`
* Tokens: `../../comun/design-tokens.md` §6g
* `CO-F8-001`; F7 slider (solo lectura): `../../fase-7/wireframes/WF-explorar-mapa-primero.md`
