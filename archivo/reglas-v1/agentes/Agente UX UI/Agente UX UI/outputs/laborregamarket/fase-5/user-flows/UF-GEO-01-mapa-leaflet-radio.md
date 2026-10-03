> **Flujo:** Explorar con mapa Leaflet/OSM, ubicación en banner y radio al pie del mapa
> **Historia de Usuario Asociada:** US-GEO-04, US-GEO-05 (delta F5 sobre US-GEO-01/02/03)
>
> **Punto de entrada:** `/explorar` (landing, pill búsqueda, o post-login CLIENT / invitado)
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Split lista + mapa. El mapa es **Leaflet + teselas OpenStreetMap** (revoca Google Maps JS de F4 / `CO-F5-001`). FilterBar F2 (categoría, q, verified) permanece. Attribution OSM visible en el mapa.
> 2. `[Banner superior]` → Junto a FilterBar, pulsa **Usar mi ubicación** (Geolocation API, target ≥44px). No vive dentro del mapa ni en la LocationBar F4.
> 3. `[Barra compacta]` → Busca una dirección, elige una favorita F4 (`US-GEO-03`) o guarda una nueva. Sin slider de radio ni CTA de geolocalización aquí.
> 4. `[Overlay radio — pie del mapa]` → Ajusta slider 1–25 km (default 10). Círculo Haversine y lista se actualizan **sin recargar** (`lat`, `lng`, `radiusKm` en query + `GET /api/providers`). El slider no vuelve a la LocationBar F4.
> 5. `[Lista]` → Resultados ordenados por cercanía cuando hay ubicación; cada card sigue siendo clicable (alternativa a11y al mapa). Markers del mapa = mismo result set.
> 6. `[Pin]` → Arrastra el pin en el mapa o usa geocode/favorita; URL se hidrata; back/forward restaura pin y radio.
>
> **Condicionales:**
> - **Permiso geolocalización denegado:** → Mapa centrado en Monterrey / última posición; mensaje no bloqueante invita a buscar dirección o usar favorita; la lista **no** se vacía.
> - **Sin resultados en radio:** → EmptyState "No hay fruterías en este radio" + CTA **Ampliar radio** (sube slider) y secundario "Limpiar filtros".
> - **Loading:** → SkeletonCard en lista + área de mapa `animate-pulse` / teselas cargando.
> - **Error API 400 (radio/coords inválidos):** → ErrorBanner + reset a radio 10 km y bounding Nuevo León.
> - **Error red (lista/API):** → ErrorBanner + Reintentar; lista previa se conserva si existía.
> - **Teselas OSM no cargan (red):** → Estado de error **del mapa**; **la lista sigue usable**. Copy: "El mapa no cargó; usa la lista". **Ya no existe** el fallback F4 "Mapa no disponible por falta de API key" (cierra OBS-F4-023).
> - **Guest guarda dirección:** → Redirect `/login?redirect=/explorar` + pin en sessionStorage (F4 intacto).
>
> **Should (no sustituyen el radio):**
> - Clustering de markers al alejar zoom.
> - Sincronizar la lista al viewport al pan/zoom (debounce); el filtro de negocio sigue siendo Haversine, no bbox Must.
>
> **Reglas UI:**
> - CTA dominante de ubicación: **Usar mi ubicación** en el banner. CTA de descubrimiento: clic en tarjeta.
> - Radio es **filtro adicional**, no sustituye `city`/`category`/`q`/`verified`.
> - Default radio si hay coords sin `radiusKm`: **10 km**.
> - Lista siempre visible (WCAG AA — no mapa-only). Tab order: FilterBar + CTA ubicación → barra compacta → lista → mapa (slider overlay operable por teclado).
> - Embed/enlace Google de reseñas (`US-REV-03`) no forma parte de este flujo.
> - Wireframe: `WF-explorar-leaflet.md`. Base F4 (solo lectura): `../../fase-4/wireframes/WF-explorar-geo.md`.
>
> **API esperada:**
> - `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=` — Haversine F4 intacto; orden distancia asc. Sin contrato Must de bounding box.
> - `GET/POST /api/users/me/addresses` — favoritas (auth)
>
> **Referencias:** `UF-GEO-01` F4 (delta), `UF-CLIENT-01-explorar.md`, `UF-EXPLORE-02-filtros.md`, `CO-F5-001`.
