# User Story — US-GEO-20

> **ID:** US-GEO-20  
> **Título:** El chip dice el centro; el conteo sigue siendo el total del radio  
>
> **Como:** visitante en `/explorar`  
> **Quiero:** ver dónde busco en el control de ubicación y cuántas fruterías hay, sin dos líneas que repiten el centro  
> **Para:** ganar espacio y no leer “Centro: Casa Del” debajo de un select que ya dice Casa Del  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Chip = centro):** Dado un centro con etiqueta (favorita, geocode o “Mi ubicación”), cuando la barra está en reposo, entonces el chip muestra esa etiqueta o una dirección corta. **No** hay un `<p>` suelto “Centro: {pinLabel}” bajo los controles.
> - [ ] **Escenario 2 (Conteo):** Dado `total` del API y radio R del slider, cuando hay resultados, entonces se muestra “N fruterías a R km” (y sufijo `para "q"` si hay búsqueda de producto). N = `total`, no `items.length` (paridad `US-GEO-13`). El conteo vive junto al chrome o al mapa; UX fija el sitio, **no** lo elimina.
> - [ ] **Escenario 3 (GPS denegado):** Dado permiso de geolocalización rechazado, cuando aplica, entonces el aviso no técnico de F5/F7 se mantiene (buscar o usar favorita; default SN). No se sustituye por coords crudas como mensaje principal.
> - [ ] **Regla de Negocio:** ID016. D-F8-5. Empty `total=0` sigue `US-GEO-16` (borrega). Error de API ≠ empty.
>
> **UX:** jerarquía chip (dónde) + conteo (cuántas). **QA:** no regresionar `US-GEO-13` ni empty borrega.
