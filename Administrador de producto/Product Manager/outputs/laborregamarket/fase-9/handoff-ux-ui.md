# Handoff UX/UI — Fase 9

> **De:** Product Manager  
> **Para:** @UX/UI Designer  
> **Fecha:** 25/08/2026 (v0.9.0 — deuda Explorar DT-F9-001…005)

Diseñar **cinco** deltas de `/explorar`. Baseline F8 (solo lectura). Modelo pan ≠ radio **no se toca** (`CO-F7-001`). Contenido preview = `US-EXPLORE-05` (no recortar). Sign-off F8 **intacto**.

Fuentes QA: `DT-F9-001` … `005` + `QA-F9-handoff-pm.md`.

---

## US-EXPLORE-08 — Preview in-card

Hoy: popover/submódulo **desplazado** respecto al card (`ProviderPreviewPopover`).

| Flujo | Notas |
|-------|-------|
| Hover / long-press / teclado | Misma funcionalidad F8; contenido se **anima dentro del card** |
| Tap corto | Sigue a `/fruteria/{id}` |
| Un solo abierto | Escape cierra; `prefers-reduced-motion` |
| Marker | Mismo preview in-card (paridad) |

**DoD:** no popover desanclado; campos `US-EXPLORE-05`; Heart/ContactCTA se quedan.

---

## US-EXPLORE-09 — Header typeahead

Hoy: header envía `q` a URL; sin desplegable, sin chip, sin tacha de filtros.

| Flujo | Notas |
|-------|-------|
| Typeahead | Solo fruterías: portada + nombre. Corpus = **todo el radio** |
| Match | Producto activo (índice interno) **o** nombre similar |
| Selección | Filtro + aviso ligero en barra |
| Tacha | Limpia texto **y** filtros |
| Sin pin | No inventar matches |

**DoD:** no filas de SKU; header solo en `/explorar`.

---

## US-EXPLORE-10 — Distancia + ETA en card

Hoy: «$X MXN desde» semibold + km gris aparte.

| Flujo | Notas |
|-------|-------|
| Slot | Sin `minPrice` visual |
| Con pin | «A X km/m de tu búsqueda» + ETA auto/pie (ADR-017) |
| Sin pin | No inventar km |
| Should | Barra `distanceKm / radiusKm` |

**DoD:** una sola fila de distancia; copy claro.

---

## US-EXPLORE-11 — FilterBar chips

Hoy: Orgánico, Mayoreo, A domicilio, Filtros = `disabled`.

| Flujo | Notas |
|-------|-------|
| Retirar | Chips **Orgánico** y **«Filtros»** (D-F9-2) |
| Habilitar | Mayoreo / A domicilio (pressed + URL) |
| Conservar | Verificado, Frutas/Verduras/Agrícola |
| Empty | Copy si AND = 0 |

**DoD:** ningún chip disabled de adorno; ≥44px; `aria-pressed`.

---

## US-GEO-24 — Chrome + mapa

Hoy: FilterBar + LocationBar apilados; mapa 360px / `min(440px,45vh)`.

| Flujo | Notas |
|-------|-------|
| Barra | Una fila horizontal desde breakpoint UX; errores debajo |
| Móvil | Wrap o 2ª fila mínima; chips scroll-x |
| Mapa | +10–20% documentado en tokens |
| No regresionar | BUG-012, BUG-013, pan ≠ radio, LocationChip F8 |

**DoD:** chrome más bajo; mapa más alto; overlay radio usable.

---

## Entregables esperados

1. Delta UF-GEO-01 / WF explorar: in-card, typeahead, card distancia, chips, barra.
2. `handoff-frontend-fase-9.md` con tokens, breakpoint, delays, DoD por US.
3. Quality Gate cuando FE implemente (no bloquear handoff inicial).

**No diseñar:** typeahead de SKUs, `sampleProducts` en card, esquema orgánico, DASH, Maps JS, Places, clustering, reopen F8.
