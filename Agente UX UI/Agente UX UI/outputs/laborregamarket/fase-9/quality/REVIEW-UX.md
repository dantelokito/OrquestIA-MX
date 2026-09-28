# REVIEW-UX — Quality Gate Frontend Fase 9

> **Proyecto:** LaBorregaMarket  
> **Fase:** 9 — Deuda Explorar (v0.9.0)  
> **Fecha:** 28/08/2026  
> **Agente:** UX/UI Designer  
> **Solicitud auditada:** `Agente frontend/.../fase-9/quality/QR-FE.md` (Frontend, 92/100)  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket\src`  
> **Veredicto:** **APROBADO CON OBSERVACIONES**  
> **Puntaje:** 88 / 100 · **0 P0** · 2 P1 · 4 P2

No se copia el auto-score de QR-FE (92/100). Esta auditoría es independiente contra UF/WF de `fase-9/` + `comun/` v0.9.0.

---

## Alcance auditado

| Ruta | Archivo principal | Wireframe |
|------|-------------------|-----------|
| `/explorar` | `ExplorePageClient.tsx`, `FilterBar.tsx`, `LocationBar.tsx`, `ExploreMap.tsx` | `WF-explorar-chrome-mapa.md`, `WF-explorar-filterbar-chips.md` |
| Header `/explorar` | `Header.tsx`, `ExploreTypeahead.tsx` | `WF-explorar-typeahead.md` |
| Cards lista | `ProviderCard.tsx`, `ProviderPreviewInCard.tsx` | `WF-explorar-preview-in-card.md`, `WF-explorar-card-distancia.md` |
| Helpers | `lib/ui/explore-distance.ts`, `lib/maps/preview-delays.ts` | tokens §6h |

**Referencias de diseño:** [`handoff-frontend-fase-9.md`](../handoff-frontend-fase-9.md), [`user-flows/`](../user-flows/), [`wireframes/`](../wireframes/), [`comun/design-tokens.md`](../../comun/design-tokens.md) v0.9.0.

QR-FE: `Agente frontend/.../fase-9/quality/QR-FE.md`. Handoffs FE: `FEAT-FILTERBAR`, `FEAT-CARD-DISTANCE`, `FEAT-CHROME-MAP`, `FEAT-TYPEAHEAD`, `FEAT-PREVIEW-INCARD`. Contratos: Arquitecto `API-GEO-01`, `API-PROVIDER-PREVIEW-01`, `API-EXPLORE-NOTES-01`.

---

## Rúbrica (10 × 10)

| # | Criterio | Pts | Nota |
|---|----------|-----|------|
| 1 | Fidelidad WF F9 P1–P5 | 9 | In-card, typeahead, distancia+ETA, chips, chrome+mapa implementados. Preview cubre card completa (`absolute inset-0`) — válido in-card; layout difiere levemente del ASCII (expansión bajo cover). |
| 2 | `CO-F7-001` + invariantes F8 | 10 | Pan ≠ radio; clamp 0.5–10; `MEXICO_BOUNDS`; LocationChip/panel y RadiusOverlayF8 intactos. |
| 3 | US-EXPLORE-11 FilterBar | 10 | `FILTER_CHIPS` sin Orgánico ni «Filtros»; Mayoreo/Domicilio → URL `offersWholesale`/`offersDelivery`; empty AND + Limpiar. |
| 4 | US-EXPLORE-10 card | 10 | Sin `minPrice` visual; `formatSearchDistance` + `formatCardEta`; barra Should `distanceRatio`. |
| 5 | US-EXPLORE-09 typeahead | 9 | Debounce 300 ms; `limit=10` mismo GET; sin `/suggest`; tacha limpia chips; chip «Filtro: {q}» debajo de barra. Ranking nombre Should omitido. |
| 6 | US-EXPLORE-08 preview | 9 | `ProviderPreviewInCard` dentro del shell; delays 300/150/500; contenido `ProviderPreviewContent` = US-EXPLORE-05; popover legado no montado. |
| 7 | US-GEO-24 chrome | 9 | Una fila `md+` (`FilterBar compact` + LocationBar inline + count); errores debajo; mapa `420px` / `min(520px,52vh)` en CSS y TSX. |
| 8 | Copy canónico F9 | 9 | Distancia, ETA, typeahead, empty chips, hint 2 chars, sin pin. Flags no afirmados en preview. |
| 9 | Accesibilidad WCAG AA basal | 8 | Chips `aria-pressed` ≥44px; typeahead `listbox`/`combobox`; reduced-motion en delays y barra. Barra ratio `aria-hidden`; foco auto en Cerrar al abrir preview (P2). |
| 10 | Regresiones F7/F8 | 9 | Heart/ContactCTA; tap corto = detalle; horario/catálogo/3 reseñas en preview; sign-off F8 geo no regresionado. |
| | **Total** | **88** | Umbral 80% |

---

## Hallazgos

### OBS-UX-F9-001 (P1) — `ProviderPreviewPopover.tsx` legado sin uso

El popover desanclado F8 sigue en el repo pero **no se monta** en `/explorar`. Cumple el Must F9 (in-card), pero deja deuda de cleanup que confunde auditorías futuras.

**Acción:** eliminar o marcar `@deprecated` + quitar imports muertos en cleanup FE.

### OBS-UX-F9-002 (P1) — Sin tests RTL de hover / typeahead

Paridad F8: no hay Testing Library para delays de preview ni listbox del typeahead. Los 242 tests unitarios cubren helpers (`explore-distance`, API) pero no interacción hover/long-press.

**Acción:** backlog cercano; no bloquea QA manual de US-EXPLORE-08/09.

### OBS-UX-F9-003 (P2) — Foco salta a «Cerrar» al abrir preview

`ProviderPreviewInCard.tsx`: `closeRef.current?.focus()` en mount. Al abrir por hover desktop el foco puede saltar al botón Cerrar sin intención de teclado.

**Acción:** enfocar solo si apertura vía teclado (`Alt+Enter` / Eye); hover no mueve foco.

### OBS-UX-F9-004 (P2) — Barra distancia Should sin `role="meter"`

`ProviderCard.tsx`: barra proporcional con `role="presentation" aria-hidden`. Tokens F9 Should permiten `role="meter"` + valuetext.

**Acción:** opcional — añadir `role="meter"` + `aria-valuetext` con distancia/radio.

### OBS-UX-F9-005 (P2) — Ranking typeahead por similitud de nombre (Should)

`ExploreTypeahead.tsx` muestra resultados en orden API. Arch `API-GEO-01` marca priorizar `businessName` que empieza por `q` como Should FE.

**Acción:** backlog Should; no Must.

### OBS-UX-F9-006 (P2) — Chip «Filtro: {q}» debajo de barra, no en header

DoD US-EXPLORE-09 pide aviso ligero en barra — cumplido en `ExplorePageClient` debajo del chrome. El header solo tiene input+tacha; aceptable.

**Acción:** ninguna Must.

---

## Cumplimiento DoD F9 (resumen)

| US | Resultado |
|----|-----------|
| US-EXPLORE-08 Preview in-card | OK — expansión dentro del card; sin popover desanclado |
| US-EXPLORE-09 Typeahead | OK — solo fruterías; `limit=10`; corpus servidor; tacha limpia |
| US-EXPLORE-10 Distancia + ETA | OK — sin minPrice visual; copy + barra Should |
| US-EXPLORE-11 Chips | OK — Mayoreo/Domicilio ON; Orgánico/Filtros ausentes |
| US-GEO-24 Chrome + mapa | OK — barra `md+`; mapa +10–20%; errores debajo |
| CO-F7-001 pan ≠ radio | OK |
| F8 LocationChip / clamp / México | OK — no regresión |
| US-EXPLORE-05 contenido preview | OK — no recortado |

---

## Veredicto

**APROBADO CON OBSERVACIONES** — La implementación F9 cumple el umbral (88%) sin P0. Los cinco deltas de `/explorar` están cubiertos; sign-off F8 geo permanece intacto. P1 = cleanup popover legado + tests RTL; no impiden habilitar QA.

**QA Tester:** contactar vía [`READY-FOR-QA.md`](./READY-FOR-QA.md). **Condición PM:** Arquitecto debe emitir `REVIEW-ARCH` F9 antes del sign-off QA final.

---

*Dictamen UX/UI — LaBorregaMarket v0.9.0 — 28/08/2026.*
