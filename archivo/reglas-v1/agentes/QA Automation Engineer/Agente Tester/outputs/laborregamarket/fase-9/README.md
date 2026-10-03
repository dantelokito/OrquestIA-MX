# Fase 9 — Deuda técnica Explorar (v0.9.0)

| Tipo | Ruta |
|------|------|
| Deuda 1/3 | [deuda-tecnica/DT-F9-001-preview-in-card.md](./deuda-tecnica/DT-F9-001-preview-in-card.md) |
| Deuda 2/3+3/3 | [deuda-tecnica/DT-F9-002-header-explorar-busqueda.md](./deuda-tecnica/DT-F9-002-header-explorar-busqueda.md) |
| Handoff PM | [QA-F9-handoff-pm.md](./QA-F9-handoff-pm.md) |
| Prompt PM 001 | [activation-prompt-pm-DT-F9-001.txt](./activation-prompt-pm-DT-F9-001.txt) |
| Prompt PM 002 | [activation-prompt-pm-DT-F9-002.txt](./activation-prompt-pm-DT-F9-002.txt) |
| Deuda 003 | [deuda-tecnica/DT-F9-003-card-distancia-origen.md](./deuda-tecnica/DT-F9-003-card-distancia-origen.md) |
| Prompt PM 003 | [activation-prompt-pm-DT-F9-003.md](./activation-prompt-pm-DT-F9-003.md) |
| Deuda 004 | [deuda-tecnica/DT-F9-004-filterbar-chips-bloqueados.md](./deuda-tecnica/DT-F9-004-filterbar-chips-bloqueados.md) |
| Prompt PM 004 | [activation-prompt-pm-DT-F9-004.md](./activation-prompt-pm-DT-F9-004.md) |
| Deuda 005 | [deuda-tecnica/DT-F9-005-chrome-barra-mapa.md](./deuda-tecnica/DT-F9-005-chrome-barra-mapa.md) |
| Prompt PM 005 | [activation-prompt-pm-DT-F9-005.md](./activation-prompt-pm-DT-F9-005.md) |
| Progreso | [qa-signoffs/QA-F9-progreso.md](./qa-signoffs/QA-F9-progreso.md) |
| Sign-off | *(pendiente — no hay implementación ni corrida)* |
| Bugs | *(vacío — F9 no abre defectos de producto)* |
| Suite viva | [`../tests/`](../tests/) — **no se parte** en esta sesión |

## Alcance de esta apertura

| Slice | Parte | Estado |
|-------|-------|--------|
| Preview in-card (animación; sustituye popover flotante) | **1/3** | Documentado para PM (`DT-F9-001`) |
| Búsqueda de artículos disponibles (índice interno) + nombre similar de frutería; typeahead solo fruterías; radio completo; chip + tacha | **2/3 + 3/3** | Documentado para PM (`DT-F9-002`) |
| Card: slot `minPrice` → distancia pin→frutería + ETA | Mejora UX | Documentado para PM (`DT-F9-003`) |
| FilterBar: chips bloqueados (Orgánico, Mayoreo, Domicilio, Filtros) | Mejora UX | Documentado para PM (`DT-F9-004`) |
| Chrome una barra horizontal + mapa un poco más alto | Mejora UX | Documentado para PM (`DT-F9-005`) — **último DT F9** |

**Fuera de alcance QA ahora:** código FE/BE, matrices nuevas, specs Playwright, handoff Frontend/Backend.

**Dependencia:** PM acepta DT-F9-001 … DT-F9-005 como mejora F9 (US/CO) antes de asignar UX o Frontend.

F8 permanece cerrada: [QA-F8-signoff.md](../fase-8/qa-signoffs/QA-F8-signoff.md).
