# Fase 6 — Confiabilidad + reportes + GEO zoom↔radio (v0.6.1)

| Tipo | Ruta |
|------|------|
| Matrices | [test-matrices/](./test-matrices/) |
| Bug reports | [bug-reports/](./bug-reports/) |
| Sign-off | [qa-signoffs/](./qa-signoffs/) |
| Handoff Backend | [QA-F6-handoff-backend.md](./QA-F6-handoff-backend.md) — BUG-009 |
| Handoff Frontend | [QA-F6-handoff-frontend.md](./QA-F6-handoff-frontend.md) — **BUG-010 Blocker** |
| Prompt FE | [activation-prompt-frontend-BUG-010.txt](./activation-prompt-frontend-BUG-010.txt) |
| Prompt BE | [activation-prompt-backend-BUG-010.txt](./activation-prompt-backend-BUG-010.txt) |

## Alcance

| Slice | US | Contratos | Happy path |
|-------|-----|-----------|------------|
| A Deuda | US-NOTIFY-10, US-OPS-04/05, US-GEO-06, US-BRAND-03 | contacto 503 fail-closed | HP-NOT-10 |
| B Reportes | US-DASH-04/05/06 | API-PROVIDER-REPORTS-01 / PDF-01 | HP-DASH-04/05/06 |
| C GEO | US-GEO-07/08 | API-GEO-01 nota F6 (cero BE) | HP-GEO-07/08 |

**Fuera de alcance:** pasarela, CFDI, PWA, flotilla, clustering, bbox Must, CSV, email del reporte.

Pagos siguen Won't (`CO-F6-001`). Suite Playwright viva: `../tests/`.

**Corrida 17/08 ~01:25:** 49/53 pass.

**Escalado 19/08:** [BUG-010](./bug-reports/BUG-010.md) → **Blocker** (crash al entrar a `/explorar`; `FitCircle` `getBounds()` sin mapa). [BUG-009](./bug-reports/BUG-009.md) PDF 500 (BE). Sign-off: [QA-F6-progreso](./qa-signoffs/QA-F6-progreso.md) — **no APROBADO**, Zero Blocker **FAIL**.
