# READY-FOR-QA — Fase 4

> **Proyecto:** LaBorregaMarket  
> **Fase:** 4 — Reseñas, Geo/Maps, Notify-scale, Admin analytics, POS báscula (v0.4.0)  
> **Fecha:** 14/08/2026  
> **De:** Agente Arquitecto de Software  
> **Para:** @QA Tester  
> **Condición:** `REVIEW-ARCH.md` ≥ 80% y **0 P0** (cumplido: 97/100)

---

## Dictámenes previos

| Agente | Archivo | Veredicto | Puntaje |
|--------|---------|-----------|---------|
| Arquitecto (BE) | [`REVIEW-ARCH.md`](./REVIEW-ARCH.md) | APROBADO CON OBSERVACIONES | 97 / 100 · 0 P0 |
| Backend (auto) | `Agente backend/.../fase-4/quality/QR-BE.md` | Listo para QG | 94 / 100 (no es el dictamen) |
| Frontend (auto) | `Agente frontend/.../fase-4/quality/QR-FE.md` | Solicita QG UX | 86 / 100 · 0 P0 |
| UX/UI | `Agente UX UI/.../fase-4/quality/REVIEW-UX.md` | APROBADO PARA HANDOFF (diseño) | n/a — no es rúbrica de implementación |

`REVIEW-UX.md` F4 cubre **diseño** (flujos/wireframes), no una re-auditoría 10×10 del código FE. Esta estafeta habilita pruebas de **API + UI ya integrada**. Si UX emite después un REVIEW-UX de implementación, QA puede anexar hallazgos de copy/estados.

---

## Alcance de prueba

| Módulo | Rutas UI | Contratos API | US |
|--------|----------|---------------|-----|
| REVIEWS | `/cuenta` (pedido entregado), `/fruteria/[id]` | API-REVIEWS-01 | US-REV-01, 02 |
| Google embed / settings | `/proveedor`, `/fruteria/[id]` | API-PROVIDER-SETTINGS-01 | US-REV-03, 04 |
| GEO / Maps | `/explorar` | API-GEO-01 | US-GEO-01, 02 |
| Direcciones | `/explorar` (guardar pin) | API-ADDRESSES-01 | US-GEO-03 |
| ETA | `/carrito`, detalle pedido | `GET .../eta`, snapshot orden | US-NOTIFY-09 |
| NOTIFY | `/fruteria/[id]` contacto | API-NOTIFY-01 delta | US-NOTIFY-06, 07 |
| ADMIN analytics | `/admin/analytics` | API-ADMIN-ANALYTICS-01 | US-ADMIN-01 |
| POS báscula | `/proveedor/pos` | API-POS-01 **sin cambio** | US-POS-05, 06 (solo FE) |
| Delivery (Should) | `/carrito` | API-ORDERS-01 delta | US-ORDERS-05 |

**Índice arquitectura:** [`../README.md`](../README.md)  
**Handoff BE→FE:** `Agente backend/.../fase-4/handoff-frontend.md`  
**Código:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## Roles y acceso

| Rol | Rutas principales | Notas |
|-----|-------------------|-------|
| **CLIENT** | `/explorar`, `/fruteria/[id]`, `/carrito`, `/cuenta` | Addresses 401 si invitado → `/login?redirect=/explorar` |
| **PROVIDER** | `/proveedor`, `/proveedor/pos`, `/proveedor/ordenes` | Google bloqueado si `isVerified=false` |
| **ADMIN** | `/admin`, `/admin/analytics` | DELETE reseña; quitar verificación |

**Entorno:** local `npm run dev` o staging.  
**Precondición:** aplicar migración F4 (`OBS-F4-020`): `npx prisma migrate deploy` con `next dev` detenido.

Env relevantes: `UPSTASH_REDIS_*` (prod), `INNGEST_*`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, Should `WHATSAPP_*`. Sin Maps key: listado usable + empty de mapa. Sin Redis en local: rate limit in-memory.

---

## Happy paths obligatorios (100%)

### HP-REV-01 — Reseña post-entrega

1. Como CLIENT, tener un pedido marketplace propio en `DELIVERED` sin reseña.
2. Calificar 1–5 y (opcional) comentar.
3. `POST /api/orders/{id}/reviews` → 201; la reseña aparece en `/fruteria/[id]`.
4. `rating` / `reviewCount` del proveedor se actualizan (no valores de seed).
5. Segundo POST al mismo pedido → **409**.
6. Pedido `PENDING` o venta POS walk-in → no hay CTA / **403**.

### HP-REV-04 — Gate Google

1. PROVIDER no verificado: bloque UI "Requiere verificación de tu negocio".
2. `PATCH /api/provider/me` con `googlePlaceId` o `googleReviewsEnabled` → **403** (bypass API, no solo UI).
3. ADMIN verifica el negocio; PROVIDER guarda Place ID/URL y activa toggle.
4. `/fruteria/[id]` muestra enlace/embed Google.
5. ADMIN quita verificación: el embed desaparece (`googleReviewsEnabled` apagado; Place ID no se borra).

### HP-GEO-01 — Radio en explorar

1. En `/explorar`, fijar pin en bounding box Monterrey y radio 1–25 km.
2. `GET /api/providers?lat&lng&radiusKm` → solo providers ≤ radio, orden por `distanceKm`, combinable con `q`/`category`/`verified`.
3. Sin radio: default **10 km** si hay coords.
4. `radiusKm=30` o coords CDMX → **400**.
5. Sin sesión, "Guardar dirección" → **401** / login; tras login se puede crear `UserAddress`.

### HP-ADD-01 — Dirección favorita

1. CLIENT autenticado guarda pin con etiqueta (ej. "Casa").
2. Listado en selector de `/explorar`; máximo una `isDefault`.
3. DELETE de dirección ajena → **404**.

### HP-ETA-01 — Tiempo estimado

1. Checkout pickup **sin** pin: copy de solo preparación (`eta_prep_only`).
2. Con pin o delivery: "Listo aprox. en ~X min" (`eta_ready_approx`).
3. `GET /api/providers/{id}/eta` coincide con el chip (no Distance Matrix).

### HP-ADMIN-01 — Analytics plataforma

1. ADMIN abre `/admin/analytics` con `range=today|7d|30d`.
2. Con órdenes: GMV (sin `CANCELLED`), split MARKETPLACE/POS.
3. Sin órdenes en el periodo: **empty state** (`empty: true`, no ceros confusos).
4. Distinto de `/proveedor/dashboard`.

### HP-NOTIFY-01 — Contacto sin `after()`

1. `POST /api/providers/{id}/contact` → 200 `{ notified: true }` rápido.
2. Exceder 5/10 min por provider+IP → **429**.
3. En local sin Redis el límite es por proceso; en staging con Upstash debe persistir cold start.
4. Venta POS: cobrar **sin** campos extra de báscula; peso solo llena `quantity` (KG/GR).

### HP-POS-01 — Báscula no rompe F3

1. POS Cobrar/Confirmar/Encargar igual que F3.
2. Conectar báscula (Chromium) o fallback manual si no hay WebSerial.
3. El body de `POST /api/provider/pos/sales` no incluye VID/PID.

### HP-ORD-05 — Delivery Should (si se prueba)

1. Proveedor con `offersDelivery=true` y dirección guardada.
2. Checkout "A domicilio" → `fulfillmentType=DELIVERY`, snapshot, ETA.
3. Proveedor sin delivery: solo pickup.
4. `IN_TRANSIT` + DELIVERY → copy **"En camino"**; pickup → **"Listo para recoger"**.

### HP-REG-01 — Regresión F2/F3

1. Llamar / WhatsApp `wa.me` en detalle frutería intactos.
2. Encargar pickup F3 intacto si no se elige delivery.

---

## Edge cases recomendados (≥85%)

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| EC-01 | Reseña rating 0 o 6 | 400 `details.rating` |
| EC-02 | `GET /api/providers?lat=25.67` (sin lng) | 400 |
| EC-03 | 21ª dirección del cliente | 400 límite 20 |
| EC-04 | `DELIVERY` sin `deliveryAddressId` | 400 |
| EC-05 | `DELIVERY` y `offersDelivery=false` | 400 |
| EC-06 | Analytics `range=year` | 400 |
| EC-07 | DELETE review no ADMIN | 401/403 |
| EC-08 | Mapa sin `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Listado OK + empty mapa |
| EC-09 | Contacto Redis caído en `NODE_ENV=production` | 503 |
| EC-10 | Doble publicar reseña | 409 |

---

## Observaciones conocidas (no bloquean QA)

| ID | Severidad | Descripción |
|----|-----------|-------------|
| OBS-F4-020 | P1 | Aplicar migración F4 en la BD local antes de probar |
| OBS-F4-021 | P2 | Tests de integración BE mockean servicios |
| OBS-F4-022 | P2 | Sin smoke staging Upstash/Inngest/WhatsApp |
| OBS-UX-F4-001 | P2 | Mini-mapa detalle frutería puede seguir Leaflet (F4 obliga Maps en `/explorar`) |
| OBS-UX-F4-002 | P2 | Edición de reseña no está en Must |

---

## Fuera de alcance QA F4

Pasarela de pagos, CFDI, importación Places API, Distance Matrix, rutas/flotilla, impresora térmica, lector de barras, PWA, fotos en reseña.

WhatsApp Business (US-NOTIFY-08) es Should: no-op sin keys; no bloquear el pedido si falla.

---

*Habilitación QA emitida por Agente Arquitecto de Software — LaBorregaMarket v0.4.0 — 14/08/2026.*
