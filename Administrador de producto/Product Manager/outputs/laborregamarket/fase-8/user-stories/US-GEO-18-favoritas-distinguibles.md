# User Story — US-GEO-18

> **ID:** US-GEO-18  
> **Título:** Favoritas distinguibles y borrables en el panel  
>
> **Como:** CLIENT autenticado  
> **Quiero:** ver cada favorita con nombre y calle, y borrar las que ya no uso  
> **Para:** no elegir a ciegas cuando varias se llaman “Casa QA F4”  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Lista):** Dado sesión CLIENT con N `UserAddress` (N≥2, dos con el mismo `label`), cuando abro el panel de ubicación, entonces cada fila muestra **`label` y `formattedAddress`**. Elegir una fila centra el mapa en esa favorita (paridad `US-GEO-14` / `lastUsedAt`) y actualiza el chip. **No** se usa `<select>` nativo como UI de esta lista.
> - [ ] **Escenario 2 (Vacío / invitado):** Dado invitado o CLIENT sin direcciones, cuando abro el panel, entonces empty no técnico (“Aún no tienes direcciones guardadas”) + CTA guardar si hay pin, o login si es invitado. El chip sigue mostrando el centro actual (SN o pin).
> - [ ] **Escenario 3 (Borrar):** Dado una favorita en la lista, cuando confirmo borrar, entonces `DELETE` de esa `UserAddress` y desaparece de la lista (y en otro dispositivo con la misma cuenta). Si era el centro activo, el pin **se queda** en esas coords (no salta a SN) y el chip muestra la dirección formateada, no un id huérfano. Cancelar no borra.
> - [ ] **Regla de Negocio:** ID014. D-F8-3, D-F8-7. Tope 20 (`AddressLimitError`) se respeta; no fusionar IDs con el mismo `label`. Orden: última usada / default / reciente (paridad API F7). Should: filtrar la lista si N es alto (≤20).
>
> **UX:** filas ≥44px; confirmación de borrado no accidental. **Arquitecto:** sin API nueva; envelope del DELETE existente. **QA:** dos labels iguales; borrar la activa; segundo browser.
