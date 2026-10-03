# DT-F9-003 — Card Explorar: precio mínimo no aporta; distancia pin→frutería

> **ID:** DT-F9-003  
> **Tipo:** Deuda técnica / mejora UX (no bug de producto F8)  
> **Severidad propuesta:** Minor UX (no Blocker)  
> **Fase:** 9 (F8 permanece cerrada)  
> **Estado:** Abierta — revisión Product Manager  
> **Fecha:** 2026-08-25  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Relacionados:** [DT-F9-001](./DT-F9-001-preview-in-card.md) (inventario card); [DT-F9-002](./DT-F9-002-header-explorar-busqueda.md) (header; independiente)

---

## Incidencia

En la card de `/explorar` el renglón semibold es el **precio mínimo de todo el catálogo** (`minPrice`), con copy invertido: «$150 MXN desde» (debería ser «desde $150» si se conservara). No indica de qué producto es, no ayuda a comparar fruterías y ocupa el slot de mayor peso tipográfico.

En paralelo, `distanceKm` (Haversine **pin de búsqueda → sucursal**) ya llega en el listing geo y se pinta como un km gris (`1.2 km`) poco informativo. El usuario no ve de forma clara **cuánto hay entre el punto desde el que busca y la frutería**.

F8 firmó Explorar polish; este hallazgo **no reabre** el sign-off. Se trata como mejora F9.

Marcado en código:

```html
<p class="pt-1"><span class="text-[15px] font-semibold">$150 MXN desde</span></p>
```

(`ProviderCard`: `priceLabel` a partir de `provider.minPrice`.)

---

## Propuesta (para el PM)

Sustituir el slot de `minPrice` y **unificar** el renglón gris de km en **una sola fila de distancia origen→frutería**:

1. Copy: **«A {n} km de tu búsqueda»**. Si `distanceKm < 1`, **«A {m} m»** (mismo criterio de formato que el radio).
2. ETA de traslado con `computeEtaMinutes` / `AVG_SPEED_KMH = 25` (ADR-017): **«~{min} min en auto»**. Si a 5 km/h la caminata es &lt; 15 min, preferir **«~{min} min a pie»**.
3. Opcional: barra de proporción `distanceKm / radiusKm` (qué tan al borde del radio).
4. **Sin pin:** no inventar km; ocultar la fila o copy «Elige una ubicación para ver la distancia» (`distanceKm` no viene; TC-GEO-008).
5. Un solo renglón de distancia (no duplicar «1.2 km» + otra fila).

**Backend Must:** no. `GET /api/providers` con `lat`/`lng` ya calcula `distanceKm`. ETA es cliente (helper existente).

---

## Criterios de aceptación (borrador para US/CO)

| ID | Criterio |
|----|----------|
| AC-1 | La card de `/explorar` **no** muestra `minPrice` ni «$X MXN desde» / «Consultar precios» en ese slot. |
| AC-2 | Con pin válido, la card muestra la distancia Haversine entre el pin de búsqueda y la sucursal (km o m). |
| AC-3 | La misma fila incluye ETA de traslado (auto y/o a pie según umbral). |
| AC-4 | No hay dos renglones que repitan solo el km. |
| AC-5 | Sin `lat`/`lng`, no se inventa distancia. |
| AC-6 | `minPrice` permanece en API (listing); solo deja de ser el CTA visual de la card. |

---

## Repro (estado actual)

1. Abrir `/explorar` con pin y radio (p. ej. `lat=25.6714&lng=-100.3089&radiusKm=10`).
2. Inspeccionar una card de frutería.
3. **Observado:** «$X MXN desde» (semibold) y un km gris aparte; el precio no identifica producto.
4. **Esperado (deuda):** una fila «A X km/m de tu búsqueda» + ETA; sin precio mínimo en ese slot.

Componentes:

| Rol | Ruta |
|-----|------|
| Card | `src/components/explore/ProviderCard.tsx` |
| Listado | `src/app/explorar/ExplorePageClient.tsx` |
| Mapping | `src/lib/services/provider.service.ts` (`distanceKm`, `minPrice`) |
| ETA | `src/lib/geo/eta.ts` |

---

## Inventario de datos

**Sí hay datos.** Falta superficie UX en la card.

| Campo | En API | Visible hoy | Uso propuesto |
|-------|--------|-------------|---------------|
| `minPrice` | Sí | «$X MXN desde» | Dejar de pintar en card |
| `distanceKm` | Sí (solo con geo) | «N.N km» gris | Slot principal + formato m/km |
| `sampleProducts[]` | Sí | **No** | **Fuera** de este ticket |
| Radio `radiusKm` | Query + `meta` | Slider / ExploreCount | Barra relativa opcional |
| Pin `lat`/`lng` | Query | Mapa | Origen de Haversine (BE) |

---

## Fuera de este ticket

- Preview in-card: [DT-F9-001](./DT-F9-001-preview-in-card.md).
- Header typeahead: [DT-F9-002](./DT-F9-002-header-explorar-busqueda.md).
- FilterBar chips disabled: [DT-F9-004](./DT-F9-004-filterbar-chips-bloqueados.md).
- Pintar `sampleProducts` o rescatar `minPrice` con nombre de SKU («desde $18/kg · Plátano»).

---

## Conclusión para el PM

- Aceptar DT-F9-003 como mejora F9: el slot de precio mínimo de la card pasa a **distancia pin→frutería + ETA**.
- Emitir US/CO; UX copy breve; Frontend. **Sin API Must.**
- QA no corre gates ni Playwright hasta implementación.
