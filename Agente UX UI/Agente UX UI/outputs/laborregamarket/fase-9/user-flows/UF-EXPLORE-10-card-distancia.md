> **Flujo:** Card Explorar — distancia pin→frutería + ETA; sin precio mínimo visual
> **Historia de Usuario Asociada:** US-EXPLORE-10
>
> **Punto de entrada:** `/explorar` — `ProviderCard` en el grid bajo el mapa. Listing con o sin `lat`/`lng` de centro.
>
> **Pasos del Usuario:**
> 1. `[Card en reposo]` → Cover, `businessName`, rating si aplica, Heart, ContactCTA. **No** muestra `minPrice` ni «$X MXN desde» ni «Consultar precios» en el slot semibold. `minPrice` puede seguir en API sin pintarse.
> 2. `[Con pin / centro válido]` → Una sola fila: distancia Haversine pin→sucursal con `formatRadius`-like — «A {n} km de tu búsqueda» o «A {m} m de tu búsqueda» si &lt; 1 km — **y** ETA vía `computeEtaMinutes` (ADR-017): «~{min} min en auto»; si caminata a 5 km/h &lt; 15 min, preferir «~{min} min a pie». **No** duplicar un km gris aparte.
> 3. `[Should — barra]` → Barra proporcional `distanceKm / radiusKm` (track slate, fill `--brand` o slate-600); `aria-hidden` o `role="meter"` con valuetext. No sustituye el copy de distancia.
> 4. `[Sin pin / sin coords de listing]` → No inventar km. Ocultar fila de distancia **o** copy «Elige una ubicación para ver la distancia.»
> 5. `[Preview in-card / detalle]` → Distancia en card de lista no obliga a cambiar el contenido `US-EXPLORE-05` del preview.
>
> **Condicionales:**
> - **`distanceKm` ausente con pin:** → Tratar como sin dato; no inventar.
> - **Radio cambia:** → Barra Should se actualiza; copy usa `distanceKm` del último listing.
>
> **Reglas UI:**
> - Tipografía: distancia `text-sm font-semibold text-slate-900`; ETA `text-sm text-slate-600` en la misma fila o inmediatamente debajo sin segundo bloque de km.
> - Wireframe: `WF-explorar-card-distancia.md`.
> - **Prohibido:** pintar `sampleProducts` en la card.
>
> **API esperada:**
> - Sin delta Must. `distanceKm` ya en listing cuando hay geo. ETA = cliente ADR-017. Arquitecto `API-EXPLORE-NOTES-01`.
>
> **Referencias:** `CO-F9-001`, D-F9-UX-3, D-F9-7, ADR-017, BL-162.
