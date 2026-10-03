> **Flujo:** Explorar — mapa primero; pan ≠ radio; SN o last-used; lista 20; `total` API; markers limpios; empty borrega
> **Historia de Usuario Asociada:** US-GEO-09, US-GEO-10, US-GEO-11, US-GEO-12, US-GEO-13, US-GEO-14, US-GEO-15, US-GEO-16, US-EXPLORE-06
>
> **Punto de entrada:** `/explorar` (landing, pill búsqueda, post-login). Baseline F5 Leaflet/OSM intacto. **No** usar el ciclo F6 zoom/pan → `radiusKm`.
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Layout **mapa-primero**. Desktop: mapa sticky dominante (~+20% alto vs F5); catálogo en panel que **no** empuja el viewport del mapa. Móvil (`<=640px`): **mapa arriba**, lista debajo. FilterBar + **Usar mi ubicación** en banner; CompactAddressBar (dirección, favoritas, Guardar); slider overlay pie de mapa.
> 2. `[Primera carga]` → Invitado o sin `UserAddress`: centro **San Nicolás de los Garza** `25.7475, -100.2830` y radio **10 km**. CLIENT con favoritas: **última usada** (`lastUsedAt`) o `isDefault`; radio 10 salvo `radiusKm` ya en URL. **No** `localStorage` como origen. GET ` /api/providers?lat&lng&radiusKm&page=1&limit=20`.
> 3. `[Pan o pinch/zoom]` → Solo cambia la **vista**. Slider, círculo (km), URL `radiusKm`, lista y markers **no cambian**. **Cero** refetch.
> 4. `[Slider 1–25 km]` → Círculo cubre esos km; mapa **encuadra** el círculo (`fitBounds`); refetch lista + markers. Clamp 1–25; hint “Máximo 25 km” si tope. `prefers-reduced-motion`: encuadre instantáneo.
> 5. `[Usar mi ubicación / dirección / favorita]` → Pin al nuevo centro; radio vigente (default 10 si no hay valor); slider operable (no NaN). Elegir favorita llama `POST /api/users/me/addresses/[id]/use`. Guardar sin sesión → `/login?redirect=/explorar` (pin en sessionStorage **solo** como cola post-login, no como fuente de verdad).
> 6. `[Búsqueda q]` → Placeholder “Buscar fruterías, frutas, verduras”. `q` ≥ 2: unión nombre comercial **o** producto vendible activo, **AND** radio/filtros. Página 1. `q` de 1 carácter: no GET (o 400) — hint “Escribe al menos 2 caracteres”.
> 7. `[Resultado]` → Copy **“N fruterías a R km”** con N = `meta.total`, R = `meta.radiusKm` (nunca `data.length`). Lista ≤20 cards; paginación si `totalPages` > 1. Página 2 **no** resetea mapa ni radio. Markers = página actual **o** result set de la página (mismo GET); nombres **ocultos** en reposo.
> 8. `[Hover / tap marker]` → Tooltip con `businessName`. Segundo tap o CTA de card abre preview (`UF-EXPLORE-05`).
> 9. `[Refetch en curso]` → Lista: `BrandLoader` tamaño **loading** (64px), loop B1→B3, `aria-busy="true"`, sr-only “Buscando fruterías”. Mapa, círculo y slider visibles y operables. No splash. Paginación no mueve el viewport del mapa.
> 10. `[Empty total=0]` → Fetch **200** terminado: mismo loop **tamaño empty** (80px, +25%), `aria-busy=false`, copy F5 “No hay fruterías en este radio” + **Ampliar radio** + Limpiar filtros (y Limpiar búsqueda si hay `q`). Mapa y círculo siguen.
>
> **Condicionales:**
> - **Error API / red:** → ErrorBanner + Reintentar; **conservar lista previa**; **no** empty borrega.
> - **Teselas OSM caídas:** → Banner “El mapa no cargó; usa la lista” (F5). Lista usable.
> - **GPS denegado:** → Se queda SN o favorita; mensaje no bloqueante. Lista no vacía por denegar GPS.
> - **Coords XOR / fuera bbox:** → No inventar toast técnico; ErrorBanner genérico + Reintentar.
> - **`prefers-reduced-motion: reduce`:** → Loader **solo B1**; `fitBounds` sin animación Leaflet.
> - **Invitado + API favoritas 401:** → CompactAddressBar en modo guest; default SN.
>
> **Reglas UI:**
> - Filtro = Haversine `lat`, `lng`, `radiusKm`. **Cero** bbox Must. **Cero** clustering. **Cero** Google Maps JS.
> - CTA ubicación ≥44px; slider teclado; círculo no tapa attribution OSM ni CTA.
> - Tokens: `loader.size.loading` 64px vs `loader.size.empty` 80px. Mismos PNG B1–B3.
> - Wireframes: `WF-explorar-mapa-primero.md`, preview `WF-explorar-preview.md`.
> - Base F5 (solo lectura): `../../fase-5/user-flows/UF-GEO-01-mapa-leaflet-radio.md`. F6 zoom-radio **superado**.
>
> **API esperada:**
> - `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=&limit=20` — `meta.total`, `meta.radiusKm` (Arquitecto F7).
> - `GET /api/users/me/addresses` — orden last-used; CLIENT.
> - `POST /api/users/me/addresses/[id]/use` — stamp last-used.
> - `GET/POST/PATCH/DELETE /api/users/me/addresses` — CRUD F4.
>
> **Referencias:** `CO-F7-001`, D-F7-UX-1…7, ADR-026, ADR-027.
