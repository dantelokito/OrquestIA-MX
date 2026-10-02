> **Flujo:** Preview de vitrina desde Explorar (mapa o lista)
> **Historia de Usuario Asociada:** US-EXPLORE-05
>
> **Punto de entrada:** Tap en marker (tras tooltip) o clic en ProviderCard en `/explorar`. No Google Maps JS.
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /explorar]` → Usuario elige una frutería del result set (radio + filtros vigentes).
> 2. `[Preview]` → Sheet (móvil) o panel/drawer (desktop ≥1024px) con `GET /api/providers/[id]`. CTA dominante del preview: **Ver frutería** → `/fruteria/[id]`. Encargar **no** vive en el sheet (sigue en detalle F3).
> 3. `[Horario]` → Tabla 3 columnas: Día | Apertura | Cierre. Chip **Abierta** / **Cerrada ahora** si `hoursPublished` y `isOpenNow` boolean. Si `hoursPublished=false` o `isOpenNow=null`: texto **“Horario no publicado”** — no crash, no chip mentiroso.
> 4. `[Flags]` → Iconos **solo si true**: envío (`offersDelivery`), tarjeta en sucursal (`acceptsCardAtStore`), WhatsApp (`whatsappEnabled` **y** `phone`). Ausente = no se afirma. Mayoreo / menudeo: chips de texto si `offersWholesale` / `offersRetail`.
> 5. `[Verificación]` → Si `isVerified` + `verifiedAt`: “verificado a la borrega desde MM/AAAA”. Verificado sin fecha: “verificado a la borrega” sin mes.
> 6. `[Reseñas]` → Últimas **3** (`reviewsPreview`). CTA secundario **Ver todas las reseñas** → `/fruteria/[id]#resenas`. Vacío: “Sin reseñas todavía” (F4, no 0.0).
> 7. `[Catálogo preview]` → Productos **activos/vendibles** de `products[]`. Inhabilitados no aparecen. CTA **Ver catálogo** → mismo detalle (sección productos).
>
> **Condicionales:**
> - **404 proveedor inactivo:** → Cerrar sheet; toast “Esta frutería no está disponible”; refetch lista.
> - **Error red preview:** → Error inline en sheet + Reintentar; mapa/lista intactos.
> - **Sin WhatsApp / sin tarjeta:** → No mostrar icono; no copy “no acepta”.
> - **Horario 7 filas no caben en móvil:** → Tabla scrolleable vertical; columnas **apilan** a 1 col (día + horario en la misma fila) si `<=640px`.
>
> **Reglas UI:**
> - Preview scrolleable; CTAs ≥44px. Un CTA dominante: **Ver frutería**.
> - CLIENT/invitado: marca **plataforma** (no pintar sheet con colores del proveedor).
> - Wireframe: `WF-explorar-preview.md`. Detalle completo F1/F3/F4 sigue en `/fruteria/[id]`.
>
> **API esperada:**
> - `GET /api/providers/[id]` — campos F7 preview (Arquitecto `API-PROVIDER-PREVIEW-01`).
> - Listado completo reseñas: `GET /api/providers/[id]/reviews` (página detalle, no Must del sheet).
>
> **Referencias:** D-F7-UX-6, D-F7-6, ADR-022 (productos inactivos).
