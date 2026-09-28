# DT-F9-001 — Preview hover/long-press desanclado; animación in-card

> **ID:** DT-F9-001  
> **Tipo:** Deuda técnica / mejora UX (no bug de producto F8)  
> **Severidad propuesta:** Major UX  
> **Fase:** 9 (F8 permanece cerrada)  
> **Parte:** **1/3**  
> **Estado:** Abierta — revisión Product Manager  
> **Fecha:** 2026-08-24  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Incidencia

El submódulo de preview generado por **hover** (~300 ms) y **long-press** (~500 ms) se muestra **fuera del card** de la frutería: el popover queda alejado, sin orden visual respecto a la card, y rompe la UX de `/explorar`.

US-EXPLORE-07 (F8) pedía preview **anclado a la card**. F8 firmó con condiciones; este hallazgo **no reabre** el sign-off. Se trata como deuda F9.

## Propuesta Parte 1/3 (para el PM)

Tomar la misma funcionalidad (mismo trigger, mismo contenido de preview) y **convertirla en animación dentro del propio card**:

- Hover / long-press / atajo de teclado **despliegan** el contenido del submódulo **aprovechando el espacio del card**.
- Clic o tap **corto** sigue navegando a `/fruteria/{id}`.
- Un solo preview/animación abierto a la vez.
- `prefers-reduced-motion` se respeta.
- **No** recortar campos de US-EXPLORE-05 (horario, capacidades, productos, reseñas preview, CTA «Ver frutería»).
- **No** se pide contrato API Must nuevo: el GET de detalle ya existe y está cacheado.

Partes **2/3 y 3/3** (búsqueda header) se documentan en **[DT-F9-002](./DT-F9-002-header-explorar-busqueda.md)**; ver inventario abajo.

## Repro (estado actual)

1. Abrir `/explorar` con pin y radio válidos (p. ej. `lat=25.6714&lng=-100.3089&radiusKm=10`).
2. Desktop: dejar el puntero sobre una card de frutería ~300 ms (o Alt+Enter / control «Vista previa»).
3. Móvil: long-press ~500 ms (sin confundir con scroll).
4. **Observado:** aparece un popover/submódulo **desplazado** respecto al card; el orden visual se pierde.
5. **Esperado (deuda):** el contenido se anima **dentro** del mismo card.

Componentes actuales:

| Rol | Ruta |
|-----|------|
| Card | `src/components/explore/ProviderCard.tsx` |
| Shell popover | `src/components/explore/ProviderPreviewPopover.tsx` |
| Cuerpo preview | `src/components/explore/ProviderPreviewContent.tsx` |
| Capacidades / horario | `ProviderCapabilities.tsx`, `HoursTable.tsx` |
| Estado lista + preview | `src/app/explorar/ExplorePageClient.tsx` |
| Cache / delays | `src/lib/maps/preview-cache.ts`, `preview-delays.ts` |

---

## Inventario: ¿el aplicativo ya trae los datos?

**Sí, a nivel API.** Card y submódulo usan **dos payloads distintos**. La UI **no consume todo** lo que llega. Eso alcanza para Parte 1/3. Para búsquedas ricas del header faltan superficies UX, no un catálogo vacío.

### Card — `GET /api/providers` → `ProviderListing`

Definición: `src/lib/api/types.ts`.

| Campo | En API | Visible en card |
|-------|--------|-----------------|
| `id`, `businessName` | Sí | Sí |
| `coverUrl` / `logoUrl` | Sí | Sí (cover preferido) |
| `isVerified` | Sí | Badge «Verificado» |
| `rating` / `reviewCount` | Sí | Sí |
| `distanceKm` | Sí (lista geo) | Sí |
| `description` | Sí | 1 línea |
| `address`, `city` | Sí | Sí |
| `productCount` | Sí | «N productos disponibles» |
| `minPrice` | Sí | «$X MXN desde» |
| `phone` | Sí | Solo `ContactCTA` |
| `sampleProducts[]` (`name`, `price`, `unit`; runtime también `imageUrl`) | Sí (hasta 5) | **No se pinta** |
| `latitude` / `longitude` | Sí | Mapa, no texto del card |
| Horario / `isOpenNow` | **No** en listing | — |

### Submódulo — `GET /api/providers/[id]` → `ProviderDetail`

Mismo shape que ficha de frutería. El preview pide este GET (con cache).

| Campo | En API | Visible en preview hoy |
|-------|--------|------------------------|
| `businessName` | Sí | Título |
| `hoursPublished` / `isOpenNow` | Sí | Abierta / Cerrada / horario no publicado |
| `isVerified` / `verifiedAt` | Sí | Copy de verificación |
| `offersDelivery`, `acceptsCardAtStore`, WhatsApp | Sí | Chips si `true` |
| `offersWholesale` / `offersRetail` | Sí | Chips |
| `openingHours` | Sí | Tabla |
| `products[]` (`ProviderProduct`: id, name, slug, category, unit, price, `isAvailable`, `imageUrl`) | Sí (lista completa) | UI recorta a ~5 y muestra **solo name · unit** |
| `reviewsPreview` (hasta 3) | Sí | Autor, fecha, estrellas, comentario |
| CTA | — | «Ver frutería» / reseñas |
| `description`, cover/logo, rating agregado, `minPrice`, `distanceKm`, `preparationTimeMinutes` | Sí en payload | **No** en preview |

### Header (base para Partes 2–3)

- El Header envía `q` a `/explorar?q=…` (mínimo 2 caracteres). **No** hay typeahead.
- El BE (`listProviders` / `buildWhere`) filtra case-insensitive por **businessName OR description OR** nombre/slug de producto activo/disponible, y luego aplica radio si hay `lat`/`lng`.
- Las cards resultantes **no** indican *por qué* coincidieron (nombre vs artículo).
- HP-EXPLORE-06 ya cubre que `q=mango` muestra cards; **no** afirma highlight de artículo.

---

## Gaps (fuera de Parte 1/3)

1. Pintar `sampleProducts` (o el match de `q`) en el card — **sigue fuera** de DT-F9-001, DT-F9-002 y DT-F9-003 salvo que PM lo una.
2. Autocomplete / suggest de fruterías en rango (productos activos + nombre) — **[DT-F9-002](./DT-F9-002-header-explorar-busqueda.md)**.
3. Ranking por similitud de nombre — cubierto como implicación de DT-F9-002 (PM/Arquitecto).
4. Superficie centrada en **artículos** (filas de SKU en typeahead) — **fuera** de DT-F9-002 (índice interno; suggest solo fruterías).
5. Drift de tipo: `sampleProducts[].imageUrl` llega en runtime y no está en `ProviderListing`.
6. Slot `minPrice` / «$X MXN desde» → distancia pin→frutería — **[DT-F9-003](./DT-F9-003-card-distancia-origen.md)**.
7. FilterBar chips disabled — **[DT-F9-004](./DT-F9-004-filterbar-chips-bloqueados.md)**.
8. Chrome una barra + mapa más alto — **[DT-F9-005](./DT-F9-005-chrome-barra-mapa.md)**.

## Conclusión para el PM

- **Parte 1/3:** hay datos suficientes para animar el contenido del submódulo **dentro del card** sin API Must nueva.
- **Partes 2–3:** ver **[DT-F9-002](./DT-F9-002-header-explorar-busqueda.md)**.
