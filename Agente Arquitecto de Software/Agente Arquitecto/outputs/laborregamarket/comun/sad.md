# System Architecture Document (SAD) — LaBorregaMarket v0.14.0

> **Producto:** LaBorregaMarket  
> **Versión:** 0.14.0 (F14: Perfil datos de negocio, merma/ajuste aditivos, series/PDF rango)  
> **Fecha:** 17/09/2026  
> **Agente:** Arquitecto de Software

---

## 1. Resumen ejecutivo

LaBorregaMarket es un marketplace local que conecta clientes con fruterías y productores agrícolas en Monterrey. Arquitectura: **monolito modular** Next.js 15, API Routes, PostgreSQL, Prisma 6.

El núcleo de dominio es el **catálogo dual** (`Product.scope` GLOBAL \| LOCAL + `ProviderProduct`). Fases 1–3 (auth, explorar, media, pedidos pickup, POS, dashboard proveedor) están implementadas. Fase 4 (reseñas, geo Haversine, notify-scale, analytics, báscula) tiene Quality Gate BE aprobado.

**Fase 5 (QG BE 15/08/2026):** motor de `/explorar` = Leaflet + teselas OSM; `isAvailable` endurecido; colores en sesión PROVIDER.

**Fase 6 (diseño, 16/08/2026, v0.6.1):** tres slices (deuda Redis, reportes PDF, GEO zoom↔radio). **Congelada.** Pagos y CFDI siguen fuera (`CO-F6-001`).

**Fase 7 (diseño, 18/08/2026, v0.7.1):** Explorar mapa-primero; `CO-F7-001` anula D-F6-9 (pan/zoom no derivan `radiusKm`); `meta.total` real; favoritas con `lastUsedAt`; preview de vitrina (horario, flags, 3 reseñas); cookie JWT first-party (`US-AUTH-09`). Empty de radio (`US-GEO-16`) reusa loader borrega **sin API nueva**. **Solo lectura.**

**Fase 8 (diseño, 24/08/2026, v0.8.3):** Chrome de ubicación reusa CRUD F7 (**sin API nueva**). Clamp `radiusKm` **0.5–10** decimal (`CO-F8-001`; revoca 1–25). Viewport y validación de coords = bbox México (ADR-028; `CO-F8-002`); lista sigue Haversine (**no** bbox Must). Preview hover/long-press **sin** botón «Vista rápida» (`CO-F8-003`); mismo `GET /api/providers/:id`. **Solo lectura.**

**Fase 9 (diseño, 25/08/2026, v0.9.0):** Deuda UX Explorar (`CO-F9-001`). Preview in-card, distancia+ETA en card y chrome mapa = **sin API Must**. Typeahead = mismo `GET /api/providers?q&lat&lng&radiusKm` (**sin** endpoint suggest). Listing: query `offersWholesale` / `offersDelivery` AND (sin schema orgánico). **Solo lectura.**

**Fase 10 (diseño, 28/08/2026, v0.10.2):** Admin endurecido (`hasModulePermission` en `/api/admin/*`), CRUD global, SKU local del PROVIDER (`CO-F10-001`, A5 revocada para el negocio), `ProviderSection`, imágenes en **disco** (`CO-F10-002`, ADR-006 aparcado), delta Reportes `from`/`to` + `productIds[]` (`CO-F10-003`). Print = FE. Pagos siguen fuera. **Solo lectura.**

**Fase 11 (diseño, 12/09/2026, v0.11.0):** `User` 1:N `Provider` (se quita unique de `userId`). Contexto activo en cookie `lbm_active_provider` (ADR-034), no claim JWT ni header. `/api/provider/*` aísla por activo (IDOR 403). Módulo `GET /api/provider/reports/global` solo si N>1 (ADR-035, 403 si N=1). Seed El Paraíso ×2. Sin Cloudinary. Sin pasarela. **Solo lectura.**

**Fase 12 (diseño, 14/09/2026, v0.12.0):** Inventario blando en `ProviderProduct` (`onHand` Decimal(12,3), tope, umbral 10%, alerta, factor caja). `stock` Int? deprecado. POS descuenta al cobrar sin 4xx de stock. Encargar: reserved computed; DELIVERED commit; CANCELLED restore. Toggle `posShowImages` en `Provider`. APIs públicas sin existencias. ADR-022 intacto. Sin kardex. Sin `/api/v1/` (ADR-002). **Solo lectura.**

**Fase 13 (diseño, 16/09/2026, v0.13.0):** Admin lista GLOBAL+LOCAL; DELETE HTTP 405. Archivo de oferta `ProviderProduct.archivedAt` (ADR-038). Unidad de venta sucursal `saleUnit` (fallback `Product.unit`; no mutar maestro GLOBAL). Precio por oferta + tabla historial. `InventoryEntry` en cargas (sin backfill F12, sin kardex de ventas). Vendible = `isAvailable` + `product.isActive` + no archivado. Ocultar con Encargar activo permitido; cambio unidad/factor con Encargar = 409. **Solo lectura.**

**Fase 14 (diseño, 17/09/2026, v0.14.0):** PATCH `/api/provider/me` acepta datos de negocio + geo AMM; `isVerified` **no** se resetea (ADR-039). Merma y ajuste en `InventoryEntry.kind` (ADR-040); 400 si el saldo resultante sería negativo; POS sigue blando. GET movimientos ENTRADA+MERMA+AJUSTE. Precio vendible mayor que 0 (sin default 50). PDF sucursal `from`/`to`. Gráficas = SVG unificado (ADR-041), sin npm. N=1 global 403 intacto. Sin Cloudinary. Sin pasarela.

Delivery a domicilio y WhatsApp Business siguen **Should** F4 a nivel pedidos; el **flag** `whatsappEnabled` de vitrina es Must F7 (no Cloud API). El **filtro** listing `offersDelivery` / `offersWholesale` es Must F9.

---

## 2. Objetivos arquitectónicos

| Objetivo | Estrategia |
|----------|------------|
| Time-to-market | Monolito full-stack, un deploy Vercel, una DB |
| Seguridad por roles | JWT httpOnly + RBAC; gate Google server-side (ADR-018) |
| Comparabilidad de precios | Catálogo **global** unificado; locales no comparables (ADR-029) |
| Confianza | `Review` real; `rating`/`reviewCount` agregados atómicos |
| Notificaciones fiables | Inngest + Upstash (ADR-015); **lockfile `@upstash/redis` obligatorio** |
| Costo mapas | Leaflet/OSM en Explorar; cero clave de facturación Google JS (ADR-020) |
| Oferta real | Producto inhabilitado no se lista ni se vende (ADR-022) |
| Extensibilidad | Envelope ADR-003; sin `/api/v1/` (ADR-002) |
| Trazabilidad | `AuditLog` + `notificationFailed` |

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión / fase |
|------|-----------|----------------|
| Frontend | Next.js App Router, React, Tailwind CSS | 15 / 19 / 5 |
| Mapas | Leaflet + teselas OSM (o CDN Open Source) | F5 — ADR-020 (reemplaza ADR-016) |
| Báscula POS | WebSerial / WebHID | F4 — ADR-019 (solo cliente) |
| Backend | Next.js API Routes | 15 |
| ORM | Prisma | 6 |
| Base de datos | PostgreSQL | 15+ |
| Autenticación | JWT (jsonwebtoken) + bcrypt | — |
| Validación | Zod | — |
| Email | Resend | F2 — ADR-005 |
| Imágenes | Disco local (`UPLOADS_DIR`) | F10 — ADR-032 (ADR-006 aparcado) |
| Rate limit | Upstash Redis REST | F4 — ADR-015 |
| Jobs | Inngest | F4 — ADR-015 |
| WhatsApp | Cloud API (Should) | F4 |

**Runtime:** Node.js 20+

---

## 4. Patrón arquitectónico

### Monolito modular en capas

```
┌──────────────────────────────────────────────────────────────┐
│ PRESENTACIÓN                                                 │
│ App Router · Leaflet/OSM · WebSerial POS · tokens CSS sesión │
├──────────────────────────────────────────────────────────────┤
│ API (Controllers)                                            │
│ /api/auth /api/providers /api/provider /api/users            │
│ /api/orders /api/admin /api/inngest                          │
├──────────────────────────────────────────────────────────────┤
│ DOMINIO / SERVICIOS                                          │
│ lib/auth · lib/audit · lib/services · lib/geo · lib/inngest  │
├──────────────────────────────────────────────────────────────┤
│ DATOS                                                        │
│ lib/prisma · prisma/schema.prisma                            │
├──────────────────────────────────────────────────────────────┤
│ PostgreSQL 15+ · Upstash Redis · Inngest · volumen uploads   │
│ + Resend + teselas OSM (cliente)                             │
└──────────────────────────────────────────────────────────────┘
```

### Principios

1. **API-first:** contratos en `fase-N/api/` antes de código.
2. **Thin controllers:** Zod + `lib/services/`.
3. **RBAC dual:** `requireRole()` + `hasModulePermission()` ADMIN.
4. **Sin microservicios:** un deploy; trabajo largo en Inngest, no en `after()`.

Topología F1: [`../fase-1/diagrams/ARCH-SYSTEM-01.md`](../fase-1/diagrams/ARCH-SYSTEM-01.md)  
Notify F4: [`../fase-4/diagrams/ARCH-NOTIFY-02.md`](../fase-4/diagrams/ARCH-NOTIFY-02.md)

---

## 5. Módulos del sistema

| Módulo | Código | Capa API | Entidades | Perfiles |
|--------|--------|----------|-----------|----------|
| Autenticación | `AUTH` | `/api/auth/*` | `User` | Todos |
| Proveedores | `PROVIDERS` | `/api/providers/*`, `/api/provider/*` | `Provider` | CLIENT, PROVIDER, ADMIN |
| Productos | `PRODUCTS` | `/api/provider/products`, `/api/provider/local-products`, `/api/provider/sections`, `/api/admin/products` | `Product`, `ProviderProduct`, `ProviderSection` | CLIENT, PROVIDER, ADMIN |
| Usuarios | `USERS` | `/api/users/me`, `/api/users/me/addresses` | `User`, `UserAddress` | CLIENT |
| Admin | `ADMIN` | `/api/admin/*`, `/api/catalogs` | Todos | ADMIN |
| Admin analytics | `ADMIN` | `/api/admin/analytics` | Agregados Order | ADMIN |
| Notificaciones | `NOTIFY` | `POST .../contact` + Inngest | `AuditLog` | Público + jobs |
| Media | `MEDIA` | `/api/provider/media`, admin image, `/api/media/[filename]`, imagen de instancia | Disco `UPLOADS_DIR` | PROVIDER, ADMIN, público GET |
| Pedidos | `ORDERS` | `/api/orders`, POS sales | `Order`, `OrderItem` | CLIENT, PROVIDER |
| Reportes PROVIDER | `DASH` | `/api/provider/reports` (activo; F6/F10) y `/api/provider/reports/global` (N>1) | Agregados `Order` / `OrderItem` | PROVIDER |
| Reseñas | `REVIEWS` | `/api/orders/[id]/reviews`, listado público | `Review` | CLIENT, público, ADMIN |
| Geo | `GEO` | query `GET /api/providers`, ETA; mapa FE Leaflet | Haversine | Público |
| Marca | `PROVIDERS` | PATCH colores + `GET /api/auth/session` | `Provider` hex | PROVIDER, ADMIN |
| Auditoría | `AUDIT` | Escritura transversal | `AuditLog` | ADMIN lectura |
| Permisos | `PERMISSIONS` | Guards + DB | `Module`, `RolePermission` | ADMIN |
| POS báscula | `POS` (FE) | Sin API nueva | — | PROVIDER |
| Inventario | `PRODUCTS` | `/api/provider/inventory`, `.../shrinkage`, `.../adjustments`, `.../movements` | `ProviderProduct.onHand` + `InventoryEntry.kind` | PROVIDER |

---

## 6. Flujos principales

### 6.1–6.6 (F1–F2)

Auth JWT, catálogo global, onboarding 2 pasos, explorar, contacto, media: sin cambio de forma. Explorar usa radio Haversine (6.8) y motor Leaflet (6.12). Contacto **cambia** transporte (6.9).

### 6.7 Pedidos y POS (Fase 3)

`POST /api/orders` pickup marketplace; POS `POST /api/provider/pos/sales`; dashboard rolling `/api/provider/dashboard` (F3). Reporte calendario F6: 6.13. F12: el cobro POS y DELIVERED Encargar mutan `onHand` (6.20).

### 6.8 Explorar geo (Fase 4 query + Fase 5 motor)

`GET /api/providers?lat&lng&radiusKm` (Haversine; default 10). Clamp vivo F8: **0.5–10 km** (6.16); F4 introducía 1–25 y bbox AMM (históricos). Direcciones: CRUD `/api/users/me/addresses`. ETA preview `GET /api/providers/[id]/eta`. Motor de mapa en F5: Leaflet/OSM (6.12). Sync zoom↔radio F6: 6.14 (revocado). Viewport México: 6.16.

Ver query: [`../fase-4/api/API-GEO-01.md`](../fase-4/api/API-GEO-01.md)

### 6.9 Notificaciones (Fase 4)

Rate limit Redis; `inngest.send`; worker Resend ≤3 retries; AUDIT `notificationFailed`. Should: WhatsApp en `PENDING` / `IN_TRANSIT`.

Ver: [`../fase-4/diagrams/ARCH-NOTIFY-02.md`](../fase-4/diagrams/ARCH-NOTIFY-02.md), [ADR-015](./adrs/ADR-015-notification-queue.md)

### 6.10 Reseñas (Fase 4)

Una `Review` por pedido `DELIVERED` marketplace. Agregado atómico. Embed Google solo verificado; PATCH Google 403 si no `isVerified`.

Ver: [`../fase-4/diagrams/ARCH-REVIEWS-01.md`](../fase-4/diagrams/ARCH-REVIEWS-01.md)

### 6.11 Báscula POS (Fase 4)

Registry VID/PID en el browser; autollena `quantity`. Sin cambio API POS.

Ver: [`../fase-4/diagrams/ARCH-SCALE-01.md`](../fase-4/diagrams/ARCH-SCALE-01.md)

### 6.12 Mapa Leaflet y marca (Fase 5)

`/explorar` carga Leaflet + teselas OSM **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Attribution OSM visible. Lista siempre alternativa a11y. Layout: ubicación en banner, radio al pie del mapa (FE).

`Provider.primaryColor` / `secondaryColor` validados (hex + contraste WCAG) en PATCH. `GET /api/auth/session` hidrata tokens CSS solo si `role=PROVIDER`. CLIENT/ADMIN/invitado ven marca de plataforma.

Producto inhabilitado (`isAvailable=false`) se omite en detalle/listado público; `POST /api/orders` y POS responden **409**.

Ver: [`../fase-5/diagrams/ARCH-GEO-02.md`](../fase-5/diagrams/ARCH-GEO-02.md), [`../fase-5/diagrams/ARCH-BRAND-01.md`](../fase-5/diagrams/ARCH-BRAND-01.md)

### 6.13 Reportes calendario (Fase 6)

`GET /api/provider/reports?grain=day|month|year&date=` agrega el **propio** negocio (TZ America/Monterrey, `status ≠ CANCELLED`). No copia `/api/admin/analytics` ni altera el dashboard rolling F3. PDF: `GET /api/provider/reports.pdf` (misma agregación, ADR-023). Print CSS = Frontend.

Ver: [`../fase-6/api/API-PROVIDER-REPORTS-01.md`](../fase-6/api/API-PROVIDER-REPORTS-01.md), [`../fase-6/diagrams/ARCH-REPORTS-01.md`](../fase-6/diagrams/ARCH-REPORTS-01.md)

### 6.14 Zoom ↔ radio (Fase 6, **revocado**)

Histórico `US-GEO-07`. **F7 (`CO-F7-001`) anula** la derivación viewport→radio. Ver 6.15.

Ver (solo lectura): [`../fase-6/api/API-GEO-01.md`](../fase-6/api/API-GEO-01.md)

### 6.15 Explorar F7 (pan ≠ radio, favoritas, preview)

El cliente envía `radiusKm` del slider. Pan/zoom no refetch. Centro default San Nicolás `25.7475, -100.2830` o `UserAddress.lastUsedAt`. `meta.total` = COUNT del predicado. Preview: horario JSON, flags vitrina, `reviewsPreview[3]`. Empty `total=0` sin ruta nueva. **Clamp F7 1–25 e invariante de viewport mundial quedan históricos** (ver 6.16).

Ver (solo lectura): [`../fase-7/api/API-GEO-01.md`](../fase-7/api/API-GEO-01.md), [`../fase-7/diagrams/ARCH-GEO-04.md`](../fase-7/diagrams/ARCH-GEO-04.md)

### 6.16 Explorar F8 (radio 0.5–10 km, mapa México, preview hover)

Clamp servidor y cliente **0.5–10** km decimal (`CO-F8-001`); **prohibido** `Math.round`. Default 10. `CO-F7-001` intacto (pan ≠ radio). Viewport Leaflet = `MEXICO_BOUNDS` + `minZoom` 5 (ADR-028). `GET /api/providers` filtra Haversine; coords fuera de México → 400 Should (no remap SN). Favoritas: mismo CRUD; `lat`/`lng` alineados a `isInMexico`; tras DELETE el pin **permanece** (FE). Preview: mismo GET detalle; debounce/cache hover (`CO-F8-003`). Cero migración Prisma. Cero env nuevas. **Solo lectura.**

Ver (solo lectura): [`../fase-8/api/API-GEO-01.md`](../fase-8/api/API-GEO-01.md), [`../fase-8/diagrams/ARCH-GEO-05.md`](../fase-8/diagrams/ARCH-GEO-05.md)

### 6.17 Explorar F9 (deuda: typeahead, chips, in-card)

`CO-F9-001`. Typeahead header: **sin** `/suggest`; FE debounce sobre `GET /api/providers?q&geo&limit=10` (corpus = predicado Haversine, no página en memoria). Chips Mayoreo/Domicilio: query booleanos `offersWholesale` / `offersDelivery` AND con filtros F8; Orgánico y «Filtros» retirados (sin schema). Preview: mismo GET detalle, animación **in-card** (FE). Card: `distanceKm` + ETA cliente (ADR-017); sin API Must. Chrome/mapa: solo FE. Cero migración Prisma. Cero env nuevas.

Ver: [`../fase-9/api/API-GEO-01.md`](../fase-9/api/API-GEO-01.md), [`../fase-9/diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md`](../fase-9/diagrams/ARCH-EXPLORE-TYPEAHEAD-01.md)

### 6.18 Admin, catálogo local, disco y reportes (Fase 10)

`CO-F10-001`…`003`. Dual `requireRole(ADMIN)` + `hasModulePermission` en `/api/admin/*`. SKU local = `Product.scope=LOCAL` + `ProviderProduct` del dueño (ADR-029). Secciones planas (ADR-030). Uploads a `UPLOADS_DIR` (ADR-032). `GET /api/provider/reports` acepta `from`/`to` XOR `grain`/`date` (ADR-033). Print = FE. Volumen persistente Must. Explorar F9 intacto.

Ver: [`../fase-10/README.md`](../fase-10/README.md)

### 6.19 Multi-sucursal (Fase 11)

Un `User` PROVIDER posee N `Provider`. Cookie `lbm_active_provider` + `resolveActiveProvider`. Switch: `POST /api/provider/active`. Lista: `GET /api/provider/mine` y delta `GET /api/auth/session`. Consolidado: path nuevo; 403 si N=1. Explorar no colapsa por dueño.

Ver: [`../fase-11/README.md`](../fase-11/README.md), [ADR-034](./adrs/ADR-034-user-providers-1n-active.md), [ADR-035](./adrs/ADR-035-global-provider-reports.md)

### 6.20 Inventario blando (Fase 12)

`GET/PATCH/POST /api/provider/inventory*`. `onHand` Decimal; reserved = SUM Encargar activo. POS nunca 4xx de stock. Público sin existencias. Factor caja fijo en oferta. `posShowImages` en `Provider`.

Ver: [`../fase-12/README.md`](../fase-12/README.md), [ADR-036](./adrs/ADR-036-inventario-blando.md), [ADR-037](./adrs/ADR-037-encargar-reserva.md)

### 6.21 Archivo de oferta y unidad por sucursal (Fase 13)

`archivedAt` y `saleUnit` en `provider_products`. Unique intacta. Admin GET todos los `Product`. Reportes inventario: sucursal = saldos + entradas; N>1 = solo saldos. Paths `/api/provider/products/by-product/[productId]/*`, `/api/provider/reports/inventory`, `/api/provider/reports/global/inventory`.

Ver: [`../fase-13/README.md`](../fase-13/README.md), [ADR-038](./adrs/ADR-038-archivo-oferta-unidad.md)

### 6.22 Perfil, merma aditiva y reportes pintados (Fase 14)

`PATCH /api/provider/me` escribe nombre/dirección/coords (AMM) sin tocar `isVerified`. Google lock ADR-018 intacto. `POST .../shrinkage` y `.../adjustments` mutan `onHand` con fila `InventoryEntry`; venta POS no genera fila y **sí** puede dejar negativo. `GET .../movements` pagina los tres `kind`. Reportes globales: mismo JSON F11; FE pinta series (ADR-041). PDF: `from`/`to` además de grain.

Ver: [`../fase-14/README.md`](../fase-14/README.md), [ADR-039](./adrs/ADR-039-isverified-coords.md), [ADR-040](./adrs/ADR-040-merma-aditiva.md), [ADR-041](./adrs/ADR-041-graficas-svg.md)

---

## 7. Modelo de datos

Fuente de verdad: `LaBorregaMarket/prisma/schema.prisma` (F14 extiende `InventoryEntry.kind`; F13 añade `archivedAt`/`saleUnit`, entradas, historial de precio; F12 Decimal inventario; F11: `Provider.userId` ya no unique). Baseline código F14 = `main` @ `0eda84c`.

| Entidad | Documento |
|---------|-----------|
| `User` | [`../fase-1/data-model/DB-users.md`](../fase-1/data-model/DB-users.md) + `whatsappOptIn` Should en delta orders |
| `Provider` | Delta F14 [`../fase-14/data-model/DB-providers.md`](../fase-14/data-model/DB-providers.md) (escritura datos negocio; sin columnas nuevas); F12 `posShowImages` |
| `Product`, `ProviderProduct` | F1 + F10 + F12 + delta F13 [`../fase-13/data-model/DB-provider-products.md`](../fase-13/data-model/DB-provider-products.md) |
| `InventoryEntry` | Delta F14 [`../fase-14/data-model/DB-inventory-entries.md`](../fase-14/data-model/DB-inventory-entries.md) (`kind` MERMA/AJUSTE) |
| `ProviderProductPriceHistory` | [`../fase-13/data-model/DB-provider-product-price-history.md`](../fase-13/data-model/DB-provider-product-price-history.md) |
| `ProviderSection` | [`../fase-10/data-model/DB-provider-sections.md`](../fase-10/data-model/DB-provider-sections.md) |
| `Order`, `OrderItem` | F4 + índice F12 [`../fase-12/data-model/DB-order-items.md`](../fase-12/data-model/DB-order-items.md) |
| `Review` | [`../fase-4/data-model/DB-reviews.md`](../fase-4/data-model/DB-reviews.md) |
| `UserAddress` | F4 + delta [`../fase-7/data-model/DB-addresses.md`](../fase-7/data-model/DB-addresses.md) (`lastUsedAt`) |
| `AuditLog`, `Module`, `RolePermission` | [`../fase-1/data-model/DB-audit-permissions.md`](../fase-1/data-model/DB-audit-permissions.md) + último ADMIN ADR-031 |

ERD base: [`../fase-1/diagrams/ARCH-ERD-01.md`](../fase-1/diagrams/ARCH-ERD-01.md)

---

## 8. Contratos API

| Módulo | Documento |
|--------|-----------|
| AUTH … MEDIA (F1–F2) | `fase-1/api/`, `fase-2/api/` |
| ORDERS / POS / DASH (F3) | `fase-3/api/` |
| REVIEWS | [`../fase-4/api/API-REVIEWS-01.md`](../fase-4/api/API-REVIEWS-01.md) |
| GEO query F4 | [`../fase-4/api/API-GEO-01.md`](../fase-4/api/API-GEO-01.md) |
| GEO motor F5 | [`../fase-5/api/API-GEO-01.md`](../fase-5/api/API-GEO-01.md) |
| GEO query F7 | [`../fase-7/api/API-GEO-01.md`](../fase-7/api/API-GEO-01.md) |
| GEO query F8 | [`../fase-8/api/API-GEO-01.md`](../fase-8/api/API-GEO-01.md) |
| GEO query F9 | [`../fase-9/api/API-GEO-01.md`](../fase-9/api/API-GEO-01.md) (mayoreo/domicilio + typeahead `q`+geo) |
| EXPLORE notes F9 | [`../fase-9/api/API-EXPLORE-NOTES-01.md`](../fase-9/api/API-EXPLORE-NOTES-01.md) (08/10/24 sin API Must) |
| ADDRESSES F7 | [`../fase-7/api/API-ADDRESSES-01.md`](../fase-7/api/API-ADDRESSES-01.md) |
| ADDRESSES F8 | [`../fase-8/api/API-ADDRESSES-01.md`](../fase-8/api/API-ADDRESSES-01.md) (inventario; sin ruta nueva) |
| PREVIEW F7 | [`../fase-7/api/API-PROVIDER-PREVIEW-01.md`](../fase-7/api/API-PROVIDER-PREVIEW-01.md) |
| PREVIEW F8 | [`../fase-8/api/API-PROVIDER-PREVIEW-01.md`](../fase-8/api/API-PROVIDER-PREVIEW-01.md) (NFR hover) |
| PREVIEW F9 | [`../fase-9/api/API-PROVIDER-PREVIEW-01.md`](../fase-9/api/API-PROVIDER-PREVIEW-01.md) (in-card; sin API nueva) |
| SETTINGS vitrina | [`../fase-7/api/API-PROVIDER-SETTINGS-01.md`](../fase-7/api/API-PROVIDER-SETTINGS-01.md) |
| AUTH cookie F7 | [`../fase-7/api/API-AUTH-01.md`](../fase-7/api/API-AUTH-01.md) |
| ADDRESSES F4 | [`../fase-4/api/API-ADDRESSES-01.md`](../fase-4/api/API-ADDRESSES-01.md) |
| ADMIN analytics | [`../fase-4/api/API-ADMIN-ANALYTICS-01.md`](../fase-4/api/API-ADMIN-ANALYTICS-01.md) |
| PROVIDER settings F4 | [`../fase-4/api/API-PROVIDER-SETTINGS-01.md`](../fase-4/api/API-PROVIDER-SETTINGS-01.md) |
| PROVIDER settings brand | [`../fase-5/api/API-PROVIDER-SETTINGS-01.md`](../fase-5/api/API-PROVIDER-SETTINGS-01.md) |
| CAT inhabilitado | [`../fase-5/api/API-PROVIDER-PRODUCTS-01.md`](../fase-5/api/API-PROVIDER-PRODUCTS-01.md) |
| SESSION theme | [`../fase-5/api/API-SESSION-THEME-01.md`](../fase-5/api/API-SESSION-THEME-01.md) |
| ORDERS delta | [`../fase-4/api/API-ORDERS-01.md`](../fase-4/api/API-ORDERS-01.md) |
| NOTIFY delta | [`../fase-4/api/API-NOTIFY-01.md`](../fase-4/api/API-NOTIFY-01.md) |
| REPORTS JSON F6 | [`../fase-6/api/API-PROVIDER-REPORTS-01.md`](../fase-6/api/API-PROVIDER-REPORTS-01.md) (grain; solo lectura) |
| REPORTS PDF | [`../fase-6/api/API-PROVIDER-REPORTS-PDF-01.md`](../fase-6/api/API-PROVIDER-REPORTS-PDF-01.md) |
| GEO nota F6 | [`../fase-6/api/API-GEO-01.md`](../fase-6/api/API-GEO-01.md) |
| ADMIN SEC F10 | [`../fase-10/api/API-ADMIN-SEC-01.md`](../fase-10/api/API-ADMIN-SEC-01.md) |
| ADMIN products F10 | [`../fase-10/api/API-ADMIN-PRODUCTS-01.md`](../fase-10/api/API-ADMIN-PRODUCTS-01.md) |
| ADMIN providers flags | [`../fase-10/api/API-ADMIN-PROVIDERS-01.md`](../fase-10/api/API-ADMIN-PROVIDERS-01.md) |
| Local SKU | [`../fase-10/api/API-PROVIDER-PRODUCTS-02.md`](../fase-10/api/API-PROVIDER-PRODUCTS-02.md) |
| Secciones | [`../fase-10/api/API-PROVIDER-SECTIONS-01.md`](../fase-10/api/API-PROVIDER-SECTIONS-01.md) |
| MEDIA disco | [`../fase-10/api/API-MEDIA-02.md`](../fase-10/api/API-MEDIA-02.md) |
| REPORTS rango F10 | [`../fase-10/api/API-PROVIDER-REPORTS-02.md`](../fase-10/api/API-PROVIDER-REPORTS-02.md) |
| DASH print | [`../fase-10/api/API-DASH-NOTES-01.md`](../fase-10/api/API-DASH-NOTES-01.md) |
| AUTH multi-frutería | [`../fase-11/api/API-AUTH-11.md`](../fase-11/api/API-AUTH-11.md) |
| ISO sucursal | [`../fase-11/api/API-PROVIDER-ISO-01.md`](../fase-11/api/API-PROVIDER-ISO-01.md) |
| ONB N+1 | [`../fase-11/api/API-PROVIDER-ONB-01.md`](../fase-11/api/API-PROVIDER-ONB-01.md) |
| REPORTS global | [`../fase-11/api/API-PROVIDER-REPORTS-03.md`](../fase-11/api/API-PROVIDER-REPORTS-03.md) |
| ADMIN filas F11 | [`../fase-11/api/API-ADMIN-PROVIDERS-02.md`](../fase-11/api/API-ADMIN-PROVIDERS-02.md) |
| EXPLORE F11 | [`../fase-11/api/API-EXPLORE-11.md`](../fase-11/api/API-EXPLORE-11.md) |
| SEED F11 | [`../fase-11/api/API-SEED-11.md`](../fase-11/api/API-SEED-11.md) |
| INVENTARIO F12 | [`../fase-12/api/API-INVENTORY-01.md`](../fase-12/api/API-INVENTORY-01.md) |
| POS stock F12 | [`../fase-12/api/API-POS-12.md`](../fase-12/api/API-POS-12.md) |
| ORDERS reserva F12 | [`../fase-12/api/API-ORDERS-12.md`](../fase-12/api/API-ORDERS-12.md) |
| CAT panel F12 | [`../fase-12/api/API-PROVIDER-PRODUCTS-12.md`](../fase-12/api/API-PROVIDER-PRODUCTS-12.md) |
| PREFS POS F12 | [`../fase-12/api/API-PROVIDER-PREFS-12.md`](../fase-12/api/API-PROVIDER-PREFS-12.md) |
| CAT / INV F13 | [`../fase-13/README.md`](../fase-13/README.md) (solo lectura) |
| SETTINGS / INV / DASH F14 | [`../fase-14/README.md`](../fase-14/README.md) |

Envelope: [`adrs/ADR-003-error-envelope.md`](./adrs/ADR-003-error-envelope.md)

---

## 9. Seguridad

| Aspecto | Implementación |
|---------|----------------|
| Autenticación | JWT cookie `httpOnly`, `SameSite=Lax`, `Secure` en HTTPS (ADR-025) + cookie `lbm_active_provider` (ADR-034) |
| Passwords | bcrypt; nunca en logs |
| RBAC | `requireRole()` + `hasModulePermission` en catalogs **y** `/api/admin/*` (F10) |
| Google fields | 403 si `isVerified=false`; no solo UI |
| APIs públicas | GET providers, detalle, reviews list, ETA, contact, auth, `GET /api/auth/session`, `GET /api/media/[filename]` |
| Rate limit | Contacto 5/10min + 20/IP/h — **Redis**; altas locales y uploads F10 |
| Reportes | Sucursal = activo (F10). Global = todas las del user, **403 si N=1**. PDF F6 no se reabre |
| Media | Disco + ownership PROVIDER / ADMIN; path opaco; IDOR 403 |
| Privacidad | Sin PII cliente en email de contacto; `authorName` anonimizado en reseñas; password fuera de AUDIT |
| Colores | Hex + contraste en servidor; solo dueño o ADMIN escriben |
| Catálogo | Inhabilitado no se vende (409); locales aislados por `ownerProviderId`; último ADMIN 409 |
| Favoritas | Solo `userId` de la cookie CLIENT; 401 invitado |
| Báscula | Datos de periférico no salen del browser |
| Inventario | IDOR 403; público sin on-hand/reserved; venta nunca 4xx de stock; merma/ajuste 400 si saldo negativo |

---

## 10. Decisiones arquitectónicas (ADRs)

| ADR | Título | Estado |
|-----|--------|--------|
| ADR-001 | [Onboarding 2 pasos](./adrs/ADR-001-provider-onboarding-two-step.md) | Aceptado |
| ADR-002 | [Sin versionado API](./adrs/ADR-002-api-no-versioning-mvp.md) | Aceptado |
| ADR-003 | [Envelope JSON](./adrs/ADR-003-error-envelope.md) | Aceptado |
| ADR-004 | [Paginación offset](./adrs/ADR-004-pagination-strategy.md) | Aceptado |
| ADR-005 | [Email Resend](./adrs/ADR-005-email-provider.md) | Aceptado |
| ADR-006 | [Cloudinary](./adrs/ADR-006-image-storage.md) | **Aparcado** (F10, ADR-032) |
| ADR-007 | [Audit CONTACT / MEDIA](./adrs/ADR-007-contact-audit-action.md) | Aceptado |
| ADR-008 | [Email in-process](./adrs/ADR-008-notification-async.md) | **Reemplazado** por 015 |
| ADR-009…014 | POS/orders F3 | Registrados en `fase-3/adrs/` |
| ADR-015 | [Cola Upstash + Inngest](./adrs/ADR-015-notification-queue.md) | Aceptado |
| ADR-016 | [Google Maps JS](./adrs/ADR-016-maps-engine.md) | **Reemplazado** por 020 |
| ADR-017 | [ETA Haversine](./adrs/ADR-017-eta-formula.md) | Aceptado |
| ADR-018 | [Reseñas + Google gate](./adrs/ADR-018-google-reviews.md) | Aceptado |
| ADR-019 | [Drivers báscula](./adrs/ADR-019-scale-drivers.md) | Aceptado |
| ADR-020 | [Leaflet + OSM](./adrs/ADR-020-maps-engine-leaflet.md) | Aceptado (append F8: clamp 0.5–10; pan≠radio en MX) |
| ADR-021 | [Colores marca PROVIDER](./adrs/ADR-021-provider-brand-colors.md) | Aceptado |
| ADR-022 | [Catálogo inhabilitado](./adrs/ADR-022-catalog-inactive.md) | Aceptado |
| ADR-023 | [PDF reporte servidor](./adrs/ADR-023-report-pdf.md) | Aceptado (F6 congelada) |
| ADR-024 | [Ventanas calendario DASH](./adrs/ADR-024-calendar-windows.md) | Aceptado (F6 congelada) |
| ADR-025 | [Cookie JWT móvil](./adrs/ADR-025-session-cookie-mobile.md) | Aceptado |
| ADR-026 | [Default Explorar SN](./adrs/ADR-026-explore-default-san-nicolas.md) | Aceptado |
| ADR-027 | [lastUsedAt UserAddress](./adrs/ADR-027-address-last-used.md) | Aceptado |
| ADR-028 | [Bbox México Explorar](./adrs/ADR-028-mexico-bounds.md) | Aceptado |
| ADR-029 | [Dual SKU GLOBAL/LOCAL](./adrs/ADR-029-dual-sku.md) | Aceptado |
| ADR-030 | [ProviderSection](./adrs/ADR-030-provider-section.md) | Aceptado |
| ADR-031 | [Último ADMIN](./adrs/ADR-031-last-admin.md) | Aceptado |
| ADR-032 | [Disco de imágenes](./adrs/ADR-032-disk-image-storage.md) | Aceptado |
| ADR-033 | [Reportes from/to](./adrs/ADR-033-report-date-range.md) | Aceptado |
| ADR-034 | [User 1:N + activo cookie](./adrs/ADR-034-user-providers-1n-active.md) | Aprobado |
| ADR-035 | [Reportes globales N>1](./adrs/ADR-035-global-provider-reports.md) | Aprobado |
| ADR-036 | [Inventario blando Decimal](./adrs/ADR-036-inventario-blando.md) | Aprobado |
| ADR-037 | [Reserva Encargar](./adrs/ADR-037-encargar-reserva.md) | Aprobado |
| ADR-038 | [Archivo de oferta + unidad sucursal](./adrs/ADR-038-archivo-oferta-unidad.md) | Aprobado |
| ADR-039 | [`isVerified` intacto al mudar pin](./adrs/ADR-039-isverified-coords.md) | Aprobado |
| ADR-040 | [Merma/ajuste en `InventoryEntry`](./adrs/ADR-040-merma-aditiva.md) | Aprobado |
| ADR-041 | [Gráficas SVG unificado](./adrs/ADR-041-graficas-svg.md) | Aprobado |

---

## 11. Infraestructura

Ver [`infra-requirements.md`](./infra-requirements.md)

---

## 12. Roadmap arquitectónico

| Fase | Capacidades | Estado |
|------|-------------|--------|
| **F1** | Auth, explorar, catálogo, admin | Implementada |
| **F2** | Contacto+email, Cloudinary, filtros | Implementada |
| **F3** | Pedidos pickup, POS, dashboard proveedor | Implementada |
| **F4** | Reviews, geo Haversine, Redis+Inngest, analytics, báscula | QG BE aprobado 14/08/2026 |
| **F5** | Leaflet/OSM, CAT inhabilitado, brand sesión PROVIDER | QG BE aprobado 15/08/2026 |
| **F6** | Deuda (Redis/CI/503) + reportes PROVIDER + GEO zoom↔radio | **Congelada** (diseño 16/08/2026) |
| **F7** | Explorar pan≠radio, `total`, favoritas last-used, preview, AUTH cookie | **Diseñada** 18/08/2026 v0.7.1 (solo lectura) |
| **F8** | Clamp 0.5–10, mapa México, chrome ubicación, preview hover | **Diseñada** 24/08/2026 v0.8.3 (solo lectura) |
| **F9** | Deuda Explorar: in-card, typeahead `q`+geo, chips mayoreo/domicilio, distancia/ETA, chrome | **Diseñada** 25/08/2026 v0.9.0 (solo lectura) |
| **F10** | Admin RBAC, CRUD global, SKU local, secciones, media disco, DASH rango | **Diseñada** 28/08/2026 v0.10.2 (solo lectura) |
| **F11** | 1:N sucursales, cookie activo, DASH global, seed Paraíso ×2 | **Diseñada** 12/09/2026 v0.11.0 (solo lectura) |
| **F12** | Inventario blando, reservas Encargar, barra CAT, toggle POS | **Diseñada** 14/09/2026 v0.12.0 (solo lectura) |
| **F13** | Admin GLOBAL+LOCAL, archivo oferta, unidad/precio sucursal, entradas, reportes inv. | **Diseñada** 16/09/2026 v0.13.0 (solo lectura) |
| **F14** | Perfil datos negocio, merma aditiva, series/PDF rango | **Diseñada** 17/09/2026 v0.14.0 |
| **F6+ producto** | Pasarela de pagos, CFDI | Aparcado hasta nuevo aviso (`CO-F6-001`) |

Won't F10: auto-global, secciones anidadas, chips Explorar de sección, Cloudinary/S3, CRUD usuarios, 2FA, impersonation, Maps JS, Places, pan→radio, pasarela, CFDI, editar `fase-6/`, Redis/CI F6, ADMIN DASH ajeno, CSV, multi-mes, reopen F7–F9.

---

## 13. Referencias

| Documento | Ubicación |
|-----------|-----------|
| STATUS | [`../STATUS.md`](../STATUS.md) |
| Handoff Backend F14 | [`../fase-14/handoff-backend-fase-14.md`](../fase-14/handoff-backend-fase-14.md) |
| Handoff Backend F13 | [`../fase-13/handoff-backend-fase-13.md`](../fase-13/handoff-backend-fase-13.md) |
| Handoff Backend F12 | [`../fase-12/handoff-backend-fase-12.md`](../fase-12/handoff-backend-fase-12.md) |
| Handoff Backend F11 | [`../fase-11/handoff-backend-fase-11.md`](../fase-11/handoff-backend-fase-11.md) |
| Handoff Backend F10 | [`../fase-10/handoff-backend-fase-10.md`](../fase-10/handoff-backend-fase-10.md) |
| Handoff Backend F9 | [`../fase-9/handoff-backend-fase-9.md`](../fase-9/handoff-backend-fase-9.md) |
| Handoff Backend F8 | [`../fase-8/handoff-backend-fase-8.md`](../fase-8/handoff-backend-fase-8.md) |
| Handoff Backend F7 | [`../fase-7/handoff-backend-fase-7.md`](../fase-7/handoff-backend-fase-7.md) |
| Handoff Backend F6 deuda | [`../fase-6/handoff-backend-fase-6.md`](../fase-6/handoff-backend-fase-6.md) |
| Handoff Backend F6 reportes | [`../fase-6/handoff-backend-fase-6-reportes.md`](../fase-6/handoff-backend-fase-6-reportes.md) |
| Hub (append) | [`../historial/OBSERVABILITY.md`](../historial/OBSERVABILITY.md) |
| Deuda DevOps | `Agente DevOps/.../comun/deuda-fases-previas.md` |
| Impacto QA | QA `fase-5/deuda-tecnica-fases-previas/IMPACTO-NO-ATENDER.md` |

---

*SAD generado por Agente Arquitecto de Software — LaBorregaMarket v0.14.0.*
