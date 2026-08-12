# Design Tokens — LaBorregaMarket v0.2.0

> **Agente:** UX/UI Designer  
> **Fecha:** 10/08/2026  
> **Stack UI:** TailwindCSS 4, Next.js App Router, Lucide icons  
> **Fuente código:** `LaBorregaMarket/src/app/globals.css`  
> **Changelog Fase 2:** Toast, ContactCTA, MediaUpload, ImagePlaceholder, FilterChip activo documentado

---

## 1. Paleta de colores

### Brand (ya implementado en CSS)

| Token CSS | Hex | Tailwind equivalente | Uso |
|-----------|-----|------------------------|-----|
| `--brand` | `#e23744` | custom | CTA primario, links activos, focus ring |
| `--brand-dark` | `#c13515` | custom | hover CTA primario |
| `--brand-light` | `#ff5a5f` | custom | acentos, badges suaves |

**Contraste WCAG AA:** `--brand` sobre blanco ≈ 4.6:1 — cumple para texto grande y botones con texto blanco.

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

### Feedback

| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#10B981` | Confirmaciones, toggle activo |
| `warning` | `#F59E0B` | Alertas no bloqueantes |
| `error` | `#EF4444` | Mensajes inline formulario, errores API |
| `info` | `#3B82F6` | Tips informativos |

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

**Contenedor máximo:** `max-w-[1760px]` (header/explorar), `max-w-7xl` (formularios auth).

---

## 4. Bordes y sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | `rounded-lg` (8px) | Inputs, botones |
| `radius-md` | `rounded-xl` (12px) | Cards |
| `radius-full` | `rounded-full` | Pill búsqueda, avatares |
| `shadow-sm` | `shadow-sm` | Cards en reposo |
| `shadow-md` | `shadow-md` | Pill búsqueda hover, dropdown |
| `shadow-lg` | `shadow-lg` | Search expanded, modales |

---

## 5. Breakpoints

| Nombre | Ancho | Comportamiento |
|--------|-------|----------------|
| Mobile | `<= 640px` (`sm`) | 1 columna, botones `w-full`, mapa debajo lista |
| Tablet | `641px – 1023px` | 2 columnas grid explorar |
| Desktop | `>= 1024px` (`lg`) | Split view explorar, header completo |

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
| Copy error | `No pudimos notificar a la frutería` |

### ContactCTA (Fase 2)

| Variante | Estilo |
|----------|--------|
| **Llamar (dominante)** | Button Primary `w-full` móvil; `tel:` |
| **WhatsApp (secundario)** | Button Secondary; `wa.me` — nunca mismo peso que Llamar |
| Loading breve | Spinner en Llamar ≤300ms; no bloquear `tel:` |
| Touch | min-h 44px ambos |

### MediaUpload (Fase 2)

| Estado | Estilo |
|--------|--------|
| Default | Preview + botón Secondary "Cambiar …" / "Subir …" |
| Uploading | Overlay `bg-black/40` + spinner; botones `disabled` |
| Error | `text-red-600 text-sm` bajo control; `aria-live="polite"` |
| Accept | `image/jpeg,image/png,image/webp` · max 5MB |
| Hint | `text-xs text-slate-500` — formatos + límite; portada "Recomendado 1200×600" |

### ImagePlaceholder (Fase 2)

| Variante | Uso | Dims fijas (anti-CLS) |
|----------|-----|------------------------|
| `business-cover` | Hero detalle / card cover | Aspect ~2:1; bg `slate-100` |
| `business-logo` | Avatar logo | Círculo 96×96 (panel) / 48×48 (hero) |
| `product-FRUTA` / `product-VERDURA` / `product-AGRICOLA` | Thumb producto | 40–48px square |
| Estilo | Icono Lucide neutro (`Store` / `Apple` / `Leaf`) `text-slate-400` sobre `bg-slate-100`; **sin** stickers emoji ni stock fotográfico |
| Contraste | Icono sobre fondo cumple AA como decorativo; alt vacío o `alt=""` si es puramente decorativo; en cards usar `alt` del negocio/producto en `<img>` real |

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
| Uso | Loading en explorar, proveedor, detalle |

### StepIndicator (wizard)

| Estado paso | Estilo |
|-------------|--------|
| Completado | círculo `--brand` + check |
| Actual | círculo `--brand` + número |
| Pendiente | círculo `gray-300` + número |

---

## 7. Micro-interacciones

| Elemento | Transición |
|----------|------------|
| Botones | `transition-colors duration-200` |
| Cards | `transition-shadow duration-200` |
| Price bubble mapa | `transition: all 0.15s ease` (ya en globals.css) |
| Menú dropdown | fade + slide 150ms |

---

## 8. Accesibilidad (WCAG 2.1 AA)

| Requisito | Implementación |
|-----------|----------------|
| Contraste texto | Mínimo 4.5:1 body; 3:1 texto grande |
| Focus visible | `ring-2` en todos los interactivos |
| Labels | `htmlFor` + `id` en todos los inputs |
| Errores | `aria-live="polite"` en contenedor de errores |
| Mapa | Lista alternativa accesible; markers con `aria-label` |
| Teclado | Tab order lógico; Escape cierra menús |

---

## 9. Referencia Tailwind rápida

```text
CTA primario:     py-3 bg-[var(--brand)] text-white rounded-lg font-semibold hover:bg-[var(--brand-dark)] disabled:opacity-50
Input:            w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--brand)]
Error inline:     text-sm text-red-600 mt-1
Grid explorar:    grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8
Split explorar:   flex-col lg:flex-row (lista 55%, mapa 45%)
```
