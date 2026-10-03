# Handoff Backend Developer — LaBorregaMarket Fase 4 (v0.4.0)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer (y notas Frontend / DevOps)  
> **Fecha:** 14/08/2026  
> **Prioridad:** Implementar Must F4 según contratos; Should al cerrar GEO  
> **No implementar:** pasarela, CFDI, Places import, Distance Matrix, logística real, cambio de `quantity`/`unitOfMeasure` POS

---

## Estado: LISTO PARA IMPLEMENTAR

Arquitectura F4 documentada. **No hay código F4** en `LaBorregaMarket`. UX F4 aún vacío: los shapes cubren las US; copy/estados pueden ajustarse después sin cambiar el modelo.

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/sad.md`](../comun/sad.md)

Código: `C:\Users\PC GAMER\LaBorregaMarket`

---

## Orden de implementación

```
1. Migración Prisma (Review, UserAddress, campos Provider, Should Order/User)
2. Reviews + agregado rating (API-REVIEWS-01)
3. Geo radio + ETA + Addresses
4. PATCH /api/provider/me (Google gate 403)
5. Upstash Redis rate limit + Inngest (reemplazar after())
6. GET /api/admin/analytics
7. Frontend: Google Maps, báscula (ADR-019; sin API)
8. Should: delivery checkout, WA, ETA en templates
```

Mapeo US: REV-01…04, GEO-01…03, NOTIFY-06…07, ADMIN-01, POS-05…06 (FE). Should: NOTIFY-08…09, ORDERS-05.

---

### 1 — Migración

| Tarea | Referencia |
|-------|------------|
| `Review`, `UserAddress` | [`data-model/DB-reviews.md`](./data-model/DB-reviews.md), [`DB-addresses.md`](./data-model/DB-addresses.md) |
| Delta Provider / Order | [`DB-providers.md`](./data-model/DB-providers.md), [`DB-orders.md`](./data-model/DB-orders.md) |
| Backfill `rating`/`reviewCount` | 0 o AVG real; no dejar seed como verdad |

```bash
npx prisma migrate dev --name add_reviews_addresses_notify_scale
```

Campos Should (`fulfillmentType`, `etaMinutes`, `whatsappOptIn`) **incluirlos en la misma migración** (default `PICKUP` / null / false) para no bloquear después.

---

### 2 — Reviews (Must)

| Tarea | Contrato |
|-------|----------|
| POST/GET review por pedido | [`api/API-REVIEWS-01.md`](./api/API-REVIEWS-01.md) |
| GET público paginado | mismo |
| DELETE admin + AUDIT | mismo |
| Transacción AVG/COUNT | [ADR-018](../comun/adrs/ADR-018-google-reviews.md) |

POS walk-in no reseña. Must: sin PATCH cliente.

---

### 3 — Geo + direcciones (Must)

| Tarea | Contrato |
|-------|----------|
| `lat` `lng` `radiusKm` en GET `/api/providers` | [`api/API-GEO-01.md`](./api/API-GEO-01.md) |
| `GET /api/providers/[id]/eta` | mismo + [ADR-017](../comun/adrs/ADR-017-eta-formula.md) |
| CRUD `/api/users/me/addresses` | [`api/API-ADDRESSES-01.md`](./api/API-ADDRESSES-01.md) |
| Haversine `lib/geo/` | umbral PostGIS documentado en DB-providers |

---

### 4 — Settings proveedor (Must)

| Tarea | Contrato |
|-------|----------|
| PATCH `/api/provider/me` | [`api/API-PROVIDER-SETTINGS-01.md`](./api/API-PROVIDER-SETTINGS-01.md) |
| 403 Google si `isVerified=false` | US-REV-04 — prueba de bypass API |
| ADMIN quita verificación → `googleReviewsEnabled=false` | misma transacción |

---

### 5 — Notify scale (Must)

| Tarea | Contrato / ADR |
|-------|----------------|
| Redis rate limit | [ADR-015](../comun/adrs/ADR-015-notification-queue.md), [`api/API-NOTIFY-01.md`](./api/API-NOTIFY-01.md) |
| Inngest serve `/api/inngest` | eventos `notify/contact.requested`, `notify/order.created` |
| Quitar `after(sendEmail)` en contact y orders | reemplazo ADR-008 |
| Retries ≤3 + AUDIT `notificationFailed` | patrón F2 |

HTTP de contacto **no cambia**.

---

### 6 — Admin analytics (Must)

[`api/API-ADMIN-ANALYTICS-01.md`](./api/API-ADMIN-ANALYTICS-01.md) — TZ Monterrey, `empty: true` sin ceros fingidos. Distinto de `/api/provider/dashboard`.

---

### 7 — POS báscula (Must FE, cero BE)

[ADR-019](../comun/adrs/ADR-019-scale-drivers.md). **No tocar** [`../fase-3/api/API-POS-01.md`](../fase-3/api/API-POS-01.md).

---

### 8 — Should

| Ítem | Contrato |
|------|----------|
| `fulfillmentType` DELIVERY | [`api/API-ORDERS-01.md`](./api/API-ORDERS-01.md) |
| WhatsApp jobs | API-NOTIFY-01 Should |
| ETA en email/WA | snapshot `Order.etaMinutes` |

No arrancar delivery antes de cerrar GEO (decisión PM D-F4-5).

---

## Frontend (consumo)

| Tema | Qué usar |
|------|----------|
| Envelope | ADR-003 |
| Explorar | Google Maps (ADR-016); query geo API-GEO-01; quitar Leaflet |
| Favoritas | API-ADDRESSES-01; 401 → login `redirect=/explorar` |
| Reseñas | POST tras DELIVERED; listado público; `reviewCount=0` → "Sin reseñas" |
| Google embed | solo si detalle trae `googleReviews.enabled` |
| Settings | `googleReviewsLocked`; no depender de UI para seguridad |
| ETA | GET `.../eta` + copyKey |
| Analytics | `/admin/analytics` + `empty` |
| Báscula | `src/lib/pos/scale/` registry VID/PID |

---

## DevOps

Ver [`../comun/infra-requirements.md`](../comun/infra-requirements.md).

Must env: `UPSTASH_REDIS_*`, `INNGEST_*`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (restricción dominio).  
Should: `WHATSAPP_*`. Extender `.env.example`.

---

## DoD arquitectura (checklist Backend)

- [ ] Ningún PATCH Google pasa si `isVerified=false`
- [ ] Rate limit compartido entre instancias
- [ ] Emails de contacto/pedido no dependen de `after()`
- [ ] `rating`/`reviewCount` transaccionales
- [ ] Radio 1–25 + 400 coords inválidas
- [ ] Analytics ADMIN ≠ dashboard proveedor
- [ ] Envelope 400/401/403/404/409/429/500
- [ ] POS sales shape F3 intacto

---

## Fuera de alcance

Pasarela, CFDI, PWA, Places API import, Distance Matrix, flotilla, impresora, barras.

---

## Referencias

- SAD: [`../comun/sad.md`](../comun/sad.md)
- ADRs 015–019: [`../comun/adrs/`](../comun/adrs/)
- PRD: PM `fase-4/prd.md`
- Handoff PM: PM `fase-4/handoff-arquitecto.md`
