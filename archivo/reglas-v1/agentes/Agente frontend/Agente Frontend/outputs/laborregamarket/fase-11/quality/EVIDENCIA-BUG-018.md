# Evidencia de fix — BUG-018

> **Proyecto:** laborregamarket  
> **Fase:** 11  
> **Fecha:** 2026-09-12  
> **Agente:** Frontend Developer  
> **Bug QA:** `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-11/bug-reports/BUG-018.md`  
> **Estado:** Corregido en código (pendiente re-prueba QA)

## Inputs Utilizados

- Handoff QA: `fase-11/QA-F11-handoff-frontend.md`
- US-EXPLORE-11, API-EXPLORE-11
- Spec E2E `TC-F11-103`: `gotoGeo(25.6714, -100.3089, 25)` y textos «Frutas El Paraíso» / «El Paraíso Tecnológico»

## Causa raíz

Al hidratar Explorar, el centro se resolvía con `useSearchParams` del primer render (a veces **sin** `lat`/`lng`) y `resolveExploreCenter` caía a San Nicolás (25.7475, −100.283) + 10 km. `router.replace` **pisaba** la URL de QA.

Además, si `source === "url"` se asignaba `selectedAddressId` a la primera favorita o el chip default **«San Nicolás»**, aunque el pin fuera Monterrey centro. Con radio efectivo 10 km desde San Nicolás, **El Paraíso Tecnológico** (~11 km) queda fuera del filtro; las cards Must no aparecen.

El clamp FE/BE 0.5–10 km (CO-F8-001) se mantiene: `radiusKm=25` en URL sigue acotado a 10. El Must se cumple honrando **lat/lng**.

## Archivos tocados (repo app `C:\Users\PC GAMER\LaBorregaMarket`)

| Archivo | Cambio |
|---------|--------|
| `src/app/explorar/ExplorePageClient.tsx` | Lee `window.location.search`; no reemplaza URL si ya hay pin; no selecciona favorita sobre pin URL; chip fallback por coordenadas |
| `src/lib/maps/explore-center.ts` | `exploreChipFallbackLabel` |
| `tests/unit/explore-center.test.ts` | Pin Monterrey ≠ etiqueta San Nicolás |

## Diff / commit

No hay commit (no solicitado). `git diff --stat` (parcial):

```text
 src/app/explorar/ExplorePageClient.tsx | 24 ++++++++++++++++++------
 src/lib/maps/explore-center.ts         |  8 ++++++++
 tests/unit/explore-center.test.ts      |  9 ++++++++-
```

HEAD app: `1132d3a`.

## Cómo se re-probó en local

```text
cwd: C:\Users\PC GAMER\LaBorregaMarket
npx vitest run tests/unit/explore-center.test.ts tests/unit/explore-f8.test.ts
```

Resultado: **10/10 pass** (7 explore-center + 3 explore-f8). Clamp 10 km intacto.

No hay browser en esta sesión. QA:

```text
npx playwright test tests/e2e/f11-multi-provider.spec.ts -g TC-F11-103
```

URL: `http://127.0.0.1:8080/explorar?lat=25.6714&lng=-100.3089&radiusKm=25` — no debe reescribir el centro a San Nicolás; ambas cards El Paraíso visibles en el listado.

## Outputs Generados

- **Archivo:** `fase-11/quality/EVIDENCIA-BUG-018.md`
- **Agente Downstream:** QA Tester
