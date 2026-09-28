# Matriz de Casos de Prueba: TC-GEO-matrix (F7)

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** GEO mapa-primero, pan ≠ radio, conteo real, favoritas servidor  
> **Historia / Contrato:** US-GEO-09 … 16, API-GEO-01 F7, CO-F7-001, API-ADDRESSES-01  
> **Fecha:** 2026-08-24  
> **Ambiente:** `http://localhost:8080`

---

## Resumen de ejecución

| Métrica | Valor |
|---------|-------|
| Total de casos | 20 |
| Happy path ejecutados | 13/13 |
| Negativos / edge ejecutados | 7/7 |
| Mejoras UX documentadas | 3/3 |
| Pass / Fail / Blocked / Pendiente | 20 / 0 / 0 / 0 |

Set F7: `tests/e2e/explore-f7.spec.ts` + regresión `explore-geo.spec.ts` + `api/geo.spec.ts` + `api/addresses.spec.ts`.

---

## Tabla resumen

| ID | Nombre | Tipo | Prioridad | Auto | Estado |
|----|--------|------|-----------|------|--------|
| HP-GEO-09 | Mapa arriba de lista (móvil 360px) | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-GEO-10 | Pan/zoom no cambia radio ni GET | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-GEO-11 | Default SN sin query en URL | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-GEO-11b | Favorita lastUsed en otro contexto | Positivo | P1 | api/addresses.spec.ts | Pass |
| HP-GEO-12 | limit=20; paginación mapa estático | Positivo | P1 | api/geo.spec.ts + manual | Pass |
| HP-GEO-13 | Copy N/R desde meta.total | Positivo | P1 | e2e/explore-f7.spec.ts | Pass |
| HP-GEO-15 | Markers sin label permanente | Edge | P2 | manual | Pass |
| HP-GEO-16 | Empty borrega + copy radio | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| TC-GEO-004-F7 | radiusKm=30 → clamp 25 | Negativo | P1 | api/geo.spec.ts | Pass |
| TC-GEO-009 | q 1 char 400; q=mango producto | Negativo/Pos | P1 | api/geo.spec.ts | Pass |
| TC-ADD-F7-001 | POST /addresses/[id]/use | Positivo | P1 | api/addresses.spec.ts | Pass |
| HP-GEO-04/05 | Leaflet/OSM regresión F5 | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| HP-GEO-07/08 | Slider + loader regresión F6 | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| HP-GEO-03 | Favoritas guardar/login | Positivo | P1 | e2e/explore-geo.spec.ts | Pass |
| EC-GEO-17 | Zoom mapa no altera scroll catálogo | Edge | P1 | e2e/explore-f7.spec.ts | Pass |
| EC-GEO-18 | FilterBar chrome fuera de `.explore-main-scroll` | Edge | P1 | e2e/explore-f7.spec.ts | Pass (BUG-012 cerrado) |
| HP-GEO-19 | FilterBar se colapsa al scroll hacia abajo | Positivo | P2 | e2e/explore-f7.spec.ts | Pass (BUG-013 cerrado) |
| EC-GEO-19 | Pestaña central re-expande FilterBar; filtros activos persisten | Edge | P2 | e2e/explore-f7.spec.ts | Pass (BUG-013 cerrado) |
| HP-GEO-20 | CompactAddressBar en una fila en viewport ≥640px | Positivo | P2 | e2e/explore-f7.spec.ts | Pass (BUG-014 cerrado) |
| EC-GEO-20 | Móvil stack OK; tablet+ altura banda controles ≤ ~56px | Edge | P2 | e2e/explore-f7.spec.ts | Pass (BUG-014 cerrado) |

---

## EC-GEO-18 — detalle (manual)

> **ID:** EC-GEO-18  
> **Tipo:** Edge  
> **Prioridad:** P1  
> **Auto:** e2e/explore-f7.spec.ts  
> **Estado:** Pass — [BUG-012](../bug-reports/BUG-012.md) cerrado 24/08

**Prerrequisitos:** app en `http://localhost:8080`; viewport desktop 1280×800.

**Pasos:**

1. Abrir `/explorar?lat=25.6714&lng=-100.3089&radiusKm=10`.
2. Anotar posición `y` del FilterBar (chips Orgánico … Agrícola) y del botón «Usar mi ubicación».
3. Hacer scroll ≥ 300px en `.explore-main-scroll`.
4. Comprobar visibilidad y `y` de chips + CTA (±5px).
5. Comprobar que CompactAddressBar o el mapa sí se desplazaron.

**Esperado:** FilterBar es chrome (no hijo de `.explore-main-scroll`); CompactAddressBar / mapa / lista scrollean. Tras BUG-013 el chrome puede colapsar; no debe desplazarse como contenido.  
**Obtenido (24/08):** Pass — `isFilterBarInsideMainScroll() === false`; dirección baja de `y` al scrollear.

---

## HP-GEO-19 — detalle (BUG-013)

> **ID:** HP-GEO-19  
> **Tipo:** Positivo (mejora UX)  
> **Prioridad:** P2  
> **Auto:** e2e/explore-f7.spec.ts  
> **Estado:** Pass — [BUG-013](../bug-reports/BUG-013.md) cerrado 24/08  
> **Dependencia:** BUG-012 cerrado

**Prerrequisitos:** `/explorar` con pin; FilterBar acoplado al Header; viewport desktop 1280×800.

**Pasos:**

1. Abrir `/explorar?lat=25.6714&lng=-100.3089&radiusKm=10`.
2. Medir altura visible del mapa o primera card (referencia).
3. Hacer scroll hacia abajo ≥ 120px en `.explore-main-scroll`.
4. Observar que FilterBar (chips + «Usar mi ubicación») se oculta.
5. Confirmar que mapa/cards ganan altura útil (viewport aumenta).

**Esperado:** colapso automático del FilterBar al scroll down; Header sigue visible.

---

## EC-GEO-19 — detalle (BUG-013)

> **ID:** EC-GEO-19  
> **Tipo:** Edge (mejora UX)  
> **Prioridad:** P2  
> **Auto:** e2e/explore-f7.spec.ts  
> **Estado:** Pass — [BUG-013](../bug-reports/BUG-013.md) cerrado 24/08  
> **Dependencia:** BUG-012 cerrado

**Prerrequisitos:** FilterBar colapsado (tras HP-GEO-19); chip **Verificado** activo.

**Pasos:**

1. Con FilterBar colapsado, localizar **pestaña central** bajo el Header.
2. Verificar `aria-expanded="false"` y label accesible («Mostrar filtros»).
3. Click/tap en la pestaña → FilterBar se expande completo.
4. Confirmar chip Verificado sigue `aria-pressed="true"` y URL conserva `verified=1` (si aplica).
5. Opcional: scroll hacia arriba cerca del tope → FilterBar se expande sin perder filtros.

**Esperado:** re-expansión vía pestaña; filtros activos intactos; badge/contador en pestaña si hay filtros (recomendado).

---

## HP-GEO-20 — detalle (BUG-014)

> **ID:** HP-GEO-20  
> **Tipo:** Positivo (mejora UX)  
> **Prioridad:** P2  
> **Auto:** e2e/explore-f7.spec.ts  
> **Estado:** Pass — [BUG-014](../bug-reports/BUG-014.md) cerrado 24/08

**Prerrequisitos:** app en `http://localhost:8080`; usuario CLIENT con al menos una favorita (opcional); viewports 768×1024 y 1280×800.

**Pasos:**

1. Abrir `/explorar?lat=25.6714&lng=-100.3089&radiusKm=10`.
2. Localizar `CompactAddressBar` (input «Buscar dirección», botón lupa, `#favorite-address`, botón «Guardar dirección»).
3. Medir posición `y` (top) de los cuatro controles con DevTools o `getBoundingClientRect()`.
4. Confirmar que los cuatro comparten la **misma fila** (Δy ≤ 4px entre centros verticales).
5. Repetir en 768×1024 y 1280×800.

**Esperado:** fila horizontal única en tablet/desktop; altura uniforme `h-11` (~44px); label «Favoritas» no visible encima del select (sr-only).

---

## EC-GEO-20 — detalle (BUG-014)

> **ID:** EC-GEO-20  
> **Tipo:** Edge (mejora UX)  
> **Prioridad:** P2  
> **Auto:** e2e/explore-f7.spec.ts  
> **Estado:** Pass — [BUG-014](../bug-reports/BUG-014.md) cerrado 24/08

**Prerrequisitos:** `/explorar` con pin activo.

**Pasos (móvil 360×640):**

1. Abrir `/explorar?lat=25.6714&lng=-100.3089&radiusKm=10` en viewport 360×640.
2. Confirmar que stack vertical **está permitido** (buscar arriba; favoritas + guardar abajo si no cabe).
3. Verificar que controles siguen usables (targets ≥44px) y `HP-GEO-03` no se rompe.

**Pasos (tablet 640×800):**

1. Cambiar viewport a 640×800.
2. Medir altura del contenedor de controles (fila input + lupa + select + guardar), **sin** contar copy «N fruterías a R km» ni avisos geo.
3. Anotar altura con `document.querySelector('#geocode-query')?.closest('section')` o inspección del wrapper de controles.

**Esperado:**

- Móvil: stack aceptable; funcionalidad intacta.
- Tablet+: altura banda de controles **≤ ~56px**; copy/meta debajo de la fila, no entre controles.
- Regresión: `#geocode-query`, `#favorite-address`, botón «Guardar dirección» conservan ids/roles para e2e.
