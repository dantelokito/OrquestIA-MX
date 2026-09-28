# User Story — US-PROF-05

> **ID:** US-PROF-05  
> **Título:** Capacidades del negocio (WhatsApp, tarjeta, mayoreo, menudeo) + operación (prep, delivery) en Perfil  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** activar o desactivar WhatsApp, pago con tarjeta en tienda, mayoreo y menudeo, y editar tiempo de preparación y entrega a domicilio, **todo en Perfil**  
> **Para:** controlar lo que Explorar ya filtra y muestra (`ProviderCapabilities`, chip Mayoreo, ETA de prep) sin pedir al admin que parchee flags  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado que el PATCH **ya** acepta `whatsappEnabled`, `acceptsCardAtStore`, `offersWholesale`, `offersRetail`, `preparationTimeMinutes` y `offersDelivery`, cuando los edito en Perfil y guardo, entonces persisten en la sucursal activa y Explorar/vitrina los consumen **con la misma semántica F9/F10** (mayoreo filtra; delivery filtra; capacidades se muestran). Prep time y `offersDelivery` **ya no** se editan en Catálogo: se **mueven** a Perfil junto con operación. Valores booleanos se envían explícitos (true/false), no se infieren.
> - [ ] **Escenario 2 (Validación/Error):** Dado `preparationTimeMinutes` fuera del rango del schema actual (o no entero), cuando guardo, entonces **400** y el valor anterior permanece. Un PROVIDER no puede mutar capacidades de **otra** sucursal (403). Sin auth → 401/403. Si el API responde 500, la UI muestra Error y no marca toggles como guardados.
> - [ ] **Regla de Negocio:** D-F14-6. **No** cambiar reglas de Explorar (chips Mayoreo/Domicilio, `ProviderCapabilities`). El proveedor **sí** puede activar `offersWholesale` (hoy solo admin vía `patchAdminProviderSchema`). Envelope ADR-003. IDOR F11. WhatsApp **cliente** (flujo de contacto) no se rediseña; solo el flag del negocio.

>
> **UX:** grupo «Capacidades» + grupo «Operación» en Perfil; toggles con label y ayuda (impacto en Explorar); 4 estados. **Arquitecto:** contrato ya existe; documentar que F14 no altera queries de Explorar. **QA:** mayoreo ON aparece en filtro Explorar; delivery OFF sale del filtro; IDOR; Catálogo ya no tiene prep/delivery.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §2.5, D-11
- **UI hoy:** `ProviderSettingsForm` (prep + delivery + Google); capacidades **sin** control

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-PROF-05-capacidades-operacion.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
