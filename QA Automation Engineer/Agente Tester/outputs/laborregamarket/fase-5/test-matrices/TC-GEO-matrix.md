# Matriz de Casos de Prueba: TC-GEO-matrix

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** GEO Leaflet/OSM + layout Explorar  
> **Historia / Contrato:** `US-GEO-04, US-GEO-05`, `API-GEO-01` F5, `UF-GEO-01`, `WF-explorar-leaflet`  
> **Fecha:** 2026-08-15  
> **Ambiente:** `http://127.0.0.1:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 12 |
| Happy path ejecutados | 8/8 |
| Negativos / edge ejecutados | 4/4 |
| Seguridad ejecutados | — |

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto |
|----|--------|------|-----------|------|
| HP-GEO-04 | Leaflet sin `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Positivo | P1 | e2e/explore-geo.spec.ts |
| HP-GEO-04b | Attribution OSM visible; lista usable | Positivo | P1 | e2e/explore-geo.spec.ts |
| HP-GEO-04c | No aparece “Mapa no disponible” (cierra OBS-F4-023) | Positivo | P1 | e2e/explore-geo.spec.ts |
| HP-GEO-05 | CTA Usar mi ubicación en banner (no en el mapa) | Positivo | P1 | e2e/explore-geo.spec.ts |
| HP-GEO-05b | Slider 1–25 km default 10 al pie del mapa | Positivo | P1 | e2e/explore-geo.spec.ts |
| TC-GEO-001 | lat+lng default 10 km + distanceKm ASC | Positivo | P1 | geo.spec.ts |
| TC-GEO-004 | radiusKm=30 → 400 (EC-F5-09) | Negativo | P1 | geo.spec.ts |
| EC-F5-08 | Teselas OSM abortadas: banner + lista usable | Edge Case | P1 | e2e/explore-geo.spec.ts |
| EC-GEO-DENY | Geolocalización denegada: lista no se vacía | Edge Case | P1 | e2e/explore-geo.spec.ts |
| HP-GEO-01 | Radio, lista y slider (regresión F4) | Positivo | P1 | e2e/explore-geo.spec.ts |
| HP-GEO-01b | Empty radio + Ampliar | Edge Case | P1 | e2e/explore-geo.spec.ts |
| HP-REG-GEO | Favoritas / q / verified no regresionan | Positivo | P1 | e2e/explore-geo.spec.ts + geo.spec.ts |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| HP-GEO-04 | Leaflet sin Google key | `/explorar` | Teselas OSM; markers = lista; no empty F4 | Pass |
| HP-GEO-04b | Attribution OSM | `/explorar` | `© OpenStreetMap contributors` visible | Pass |
| HP-GEO-05 | CTA en banner | FilterBar | Botón fuera de `.leaflet-container`; ≥44px | Pass |
| HP-GEO-05b | Slider al pie | mapa cargado | `#radius-km` min=1 max=25; overlay inferior | Pass |
| TC-GEO-001 | Haversine F4 | coords MTY | `meta.radiusKm=10`; `distanceKm` ASC | Pass |

---

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| TC-GEO-004 | radiusKm=30 | query F4 | HTTP 400 | Pass |

---

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| EC-F5-08 | Teselas caídas | abort tile OSM | Banner “El mapa no cargó; usa la lista”; lista usable | Pass |
| EC-GEO-DENY | Permiso denegado | click CTA sin permiso | Lista no vacía; hint no bloqueante | Pass |
| HP-GEO-01b | Radio lejos | pin FAR + 1 km | Empty + Ampliar radio | Pass |

---

## Referencias upstream

- ACs: `US-GEO-04`, `US-GEO-05`, `CO-F5-001`
- Contrato: Arquitecto `fase-5/api/API-GEO-01.md`
- Handoff FE: `FEAT-GEO-handoff.md`

---

## Notas

- Query Haversine **sin delta** Must. Clustering / bbox API = fuera de alcance.
- Invertir EC-08 F4: “Mapa no disponible” por falta de key **prohibido**.

*Matriz Fase 5 — LaBorregaMarket v0.5.0*
