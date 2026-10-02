> **Flujo:** Explorar — zoom y slider son el mismo radio Haversine; loader borrega al refetch
> **Historia de Usuario Asociada:** US-GEO-07, US-GEO-08 (delta F6 sobre US-GEO-04/05; Leaflet F5 intacto)
>
> **Punto de entrada:** `/explorar` (landing, pill búsqueda, o post-login CLIENT / invitado). Layout F5 vigente: FilterBar + CTA ubicación en banner, CompactAddressBar, lista + mapa Leaflet/OSM, slider overlay pie de mapa.
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Split lista + mapa F5. Si hay coords, el **círculo de cobertura está siempre visible**. Attribution OSM y CTA **Usar mi ubicación** no se tapan.
> 2. `[Zoom o pan]` → Al **terminar** el gesto (`moveend` / `zoomend`, debounce ~300 ms), el FE deriva `radiusKm` = distancia centro (pin) → borde más cercano del viewport, `round` y clamp 1–25. El slider se mueve al mismo valor; el círculo se redibuja; `GET /api/providers?lat&lng&radiusKm` refresca **lista y markers al mismo result set**. URL `lat`/`lng`/`radiusKm` hidratada.
> 3. `[Slider 1–25 km]` → Al cambiar el radio, el círculo cubre esos km, el mapa **encuadra** el círculo (`fitBounds`) y la lista se filtra igual **sin recargar** la página. Back/forward restaura pin y radio.
> 4. `[Refetch en curso]` → La **lista** muestra `BrandLoader` (loop B1 → B2 → B3) con `aria-busy="true"` y sr-only "Buscando fruterías". El mapa, el círculo y el slider **siguen visibles y operables**. No splash a pantalla completa. Skeleton / `animate-pulse` **no** es el Must.
> 5. `[Resultado]` → Se quita el loader. Cards o empty F5 "No hay fruterías en este radio" + **Ampliar radio**. Markers = lista.
>
> **Condicionales:**
> - **Clamp 25 km:** → Si el visualizador pediría > 25 km, `radiusKm` y el círculo se quedan en **25**, slider al tope, `RadiusClampHint` no bloqueante ("Máximo 25 km"). No se llama bbox. GET con `radiusKm=25`.
> - **Pin fuera del viewport:** → No recalcular radio; conservar último `radiusKm`; no refetch por derivación.
> - **Error de red al refetch:** → Quitar loader; ErrorBanner + Reintentar; **conservar la lista previa** si existía (espíritu F5).
> - **Empty radio:** → Copy F5 + Ampliar radio (sube slider) + Limpiar filtros. Mapa y círculo siguen.
> - **Teselas OSM caídas:** → Banner "El mapa no cargó; usa la lista" (F5). Loader no aplica al mapa.
> - **`prefers-reduced-motion: reduce`:** → Loader muestra **solo B1**, sin loop.
> - **Refetch muy rápido:** → Debounce evita flash vacío; no sustituir la lista por loader si la respuesta llega antes del umbral visual (~150 ms opcional).
> - **Permiso geo denegado / sin coords:** → F5 intacto (centro Monterrey, lista no vacía). Sin círculo hasta que haya pin.
>
> **Reglas UI:**
> - Filtro de negocio = Haversine F4 (`lat`, `lng`, `radiusKm`). **Cero** API bbox Must. **Cero** clustering F6 (Won't).
> - Motor Leaflet + OSM (`US-GEO-06`) intacto. No reintroducir Maps JS.
> - El Should F5 "sincronizar lista al viewport" queda **superado**: ahora el viewport mueve el **mismo** `radiusKm`, no un recorte bbox.
> - CTA dominante de ubicación: **Usar mi ubicación**. Slider operable por teclado; círculo no tapa attribution ni el CTA.
> - Loader: componente reutilizable `BrandLoader` / `LoaderBorrega`. Frames oficiales en `comun/brand/loader-borrega/` (PM); runtime FE `public/brand/loader-borrega/B1.png` … `B3.png`.
> - Intervalo de frame ~400–600 ms. F6 lo exige en Explorar; otros módulos pueden invocarlo después.
> - Wireframe: `WF-explorar-zoom-radio.md`. Base F5 (solo lectura): `../../fase-5/user-flows/UF-GEO-01-mapa-leaflet-radio.md`, `../../fase-5/wireframes/WF-explorar-leaflet.md`.
>
> **API esperada:**
> - `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=` — **sin cambio de query** (nota Arquitecto F6). Backend no implementa GEO en este slice.
> - `GET/POST /api/users/me/addresses` — favoritas F4 intactas.
>
> **Referencias:** `CO-F6-002`, D-F6-9, D-F6-10, `US-GEO-06` (invariante, slice A — no rediseñar).
