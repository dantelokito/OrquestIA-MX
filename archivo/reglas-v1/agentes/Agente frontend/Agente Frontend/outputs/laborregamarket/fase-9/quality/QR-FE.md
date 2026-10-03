# QR-FE — Informe de calidad Frontend Fase 9

> **Proyecto:** LaBorregaMarket  
> **Fase:** 9 — Deuda Explorar (v0.9.0)  
> **Fecha:** 2026-08-25  
> **Agente:** Frontend Developer  
> **Destinatario:** UX/UI Designer (Quality Gate)

Autoevaluación 10 criterios × 10 puntos. Umbral líder: **≥80%** y **0 P0**.

---

## Rúbrica

| # | Criterio | Puntos | Notas |
|---|----------|--------|-------|
| 1 | Fidelidad wireframes F9 | 9 | Preview in-card; typeahead cover+nombre; distancia+ETA; chips Mayoreo/Domicilio; chrome una barra `md+`; mapa 420 / min(520,52vh). |
| 2 | `CO-F7-001` + F8 geo | 10 | Pan ≠ radio; clamp 0.5–10; México bounds; LocationChip/RadiusOverlay intactos. |
| 3 | FilterBarF9 (US-11) | 10 | Sin Orgánico/«Filtros»; Mayoreo/Domicilio → URL `true` only; empty + Limpiar. |
| 4 | Card distancia (US-10) | 10 | Sin minPrice visual; copy km/m + ETA pie/auto; barra Should. |
| 5 | Typeahead (US-09) | 9 | Debounce 300; `limit=10` mismo GET; sin `/suggest`; sin pin no inventa; clear limpia chips. |
| 6 | Preview in-card (US-08) | 9 | Expansión dentro del card; delays 300/150/500; Eye «Vista previa»; sin popover desanclado. |
| 7 | Chrome + mapa (US-24) | 9 | Una fila `md+`; errores debajo; mapa tokens F9; overlay radio usable. |
| 8 | Copy canónico F9 | 9 | Distancia/ETA/typeahead/empty chips; sin afirmar flags falsos. |
| 9 | Accesibilidad WCAG AA basal | 8 | ≥44px; listbox; Escape; `aria-pressed`/`aria-expanded`; reduced-motion. Sin auditoría lector real. |
| 10 | Código modular y tests | 9 | Helpers `explore-distance`; 50 archivos / **242 tests** verde; `next build` limpio. |

**Total: 92 / 100**

---

## P0 / P1

Ningún P0.

- **P1:** sin Testing Library para hover/typeahead (paridad F8).
- **P1:** `ProviderPreviewPopover` legado no montado (candidato a borrar en cleanup).
- Residual Won't: SKUs typeahead, orgánico, Places, Maps JS, clustering, pasarela, DASH.

---

## Prompt para UX

Revisar implementación F9 en `LaBorregaMarket` (`/explorar`) contra `fase-9/handoff-frontend-fase-9.md` y WF P1–P5. Emitir Quality Gate (rúbrica 10×10, umbral 80%, 0 P0).

Handoffs FE: `fase-9/feature-handoffs/FEAT-FILTERBAR-handoff.md`, `FEAT-CARD-DISTANCE-handoff.md`, `FEAT-CHROME-MAP-handoff.md`, `FEAT-TYPEAHEAD-handoff.md`, `FEAT-PREVIEW-INCARD-handoff.md`.

**No invocar QA** hasta `READY-FOR-QA.md` de UX + Arquitecto.
