> **Flujo:** UI no ofrece hard-delete de producto ni de oferta
> **Historia de Usuario Asociada:** US-SEC-04
>
> **Pasos del Usuario:**
> 1. `[Catálogo proveedor]` → Eliminar llama ocultar (PATCH/archivo), **nunca** DELETE.
> 2. `[Admin]` → Solo Inhabilitar. Sin papelera.
> 3. `[Forzar DELETE]` → 405/404; copy «Retira el producto inhabilitándolo» / «Quítalo de tu catálogo».
> 4. `[Sección con ocultos]` → 409 al borrar sección (F10); no relajar por archivados.
>
> Cubierto visualmente en `WF-ADMIN-05` y `WF-CAT-14-15`.

## Inputs Utilizados

- **US:** `US-SEC-04`

## Outputs Generados

- **Archivo:** `fase-13/user-flows/UF-SEC-04-sin-delete.md`
