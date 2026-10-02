> **Flujo:** Explorar — chip de ubicación; radio 500 m–10 km; mapa México; pan ≠ radio
> **Historia de Usuario Asociada:** US-GEO-17, US-GEO-18, US-GEO-19, US-GEO-20, US-GEO-21, US-GEO-22, US-GEO-23
>
> **Punto de entrada:** `/explorar` (landing, pill búsqueda, post-login). Baseline F7 mapa-primero y Leaflet/OSM intactos. **No** usar el ciclo F6 zoom/pan → `radiusKm`. Contenido preview: `UF-EXPLORE-07`.
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Layout **mapa-primero** (F7). FilterBar + **Usar mi ubicación** en banner (GPS **no** se mueve al panel). En reposo: **un** `LocationChip` (≥44px) con etiqueta o dirección corta del centro + `ExploreCount` “N fruterías a R km|m”. **No** conviven input “Buscar dirección”, `<select>` de favoritas y “+ Guardar” en la misma fila. **No** hay `<p>` “Centro: {pinLabel}”.
> 2. `[Primera carga]` → Invitado o sin `UserAddress`: centro **San Nicolás de los Garza** `25.7475, -100.2830` y radio **10 km**. CLIENT con favoritas: **última usada** (`lastUsedAt`) o `isDefault`. Radio URL: clamp 0.5–10 (`22` → 10, `0` → 0.5, ausente → 10). **No** `localStorage` como origen. GET `/api/providers?lat&lng&radiusKm&page=1&limit=20`.
> 3. `[Abrir chip]` → Click/tap/Enter abre panel: **sheet** de abajo si viewport `< md`; **popover anclado al chip** si `≥ md`. El mapa **no** pierde viewport. Panel: campo buscar dirección, lista de favoritas (o empty), acción guardar el pin actual. Overlay / Escape / Cerrar restauran el chip.
> 4. `[Buscar dirección]` → Consulta ≥3 caracteres → Nominatim con `MEXICO_VIEWBOX` (no Places). Resultado en México: pin, `fitBounds` del círculo, refetch, chip actualizado, `radiusKm` **no** cambia. Error &lt;3 caracteres o “No encontramos esa dirección” **dentro del panel** (no `alert()`). Resultado fuera de MX: no aplicar pin; copy “Esa ubicación está fuera de México. Seguimos donde estabas.”
> 5. `[Favoritas]` → Cada fila muestra `label` + `formattedAddress` (filas ≥44px). **No** `<select>` nativo. Elegir → `POST .../addresses/[id]/use`, centra, actualiza chip. Empty / invitado: “Aún no tienes direcciones guardadas” + CTA guardar o login. Borrar: confirmación in-app; `DELETE`; si era la activa, el **pin se queda** y el chip muestra `formattedAddress` (no id huérfano, no salto a SN).
> 6. `[Guardar]` → Diálogo in-app (no `window.prompt`): etiqueta máx. 40, preview de dirección, Confirmar / Cancelar. Vacío o solo espacios → no envía. Invitado → `/login?redirect=/explorar` (pin en sessionStorage solo como cola). Tope 20: copy no técnico; no estado a medias. Sin pin: guardar deshabilitado o explica que hace falta un centro.
> 7. `[Pan o pinch/zoom]` → Solo cambia la **vista**, **dentro de México** (`maxBounds` + viscosidad 1.0 + `minZoom` 5). Slider, círculo, URL `radiusKm`, lista y markers **no cambian**. **Cero** refetch. Rebote en el borde; no toast técnico.
> 8. `[Slider 0.5–10 km]` → Overlay compacto (una fila): valor visible + `input[type=range]` `step=0.5` + extremos “500 m” … “10 km”. Círculo cubre esos km; mapa **encuadra** (`fitBounds` / FitCircle); refetch. **Sin** fila `RadiusClampHint`. Copy R &lt; 1 km en **metros**. CTA empty “Ampliar radio” +0.5 km, **oculto si R=10**.
> 9. `[Usar mi ubicación]` → GPS en FilterBar. Punto en MX: pin + FitCircle + refetch; radio vigente. GPS **denegado**: se queda SN o favorita; aviso F5/F7. GPS **fuera de México**: no adoptar; copy distinto al denegado; se conserva SN o último pin válido. Igual para arrastre del pin o `?lat&lng` fuera de `MEXICO_BOUNDS`.
> 10. `[Búsqueda q]` → Paridad F7: `q` ≥ 2 unión nombre ∪ producto activo. Hint 1 carácter. Página 1.
> 11. `[Resultado]` → Copy **“N fruterías a R km”** o **“… a 500 m”** con N = `meta.total`, R = `meta.radiusKm` (nunca `data.length`). Lista ≤20; paginación no resetea mapa ni radio. Markers sin label permanente.
> 12. `[Refetch / empty]` → Loader 64px loading / 80px empty (F7). Empty radio: “No hay fruterías en este radio” + **Ampliar radio** (si R &lt; 10) + Limpiar filtros. Error API ≠ empty borrega.
>
> **Condicionales:**
> - **Error API / red:** → ErrorBanner + Reintentar; **conservar lista previa**; **no** empty borrega.
> - **Teselas OSM caídas:** → Banner “El mapa no cargó; usa la lista” (F5). Lista usable.
> - **GPS denegado:** → SN o favorita; mensaje no bloqueante. ≠ GPS fuera de MX.
> - **Fuera de México (GPS / geocode / pin / URL):** → No adoptar; “Esa ubicación está fuera de México. Seguimos donde estabas.” BE Should: 400 `isInMexico` — FE no envía coords fuera; no remap silencioso a SN en servidor.
> - **`prefers-reduced-motion: reduce`:** → Loader **solo B1**; `fitBounds` sin animación Leaflet.
> - **Invitado + API favoritas 401:** → Chip en modo guest; default SN; guardar → login.
> - **Bookmark `radiusKm=22` / `=0`:** → Clamp UI+API a 10 / 0.5. **Prohibido** `Math.round` (rompe 0.5).
>
> **Reglas UI:**
> - Filtro = Haversine `lat`, `lng`, `radiusKm`. **Cero** bbox Must de lista. **Cero** clustering. **Cero** Google Maps JS. **Cero** Places.
> - Chip, filas, diálogo, slider ≥44px; teclado; Escape cierra panel y diálogo.
> - Tokens: `formatRadius(R)`; `LocationChip`; `RadiusOverlayF8`. Empty borrega F7 intacto.
> - Wireframes: `WF-explorar-ubicacion.md`, `WF-explorar-radio.md`, `WF-explorar-mapa-mexico.md`. Preview: `UF-EXPLORE-07`.
> - Base F7 (solo lectura): `../../fase-7/user-flows/UF-GEO-01-explorar-f7.md`.
>
> **API esperada:**
> - `GET /api/providers?lat=&lng=&radiusKm=&city=&category=&q=&verified=&page=&limit=20` — clamp 0.5–10; `meta.total`, `meta.radiusKm` (Arquitecto F8 `API-GEO-01`).
> - `GET /api/users/me/addresses` — orden last-used; CLIENT. **Sin ruta nueva.**
> - `POST /api/users/me/addresses/[id]/use` — stamp last-used.
> - `GET/POST/PATCH/DELETE /api/users/me/addresses` — CRUD F4/F7; `lat`/`lng` → `isInMexico`.
>
> **Referencias:** `CO-F7-001`, `CO-F8-001`, `CO-F8-002`, D-F8-UX-1…6, ADR-026, ADR-027, ADR-028.
