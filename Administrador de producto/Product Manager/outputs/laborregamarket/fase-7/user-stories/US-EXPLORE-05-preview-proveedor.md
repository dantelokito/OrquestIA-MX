# User Story — US-EXPLORE-05

> **ID:** US-EXPLORE-05  
> **Título:** Preview del proveedor desde Explorar  
>
> **Como:** visitante que elige una frutería en el mapa o la lista  
> **Quiero:** ver catálogo preview, si está abierta, horario, envío, tarjeta, WhatsApp, verificación, reseñas y mayoreo/menudeo  
> **Para:** decidir si entro al detalle completo  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Ficha):** Dado un proveedor en radio, cuando abro el submódulo/preview, entonces veo: catálogo **activo** en preview; estado **abierta/cerrada** (ahora, TZ Monterrey); horario en **3 columnas** (día / apertura / cierre); iconografía de **envío a domicilio**, **pago con tarjeta en sucursal**, **WhatsApp activo** (ausente = no se afirma que existe); texto **“verificado a la borrega desde MM/AAAA”** si aplica; **mayoreo y/o menudeo**.
> - [ ] **Escenario 2 (Reseñas):** Dado reseñas F4, cuando veo preview, entonces aparecen las **últimas 3**; el CTA lleva al detalle del proveedor al **div `#resenas`** (o ancla acordada UX).
> - [ ] **Escenario 3 (Catálogo):** Dado productos inhabilitados (`US-CAT-01`), cuando preview carga, entonces **no** se muestran. Los visibles reflejan el catálogo actual (API, no mock estático).
> - [ ] **Regla de Negocio:** ID009. D-F7-6. Sin Maps JS. Horario vacío = estado “horario no publicado”, no crash.
>
> **UX:** sheet/página; 44px CTAs. **Arquitecto:** contrato detalle/preview. **QA:** abierta vs cerrada; sin WhatsApp.
