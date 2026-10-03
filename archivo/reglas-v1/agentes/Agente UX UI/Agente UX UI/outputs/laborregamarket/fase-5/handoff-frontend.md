# Handoff Frontend — LaBorregaMarket UX/UI v0.5.0

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 14/08/2026  
> **Prioridad:** F5-A GEO Leaflet + layout → F5-B CAT canales → F5-C BRAND picker + tema sesión

---

## Estado: LISTO PARA IMPLEMENTACIÓN (diseño) ✅

Diseño Fase 5 completo. **No hay código F5 todavía.** Código base: `LaBorregaMarket/src/`. F3–F4 permanecen vigentes (checkout pickup, GEO Haversine, embed Google reseñas `US-REV-03`, POS, dashboard).

**Lee primero:**

- [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.5.0
- [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.4.0
- Contratos Arquitecto F5 (cuando existan) — no inventar rutas fuera de la tabla de APIs
- F4 Explorar (solo lectura): [`../fase-4/wireframes/WF-explorar-geo.md`](../fase-4/wireframes/WF-explorar-geo.md) — **reemplazar** layout y motor

`CO-F5-001` revoca D-F4-2: **no** reintroducir Google Maps JS API en `/explorar`.

---

## Orden de implementación sugerido

### Sprint F5-A — GEO (Leaflet/OSM + layout Explorar)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 1 | Sustituir Google Maps JS por Leaflet + OSM (dynamic import) en `/explorar` | `WF-explorar-leaflet.md` | UF-GEO-01 |
| 2 | Attribution OSM visible; quitar fallback "sin API key" (OBS-F4-023) | `WF-explorar-leaflet.md` | US-GEO-04 |
| 3 | CTA **Usar mi ubicación** en banner (FilterBar), ≥44px | `WF-explorar-leaflet.md` | US-GEO-05 |
| 4 | `CompactAddressBar` (buscar + favoritas + Guardar) — sin slider ni CTA geo | `WF-explorar-leaflet.md` | US-GEO-03 intacto |
| 5 | `RadiusSlider` overlay borde inferior del mapa (1–25, default 10) | `WF-explorar-leaflet.md` | US-GEO-05 |
| 6 | Estados: loading, empty radio, teselas down (lista usable), permiso denegado | `WF-explorar-leaflet.md` | UF-GEO-01 |
| 7 | Should: clustering; lista recortada al viewport (debounce; no bbox Must) | `WF-explorar-leaflet.md` | Should |

Query `lat` `lng` `radiusKm` **sin cambio** (Haversine F4).

### Sprint F5-B — CAT (toggle endurecido)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 8 | Labels **Activo / Inactivo** + hint "no es stock" en `/proveedor` | `WF-catalogo-canales.md` | UF-CAT-01 |
| 9 | Listados explorar / detalle / POS omiten inactivos | `WF-catalogo-canales.md` | US-CAT-01 |
| 10 | Carrito: retirar línea + toast `"{nombre} ya no está disponible"` | `WF-catalogo-canales.md` | UF-CAT-01 |
| 11 | Empty POS si cero activos + **Ir a Catálogo** | `WF-catalogo-canales.md` | US-CAT-01 |
| 12 | Errores `POST /api/orders` y POS si `productId` inactivo | `WF-catalogo-canales.md` | US-CAT-01 |

### Sprint F5-C — BRAND (colores + tema sesión)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 13 | `BrandColorPicker` + preview CTA en `/proveedor` (junto a media F2) | `WF-proveedor-marca.md` | UF-BRAND-01 |
| 14 | ContrastHint Should; rechazo Must si blanco/primario < 4.5:1 | `WF-proveedor-marca.md` | US-BRAND-01 |
| 15 | Reset "Restaurar marca de plataforma" | `WF-proveedor-marca.md` | US-BRAND-01 |
| 16 | Hidratar `--brand` / `--brand-secondary` solo sesión PROVIDER (incl. `/explorar`) | `WF-proveedor-marca.md` | US-BRAND-02 |
| 17 | CLIENT/ADMIN/invitado = plataforma; logout limpia; badges F3 intactos | tokens § Brand sesión | US-BRAND-02 |

---

## Entregables UX Fase 5 (índice)

| Tipo | Archivo |
|------|---------|
| Tokens | `comun/design-tokens.md` v0.5.0 |
| IA | `comun/information-architecture.md` v0.4.0 |
| Flow | `fase-5/user-flows/UF-GEO-01-mapa-leaflet-radio.md` |
| Flow | `fase-5/user-flows/UF-CAT-01-inhabilitar-producto.md` |
| Flow | `fase-5/user-flows/UF-BRAND-01-colores-negocio.md` |
| WF | `fase-5/wireframes/WF-explorar-leaflet.md` |
| WF | `fase-5/wireframes/WF-proveedor-marca.md` |
| WF | `fase-5/wireframes/WF-catalogo-canales.md` |

---

## Design system — componentes nuevos F5

| Componente | Spec en tokens |
|------------|----------------|
| ExploreMap | Leaflet + OSM; attribution; error teselas ≠ API key |
| ExploreLocationCta | Banner; Button Secondary; ≥44px |
| CompactAddressBar | Geocode + favoritas; sin radio |
| RadiusSlider overlay | Pie del mapa; label `text-slate-600` |
| BrandColorPicker | color + hex; preview CTA blanco |
| ContrastHint | Should AA live |
| ProductActiveSwitch | Activo / Inactivo |
| PosEmptyActiveCatalog | Empty + Ir a Catálogo |
| CartUnavailableToast | Retira línea |

```text
CTA ubicación:    min-h-11 (banner FilterBar)
Slider overlay:   absolute bottom-0 inset-x-0 bg-white/95
Toggle catálogo:  Activo / Inactivo — no "agotado"
Brand sesión:     --brand / --brand-secondary solo PROVIDER
```

---

## Estados obligatorios (4 por superficie nueva)

| Superficie | Loading | Empty | Success | Error |
|------------|---------|-------|---------|-------|
| `/explorar` GEO F5 | skeleton + mapa pulse | radio sin resultados | lista + Leaflet | red API / **teselas down** (lista ok) |
| Config colores | skeleton pickers | null = plataforma | toast + chrome hidratado | hex inválido / contraste / red |
| Toggle catálogo | spinner fila | — (fila sigue visible) | check 2s | inline PATCH |
| POS catálogo | skeleton grid | **No hay productos activos** | grid activos | red / cobro id inactivo |
| Carrito línea inactiva | — | carrito F3 si era único ítem | toast + línea retirada | POST orders rechazado |

**Explorar Must:** loading, success, empty radio, mapa caído **por red**. El estado F4 "Mapa no disponible por falta de API key" **no existe**.

---

## APIs a consumir (no inventar rutas)

| Método | Ruta | Uso UI |
|--------|------|--------|
| GET | `/api/providers?lat=&lng=&radiusKm=` | Explorar geo (Haversine F4, **sin cambio**) |
| GET/POST | `/api/users/me/addresses` | Favoritas F4 |
| PATCH | `/api/provider/products/[id]` | `{ isActive }` (flag F1) |
| POST | `/api/orders` | Rechaza `productId` inactivo |
| POST | `/api/pos/sales` | Rechaza `productId` inactivo |
| PATCH | `/api/provider/profile` | `{ primaryColor?, secondaryColor? }` (+ campos F4 Google/prep) |
| GET | sesión PROVIDER (`/api/auth/me` o contrato tema) | Hidratar CSS — **Arquitecto cierra la ruta** |

Contratos: handoff Arquitecto Fase 5 (`API-GEO-01` delta motor, `API-PROVIDER-PRODUCTS-01`, `API-PROVIDER-SETTINGS-01`, `API-SESSION-THEME-01`).

Preservar: pickup F3, radio F4, embed Google `US-REV-03`, ContactCTA, POS cobro (sin campos de marca en el payload de venta).

---

## Accesibilidad (Fase 5)

- [ ] Lista `/explorar` es alternativa completa al mapa
- [ ] Slider radio overlay operable por teclado; labels `text-slate-500+`
- [ ] CTA **Usar mi ubicación** ≥44px
- [ ] Attribution OSM visible
- [ ] Primario no se guarda si CTA (texto blanco) < 4.5:1
- [ ] Switch Activo/Inactivo con nombre accesible
- [ ] Toast carrito `role="status"`
- [ ] CLIENT no recibe tema de cada frutería en cards
- [ ] Badges de pedido F3 nunca color-only / nunca solo `--brand` proveedor
- [ ] `prefers-reduced-motion` en slider y switch

---

## Checklist DoD UX Fase 5

- [ ] WCAG AA mapa + lista + contraste CTA marca
- [ ] 4 estados Explorar (loading / success / empty radio / teselas red)
- [ ] F3 pickup y F4 radio API + embed Google reseñas intactos
- [ ] Toggle no es stock
- [ ] Tema scoped a PROVIDER
- [ ] Sin pasarela, CFDI, PWA, flotilla, Google Maps JS en Explorar, bbox Must

---

## Fuera de alcance Fase 5

Pasarela de pagos, CFDI, PWA instalable, flotilla, Google Maps JS en Explorar, Places API, Distance Matrix, bounding-box API Must, tema de proveedor pintando marketplace CLIENT/ADMIN, stock/agotado, paleta derivada del logo (Could).

---

*Handoff generado por Agente UX/UI Designer — LaBorregaMarket v0.5.0*
