# Handoff Frontend — LaBorregaMarket UX/UI v0.4.0

> **De:** Agente UX/UI Designer  
> **Para:** @Frontend  
> **Fecha:** 14/08/2026  
> **Prioridad:** F4-A GEO → F4-B REV → F4-C ETA → F4-D ADMIN → F4-E POS báscula → F4-F delivery (Should)

---

## Estado: LISTO PARA IMPLEMENTACIÓN (diseño) ✅

Diseño Fase 4 completo. **No hay código F4 todavía.** Código base: `LaBorregaMarket/src/`. F3 permanece vigente (checkout pickup, POS, dashboard proveedor).

**Lee primero:**

- [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.4.0
- [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.3.0
- Contratos Arquitecto F4 (cuando existan) — no inventar rutas fuera de la tabla de APIs

---

## Orden de implementación sugerido

### Sprint F4-A — GEO (mapa Google + radio + favoritas)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 1 | Reemplazar Leaflet por Google Maps JS (lazy) en `/explorar` | `WF-explorar-geo.md` | UF-GEO-01 |
| 2 | `LocationBar` + `LocationPicker` (geo / pin / geocode) | `WF-explorar-geo.md` | UF-GEO-01 |
| 3 | `RadiusSlider` 1–25 km; query `lat` `lng` `radiusKm` | `WF-explorar-geo.md` | US-GEO-02 |
| 4 | Empty radio + fallback sin geolocalización + Maps down | `WF-explorar-geo.md` | UF-GEO-01 |
| 5 | `FavoriteAddressSelect` + guardar (auth gate) | `WF-explorar-geo.md` | US-GEO-03 |
| 6 | Lista siempre visible (a11y); sync hover markers | `WF-explorar-geo.md` | CO lista |

### Sprint F4-B — REVIEWS

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 7 | Rating real / "Sin reseñas todavía" en cards y detalle | `WF-fruteria-reviews.md` | UF-REV-01 |
| 8 | Lista `ReviewCard` en `/fruteria/[id]` | `WF-fruteria-reviews.md` | US-REV-02 |
| 9 | CTA Calificar en `/cuenta` + `ReviewForm` | `WF-cuenta-pedidos-f4.md`, `WF-resena-pedido.md` | US-REV-01 |
| 10 | Config Google Estado A/B en `/proveedor` | `WF-proveedor-google.md` | UF-REV-02 |
| 11 | Enlace/embed Google solo si `googleReviewsEnabled` | `WF-fruteria-reviews.md` | US-REV-03 |

### Sprint F4-C — ETA

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 12 | `PrepTimeInput` en config proveedor | `WF-proveedor-google.md` | UF-NOTIFY-01 |
| 13 | `EtaChip` en `/carrito` (copy canónico) | `WF-carrito-eta.md` | US-NOTIFY-09 |
| 14 | Mismo copy en detalle pedido; payload email/WA (string) | `WF-cuenta-pedidos-f4.md` | US-NOTIFY-09 |

### Sprint F4-D — ADMIN analytics

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 15 | Tab Analítica + `/admin/analytics` | `WF-admin-analytics.md` | UF-ADMIN-01 |
| 16 | `KpiCardAdmin` + `PeriodToggle` + empty periodo | `WF-admin-analytics.md` | US-ADMIN-01 |
| 17 | `OriginSplitBar` Marketplace vs POS | `WF-admin-analytics.md` | US-ADMIN-01 |

### Sprint F4-E — POS báscula

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 18 | `ScaleStatusBadge` + Conectar (WebSerial/WebHID) | `WF-pos-bascula.md` | UF-POS-02 |
| 19 | Autodetección VID/PID + `ScaleModelSelect` | `WF-pos-bascula.md` | US-POS-06 |
| 20 | Autollenado quantity KG/GR; fallback manual F3 | `WF-pos-bascula.md` | US-POS-05 |

### Sprint F4-F — Delivery (Should, después de GEO)

| Orden | Componente / ruta | Wireframe | User Flow |
|-------|-------------------|-----------|-----------|
| 21 | `FulfillmentToggle` si `offersDelivery` | `WF-carrito-eta.md` | UF-ORDERS-02 |
| 22 | Badge **En camino** solo `DELIVERY` + `IN_TRANSIT` | `WF-cuenta-pedidos-f4.md` | D-F4-5 |

---

## Entregables UX Fase 4 (índice)

| Tipo | Archivo |
|------|---------|
| Tokens | `comun/design-tokens.md` v0.4.0 |
| IA | `comun/information-architecture.md` v0.3.0 |
| Flow | `fase-4/user-flows/UF-GEO-01-mapa-radio-favoritas.md` |
| Flow | `fase-4/user-flows/UF-REV-01-resena-post-entrega.md` |
| Flow | `fase-4/user-flows/UF-REV-02-google-proveedor.md` |
| Flow | `fase-4/user-flows/UF-NOTIFY-01-eta.md` |
| Flow | `fase-4/user-flows/UF-ADMIN-01-analytics.md` |
| Flow | `fase-4/user-flows/UF-POS-02-bascula.md` |
| Flow | `fase-4/user-flows/UF-ORDERS-02-checkout-delivery.md` |
| WF | `fase-4/wireframes/WF-explorar-geo.md` |
| WF | `fase-4/wireframes/WF-proveedor-google.md` |
| WF | `fase-4/wireframes/WF-resena-pedido.md` |
| WF | `fase-4/wireframes/WF-carrito-eta.md` |
| WF | `fase-4/wireframes/WF-admin-analytics.md` |
| WF | `fase-4/wireframes/WF-pos-bascula.md` |
| WF | `fase-4/wireframes/WF-fruteria-reviews.md` |
| WF | `fase-4/wireframes/WF-cuenta-pedidos-f4.md` |

---

## Design system — componentes nuevos F4

| Componente | Spec en tokens |
|------------|----------------|
| RadiusSlider | 1–25 km, default 10, `aria-valuenow` |
| LocationPicker | geo + pin + geocode |
| FavoriteAddressSelect | dropdown + auth gate |
| RatingStars | input/display; cero = "Sin reseñas todavía" |
| ReviewCard | autor, fecha, comentario |
| VerificationRequiredBanner | `info`, no error |
| EtaChip | copy canónico ~X min |
| ScaleStatusBadge | conectada / desconectada / conectando |
| FulfillmentToggle | pickup / delivery |
| KpiCardAdmin | distinto de KpiCard F3 |
| OriginSplitBar | Marketplace vs POS + sr-only |

```text
Verify banner:    bg-blue-50 text-blue-900 border border-blue-100 rounded-lg px-4 py-3
EtaChip:          inline-flex items-center gap-1.5 text-sm
Slider:           accent-[var(--brand)] w-full
Admin page:       bg-slate-50
IN_TRANSIT pickup:   Listo para recoger
IN_TRANSIT delivery: En camino
```

---

## Estados obligatorios (4 por superficie nueva)

| Superficie | Loading | Empty | Success | Error |
|------------|---------|-------|---------|-------|
| `/explorar` GEO | skeleton + mapa pulse | radio sin resultados / sin geo | lista+Maps | red / Maps down (lista ok) |
| Config Google | skeleton bloque | Place ID vacío | toast guardado | formato / 403 info |
| Reseña pedido | skeleton form | rating 0 bloquea submit | toast + read-only | 409 / red |
| `/carrito` ETA | skeleton chip | sin prep time (hint) | EtaChip | cálculo fallido (checkout ok) |
| `/admin/analytics` | skeleton KPIs | "No hay actividad en este periodo" | KPIs+split | ErrorBanner |
| POS báscula | "Conectando…" | desconectada / sin WebSerial | lecturas | desconexión / parser |

---

## APIs a consumir (no inventar rutas)

| Método | Ruta | Uso UI |
|--------|------|--------|
| GET | `/api/providers?lat=&lng=&radiusKm=` | Explorar geo |
| GET/POST | `/api/users/me/addresses` | Favoritas |
| POST | `/api/orders/[id]/reviews` | Publicar reseña |
| GET | `/api/providers/[id]/reviews` | Lista pública |
| PATCH | `/api/provider/profile` | Google + `preparationTimeMinutes` |
| GET | `/api/orders/eta` | Minutos checkout |
| GET | `/api/admin/analytics?period=` | Dashboard plataforma |
| POST | `/api/orders` | + `fulfillmentType`, `deliveryAddressId?` (Should) |

Contratos: handoff Arquitecto Fase 4. Báscula: **sin API** (WebSerial + `drivers/registry.ts`).

Preservar F3: `POST /api/orders` pickup, `POST /api/pos/sales`, `PATCH` status, ContactCTA.

---

## Accesibilidad (Fase 4)

- [ ] Lista `/explorar` es alternativa completa al mapa
- [ ] Slider radio operable por teclado
- [ ] Rating 0 anunciado como "Sin reseñas todavía"
- [ ] Banner verificación `info` + `aria-describedby` en controles disabled
- [ ] `IN_TRANSIT` SR: pickup vs delivery
- [ ] Split admin: leyenda texto + tabla sr-only
- [ ] Báscula: badge texto+icono; keypad F3 fallback
- [ ] Touch ≥44px (slider, estrellas, Conectar)
- [ ] `prefers-reduced-motion` en slider/ETA

---

## Checklist DoD UX Fase 4

- [ ] WCAG AA mapa + lista
- [ ] 4 estados en las 6 pantallas Must
- [ ] F3 intacto (pickup, POS cobro, dashboard proveedor, Encargar, contacto F2)
- [ ] "Requiere verificación" informativo, no punitivo
- [ ] ETA copy "Listo aprox. en ~X min"
- [ ] "En camino" solo `fulfillmentType=DELIVERY`
- [ ] Sin pasarela, CFDI, PWA, Places API, rutas/flotilla

---

## Fuera de alcance Fase 4

Pasarela de pagos, CFDI, PWA instalable, importación Places API, logística de reparto, plantillas visuales email/WA, fotos en reseña, edición de reseña (Should).

---

*Handoff generado por Agente UX/UI Designer — LaBorregaMarket v0.4.0*
