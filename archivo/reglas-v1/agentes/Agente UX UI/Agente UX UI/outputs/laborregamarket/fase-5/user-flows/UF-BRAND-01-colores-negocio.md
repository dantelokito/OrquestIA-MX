> **Flujo:** Configurar colores del negocio y aplicar tema en sesión PROVIDER
> **Historia de Usuario Asociada:** US-BRAND-01, US-BRAND-02
>
> **Punto de entrada:** Login PROVIDER → `/proveedor` (sección Imagen del negocio / Configuración, junto a logo y portada F2)
>
> **Pasos del Usuario:**
> 1. `[Pantalla: /proveedor]` → Bloque **Colores de tu marca**: picker de **primario** y **secundario** (hex válido) + preview de botón CTA (texto blanco sobre primario) y acento secundario.
> 2. `[Preview contraste]` → Should: hint en vivo (pasa / no pasa AA para texto blanco sobre primario). El rechazo al guardar es Must (cliente y/o servidor).
> 3. `[Guardar]` → CTA **Guardar colores**. Si el primario cumple contraste AA para texto blanco, persiste en `Provider` y la sesión hidrata `--brand` / `--brand-dark` / `--brand-secondary`.
> 4. `[Navegación sesión PROVIDER]` → Panel, POS, órdenes, dashboard y `/explorar` **logueado como PROVIDER** usan esos tokens (CTAs, focus ring, acentos). No se rediseñan pantallas F3/F4: solo theming.
> 5. `[Reset]` → **Restaurar marca de plataforma** deja campos nulos; UI vuelve a `--brand` / `--brand-dark` globales (`#e23744` / `#c13515`).
>
> **Condicionales:**
> - **Contraste insuficiente:** → No se persiste. Error inline: "El color primario no tiene suficiente contraste para el texto del botón. Ajústalo o usa la marca de la plataforma." Guardar disabled o rechazo 422.
> - **Hex inválido:** → Error inline "Usa un color hexadecimal (#RRGGBB)".
> - **Sin colores / fallback:** → Tokens de plataforma; UI no se rompe.
> - **CLIENT, ADMIN o invitado:** → `/explorar` y `/fruteria/[id]` muestran **marca de plataforma**. Prohibido pintar cada card del marketplace con el color de esa frutería.
> - **Logout:** → Se restauran tokens de plataforma (UF-AUTH-04).
> - **Loading:** → Skeleton del bloque colores.
> - **Error red al guardar:** → ErrorBanner + Reintentar.
> - **Éxito:** → Toast "Colores de tu marca actualizados" + chrome se actualiza sin recargar completo.
>
> **Reglas UI:**
> - CTA dominante del bloque: **Guardar colores**. Reset es Button Ghost / secondary.
> - Estados de pedido (`PENDING`, etc.), OriginBadge y QuickSaleBadge **siguen tokens de feedback F3** — nunca solo el color de marca del proveedor.
> - Paleta derivada del logo = Could (no diseñar en F5).
> - Wireframe: `WF-proveedor-marca.md`. Media F2: `../../fase-2/wireframes/WF-proveedor-media.md`.
>
> **API esperada:**
> - `PATCH /api/provider/profile` — `{ primaryColor?, secondaryColor? }` (hex o null). Contraste insuficiente → rechazo servidor (Arquitecto ADR-021 / API-PROVIDER-SETTINGS-01).
> - Sesión PROVIDER hidrata colores (`/api/auth/me` o contrato API-SESSION-THEME-01 — Arquitecto cierra la ruta; UX no inventa).
>
> **Referencias:** D-F5-6, `UF-MEDIA-01-upload-proveedor.md`, `UF-AUTH-04-logout.md`.
