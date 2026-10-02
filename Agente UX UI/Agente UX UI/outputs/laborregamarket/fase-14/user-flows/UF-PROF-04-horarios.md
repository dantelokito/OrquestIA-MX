> **Flujo:** Capturar horarios de atención de 7 días alineados a HoursTable
> **Historia de Usuario Asociada:** US-PROF-04
>
> **Punto de entrada:** `/proveedor/perfil` → bloque **Horarios de atención**. CTA: **Guardar horarios**.

> **Pasos del Usuario:**
> 1. `[Editor 7 días]` → Filas en orden **Lunes → Domingo** (mismo orden que `HoursTable` / `WEEK_ORDER`: day JS 1–6, 0). Cada fila: label del día, interruptor **Cerrado**, horas `open` / `close` tipo `time` (HH:mm 24h).
> 2. `[Día cerrado]` → Toggle Cerrado ON: inputs de hora `disabled`; se envía `closed: true`, `open: null`, `close: null` (schema vigente).
> 3. `[Día abierto]` → `open < close` en el mismo día. Preview de lectura «Así lo ve el cliente» reutiliza `HoursTable` (no un segundo formato).
> 4. `[Empty inicial]` → Si no hay JSON publicado: 7 filas en blanco + hint «Mientras no guardes, Explorar muestra “Horario no publicado”». No se inventa un horario.
> 5. `[Condicional — open >= close, HH:mm inválido, día duplicado]` → 400 / validación cliente **visible** en la fila (`border-error` + mensaje). Horario anterior permanece si falla la red.
> 6. `[Guardar válido]` → PATCH `openingHours` existente. Explorar y `/fruteria/[id]` consumen **sin** rediseño.

> **Reglas UI:**
> - Un CTA Guardar horarios. Copiar día (opcional Should): no es Must; no diseñar «aplicar a todos» en F14.
> - Targets ≥44px en toggles y time inputs (móvil: una columna día / cerrado / horas).
> - 4 estados del bloque.
> - Wireframe: `WF-PROF-01-05-perfil.md`.

## Inputs Utilizados

- **US:** `US-PROF-04-horarios-atencion.md`
- **Contrato vigente:** `openingHoursSchema` (day 0–6, closed, open/close HH:mm)
- **UI cliente:** `HoursTable.tsx` (solo lectura)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-PROF-04-horarios.md`
- **Agente Downstream:** Frontend Developer
