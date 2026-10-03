> **Pantalla:** Explorar fruterías (`/explorar`) — Fase 4 GEO
> **Objetivo Principal:** Descubrir fruterías cercanas con mapa Google, radio ajustable y direcciones favoritas
> **Base:** Extiende [`../../fase-1/wireframes/WF-explorar.md`](../../fase-1/wireframes/WF-explorar.md) (filtros F2 intactos)

```text
+-----------------------------------------------------------------------+
| [Header] Logo | Pill búsqueda (sync ?q=) | Acciones usuario           |
+-----------------------------------------------------------------------+
| FilterBar (F2): [✓ Verificadas] [Frutas] [Verduras] [Agrícolas]       |
+-----------------------------------------------------------------------+
| LocationBar:                                                          |
|  [📍 Usar mi ubicación]  [🔍 Buscar dirección________]               |
|  Favoritas: [ Casa ▾ ] [ + Guardar dirección ]   ← auth; si guest:   |
|              login gate al guardar                                    |
|  Radio:  (1 km) ———●———————— (25 km)   valor: 10 km                 |
|  "Fruterías a 10 km de Casa"                                          |
+-----------------------------------------------------------------------+
| LISTA (55%) — alternativa a11y        |  MAPA Google (45%)            |
| 12 fruterías · orden por distancia    |  ┌──────────────────────────┐ |
|                                       |  │  Google Maps JS          │ |
| ┌──────┐ ┌──────┐                    |  │  pin arrastrable (yo)    │ |
| │Cover │ │Cover │                    |  │  círculo radio           │ |
| │⭐4.8 │ │Sin   │                    |  │  [$45] bubbles = lista   │ |
| │ 1.2km│ │reseñas│                    |  │                          │ |
| └──────┘ └──────┘                    |  └──────────────────────────┘ |
| [ 1 ] [ 2 ] …                         |  sticky desktop               |
+-----------------------------------------------------------------------+
```

### Mobile (`<= 640px`)

```text
+-----------------------------------------------------------------------+
| FilterBar chips scroll                                                |
| LocationBar stack: ubicación → favoritas → slider radio w-full        |
| LISTA full-width (cards)  ← siempre primero (a11y)                    |
| MAPA debajo: h-[300px] visible — NUNCA hidden                         |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | 6× SkeletonCard; mapa área gris `animate-pulse` |
| **Empty radio** | "No hay fruterías en este radio" + CTA **Ampliar radio** + "Limpiar filtros" |
| **Empty filtros F2** | Copy F2 + Limpiar filtros; mapa sin markers |
| **Sin geolocalización** | Filtros ciudad/categoría; CTA "Activar ubicación o buscar dirección"; mapa centro Monterrey |
| **Success** | Lista + Maps sync hover; cards con distancia si hay pin |
| **Error red** | ErrorBanner + Reintentar (≠ empty) |
| **Maps indisponible** | Banner info; **lista usable** |
| **Guest guarda dirección** | Redirect `/login?redirect=/explorar` + pin en sessionStorage |

#### URL / sync

| Param | UI |
|-------|-----|
| `lat` `lng` `radiusKm` | Pin + slider (default radius 10) |
| `category` `verified` `q` `page` | Chips F2 (sin cambio) |

Hidratar desde URL; back/forward restaura pin y radio.

#### Componentes Requeridos para Frontend:
* **LocationBar / LocationPicker:** geolocalización, geocode, pin draggable.
* **RadiusSlider:** 1–25, step 1; `aria-valuemin/max/now`; label visible.
* **FavoriteAddressSelect:** dropdown; vacío = CTA guardar.
* **ExploreMap:** Google Maps JS **lazy**; markers = result set; círculo de radio.
* **ProviderCard:** + distancia; rating real o "Sin reseñas todavía".
* **EmptyState** radio vs filtros (copy distinto).

#### Responsividad:
* **Mobile:** Lista arriba; mapa 300px visible (`flex-col`). OBS-01 intacto.
* **Desktop:** `lg:flex-row`; lista 55%; mapa sticky `lg:h-[calc(100vh-220px)]`.

#### Accesibilidad:
* Lista es la alternativa al mapa (tab order: LocationBar → lista → mapa).
* Slider operable por teclado; markers `aria-label` con nombre + precio.
* Si Maps falla, no hay pérdida de tarea.

#### API esperada:
* `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=`
* `GET/POST /api/users/me/addresses`

#### Referencias:
* Flujo: `../user-flows/UF-GEO-01-mapa-radio-favoritas.md`
* Base F2: `../../fase-1/wireframes/WF-explorar.md`
