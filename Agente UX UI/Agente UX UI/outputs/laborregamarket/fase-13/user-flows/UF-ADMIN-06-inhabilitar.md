> **Flujo:** Admin inhabilita / rehabilita SKU GLOBAL o LOCAL (sin DELETE)
> **Historia de Usuario Asociada:** US-ADMIN-06, US-SEC-04
>
> **Punto de entrada:** Fila o ficha en `/admin?tab=catalogos` (`UF-ADMIN-05`).

> **Pasos del Usuario:**
> 1. `[Fila activa]` → Acción **Inhabilitar** (no icono de basura). Copy: «Inhabilitar — no se borra el historial de ventas».
> 2. `[Confirmar]` → Diálogo corto. CTA dominante **Inhabilitar**; Cancelar secondary. Tras OK: `isActive=false`. El SKU **permanece** en la tabla (filtro Inactivo lo muestra).
> 3. `[Efecto canales]` → Deja de ser vendible en explorar, `/fruteria`, Encargar y POS. Restaurar oferta del proveedor **no** lo vuelve vendible hasta **Reactivar**.
> 4. `[Reactivar]` → Acción **Reactivar** en filas inactivas. CTA de esa vista: Reactivar.
> 5. `[Condicional]` → ¿DELETE HTTP o botón «borrar de la base»?
>    - **No existe en UI.** Si el cliente fuerza DELETE: 405; toast «Retira el producto inhabilitándolo».
>    - **404** id inexistente; **403** PROVIDER; **400** PATCH de ficha GLOBAL inválido.
> 6. `[LOCAL ajeno]` → Admin **no** edita nombre ni precio del LOCAL. Solo `isActive` + listado.
>
> **Reglas UI:**
> - Inactivo ≠ oculto del proveedor (bandeja). En admin no hay bandeja de archivados Must.
> - Prohibido: «eliminar permanente», hard-delete aunque no haya ventas.
> - Wireframe: `WF-ADMIN-05-catalogo-completo.md` (acciones de fila).

## Inputs Utilizados

- **PRD / US:** `US-ADMIN-06`, `US-SEC-04`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-ADMIN-06-inhabilitar.md`
