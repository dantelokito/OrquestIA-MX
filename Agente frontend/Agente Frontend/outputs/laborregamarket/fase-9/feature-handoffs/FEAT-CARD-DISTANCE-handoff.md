# Handoff de Feature: FEAT-CARD-DISTANCE

> **Proyecto:** laborregamarket  
> **Feature:** EXPLORE / ProviderCardDistance + ETA  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-25  
> **Wireframe:** `WF-explorar-card-distancia`  
> **Contrato:** `API-EXPLORE-NOTES-01` (sin API Must)  
> **US:** US-EXPLORE-10

---

## 1. Pantallas y componentes implementados

| Pantalla | Ruta | Estado |
|----------|------|--------|
| Card distancia + ETA | `/explorar` | OK |

**Componentes / helpers:**

| Pieza | Ubicación |
|-------|-----------|
| `ProviderCard` | `src/components/explore/ProviderCard.tsx` — sin `minPrice` visual |
| `explore-distance` | `src/lib/ui/explore-distance.ts` — copy + ETA + ratio |

---

## 2. Integración API

Sin endpoint nuevo. Usa `distanceKm` del listing. ETA client-side ADR-017 / pie 5 km/h &lt; 15 min.

---

## 3. Estados UI

| Sin pin | Con pin + distanceKm |
|---------|----------------------|
| Copy «Elige una ubicación…» | «A X km/m de tu búsqueda» + ETA + barra Should |

---

## 4–7. DoD

- [x] Sin «$X MXN desde» / Consultar precios
- [x] Una fila distancia (+ ETA); sin km gris duplicado
- [x] Barra ratio `distanceKm / radiusKm`
- [x] Tests `tests/unit/explore-distance.test.ts`
