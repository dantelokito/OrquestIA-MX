# QA Progreso: QA-F8-progreso

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 8 — Explorar polish (v0.8.3)  
> **Ambiente evaluado:** `http://127.0.0.1:8080`  
> **Fecha:** 2026-08-24  
> **Evaluado por:** Agente QA / Tester Senior

---

## Estado

| Gate | Estado |
|------|--------|
| Zero Blocker | **PASS** — sin Blocker/Critical abiertos |
| Happy path Must | **PASS** (set auto) |
| Regresión focal F8 | **PASS** **76/76** (24/08) |
| Dictamen | **APROBADO CON CONDICIONES** — [QA-F8-signoff.md](./QA-F8-signoff.md) |

## Bugs vivos F8

Ninguno.

## Métricas

| Métrica | Objetivo | Resultado |
|---------|----------|-----------|
| Suite focal pass | 100% | **76/76** |
| Matrices diseñadas | GEO / EXPLORE / ADDRESSES | Sí |

## Comando de re-run

```bash
npx playwright test tests/api/geo.spec.ts tests/api/addresses.spec.ts tests/api/providers.spec.ts tests/e2e/explore-f8.spec.ts tests/e2e/explore-f7.spec.ts tests/e2e/explore-geo.spec.ts tests/e2e/explore.spec.ts --workers=1
```

**Cwd:** `outputs/laborregamarket/tests`  
**Base URL:** `http://127.0.0.1:8080`

## Siguiente paso

Fase 8 firmada con condiciones de smoke (long-press/marker, DELETE pin, QG UX). Condición residual F7: EC-AUTH-09 en móvil real.
