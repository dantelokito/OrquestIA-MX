# Fase 8 — Explorar polish (PM)

**Estado:** discovery P1–P4 cerrado 24/08/2026 (v0.8.3). F8 se trabaja **por partes**. **Fase 7 solo lectura.** Pagos fuera hasta nuevo aviso.

| Parte | Tema | US |
|-------|------|-----|
| 1 | Chrome de ubicación (`CompactAddressBar`) | `US-GEO-17` … `US-GEO-20` |
| 2 | Overlay radio compacto + rango 500 m–10 km | `US-GEO-21`, `US-GEO-22` |
| 3 | Mapa México + encuadre al círculo | `US-GEO-23` |
| 4 | Preview hover / long-press (sin botón) | `US-EXPLORE-07` |

**Change orders:** [`CO-F8-001`](./change-orders/CO-F8-001-rango-radio.md) · [`CO-F8-002`](./change-orders/CO-F8-002-mapa-mexico.md) · [`CO-F8-003`](./change-orders/CO-F8-003-preview-hover.md).

**Fuera de F8:** FilterBar. Contenido preview = `US-EXPLORE-05` (solo lectura F7).

| Artefacto | Ruta |
|-----------|------|
| PRD | [prd.md](./prd.md) |
| Historias | [user-stories/](./user-stories/) |
| Change orders | [change-orders/](./change-orders/) |
| Handoff UX | [handoff-ux-ui.md](./handoff-ux-ui.md) |
| Handoff Arquitecto | [handoff-arquitecto.md](./handoff-arquitecto.md) |
| Prompt UX | [activation-prompt-ux.txt](./activation-prompt-ux.txt) |
| Prompt Arquitecto | [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) |
| Prompt Frontend | [activation-prompt-frontend.txt](./activation-prompt-frontend.txt) |
| Prompt Backend | [activation-prompt-backend.txt](./activation-prompt-backend.txt) |

## Qué no hacer aquí

- No escribir en `fase-7/` ni fases anteriores.
- No rediseñar FilterBar ni recortar `US-EXPLORE-05`.
- No reabrir DASH, Redis, CI ni `US-GEO-07` (pan→radio).
- No pasarela, CFDI, PWA, flotilla, Google Maps JS, Places, clustering, bbox Must de API, polígono INEGI Must.
