# OBSERVABILITY — Frontend LaBorregaMarket

> **Agente:** Frontend Developer  
> **Proyecto:** laborregamarket  
> **Versión:** 0.2.0  
> **Fecha:** 10/08/2026  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Estado global

| Sprint | Estado | Notas |
|--------|--------|-------|
| Sprint 0 (OBS F1) | Cerrado | OBS-01/03/04/05/06 verificados en código |
| F2-A NOTIFY | Entregado | ContactCTA + toast + POST contact + admin email badge |
| F2-B MEDIA | Entregado | Upload logo/cover + admin product image + placeholders |
| F2-C EXPLORE | Entregado | `category`/`q`/`verified` server-side + URL sync (cierra OBS-02) |

---

## Sprint 0 — cierre OBS

| OBS | Prioridad | Resultado |
|-----|-----------|-----------|
| OBS-01 | P0 | Mapa móvil `h-[300px]` debajo de lista en `/explorar` |
| OBS-04 | P0 | `PriceInput` editable + PATCH en `/proveedor` |
| OBS-03 | P1 | Hint password login y registro |
| OBS-05 | P1 | Cuentas demo solo si `NODE_ENV !== "production"` |
| OBS-06 | P1 | CLIENT post-login → `/` |
| OBS-02 | P1 | Cerrado en F2-C (chips → API `category`) |

---

## APIs consumidas (Fase 2)

| Método | Ruta | Feature |
|--------|------|---------|
| POST | `/api/providers/[id]/contact` | NOTIFY |
| POST | `/api/provider/media` | MEDIA proveedor |
| POST | `/api/admin/products/[id]/image` | MEDIA admin |
| GET | `/api/providers?category&q&verified&page` | EXPLORE |
| GET | `/api/admin/providers` | `hasValidEmail` badge |

---

## Handoffs

- `feature-handoffs/FEAT-SPRINT0-handoff.md`
- `feature-handoffs/FEAT-NOTIFY-handoff.md`
- `feature-handoffs/FEAT-MEDIA-handoff.md`
- `feature-handoffs/FEAT-EXPLORE-handoff.md`
- `integration-readme.md`
- `.env.example`
- `handoff-ux-quality-gate-fase-2.txt` — prompt Quality Gate para @UX_UI_Designer
- `handoff-ux-quality-gate-fase-2.md` — índice del handoff UX

---

## Quality Gate UX (downstream)

| Campo | Valor |
|-------|-------|
| Estado | Pendiente auditoría UX |
| Solicitud | `handoff-ux-quality-gate-fase-2.txt` |
| Dictamen esperado | `Agente UX UI/.../OBSERVABILITY.md` → sección "Auditoría de Diseño y UX (Frontend)" |
| Fecha solicitud | 12/08/2026 |

---

## Fuera de alcance (confirmado)

Checkout, carrito, `POST /api/orders`, WhatsApp Business API, push/SMS, galerías múltiples.

---

## Fase 5 — 14/08/2026 (append)

- GEO: Leaflet + OSM en `/explorar` y MiniMap; Nominatim; CTA banner; radio overlay. Cierra OBS-F4-023. Sin Maps JS key.
- CAT: inactivos ocultos en detalle/carrito/POS; toast retiro; empty POS; 409.
- BRAND: SessionThemeProvider + BrandColorPicker; scoped PROVIDER.
- QR-FE: `fase-5/quality/QR-FE.md` (89/100) → UX. No invocar QA.

---

## Fase 7 — 18/08/2026 (append)

- GEO Explorar mapa-primero (`CO-F7-001`): pan/zoom no derivan `radiusKm`; mapa arriba (360px móvil / `calc(100vh-200px)` desktop); `limit=20`; conteo `meta.total` / `meta.radiusKm`; markers Store 28px + tooltip; BrandLoader 64/80.
- ADDRESSES: centro San Nicolás (ADR-026) o last-used vía `POST .../addresses/[id]/use`; API gana a sessionStorage.
- PREVIEW: sheet vitrina (horario, flags iff true, 3 reseñas, `#resenas`); toast + refetch en 404.
- AUTH: `credentials: 'include'` + `SessionPersistBanner` si la cookie no persiste post-login.
- QR-FE: `fase-7/quality/QR-FE.md` (95/100) → UX. No invocar QA.

---

## Fase 7 — BUG-013 FilterBar colapsable (23/08/2026, append)

| Campo | Valor |
|-------|-------|
| **Ticket** | BUG-013 Major P2 — fix Frontend aplicado |
| **Código** | `ExplorePageClient.tsx`, `FilterBar.tsx`, `globals.css` |
| **Comportamiento** | Scroll down ≥100px colapsa FilterBar; pestaña «Filtros» re-expande; filtros/URL persisten |
| **Regresiones** | EC-GEO-17, EC-GEO-18, CO-F7-001 sin cambio |
| **Tests** | Unit 202/202 Pass (23/08) |
| **Pendiente QA** | HP-GEO-19, EC-GEO-19 Pass → cerrar BUG-013; re-prueba EC-GEO-18/17 → cerrar BUG-012 |
| **Handoff** | `fase-7/feature-handoffs/FEAT-GEO-EXPLORE-handoff.md` §10 |

*Append Frontend F7 BUG-013 — 23/08/2026.*

---

## Fase 7 — BUG-014 CompactAddressBar horizontal (24/08/2026, append)

| Campo | Valor |
|-------|-------|
| **Ticket** | BUG-014 Major P2 — fix Frontend aplicado |
| **Código** | `CompactAddressBar.tsx`, `FavoriteAddressSelect.tsx`, `globals.css` |
| **Comportamiento** | Fila única ≥640px (buscar + favoritas + guardar, h-11); stack móvil; label sr-only en tablet+ |
| **Regresiones** | IDs e2e, HP-GEO-03, EC-GEO-17, CO-F7-001, HP-GEO-09 sin cambio de contrato |
| **Pendiente QA** | HP-GEO-20, EC-GEO-20 Pass → cerrar BUG-014 |
| **Handoff** | `fase-7/feature-handoffs/FEAT-GEO-EXPLORE-handoff.md` §11 |

*Append Frontend F7 BUG-014 — 24/08/2026.*

---

## Fase 8 — Explorar polish (24/08/2026, append)

| Campo | Valor |
|-------|-------|
| **Sprint** | v0.8.3 P1–P4 |
| **Código** | LocationChip/Panel, RadiusSlider 0.5–10, ExploreMap maxBounds MX, ProviderPreviewPopover |
| **Comportamiento** | Chip único; overlay compacto; mapa México; preview hover/long-press; sin «Vista rápida»; sin `Math.round` |
| **Invariantes** | CO-F7-001, Leaflet/OSM, FilterBar intacto |
| **Tests** | 223 passing; `next build` limpio |
| **QR-FE** | `fase-8/quality/QR-FE.md` (93/100) → UX. No invocar QA. |

*Append Frontend F8 — 24/08/2026.*

---

## Fase 9 — Deuda Explorar (25/08/2026, append)

| Campo | Valor |
|-------|-------|
| **Sprint** | v0.9.0 P1–P5 (CO-F9-001) |
| **Código** | FilterBarF9, ProviderCard distance/ETA, ExploreChromeF9, ExploreTypeahead, ProviderPreviewInCard |
| **Comportamiento** | Mayoreo/Domicilio URL; sin Orgánico/Filtros; sin minPrice; typeahead `limit=10`; preview in-card; mapa 420 / min(520,52vh) |
| **Invariantes** | CO-F7-001, clamp 0.5–10, México, Leaflet/OSM, LocationChip |
| **Tests** | 242 passing; `next build` limpio |
| **QR-FE** | `fase-9/quality/QR-FE.md` (92/100) → UX. No invocar QA. |

*Append Frontend F9 — 25/08/2026.*

---

## F9 quick fix — preview overlay in-card (25/08/2026, append)

| Campo | Valor |
|-------|-------|
| **Bug** | Long-press/hover: submódulo de información se veía fuera del card |
| **Fix** | Shell `provider-card-shell overflow-hidden`; overlay absoluto slide-up dentro del borde |
| **Archivos** | `ProviderCard.tsx`, `ProviderPreviewInCard.tsx`, `globals.css` |
| **Tests** | 242 passing; `next build` limpio |

*Append F9 preview overlay — 25/08/2026.*

---

## F10 — Admin + catálogo local + reportes (28/08/2026, append)

| Campo | Valor |
|-------|-------|
| **Alcance** | SKU LOCAL + secciones; media disco; `/fruteria` agrupado; admin CRUD global + 4 flags; DemoAccountsBlock unmount prod; Reportes `from`/`to` + print `#report-print-f10` |
| **Fuera** | US-ADMIN-04; Cloudinary Must; GrainSelector/PDF en chrome Reportes; Explorar F9; QA |
| **Tests** | 307 passing; `next build` limpio |
| **QR-FE** | `fase-10/quality/QR-FE.md` (93/100) → UX. No invocar QA. |

*Append Frontend F10 — 28/08/2026.*

---

## F11 — Multi-frutería + reportes generales (12/09/2026, append)

| Campo | Valor |
|-------|-------|
| **Alcance** | Switcher N>1; cookie activa; reportes generales; Nueva frutería; demo Campo Verde; admin por sucursal |
| **Fuera** | US-ADMIN-04; Cloudinary; pagos; print PDF global |
| **QR-FE** | `fase-11/quality/QR-FE.md` (90/100) |

*Append Frontend F11 — 12/09/2026.*

---

## F12 — Inventario / almacén (14/09/2026, append)

| Campo | Valor |
|-------|-------|
| **Alcance** | `/proveedor/inventario`; SubNav; barras CAT; thumbs 48px; toggle POS en catálogo; POS sin candado stock |
| **Fuera** | BOM; Cloudinary; kardex; barra `/fruteria`; bloquear ventas; BL-040; QA |
| **Contratos** | Arch API-INVENTORY-01 / PRODUCTS-12 / PREFS-12; sin MOD-handoff F12 |
| **Tests** | `inventory-capacity.test.ts` 3 passing |
| **QR-FE** | `fase-12/quality/QR-FE.md` (89/100) |

*Append Frontend F12 — 14/09/2026.*

---

## F13 — Visibilidad / archivo / unidad / reportes inventario (16/09/2026, append)

| Campo | Valor |
|-------|-------|
| **Alcance** | Admin GLOBAL+LOCAL; ocultar/restaurar; drawer unidad; descarte; precio/historial; reportes inventario |
| **Fuera** | Explorar/mapa/reseñas/WhatsApp; existencias `/fruteria`; DELETE; kardex; Cloudinary; QA |
| **Contratos** | Arch API-*-13; sin MOD-handoff F13 |
| **Rama** | `feat/f13-catalogo-visibilidad` |
| **Tests** | `catalog-f13.test.ts` 10 passing |
| **QR-FE** | `fase-13/quality/QR-FE.md` (87/100) |

*Append Frontend F13 — 16/09/2026.*

---

## F13 re-alineación JSON Backend (16/09/2026, append)

| Campo | Valor |
|-------|-------|
| **Rama unificada** | `feat/f13-archivo-oferta-unidad` (merge `feat/f13-catalogo-visibilidad` Already up to date; mismo tip `ac166e7`) |
| **JSON** | `handoff-frontend.md` + `MOD-CATALOG-F13-handoff.md` |
| **Tests** | `npx vitest run` → 373 passed / 80 files |
| **Browser** | No (sin sesión) |
| **QR-FE** | `fase-13/quality/QR-FE.md` (90/100) |
| **QA** | Orquestador puede activar; este workspace no lanza QA |

*Append Frontend F13 re-alineación — 16/09/2026.*

---

## F14 panel proveedor (17/09/2026, append)

| Campo | Valor |
|-------|-------|
| **Rama** | `feat/f14-panel-proveedor` |
| **JSON** | `handoff-frontend.md` + MOD SETTINGS / INVENTORY / OFFER-SECTIONS / REPORTS F14 |
| **Tests** | `npx vitest run` → 409 passed / 87 files |
| **Browser** | No (sin sesión) |
| **QR-FE** | `fase-14/quality/QR-FE.md` (90/100) |
| **QA** | Orquestador puede activar; este workspace no lanza QA |

*Append Frontend F14 — 17/09/2026.*





