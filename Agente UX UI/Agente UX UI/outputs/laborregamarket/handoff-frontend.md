# Handoff Frontend — LaBorregaMarket UX/UI v0.2.0

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 10/08/2026  
> **Prioridad:** Sprint 0 (OBS Fase 1) → NOTIFY → MEDIA → EXPLORE filtros

---

## Estado: LISTO PARA IMPLEMENTACIÓN ✅

Diseño Fase 2 (Transacciones / contacto) completo. **Sin checkout.** Código base: `LaBorregaMarket/src/`.

**Lee primero:** [`OBSERVABILITY.md`](./OBSERVABILITY.md)

---

## Orden de implementación sugerido

### Sprint 0 — Cerrar Quality Gate Fase 1 (antes de features F2)

| Orden | Ítem | Ref UX | Prioridad |
|-------|------|--------|-----------|
| 0.1 | Mapa visible en móvil `/explorar` (~300px debajo lista) | `WF-explorar.md`, OBS-01 | P0 |
| 0.2 | `PriceInput` editable en `/proveedor` | `WF-proveedor-panel.md`, OBS-04 | P0 |
| 0.3 | Chips filtros conectados (base) | OBS-02 → completar en Sprint EXPLORE | P1 |
| 0.4 | Hint password, demo gate, redirect CLIENT | OBS-03, OBS-05, OBS-06 | P1 |

### Sprint F2-A — NOTIFY (contacto)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 1 | `ContactCTA` + sticky footer | `WF-contacto-cta.md` | `UF-NOTIFY-01` |
| 2 | Toast `aria-live` en detalle | `WF-contacto-cta.md` | US-NOTIFY-03 |
| 3 | `POST /api/providers/[id]/contact` al clic | `WF-fruteria-detalle.md` | UF-NOTIFY-01 |
| 4 | WhatsApp `wa.me` secundario (Should) | `WF-contacto-cta.md` | US-NOTIFY-04 |

### Sprint F2-B — MEDIA

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 5 | Sección media `/proveedor` | `WF-proveedor-media.md` | `UF-MEDIA-01` |
| 6 | `ImagePlaceholder` + lazy cards/hero | `WF-explorar`, `WF-fruteria-detalle` | US-MEDIA-04/05 |
| 7 | Admin upload imagen producto | `WF-admin-panel.md` | US-MEDIA-02 |

### Sprint F2-C — EXPLORE filtros

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 8 | Chips categoría + verified → URL | `WF-explorar.md` | `UF-EXPLORE-02` |
| 9 | `q` sync header ↔ explorar (≥2 chars) | `WF-explorar.md` | US-EXPLORE-02/03 |
| 10 | Empty filtrado + Limpiar filtros | `WF-explorar.md` | US-EXPLORE-04 |

---

## Entregables UX Fase 2 (índice)

| Tipo | Archivo |
|------|---------|
| Flow | `user-flows/UF-NOTIFY-01-contacto.md` |
| Flow | `user-flows/UF-MEDIA-01-upload-proveedor.md` |
| Flow | `user-flows/UF-EXPLORE-02-filtros.md` |
| WF | `wireframes/WF-contacto-cta.md` |
| WF | `wireframes/WF-proveedor-media.md` |
| WF | `wireframes/WF-explorar.md` (actualizado) |
| WF | `wireframes/WF-fruteria-detalle.md` (actualizado) |
| WF | `wireframes/WF-proveedor-panel.md` (actualizado) |
| WF | `wireframes/WF-admin-panel.md` (actualizado) |
| Tokens | `design-tokens.md` v0.2.0 |

---

## Design system — componentes nuevos

| Componente | Spec en tokens |
|------------|----------------|
| Toast | Success/error, 3–5s, `aria-live="polite"` |
| ContactCTA | Llamar primary + WhatsApp secondary |
| MediaUpload | accept JPEG/PNG/WebP, 5MB, errores inline |
| ImagePlaceholder | business-cover/logo + product-{category} |
| FilterChip | activo `--brand`, `aria-pressed`, 44px |

```text
CTA:     py-3 bg-[var(--brand)] text-white rounded-lg font-semibold hover:bg-[var(--brand-dark)] disabled:opacity-50
Input:   w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--brand)]
Error:   text-sm text-red-600 mt-1
Chip on: border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]
Toast:   fixed rounded-lg shadow-md border bg-white px-4 py-3
```

---

## Estados obligatorios (Fase 2)

| Superficie | Loading | Empty | Success | Error |
|------------|---------|-------|---------|-------|
| ContactCTA / Toast | breve en botón | — | toast notificada | toast no pudimos |
| Media proveedor | overlay upload | placeholder + Subir | preview | inline formato/tamaño |
| Admin producto img | overlay | placeholder | thumb | inline |
| Explorar filtros | SkeletonCard | No encontramos… + Limpiar | grid+mapa | ErrorBanner |

---

## APIs a consumir (no inventar rutas)

| Método | Ruta | Uso UI |
|--------|------|--------|
| POST | `/api/providers/[id]/contact` | ContactCTA |
| POST | `/api/provider/media` | Logo/portada |
| POST | `/api/admin/products/[id]/image` | Admin thumb |
| GET | `/api/providers?category&q&verified&page` | Explorar |

Contratos: handoff Arquitecto Fase 2 (`API-NOTIFY-01`, `API-MEDIA-01`, extensión `API-PROVIDERS-01`).

---

## Accesibilidad (Fase 2)

- [ ] Toast con `aria-live="polite"` / `role="status"`
- [ ] Chips con `aria-pressed`
- [ ] Labels en file inputs (MediaUpload)
- [ ] Errores upload inline + `aria-live`
- [ ] Touch targets ≥44px (chips, upload, CTAs)
- [ ] Mapa móvil visible + lista como alternativa accesible
- [ ] Dims fijas en placeholders (sin CLS)

---

## Checklist DoD UX Fase 2 (verificar en implementación)

- [ ] WCAG AA en Toast, upload, chips
- [ ] Un CTA dominante en detalle: **Llamar**
- [ ] `tel:` nunca bloqueado por rate limit / fallo notify
- [ ] Mapa móvil en explorar (OBS-01)
- [ ] PriceInput editable (OBS-04)
- [ ] Empty filtrado ≠ ErrorBanner
- [ ] Lazy load imágenes en cards
- [ ] Sin UI de checkout / carrito

---

## Fuera de alcance

Checkout, carrito, `POST /api/orders`, WhatsApp Business API, push/SMS, galerías múltiples.

---

*Handoff generado por Agente UX/UI Designer — LaBorregaMarket v0.2.0*
