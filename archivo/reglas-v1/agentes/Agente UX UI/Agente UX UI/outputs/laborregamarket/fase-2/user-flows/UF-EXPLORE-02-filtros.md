> **Flujo:** Filtros avanzados en explorar
> **Historia de Usuario Asociada:** US-EXPLORE-01, US-EXPLORE-02, US-EXPLORE-03, US-EXPLORE-04
>
> **Punto de entrada:** `/explorar`, búsqueda header → `/explorar?q=`, deep-link compartido con query params
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Usuario ve FilterBar + lista + mapa (móvil: lista arriba, mapa ~300px debajo — OBS-01).
> 2. `[Chip categoría]` → Activa "Frutas" | "Verduras" | "Agrícolas" → URL `?category=FRUTA|VERDURA|AGRICOLA`; chip activo con estilo `--brand`. Lista y mapa se actualizan vía `GET /api/providers`.
> 3. `[Chip Verificadas]` → Toggle `verified=true` en URL; sync UI ↔ API (cierra OBS-02).
> 4. `[Búsqueda producto]` → Input explorar o header con término ≥2 chars (ej. "mango") → `?q=mango`. Combinable con categoría/verified.
> 5. `[Hidratación URL]` → Al cargar o compartir `?q=mango&category=FRUTA&verified=true` → chips e input reflejan params; botón atrás restaura estado desde URL (US-EXPLORE-03).
> 6. `[Clic card/marker]` → Navega a `/fruteria/[id]` (filtros no se pierden al volver vía historial).
>
> **Condicionales:**
> - **Loading:** → 6× SkeletonCard + mapa `animate-pulse`.
> - **Empty filtrado (`data: []`):** → EmptyState título `"No encontramos fruterías"` + descripción contextual (filtros activos) + CTA `"Limpiar filtros"` → limpia query + chips → listado completo. Mapa sin markers erróneos.
> - **Error red:** → ErrorBanner + "Reintentar" (distinto del empty filtrado).
> - **Deseleccionar chip:** → Quita param; listado sin ese filtro.
> - **q < 2 chars:** → No dispara query de producto; puede mantener listado previo o city-only.
>
> **Reglas UI:**
> - Chips touch target ≥44px; scroll horizontal sin scrollbar visible (`filter-scroll`).
> - Contador actualizado: "Más de {n} fruterías…".
> - Cards: `coverUrl`/`logoUrl` lazy + `ImagePlaceholder` si falta (MEDIA).
> - Wireframe: `WF-explorar.md` (extensión Fase 2). Relacionado: `UF-CLIENT-01`.
>
> **API esperada:**
> - `GET /api/providers?city=&category=&q=&verified=&page=`
> - Params: `category` FRUTA|VERDURA|AGRICOLA; `q` min 2 chars; `verified` boolean.
