# DT-F9-002 — Header EXPLORAR: búsqueda dinámica (productos activos + nombre similar)

> **ID:** DT-F9-002  
> **Tipo:** Deuda técnica / mejora UX (no bug de producto F8)  
> **Severidad propuesta:** Major UX  
> **Fase:** 9 (F8 permanece cerrada)  
> **Parte:** **2/3 + 3/3** (un solo ticket)  
> **Estado:** Abierta — revisión Product Manager  
> **Fecha:** 2026-08-24  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Predecesor:** [DT-F9-001](./DT-F9-001-preview-in-card.md) (Parte 1/3 preview in-card; inventario de datos reutilizado)

---

## Incidencia

El header de `/explorar` solo envía `q` a la URL (≥2 caracteres) y filtra el listado paginado. **No hay typeahead**, no se aprovecha el índice de **productos activos por negocio** (card + submódulo de preview/detalle), y el usuario no ve un catálogo de **fruterías** que coincidan por fruta o por nombre similar **en todo el radio** — solo en la página actual.

F8 firmó Explorar polish; este hallazgo **no reabre** el sign-off. Se trata como deuda F9 (partes 2/3 y 3/3 que DT-F9-001 dejó en backlog).

---

## Propuesta (para el PM)

Refactor del **header exclusivo del módulo EXPLORAR** para búsqueda **dinámica** (cada negocio agrícola tiene su propia variedad activa):

1. **Corpus en radio, no paginado.** Sugerencias y resultados usan **todas** las fruterías dentro del pin + `radiusKm`, no solo las cards de la página visible.
2. **Índice de productos:** card (`ProviderListing.sampleProducts`) **y** submódulo/detalle (`ProviderDetail.products[]` con `isAvailable`). El catálogo de artículos es **interno** (para matchear); no se listan productos en el desplegable.
3. **Dos intenciones, un resultado:** texto libre coincide por **producto activo** *o* por **nombre similar de frutería**.
4. **Typeahead solo de fruterías**, minimalista: **portada a la izquierda + nombre** (card recortada; sin rating, precio ni chips en el suggest).
5. **Al seleccionar una opción:** se aplica el filtro; el catálogo de cards muestra las fruterías que cumplen; en la barra, **aviso ligero** de que hay filtro aplicado.
6. **Tacha al final del input:** un clic vacía el texto **y** quita los filtros (vuelve al listado geo del radio sin `q`).
7. **Sin pin/radio válido:** no inventar matches fuera de rango (empty/gate geo F8).

### Implicación API (decisión PM / Arquitecto, no implementación QA)

El `GET /api/providers` paginado **no basta** como único índice del typeahead. Hace falta suggest/search sobre el conjunto en radio (reutilizar `q` + geo, o endpoint de suggest). El modelo de datos de frutería/artículo **ya existe**; faltan superficie UX y posiblemente contrato de suggest/ranking.

---

## Criterios de aceptación (borrador para US/CO)

| ID | Criterio |
|----|----------|
| AC-1 | El header enriquecido vive **solo** en `/explorar`. |
| AC-2 | El índice de búsqueda incluye fruterías **en radio** aunque no estén en la página actual del listado. |
| AC-3 | Escribir un producto activo (p. ej. mango) sugiere fruterías del radio que lo ofrecen; el desplegable muestra **nombre + portada**, no el SKU. |
| AC-4 | Escribir un nombre similar de frutería sugiere esas fruterías del radio (mismo formato visual). |
| AC-5 | Seleccionar una sugerencia aplica el filtro, actualiza el catálogo de cards y muestra **notificación ligera** en la barra. |
| AC-6 | La tacha (clear) del input elimina texto y filtros en un clic. |
| AC-7 | Variedad **por negocio**: no hay lista fija global de frutas; solo productos **activos/disponibles** de cada frutería. |

---

## Repro (estado actual)

1. Abrir `/explorar` con pin y radio válidos (p. ej. `lat=25.6714&lng=-100.3089&radiusKm=10`).
2. Escribir en el header `q` de 2+ caracteres (fruta o nombre de negocio).
3. **Observado:** se recarga/filtra el listado; **no** hay desplegable de fruterías; **no** hay chip/aviso de filtro; **no** hay tacha que limpie `q` y filtros; coincidencias limitadas a lo que el listado paginado expone en UI.
4. **Esperado (deuda):** typeahead de fruterías (portada + nombre) sobre **todo el radio**; chip/aviso al elegir; tacha limpia todo.

Componentes actuales (referencia):

| Rol | Ruta |
|-----|------|
| Página explorar | `src/app/explorar/ExplorePageClient.tsx` |
| Header / `q` | Header del módulo explorar (query `q` en URL) |
| Card | `src/components/explore/ProviderCard.tsx` |
| Preview / productos | `ProviderPreviewContent.tsx` ← `GET /api/providers/[id]` |
| Listado | `GET /api/providers` → `listProviders` / `buildWhere` |

---

## Inventario de datos (reutilizado de DT-F9-001)

**Sí hay datos en API.** Falta UX de header y posiblemente suggest sobre el conjunto en radio.

### Card — `GET /api/providers` → `ProviderListing`

| Campo útil para este DT | En API | Uso esperado |
|-------------------------|--------|----------------|
| `id`, `businessName` | Sí | Match nombre similar + fila del typeahead |
| `coverUrl` / `logoUrl` | Sí | Foto izquierda del suggest |
| `sampleProducts[]` | Sí (hasta 5; UI de card **no** los pinta) | Índice parcial de productos |
| Geo / radio | Sí si hay `lat`/`lng` | Restringir corpus |

### Submódulo — `GET /api/providers/[id]` → `ProviderDetail`

| Campo | En API | Uso esperado |
|-------|--------|----------------|
| `products[]` (`isAvailable`, name, slug, …) | Sí (lista completa; preview recorta a ~5) | Índice **completo** de productos activos por negocio |

### Header hoy

- Envía `q` a `/explorar?q=…` (mínimo 2 caracteres). Sin typeahead, sin chip, sin tacha de filtros.
- BE: `businessName` OR `description` OR nombre/slug de producto activo/disponible, luego radio.
- HP-EXPLORE-06 cubre que `q=mango` muestra cards; **no** afirma suggest ni corpus extra-página.

---

## Fuera de este ticket

- Parte **1/3** (animación in-card): [DT-F9-001](./DT-F9-001-preview-in-card.md).
- Pintar `sampleProducts` en la card de la lista (gap 1 de DT-F9-001), salvo que PM lo una.
- Slot `minPrice` de la card → distancia origen: [DT-F9-003](./DT-F9-003-card-distancia-origen.md).
- Chips FilterBar disabled: [DT-F9-004](./DT-F9-004-filterbar-chips-bloqueados.md).
- Typeahead de **artículos** (SKU/fruta como fila): **fuera**; el índice de productos es interno.

---

## Conclusión para el PM

- Aceptar DT-F9-002 como mejora F9 (partes 2/3 + 3/3): header EXPLORAR con suggest de **solo fruterías**, índice dinámico de productos activos + nombre, **radio completo**, chip de filtro y tacha.
- Emitir US/CO; Arquitecto decide si hace falta endpoint de suggest. No asignar Frontend hasta US/CO (y spec UX del typeahead si aplica).
- QA no corre gates ni specs Playwright hasta implementación.
