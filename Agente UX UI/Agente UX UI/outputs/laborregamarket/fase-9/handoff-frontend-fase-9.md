# Handoff Frontend Developer — LaBorregaMarket Fase 9 (v0.9.0)

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 25/08/2026  
> **Prioridad:** Deuda Explorar P1–P5 (in-card, typeahead, distancia, chips, chrome+mapa)  
> **No implementar:** pasarela, CFDI, PWA, clustering, bbox Must de API, Google Maps JS, Places, DASH F6, typeahead SKUs, `sampleProducts` en card, schema orgánico, reopen F8 LocationChip/clamp/México, recorte de `US-EXPLORE-05`

---

## Estado: LISTO PARA IMPLEMENTAR

Fase 8 de diseño está **solo lectura** (sign-off intacto). Fase 7 solo lectura. Fase 6 congelada. Este handoff **no** revoca `CO-F7-001` (pan ≠ radio). Absorbe `CO-F9-001` (DT-F9-001…005). Leaflet/OSM **invariante**. Clamp 0.5–10 y `MEXICO_BOUNDS` F8 **se conservan**.

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.9.0

Código: `C:\Users\PC GAMER\LaBorregaMarket`  
`ExplorePageClient.tsx`, `ProviderCard.tsx`, `ProviderPreviewPopover.tsx` → in-card, `ProviderPreviewContent.tsx`, `FilterBar.tsx`, `LocationBar.tsx` / chrome, Header explorar, `ExploreMap.tsx`

Backend: Arquitecto `fase-9/handoff-backend-fase-9.md` + `API-GEO-01`, `API-PROVIDER-PREVIEW-01`, `API-EXPLORE-NOTES-01`.

Quality Gate UX se emite **cuando FE implemente**. No `READY-FOR-QA` de checkout/pagos.

---

## Impacto si no se cierra

El preview se siente desanclado. El header no sugiere fruterías del radio. Las cards muestran un precio mínimo poco útil. Hay chips disabled de adorno. El chrome apilado come viewport del mapa.

---

## US de este handoff

| ID | Frontend hace |
|----|----------------|
| **US-EXPLORE-08** | Preview como animación **dentro** del card; mismos triggers F8; sin popover desanclado |
| **US-EXPLORE-09** | Typeahead header solo fruterías; `GET /api/providers?q&geo&limit=10`; chip + tacha |
| **US-EXPLORE-10** | Quitar `minPrice` visual; fila distancia + ETA ADR-017; Should barra ratio |
| **US-EXPLORE-11** | Mayoreo/Domicilio → query URL; retirar Orgánico y «Filtros» |
| **US-GEO-24** | Una barra `md+`; mapa 420px / `min(520px,52vh)`; no regresionar BUG-012/013 |

**No implementar aquí:** SKUs en typeahead, `sampleProducts` en card, orgánico, AUTH-09, DASH, Redis, CI YAML, Places, pan→radio.

---

## Orden de implementación

```
1. FilterBarF9: retirar Orgánico/Filtros; Mayoreo/Domicilio → offersWholesale/offersDelivery URL + GET
2. ProviderCardDistance: quitar minPrice visual; distancia + ETA; barra Should
3. ExploreChromeF9: una barra md+; tokens mapa 420 / min(520px,52vh)
4. ExploreTypeahead: debounce GET limit=10; filas cover+nombre; chip+tacha; sin pin = no matches
5. ProviderPreviewInCard: expandir dentro del card; quitar popover desanclado; delays F8; marker paridad
6. Heart/ContactCTA/LocationChip/RadiusOverlay/México/CO-F7-001 intactos
```

Arquitecto permite adelantar filtros listing (BE) en paralelo a chrome visual.

---

## Entregables UX (índice)

| Tipo | Archivo |
|------|---------|
| Flow GEO + chips + typeahead | [`user-flows/UF-GEO-01-explorar-f9.md`](./user-flows/UF-GEO-01-explorar-f9.md) |
| Flow preview | [`user-flows/UF-EXPLORE-08-preview-in-card.md`](./user-flows/UF-EXPLORE-08-preview-in-card.md) |
| Flow card | [`user-flows/UF-EXPLORE-10-card-distancia.md`](./user-flows/UF-EXPLORE-10-card-distancia.md) |
| WF P1 | [`wireframes/WF-explorar-preview-in-card.md`](./wireframes/WF-explorar-preview-in-card.md) |
| WF P2 | [`wireframes/WF-explorar-typeahead.md`](./wireframes/WF-explorar-typeahead.md) |
| WF P3 | [`wireframes/WF-explorar-card-distancia.md`](./wireframes/WF-explorar-card-distancia.md) |
| WF P4 | [`wireframes/WF-explorar-filterbar-chips.md`](./wireframes/WF-explorar-filterbar-chips.md) |
| WF P5 | [`wireframes/WF-explorar-chrome-mapa.md`](./wireframes/WF-explorar-chrome-mapa.md) |
| Tokens | [`../comun/design-tokens.md`](../comun/design-tokens.md) §6h |
| IA | [`../comun/information-architecture.md`](../comun/information-architecture.md) |
| F8 (solo lectura) | [`../fase-8/`](../fase-8/) |
| F7 preview contenido | [`../fase-7/wireframes/WF-explorar-preview.md`](../fase-7/wireframes/WF-explorar-preview.md) |

---

## Parte 1 — Preview in-card

### Componentes

| Componente | Spec |
|------------|------|
| ProviderPreviewInCard | Expansión dentro del `ProviderCard`; contenido F7; scrolleable `max-h-[min(70vh,32rem)]` |
| ProviderCardF9 | Sin popover desanclado; Link = tap corto; Heart + ContactCTA |
| PreviewEyeControl | Icon-only `:focus-visible`; `aria-label="Vista previa"` ≥44px |
| Delays | Open 300 ms; close 150 ms; long-press 500 ms; reduced-motion 0 |

Un preview a la vez. Marker → scroll-into-view de la card + mismo expand. Cache `id → payload`; un GET en vuelo; `AbortController`.

### Contratos

Mismo `GET /api/providers/[id]` F7. **Sin** `/preview`. Arquitecto `API-PROVIDER-PREVIEW-01`.

### DoD Parte 1

- [ ] Contenido se anima **dentro** del card; no popover desplazado.
- [ ] Botón «Vista rápida» ausente.
- [ ] Hover / long-press abren; tap corto navega; scroll no abre.
- [ ] Teclado Alt+Enter / Eye; Escape cierra.
- [ ] Campos `US-EXPLORE-05` no recortados; CTA **Ver frutería**.
- [ ] Heart / ContactCTA se quedan.

---

## Parte 2 — Header typeahead

### Componentes

| Componente | Spec |
|------------|------|
| ExploreTypeahead | Solo `/explorar`; debounce ~300 ms; dropdown filas cover+nombre |
| FilterChipQ | Aviso ligero “Filtro: {q}” cuando hay `q` |
| ClearControl | Tacha: limpia texto + filtros chips alineados + `q` |

Corpus = predicado servidor (Haversine + `q` + filtros), **no** el array paginado en memoria. Sin pin → no inventar matches.

### Contratos

`GET /api/providers?q&lat&lng&radiusKm&limit=10&page=1` (+ filtros activos). **Sin** `/suggest`. Arquitecto `API-GEO-01` + `ARCH-EXPLORE-TYPEAHEAD-01`.

### DoD Parte 2

- [ ] Solo fruterías; sin filas SKU.
- [ ] Matches fuera de página 1 aparecen.
- [ ] Selección aplica filtro + aviso; tacha limpia.
- [ ] `q` &lt; 2 no dispara GET; listbox a11y.

---

## Parte 3 — Card distancia + ETA

### Componentes

| Componente | Spec |
|------------|------|
| ProviderCardDistance | «A X km/m de tu búsqueda» + ETA; sin `minPrice` visual |
| DistanceRatioBar | Should: `distanceKm / radiusKm` |

ETA: `computeEtaMinutes` ADR-017; preferir pie si caminata 5 km/h &lt; 15 min.

### Contratos

Sin API Must. `distanceKm` del listing. Arquitecto `API-EXPLORE-NOTES-01`.

### DoD Parte 3

- [ ] Sin «$X MXN desde» / Consultar precios.
- [ ] Una fila distancia (+ ETA); no km duplicado.
- [ ] Sin pin no inventa.
- [ ] Should barra documentada.

---

## Parte 4 — FilterBar chips

### Componentes

| Componente | Spec |
|------------|------|
| FilterBarF9 | Verificado + categorías + Mayoreo + A domicilio |
| ChipMayoreo | `offersWholesale=true` cuando pressed |
| ChipDomicilio | `offersDelivery=true` cuando pressed |

Retirar Orgánico y «Filtros». URL shareable. AND con geo/`q`/categoría/verificado. Empty si 0.

### Contratos

`GET /api/providers?...&offersWholesale&offersDelivery` — Arquitecto `API-GEO-01`. Chips solo encienden (`true`); no enviar `false` como filtro Must.

### DoD Parte 4

- [ ] Ningún chip disabled de adorno.
- [ ] Orgánico y «Filtros» ausentes.
- [ ] Mayoreo/Domicilio filtran; URL; `aria-pressed`; ≥44px.
- [ ] Empty AND con copy + Limpiar.

---

## Parte 5 — Chrome + mapa

### Componentes

| Componente | Spec |
|------------|------|
| ExploreChromeF9 | Una fila `md+` (~44–52px); errores debajo |
| ExploreLayoutF9 | Móvil mapa **420px**; desktop **`min(520px, 52vh)`** |

LocationChip / panel / RadiusOverlayF8 / México / pan≠radio **intactos**.

### Contratos

Sin API Must. Arquitecto `API-EXPLORE-NOTES-01`.

### DoD Parte 5

- [ ] Una barra en desktop; móvil usable (wrap / scroll-x).
- [ ] Mapa +10–20% vs F8.
- [ ] Overlay radio usable.
- [ ] No regresionar BUG-012, BUG-013, `CO-F7-001`.

---

## Copy Must

| Situación | Copy |
|-----------|------|
| Distancia ≥ 1 km | `A {n} km de tu búsqueda` |
| Distancia &lt; 1 km | `A {m} m de tu búsqueda` |
| ETA auto | `~{min} min en auto` |
| ETA pie | `~{min} min a pie` |
| Sin pin distancia | `Elige una ubicación para ver la distancia.` (o ocultar) |
| Typeahead sin pin | `Elige una ubicación para buscar fruterías.` |
| Typeahead vacío | `No hay fruterías con ese nombre en este radio.` |
| Hint `q` 1 char | `Escribe al menos 2 caracteres` |
| Chip filtro q | `Filtro: {q}` |
| Empty chips AND | `No hay fruterías con estos filtros` + Limpiar |
| Preview loading | sr-only `Cargando frutería` |
| Vista previa (a11y) | `aria-label="Vista previa"` — nunca texto «Vista rápida» |
| Conteo / empty radio / fuera MX / GPS | Paridad F8 |

Flags: **no afirmar** envío, tarjeta ni WhatsApp si el campo no es true.

---

## Design system — componentes F9

| Componente | Spec en tokens |
|------------|----------------|
| ExploreChromeF9 / ExploreLayoutF9 | §6h |
| ExploreTypeahead | §6h |
| ProviderPreviewInCard | §6h (depreca popover desanclado F8) |
| ProviderCardDistance | §6h |
| FilterBarF9 | §6h |
| LocationChip / RadiusOverlayF8 / México | §6g (conservados) |
| BrandLoader sizes | Conservado: loading 64px / empty 80px |

---

## Contratos (resumen — no inventar)

| Uso | API |
|-----|-----|
| Lista + typeahead | `GET /api/providers?lat&lng&radiusKm&q&category&verified&offersWholesale&offersDelivery&page&limit` → typeahead `limit=10` |
| Preview | `GET /api/providers/[id]` (campos F7) |
| Favoritas | CRUD F8 intacto |
| Bounds / radio | F8: clamp 0.5–10; `MEXICO_BOUNDS` |

`q` 1 carácter → no GET. Radio fuera de rango → **clamp**, no 400. **Sin** endpoint `/suggest`.

---

## Fuera de alcance

Pasarela, CFDI, PWA, flotilla, clustering, bbox Must de lista, Places, Distance Matrix, reportes DASH, lockfile Redis, CI YAML, typeahead SKUs, `sampleProducts` en card, schema orgánico, reopen F8 chrome ubicación/radio/México, recorte `US-EXPLORE-05`, pan→radio.

---

*Handoff UX/UI → Frontend — LaBorregaMarket v0.9.0 — 25/08/2026.*
