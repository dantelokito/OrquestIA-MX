# User Story — US-INV-03

> **ID:** US-INV-03  
> **Título:** Capacidad, barra porcentual, umbral 10% y sobre-tope  
>
> **Como:** PROVIDER  
> **Quiero:** un tope de capacidad por producto, ver la barra como porcentaje, una alerta de poca existencia (default 10%) que pueda apagar, y poder superar el máximo  
> **Para:** ver de un vistazo qué tan lleno está el almacén sin que el sistema me bloquee  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado un SKU con tope definido por el dueño, cuando el on-hand es X, entonces la barra muestra X/tope como porcentaje. El umbral de alerta default es **10%** del tope. Puedo cambiar el umbral, **apagar** la alerta de ese producto, y **subir el máximo**. Si on-hand supera el tope, la barra puede mostrar **más de 100%** y la entrada **no** se rechaza.
> - [ ] **Escenario 2 (Validación/Error):** Dado tope vacío, cero o negativo, cuando intento guardarlo, entonces no se persiste un tope inválido y veo validación. Dado alerta apagada, cuando el on-hand cae bajo el umbral, entonces **no** se muestra alerta de poca existencia para ese SKU.
> - [ ] **Regla de Negocio:** D-F12-6, D-F12-8. Tope y umbral **por producto** de la sucursal. Superar tope no bloquea entrada ni venta. Barra no es kardex.

>
> **UX:** barra + controles tope/umbral/alerta. **Arquitecto:** campos por oferta sucursal. **QA:** >100% y alerta off.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-12/prd.md`
- **Impacto:** `outputs/laborregamarket/fase-12/impacto-modulos.md`
- **Backlog:** `BL-202`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-stories/US-INV-03-capacidad-barra-alerta.md`
- **Agente Downstream:** UX/UI, Arquitecto, Backend, Frontend, QA
- **Fase / Proyecto:** 12 / laborregamarket
