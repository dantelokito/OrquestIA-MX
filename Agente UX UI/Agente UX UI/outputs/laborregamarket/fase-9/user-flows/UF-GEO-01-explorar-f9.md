> **Flujo:** Explorar F9 — chrome una barra; typeahead; chips Mayoreo/Domicilio; mapa más alto
> **Historia de Usuario Asociada:** US-GEO-24, US-EXPLORE-09, US-EXPLORE-11
>
> **Punto de entrada:** `/explorar`. Baseline F8 (LocationChip, overlay 0.5–10, mapa MX, pan ≠ radio) **intacta**. Preview: `UF-EXPLORE-08`. Card distancia: `UF-EXPLORE-10`.
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Layout **mapa-primero**. Desde **`md` (≥768px)**: **una** barra horizontal (~44–52px) con chips de filtro + GPS (**Usar mi ubicación**) + `LocationChip` + `ExploreCount` si cabe. Copy/errores (geo denegado, «2 caracteres», fuera de MX) van **debajo**, no inflan la fila. Viewport &lt; `md`: wrap o 2ª fila mínima; chips **scroll-x**; targets ≥44px.
> 2. `[Primera carga]` → Igual F8: SN o last-used; radio clamp 0.5–10; GET `/api/providers?lat&lng&radiusKm&page=1&limit=20` (+ filtros URL). Mapa móvil **`h-[420px]`**; desktop sticky **`min(520px, 52vh)`** (o token equivalente). Overlay radio anclado al pie del mapa.
> 3. `[Header typeahead — solo /explorar]` → Pill de búsqueda del header en esta ruta abre desplegable. Con pin + radio válidos y `q` ≥ 2: debounce → `GET /api/providers?q&lat&lng&radiusKm&limit=10&page=1` (corpus = predicado servidor, **no** la página de cards en memoria). Filas: **portada/logo a la izquierda + `businessName`**. **Prohibido** listar SKUs. Sin pin/radio: no inventar matches (empty o hint).
> 4. `[Seleccionar sugerencia]` → Aplica filtro (`q` y/o foco de listado); refetch cards; **aviso ligero** / chip en barra de que hay filtro activo. Enter en input sin elegir fila = mismo `q` a URL (paridad F7).
> 5. `[Tacha clear]` → Vacía texto del input **y** limpia filtros de chips alineados + `q`; vuelve al listado geo del radio. Focus vuelve al input.
> 6. `[Chips FilterBar]` → **Verificado**, Frutas / Verduras / Agrícola se conservan. **Mayoreo** → `offersWholesale=true`; **A domicilio** → `offersDelivery=true`; URL shareable; AND con geo/`q`/categoría/verificado. Chips **Orgánico** y **«Filtros»** **ausentes**. Ningún chip `disabled` de adorno. `aria-pressed`; ≥44px.
> 7. `[Empty AND]` → Si filtros dejan 0: empty borrega + copy + Limpiar filtros (+ Ampliar radio si R &lt; 10). **No** lista fantasma.
> 8. `[Pan / slider / GPS / favoritas]` → Igual F8: pan ≠ radio (`CO-F7-001`); FitCircle al cambiar R/centro; México bounds; LocationChip/panel intactos. **No** regresionar BUG-012 (chrome fuera del scroll principal) ni BUG-013 (colapso FilterBar).
>
> **Condicionales:**
> - **Error API / red:** → ErrorBanner + Reintentar; conservar lista previa; no empty borrega.
> - **Typeahead loading:** → Skeleton 3 filas o BrandLoader pequeño; `aria-busy`.
> - **Typeahead 0 resultados:** → “No hay fruterías con ese nombre en este radio.”
> - **`q` 1 carácter:** → Hint UI; **no** GET (o 400 — FE no envía).
> - **`prefers-reduced-motion`:** → Typeahead sin slide; mapa FitCircle instantáneo (F8).
>
> **Reglas UI:**
> - Wireframes: `WF-explorar-chrome-mapa.md`, `WF-explorar-typeahead.md`, `WF-explorar-filterbar-chips.md`.
> - Base F8 (solo lectura): `../../fase-8/user-flows/UF-GEO-01-explorar-f8.md`.
> - Tokens: §6h ExploreChromeF9, ExploreTypeahead, FilterBarF9, alturas mapa.
>
> **API esperada:**
> - `GET /api/providers?lat&lng&radiusKm&q&category&verified&offersWholesale&offersDelivery&page&limit` — Arquitecto F9 `API-GEO-01`. Typeahead: `limit=10`. **Sin** `/suggest`.
>
> **Referencias:** `CO-F9-001`, `CO-F7-001`, D-F9-UX-2…6, D-F9-2, D-F9-3, US-GEO-24, US-EXPLORE-09, US-EXPLORE-11.
