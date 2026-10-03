# Fase 9 — Deuda técnica Explorar (PM)

**Estado:** discovery cerrado 25/08/2026 (v0.9.0). Paquete único DT-F9-001…005. **Fase 8 solo lectura.** Pagos fuera hasta nuevo aviso.

| DT QA | US | Tema |
|-------|-----|------|
| DT-F9-001 | `US-EXPLORE-08` | Preview in-card (animación; mismos triggers F8) |
| DT-F9-002 | `US-EXPLORE-09` | Header typeahead solo fruterías; radio completo; chip + tacha |
| DT-F9-003 | `US-EXPLORE-10` | Card: distancia pin→frutería + ETA (sin `minPrice` visual) |
| DT-F9-004 | `US-EXPLORE-11` | Mayoreo/Domicilio filtran; Orgánico y «Filtros» retirados |
| DT-F9-005 | `US-GEO-24` | Chrome una barra horizontal + mapa ~+10–20% |

**Change order:** [`CO-F9-001`](./change-orders/CO-F9-001-deuda-explorar.md).

**Fuentes QA (solo lectura):** `Agente Tester/.../fase-9/deuda-tecnica/` + `QA-F9-handoff-pm.md`.

| Artefacto | Ruta |
|-----------|------|
| PRD | [prd.md](./prd.md) |
| Historias | [user-stories/](./user-stories/) |
| Change order | [change-orders/CO-F9-001-deuda-explorar.md](./change-orders/CO-F9-001-deuda-explorar.md) |
| Handoff UX | [handoff-ux-ui.md](./handoff-ux-ui.md) |
| Handoff Arquitecto | [handoff-arquitecto.md](./handoff-arquitecto.md) |
| Prompt UX | [activation-prompt-ux.txt](./activation-prompt-ux.txt) |
| Prompt Arquitecto | [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) |
| Prompt Frontend | [activation-prompt-frontend.txt](./activation-prompt-frontend.txt) |
| Prompt Backend | [activation-prompt-backend.txt](./activation-prompt-backend.txt) |

## Qué no hacer aquí

- No escribir en `fase-8/` ni fases anteriores.
- No reabrir sign-off QA F8 ni US F7/F8.
- No esquema orgánico; no chip «Filtros» stub; no typeahead de SKUs.
- No pintar `sampleProducts` en card.
- No reabrir DASH, Redis, CI, pan→radio, Maps JS, Places, clustering, `BL-040`.
