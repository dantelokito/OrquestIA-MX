# Fase 7 — Explorar mapa-primero + preview + sesión portable (v0.7.1)

| Tipo | Ruta |
|------|------|
| Matrices | [test-matrices/](./test-matrices/) |
| Sign-off / progreso | [QA-F7-signoff.md](./qa-signoffs/QA-F7-signoff.md) (**APROBADO CON CONDICIONES** 24/08) · [QA-F7-progreso.md](./qa-signoffs/QA-F7-progreso.md) |
| Bugs | [BUG-011](./bug-reports/BUG-011.md) · [BUG-012](./bug-reports/BUG-012.md) · [BUG-013](./bug-reports/BUG-013.md) · [BUG-014](./bug-reports/BUG-014.md) — **todos cerrados** |
| Handoff FE | [QA-F7-handoff-frontend.md](./QA-F7-handoff-frontend.md) (cola vacía) |
| Prompts FE | [BUG-012](./activation-prompt-frontend-BUG-012.md) · [BUG-013](./activation-prompt-frontend-BUG-013.md) · [BUG-014](./activation-prompt-frontend-BUG-014.md) · [BUG-011 histórico](./activation-prompt-frontend-BUG-011.txt) |
| Suite viva | [`../tests/`](../tests/) |

## Alcance Must

| Slice | US | Contratos |
|-------|-----|-----------|
| GEO | US-GEO-09 … 16 | API-GEO-01 F7, CO-F7-001 |
| EXPLORE | US-EXPLORE-05, 06 | API-PROVIDER-PREVIEW-01 |
| AUTH | US-AUTH-09 | API-AUTH-01 |
| ADDRESSES | US-GEO-11, 14 | API-ADDRESSES-01 (`/use`, lastUsedAt) |

**Fuera de alcance:** reportes DASH F6, Redis/CI, pagos, pan→radio (revocado).

## Comando focal F7

```bash
npx playwright test \
  tests/api/geo.spec.ts tests/api/addresses.spec.ts tests/api/providers.spec.ts \
  tests/api/auth.spec.ts tests/api/session.spec.ts \
  tests/e2e/explore-f7.spec.ts tests/e2e/explore-geo.spec.ts \
  tests/e2e/explore.spec.ts tests/e2e/auth-login.spec.ts \
  --workers=1
```

Cwd: `outputs/laborregamarket/tests`  
Última corrida: **85/85** Pass (24/08/2026).
