> **Pantalla:** Explorar fruterías (`/explorar`) — Fase 5 GEO Leaflet/OSM
> **Objetivo Principal:** Descubrir fruterías cercanas con mapa Open Source, ubicación en banner y radio al pie del mapa
> **Base:** Extiende [`../../fase-1/wireframes/WF-explorar.md`](../../fase-1/wireframes/WF-explorar.md). Reemplaza layout F4 [`../../fase-4/wireframes/WF-explorar-geo.md`](../../fase-4/wireframes/WF-explorar-geo.md) (solo lectura). Filtros F2 intactos.

```text
+-----------------------------------------------------------------------+
| [Header] Logo | Pill búsqueda (sync ?q=) | Acciones usuario           |
+-----------------------------------------------------------------------+
| FilterBar (F2): [✓ Verificadas] [Frutas] [Verduras] [Agrícolas]       |
|                              [📍 Usar mi ubicación]  ← BANNER; ≥44px  |
+-----------------------------------------------------------------------+
| Barra compacta (NO radio, NO CTA geo):                                |
|  [🔍 Buscar dirección________]  Favoritas: [ Casa ▾ ] [ + Guardar ]   |
|  Guest: login gate al guardar · "Fruterías a 10 km de Casa"           |
+-----------------------------------------------------------------------+
| LISTA (55%) — alternativa a11y        |  MAPA Leaflet + OSM (45%)     |
| 12 fruterías · orden por distancia    |  ┌──────────────────────────┐ |
|                                       |  │  teselas OSM             │ |
| ┌──────┐ ┌──────┐                    |  │  pin arrastrable (yo)    │ |
| │Cover │ │Cover │                    |  │  círculo radio Haversine │ |
| │⭐4.8 │ │Sin   │                    |  │  markers = lista         │ |
| │ 1.2km│ │reseñas│                    |  │  © OpenStreetMap         │ |
| └──────┘ └──────┘                    |  │  1 km ———●———— 25 km    │ |
| [ 1 ] [ 2 ] …                         |  │  Radio: 10 km  ← overlay │ |
+-----------------------------------------------------------------------+
|                                       |  sticky desktop               |
+-----------------------------------------------------------------------+
```

### Mobile (`<= 640px`)

```text
+-----------------------------------------------------------------------+
| FilterBar chips scroll                                                |
| [ Usar mi ubicación ]  w-full  min-h-11                               |
| Barra compacta stack: buscar → favoritas → Guardar                    |
| LISTA full-width (cards)  ← siempre primero (a11y)                    |
| MAPA debajo: h-[300px] visible — NUNCA hidden                         |
|   overlay inferior: slider radio w-full + label "Radio: N km"         |
|   attribution OSM visible                                             |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | 6× SkeletonCard; mapa área gris `animate-pulse` |
| **Empty radio** | "No hay fruterías en este radio" + CTA **Ampliar radio** + "Limpiar filtros" |
| **Empty filtros F2** | Copy F2 + Limpiar filtros; mapa sin markers |
| **Sin geolocalización** | Mensaje no bloqueante: "Busca una dirección o usa una favorita"; mapa centro Monterrey / última posición; lista **no** vacía |
| **Success** | Lista + Leaflet sync hover; cards con distancia si hay pin |
| **Error red (API)** | ErrorBanner + Reintentar (≠ empty) |
| **Mapa caído por red** | Banner info sobre el mapa; **lista usable**. Copy: "El mapa no cargó; usa la lista" |
| **Prohibido F5** | Fallback F4 "Mapa no disponible" por falta de `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — **ya no ocurre** |
| **Guest guarda dirección** | Redirect `/login?redirect=/explorar` + pin en sessionStorage |

#### URL / sync

| Param | UI |
|-------|-----|
| `lat` `lng` `radiusKm` | Pin + overlay slider (default radius 10) |
| `category` `verified` `q` `page` | Chips F2 (sin cambio) |

Hidratar desde URL; back/forward restaura pin y radio. Filtro de negocio = Haversine, no bbox Must.

#### Should (opcional F5)

| Item | UI |
|------|-----|
| Clustering | Agrupar markers al alejar zoom; lista no cambia |
| Viewport sync | Al terminar pan/zoom (debounce), la lista puede recortarse al viewport; **no** sustituye `radiusKm` |

#### Componentes Requeridos para Frontend:
* **ExploreLocationCta:** **Usar mi ubicación** en banner (FilterBar row); Button Secondary; min-h 44px; `w-full` móvil.
* **CompactAddressBar:** geocode + `FavoriteAddressSelect` + Guardar. Sin slider ni CTA geo.
* **RadiusSliderOverlay:** 1–25, step 1; anclado al **borde inferior del mapa**; `aria-valuemin/max/now`; label visible "Radio: N km"; thumb hit area 44px; operable por teclado.
* **ExploreMap:** Leaflet + OSM **dynamic import / sin SSR**; markers = result set; círculo de radio; attribution OSM obligatoria.
* **ProviderCard:** + distancia; rating real o "Sin reseñas todavía". CLIENT: marca plataforma (no color por frutería). PROVIDER logueado: chrome usa tema de sesión (`UF-BRAND-01`).
* **EmptyState** radio vs filtros (copy distinto).
* **MapTilesError:** overlay/banner sobre mapa; lista intacta.

#### Responsividad:
* **Mobile:** Lista arriba; mapa 300px visible (`flex-col`). OBS-01 intacto. CTA ubicación `w-full`. Slider overlay sobre el mapa.
* **Desktop:** `lg:flex-row`; lista 55%; mapa sticky `lg:h-[calc(100vh-240px)]` (banner + barra compacta más altos que LocationBar F4).

#### Accesibilidad:
* Lista es la alternativa al mapa (tab order: FilterBar + CTA → barra compacta → lista → mapa/slider).
* Slider operable por teclado; markers `aria-label` con nombre + precio.
* Attribution OSM no se oculta (`z-index` del overlay no tapa el crédito).
* Si teselas fallan, no hay pérdida de tarea.
* Labels del slider: `text-slate-500` o más oscuro (no `slate-400` — OBS-UX-F4-011).

#### API esperada:
* `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=`
* `GET/POST /api/users/me/addresses`

#### Referencias:
* Flujo: `../user-flows/UF-GEO-01-mapa-leaflet-radio.md`
* F4 (solo lectura): `../../fase-4/wireframes/WF-explorar-geo.md`
* Base F2: `../../fase-1/wireframes/WF-explorar.md`
