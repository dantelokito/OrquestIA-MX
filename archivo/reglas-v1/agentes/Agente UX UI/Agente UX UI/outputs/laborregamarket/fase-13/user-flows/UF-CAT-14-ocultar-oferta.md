> **Flujo:** Proveedor oculta un producto de su catálogo (Eliminar ≠ borrar)
> **Historia de Usuario Asociada:** US-CAT-14, US-SEC-04
>
> **Punto de entrada:** `/proveedor` catálogo, sucursal **activa**. Fila operativa GLOBAL o LOCAL.

> **Pasos del Usuario:**
> 1. `[Fila operativa]` → Acciones ≥44px: **Editar** + Foto (F10 si aplica) + **Activo** + **Eliminar**. Una sola acción Eliminar; no modal de «borrar para siempre».
> 2. `[Confirmar ocultar]` → Diálogo. Título: «Quitar de tu catálogo». Cuerpo: «Se oculta de tu catálogo. El administrador sigue viendo el producto.» Prohibido: «borrar de la base», «eliminar permanente». CTA dominante **Quitar de catálogo**; Cancelar secondary.
> 3. `[Éxito]` → Fila desaparece del listado operativo. Aparece en pie «Eliminados de la vista» (`UF-CAT-15`). Encargar activo **no** bloquea este flujo (distinto de `UF-INV-07`).
> 4. `[GLOBAL sin oferta]` → Se crea la oferta ya archivada (sin pedir precio). Otras sucursales N>1 no pierden el GLOBAL.
> 5. `[Condicional]` → ¿IDOR / sin sucursal / CLIENT?
>    - **Sí:** 401/403/404; ErrorBanner recuperable; no fila sucia.
>    - **DELETE HTTP:** no se llama. 405 si se fuerza.
>
> **Reglas UI:**
> - Toggle Activo/Inactivo intacto (ADR-022): Inactivo **sigue en la lista**.
> - Oculto = bandeja. Inactivo ≠ oculto.
> - Wireframe: `WF-CAT-14-15-fila-bandeja.md`.

## Inputs Utilizados

- **US:** `US-CAT-14`, `US-SEC-04`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-CAT-14-ocultar-oferta.md`
