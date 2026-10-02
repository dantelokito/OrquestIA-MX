> **Flujo:** Explorar con mapa Google, radio y direcciones favoritas
> **Historia de Usuario Asociada:** US-GEO-01, US-GEO-02, US-GEO-03
>
> **Punto de entrada:** `/explorar` (landing, pill búsqueda, o post-login CLIENT)
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Split lista + mapa. El mapa es **Google Maps JS API** (reemplaza Leaflet). FilterBar F2 (categoría, q, verified) permanece.
> 2. `[LocationBar]` → Usuario pulsa **Usar mi ubicación** (Geolocation API) o arrastra el pin, o busca una dirección en el picker.
> 3. `[Slider radio]` → Ajusta 1–25 km. Lista y markers se filtran **sin recargar** la página (`lat`, `lng`, `radiusKm` en query + `GET /api/providers`).
> 4. `[Lista]` → Resultados ordenados por cercanía cuando hay ubicación; cada card sigue siendo clicable (alternativa a11y al mapa).
> 5. `[Guardar dirección]` → Si autenticado: modal etiqueta (ej. "Casa") → crea favorita. Si invitado: login/registro con pin preservado, luego guardar.
> 6. `[Selector favoritas]` → Si hay direcciones guardadas, elige una en vez de repetir el picker. Una puede ser `isDefault`.
>
> **Condicionales:**
> - **Permiso geolocalización denegado:** → Explorar por ciudad/categoría como F2; CTA "Activar ubicación o buscar dirección". Mapa centrado en Monterrey default.
> - **Sin resultados en radio:** → EmptyState "No hay fruterías en este radio" + CTA **Ampliar radio** (sube slider) y secundario "Limpiar filtros".
> - **Loading:** → SkeletonCard en lista + mapa `animate-pulse` / tiles cargando.
> - **Error API 400 (radio/coords inválidos):** → ErrorBanner + reset a radio 10 km y bounding Nuevo León.
> - **Error red:** → ErrorBanner + Reintentar; lista previa se conserva si existía.
> - **Maps JS falla (bloqueador / quota):** → Lista completa usable; banner "El mapa no está disponible; usa la lista".
>
> **Reglas UI:**
> - CTA dominante de ubicación: **Usar mi ubicación** / **Guardar dirección** según contexto; CTA de descubrimiento sigue siendo clic en tarjeta.
> - Radio es **filtro adicional**, no sustituye `city`/`category`/`q`/`verified`.
> - Default radio si hay coords sin `radiusKm`: **10 km**.
> - Lista siempre visible (WCAG AA — no mapa-only).
> - Wireframe: `WF-explorar-geo.md`.
>
> **API esperada:**
> - `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=` — Haversine; orden distancia asc.
> - `GET /api/users/me/addresses` — favoritas (auth)
> - `POST /api/users/me/addresses` — `{ lat, lng, formattedAddress, label, isFavorite, isDefault? }`
>
> **Referencias:** `UF-CLIENT-01-explorar.md`, `UF-EXPLORE-02-filtros.md`, `WF-explorar.md` (F1/F2 base).
