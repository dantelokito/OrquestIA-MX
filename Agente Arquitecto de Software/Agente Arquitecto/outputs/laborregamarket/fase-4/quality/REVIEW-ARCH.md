# REVIEW-ARCH — Quality Gate Backend Fase 4

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer (devolución) · @QA Tester (si READY-FOR-QA)  
> **Producto:** LaBorregaMarket v0.4.0  
> **Fecha:** 14/08/2026  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Veredicto:** **APROBADO CON OBSERVACIONES**  
> **Puntaje:** 97 / 100 · **0 P0** · P1 operacional (migración)

No se copia el auto-score de QR-BE (94/100). Auditoría contra ADRs 015–019 y contratos `fase-4/api/`.

---

## Alcance auditado

Migración `prisma/migrations/20260814040000_add_reviews_addresses_notify_scale`, `prisma/schema.prisma`, rutas F4 (reviews, geo, eta, addresses, `PATCH /api/provider/me`, analytics, `/api/inngest`, contact, orders Should), servicios `review` / `address` / `provider` / `order` / `admin-analytics` / `contact`, `lib/geo/*`, `lib/rate-limit/contact.ts`, `lib/inngest/*`, `lib/notify/whatsapp.ts`, POS `createPosSaleSchema`, tests Vitest (`tests/unit/*f4-related*` + `tests/integration/*`).

Contrato de referencia: [`../handoff-backend-fase-4.md`](../handoff-backend-fase-4.md), [`../api/`](../api/), [`../../comun/adrs/ADR-015-notification-queue.md`](../../comun/adrs/ADR-015-notification-queue.md) … ADR-019.

QR-BE Backend: `Agente backend/.../fase-4/quality/QR-BE.md` (insumo, no dictamen).

---

## Rúbrica (10 × 10)

| # | Criterio | Pts | Nota |
|---|----------|-----|------|
| 1 | Schema vs delta F4 | 10 | `Review` UK `orderId` + CHECK 1–5; `UserAddress`; campos Provider; Should Order/`whatsappOptIn`; índices pactados; backfill `rating`/`review_count` = 0 |
| 2 | Contratos HTTP Must | 10 | Reviews, GEO+ETA, addresses, settings PATCH, analytics, Inngest serve, contact HTTP intacto |
| 3 | Envelope ADR-003 | 10 | `ok` / `paginated` / 400–409 / 429 / 503 Redis |
| 4 | RBAC / ownership / Google 403 | 10 | CLIENT dueño; POS walk-in 403; ADMIN DELETE; `GoogleReviewsLockedError` 403 |
| 5 | Rating atómico + ETA ADR-017 | 10 | Tx `create`/`delete` + AVG/COUNT; `AVG_SPEED_KMH = 25`; `copyKey` |
| 6 | ADR-015 Redis + Inngest | 10 | Upstash REST; fail closed 503 en prod; `inngest.send`; **cero** `after()`; retries 2 (= 3 intentos) |
| 7 | Analytics ≠ dashboard proveedor | 10 | `GET /api/admin/analytics`; TZ Monterrey; `empty: true` + `kpis: null` |
| 8 | POS F3 intacto (ADR-019) | 10 | `createPosSaleSchema` sin campos de báscula |
| 9 | Should delivery / WA | 10 | Default `PICKUP`; DELIVERY + ownership + snapshot; WA no-op sin keys/opt-in |
| 10 | Pruebas | 7 | Unitarios de dominio sólidos; integración **mockea servicios** (mismo patrón F3) |
| | **Total** | **97** | Umbral 80% |

---

## Hallazgos

### OBS-F4-020 (P1) — Migración no verificada en runtime

El SQL está en el repo. QR-BE reporta bloqueo de Prisma generate en Windows (`next dev` con DLL). **Acción:** en `LaBorregaMarket`, parar el dev server y `npx prisma migrate deploy` (o `migrate dev`). Confirmar tablas `reviews`, `user_addresses` y columnas `preparation_time_minutes` / `fulfillment_type`.

### OBS-F4-021 (P2) — Integración mockea servicios

`tests/integration/reviews.routes.test.ts`, `geo.routes.test.ts`, `addresses.routes.test.ts`, `provider-settings.routes.test.ts`, `analytics.routes.test.ts` (y orders/contact) sustituyen `*.service`. Cubren envelope/RBAC HTTP, no UNIQUE `order_id` ni Haversine contra PostgreSQL. Los unitarios (`review.service`, `geo`, `eta`, `google-maps`, `admin-analytics`, `rate-limit`) sí ejercitan reglas.

### OBS-F4-022 (P2) — Sin smoke staging Redis / Inngest / WhatsApp

Keys DevOps no validadas en staging (QR-BE lo declara). Local sin Upstash usa memoria (`redis_disabled`). Prod sin Redis debe 503 (código presente; no ejecutado aquí).

Ningún P0. Gate Google 403 y agregado de rating están en código, no solo en UI.

---

## Cumplimiento (resumen)

| Regla | Resultado |
|-------|-----------|
| `Review` 1:1 pedido `DELIVERED` MARKETPLACE (ADR-018) | OK · POS / no dueño → 403; duplicado → 409 |
| Sin PATCH cliente de reseña | OK |
| `PATCH` Google si `isVerified=false` → 403 | OK · copy "Requiere verificación de tu negocio" |
| ADMIN `isVerified=false` apaga `googleReviewsEnabled` | OK · misma update |
| Radio 1–25, XOR lat/lng, bbox Monterrey → 400 | OK |
| Default `radiusKm=10` con coords | OK |
| ETA Haversine / 25 km/h, pickup sin coords = prep | OK |
| Rate limit Redis; local memory | OK |
| Contacto/pedido vía Inngest, no `after()` | OK |
| `notificationFailed` si no hay email (pedido) | OK · cierra espíritu OBS-F3-022 |
| Analytics `empty` sin ceros fingidos | OK |
| POS sales shape F3 | OK |
| Delivery Should no rompe pickup | OK · default `PICKUP` |
| Leaflet/Maps / báscula | Fuera de BE (FE) — correcto |

---

## Veredicto

**APROBADO CON OBSERVACIONES.** Frontend ya puede (y está) integrando contra APIs F4. Backend debe aplicar OBS-F4-020 antes de la corrida QA en local. P2 no bloquean.

**QA Tester:** habilitado — [`READY-FOR-QA.md`](./READY-FOR-QA.md).

---

*Dictamen Arquitecto — LaBorregaMarket v0.4.0 — 14/08/2026.*
