> **Pantalla:** Media proveedor — Imagen del negocio (`/proveedor`)
> **Objetivo Principal:** Subir o reemplazar logo y portada del negocio con preview y validación clara
>
> ```text
> +-----------------------------------------------------------------------+
> | [Header autenticado PROVIDER]                                         |
> +-----------------------------------------------------------------------+
> |  Mi catálogo — Frutas El Paraíso          [Ver mi negocio →]         |
> +-----------------------------------------------------------------------+
> |  Imagen del negocio                                                   |
> |  Logo y portada visibles en explorar y en tu página pública.        |
> |                                                                       |
> |  LOGO                          PORTADA                                |
> |  ┌──────────────┐              ┌────────────────────────────────┐   |
> |  │   (circle)   │              │     banner preview 16:9        │   |
> |  │  logo / PH   │              │     cover / ImagePlaceholder   │   |
> |  └──────────────┘              └────────────────────────────────┘   |
> |  [ Cambiar logo ]              [ Cambiar portada ]                   |
> |  JPEG, PNG o WebP · máx 5MB    Recomendado 1200×600 · máx 5MB      |
> |  (error inline si aplica)      (error inline si aplica)              |
> +-----------------------------------------------------------------------+
> |  … tabla catálogo productos (WF-proveedor-panel) …                   |
> +-----------------------------------------------------------------------+
> ```
>
> ### Estado empty (sin imagen)
>
> ```text
> |  LOGO: ImagePlaceholder circular (icono tienda neutro)               |
> |  PORTADA: ImagePlaceholder banner (ilustración neutra, no stock)     |
> |  CTAs: "Subir logo" / "Subir portada"                                 |
> ```
>
> ### Estado uploading
>
> ```text
> |  Preview con overlay semi-transparente + spinner                      |
> |  Botones disabled; hint "Subiendo…"                                   |
> ```
>
> #### Estados de la sección
>
> | Estado | Comportamiento UI |
> |--------|-------------------|
> | **Empty** | Placeholder + CTA "Subir …" |
> | **Preview** | Imagen actual + "Cambiar …" |
> | **Uploading** | Overlay + disabled; skeleton opcional en preview |
> | **Success** | Preview nueva URL + check/toast breve 2s |
> | **Error formato** | Inline: `Formato no permitido. Use JPEG, PNG o WebP` |
> | **Error tamaño** | Inline: `El archivo supera el límite de 5MB` |
> | **Error red** | Inline genérico + Reintentar; URL previa intacta |
>
> #### Componentes Requeridos para Frontend:
> * **MediaUpload:** input `type="file"` accept `image/jpeg,image/png,image/webp` + label asociado; hidden input + botón visible.
> * **LogoPreview:** círculo fijo (ej. 96×96) — dims fijas anti-CLS.
> * **CoverPreview:** banner aspect ~2:1 o 1200×600; `object-cover`.
> * **ImagePlaceholder:** variante `business-logo` | `business-cover`.
> * **InlineError:** `text-red-600 text-sm` + `aria-live="polite"` por campo.
> * Touch targets botones ≥ **44px**.
>
> #### Responsividad:
> * **Mobile:** Stack vertical logo → portada; botones `w-full`.
> * **Desktop:** Grid 2 columnas logo | portada dentro de `max-w-5xl`.
>
> #### API esperada:
> * `POST /api/provider/media` multipart — `field`: `logo` | `cover`.
> * Response: `{ data: { url, field: "logoUrl"|"coverUrl" } }`.
>
> #### Referencias:
> * Flujo: `UF-MEDIA-01-upload-proveedor.md`
> * Panel contenedor: `WF-proveedor-panel.md` (OBS-04 PriceInput sigue siendo P0 en tabla)
> * Admin producto: ver sección media en `WF-admin-panel.md`
> * Tokens: MediaUpload, ImagePlaceholder en `design-tokens.md`
