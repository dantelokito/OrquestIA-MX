> **Flujo:** Preview de vitrina anclado a la card (hover / long-press); tap corto = detalle
> **Historia de Usuario Asociada:** US-EXPLORE-07
>
> **Punto de entrada:** `/explorar` — puntero sobre `ProviderCard`, long-press en touch, foco de teclado, o tap en marker. **No** existe el botón «Vista rápida». Contenido = `US-EXPLORE-05` (F7, no recortar).
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Lista de cards bajo el mapa. Heart y `ContactCTA` de la card **se quedan**. Toda la card (salvo heart/contacto/control de preview) sigue siendo enlace a `/fruteria/[id]`.
> 2. `[Hover desktop]` → Tras **300 ms** de puntero sobre la card se abre un **popover anclado a la card** (no sheet modal como disparador). Mover el puntero al preview **no** lo cierra (puente **150 ms**). Salir del conjunto card+preview cierra. **No** instantáneo.
> 3. `[Long-press touch]` → Mantener **~500 ms** sin scroll abre el **mismo** preview. El scroll de la lista **cancela** y no abre. Tras el long-press, el `click` sintético **no** navega al detalle.
> 4. `[Tap / clic corto]` → Navega a `/fruteria/[id]`. El preview **no** sustituye el detalle.
> 5. `[Teclado]` → Con foco en la card: **Enter** = detalle. **Alt+Enter** abre preview. En `:focus-visible` se revela un control **icon-only** ≥44px (`aria-label="Vista previa"`, Lucide `Eye`) — **no** el texto «Vista rápida». Escape cierra. Un solo preview a la vez.
> 6. `[Marker mapa]` → Tap en marker abre el **mismo** `ProviderPreviewPopover` (paridad F7 de contenido; ya no un sheet disparado por botón de card). Tooltip de nombre en hover/tap corto del marker sigue F7.
> 7. `[Contenido]` → Igual `UF-EXPLORE-05`: horario 3 cols / apilado `<640px`; flags solo si API true; 3 reseñas; catálogo activo; mayoreo/menudeo; CTA dominante **Ver frutería**; secundario **Ver todas las reseñas** → `#resenas`.
> 8. `[Cierre]` → Escape, clic fuera, o leave hover (tras 150 ms). Al abrir otra card se cierra el anterior. z-index por encima del overlay de radio y de la última fila del grid (flip hacia arriba si no cabe).
>
> **Condicionales:**
> - **Loading:** → Popover abierto; BrandLoader 64px; sr-only “Cargando frutería”. Cache de sesión `id → payload`: no refetch si ya se tiene. Máximo **un GET** en vuelo; `AbortController` al cambiar de card.
> - **404 proveedor inactivo:** → Cerrar popover; toast “Esta frutería no está disponible”; refetch lista.
> - **Error red preview:** → Error inline en popover + Reintentar; mapa/lista intactos.
> - **Sin WhatsApp / sin tarjeta / flags false:** → No mostrar icono; no copy “no acepta” (F7).
> - **Horario 7 filas:** → Bloque scrolleable; columnas apilan `<=640px`.
> - **`prefers-reduced-motion: reduce`:** → Delays hover/long-press **0**; sin animación de apertura (instantáneo).
> - **Última fila del grid:** → Popover abre **hacia arriba** (flip); no recorta contra el pie de página ni el overlay de radio.
>
> **Reglas UI:**
> - Se ve como **opción de previsualizado**, no como ficha completa ni como CTA de texto.
> - Preview scrolleable; CTAs ≥44px. Un CTA dominante: **Ver frutería**.
> - CLIENT/invitado: marca **plataforma** (no pintar popover con colores del proveedor).
> - Wireframe: `WF-explorar-preview-card.md`. Contenido F7 (solo lectura): `../../fase-7/user-flows/UF-EXPLORE-05-preview.md`.
>
> **API esperada:**
> - `GET /api/providers/[id]` — mismo shape F7 (Arquitecto F8 `API-PROVIDER-PREVIEW-01`). **Sin** `/preview`. Debounce/cache = solo FE.
>
> **Referencias:** `CO-F8-003`, D-F8-UX-7…9, D-F8-15, D-F8-16, `US-EXPLORE-05`.
