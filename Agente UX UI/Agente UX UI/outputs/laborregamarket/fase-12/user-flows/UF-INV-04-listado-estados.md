> **Flujo:** Listado inventario — cuatro estados  
> **Historia de Usuario Asociada:** US-INV-04 (indicador parcial: US-INV-06)  
>
> **Pasos del Usuario:**
> 1. `[SubNav Inventario]` -> Entra a `/proveedor/inventario`.
> 2. `[Loading]` -> Skeletons de 6 filas (thumb + barra + 3 líneas de texto). Sin spinner eterno. `aria-busy="true"` en el listado.
> 3. `[Condicional]` -> ¿Respuesta OK con 0 SKUs?
>    - **Sí `[Empty]`:** ilustración Package 48px, título «Aún no hay productos en esta frutería», copy «Agrega SKUs en Catálogo para ver existencias aquí.», CTA secundario «Ir a Catálogo» → `/proveedor`.
>    - **Sí `[Success]`:** cada fila: nombre, unidad, on-hand, barra, alerta si aplica, **parcial Encargar** (0 se muestra como «Sin reserva»), CTA Registrar entrada.
> 4. `[Condicional]` -> ¿500 / red?
>    - **Sí `[Error]`:** icono, «No pudimos cargar el inventario», CTA **Reintentar** (único primary). No se muestran saldos cacheados inventados.
> 5. `[Parcial]` -> Número = suma de líneas Encargar activas (Marketplace, no DELIVERED, no CANCELLED). Hint al hover/focus: «Pedidos Encargar aún no entregados».

## Inputs Utilizados

- **US:** `US-INV-04`, `US-INV-06`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/user-flows/UF-INV-04-listado-estados.md`
- **Wireframe:** `WF-INV-04-listado.md`
