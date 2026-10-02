> **Flujo:** Activar capacidades (WhatsApp, tarjeta, mayoreo, menudeo) y operación (prep, delivery) en Perfil
> **Historia de Usuario Asociada:** US-PROF-05
>
> **Punto de entrada:** `/proveedor/perfil` → bloques **Capacidades** y **Operación**. CTA único del conjunto: **Guardar capacidades**.

> **Pasos del Usuario:**
> 1. `[Capacidades]` → Toggles con label visible (no solo color): WhatsApp, Pago con tarjeta en tienda, Mayoreo, Menudeo. Cada uno envía boolean explícito.
> 2. `[Ayuda por toggle]` → WhatsApp: «Muestra contacto WhatsApp en la vitrina (el chat del cliente no cambia)». Tarjeta: «Se muestra en capacidades de Explorar». Mayoreo: «Activa el filtro Mayoreo de Explorar». Menudeo: «Se muestra en capacidades».
> 3. `[Operación]` → Tiempo de preparación (minutos, rango vigente 5–120) + toggle Entrega a domicilio («Activa el chip Domicilio de Explorar»). Estos controles **salen** de Catálogo.
> 4. `[Guardar]` → PATCH existente; Explorar/vitrina consumen semántica F9/F10 **sin** rediseño de mapa, chips ni WhatsApp cliente.
> 5. `[Condicional — prep fuera de rango]` → 400 inline «El tiempo de preparación debe estar entre 5 y 120 minutos»; valor anterior permanece. 5xx: Error, toggles no se marcan como guardados.
> 6. `[IDOR]` → No muta otra sucursal (403).

> **Reglas UI:**
> - Toggles `role="switch"` ≥44px, `aria-checked`, label asociado.
> - Un CTA dominante para capacidades+operación (mismo PATCH conceptual).
> - 4 estados del bloque.
> - Wireframe: `WF-PROF-01-05-perfil.md`.

## Inputs Utilizados

- **US:** `US-PROF-05-capacidades-operacion.md`
- **PRD:** D-F14-6
- **UI hoy:** prep + delivery en `ProviderSettingsForm`; capacidades sin control

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-PROF-05-capacidades.md`
- **Agente Downstream:** Frontend Developer
