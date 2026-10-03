# User Story — US-GEO-17

> **ID:** US-GEO-17  
> **Título:** Un solo control de ubicación en Explorar  
>
> **Como:** visitante o CLIENT en `/explorar`  
> **Quiero:** un control que muestre dónde estoy buscando y, al abrirlo, me deje buscar dirección, elegir favorita o guardar  
> **Para:** no pelear con tres cajas (buscar + select + guardar) en una barra de formulario  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Cerrado):** Dado `/explorar` con centro conocido, cuando la barra está en reposo, entonces hay **un** control de ubicación tipo chip/pill (≥44px alto, teclado operable) que muestra la etiqueta o dirección corta del centro. **No** conviven en la misma fila el input “Buscar dirección”, el `<select>` de favoritas y el botón “+ Guardar dirección”.
> - [ ] **Escenario 2 (Abierto):** Dado el chip, cuando lo activo (click/tap/Enter), entonces se abre un panel: **sheet** de abajo en viewport &lt; md; **popover o panel anclado** en ≥ md. El panel contiene: campo buscar dirección, lista de favoritas (o empty), acción guardar el pin actual. Cerrar con overlay, Escape o control explícito restaura el chip.
> - [ ] **Escenario 3 (Buscar):** Dado el panel abierto, cuando envío una consulta de ≥3 caracteres, entonces geocodifica como hoy (Nominatim / flujo F5–F7), cierra o actualiza el chip con el nuevo centro, y **no** cambia `radiusKm` (paridad `US-GEO-10` / `CO-F7-001`). Error &lt;3 caracteres o “no encontramos esa dirección” se muestra **dentro del panel**, no como `alert()` nativo.
> - [ ] **Regla de Negocio:** ID013. D-F8-2, D-F8-6. GPS permanece en FilterBar (`US-GEO-05`). Leaflet/OSM. El mapa no pierde viewport al abrir/cerrar el panel.
>
> **UX:** sustituye `CompactAddressBar` + `FavoriteAddressSelect` in-line. **QA:** desktop + móvil; teclado; no regresionar FilterBar ni slider.
