# Fase 7 — Explorar UX + AUTH cross-device (PM)

**Estado:** discovery cerrado 18/08/2026 (v0.7.1). Alcance Dante: IDs 000–011 en `/explorar` + ID012 empty borrega + login desde móvil u otro dispositivo. **Fase 6 congelada.** Pagos fuera hasta nuevo aviso.

**US GEO:** `US-GEO-09` … `US-GEO-16`

**US EXPLORE:** `US-EXPLORE-05`, `US-EXPLORE-06`

**US AUTH:** `US-AUTH-09`

**Change order:** [`CO-F7-001`](./change-orders/CO-F7-001-modelo-radio-mapa.md) (anula D-F6-9: pan ≠ radio)

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
| LAN móvil + smoke AUTH | [NOTA-LAN-MOVIL.md](./NOTA-LAN-MOVIL.md) |

## Qué no hacer aquí

- No escribir en `fase-6/` ni fases anteriores.
- No reabrir DASH, Redis lockfile, CI ni `US-GEO-07` (pan→radio).
- No pasarela, CFDI, PWA, flotilla, Google Maps JS, clustering, bbox Must.
