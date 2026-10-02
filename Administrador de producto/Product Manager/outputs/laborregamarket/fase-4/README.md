# Fase 4 — Reseñas, Geo, Notify-scale, Admin analytics, POS báscula (PM)

**Estado:** discovery cerrado 14/08/2026. Alcance ajustado y validado con Dante sobre la visión publicada previamente. **Sin código todavía** — pendiente diseño UX y contratos de Arquitecto.

**US:** `US-REV-01` … `04`, `US-GEO-01` … `03`, `US-NOTIFY-06` … `09`, `US-ADMIN-01`, `US-POS-05` … `06`, `US-ORDERS-05` (Should)

| Artefacto | Ruta |
|-----------|------|
| PRD | [prd.md](./prd.md) |
| Historias | [user-stories/](./user-stories/) |
| Handoff UX | [handoff-ux-ui.md](./handoff-ux-ui.md) |
| Handoff Arquitecto | [handoff-arquitecto.md](./handoff-arquitecto.md) |
| Prompt activación UX | [activation-prompt-ux.txt](./activation-prompt-ux.txt) |
| Prompt activación Arquitecto | [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) |

## Qué no hacer aquí

- No implementar pasarela, CFDI, PWA instalable ni logística de reparto real.
- No importar reseñas de Google vía Places API — solo enlace/embed.
- No arrancar delivery (US-ORDERS-05, Should) antes de cerrar GEO (US-GEO-*).

## Siguiente paso

Pegar `activation-prompt-ux.txt` y `activation-prompt-arquitecto.txt` en chats nuevos de esos agentes para producir flujos/wireframes y ADRs + contratos de API antes de tocar código en `LaBorregaMarket`.
