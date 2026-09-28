> **Flujo:** Explorar fruterías — mapa + tarjetas
> **Historia de Usuario Asociada:** — (BL-004, BL-011; persona María CLIENT)
>
> **Punto de entrada:** `/explorar`, CTA landing "Explorar fruterías", búsqueda header → `/explorar?q=`
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Usuario ve split view: lista tarjetas + mapa Leaflet.
> 2. `[FilterBar]` → Usuario activa chips (verificado, frutas, verduras) → lista y mapa se filtran.
> 3. `[Hover/Focus tarjeta]` → Marcador correspondiente en mapa se resalta (sync bidireccional).
> 4. `[Clic tarjeta o marcador]` → navega a `/fruteria/[id]`.
> 5. `[Búsqueda header]` → Usuario escribe término → submit → `/explorar?q=termino` → API filtra por `q`.
> 6. `[Paginación]` → Usuario navega páginas si hay más resultados.
>
> **Condicionales:**
> - **API loading:** → SkeletonCard en grid + mapa placeholder gris.
> - **Sin resultados:** → EmptyState "No encontramos fruterías con esos filtros" + CTA limpiar filtros.
> - **Error API:** → ErrorBanner + botón "Reintentar".
> - **Éxito:** → Grid con N tarjetas + mapa con price bubbles.
>
> **Reglas UI:**
> - Objetivo carga < 2s en 4G (skeleton mientras carga).
> - Lista es alternativa accesible al mapa (no depender solo de mapa).
> - Contador: "Más de {n} fruterías en Monterrey".
