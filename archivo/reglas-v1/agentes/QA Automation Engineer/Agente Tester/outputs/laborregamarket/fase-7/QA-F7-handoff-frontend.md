# Handoff QA → Frontend — LaBorregaMarket F7

> **De:** QA Tester Senior  
> **Para:** @Frontend Developer  
> **Proyecto:** LaBorregaMarket v0.7.1  
> **Fecha:** 24/08/2026  
> **Ambiente:** `http://localhost:8080`  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Estado

Sign-off F7 **APROBADO CON CONDICIONES** (24/08). Cola Frontend **vacía**.

| Prioridad | Ticket | Estado |
|-----------|--------|--------|
| — | [BUG-012](./bug-reports/BUG-012.md) — FilterBar no acoplado al Header | **Cerrado** 24/08 |
| — | [BUG-013](./bug-reports/BUG-013.md) — FilterBar colapsable + pestaña re-expansión | **Cerrado** 24/08 |
| — | [BUG-014](./bug-reports/BUG-014.md) — CompactAddressBar fila horizontal compacta | **Cerrado** 24/08 |
| — | [BUG-011](./bug-reports/BUG-011.md) — scroll zoom catálogo | Cerrado 23/08 |

Prompts (copiar/pegar en el chat Frontend):

- BUG-012 (P1): [`activation-prompt-frontend-BUG-012.md`](./activation-prompt-frontend-BUG-012.md)
- BUG-013 (P2, tras BUG-012): [`activation-prompt-frontend-BUG-013.md`](./activation-prompt-frontend-BUG-013.md)
- BUG-014 (P2, independiente): [`activation-prompt-frontend-BUG-014.md`](./activation-prompt-frontend-BUG-014.md)

---

## Qué falló (BUG-012)

**Repro:** en `/explorar?lat=25.6714&lng=-100.3089&radiusKm=10`, scroll del contenido (mapa / lista) → chips (Orgánico, Mayoreo, A domicilio, Verificado, Frutas, Verduras, Agrícola) y **«Usar mi ubicación»** salen del viewport. El Header se queda; los filtros no.

**Causa raíz:** `FilterBar` vive **dentro** de `.explore-main-scroll` (`overflow-y: auto`, introducido en BUG-011). `sticky top-[80px]` se ancla a ese contenedor, no al Header.

**CO-F7-001 intacto:** pan/zoom no disparan GET; el bug es de layout CSS.

**CompactAddressBar** («Buscar dirección») **sí** debe scrollear con mapa y resultados.

---

## Archivos a tocar

| Ruta | Acción |
|------|--------|
| `src/app/explorar/ExplorePageClient.tsx` | Wrapper `flex flex-1 min-h-0 flex-col`; `FilterBar` **fuera** de `.explore-main-scroll` (`shrink-0`) |
| `src/components/explore/FilterBar.tsx` | Quitar `sticky top-[80px]`; chrome estático bajo el Header |
| `src/app/globals.css` | Solo si hace falta token de alto de chrome; no mover el scroll a `body` |
| `src/components/explore/ExploreMap.tsx` | **No romper** `MapFocusGuard` (sigue leyendo `.explore-main-scroll`) |

### Layout objetivo

```tsx
<div className="flex min-h-0 flex-1 flex-col">
  <FilterBar /> {/* shrink-0; NO dentro del scroll */}

  <div className="explore-main-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
    <CompactAddressBar>...</CompactAddressBar>

    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="explore-map-section pt-4">
        <ExploreMapSection />
      </div>
      <div className="explore-results-panel" role="region" aria-label="Lista de fruterías">
        {/* grid + paginación */}
      </div>
    </div>
  </div>
</div>
```

`page.tsx` ya es `flex h-dvh flex-col` + `HeaderWrapper`; no mover el Header al cliente.

---

## Resultado esperado

- Tras scroll ≥ 300px en `.explore-main-scroll`, FilterBar y «Usar mi ubicación» siguen visibles bajo el Header (`y` ±5px).
- CompactAddressBar / mapa / lista se desplazan.
- `EC-GEO-17`: zoom/pan no alteran scroll del catálogo (±30px).
- `CO-F7-001`: cero GET en pan/zoom; slider y copy N/R congelados.
- `HP-GEO-09`: mapa sigue arriba de lista en móvil.

---

## No tocar

- API GEO / backend (cero cambio BE)
- `CO-F7-001`: pan/zoom NO actualizan `radiusKm`
- Preview sheet, login, favoritas, `resolveExploreCenter`
- `FitCircle` / `toBounds` (BUG-010)
- Contención de scroll de BUG-011 (no devolver overflow al `body`)

---

## DoD

1. ~~`EC-GEO-18` Pass~~ **Pass 24/08** (`explore-f7.spec.ts`)
2. ~~`EC-GEO-17` Pass~~ **Pass 24/08**
3. ~~Suite focal F7 sin fallos de layout GEO~~ **85/85**
4. ~~Avisar a QA para cerrar BUG-012~~ **Cerrado**

---

## Mejora UX (BUG-013) — FilterBar colapsable

**Dependencia:** implementar **después** de cerrar BUG-012.

**Objetivo:** al scroll **hacia abajo** en `.explore-main-scroll`, ocultar FilterBar (chips + «Usar mi ubicación») para maximizar mapa y cards. Mostrar **pestaña central ligera** para re-expandir sin perder filtros activos.

| Comportamiento | Criterio |
|----------------|----------|
| Colapso | `scrollTop` > umbral (~80–120px) en `.explore-main-scroll` → FilterBar oculto |
| Pestaña | Centrada bajo Header; `min-h` 44px móvil; `aria-expanded` + label «Mostrar filtros» |
| Re-expansión | Click en pestaña **o** scroll up cerca del tope → FilterBar visible |
| Estado | Filtros/URL intactos al colapsar; badge opcional si hay chips activos |

### Archivos sugeridos

| Ruta | Acción |
|------|--------|
| `src/app/explorar/ExplorePageClient.tsx` | Estado `filterBarCollapsed` + listener scroll en `.explore-main-scroll` |
| `src/components/explore/FilterBar.tsx` | Variante colapsada + `FilterBarExpandTab` |
| `src/app/globals.css` | Tokens `--explore-filterbar-h`, transición 200ms |

### DoD BUG-013

1. ~~`HP-GEO-19` Pass~~ **Pass 24/08**
2. ~~`EC-GEO-19` Pass~~ **Pass 24/08**
3. ~~`EC-GEO-18` / `EC-GEO-17` Pass~~ **Pass 24/08**
4. ~~Avisar a QA para cerrar BUG-013~~ **Cerrado**

---

## Mejora UX (BUG-014) — CompactAddressBar horizontal

**Dependencia:** ninguna (puede implementarse en paralelo a BUG-012/013).

**Objetivo:** en `/explorar`, los tres controles de domicilio — **buscar dirección**, **favoritas** (`#favorite-address`) y **guardar domicilio** — deben compartir **una sola fila horizontal** desde viewport **≥640px**, reduciendo la altura vertical de `CompactAddressBar` y ganando viewport para el mapa.

| Comportamiento | Criterio |
|----------------|----------|
| Fila única ≥640px | Input + lupa + select + botón Guardar en `flex-row`, `items-center`, `h-11` |
| Label Favoritas | `sr-only` en tablet+; sin label block encima del select |
| Proporciones | Input `flex-1 min-w-0`; select ~160–200px; botón `shrink-0` |
| Padding | `py-2 sm:py-3` en la sección (no `py-4`) |
| Móvil &lt;640px | Stack permitido si no cabe en una fila |
| Meta/copy | `ExploreCount`, avisos geo/error **debajo** de la fila de controles |

### Archivos sugeridos

| Ruta | Acción |
|------|--------|
| `src/components/explore/CompactAddressBar.tsx` | Fila horizontal desde `sm:`/`md:`; reducir padding |
| `src/components/explore/FavoriteAddressSelect.tsx` | Variante inline; label responsive sr-only |
| `src/app/globals.css` | Token opcional `--explore-addressbar-controls-h` |

### Layout objetivo

```tsx
<section className="border-b border-gray-100 bg-white px-4 py-2 sm:px-6 sm:py-3">
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
    <form className="flex min-w-0 flex-1 gap-2" onSubmit={submitSearch}>
      <input id="geocode-query" className="h-11 min-w-0 flex-1 ..." />
      <button type="submit" className="h-11 w-11 ..." aria-label="Buscar dirección" />
    </form>
    <FavoriteAddressSelect inline className="shrink-0" {...props} />
  </div>
  {searchError && <p role="alert">...</p>}
  {pinLabel && <p>Centro: {pinLabel}</p>}
  {children /* ExploreCount, etc. */}
</section>
```

### DoD BUG-014

1. ~~`HP-GEO-20` Pass~~ **Pass 24/08**
2. ~~`EC-GEO-20` Pass~~ **Pass 24/08**
3. ~~`HP-GEO-03` Pass~~ **Pass** (`explore-geo.spec.ts`)
4. ~~`EC-GEO-17` / `CO-F7-001` / `HP-GEO-09` Pass~~ **Pass 24/08**
5. ~~Avisar a QA para cerrar BUG-014~~ **Cerrado**
