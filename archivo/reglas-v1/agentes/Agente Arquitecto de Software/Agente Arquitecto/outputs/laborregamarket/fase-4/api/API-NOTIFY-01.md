# API-NOTIFY-01 — Delta Fase 4 (cola Inngest + rate limit Redis)

> **Endpoint:** `POST` `/api/providers/[id]/contact` (HTTP **sin cambio de shape**)  
> **Módulo:** `NOTIFY`  
> **Versión:** 0.4.0  
> **Fecha:** 14/08/2026  
> **US:** US-NOTIFY-06, US-NOTIFY-07; Should US-NOTIFY-08, US-NOTIFY-09  
> **Base F2:** [`../../fase-2/api/API-NOTIFY-01.md`](../../fase-2/api/API-NOTIFY-01.md)  
> **ADR:** [ADR-015](../../comun/adrs/ADR-015-notification-queue.md) reemplaza ADR-008

El contrato HTTP de contacto (200 `{ notified, message }`, 404, 429, body `source`/`productIds`) **no se modifica**. Cambia el store del rate limit y el transporte del email.

---

## Rate limit (Must)

Mismos umbrales F2:

| Límite | Ventana | Clave |
|--------|---------|-------|
| 5 | 10 min | `providerId` + IP |
| 20 | 1 hora | IP |

Store: **Upstash Redis** (`@upstash/redis`). Env: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

429 idéntico:

```json
{ "error": "Demasiados intentos. Intenta más tarde." }
```

Local sin Redis: fallback in-memory + log `redis_disabled`. Staging/prod: Redis obligatorio (fail closed → 503 si Redis cae, o fail open documentado en implementación; **recomendación: fail closed 503** `{ "error": "Servicio no disponible. Intenta más tarde." }` para no abrir flood).

---

## Side effects (orden F4)

1. Validar Provider activo.
2. Rate limit Redis → 429.
3. AUDIT `CONTACT` sync.
4. `inngest.send({ name: "notify/contact.requested", data: { auditId, providerId, productIds } })`.
5. Return 200 `&lt; 200 ms`.
6. Worker Inngest: Resend × ≤3. Fallo definitivo: segundo AUDIT `notificationFailed: true`.

Ruta serve: `POST/GET /api/inngest` (SDK Inngest). No es API de producto.

---

## Pedido nuevo (Must)

`POST /api/orders` encola `notify/order.created` en lugar de `after(sendEmail)`. Mismo patrón de retries y AUDIT.

---

## WhatsApp Business (Should — US-NOTIFY-08)

No hay endpoint de producto nuevo. El worker escucha:

| Evento Inngest | Destinatario | Condición |
|----------------|--------------|-----------|
| `notify/order.created` | `Provider.phone` (dueño) | Template "nuevo pedido" aprobado |
| `notify/order.status` (`IN_TRANSIT`) | `User.phone` del cliente | `whatsappOptIn=true` + teléfono E.164 |

Sin opt-in / número inválido / sandbox down: no-op; email sigue. Nunca bloquear la transición de pedido.

Env (Should): `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, IDs de plantilla Meta.

`wa.me` del Frontend F2 **permanece** como CTA manual.

---

## ETA en mensajes (Should — US-NOTIFY-09)

Templates email/WA incluyen `etaMinutes` del snapshot del pedido cuando no es null. Copy: estimación.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Rate limit | `src/lib/rate-limit/contact.ts` → cliente Upstash |
| Inngest client | `src/lib/inngest/client.ts` |
| Functions | `src/lib/inngest/functions/notify-contact.ts`, `notify-order.ts` |
| Serve | `src/app/api/inngest/route.ts` |
| WA (Should) | `src/lib/notify/whatsapp.ts` |

---

## Fuera de alcance

- Push, SMS.
- Distintos límites de contacto.
- Importar conversaciones WhatsApp.

---

## Referencias

- F2 completo: [`../../fase-2/api/API-NOTIFY-01.md`](../../fase-2/api/API-NOTIFY-01.md)
- Diagrama: [`../diagrams/ARCH-NOTIFY-02.md`](../diagrams/ARCH-NOTIFY-02.md)
- Infra: [`../../comun/infra-requirements.md`](../../comun/infra-requirements.md)
