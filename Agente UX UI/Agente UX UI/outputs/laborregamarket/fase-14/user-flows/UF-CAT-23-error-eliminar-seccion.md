> **Flujo:** El 409 al borrar una sección con productos es visible con el form Nueva sección cerrado
> **Historia de Usuario Asociada:** US-CAT-23
>
> **Punto de entrada:** Encabezado de sección en `/proveedor` → **Eliminar sección**.

> **Pasos del Usuario:**
> 1. `[Sección vacía]` → Eliminar desaparece la sección (2xx F10). Empty de secciones no oculta GLOBAL de plataforma (F13).
> 2. `[Sección con productos (visibles o archivados, regla F10)]` → API 409. La sección y sus productos **permanecen**.
> 3. `[Mensaje]` → Banner `SectionConflictBanner` **junto a la sección** (o toolbar de catálogo), **fuera** del form colapsado «Nueva sección». Copy accionable: «No se puede eliminar “Frutas”: mueve o quita los productos de la sección antes.» `role="alert"`.
> 4. `[Cerrar banner]` → Control × ≥44px; no depende de abrir «Nueva sección».
> 5. `[IDOR / sin auth]` → 403/401 como hoy.

> **Reglas UI:**
> - No hard-delete de productos. No cambiar la regla F10.
> - Toast fugaz **no** sustituye al banner (puede complementar).
> - Wireframe: `WF-CAT-23-error-seccion.md`.

## Inputs Utilizados

- **US:** `US-CAT-23-error-eliminar-seccion.md`
- **Código hoy:** `sectionError` solo dentro del form «Nueva sección»

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/user-flows/UF-CAT-23-error-eliminar-seccion.md`
- **Agente Downstream:** Frontend Developer
