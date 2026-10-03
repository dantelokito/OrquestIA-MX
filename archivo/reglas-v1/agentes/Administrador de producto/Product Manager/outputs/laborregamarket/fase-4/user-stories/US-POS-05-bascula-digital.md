# User Story — US-POS-05

> **ID:** US-POS-05  
> **Título:** Conectar báscula digital y autollenar el peso en el POS  
>
> **Como:** PROVIDER usando el POS  
> **Quiero:** conectar una báscula digital por USB/serial y que el peso se capture solo  
> **Para:** no teclear el peso a mano en cada venta de fruta a granel  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que tengo una báscula compatible conectada, cuando pulso "Conectar báscula" y autorizo el puerto (WebSerial/WebHID), entonces la lectura de peso llena `quantity` de la línea activa respetando su `unitOfMeasure` (KG/GR).
> - [ ] **Escenario 2 (Sin soporte del navegador):** Dado un navegador sin soporte WebSerial/WebHID, cuando intento conectar, entonces veo mensaje claro y puedo seguir tecleando el peso manualmente (flujo F3 no se rompe).
> - [ ] **Escenario 3 (Desconexión):** Dado que la báscula se desconecta durante la venta, cuando ocurre, entonces el POS lo indica visualmente y permite reconectar o continuar en modo manual.
> - [ ] **Regla de Negocio:** El peso leído es editable manualmente después de autollenarse (el proveedor puede corregir). No se persiste ningún dato del periférico en la orden, solo el `quantity` resultante.
>
> **UX:** Pendiente diseño (`UF-POS-02`). **QA:** pendiente matriz (requiere hardware o mock de puerto serial).
