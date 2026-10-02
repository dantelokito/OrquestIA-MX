# READY-FOR-QA — Fase 9

> **Proyecto:** LaBorregaMarket  
> **Fase:** 9 — Deuda Explorar (v0.9.0)  
> **Fecha:** 28/08/2026  
> **De:** Agente UX/UI Designer  
> **Para:** @QA Tester  
> **Condición:** `REVIEW-UX.md` ≥ 80% y 0 P0 **y** Arquitecto `REVIEW-ARCH` F9 ≥ 80% y 0 P0

---

## Dictámenes previos

| Agente | Archivo | Veredicto | Puntaje |
|--------|---------|-----------|---------|
| UX/UI | [`fase-9/quality/REVIEW-UX.md`](./REVIEW-UX.md) | APROBADO CON OBSERVACIONES | 88 / 100 · 0 P0 |
| Arquitecto | `Agente Arquitecto/.../fase-9/quality/REVIEW-ARCH.md` | **Pendiente** | — |
| Backend (auto) | `Agente backend/.../fase-9/quality/QR-BE.md` | Insumo | 97 / 100 |
| Frontend (auto) | `Agente frontend/.../fase-9/quality/QR-FE.md` | Insumo | 92 / 100 |

**No iniciar sign-off QA final** hasta que Arquitecto emita `REVIEW-ARCH` F9 (gate PM 28/08).

---

## Alcance de prueba

| Módulo | Rutas | User flows | Wireframes |
|--------|-------|------------|------------|
| EXPLORE F9 | `/explorar` | `UF-EXPLORE-08`, `UF-EXPLORE-10`, `UF-GEO-01-explorar-f9` | P1–P5 `WF-explorar-*` |
| Regresión F8 | `/explorar` | F8 UF-GEO-01, UF-EXPLORE-07 (solo geo/preview triggers) | F8 WF ubicación/radio/MX |

**Índice diseño:** [`fase-9/README.md`](../README.md) · **Handoff FE:** [`handoff-frontend-fase-9.md`](../handoff-frontend-fase-9.md)

---

## Roles y acceso

| Rol | Rutas | Notas |
|-----|-------|-------|
| Invitado / CLIENT | `/explorar`, `/fruteria/[id]` | Typeahead solo en `/explorar`; default SN + 10 km |
| PROVIDER | `/explorar` logueado | Marca plataforma en cards (no pintar por frutería) |

**Entorno:** local `npm run dev` o staging.  
**Repo código:** `C:\Users\PC GAMER\LaBorregaMarket`  
**Precondición:** pin válido en México (`lat`/`lng`); BE filtros `offersWholesale`/`offersDelivery` desplegados.

**No exigir:** endpoint `/suggest`, Google Maps JS, typeahead SKUs, schema orgánico.

---

## Happy paths obligatorios (100%)

### HP-F9-01 — Preview in-card (US-EXPLORE-08)

1. En `/explorar`, hover desktop ~300 ms sobre una card → preview se expande **dentro** del card (no popover flotante desanclado).
2. Contenido incluye horario, flags iff true, catálogo, 3 reseñas, CTA **Ver frutería**.
3. Tap/clic corto en card → `/fruteria/[id]` (no sustituido por preview).
4. Long-press móvil ~500 ms abre preview; scroll cancela; click sintético post-long-press **no** navega.
5. Escape cierra; un solo preview abierto a la vez.
6. Tap marker abre preview de la card correspondiente.

### HP-F9-02 — Typeahead radio completo (US-EXPLORE-09)

1. Con pin + radio, escribir ≥2 caracteres en header `/explorar`.
2. Desplegable muestra solo fruterías (cover/logo + nombre); **sin** filas SKU.
3. Sugerencia puede incluir frutería **fuera de página 1** del listado (corpus servidor, `limit=10`).
4. Seleccionar fila aplica `q` y refetch; chip «Filtro: {q}» debajo del chrome.
5. Tacha del input limpia `q` **y** chips de filtro alineados; vuelve listado geo del radio.

### HP-F9-03 — Card distancia + ETA (US-EXPLORE-10)

1. Card **no** muestra «$X MXN desde» ni `minPrice` visual.
2. Con pin: «A X km/m de tu búsqueda» + «~N min en auto» o «~N min a pie» (< 15 min caminata).
3. Barra proporcional distancia/radio visible (Should).
4. Sin pin: «Elige una ubicación para ver la distancia.» — no inventar km.

### HP-F9-04 — Chips Mayoreo / Domicilio (US-EXPLORE-11)

1. Chips **Orgánico** y **«Filtros»** **ausentes**.
2. Ningún chip `disabled` de adorno.
3. Mayoreo ON → URL `offersWholesale=true`; listing filtra AND.
4. A domicilio ON → URL `offersDelivery=true`; listing filtra AND.
5. Empty AND: copy + Limpiar filtros; no lista fantasma.

### HP-F9-05 — Chrome + mapa (US-GEO-24)

1. Desktop `≥768px`: chips + GPS + LocationChip + conteo en **una** barra (~44–52px).
2. Errores (geo denegado, hint 2 chars) **debajo**, no inflan la fila.
3. Mapa móvil ~420px; desktop ~`min(520px,52vh)` — visiblemente más alto que F8 (360/440).
4. Overlay radio 0.5–10 km usable en pie del mapa.
5. Pan/zoom mapa **no** cambia `radiusKm` (`CO-F7-001`).
6. BUG-012/013: chrome fuera del scroll principal; colapso FilterBar móvil sigue operativo.

---

## Edge cases recomendados (≥85%)

- `q` 1 carácter → hint; no GET.
- Sin pin → typeahead no inventa matches; copy ubicación.
- Typeahead 0 resultados → «No hay fruterías con ese nombre en este radio.»
- Mayoreo + Domicilio + categoría + verificado AND = 0 → empty chips.
- `prefers-reduced-motion`: preview sin delay; barra sin animación width.
- Regresión F8: LocationChip panel, clamp 0.5–10, rebote México, favoritas DELETE pin se queda.
- Preview 404 → toast «Esta frutería no está disponible»; refetch lista.

---

## Observaciones conocidas (no bloquean QA)

| ID | Severidad | Descripción |
|----|-----------|-------------|
| OBS-UX-F9-001 | P1 | `ProviderPreviewPopover.tsx` legado sin montar — cleanup FE |
| OBS-UX-F9-002 | P1 | Sin tests RTL hover/typeahead |
| OBS-UX-F9-003 | P2 | Foco auto en Cerrar al abrir preview por hover |
| OBS-UX-F9-004 | P2 | Barra distancia sin `role="meter"` |
| OBS-UX-F9-005 | P2 | Ranking typeahead por similitud nombre (Should) |

---

## Fuera de alcance QA F9

Typeahead SKUs, `sampleProducts` en card, schema orgánico, pasarela/CFDI, DASH F6, Maps JS, Places, clustering, pan→radio, reopen F8 US, bbox Must de API.

---

*Habilitación QA emitida por Agente UX/UI Designer — LaBorregaMarket v0.9.0 — 28/08/2026.*
