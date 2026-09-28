# Handoff de Módulo: MOD-NOTIFY

> **Proyecto:** LaBorregaMarket  
> **Módulo:** NOTIFY (scale Redis + Inngest)  
> **Stack:** Next.js 15 + Upstash Redis + Inngest + Resend  
> **Fecha:** 2026-08-14  
> **Contrato de referencia:** `API-NOTIFY-01` F4, ADR-015 (reemplaza ADR-008)

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| POST | `/api/providers/[id]/contact` | Pública (shape F2 intacto) | API-NOTIFY-01 | OK |
| POST | `/api/orders` | CLIENT (HTTP F3 intacto) | API-ORDERS-01 notify | OK |
| GET/POST/PUT | `/api/inngest` | Firma Inngest | ADR-015 serve | OK |

---

## 2. Validación (DTOs)

HTTP de contacto **sin cambio**. Rate limit: 5/10min provider+IP, 20/h IP. Claves Redis `rl:contact:p:{providerId}:{ip}` y `rl:contact:ip:{ip}`.

---

## 3. Base de datos

Sin tablas nuevas de cola. AUDIT sync + segundo AUDIT `notificationFailed` tras agotar retries Inngest (≤3 intentos de función).

`User.whatsappOptIn` en GET/PATCH `/api/users/me`. Jobs WA: `notify/order.created` → `Provider.phone`; `notify/order.status` IN_TRANSIT → cliente si opt-in. Sin keys / número inválido → no-op.

---

## 4. Seguridad

- [x] Secrets solo `.env`
- [x] Local/test sin Redis → in-memory + log `redis_disabled`
- [x] Prod sin Redis / Redis caído → **503** fail closed

---

## 5. Pruebas

`npm test -- tests/unit/rate-limit.contact.test.ts tests/integration/contact.routes.test.ts tests/integration/orders.routes.test.ts`

`after()` eliminado de contact y orders.

---

## 6. Definition of Done (DoD Backend)

- [x] Validación Completa
- [x] Manejo de Errores Robust
- [x] Seguridad de Datos
- [x] Rate limit compartido (Redis)
- [x] Emails no dependen de `after()`
- [x] Pruebas Superadas

---

## 7. Notas para downstream

### Frontend

Sin cambios de payload. Nuevo: 503 `{ "error": "Servicio no disponible. Intenta más tarde." }`

### QA

Contacto 200 < 200 ms (no espera Resend). 429 idéntico F2.

### DevOps

| Variable | Req staging/prod |
|----------|------------------|
| `UPSTASH_REDIS_REST_URL` | Sí |
| `UPSTASH_REDIS_REST_TOKEN` | Sí |
| `INNGEST_EVENT_KEY` | Sí |
| `INNGEST_SIGNING_KEY` | Sí |
| `WHATSAPP_TOKEN` | No (sin key → no-op) |
| `WHATSAPP_PHONE_NUMBER_ID` | No (sin id → no-op) |
| `WHATSAPP_TEMPLATE_ORDER_NEW` | Con WA |
| `WHATSAPP_TEMPLATE_ORDER_READY` | Con WA |

Registrar app Inngest → `{NEXT_PUBLIC_APP_URL}/api/inngest`. Eventos: `notify/contact.requested`, `notify/order.created`, `notify/order.status`.
