# User Story — US-EXPLORE-08

> **ID:** US-EXPLORE-08  
> **Título:** Preview hover/long-press como animación dentro del card  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** que el preview se despliegue **dentro** del mismo card al hover o long-press  
> **Para:** no perder el orden visual con un popover desanclado  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Puntero):** Dado una card en la lista, cuando dejo el puntero (delay F8) o uso el atajo/control de teclado, entonces el contenido de preview se **anima dentro del card** (no un popover desplazado). Campos = `US-EXPLORE-05` (no recortar). Escape o salir del card cierra.
> - [ ] **Escenario 2 (Touch):** Dado móvil/tablet, cuando hago **long-press**, entonces el mismo contenido se despliega in-card. Tap **corto** navega a `/fruteria/{id}`. Scroll **no** abre preview. Tras long-press, el click sintético **no** navega.
> - [ ] **Escenario 3 (Unicidad y a11y):** Un solo preview/animación abierto a la vez. Se respeta `prefers-reduced-motion` (estado expandido sin animación o transición mínima). Marker abre el mismo preview in-card de la card correspondiente (o equivalente UX documentado). Heart y `ContactCTA` se mantienen.
> - [ ] **Regla de Negocio:** DT-F9-001 / BL-160. `CO-F9-001`. Sin API Must nueva — reutilizar `GET /api/providers/[id]` (cache/debounce F8). Sign-off F8 **intacto**.
>
> **UX:** animación in-card; z-index vs mapa; altura del card expandido; `prefers-reduced-motion`. **Arquitecto:** sin endpoint nuevo. **QA:** desktop hover, iOS/Android long-press vs scroll, tap corto, teclado, un solo abierto.
