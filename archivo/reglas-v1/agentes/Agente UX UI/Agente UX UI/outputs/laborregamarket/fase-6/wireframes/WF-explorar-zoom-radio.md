> **Pantalla:** Explorar fruterías (`/explorar`) — Fase 6 GEO zoom ↔ radio
> **Objetivo Principal:** Ver siempre el círculo de cobertura alineado al zoom, al slider y a la lista; feedback de carga con loader borrega
> **Base:** Delta sobre F5 [`../../fase-5/wireframes/WF-explorar-leaflet.md`](../../fase-5/wireframes/WF-explorar-leaflet.md) (solo lectura). No reintroduce Maps JS.

```text
+-----------------------------------------------------------------------+
| [Header] Logo | Pill búsqueda (sync ?q=) | Acciones usuario           |
+-----------------------------------------------------------------------+
| FilterBar (F2): [✓ Verificadas] [Frutas] …                            |
|                              [📍 Usar mi ubicación]  ← BANNER; ≥44px  |
+-----------------------------------------------------------------------+
| Barra compacta (F5, sin radio): buscar dirección · favoritas · Guardar|
+-----------------------------------------------------------------------+
| LISTA (55%) — alternativa a11y        |  MAPA Leaflet + OSM (45%)     |
| aria-busy al refetch                  |  ┌──────────────────────────┐ |
|                                       |  │  teselas OSM             │ |
| Loading: BrandLoader B1→B2→B3         |  │  pin (centro)            │ |
|   sr-only: "Buscando fruterías"       |  │  ● círculo SIEMPRE on    │ |
|                                       |  │  markers = lista         │ |
| Success: cards F5                     |  │  © OpenStreetMap         │ |
| Empty: "No hay fruterías…"            |  │  hint clamp si tope 25   │ |
|   + Ampliar radio                     |  │  1 km ———●———— 25 km    │ |
|                                       |  │  Radio: 12 km  ← overlay │ |
+-----------------------------------------------------------------------+
```

El Should F5 (clustering; lista recortada a bbox) **no se implementa**. Zoom/pan mueven `radiusKm` Haversine (1–25), no un bounding box.

### Mobile (`<= 640px`)

```text
+-----------------------------------------------------------------------+
| FilterBar + [ Usar mi ubicación ] w-full min-h-11                     |
| LISTA first (a11y) — BrandLoader aquí al refetch                      |
| MAPA h-[300px] visible — NUNCA hidden ni cubierto por splash          |
|   círculo siempre visible si hay coords                               |
|   overlay slider; hint clamp encima del slider, no sobre attribution  |
+-----------------------------------------------------------------------+
```

#### Estados de la pantalla (delta F6)

| Estado | Comportamiento UI |
|--------|-------------------|
| **Refetch loading** | Lista: `BrandLoader` B1→B2→B3; `aria-busy="true"`; mapa + círculo + slider visibles y **no** disabled |
| **Reduced motion** | Solo frame B1, estático |
| **Success** | Loader off; cards = markers; círculo = `radiusKm` |
| **Empty radio** | F5: "No hay fruterías en este radio" + **Ampliar radio** + Limpiar filtros |
| **Clamp 25 km** | Círculo y slider en 25; `RadiusClampHint` no bloqueante; GET `radiusKm=25` |
| **Pin fuera de viewport** | No derivar radio; último valor; sin refetch por zoom |
| **Error red** | Loader off; ErrorBanner + Reintentar; **lista previa** si existía |
| **Teselas down** | F5: "El mapa no cargó; usa la lista" |
| **Prohibido** | Splash full-screen; skeleton Must; `animate-pulse` como loading de lista; Maps JS |

Estados F5 no listados (permiso geo, guest guardar, empty filtros) **siguen vigentes**.

#### Sync zoom ↔ slider

| Evento | Radio | Mapa | Lista |
|--------|-------|------|-------|
| Zoom/pan end (debounce ~300 ms) | Derivar pin→bordes, clamp 1–25 | Círculo redibuja | Mismo GET |
| Slider change | Valor del slider | `fitBounds` del círculo | Mismo GET |
| Clamp > 25 | 25 + hint | Círculo 25 km | GET 25; **no** bbox |
| URL `lat` `lng` `radiusKm` | Hidratar | Pin + círculo | Back/forward restaura |

#### Componentes Requeridos para Frontend:
* **ExploreMap (delta):** círculo **siempre** visible si hay coords; derivar `radiusKm` en `moveend`/`zoomend`; no serializar bounds al API.
* **RadiusSliderOverlay:** bidireccional con el visualizador; thumb 44px; no tapa attribution OSM ni el CTA de ubicación del banner.
* **RadiusClampHint:** `text-slate-600 text-sm` + icono `Info`; copy **"Máximo 25 km"**; `role="status"`; no modal, no bloquea el mapa.
* **BrandLoader (`LoaderBorrega`):** props `size` (`sm` lista ~64px, `md` ~96px) + `label` sr-only. Loop B1→B2→B3 cada **500 ms** (rango 400–600). Fuente: `public/brand/loader-borrega/B{n}.png` (copia 1:1 de `Administrador de producto/.../comun/brand/loader-borrega/`). Fondo transparente. Reutilizable fuera de Explorar.
* **ExploreLocationCta / CompactAddressBar / ProviderCard:** F5 sin cambio.

#### Responsividad:
* **Mobile:** Lista arriba (loader ahí); mapa 300px visible; hint clamp en overlay, `z-index` bajo attribution.
* **Desktop:** Lista 55% / mapa sticky 45% (F5). Loader no desplaza el mapa.

#### Accesibilidad:
* Lista alternativa al mapa intacta.
* Slider teclado (`aria-valuemin/max/now`).
* `aria-busy` en el contenedor de lista durante refetch; anuncio sr-only "Buscando fruterías".
* Círculo decorativo (`aria-hidden` en el path Leaflet); el radio se anuncia en el label del slider.
* Contraste hint y label slider ≥ 4.5:1 (no `slate-400`).
* `prefers-reduced-motion: reduce` → B1 estático.

#### API esperada:
* `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=` — **cero query nueva**
* `GET/POST /api/users/me/addresses`

#### Referencias:
* Flujo: `../user-flows/UF-GEO-01-zoom-radio.md`
* F5 (solo lectura): `../../fase-5/wireframes/WF-explorar-leaflet.md`
* Tokens: `BrandLoader`, `RadiusClampHint`
* Arquitecto: `API-GEO-01` nota F6, `ARCH-GEO-03`
