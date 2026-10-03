> **Flujo:** Preview de vitrina **dentro** del card (hover / long-press); tap corto = detalle
> **Historia de Usuario Asociada:** US-EXPLORE-08
>
> **Punto de entrada:** `/explorar` — puntero sobre `ProviderCard`, long-press touch, foco de teclado, o tap en marker. Contenido = `US-EXPLORE-05` (F7, **no recortar**). Triggers = F8 (`CO-F8-003`); contenedor = **in-card** (`CO-F9-001`).
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Lista de cards bajo el mapa. Heart y `ContactCTA` **se quedan**. Tap/clic corto (salvo heart/contacto/Eye) → `/fruteria/[id]`.
> 2. `[Hover desktop]` → Tras **300 ms** el contenido de preview se **anima expandiendo dentro del card** (no popover/submódulo desplazado). Salir del card cierra (puente close **150 ms** si aplica al área expandida). **No** instantáneo.
> 3. `[Long-press touch]` → Mantener **~500 ms** sin scroll abre el **mismo** contenido in-card. Scroll de la lista **cancela**. Tras long-press, el `click` sintético **no** navega.
> 4. `[Tap / clic corto]` → Navega a detalle. El preview **no** sustituye la ficha.
> 5. `[Teclado]` → Enter = detalle. **Alt+Enter** abre preview in-card. Icono `Eye` solo en `:focus-visible` (`aria-label="Vista previa"` ≥44px). Escape cierra. Un solo card expandido a la vez.
> 6. `[Marker mapa]` → Tap marker abre el preview **in-card** de la card correspondiente (scroll-into-view suave de la card si hace falta; reduced-motion: jump). Tooltip de nombre en marker sigue F7.
> 7. `[Contenido]` → Igual F7/F8: horario 3 cols / apilado `<640px`; flags iff true; 3 reseñas; catálogo activo; mayoreo/menudeo; CTA **Ver frutería**; secundario **Ver todas las reseñas** → `#resenas`.
> 8. `[Cierre]` → Escape, leave hover, o abrir otra card. Card expandido scrolleable; no tapa el overlay de radio de forma irrecuperable (lista scrollea; z-index de chrome mapa intacto).
>
> **Condicionales:**
> - **Loading:** → Card expandido con BrandLoader 64px; sr-only “Cargando frutería”. Cache `id → payload`; un GET en vuelo; `AbortController`.
> - **404 inactivo:** → Colapsar; toast “Esta frutería no está disponible”; refetch lista.
> - **Error red:** → Error inline en el área expandida + Reintentar.
> - **`prefers-reduced-motion: reduce`:** → Delays **0**; estado expandido sin animación (o transición mínima).
>
> **Reglas UI:**
> - Se ve como peek **del mismo card**, no como ficha flotante desanclada.
> - Wireframe: `WF-explorar-preview-in-card.md`. Baseline F8: `../../fase-8/user-flows/UF-EXPLORE-07-preview-hover.md` (solo lectura — cambia contenedor).
> - Contenido F7: `../../fase-7/user-flows/UF-EXPLORE-05-preview.md`.
>
> **API esperada:**
> - `GET /api/providers/[id]` — mismo shape F7. **Sin** `/preview`. Arquitecto F9 `API-PROVIDER-PREVIEW-01`.
>
> **Referencias:** `CO-F9-001`, `CO-F8-003`, D-F9-UX-1, D-F9-4, `US-EXPLORE-05`.
