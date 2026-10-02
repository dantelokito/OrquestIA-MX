# REVIEW-UX — Quality Gate Frontend Fase 5

> **Proyecto:** LaBorregaMarket  
> **Fase:** 5 — GEO Leaflet/OSM, catálogo endurecido, marca por proveedor (v0.5.0)  
> **Fecha:** 15/08/2026  
> **Agente:** UX/UI Designer  
> **Solicitud auditada:** `Agente frontend/.../fase-5/quality/QR-FE.md` (Frontend, 89/100)  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket\src`  
> **Veredicto:** **APROBADO CON OBSERVACIONES**  
> **Puntaje:** 86 / 100 · **0 P0** · 1 P1 · 6 P2

No se copia el auto-score de QR-FE (89/100). Esta auditoría es independiente contra UF/WF de `fase-5/` + `comun/` v0.5.0.

El dictamen previo de este archivo era **DoD de diseño** (sin código). Queda sustituido por esta rúbrica de implementación.

---

## Alcance auditado

| Ruta | Archivo principal | Wireframe |
|------|-------------------|-----------|
| `/explorar` | `ExplorePageClient.tsx`, `FilterBar`, `CompactAddressBar`, `ExploreMap`, `RadiusSlider` | `WF-explorar-leaflet.md` |
| `/fruteria/[id]` | `ProductTable.tsx`, `MiniMap.tsx` (Leaflet) | `WF-catalogo-canales.md` |
| `/carrito` | `CartPageClient.tsx` (toast + 409) | `WF-catalogo-canales.md` |
| `/proveedor` | `ProveedorPageClient.tsx`, `BrandColorPicker.tsx` | `WF-proveedor-marca.md`, `WF-catalogo-canales.md` |
| `/proveedor/pos` | `PosPageClient.tsx` empty activos + 409 cobro | `WF-catalogo-canales.md` |
| Layout | `SessionThemeProvider.tsx` | US-BRAND-02 |

**Referencias de diseño:** [`handoff-frontend.md`](../handoff-frontend.md), [`user-flows/`](../user-flows/), [`wireframes/`](../wireframes/), [`comun/design-tokens.md`](../../comun/design-tokens.md) v0.5.0.

QR-FE: `Agente frontend/.../fase-5/quality/QR-FE.md`. Handoffs: `FEAT-GEO`, `FEAT-CAT`, `FEAT-BRAND`. Contratos: Arquitecto `API-GEO-01`, `API-PROVIDER-PRODUCTS-01`, `API-PROVIDER-SETTINGS-01`, `API-SESSION-THEME-01`.

---

## Rúbrica (10 × 10)

| # | Criterio | Pts | Nota |
|---|----------|-----|------|
| 1 | Fidelidad a wireframes F5 | 8 | Banner CTA, CompactAddressBar, slider overlay, Leaflet, picker, toggle Activo/Inactivo, empty POS, toast carrito. Gaps: Ampliar radio secondary; switch verde vs `--brand`; clustering Should omitido. |
| 2 | Responsive (móvil / tablet / desktop) | 9 | Lista explorar primero; mapa `h-[300px]` móvil; CTA ubicación `w-full`; overlay radio; POS 58/42. |
| 3 | 4 estados UI | 9 | Explorar: loading / empty radio / teselas down / success. Picker skeleton/error/success. POS empty activos. Toggle spinner+check. |
| 4 | Consumo de API | 9 | Haversine F4 intacta; Nominatim cliente; `GET /api/auth/session`; PATCH colores; 409 orders/POS. Sin rutas UX inventadas. |
| 5 | Validación de formularios | 9 | Radio 1–25; geocode ≥3; hex `#RRGGBB`; primario 4.5:1 Must; par ambos o null; Guardar disabled si falla. |
| 6 | Accesibilidad WCAG AA basal | 8 | Lista alternativa; slider teclado y labels `text-slate-500`; CTA ≥44px; attribution OSM `topright`; toast `role="status"`. ETA disclaimer sigue `slate-400` (P1). Markers `title`, preview marca sin `aria-live`. |
| 7 | Regresiones F3/F4 | 9 | ContactCTA + Encargar; pickup; embed Google `US-REV-03`; MiniMap ahora Leaflet (cierra OBS-UX-F4-018). Residual F4: Conectar báscula primary; ops sin “En camino”. |
| 8 | Change orders F5 (`CO-F5-001`) | 9 | Leaflet + OSM; `@vis.gl/react-google-maps` fuera; no hay fallback “sin API key”. Clustering Should no incluido (declarado). |
| 9 | Idempotencia / 409 | 8 | Carrito 409 + revalidate + toast; POS cobro “Ese producto ya no está a la venta”. |
| 10 | Modularidad y tokens | 8 | `lib/maps`, `lib/color/contrast`, `SessionThemeProvider`. Switch catálogo `green-100` ≠ `--brand`. Círculo mapa no rehidrata tema. |
| | **Total** | **86** | Umbral 80% |

---

## Hallazgos

### OBS-UX-F5-001 (P1) — Disclaimer ETA y microcopy de carrito sin contraste AA

`EtaChip.tsx` y `CartPageClient.tsx`: “Es una estimación…” / “Estimación de tiempo no disponible” / “Sin pago en línea” en `text-slate-400` `text-xs`. Tokens F5: `text-slate-500` o más oscuro. Ratio slate-400 sobre blanco ≈ 2.5:1 (falla 4.5:1). El slider F5 **sí** pasó a `text-slate-500` (cierra esa parte de OBS-UX-F4-011); el carrito no.

**Acción:** `text-slate-500` o `text-slate-600` en disclaimer ETA y microcopy del checkout.

### OBS-UX-F5-002 (P2) — Switch Activo usa verde, no `--brand`

`ProveedorPageClient.tsx`: ON = `bg-green-100 text-green-700`. Tokens §6d `ProductActiveSwitch`: Switch `--brand`. El copy Activo/Inactivo cumple (no es color-only).

**Acción:** track/thumb con `var(--brand)` en estado Activo.

### OBS-UX-F5-003 (P2) — Empty radio: Ampliar radio no es el CTA dominante

`ExplorePageClient.tsx`: **Ampliar radio** y **Limpiar filtros** son `variant="secondary"`. `WF-explorar-leaflet` y EmptyState tokens: Ampliar radio es el CTA del empty.

**Acción:** Ampliar = Button Primary; Limpiar filtros permanece secondary.

### OBS-UX-F5-004 (P2) — Markers y preview de marca sin anuncio a11y

`ExploreMap.tsx`: markers con `title`, no `aria-label` nombre + precio (la lista sigue siendo la alternativa). `BrandColorPicker.tsx`: ContrastHint live sin `aria-live="polite"` en el preview (`WF-proveedor-marca`).

**Acción:** `aria-label` en markers o documentar que el mapa es `aria-hidden` respecto a la lista; preview `aria-live="polite"`.

### OBS-UX-F5-005 (P2) — Arrastre F4 (fuera del delta F5, sigue visible)

- `ScaleStatusBadge.tsx`: **Conectar** sigue `bg-[var(--brand)]` (OBS-UX-F4-010).
- `OrdenesPageClient.tsx`: CONFIRMED → IN_TRANSIT siempre “Listo para recoger” (OBS-UX-F4-012).
- `OrderStatusBadge.tsx`: `IN_TRANSIT` `emerald-50`; `DELIVERED` icono `Truck` (OBS-UX-F4-013).

No bloquean F5. QA puede reusar la matriz F4 en paralelo.

### OBS-UX-F5-006 (P2) — Clustering Should no implementado

FEAT-GEO lo declara. Must de radio Haversine y lista sí están. Viewport sync (Should) sí: `visibleProviders` recorta al bounds.

**Acción:** backlog Should; no exigir en DoD Must.

### OBS-UX-F5-007 (P2) — Círculo Haversine no sigue el tema PROVIDER

`ExploreMap.tsx`: `brandStroke` en `useMemo(..., [])` lee `--brand` una vez. Si la sesión PROVIDER hidrata después, el círculo queda en plataforma hasta remount.

**Acción:** leer `--brand` al pintar o depender de un token de sesión.

---

## Cumplimiento DoD F5 (resumen)

| Regla | Resultado |
|-------|-----------|
| Leaflet + OSM; sin fallback API key | OK · cierra OBS-F4-023 |
| CTA ubicación banner ≥44px; radio overlay pie de mapa | OK |
| Favoritas en barra compacta (no LocationBar F4) | OK |
| 4 estados Explorar (loading / success / empty radio / teselas red) | OK |
| Lista alternativa a11y; attribution OSM | OK · crédito `topright` (no tapado por overlay) |
| Toggle Activo/Inactivo; no stock; empty POS; toast carrito | OK copy; switch color P2 |
| Primario no se guarda si contraste CTA < 4.5:1 | OK · Guardar disabled + error |
| Tema scoped a sesión PROVIDER; logout limpia | OK · `refreshSessionTheme` en login/logout |
| CLIENT no pinta cards con marca ajena | OK |
| Pickup F3, Haversine F4, embed Google `US-REV-03` | OK |
| Sin pasarela / Maps JS Explorar / bbox Must | OK |

---

## Veredicto

**APROBADO CON OBSERVACIONES** — La implementación F5 cumple el umbral (86%) sin P0. El Must de Leaflet, layout Explorar, catálogo en canales y marca de sesión está cubierto. El P1 es contraste AA en microcopy de carrito (arrastre F4); no impide probar GEO/CAT/BRAND.

**QA Tester:** contactar vía [`READY-FOR-QA.md`](./READY-FOR-QA.md). Arquitecto: 97/100, 0 P0 (`REVIEW-ARCH` F5).

---

*Dictamen UX/UI — LaBorregaMarket v0.5.0 — 15/08/2026.*
