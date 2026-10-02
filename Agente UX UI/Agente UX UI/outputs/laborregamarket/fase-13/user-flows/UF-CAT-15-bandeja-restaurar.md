> **Flujo:** Listado operativo sin ocultos + bandeja Restaurar + base GLOBAL al onboarding
> **Historia de Usuario Asociada:** US-CAT-15
>
> **Punto de entrada:** `/proveedor` catálogo.

> **Pasos del Usuario:**
> 1. `[Onboarding / recarga]` → Negocio nuevo ve base GLOBAL activa de plataforma (filas Inactivas típicas) + LOCAL propios. Un GLOBAL **nuevo** del admin **aparece** al recargar; se oculta con `UF-CAT-14`. Empty de «cero secciones» **no** implica vacío de productos GLOBAL.
> 2. `[Listado operativo]` → Excluye `archivedAt`. Incluye Inactivos (`isAvailable=false`). Inventario y POS no listan ocultos.
> 3. `[Pie colapsado]` → Sección **Eliminados de la vista** colapsada por defecto. Expandir: lista corta (nombre, fecha ocultamiento TZ Monterrey, **Restaurar** ≥44px).
> 4. `[Restaurar]` → CTA de la bandeja. Fila vuelve al dashboard con el `isAvailable` que tenía. No SKU nuevo. Si el maestro está `isActive=false`, no es vendible hasta que admin rehabilite.
> 5. `[Condicional]` → ¿Bandeja vacía?
>    - **Sí:** empty mínimo «No hay productos eliminados de la vista.» No spinner eterno.
>    - **Error PATCH:** inline recuperable. Restaurar ajeno: 403/404. Doble restaurar: 409 o no-op (copy «Ya está en tu catálogo»).
>
> **Cuatro estados (bandeja):** Empty / Loading (skeleton 3 filas) / Error / Success (lista corta).
> **Wireframe:** `WF-CAT-14-15-fila-bandeja.md`.

## Inputs Utilizados

- **US:** `US-CAT-15`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-CAT-15-bandeja-restaurar.md`
