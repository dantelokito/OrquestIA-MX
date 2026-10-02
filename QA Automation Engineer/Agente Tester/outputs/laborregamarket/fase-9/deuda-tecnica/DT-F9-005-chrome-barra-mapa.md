# DT-F9-005 — Chrome Explorar en una barra horizontal y mapa un poco más alto

> **ID:** DT-F9-005  
> **Tipo:** Deuda técnica / mejora UX (no bug de producto F8)  
> **Severidad propuesta:** Minor/Major UX (no Blocker)  
> **Fase:** 9 (F8 permanece cerrada) — **último DT de esta cola F9**  
> **Estado:** Abierta — revisión Product Manager  
> **Fecha:** 2026-08-25  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Relacionados:** [DT-F9-004](./DT-F9-004-filterbar-chips-bloqueados.md) (chips; no redibuja el chrome); BUG-012/013/014 F7 **cerrados** (no reabrir)

---

## Incidencia

En `/explorar` el **chrome encima del mapa** está apilado en varias bandas y **come viewport vertical**:

1. **FilterBar** — fila de chips; en `&lt;lg` el CTA «Usar mi ubicación» va **debajo** (`flex-col` + `lg:flex-row` en `FilterBar.tsx`).
2. **LocationBar** — LocationChip + conteo (`ExploreCount`) en el scroll, **otra** franja antes del mapa.
3. **Mapa** — altura fija relativamente baja: `--explore-map-min-h-mobile: 360px`; desktop `lg:h-[min(440px,45vh)]` (`ExplorePageClient.tsx`).

El mapa-primero (US-GEO-09 / F7–F8) pierde prioridad: el usuario ve controles antes que territorio. BUG-014 ya compactó la **antigua** CompactAddressBar en una fila ≥640px; el stack FilterBar + LocationBar **sigue** siendo varias filas.

---

## Propuesta (para el PM)

1. **Una sola barra horizontal** (desde un breakpoint que defina UX, p. ej. ≥640px o ≥1024px): chips de filtro (scroll-x si no caben) + GPS + chip de ubicación (y conteo si cabe) en **una fila** `items-center`, altura ~44–52px. Copy/errores (geo denegado, «2 caracteres») **debajo**, no inflan la fila.
2. En **móvil estrecho** se permite wrap o una segunda fila mínima; no exigir 8 chips + GPS + chip en 320px.
3. Conservar colapso FilterBar al scroll (BUG-013) y chrome fuera de `.explore-main-scroll` (BUG-012). `CO-F7-001` intacto (pan ≠ radio).
4. **Mapa ligeramente más alto** con el espacio recuperado, p. ej. subir el token móvil ~360→~420px y desktop `min(440px, 45vh)` → algo del orden `min(520px, 52vh)` (UX fija el delta; «ligeramente» ≈ +10–20%, no mapa a pantalla completa).
5. Overlay del radio (`RadiusSlider`) sigue anclado al mapa; no empujar el slider fuera del viewport.

**Backend Must:** no. Solo layout FE + tokens CSS.

---

## Criterios de aceptación (borrador para US/CO)

| ID | Criterio |
|----|----------|
| AC-1 | Desde el breakpoint acordado, chips + GPS + LocationChip (y conteo si aplica) caben en **una** barra horizontal. |
| AC-2 | La altura del chrome sobre el mapa baja respecto al stack actual (FilterBar + LocationBar apilados). |
| AC-3 | El mapa es **visiblemente más alto** (delta token documentado; no recorta el overlay de radio). |
| AC-4 | Móvil &lt; breakpoint: usable; targets ≥44px; chips con scroll-x. |
| AC-5 | Colapso FilterBar + pestaña «Filtros» (BUG-013) y chrome fuera del scroll (BUG-012) no regresionan. |
| AC-6 | `CO-F7-001`: pan/zoom no cambian `radiusKm`. LocationChip/panel F8 intactos. |

---

## Repro (estado actual)

1. Abrir `/explorar` en desktop (~1280px) y en tablet (~768px).
2. **Observado:** FilterBar (chips; GPS debajo si no `lg`); LocationBar; mapa 360px / `min(440px, 45vh)`.
3. **Esperado (deuda):** una barra; mapa un poco más alto.

| Rol | Ruta |
|-----|------|
| Página | `src/app/explorar/ExplorePageClient.tsx` |
| Chips + GPS | `src/components/explore/FilterBar.tsx` |
| Chip ubicación | `src/components/explore/LocationBar.tsx` |
| Tokens mapa | `src/app/globals.css` (`--explore-map-min-h-mobile`) |

---

## Fuera de este ticket

- Habilitar chips disabled: [DT-F9-004](./DT-F9-004-filterbar-chips-bloqueados.md).
- Preview in-card, header, distancia card: 001–003.
- Mapa full-bleed / split 50-50 lista (otro alcance).

---

## Conclusión para el PM

- Aceptar DT-F9-005 como **cierre de cola F9**: chrome en **una barra horizontal** + mapa **ligeramente** más alto.
- US/CO + spec UX (breakpoint y delta de altura). Frontend. **Sin API Must.**
- QA no corre gates hasta implementación.
