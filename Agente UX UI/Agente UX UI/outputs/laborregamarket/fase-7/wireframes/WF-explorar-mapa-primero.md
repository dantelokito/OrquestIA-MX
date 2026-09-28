> **Pantalla:** Explorar fruterías (`/explorar`) — Fase 7 mapa-primero
> **Objetivo Principal:** Descubrir fruterías con mapa estable (pan ≠ radio), conteo real y lista paginada bajo el mapa
> **Base:** Extiende F5 [`../../fase-5/wireframes/WF-explorar-leaflet.md`](../../fase-5/wireframes/WF-explorar-leaflet.md) (solo lectura). **Supera** F6 [`../../fase-6/wireframes/WF-explorar-zoom-radio.md`](../../fase-6/wireframes/WF-explorar-zoom-radio.md): pan/zoom ya **no** mueven `radiusKm`.

```text
+-----------------------------------------------------------------------+
| [Header] Logo | Pill "Buscar fruterías, frutas, verduras" | Usuario    |
+-----------------------------------------------------------------------+
| FilterBar (F2): [✓ Verificadas] [Frutas] [Verduras] [Agrícolas]       |
|                              [📍 Usar mi ubicación]  ≥44px            |
+-----------------------------------------------------------------------+
| CompactAddressBar: [🔍 Dirección]  Favoritas [ Casa ▾ ] [ + Guardar ] |
|  Copy: "N fruterías a R km"  ← N = meta.total, R = slider/meta.radiusKm|
+-----------------------------------------------------------------------+
| MAPA Leaflet + OSM  (~+20% alto vs F5)   sticky desktop               |
|  ┌─────────────────────────────────────────────────────────────────┐  |
|  │ teselas OSM   pin (yo)   círculo Haversine SIEMPRE si hay coords │  |
|  │ markers = icono negocio pequeño  SIN nombre en reposo            │  |
|  │ hover/tap → tooltip nombre                                       │  |
|  │ © OpenStreetMap                    [Máximo 25 km] si clamp       │  |
|  │ 1 km ———●———— 25 km     Radio: 10 km   overlay pie               │  |
|  └─────────────────────────────────────────────────────────────────┘  |
+-----------------------------------------------------------------------+
| LISTA bajo el mapa (máx. 20) — alternativa a11y                       |
|  [BrandLoader loading 64px] mientras refetch (no pan)                 |
|  ┌──────┐ ┌──────┐ ┌──────┐                                           |
|  │Cover │ │Cover │ │Cover │  ⭐ o "Sin reseñas" · km si hay pin      |
|  └──────┘ └──────┘ └──────┘                                           |
|  [ 1 ] [ 2 ]  paginación — no resetea mapa ni radio                   |
+-----------------------------------------------------------------------+
```

### Mobile (`<= 640px`)

```text
+-----------------------------------------------------------------------+
| FilterBar chips + [ Usar mi ubicación ] w-full min-h-11               |
| CompactAddressBar stack: dirección → favoritas → Guardar              |
| Copy "N fruterías a R km"                                             |
| MAPA ARRIBA  h-[360px]  (F5 era 300px; +20%)  NUNCA hidden            |
|   overlay inferior: slider 1–25 + "Radio: N km"                       |
|   attribution OSM visible                                             |
| LISTA debajo: cards full-width; loader o empty borrega 80px           |
| Paginación al pie de lista                                            |
+-----------------------------------------------------------------------+
```

**Prohibido F7 móvil:** lista primero empujando el mapa al pie (layout F5). El mapa es la primera región de contenido tras las barras.

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading (refetch)** | Lista: BrandLoader **64px** B1–B3; `aria-busy=true`; mapa/círculo/slider intactos. No skeleton Must. |
| **Empty radio** | `total=0` y 200: BrandLoader **80px** + “No hay fruterías en este radio” + **Ampliar radio** + Limpiar filtros. `aria-busy=false`. |
| **Empty búsqueda** | Igual empty + CTA **Limpiar búsqueda**. |
| **Empty filtros F2** | Copy F2 + Limpiar filtros; mapa sin markers de negocio. |
| **Primera visita** | Centro SN + 10 km (invitado) o last-used (CLIENT). |
| **Pan/zoom** | Vista libre; copy N/R y slider **congelados**. |
| **Success** | Cards ≤20; copy = `meta.total`; tooltip marker. |
| **Error red (API)** | ErrorBanner + Reintentar; lista previa si existía; **≠** empty borrega. |
| **Mapa caído** | “El mapa no cargó; usa la lista”. |
| **Guest guarda** | `/login?redirect=/explorar`; pin en sessionStorage (cola, no origen). |
| **q 1 carácter** | Hint “Escribe al menos 2 caracteres”; no GET. |

#### URL / sync

| Param | UI |
|-------|-----|
| `lat` `lng` `radiusKm` | Pin + slider. Default radio 10. **No** actualizar `radiusKm` por pan. |
| `category` `verified` `q` `page` | Chips F2 + pill; `limit` fijo 20 |

Hidratar URL; back/forward restaura pin y radio. Paginación actualiza `page` **sin** mover el mapa.

#### Componentes Requeridos para Frontend:
* **ExploreLayoutF7:** columna mapa-primero; móvil `flex-col` mapa→lista; desktop mapa sticky `lg:h-[calc(100vh-200px)]` (≈ +20% vs `calc(100vh-240px)` F5 — token `explore.map.minHeight`).
* **ExploreLocationCta / CompactAddressBar / RadiusSliderOverlay:** F5; slider **no** se sincroniza desde zoom.
* **ExploreMap:** Leaflet/OSM; círculo siempre on si coords; pan **sin** debounce GET.
* **ExploreMarker:** icono negocio pequeño (Lucide `Store` o pin 28px); tooltip `businessName`; `aria-label` nombre + distancia.
* **ExploreCount:** “{N} fruterías a {R} km” — `meta.total` / `meta.radiusKm`.
* **BrandLoader:** `size="loading"` | `size="empty"`.
* **ProviderCard:** CTA abre preview (sheet) o detalle; distancia si hay pin.

#### Responsividad:
* **Mobile (<=640px):** Mapa 360px arriba; lista scroll; CTA `w-full`; slider overlay.
* **Desktop (>=1024px):** Mapa full-width sticky dominante; lista grid 2–3 cols debajo; max-w-7xl.

#### Accesibilidad:
* Tab: FilterBar → CTA geo → barra compacta → mapa/slider → lista.
* Slider y GPS ≥44px; teclado.
* Markers: nombre en tooltip/focus, no permanente.
* Reduced-motion: B1 estático; fitBounds instantáneo.
* Attribution OSM no tapada.

#### API esperada:
* `GET /api/providers?...&limit=20`
* `GET /api/users/me/addresses` + `POST .../[id]/use`

#### Referencias:
* Flujo: `../user-flows/UF-GEO-01-explorar-f7.md`
* Tokens: `../../comun/design-tokens.md` §6f
