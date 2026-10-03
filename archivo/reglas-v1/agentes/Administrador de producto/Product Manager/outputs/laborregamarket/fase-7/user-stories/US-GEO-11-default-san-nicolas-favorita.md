# User Story — US-GEO-11

> **ID:** US-GEO-11  
> **Título:** Primera carga en San Nicolás o última favorita del usuario  
>
> **Como:** visitante o CLIENT  
> **Quiero:** que el mapa abra en San Nicolás de los Garza, NL, salvo que ya tenga una favorita guardada en el servidor  
> **Para:** no partir de un centro vacío y reusar mi ubicación en cualquier dispositivo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Invitado / sin favoritas):** Dado que entro por primera vez a `/explorar` sin sesión o sin `UserAddress`, cuando carga el mapa, entonces el centro es **San Nicolás de los Garza, Nuevo León** (coords canónicas del Arquitecto) y radio **10 km**.
> - [ ] **Escenario 2 (Sesión con favorita):** Dado un CLIENT con al menos una favorita en backend, cuando abro `/explorar` en este u otro dispositivo, entonces se usa la **última favorita usada** (o `isDefault` si no hay last-used) con radio **10 km**.
> - [ ] **Escenario 3 (GPS posterior):** Dado el default o la favorita, cuando pulso “Usar mi ubicación” y concedo permiso, entonces el centro pasa a GPS y el slider permanece usable (`US-GEO-10`).
> - [ ] **Regla de Negocio:** ID003. D-F7-3, D-F7-4. No localStorage como fuente de verdad.
>
> **UX:** empty/primera visita vs selector favoritas. **Arquitecto:** coords SN + campo last-used si falta. **QA:** dos browsers, misma cuenta.
