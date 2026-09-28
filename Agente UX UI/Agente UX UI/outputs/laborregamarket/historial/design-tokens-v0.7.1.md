# Design Tokens — LaBorregaMarket v0.7.1

> **Agente:** UX/UI Designer  
> **Fecha:** 18/08/2026  
> **Stack UI:** TailwindCSS 4, Next.js App Router, Lucide icons  
> **Fuente código:** `LaBorregaMarket/src/app/globals.css`  
> **Changelog Fase 7:** Explorar mapa-primero; pan ≠ radio (`CO-F7-001`); `loader.size.loading` 64px vs `empty` 80px; markers sin label; preview vitrina; default SN; SessionPersistBanner.  
> **Changelog Fase 6:** Reportes PROVIDER (GrainSelector, print/PDF); GEO zoom↔radio (círculo siempre on, RadiusClampHint); BrandLoader B1–B3. **Supersedido en GEO:** pan→radio.  
> **Changelog Fase 5 (addendum 16/08/2026):** Toast contacto 503 vs 500 (`WF-contacto-resiliencia`).  
> **Changelog Fase 5:** Marca por sesión PROVIDER (`--brand` override + `--brand-secondary`); ColorPicker + ContrastHint; ExploreLocationCta en banner; CompactAddressBar; RadiusSlider overlay pie de mapa; ExploreMap Leaflet/OSM (revoca Google Maps JS); ProductActiveSwitch Activo/Inactivo; PosEmptyActiveCatalog.  
> **Changelog Fase 4:** RadiusSlider, LocationPicker, FavoriteAddressSelect, RatingStars, ReviewCard, VerificationRequiredBanner, EtaChip, ScaleStatusBadge, FulfillmentToggle, KpiCardAdmin, OriginSplitBar. IN_TRANSIT + DELIVERY = "En camino".  
> **Changelog Fase 3:** SubNavProveedor, OrderStatusBadge (5 estados), OriginBadge, QuickSaleBadge, QuantityStepper, QuantityInput+NumericKeypad, UnitSelector, PaymentMethodSelector, TicketLine, OrderCard, KpiCard, BarChartIlustrativo, ConfirmDialog. Regla a11y: nunca color-only para estado/origen/venta rápida. Micro-interacciones POS y carrito.

---

## 1. Paleta de colores

### Brand (plataforma — default)

| Token CSS | Hex | Tailwind equivalente | Uso |
|-----------|-----|------------------------|-----|
| `--brand` | `#e23744` | custom | CTA primario, links activos, focus ring |
| `--brand-dark` | `#c13515` | custom | hover CTA primario |
| `--brand-light` | `#ff5a5f` | custom | acentos, badges suaves |
| `--brand-secondary` | `#c13515` | custom | acento de soporte (default = brand-dark) |

**Contraste WCAG AA:** `--brand` de plataforma sobre blanco ≈ 4.6:1 — cumple para texto grande y botones con texto blanco.

### Brand por sesión PROVIDER (Fase 5)

Cuando el usuario autenticado es **PROVIDER** y tiene `primaryColor` / `secondaryColor` válidos, el FE hidrata las mismas CSS variables en el documento de la sesión (no un tema por card del marketplace).

| Token | Fuente | Uso |
|-------|--------|-----|
| `--brand` | `primaryColor` del Provider | CTAs, links activos, focus ring, thumb del slider |
| `--brand-dark` | derivado (oscurecer ~10–15%) o valor persistido | hover CTA |
| `--brand-light` | derivado (aclarar) | acentos suaves |
| `--brand-secondary` | `secondaryColor` | chips/acentos de soporte — **no** sustituye feedback F3 |

**Reglas:**

- **CLIENT / ADMIN / invitado:** siempre tokens de plataforma. Prohibido pintar cada `ProviderCard` con el primario de esa frutería.
- **Fallback:** colores null o contraste inválido → plataforma. Logout limpia overrides.
- **Guardar primario Must:** texto blanco sobre `--brand` ≥ **4.5:1**. Si no, no persistir.
- **Estados de pedido, OriginBadge, QuickSaleBadge:** siguen paleta feedback F3; nunca solo `--brand` del proveedor.
- Componentes deben usar `var(--brand)` (no hex hardcode) para que el override de sesión aplique.

### Neutros

| Token | Valor | Uso |
|-------|-------|-----|
| `text-primary` | `#0F172A` / `slate-900` | Títulos, body principal |
| `text-secondary` | `#64748B` / `slate-500` | Subtítulos, metadata |
| `text-muted` | `#94A3B8` / `slate-400` | Placeholders, hints |
| `border-default` | `#E2E8F0` / `gray-200` | Bordes inputs, cards |
| `border-input` | `#D1D5DB` / `gray-300` | Bordes formularios |
| `surface-primary` | `#FFFFFF` | Fondos cards, header |
| `surface-secondary` | `#F8FAFC` / `slate-50` | Fondos sección alterna |
| `surface-pos` | `#F1F5F9` / `slate-100` | Panel ticket POS |

### Feedback

| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#10B981` | Confirmaciones, toggle activo, badge LISTO |
| `warning` | `#F59E0B` | Alertas no bloqueantes, PENDING |
| `error` | `#EF4444` | Mensajes inline formulario, errores API, CANCELLED |
| `info` | `#3B82F6` | Tips informativos, IN_TRANSIT |

### Estados de pedido (badges — siempre con texto + icono)

| Estado API | Label UI | Color fondo | Icono Lucide |
|------------|----------|-------------|--------------|
| `PENDING` | Pendiente | `warning/10` + `text-amber-700` | `Clock` |
| `CONFIRMED` | Confirmado | `info/10` + `text-blue-700` | `CheckCircle` |
| `IN_TRANSIT` + pickup | **Listo para recoger** | `info/10` + `text-blue-700` | `PackageCheck` |
| `IN_TRANSIT` + `DELIVERY` | **En camino** | `info/10` + `text-blue-700` | `Truck` |
| `COMPLETED` | Entregado | `success/10` + `text-emerald-700` | `CircleCheck` |
| `CANCELLED` | Cancelado | `error/10` + `text-red-700` | `XCircle` |

**Regla global F3:** Nunca comunicar estado, origen u orden de venta rápida **solo con color**. Siempre incluir texto legible + icono (`aria-hidden` en icono decorativo; label en `aria-label` si el badge es compacto).

---

## 2. Tipografía

| Rol | Familia | Tamaño | Peso | Line-height |
|-----|---------|--------|------|-------------|
| H1 | Inter, system-ui | 2.25rem (36px) | 700 | 1.2 |
| H2 | Inter | 1.875rem (30px) | 600 | 1.25 |
| H3 | Inter | 1.5rem (24px) | 600 | 1.3 |
| Body | Inter | 1rem (16px) | 400 | 1.5 |
| Small | Inter | 0.875rem (14px) | 400 | 1.4 |
| Label | Inter | 0.875rem (14px) | 500 | 1.4 |
| Button | Inter | 0.875rem–1rem | 600 | 1 |
| Mono ticket | `font-mono` | 0.875rem | 500 | 1.3 |

**Implementación existente:** `body { font-family: "Inter", system-ui, sans-serif; }`

---

## 3. Espaciado (grid 8pt)

| Token | Valor | Uso típico |
|-------|-------|------------|
| `space-1` | 4px | gaps mínimos internos |
| `space-2` | 8px | padding iconos, gaps chips |
| `space-3` | 12px | padding compacto |
| `space-4` | 16px | padding inputs, cards |
| `space-6` | 24px | padding secciones |
| `space-8` | 32px | márgenes entre bloques |
| `space-12` | 48px | separación secciones hero |

**Contenedor máximo:** `max-w-[1760px]` (header/explorar), `max-w-7xl` (formularios auth), POS `max-w-none` full-bleed con split interno.

---

## 4. Bordes y sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | `rounded-lg` (8px) | Inputs, botones |
| `radius-md` | `rounded-xl` (12px) | Cards |
| `radius-full` | `rounded-full` | Pill búsqueda, avatares, badges |
| `shadow-sm` | `shadow-sm` | Cards en reposo |
| `shadow-md` | `shadow-md` | Pill búsqueda hover, dropdown |
| `shadow-lg` | `shadow-lg` | Search expanded, modales, ticket POS |

---

## 5. Breakpoints

| Nombre | Ancho | Comportamiento |
|--------|-------|----------------|
| Mobile | `<= 640px` (`sm`) | 1 columna, botones `w-full`, mapa debajo lista, POS stack catálogo → ticket |
| Tablet | `641px – 1023px` | 2 columnas grid explorar; POS split 50/50 |
| Desktop | `>= 1024px` (`lg`) | Split view explorar, header completo, POS 58% catálogo / 42% ticket |

---

## 6. Componentes — especificación de estados

### Button

| Variante | Default | Hover | Focus | Active | Disabled |
|----------|---------|-------|-------|--------|----------|
| **Primary** | `bg-[var(--brand)] text-white` | `bg-[var(--brand-dark)]` | `ring-2 ring-[var(--brand)] ring-offset-2` | scale 0.98 | `opacity-50 cursor-not-allowed` |
| **Secondary** | `border border-gray-300 bg-white` | `bg-gray-50` | `ring-2 ring-gray-300` | `bg-gray-100` | `opacity-50` |
| **Ghost** | `text-gray-700` | `bg-gray-100` | `ring-2 ring-gray-200` | — | `opacity-50` |

### Input + Label

| Estado | Estilo |
|--------|--------|
| Default | `border-gray-300 rounded-lg px-4 py-2.5 text-sm` |
| Focus | `focus:ring-2 focus:ring-[var(--brand)] focus:outline-none` |
| Error | `border-red-500` + mensaje `text-red-600 text-sm` debajo |
| Disabled | `bg-gray-50 opacity-60` |

### ProviderCard

| Estado | Comportamiento |
|--------|----------------|
| Default | `shadow-sm`, imagen placeholder |
| Hover | `shadow-md`, sincroniza highlight en mapa |
| Focus | `ring-2 ring-[var(--brand)]` (navegación teclado) |

### FilterChip

| Estado | Estilo |
|--------|--------|
| Inactivo | `border-gray-300 bg-white text-slate-700`; min-h 44px; `px-4` |
| Activo | `border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)] font-medium`; `aria-pressed="true"` |
| Focus | `ring-2 ring-[var(--brand)] ring-offset-2` |
| Hover (inactivo) | `bg-gray-50` |

### Toast (Fase 2 — NOTIFY)

| Elemento | Especificación |
|----------|----------------|
| Contenedor | `fixed` (móvil: sobre sticky footer; desktop: top-right); `rounded-lg shadow-md bg-white border border-gray-200 px-4 py-3` |
| Success | Texto `text-slate-900`; icono check `text-success` (`#10B981`) |
| Error | Texto `text-slate-900`; icono alerta `text-error` |
| A11y | `role="status"` + `aria-live="polite"` |
| Duración | Auto-dismiss 3–5s; botón cerrar ✕ (44px hit area) |
| Copy éxito | `La frutería fue notificada` |
| Copy error (500 / red) | **No pudimos avisar a la frutería. Puedes llamar igual.** |
| Copy 503 (fail-closed Redis) | **El aviso a la frutería no está disponible. Puedes llamar igual.** |
| Copy 429 | Sin toast (rate limit F2); `tel:` siempre usable |
| Prohibido | Empty de mapa, “agotado”, toast success en 5xx |

### ContactCTA (Fase 2 — preservado F3, decisión D-F3-7)

| Variante | Estilo |
|----------|--------|
| **Llamar (secundario en F3 detalle)** | Button Secondary; `tel:` — contacto F2 intacto |
| **WhatsApp (terciario)** | Button Ghost / outline; `wa.me` |
| **Encargar (dominante F3)** | Button Primary `w-full` móvil; abre flujo carrito |
| Loading breve | Spinner en Encargar ≤300ms |
| Notify 503 / 500 | Toast error (tabla Toast); **no** deshabilitar Llamar / WhatsApp / Encargar |
| Touch | min-h 44px todos |

### MediaUpload (Fase 2)

| Estado | Estilo |
|--------|--------|
| Default | Preview + botón Secondary "Cambiar …" / "Subir …" |
| Uploading | Overlay `bg-black/40` + spinner; botones `disabled` |
| Error | `text-red-600 text-sm` bajo control; `aria-live="polite"` |
| Accept | `image/jpeg,image/png,image/webp` · max 5MB |
| Hint | `text-xs text-slate-500` — formatos + límite |

### ImagePlaceholder (Fase 2)

| Variante | Uso | Dims fijas (anti-CLS) |
|----------|-----|------------------------|
| `business-cover` | Hero detalle / card cover | Aspect ~2:1; bg `slate-100` |
| `business-logo` | Avatar logo | Círculo 96×96 (panel) / 48×48 (hero) |
| `product-FRUTA` / `product-VERDURA` / `product-AGRICOLA` | Thumb producto | 40–48px square |
| Estilo | Icono Lucide neutro sobre `bg-slate-100`; sin emoji ni stock |

### EmptyState

| Elemento | Especificación |
|----------|----------------|
| Icono | 48px, `text-gray-400` |
| Título | H3, `text-slate-900` |
| Descripción | Body small, `text-slate-500` |
| CTA | Button primary opcional |

### SkeletonCard

| Elemento | Especificación |
|----------|----------------|
| Animación | `animate-pulse` |
| Bloques | rectángulo imagen + 2 líneas texto |
| Uso | Loading en explorar, proveedor, detalle, carrito, órdenes |

### StepIndicator (wizard)

| Estado paso | Estilo |
|-------------|--------|
| Completado | círculo `--brand` + check |
| Actual | círculo `--brand` + número |
| Pendiente | círculo `gray-300` + número |

---

## 6b. Componentes Fase 3 — pedidos, POS, ops

### SubNavProveedor

| Elemento | Especificación |
|----------|----------------|
| Contenedor | `border-b border-gray-200 bg-white`; debajo header PROVIDER |
| Items | Catálogo (`/proveedor`) · POS (`/proveedor/pos`) · Órdenes (`/proveedor/ordenes`) · Dashboard (`/proveedor/dashboard`) |
| Activo | `border-b-2 border-[var(--brand)] text-[var(--brand)] font-medium` |
| Inactivo | `text-slate-600 hover:text-slate-900` |
| A11y | `nav` + `aria-label="Panel proveedor"`; link activo `aria-current="page"` |
| Mobile | Scroll horizontal `overflow-x-auto`; tabs min-w-fit; sin ocultar labels |

### OrderStatusBadge

| Estado | Label | Estilo |
|--------|-------|--------|
| `PENDING` | Pendiente | `bg-amber-50 text-amber-800` + `Clock` |
| `CONFIRMED` | Confirmado | `bg-blue-50 text-blue-800` + `CheckCircle` |
| `IN_TRANSIT` (pickup / default) | **Listo para recoger** | `bg-blue-50 text-blue-800` + `PackageCheck` |
| `IN_TRANSIT` + `fulfillmentType=DELIVERY` | **En camino** | `bg-blue-50 text-blue-800` + `Truck` |
| `COMPLETED` | Entregado | `bg-emerald-50 text-emerald-800` + `CircleCheck` |
| `CANCELLED` | Cancelado | `bg-red-50 text-red-800` + `XCircle` |

Siempre `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium`. Pickup: no usar "En tránsito". Delivery: **"En camino"** solo con `DELIVERY`.

### OriginBadge

| Origen | Label | Estilo |
|--------|-------|--------|
| `ONLINE` | Pedido en línea | `bg-slate-100 text-slate-700` + `ShoppingBag` |
| `POS` | Mostrador | `bg-violet-50 text-violet-800` + `Store` |

Nunca solo punto de color; siempre icono + texto.

### QuickSaleBadge

| Uso | Especificación |
|-----|----------------|
| Producto venta rápida | `bg-orange-50 text-orange-800` + `Zap` + texto "Venta rápida" |
| En OrderCard / ticket | Misma spec; `aria-label="Producto de venta rápida"` si espacio reducido muestra solo icono + abreviatura "VR" con tooltip |

### QuantityStepper

| Elemento | Especificación |
|----------|----------------|
| Layout | `[ − ] [ valor ] [ + ]` horizontal; botones 44×44px |
| Default | valor `1`; min `0.25` o `1` según unidad |
| Disabled − | cuando valor = mínimo |
| Focus | ring en botones; input central `text-center w-16` |
| A11y | `aria-label` en ±; `aria-valuenow` en valor |

### QuantityInput + NumericKeypad

| Elemento | Especificación |
|----------|----------------|
| Input | `font-mono text-2xl text-center`; acepta decimal con `.` |
| Keypad | Grid 3×4: 1–9, `.`, 0, ⌫; botones min 48px |
| Validación | Inline error si fuera de rango; `aria-live="polite"` |
| Uso | Panel POS cantidad manual; alternativa al stepper en tablet |

### UnitSelector

| Opción | Label |
|--------|-------|
| `KG` | Kilogramos (kg) |
| `PIEZA` | Pieza (pz) |
| `MANOJO` | Manojo |
| `CAJA` | Caja |

Segmented control o radio group; selección activa `--brand`; `aria-pressed` en chips.

### PaymentMethodSelector

| Método | Label | Icono |
|--------|-------|-------|
| `CASH` | Efectivo | `Banknote` |
| `CARD` | Tarjeta | `CreditCard` |
| `TRANSFER` | Transferencia | `ArrowLeftRight` |

Radio cards horizontales; uno seleccionado; requerido antes de Cobrar.

### TicketLine

| Elemento | Especificación |
|----------|----------------|
| Layout | Nombre producto (truncate) · cantidad × unidad · subtotal derecha |
| Quick sale | `QuickSaleBadge` inline si aplica |
| Acciones | Icono eliminar `Trash2` 44px; confirmación opcional vía ConfirmDialog |
| Vacío | "Agrega productos del catálogo" `text-slate-500` centrado |

### OrderCard

| Elemento | Especificación |
|----------|----------------|
| Header | `#orden` + `OrderStatusBadge` + `OriginBadge` |
| Body | Cliente, ítems resumidos (max 3 líneas + "y N más"), total MXN |
| Footer | CTA contextual según estado (Confirmar / Marcar listo / Entregar) |
| Hover | `shadow-md`; focus ring teclado |

### KpiCard

| Elemento | Especificación |
|----------|----------------|
| Layout | Label small · valor H2/H3 · delta opcional (↑↓ con color + texto) |
| Variantes | ventas hoy, ticket promedio, órdenes activas, top producto |
| Loading | Skeleton bloque valor + label |
| A11y | Valor en `aria-label` descriptivo si delta es solo color |

### BarChartIlustrativo

| Elemento | Especificación |
|----------|----------------|
| Tipo | Barras verticales CSS/SVG simple — no librería pesada MVP |
| Datos | Últimos 7 días ventas; eje Y MXN abreviado |
| A11y | Tabla `sr-only` con mismos datos; `role="img"` + `aria-label` |
| Empty | "Sin ventas en el período" |

### ConfirmDialog

| Elemento | Especificación |
|----------|----------------|
| Trigger | Cancelar pedido, vaciar ticket, eliminar línea |
| Layout | Modal centrado; título + descripción + Cancelar (secondary) + Confirmar (primary/destructive) |
| Focus trap | Sí; Escape cierra |
| Destructive | `bg-red-600 hover:bg-red-700` para cancelar pedido |
| A11y | `role="alertdialog"`; foco inicial en Cancelar |

---

## 6c. Componentes Fase 4 — geo, reseñas, ETA, báscula, admin

### RadiusSlider (F5 — overlay pie de mapa)

| Elemento | Especificación |
|----------|----------------|
| Rango | 1–25 km, step 1; default **10** |
| Layout F5 | Overlay **borde inferior del mapa** (`absolute bottom-0 inset-x-0`); track `h-2 bg-slate-200`; thumb 24px `--brand`; label "Radio: N km" `text-slate-600` (no `slate-400`) |
| Superficie overlay | `bg-white/95` (o `bg-white` móvil) `px-4 py-3`; no tapar attribution OSM |
| A11y | `input type="range"` + `aria-valuemin/max/now` + label visible; operable por teclado |
| Mobile | `w-full`; thumb ≥24px (hit area 44px via padding) |
| Prohibido F5 | Slider dentro de LocationBar F4 |
| Bidireccional F6 | **Revocado F7** (`CO-F7-001`): zoom/pan **no** mueven el thumb. El slider **sí** hace `fitBounds` del círculo (`US-GEO-10`) |

### LocationPicker / ExploreLocationCta (F5)

| Elemento | Especificación |
|----------|----------------|
| CTA geo | **Usar mi ubicación** en el **banner** (fila FilterBar), Button Secondary, min-h 44px, `w-full` móvil — **no** dentro del mapa |
| CompactAddressBar | Buscador dirección + FavoriteAddressSelect + Guardar; **sin** slider ni CTA geo |
| Pin | Draggable en mapa Leaflet |
| Default | **San Nicolás** `25.7475, -100.2830` + 10 km (invitado / sin favoritas). GPS denegado **no** vacía la lista. Last-used servidor si CLIENT |
| A11y | Botones 44px; geocode `aria-live="polite"` |

### FavoriteAddressSelect

| Elemento | Especificación |
|----------|----------------|
| Trigger | Select/dropdown "Casa ▾"; vacío → CTA "Guardar dirección" |
| Guest | Intento de guardar → login con pin en sessionStorage (cola post-login) |
| Default | Una sola `isDefault`; orden API `lastUsedAt` primero. **API gana** a localStorage |
| Uso | Al elegir: `POST .../addresses/[id]/use` |

### RatingStars

| Modo | Especificación |
|------|----------------|
| Input | 5 botones 44px; flechas teclado; `aria-label` "Calificación N de 5" |
| Display | Estrellas + `reviewCount` entre paréntesis |
| Cero reseñas | Texto **"Sin reseñas todavía"** — **prohibido** ☆☆☆☆☆ con 0.0 |

### ReviewCard

| Elemento | Especificación |
|----------|----------------|
| Layout | Estrellas · autor · fecha relativa · comentario body |
| Empty lista | EmptyState "Sin reseñas todavía" |

### VerificationRequiredBanner

| Elemento | Especificación |
|----------|----------------|
| Estilo | `bg-blue-50 text-blue-900 border border-blue-100` + icono `Info` |
| Copy | **"Requiere verificación de tu negocio"** + cómo solicitar (sin plazos) |
| Prohibido | Paleta `error`/`warning`, copy punitivo, ocultar el bloque |

### EtaChip

| Elemento | Especificación |
|----------|----------------|
| Copy canónico | **Listo aprox. en ~X min** |
| Pickup sin distancia | **Tiempo de preparación: ~Y min** |
| Fallback | "El tiempo lo confirma la frutería" |
| Microcopy | "Es una estimación, no una hora exacta" `text-slate-500 text-xs` |
| Estilo | `inline-flex gap-1.5 items-center text-slate-800` + `Clock` |

### ScaleStatusBadge

| Estado | Label | Estilo |
|--------|-------|--------|
| Conectada | Conectada · {modelo} | `bg-emerald-50 text-emerald-800` + `Cpu` |
| Desconectada | Desconectada | `bg-slate-100 text-slate-700` + `Unplug` |
| Conectando | Conectando… | `bg-blue-50 text-blue-800` + spinner |

Nunca solo color. CTA **Conectar báscula** es Button Secondary (Cobrar sigue primary).

### FulfillmentToggle

| Opción | Label |
|--------|-------|
| `PICKUP` | Recoger en tienda (default) |
| `DELIVERY` | A domicilio |

Segmented control; oculto si `offersDelivery=false`. `aria-pressed` en cada segmento.

### KpiCardAdmin

| Elemento | Especificación |
|----------|----------------|
| Distinto de `KpiCard` F3 | Label **uppercase** `text-xs tracking-wide text-slate-600`; sin delta "vs Ayer" |
| Superficie | `bg-white border border-slate-200` sobre página `bg-slate-50` |
| Métricas | GMV, # órdenes, proveedores activos, tasa cancelación |

### OriginSplitBar

| Serie | Label | Icono |
|-------|-------|-------|
| Marketplace | Marketplace | `ShoppingBag` |
| POS | POS | `Store` |

Barra + porcentaje + MXN; tabla `sr-only` equivalente. Nunca solo color.

---

## 6d. Componentes Fase 5 — Leaflet, catálogo, marca

### ExploreMap (Leaflet + OSM)

| Elemento | Especificación |
|----------|----------------|
| Motor | Leaflet + teselas OpenStreetMap. **Sin** Google Maps JS API en `/explorar` (`CO-F5-001`) |
| Carga | Dynamic import / `ssr: false` (idea Arquitecto; no es AC de producto) |
| Attribution | Crédito OSM visible; overlay de radio no lo tapa |
| Markers | Icono negocio ~28px **sin** label permanente; tooltip hover/tap/focus (`US-GEO-15`); `aria-label` nombre + distancia |
| Círculo | Radio Haversine vigente; **siempre visible** si hay coords |
| Error teselas | Overlay info; lista usable. **No** hay estado "sin API key" |
| F7 Must | Pan/zoom **no** GET; slider/GPS/favorita → `radiusKm` clamp 1–25 + GET; lista = página `limit=20`; **no** bbox |
| Won't | Clustering de markers |

### BrandColorPicker

| Elemento | Especificación |
|----------|----------------|
| Inputs | `type="color"` + text hex `#RRGGBB` para primario y secundario |
| Preview | Button Primary (texto **blanco** sobre `--brand`) + chip secundario |
| ContrastHint | Should en vivo: pasa si blanco sobre primario ≥ 4.5:1 |
| Error contraste | `text-red-600 text-sm`; Guardar disabled o rechazo servidor |
| Reset | Button Ghost "Restaurar marca de plataforma" |

### ProductActiveSwitch

| Estado | Label | Estilo |
|--------|-------|--------|
| ON | **Activo** | Switch `--brand`; `aria-checked="true"` |
| OFF | **Inactivo** | Switch gray; fila permanece en panel proveedor |
| Hint | "Inactivo: no aparece en explorar, pedidos ni POS. No es stock." | `text-slate-500 text-sm` |
| Prohibido | Copy "Agotado" / stock / inventario | — |
| Touch | min-h 44px | — |

### PosEmptyActiveCatalog

| Elemento | Especificación |
|----------|----------------|
| Cuándo | Cero productos activos en POS |
| Copy | **"No hay productos activos"** + "Activa al menos uno en Catálogo para vender." |
| CTA | Button Secondary **Ir a Catálogo** → `/proveedor` |
| Distinto | Empty del ticket: "Agrega productos del catálogo" |

### CartUnavailableToast

| Elemento | Especificación |
|----------|----------------|
| Trigger | Línea de carrito cuyo `productId` quedó inactivo |
| Copy | `"{nombre} ya no está disponible"` |
| Acción | Retirar la línea (no dejar fila tachada) |
| A11y | `role="status"` `aria-live="polite"`; auto-dismiss 3–5s |

---

## 6e. Componentes Fase 6 — reportes, print, GEO sync, loader

### DashboardViewSwitcher

| Elemento | Especificación |
|----------|----------------|
| Opciones | **Resumen** (F3 hoy+7d, default) · **Reportes** (calendario) |
| Superficie | Tabs locales en `/proveedor/dashboard`; **no** item extra de SubNavProveedor |
| Activo | `border-b-2 border-[var(--brand)] text-[var(--brand)] font-medium`; `aria-selected="true"` |
| Inactivo | `text-slate-600 hover:text-slate-900` |
| A11y | `role="tablist"` / `role="tab"`; teclado flechas |
| Look | Panel PROVIDER (`bg-white`); **prohibido** `bg-slate-50` + `KpiCardAdmin` |

### GrainSelector

| Elemento | Especificación |
|----------|----------------|
| Opciones | Día · Mes · Año (`grain` = day / month / year) |
| Layout | Segmented control; activo `--brand` + texto blanco o underline; `aria-pressed` |
| Touch | Cada segmento min-h 44px; `w-full` móvil |
| Cambio | Resetea `date` al periodo en curso (hoy / mes actual / año actual Monterrey) |

### ReportPeriodPicker

| Grano | Control | `date` API |
|-------|---------|------------|
| Día | `input type="date"` | `YYYY-MM-DD` |
| Mes | `input type="month"` | `YYYY-MM` |
| Año | `<select>` o spinbutton de año | `YYYY` |

| Elemento | Especificación |
|----------|----------------|
| `max` | Hoy en America/Monterrey; futuros **disabled** |
| Periodo en curso | Permitido (parcial) |
| Error 400 | Inline `text-red-600 text-sm`: "Elige un periodo que no sea futuro" |
| A11y | Label visible + `htmlFor`; focus `ring-2 ring-[var(--brand)]` |

### DocumentActions

| Botón | Estilo | Acción |
|-------|--------|--------|
| **Imprimir** | Button Secondary + `Printer`; min-h 44px | `window.print()` |
| **Descargar PDF** | Button Secondary + `Download`; min-h 44px | `GET /api/provider/reports.pdf` |

**Prohibido:** Button Primary (Cobrar sigue siendo el único primary del panel POS; dashboard informativo). Loading PDF: spinner en el botón, `aria-busy`. Disabled si no hay payload JSON (500). Empty periodo: **habilitados**.

### ReportOriginSplit

| Serie | Label UI | API |
|-------|----------|-----|
| Encargar | Encargar (pedido en línea) | `MARKETPLACE` |
| Mostrador | Mostrador (POS) | `POS` |

Icono + texto + MXN + count; tabla `sr-only`. Nunca solo color. Reusa paleta `OriginBadge` F3, no `OriginSplitBar` admin.

### ReportPrint

| Elemento | Especificación |
|----------|----------------|
| Chrome | Header, SubNav, switcher, pickers y DocumentActions → `no-print` |
| Encabezado hoja | Nombre frutería · periodo · TZ `America/Monterrey` · `generatedAt` local |
| Cuerpo | Mismos KPIs, split, serie/tabla, top productos que pantalla |
| Página | `@page { margin: 16mm; }`; fondo blanco; texto `slate-900` |
| B/N | Chart en gris oscuro (`slate-700`); no depender solo de `--brand` |
| Empty | KPIs 0 + "Sin ventas en este periodo"; PDF 200 válido |

### BrandLoader (`LoaderBorrega`)

| Elemento | Especificación |
|----------|----------------|
| Frames | B1 → B2 → B3 PNG transparente |
| Diseño | `Administrador de producto/.../comun/brand/loader-borrega/` |
| Runtime | `public/brand/loader-borrega/B1.png` … `B3.png` (copia 1:1) |
| Intervalo | **500 ms** por frame (rango 400–600 ms) |
| Tamaños | **`loader.size.loading`** = **64px** (refetch lista); **`loader.size.empty`** = **80px** (+25%, `total=0`); `md` 96px otros módulos. **Sin PNG nuevos** |
| A11y | Loading: `aria-busy="true"` + sr-only **"Buscando fruterías"**. Empty: `aria-busy="false"` |
| Reduced motion | `prefers-reduced-motion: reduce` → **solo B1**, sin loop |
| Prohibido | Splash full-screen; skeleton / `animate-pulse` como Must de refetch Explorar; tratar 5xx como empty |
| Reuso | Mismo componente F6; empty radio F7 (`US-GEO-16`) |

### RadiusClampHint

| Elemento | Especificación |
|----------|----------------|
| Copy | **Máximo 25 km** |
| Estilo | `text-slate-600 text-sm` + `Info`; `bg-white/95 rounded-md px-2 py-1` |
| Posición | Encima del slider overlay; **no** tapa attribution OSM ni CTA ubicación |
| A11y | `role="status"`; no modal; no bloquea mapa ni slider |
| Cuándo | Visualizador pediría radio > 25; desaparece al volver ≤ 25 |

---

## 6f. Componentes Fase 7 — Explorar + preview + sesión

### ExploreLayoutF7

| Elemento | Especificación |
|----------|----------------|
| Mobile | Mapa **arriba** `h-[360px]` (F5 = 300px, +20%) |
| Desktop | Mapa sticky `lg:h-[calc(100vh-200px)]` (~+20% vs F5 `240px` chrome) |
| Lista | Debajo del mapa; máx. 20 cards; paginación no mueve mapa |
| Token | `--explore-map-min-h-mobile: 360px` |

### ExploreCount

| Copy | `{N} fruterías a {R} km` |
| Fuente | `meta.total` + `meta.radiusKm` — **prohibido** `data.length` |
| Empty | No “0 de 20”; empty borrega + Ampliar radio |

### ExploreMarker

| Reposo | Lucide `Store` o pin 28×28 `--brand` / slate-800; contraste sobre teselas |
| Hover/focus/tap | Tooltip `businessName` `text-sm text-slate-900 bg-white shadow` |
| Segundo tap | Abre ProviderPreviewSheet |
| Won't | Label permanente; clustering |

### ProviderPreviewSheet

| Layout | Sheet móvil 90vh; desktop drawer/`max-w-lg` |
| Horario | 3 cols `>=640px`; apilado `<640px`; `max-h-48 overflow-y-auto` |
| OpenNow | Chip texto+icono; oculto si `isOpenNow=null` |
| Flags | Icono+label solo si API true (WA exige `phone`) |
| CTA | **Ver frutería** Primary; **Ver todas las reseñas** Secondary → `#resenas` |
| A11y | `role="dialog"`; Escape; CTAs ≥44px |

### OpenNowChip / CapabilityIcons / HoursTable / WholesaleRetailChips

Usar paleta feedback F3 para abierta (`emerald`) / cerrada (`slate`); **nunca** color-only. Labels visibles.

### SessionPersistBanner

| Copy | “No pudimos mantener tu sesión en este navegador. Revisa que las cookies estén permitidas e intenta de nuevo.” |
| Estilo | `bg-red-50 text-red-800` + Reintentar secondary |
| Prohibido | SameSite, Secure, JWT, CORS en UI |

---

## 7. Micro-interacciones (Fase 3–7)

| Elemento | Transición |
|----------|------------|
| Botones | `transition-colors duration-200` |
| Cards | `transition-shadow duration-200` |
| Price bubble mapa | `transition: all 0.15s ease` |
| Menú dropdown | fade + slide 150ms |
| QuantityStepper | `active:scale-95` en botones ± |
| NumericKeypad | ripple sutil `bg-gray-100` 100ms al tap |
| TicketLine add/remove | slide-in 150ms + recálculo total animado `transition-all duration-150` |
| OrderCard status change | badge cross-fade 200ms; toast confirmación |
| SubNavProveedor | underline slide `transition-[border-color] duration-200` |
| BarChartIlustrativo | barras `animate-in` height 300ms stagger 50ms (prefer-reduced-motion: instant) |
| ConfirmDialog | overlay fade 150ms; panel scale 95→100% 200ms |
| RadiusSlider | thumb `transition` 100ms; reduced-motion: instant |
| BrandColorPicker | preview CTA actualiza al instante; reduced-motion: sin fade |
| ProductActiveSwitch | thumb 150ms; reduced-motion: instant |
| EtaChip | fade-in 150ms al resolver ETA |
| ScaleStatusBadge | cross-fade 200ms al conectar/desconectar |
| RatingStars input | `active:scale-95` por estrella |
| GrainSelector | underline/fill `duration-200`; reduced-motion: instant |
| BrandLoader | loop 500 ms; reduced-motion: B1 estático |
| RadiusClampHint | fade 150 ms; reduced-motion: instant |
| DocumentActions PDF | spinner en botón; no pulse de página |
| ExploreMarker tooltip | fade 100 ms; reduced-motion: instant |
| fitBounds círculo | animación Leaflet default; reduced-motion: instant |
| ProviderPreviewSheet | overlay fade 150 ms; reduced-motion: instant |

---

## 8. Accesibilidad (WCAG 2.1 AA) — actualizado F7

| Requisito | Implementación |
|-----------|----------------|
| Contraste texto | Mínimo 4.5:1 body; 3:1 texto grande |
| Focus visible | `ring-2` en todos los interactivos |
| Labels | `htmlFor` + `id` en todos los inputs |
| Errores | `aria-live="polite"` en contenedor de errores |
| Mapa | Lista alternativa accesible; markers con `aria-label` |
| Teclado | Tab order lógico; Escape cierra menús y modales |
| **Estado pedido** | Badge siempre texto + icono; nunca solo color (regla F3) |
| **Origen / venta rápida** | OriginBadge y QuickSaleBadge con label visible |
| **POS keypad** | Botones con `aria-label` numérico; input anunciado |
| **Carrito auth gate** | Focus al mensaje login; CTA "Iniciar sesión" dominante |
| **IN_TRANSIT copy** | SR: "Listo para recoger" (pickup) o "En camino" (delivery) |
| **Mapa F5** | Lista siempre alternativa; Leaflet lazy; fallback **solo red** (no API key); attribution OSM |
| **Rating 0** | Anunciar "Sin reseñas todavía", no "cero estrellas" |
| **Verificación Google** | Banner `info` + controles `disabled` con razón en `aria-describedby` |
| **Báscula** | Badge texto+icono; keypad F3 sigue siendo el fallback a11y |
| **Admin split** | Leyenda texto + tabla sr-only |
| **Reduced motion** | `prefers-reduced-motion`: desactivar animaciones chart/stepper/slider |
| **Touch POS** | Targets ≥44px en catálogo grid, keypad, Cobrar, Conectar báscula |
| **CTA ubicación F5** | **Usar mi ubicación** ≥44px; slider overlay teclado |
| **Marca F5** | Primario no guardable si CTA blanco/primario < 4.5:1; preview `aria-live` |
| **Toggle catálogo** | Nombre accesible "{producto}, Activo\|Inactivo"; hint `aria-describedby` |
| **Reportes F6** | GrainSelector y date picker teclado; Imprimir/PDF ≥44px; chart + tabla sr-only; print chrome oculto |
| **GEO F6** | Círculo no tapa attribution; slider vivo; `aria-busy` + sr-only "Buscando fruterías"; clamp hint `role="status"` |
| **BrandLoader** | Reduced motion = B1; no splash; lista previa en error; empty ≠ `aria-busy` |
| **GEO F7** | Pan no refetch; mapa no pierde viewport al paginar; slider/GPS ≥44px; markers nombre en tooltip/focus |
| **Preview F7** | Sheet dialog; horario apilable; flags con texto |
| **AUTH F7** | SessionPersistBanner `alert`; sin jerga de cookies técnicas |

---

## 9. Referencia Tailwind rápida

```text
CTA primario:     py-3 bg-[var(--brand)] text-white rounded-lg font-semibold hover:bg-[var(--brand-dark)] disabled:opacity-50
Input:            w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--brand)]
Error inline:     text-sm text-red-600 mt-1
Grid explorar:    grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8
Split explorar:   flex-col (mapa primero); lista debajo; móvil mapa h-[360px]

# Fase 3 — POS split
POS split:        flex flex-col lg:flex-row min-h-[calc(100vh-8rem)]
POS catálogo:     lg:w-[58%] overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3
POS ticket:       lg:w-[42%] bg-slate-100 border-l border-gray-200 flex flex-col sticky top-0
Cobrar CTA:       mt-auto p-4 border-t bg-white w-full py-4 bg-[var(--brand)] text-white font-semibold rounded-lg

# Stepper
Stepper:          inline-flex items-center border border-gray-300 rounded-lg overflow-hidden
Stepper btn:      h-11 w-11 flex items-center justify-center hover:bg-gray-50 focus:ring-2 focus:ring-[var(--brand)]
Stepper value:    w-16 text-center font-mono border-x border-gray-300 py-2

# Badges F3
Badge base:       inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
Status pending:   bg-amber-50 text-amber-800
Status transit:   bg-blue-50 text-blue-800   /* pickup: Listo para recoger; delivery: En camino */
Origin online:    bg-slate-100 text-slate-700
Quick sale:       bg-orange-50 text-orange-800

# Fase 4
Slider radio:     w-full accent-[var(--brand)]
EtaChip:          inline-flex items-center gap-1.5 text-sm text-slate-800
Verify banner:    bg-blue-50 text-blue-900 border border-blue-100 rounded-lg px-4 py-3
Scale connected:  bg-emerald-50 text-emerald-800
Admin page:       bg-slate-50; KpiCardAdmin border-slate-200
Rating empty:     text-slate-500 — "Sin reseñas todavía"

# Fase 5
CTA ubicación:    min-h-11 px-4 border border-gray-300 bg-white (banner FilterBar)
Slider overlay:   absolute bottom-0 inset-x-0 bg-white/95 px-4 py-3; label text-slate-600
Mapa Leaflet:     attribution OSM visible; dynamic import
Picker color:     flex gap-2; input[type=color] h-11 w-11 + hex input
Empty POS F5:     "No hay productos activos" + Ir a Catálogo (secondary)
Toggle catálogo:  Activo / Inactivo — no "agotado"
Brand sesión:     document.documentElement style --brand / --brand-secondary (solo PROVIDER)

# Fase 6
Switcher dashboard:  Resumen | Reportes — tabs locales, no 5ª SubNav
GrainSelector:       segmented min-h-11; date/month/year según grain
DocumentActions:     Button Secondary Imprimir + PDF; nunca primary
Print:               .no-print chrome; @page margin 16mm; texto slate-900
BrandLoader:         64px lista; loop B1-B2-B3 500ms; reduced-motion B1
Clamp hint:          "Máximo 25 km" sobre slider; no tapa OSM
Círculo mapa F6:     zoom↔slider — SUPERSEDIDO F7

# Fase 7
Count explorar:   text-sm text-slate-700 — N = meta.total
Marker:           28px Store; tooltip bg-white
Loader loading:   64px; empty: 80px
Preview sheet:    max-w-lg; horario table / stack <640px
Session banner:   bg-red-50 text-red-800
Círculo mapa:     siempre visible si hay coords; pan ≠ radiusKm (CO-F7-001)
```
