# Matriz de Casos de Prueba: TC-GEO-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** GEO / Explorar radio + Maps  
> **Historia / Contrato:** `US-GEO-01, 02`, `API-GEO-01`, `UF-GEO-01`  
> **Fecha:** 2026-08-14  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 12 |
| Happy path | 3/3 |
| Negativos / edge | 7/7 |
| Seguridad | — |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| TC-GEO-001 | lat+lng default 10 km + distanceKm ASC | Positivo | P1 | geo.spec.ts |
| TC-GEO-002 | radiusKm=5 + verified | Positivo | P1 | geo.spec.ts |
| TC-GEO-003 | lat XOR lng → 400 | Negativo | P1 | geo.spec.ts |
| TC-GEO-004 | radiusKm=30 → 400 | Negativo | P1 | geo.spec.ts |
| TC-GEO-005 | coords CDMX → 400 | Negativo | P1 | geo.spec.ts |
| TC-GEO-006 | radiusKm sin coords → 400 | Negativo | P2 | geo.spec.ts |
| TC-GEO-007 | geo AND q | Positivo | P2 | geo.spec.ts |
| TC-GEO-008 | sin geo no distanceKm | Positivo | P2 | geo.spec.ts |
| HP-GEO-01 | UI slider 1–25 + lista | Positivo | P1 | e2e/explore-geo.spec.ts |
| HP-GEO-01b | Empty radio + Ampliar | Edge Case | P1 | e2e/explore-geo.spec.ts |
| EC-02 | lat sin lng | Edge Case | P1 | TC-GEO-003 |
| EC-08 | Sin Maps key: lista + “Mapa no disponible” | Edge Case | P2 | Pass (8081, key ausente) |

*Matriz Fase 4 — LaBorregaMarket v0.4.0*

**OBS-F4-023 (14/08/2026):** lista geo OK con radio/chips; mapa vacío = fallback EC-08 porque `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` no está en `.env` local. No es regresión de filtros. Sin BUG.
