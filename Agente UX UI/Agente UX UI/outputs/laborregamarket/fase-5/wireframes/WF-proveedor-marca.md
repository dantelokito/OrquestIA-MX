> **Pantalla:** Colores de marca del negocio (`/proveedor`) — Fase 5 BRAND
> **Objetivo Principal:** Elegir primario y secundario con preview de contraste y aplicarlos a la sesión PROVIDER
> **Base:** Extiende [`../../fase-2/wireframes/WF-proveedor-media.md`](../../fase-2/wireframes/WF-proveedor-media.md) (junto a logo/portada). No rediseña Google/ETA F4.

```text
+-----------------------------------------------------------------------+
| [Header PROVIDER]                                                     |
| [ Catálogo | POS | Órdenes | Dashboard ]  ← Catálogo activo           |
+-----------------------------------------------------------------------+
|  Mi catálogo — Frutas El Paraíso          [Ver mi negocio →]         |
+-----------------------------------------------------------------------+
|  Imagen del negocio  (logo + portada F2 — sin cambio)                 |
+-----------------------------------------------------------------------+
|  Colores de tu marca                                                  |
|  Primario y secundario se ven en tu panel, POS y si entras a Explorar |
|  con tu cuenta de frutería. Los clientes siguen viendo la marca de    |
|  LaBorregaMarket.                                                     |
|                                                                       |
|  PRIMARIO                         SECUNDARIO                          |
|  [ 🎨 #2F6B3A        ]            [ 🎨 #F4C430        ]               |
|  native color + hex text          native color + hex text             |
|                                                                       |
|  Preview                                                              |
|  [ Encargar / Cobrar ]  texto blanco sobre primario                   |
|  [ Acento chip ]        fondo secundario + texto (si AA; si no, hint) |
|  Contraste CTA: ✓ Cumple WCAG AA   |  ✗ Insuficiente (Should live)    |
|                                                                       |
|  [ Guardar colores ] PRIMARY      [ Restaurar marca de plataforma ]   |
+-----------------------------------------------------------------------+
|  … tabla catálogo (WF-catalogo-canales) …                             |
|  … config Google + prep time F4 (sin cambio) …                        |
+-----------------------------------------------------------------------+
```

### Estado — contraste insuficiente (Must al guardar)

```text
|  PRIMARIO [ #FFFF00 ]                                                 |
|  Preview: botón ilegible                                              |
|  ✗ El color primario no tiene suficiente contraste para el texto      |
|    del botón. Ajústalo o usa la marca de la plataforma.               |
|  [ Guardar colores ] disabled  |  [ Restaurar marca de plataforma ]   |
```

### Estado — reset / fallback

```text
|  PRIMARIO [ vacío / plataforma ]   SECUNDARIO [ vacío / plataforma ]  |
|  Preview usa --brand #e23744 y --brand-dark #c13515                   |
|  Hint: "Usas los colores de LaBorregaMarket"                          |
```

#### Estados de la sección

| Estado | Comportamiento UI |
|--------|-------------------|
| **Loading** | Skeleton 2 pickers + preview |
| **Default (null)** | Campos vacíos; preview = plataforma |
| **Preview live** | Botón/acento se actualizan al cambiar hex (Should contraste en vivo) |
| **Hex inválido** | Inline: "Usa un color hexadecimal (#RRGGBB)" |
| **Contraste fail** | Inline error; Guardar disabled o PATCH 422; **no persiste** |
| **Saving** | Guardar spinner; pickers disabled |
| **Success** | Toast "Colores de tu marca actualizados"; chrome (SubNav, CTAs) hidrata tokens |
| **Error red** | ErrorBanner + Reintentar |
| **Reset** | Confirmar opcional; campos null; tokens globales |

#### Componentes Requeridos para Frontend:
* **BrandColorPicker:** input `type="color"` + text hex; primario y secundario.
* **BrandPreview:** Button Primary (texto blanco) + chip acento secundario.
* **ContrastHint:** Should — pasa/falla AA (texto blanco sobre primario, ratio ≥ 4.5:1).
* **SaveBrandColors:** CTA dominante del bloque.
* **ResetPlatformBrand:** Button Ghost; copy "Restaurar marca de plataforma".

#### Theming (US-BRAND-02) — no es una pantalla nueva

| Sesión | Chrome |
|--------|--------|
| **PROVIDER** con colores válidos | `--brand`, `--brand-dark`, `--brand-secondary` en `:root` de la sesión. Aplica panel, POS, ops, dashboard, `/explorar`. |
| **PROVIDER** sin colores o contraste inválido | Tokens plataforma |
| **CLIENT / ADMIN / invitado** | Tokens plataforma. Cards de `/explorar` **nunca** usan el primario de cada frutería |
| **Logout** | Limpia overrides |

Estados de pedido, OriginBadge y QuickSaleBadge **no** usan `--brand` del proveedor.

#### Responsividad:
* **Mobile:** Pickers stack; Guardar `w-full`; Reset debajo.
* **Desktop:** 2 cols pickers; preview a la derecha o debajo; `max-w-2xl`.

#### Accesibilidad:
* Labels "Color primario" / "Color secundario" con `htmlFor`.
* Preview anunciado `aria-live="polite"` al cambiar contraste.
* Guardar no disponible hasta contraste AA o mensaje de error asociado (`aria-describedby`).
* Focus ring usa `var(--brand)` de la sesión.

#### API esperada:
* `PATCH /api/provider/profile` — `{ primaryColor?, secondaryColor? }` (hex o `null`). Rechazo contraste: Arquitecto.
* Hidratación: sesión PROVIDER (`/api/auth/me` o contrato de tema — no inventar ruta).

#### Referencias:
* Flujo: `../user-flows/UF-BRAND-01-colores-negocio.md`
* Media: `../../fase-2/wireframes/WF-proveedor-media.md`
* Google F4 (sin cambio): `../../fase-4/wireframes/WF-proveedor-google.md`
