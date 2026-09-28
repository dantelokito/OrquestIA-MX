# Handoff QA → Frontend — LaBorregaMarket F6/F7

> **De:** QA Tester Senior  
> **Para:** @Frontend Developer  
> **Proyecto:** LaBorregaMarket v0.7.1 (código F7; ticket documentado F6)  
> **Fecha:** 19/08/2026  
> **Ambiente:** `http://localhost:8080`  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Estado

Sign-off F6 **EN PROGRESO** — **no APROBADO**. Zero Blocker **FAIL**.

Tu cola: **un ticket Blocker**. Todo lo demás de Explorar F7 (layout mapa-primero, `meta.total`, markers, preview) está implementado; el crash bloquea el módulo entero.

Ticket: [BUG-010](./bug-reports/BUG-010.md) — **Blocker**, P1. Bloquea entrada a `/explorar`, HP-GEO-07 y HP-GEO-08.

Prompt de activación: [activation-prompt-frontend-BUG-010.txt](./activation-prompt-frontend-BUG-010.txt)

---

## Qué falló

**Repro primario (Blocker):** abrir `http://localhost:8080/explorar` → overlay Next:

```
Runtime TypeError: Cannot read properties of undefined (reading 'layerPointToLatLng')
  at FitCircle.useEffect (ExploreMap.tsx:122)
```

El hydrate F7 (`resolveExploreCenter`) siempre deja pin en URL → `FitCircle` corre al montar → crash antes de usar el módulo.

**Repro secundario:** slider `#radius-km` en URL con pin → mismo stack vía `fitToken`.

**Causa raíz:** `L.circle(...).getBounds()` sin `addTo(map)`. `_map` es `undefined`. Usar `L.latLng(pin).toBounds(radiusKm * 1000)` + `map.whenReady()`.

**Intento previo fallido (19/08):** solo se añadieron `dbgLog` / ingest debug (`sessionId: 98ad6d`). **No se corrigió la línea 122.**

---

## Archivos a tocar

| Ruta | Acción |
|------|--------|
| `src/components/explore/ExploreMap.tsx` | `FitCircle`: reemplazar `getBounds()` por `toBounds` + `whenReady`; **eliminar** `dbgLog` y `#region agent log` |
| `src/app/explorar/ExplorePageClient.tsx` | **Eliminar** `dbgLog` y `#region agent log` (instrumentación temporal) |

### Fix quirúrgico (`FitCircle`)

```ts
useEffect(() => {
  if (!pin) return;
  map.whenReady(() => {
    if (map.getSize().x === 0 || map.getSize().y === 0) map.invalidateSize();
    const bounds = L.latLng(pin.lat, pin.lng).toBounds(radiusKm * 1000);
    map.fitBounds(bounds, { padding: [28, 28], animate: false });
  });
}, [map, pin?.lat, pin?.lng, radiusKm, token]);
```

**Prohibido:** `L.circle(...).getBounds()` sin `addTo(map)`; dejar endpoints de debug en producto.

Contrato: **US-GEO-07 / US-GEO-08**, **CO-F7-001**. `API-GEO-01` **sin cambio** (cero backend).

---

## Resultado esperado

- `/explorar` carga sin overlay (smoke Blocker).
- Slider hidrata `radiusKm` en URL; círculo se redimensiona; refetch + loader `BrandLoader` / `[aria-busy=true]` / “Buscando fruterías”.
- Pan/zoom **no** cambian radio ni disparan GET (`CO-F7-001`).
- Sin regiones `agent log` ni `fetch` a `127.0.0.1:7481`.

---

## No tocar

- PDF / `reports.pdf` (BUG-009 es Backend)
- UI Reportes, preview vitrina, login cross-device
- Invariante Leaflet F5 (HP-GEO-04/05)
- `resolveExploreCenter`, clamp 1–25, query `lat`/`lng`/`radiusKm`
- Reintroducir pan→radio ni bbox (`CO-F7-001`)

---

## DoD de re-prueba QA

Cuando `/explorar` cargue sin crash y el slider hidrate URL, avisar a QA.

**Smoke manual:** `http://localhost:8080/explorar` — sin overlay.

**Automatizado:**

```bash
cd "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Agentes de desarrollo test\QA Automation Engineer\Agente Tester\outputs\laborregamarket\tests"
PLAYWRIGHT_BASE_URL=http://localhost:8080 npx playwright test tests/e2e/explore-geo.spec.ts -g "HP-GEO-07|HP-GEO-08" --workers=1
```

Criterio de cierre BUG-010: smoke `/explorar` Pass + HP-GEO-07 y HP-GEO-08 Pass (HP-GEO-07b no debe regresar). No se firma F6 hasta que Backend cierre también BUG-009.
