> **Flujo:** Reseña nativa tras pedido entregado y rating real en vitrina
> **Historia de Usuario Asociada:** US-REV-01, US-REV-02
>
> **Punto de entrada:** `/cuenta#pedidos` → pedido propio en estado **Entregado** (`COMPLETED` / `DELIVERED`) sin reseña; o `/fruteria/[id]` para leer reseñas
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /cuenta#pedidos]` → OrderCard **Entregado** muestra CTA **Calificar pedido** (único CTA de esa card).
> 2. `[Pantalla: formulario reseña]` → Estrellas 1–5 (obligatorio) + comentario opcional. CTA **Publicar reseña**.
> 3. `[Éxito]` → Toast "Gracias por tu reseña" → card muestra reseña existente (solo lectura Must) → rating del proveedor se actualiza en `/fruteria/[id]` y cards de `/explorar`.
> 4. `[Lectura pública]` → En detalle/explorar: promedio + conteo reales. Si `reviewCount=0`: copy **"Sin reseñas todavía"** (no estrellas vacías).
>
> **Condicionales:**
> - **Pedido no entregado** (`PENDING`/`CONFIRMED`/`IN_TRANSIT`/`CANCELLED`): → sin CTA Calificar.
> - **Ya hay reseña:** → CTA sustituido por "Tu reseña" + estrellas read-only (Must). Edición es Should — no en este flujo.
> - **Venta POS walk-in** (sin `clientId`): → no genera opción de reseña.
> - **Validación:** → 0 estrellas: error inline "Elige una calificación"; comentario máx. documentado (ej. 500).
> - **Error red / 409 duplicado:** → ErrorBanner; no duplicar Review.
> - **Loading publicar:** → Spinner en CTA; estrellas disabled.
>
> **Reglas UI:**
> - CTA dominante del formulario: **Publicar reseña**.
> - `RatingStars` siempre con `aria-label` "Calificación N de 5".
> - Seed de demo no se muestra como dato real (CO-F4-01).
> - Wireframes: `WF-resena-pedido.md`, `WF-fruteria-reviews.md`, `WF-cuenta-pedidos-f4.md`.
>
> **API esperada:**
> - `POST /api/orders/[id]/reviews` — `{ rating: 1-5, comment? }` → 201; 409 si ya existe
> - `GET /api/providers/[id]/reviews` — lista pública paginada
> - `GET /api/providers` / `GET /api/providers/[id]` — `rating`, `reviewCount` recalculados
