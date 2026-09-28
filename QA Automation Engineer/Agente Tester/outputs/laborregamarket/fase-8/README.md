# Fase 8 — Explorar polish (v0.8.3)

| Tipo | Ruta |
|------|------|
| Matrices | [test-matrices/](./test-matrices/) |
| Sign-off / progreso | [QA-F8-signoff.md](./qa-signoffs/QA-F8-signoff.md) (**APROBADO CON CONDICIONES** 24/08) · [QA-F8-progreso.md](./qa-signoffs/QA-F8-progreso.md) |
| Bugs | *(vacío hasta el primer defecto)* |
| Suite viva | [`../tests/`](../tests/) |

## Alcance Must

| Slice | US | Contratos |
|-------|-----|-----------|
| Ubicación | US-GEO-17 … 20 | API-ADDRESSES-01 F8 (sin ruta nueva) |
| Radio | US-GEO-21, US-GEO-22 | API-GEO-01 F8 · `CO-F8-001` |
| Mapa México | US-GEO-23 | API-GEO-01 F8 · ADR-028 · `CO-F8-002` |
| Preview | US-EXPLORE-07 | API-PROVIDER-PREVIEW-01 (mismo GET F7) · `CO-F8-003` |

`CO-F7-001` intacto: pan/zoom **no** derivan `radiusKm` ni disparan GET.

**Fuera de alcance:** FilterBar nuevo, recorte `US-EXPLORE-05`, AUTH-09, DASH/PDF, Redis/CI, pagos, Places, Maps JS, clustering, bbox Must de lista, pan→radio.

## Comando focal F8

```bash
npx playwright test \
  tests/api/geo.spec.ts tests/api/addresses.spec.ts tests/api/providers.spec.ts \
  tests/e2e/explore-f8.spec.ts tests/e2e/explore-f7.spec.ts \
  tests/e2e/explore-geo.spec.ts tests/e2e/explore.spec.ts \
  --workers=1
```

Cwd: `outputs/laborregamarket/tests`  
Base URL: `http://127.0.0.1:8080`  
Última corrida: **76/76** Pass (24/08/2026).
