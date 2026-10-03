# User Story — US-POS-06

> **ID:** US-POS-06  
> **Título:** Autodetección del modelo de báscula conectado  
>
> **Como:** PROVIDER usando el POS  
> **Quiero:** que el sistema identifique automáticamente el modelo de báscula al conectar el puerto  
> **Para:** no tener que buscar manualmente el driver correcto cada vez  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que conecto una báscula de un modelo soportado, cuando el navegador expone su `usbVendorId`/`usbProductId`, entonces el sistema selecciona automáticamente el driver/parser correcto del registro (`drivers/registry.ts`) sin intervención del proveedor.
> - [ ] **Escenario 2 (Modelo desconocido):** Dado un modelo no registrado, cuando se conecta, entonces se muestra un selector manual con los modelos soportados y se guarda la elección (`localStorage`) para la próxima vez.
> - [ ] **Escenario 3 (Preferencia recordada):** Dado que ya elegí un modelo antes en este dispositivo, cuando vuelvo a conectar, entonces se usa esa preferencia sin volver a preguntar, salvo que falle la lectura.
> - [ ] **Regla de Negocio:** El catálogo inicial de modelos soportados (Must) se acota al hardware piloto disponible; la arquitectura debe permitir agregar drivers nuevos sin cambiar el resto del POS.
>
> **UX:** Pendiente diseño (`UF-POS-02`, selector de modelo). **QA:** pendiente matriz.
