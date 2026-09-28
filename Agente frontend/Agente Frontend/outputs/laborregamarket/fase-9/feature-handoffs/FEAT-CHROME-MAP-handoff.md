# Handoff de Feature: FEAT-CHROME-MAP

> **Proyecto:** laborregamarket  
> **Feature:** EXPLORE / ExploreChromeF9 + mapa  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-25  
> **Wireframe:** `WF-explorar-chrome-mapa`  
> **Contrato:** `API-EXPLORE-NOTES-01`  
> **US:** US-GEO-24

---

## 1. Implementado

| Pieza | Ubicación | Notas |
|-------|-----------|-------|
| Chrome una barra `md+` | `ExplorePageClient.tsx` | Chips + GPS + LocationChip + ExploreCount |
| Errores debajo | mismo | geo denegado, fuera MX, hint 2 chars, chip «Filtro: q» |
| Mapa móvil | `globals.css` `--explore-map-min-h-mobile: 420px` | |
| Mapa desktop | `md:h-[min(520px,52vh)]` | |

LocationChip / RadiusOverlay / México / `CO-F7-001` intactos.

---

## 2. DoD

- [x] Una barra en desktop; móvil wrap + collapse chips
- [x] Mapa +10–20% vs F8 (360→420; 440/45vh → 520/52vh)
- [x] Overlay radio usable
- [x] Sin regresión BUG-012/013 / pan≠radio
