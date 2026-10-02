# Matriz de Casos de Prueba: TC-GEO-matrix (F8)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** GEO Explorar polish — ubicación, radio 0.5–10, mapa México  
> **Historia / Contrato:** US-GEO-17 … 23, API-GEO-01 F8, API-ADDRESSES-01 F8, CO-F8-001, CO-F8-002, CO-F7-001  
> **Fecha:** 2026-08-24  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 22 |
| Happy path | 16 |
| Negativos / edge | 6 |
| Pass / Fail / Blocked / Pendiente | 19 Pass / 0 Fail / 0 / 3 smoke manual |

Set F8: `tests/e2e/explore-f8.spec.ts` + regresión `explore-f7.spec.ts` / `explore-geo.spec.ts` + `api/geo.spec.ts`.

**Supersedidos F7 (no re-ejecutar como Must):** HP-GEO-20 / EC-GEO-20 CompactAddressBar.

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| HP-GEO-17 | LocationChip único en reposo | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-GEO-17b | Panel sheet &lt;md / popover ≥md | Positivo | P1 | e2e/explore-f8.spec.ts | Pass (desktop) |
| HP-GEO-17c | Geocode ≥3 chars; error &lt;3 inline | Negativo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-GEO-18 | Favoritas label + calle; sin select nativo | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-GEO-18b | DELETE favorita activa: pin permanece | Positivo | P1 | manual + API DELETE | Pendiente smoke |
| HP-GEO-19 | Guardar en diálogo in-app (no prompt) | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| HP-GEO-19b | Invitado guardar → login redirect | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| HP-GEO-20-F8 | Copy metros si R&lt;1; chip absorbe Centro | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-GEO-21 | Overlay compacto; extremos 500 m / 10 km; cero 25 km | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-GEO-22 | Slider min 0.5 max 10 step 0.5 | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-GEO-22b | URL clamp 22→10 y 0→0.5 | Edge | P1 | e2e/explore-f8.spec.ts + api/geo | Pass (slider) |
| HP-GEO-22c | Ampliar radio +0.5; oculto en 10 | Positivo | P1 | e2e/explore-f8.spec.ts | Pass |
| TC-GEO-004-F8 | API radiusKm=22/30 → meta 10 | Edge | P1 | api/geo.spec.ts | Pass |
| TC-GEO-004c | API 0.5 / 0.7 / 10 tal cual | Edge | P1 | api/geo.spec.ts | Pass |
| TC-GEO-005-F8 | CDMX lat/lng → 200 | Positivo | P1 | api/geo.spec.ts | Pass |
| TC-GEO-005b | 33.0,-99.0 → 400 isInMexico | Negativo | P1 | api/geo.spec.ts | Pass |
| HP-GEO-23 | Pan no sale de México (maxBounds) | Positivo | P1 | e2e/explore-f8.spec.ts (parcial) | Pendiente visual |
| HP-GEO-23c | URL fuera de MX: banner + no adopta pin | Negativo | P1 | e2e/explore-f8.spec.ts | Pass |
| HP-GEO-10 | Pan/zoom no cambia radio ni GET | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-GEO-09 | Mapa arriba de lista (móvil) | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-GEO-13 | Copy N/R desde meta.total | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| EC-GEO-18 | FilterBar chrome fuera del scroll | Edge | P1 | e2e/explore-f7.spec.ts | Pass |

---

## 1. Casos Positivos (Happy Path)

| ID | Nombre | Prerrequisitos | Resultado esperado | Estado |
|----|--------|----------------|-------------------|--------|
| HP-GEO-17 | Chip único | `/explorar` con pin | Un control `aria-haspopup=dialog` ≥44px; **no** conviven input geocode + select + Guardar en la misma fila | [ ] |
| HP-GEO-17b | Panel | Chip; 360px vs 1280px | Sheet abajo &lt;768; popover anclado ≥768; título «Dónde buscas»; Escape cierra | [ ] |
| HP-GEO-18 | Favoritas | CLIENT con ≥1 dirección | Filas `label` + `formattedAddress`; sin `#favorite-address` | [ ] |
| HP-GEO-19 | Guardar in-app | CLIENT autenticado | Diálogo «Guardar ubicación»; placeholder Casa, Trabajo; no `window.prompt` | [ ] |
| HP-GEO-19b | Invitado | Sin sesión | CTA «Guardar esta ubicación» → `/login?redirect=/explorar` | [ ] |
| HP-GEO-20-F8 | Copy metros | `radiusKm=0.5` | Conteo «N fruterías a 500 m»; sin «Centro:» suelto | [ ] |
| HP-GEO-21 | Overlay | Mapa con pin | Una fila Radio + range + «500 m» / «10 km»; cero «máximo 25 km» | [ ] |
| HP-GEO-22 | Slider | Overlay visible | `min=0.5` `max=10` `step=0.5` | [ ] |
| HP-GEO-22c | Ampliar | Empty con R&lt;10 vs R=10 | +0.5 km; botón **ausente** si ya está en 10 | [ ] |
| HP-GEO-09 | Mapa-primero | Móvil 390px | Mapa `y` &lt; primera card (regresión F7) | [ ] |
| HP-GEO-10 | Pan ≠ radio | Leaflet listo | Cero GET extra; slider y URL iguales (`CO-F7-001`) | [ ] |
| HP-GEO-13 | meta.total | Lista cargada | Copy usa `meta.total` y `formatRadius(meta.radiusKm)` | [ ] |
| TC-GEO-005-F8 | CDMX API | GET lista | `lat=19.43&lng=-99.13` → **200** (AMM revocado) | [ ] |
| HP-GEO-23 | maxBounds | Mapa MX | Viewport no sale del bbox ADR-028; lista/slider no cambian | [ ] |

## 2. Casos Negativos (Unhappy Path)

| ID | Nombre | Input inválido | Error esperado | Estado |
|----|--------|----------------|----------------|--------|
| HP-GEO-17c | Geocode corto | Query 1–2 chars | «Escribe al menos 3 caracteres» **dentro** del panel; no `alert()` | [ ] |
| TC-GEO-005b | Fuera MX | `33.0,-99.0` | HTTP **400**; copy «Ubicación fuera de México». No usar Laredo | [ ] |
| HP-GEO-23c | URL fuera MX | `?lat=33&lng=-99` | Banner fuera de México; centro SN o último pin válido; no GET con esas coords | [ ] |

## 3. Casos Límite (Edge Cases)

| ID | Nombre | Condición límite | Resultado esperado | Estado |
|----|--------|------------------|-------------------|--------|
| HP-GEO-22b | Bookmark viejo | `radiusKm=22` / `=0` | UI+API clamp **10** / **0.5**; 200 no 400 | [ ] |
| TC-GEO-004-F8 | Clamp API | `radiusKm=30` | `meta.radiusKm === 10` | [ ] |
| TC-GEO-004c | Decimal | `0.5` / `0.7` / `10` | 200; valor **sin** `Math.round` (0.7 no es 1) | [ ] |
| HP-GEO-18b | DELETE activa | Borrar last-used | Pin **permanece**; chip = `formattedAddress`; no salta a SN | [ ] |
| EC-GEO-18 | FilterBar chrome | Scroll catálogo | FilterBar no es hijo de `.explore-main-scroll`; LocationChip sí se desplaza | [ ] |

## 4. Casos de Seguridad / Permisos

Cubiertos en [TC-ADDRESSES-matrix.md](./TC-ADDRESSES-matrix.md) (401/403 favoritas). GEO lista es pública.

---

## Referencias upstream

- PM: `US-GEO-17` … `US-GEO-23`, `CO-F8-001`, `CO-F8-002`
- Contratos: Arquitecto `fase-8/api/API-GEO-01.md`, `API-ADDRESSES-01.md`
- Handoff BE: `Agente backend/.../fase-8/handoff-frontend.md`
- Handoff FE: `FEAT-GEO-LOCATION`, `FEAT-GEO-RADIUS`, `FEAT-GEO-MEXICO`

## Notas

- GPS denegado ≠ GPS fuera de México (copy distinto; sin coords crudas).
- ETA / alta proveedor / `clientLat` de pedidos **siguen bbox AMM** — no reabrir esas specs.
- Long-press / maxBounds visual fino: smoke manual Should si el auto es parcial.
