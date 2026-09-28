# User Story — US-DASH-08

> **ID:** US-DASH-08  
> **Título:** Filtro de fechas inicio–fin y atajo de un mes  
>
> **Como:** PROVIDER en Reportes  
> **Quiero:** elegir un mes o capturar fecha inicio y fecha final  
> **Para:** ver ventas de ese intervalo, no solo “hoy y 7 días”  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Atajo mes):** Dado el selector de **un** mes (MM/AAAA, TZ America/Monterrey), cuando lo aplico, entonces fecha inicio = día 1 de ese mes y fecha fin = último día del mismo mes, y el reporte (`US-DASH-07`) usa ese rango.
> - [ ] **Escenario 2 (Rango / error):** Dado inicio y fin capturados, cuando inicio ≤ fin y el span no supera el tope (p. ej. 366 días, Arch), entonces el reporte cubre ese intervalo inclusive. Si inicio > fin o el tope se excede, 400 o validación inline **sin** mutar datos. Puedo editar inicio/fin después del atajo de mes.
> - [ ] **Regla de Negocio:** D-F10-9. El rango es el filtro **real**; el mes es solo atajo. Un mes a la vez (no multi-mes). Grano día/mes/año de `US-DASH-04` (F6, solo lectura) puede coexistir como vista previa; este corte no lo reescribe.

>
> **UX:** date pickers + selector mes; teclado. **Arquitecto:** `from`/`to` query. **QA:** atajo rellena rango; 400 si inválido.
