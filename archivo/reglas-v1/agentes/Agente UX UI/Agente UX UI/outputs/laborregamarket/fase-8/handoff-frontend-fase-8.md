# Handoff Frontend Developer — LaBorregaMarket Fase 8 (v0.8.3)

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 24/08/2026  
> **Prioridad:** Explorar polish P1–P4 (ubicación, radio, mapa MX, preview hover)  
> **No implementar:** pasarela, CFDI, PWA, clustering, bbox Must de API, Google Maps JS, Places, DASH F6, FilterBar nuevo, recorte de `US-EXPLORE-05`

---

## Estado: LISTO PARA IMPLEMENTAR

Fase 7 de diseño está **solo lectura**. Fase 6 **congelada**. Este handoff **no** revoca `CO-F7-001` (pan ≠ radio). Añade `CO-F8-001` (0.5–10 km), `CO-F8-002` (viewport México), `CO-F8-003` (preview sin botón). Leaflet/OSM **invariante**.

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.8.3

Código: `C:\Users\PC GAMER\LaBorregaMarket`  
`CompactAddressBar.tsx`, `FavoriteAddressSelect.tsx`, `RadiusSlider.tsx`, `ExploreMap.tsx`, `ProviderCard.tsx` (quitar «Vista rápida»), `ProviderPreviewSheet.tsx` (reanclar contenido), `ExplorePageClient.tsx`

Backend: Arquitecto `fase-8/handoff-backend-fase-8.md` + `API-GEO-01`, `API-ADDRESSES-01`, `API-PROVIDER-PREVIEW-01`, ADR-028.

Quality Gate UX se emite **cuando FE implemente**. No `READY-FOR-QA` de checkout/pagos.

---

## Impacto si no se cierra

Tres cajas de ubicación pelean con el mapa. El overlay de 25 km tapa teselas. El mapa se panea a Texas. El botón «Vista rápida» se siente a ficha, no a peek.

---

## US de este handoff

| ID | Frontend hace |
|----|----------------|
| **US-GEO-17** | Un `LocationChip` en reposo; sheet `<md` / popover `≥md`; GPS en FilterBar |
| **US-GEO-18** | Lista `label` + `formattedAddress`; borrar con confirmación; pin se queda si se borra la activa |
| **US-GEO-19** | Diálogo in-app (no `window.prompt`); invitado → login; tope 20 |
| **US-GEO-20** | Chip absorbe “Centro: X”; conteo permanece (`formatRadius`) |
| **US-GEO-21** | Overlay más bajo; range; sin fila `RadiusClampHint` |
| **US-GEO-22** | Clamp 0.5–10, step 0.5; copy metros; Ampliar radio oculto en 10; **sin** `Math.round` |
| **US-GEO-23** | `maxBounds` MX + viscosidad 1 + `minZoom` 5; FitCircle; rechazo fuera de MX |
| **US-EXPLORE-07** | Hover 300 ms / long-press 500 ms; tap corto = detalle; sin «Vista rápida»; marker = mismo preview |

**No implementar aquí:** FilterBar, recorte preview, AUTH-09, DASH, Redis, CI YAML, Places, polígono INEGI.

---

## Orden de implementación

```
1. Constantes MIN/MAX/DEFAULT/STEP 0.5–10; quitar Math.round de clampRadiusKm
2. Overlay compacto + formatRadius + copy 10 km (nunca 25); Ampliar radio ≤ 10
3. maxBounds MEXICO_BOUNDS + minZoom 5 + Nominatim MEXICO_VIEWBOX
4. LocationChip + panel (sustituye CompactAddressBar in-line); diálogo guardar; borrar pin permanece
5. Quitar «Vista rápida»; ProviderPreviewPopover anclado; delays; teclado Alt+Enter / Eye
6. Heart y ContactCTA intactos; un preview a la vez; cache GET por id
```

Arquitecto permite adelantar constantes y clamp **antes** de este chrome visual.

---

## Entregables UX (índice)

| Tipo | Archivo |
|------|---------|
| Flow GEO | [`user-flows/UF-GEO-01-explorar-f8.md`](./user-flows/UF-GEO-01-explorar-f8.md) |
| Flow preview | [`user-flows/UF-EXPLORE-07-preview-hover.md`](./user-flows/UF-EXPLORE-07-preview-hover.md) |
| WF P1 | [`wireframes/WF-explorar-ubicacion.md`](./wireframes/WF-explorar-ubicacion.md) |
| WF P2 | [`wireframes/WF-explorar-radio.md`](./wireframes/WF-explorar-radio.md) |
| WF P3 | [`wireframes/WF-explorar-mapa-mexico.md`](./wireframes/WF-explorar-mapa-mexico.md) |
| WF P4 | [`wireframes/WF-explorar-preview-card.md`](./wireframes/WF-explorar-preview-card.md) |
| Tokens | [`../comun/design-tokens.md`](../comun/design-tokens.md) §6g |
| IA | [`../comun/information-architecture.md`](../comun/information-architecture.md) |
| F7 Explorar (solo lectura) | [`../fase-7/wireframes/WF-explorar-mapa-primero.md`](../fase-7/wireframes/WF-explorar-mapa-primero.md) |
| F7 Preview contenido (solo lectura) | [`../fase-7/wireframes/WF-explorar-preview.md`](../fase-7/wireframes/WF-explorar-preview.md) |

---

## Parte 1 — Chrome de ubicación

### Componentes

| Componente | Spec |
|------------|------|
| LocationChip | Pill ≥44px; `MapPin` + label/dirección corta + chevron; `aria-expanded` |
| LocationPanel | Sheet `<md` / popover `≥md`; buscar; lista; guardar |
| FavoriteAddressRow | `label` + `formattedAddress`; no `<select>` |
| SaveAddressDialog | In-app; máx. 40; no `window.prompt` |
| DeleteAddressDialog | “El mapa se queda en este punto.” |

GPS: `ExploreLocationCta` en FilterBar (F5). **No** rediseñar FilterBar.

### Contratos (no inventar)

`GET/POST/PATCH/DELETE /api/users/me/addresses` + `POST .../[id]/use`. **Cero ruta nueva.** Tope 20 envelope F4. DELETE: pin FE permanece (revoca rehidratación SN de F7). Nominatim + `MEXICO_VIEWBOX`. `localStorage` **no** es origen.

### DoD Parte 1

- [ ] Reposo: un chip; **no** fila input+select+guardar; **no** “Centro: X”.
- [ ] Chip/filas/diálogo ≥44px; Escape; mapa no se empuja.
- [ ] Tokens `--brand` en focus/pressed.
- [ ] Invitado guardar → login; tope 20 copy no técnico.
- [ ] Borrar activa: pin se queda; chip = `formattedAddress`.

---

## Parte 2 — Overlay de radio

### Componentes

| Componente | Spec |
|------------|------|
| RadiusOverlayF8 | Una fila: valor + range 0.5–10 step 0.5 + extremos “500 m” / “10 km”; `px-3 py-1.5` |
| formatRadius | R &lt; 1 → metros; R ≥ 1 → km |
| ExploreCount | `{N} fruterías a {formatRadius(R)}` |
| AmpliarRadioCta | +0.5; **oculto si R = 10** |

**Quitar** `RadiusClampHint` “Máximo 25 km”. Sigue siendo `input[type=range]`, no presets. Slider → FitCircle + GET. Pan **no**.

Constantes: `MIN_RADIUS_KM=0.5`, `MAX_RADIUS_KM=10`, `DEFAULT_RADIUS_KM=10`, `RADIUS_STEP_KM=0.5`. Círculo = `radiusKm * 1000` m.

### Contratos

`GET /api/providers?lat&lng&radiusKm&…&limit=20` → `meta.total`, `meta.radiusKm` aplicado (clamp, no 400). Bookmark 22→10, 0→0.5. **Sin** `Math.round`.

### DoD Parte 2

- [ ] Overlay visiblemente más bajo que F7; mapa gana viewport.
- [ ] Valor actual visible sin abrir nada; teclado en el range.
- [ ] Copy de tope = 10 km, nunca 25 km.
- [ ] `prefers-reduced-motion` en encuadre del círculo.

---

## Parte 3 — Mapa México + encuadre

### Componentes

| Componente | Spec |
|------------|------|
| ExploreMap | `maxBounds` ADR-028; `maxBoundsViscosity=1.0`; `minZoom=5` |
| FitCircle | Al cambiar slider/GPS/dirección/favorita |
| OutOfMexicoBanner | Copy Must abajo; ≠ GPS denegado |

Pan interno = solo vista. No polígono INEGI. No “no ir de MTY a CDMX”.

```
MEXICO_BOUNDS south=14.5329 west=-118.3649 north=32.7187 east=-86.7104
MEXICO_VIEWBOX = "-118.3649,32.7187,-86.7104,14.5329"
```

FE no envía coords fuera de MX. Fallback SN o último pin. BE Should: 400; no remap SN en servidor.

### DoD Parte 3

- [ ] El usuario entiende el borde (rebote), no un error técnico.
- [ ] GPS denegado ≠ GPS fuera de México.
- [ ] Encuadre respeta `prefers-reduced-motion`.
- [ ] Pan en AMM no cambia N/R.

---

## Parte 4 — Preview hover / long-press

### Componentes

| Componente | Spec |
|------------|------|
| ProviderPreviewPopover | Anclado a la card; contenido F7; scrolleable; `max-h-[min(70vh,32rem)]` |
| ProviderCardF8 | Sin «Vista rápida»; Link = tap corto; Heart + ContactCTA |
| PreviewEyeControl | Icon-only `:focus-visible`; `aria-label="Vista previa"` ≥44px |
| Delays | Open 300 ms; close 150 ms (puente); long-press 500 ms; reduced-motion 0 |

z-index: popover **encima** de overlay radio y última fila (flip arriba). Un preview a la vez. Marker abre el **mismo**. Cache `id → payload`; un GET en vuelo; `AbortController`.

### Contratos

Mismo `GET /api/providers/[id]` F7. **Sin** `/preview`. Debounce/cache = solo FE.

### DoD Parte 4

- [ ] Se ve como peek, no como ficha completa ni CTA de texto.
- [ ] Botón «Vista rápida» **ausente**.
- [ ] Hover / long-press abren; tap corto navega; scroll no abre; post-long-press no navega.
- [ ] Teclado abre preview sin el botón de texto. Escape cierra.
- [ ] Horario, catálogo, 3 reseñas, flags, mayoreo/menudeo **no recortados**.
- [ ] CTA dominante = **Ver frutería**.

---

## Copy Must

| Situación | Copy |
|-----------|------|
| Conteo R ≥ 1 | `{N} fruterías a {R} km` |
| Conteo R &lt; 1 | `{N} fruterías a 500 m` (o `750 m`) |
| Empty favoritas | “Aún no tienes direcciones guardadas” |
| Geocode corto | “Escribe al menos 3 caracteres” (**dentro del panel**, no `alert()`) |
| Geocode vacío | “No encontramos esa dirección” |
| Tope 20 | “Llegaste al límite de 20 direcciones. Quita una para guardar otra.” |
| GPS denegado | Paridad F5/F7 (buscar o favorita; default SN) |
| Fuera de MX | “Esa ubicación está fuera de México. Seguimos donde estabas.” |
| Empty radio | “No hay fruterías en este radio” + Ampliar radio (**oculto si R=10**) + Limpiar filtros |
| Preview loading | sr-only “Cargando frutería” |
| Borrar activa | “El mapa se queda en este punto.” |
| Sin pin | “Elige un punto en el mapa primero.” |
| Vista previa (a11y) | `aria-label="Vista previa"` — **nunca** el texto visible «Vista rápida» |

Flags: **no afirmar** envío, tarjeta ni WhatsApp si el campo no es true.

---

## Design system — componentes F8

| Componente | Spec en tokens |
|------------|----------------|
| LocationChip / LocationPanel | §6g |
| RadiusOverlayF8 / formatRadius | §6g; depreca RadiusClampHint 25 km |
| ExploreMap México | §6g + ADR-028 |
| ProviderPreviewPopover | §6g; delays 300/150/500 |
| ExploreLayoutF7 | Conservado (§6f) |
| BrandLoader sizes | Conservado: loading 64px / empty 80px |

---

## Contratos (resumen — no inventar)

| Uso | API |
|-----|-----|
| Lista | `GET /api/providers?lat&lng&radiusKm&q&category&verified&page&limit=20` → clamp 0.5–10; `meta.total`, `meta.radiusKm` |
| Preview | `GET /api/providers/[id]` (campos F7) |
| Favoritas | CRUD `/api/users/me/addresses` + `POST .../[id]/use` |
| Bounds | `MEXICO_BOUNDS` / `isInMexico` ADR-028; Nominatim `MEXICO_VIEWBOX` |

`q` 1 carácter → no GET (hint UI) o 400. Radio fuera de rango → **clamp**, no 400.

---

## Fuera de alcance

Pasarela, CFDI, PWA, flotilla, clustering, bbox Must de lista, Places, Distance Matrix, reportes DASH, lockfile Redis, CI YAML, FilterBar nuevo, recorte `US-EXPLORE-05`, polígono INEGI, merge de duplicados `label`, pan→radio, seed QA en prod.

---

*Handoff UX/UI → Frontend — LaBorregaMarket v0.8.3 — 24/08/2026.*
