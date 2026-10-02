# User Story — US-EXPLORE-07

> **ID:** US-EXPLORE-07  
> **Título:** Preview de frutería al hover o long-press, sin botón «Vista rápida»  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** previsualizar la frutería al pasar el mouse o al mantener presionada la card, y entrar al detalle con un clic o tap corto  
> **Para:** no depender de un botón y distinguir peek vs ficha completa  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Puntero):** Dado una card en la lista, cuando dejo el puntero sobre ella (con delay, no instantáneo) o muevo el puntero al preview, entonces se abre un **preview anclado a la card** con el contenido de `US-EXPLORE-05`. **No** existe el botón «Vista rápida». Clic corto en la card navega a `/fruteria/{id}`. Escape o salir del conjunto card+preview cierra.
> - [ ] **Escenario 2 (Touch):** Dado móvil o tablet, cuando hago **long-press** en la card, entonces se abre el **mismo** preview. Un tap **corto** navega al detalle. El scroll de la lista **no** abre preview. Tras un long-press, el `click`/`click` sintético **no** navega al detalle.
> - [ ] **Escenario 3 (Teclado y mapa):** Dado teclado, cuando la card tiene foco, entonces puedo abrir el preview **sin** el botón visible (atajo o control revelado al foco; UX documenta cuál). Tap en **marker** abre el mismo preview. Heart y `ContactCTA` de la card se mantienen.
> - [ ] **Regla de Negocio:** ID020. `CO-F8-003`. Campos = `US-EXPLORE-05` (no recortar). Un solo preview abierto a la vez. Sin Maps JS. Sin sustituir la navegación al detalle.
>
> **UX:** delay hover; z-index vs mapa; recorte en la última fila del grid; `prefers-reduced-motion`. **Arquitecto:** mismo GET detalle; debounce/cache hover. **QA:** desktop hover, iOS/Android long-press vs scroll, tap corto, teclado, marker.
