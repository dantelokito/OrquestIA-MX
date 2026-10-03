# Matriz de Casos de Prueba: TC-GEO-matrix (F6)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** GEO zoom ↔ radio + loader  
> **Historia / Contrato:** `US-GEO-06`, `US-GEO-07`, `US-GEO-08`, `API-GEO-01` nota F6, `CO-F6-002`  
> **Fecha:** 2026-08-17  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 10 |
| Happy path ejecutados | 5/6 (HP-GEO-07 Fail BUG-010) |
| Negativos / edge ejecutados | 2/4 (clamp exploratorio; TC-GEO-004 no en este set) |
| Pass / Fail / Blocked | 7 / 2 / 1 |

Set F6 E2E: `tests/e2e/explore-geo.spec.ts` (incluye regresión F4/F5).

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| HP-GEO-06 | Leaflet/OSM invariante F5 | Positivo | P1 | e2e/explore-geo.spec.ts (HP-GEO-04) | Pass |
| HP-GEO-07 | Círculo + slider → radiusKm URL | Positivo | P1 | e2e/explore-geo.spec.ts | **Fail** BUG-010 |
| HP-GEO-07b | Radio 25 km tope query | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| HP-GEO-08 | Loader / aria-busy en refetch | Positivo | P1 | e2e/explore-geo.spec.ts | **Fail** BUG-010 |
| TC-GEO-001 | Haversine F4 sin bbox | Positivo | P1 | api/geo.spec.ts | Fuera de este set |
| TC-GEO-004 | radiusKm=30 → 400 | Negativo | P1 | api/geo.spec.ts | Fuera de este set |
| EC-GEO-CLAMP | Hint Máximo 25 km (viewport) | Edge | P2 | exploratorio | No auto |
| EC-F5-08 | Teselas caídas | Edge | P1 | e2e/explore-geo.spec.ts | Pass |
| HP-GEO-01 | Radio/lista slider F4 | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| EC-GEO-ERR | Error red: lista previa | Edge | P2 | no auto (Should) | No auto |

---

## 1. Positivos

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| HP-GEO-07 | Sync slider/URL | pin MTY | círculo Leaflet; URL radiusKm | Fail — crash `FitCircle` `layerPointToLatLng`; URL queda `radiusKm=10` (BUG-010) |
| HP-GEO-08 | Loader borrega | debounce refetch | “Buscando fruterías” / aria-busy; mapa visible | Fail — bloqueado por BUG-010 (slider no dispara refetch) |

---

## 2. Negativos / edge

| ID | Nombre | Condición | Resultado esperado | Estado |
|----|--------|-----------|-------------------|--------|
| TC-GEO-004 | radius 30 | query | 400 (contrato F4 intacto) | No corrido en set F6 |
| EC-GEO-CLAMP | zoom extremo | min borde > 25 | hint no bloqueante; GET radiusKm=25 | No auto |

---

## Referencias

- Arquitecto `fase-6/api/API-GEO-01.md` — **cero cambio de query**.
- Círculo siempre visible si hay coords.

## Notas

- Hint “Máximo 25 km” aparece cuando el radio **derivado del viewport** se clampa, no solo al poner el slider en 25.
- Query `radiusKm=25` (HP-GEO-07b) Pass: el mapa carga; el crash es al incrementar `fitToken` desde el slider.
