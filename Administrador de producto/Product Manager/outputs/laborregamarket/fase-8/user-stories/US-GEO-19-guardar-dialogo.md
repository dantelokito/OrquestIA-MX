# User Story — US-GEO-19

> **ID:** US-GEO-19  
> **Título:** Guardar dirección en un diálogo de la app  
>
> **Como:** CLIENT autenticado (o invitado que quiere persistir el pin)  
> **Quiero:** nombrar y guardar el centro actual sin el prompt nativo del navegador  
> **Para:** que guardar se sienta parte de Explorar y no un recuadro del sistema  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (CLIENT con pin):** Dado sesión y un pin/centro activo, cuando pulso guardar en el panel, entonces aparece un **diálogo in-app** (no `window.prompt`) con campo etiqueta (máx. 40, placeholder tipo “Casa, Trabajo”), preview de `formattedAddress`, Confirmar y Cancelar. Al confirmar se crea `UserAddress` (`lat`/`lng`/`formattedAddress`/`isFavorite`) y la nueva fila queda seleccionada en la lista y en el chip.
> - [ ] **Escenario 2 (Invitado / sin pin / tope):** Dado invitado, cuando pulso guardar, entonces login/registro y se preserva el pin para guardar después (paridad `US-GEO-14`). Dado sin pin, guardar está deshabilitado o explica que hace falta un centro. Dado 20 direcciones, el API rechaza; la UI muestra el límite con copy no técnico y no deja un estado a medias.
> - [ ] **Escenario 3 (Validación):** Dado el diálogo abierto, cuando la etiqueta queda vacía o solo espacios, entonces no se envía y se pide un nombre. Escape / Cancelar cierra sin crear.
> - [ ] **Regla de Negocio:** ID015. D-F8-4. Extiende `US-GEO-03` / `US-GEO-14`. Máximo una `isDefault=true`. `window.prompt` **no** forma parte de este flujo.
>
> **UX:** diálogo accesible (foco, Escape, ≥44px). **QA:** invitado, tope 20, etiqueta vacía.
