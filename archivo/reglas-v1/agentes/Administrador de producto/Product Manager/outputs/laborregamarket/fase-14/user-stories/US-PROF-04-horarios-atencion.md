# User Story — US-PROF-04

> **ID:** US-PROF-04  
> **Título:** Horarios de atención en Perfil  
>
> **Como:** PROVIDER (sucursal activa)  
> **Quiero:** capturar y editar los horarios de atención de **mi** frutería en Perfil  
> **Para:** que la vitrina y Explorar muestren `HoursTable` con datos reales, no solo seed  
>
> **Criterios de Aceptación (Definition of Done):**
> - [ ] **Escenario 1 (Exitoso):** Dado el PATCH actual que **ya** acepta `openingHours` (`openingHoursSchema`: 7 días, `HH:mm` 24h, `open < close`, día único), cuando en Perfil guardo un horario válido, entonces se persiste y `HoursTable` en Explorar / `/fruteria/[id]` lo muestra **sin** cambiar semántica. Puedo indicar un día cerrado según el contrato existente (campo `closed` o ausencia de intervalo, lo que el schema vigente exija). El control vive en `/proveedor/perfil`, no en Catálogo.
> - [ ] **Escenario 2 (Validación/Error):** Dado `open >= close`, hora no `HH:mm`, día duplicado o payload que el Zod actual rechaza, cuando guardo, entonces **400** con mensaje de validación **visible** en el formulario (no silencio). Sucursal ajena → **403**. Sin auth → **401/403**. Fallo de red: Error recuperable; el horario anterior permanece.
> - [ ] **Regla de Negocio:** D-F14-6. **No** se inventa un segundo formato de horarios. F14 es UI + persistencia del contrato **existente**. Envelope ADR-003. IDOR F11. Explorar no se rediseña: solo consume el JSON nuevo.

>
> **UX:** editor de 7 días alineado a `HoursTable` (lectura cliente ya existe); 4 estados; un CTA Guardar horarios. **Arquitecto:** sin campo nuevo si el schema basta; documentar shape exacto en API. **QA:** 400 `open >= close`; vitrina refleja el horario; IDOR.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` §2.5, D-11
- **Contrato hoy:** `openingHoursSchema` en `provider-settings.ts`; UI de captura **ausente**

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-stories/US-PROF-04-horarios-atencion.md`
- **Agente Downstream:** UX, Arquitecto, Backend, Frontend, QA
