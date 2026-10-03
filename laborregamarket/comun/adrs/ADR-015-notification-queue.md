# ADR-015 — Cola de notificaciones (Upstash Redis + Inngest)

> **Estado:** Aceptado  
> **Fecha:** 2026-08-14  
> **Decisores:** Arquitecto de Software  
> **Fase:** 4 — v0.4.0  
> **Reemplaza:** [ADR-008](./ADR-008-notification-async.md)

---

#### 1. Contexto y Problema:

ADR-008 enviaba email fire-and-forget in-process (`after()`) y guardaba el rate limit de contacto en un `Map` en memoria. En Vercel serverless el isolate puede cortar el trabajo background (cold start) y cada instancia tiene su propio contador: se pierden emails y el 429 no es global. US-NOTIFY-06/07 exigen cola persistente con reintentos ≤3 y rate limit distribuido, manteniendo HTTP &lt; 200 ms. PM pide Redis/Upstash + worker (BullMQ o equivalente ligero). El monolito se despliega en Vercel: no hay proceso Node persistente.

---

#### 2. Opciones Consideradas:

* **Opción A — BullMQ + Redis + worker dedicado (Railway/Fly):** Pros: cola clásica, retries nativos, alineado al wording PM. Contras: segundo runtime que operar; no encaja en el deploy Vercel actual; el worker también puede caer.
* **Opción B — Upstash Redis (REST) + Inngest (jobs):** Pros: rate limit global vía REST (sin TCP persistente); Inngest corre en serverless con retries, firma de eventos y dashboard; equivalente ligero a BullMQ para Next.js App Router. Contras: dos SaaS; Inngest no es Redis.
* **Opción C — Upstash QStash solo:** Pros: un vendor. Contras: menos DX de funciones/retries que Inngest; rate limit igual necesitaría Redis aparte.

---

#### 3. Decisión Elegida:

**Opción B.** Upstash Redis para rate limit distribuido; Inngest como worker de notificaciones.

### Rate limit (mismos umbrales ADR-008)

| Límite | Ventana | Clave Redis |
|--------|---------|-------------|
| 5 contactos | 10 min | `rl:contact:p:{providerId}:{ip}` |
| 20 contactos | 1 hora | `rl:contact:ip:{ip}` |

Store: `@upstash/redis` (REST). Evaluación **síncrona antes** del 200. El SDK se importa **en estático** en `src/lib/rate-limit/contact.ts`. El paquete **debe** estar en `package.json` y el lockfile (DEV-P0-001); si falta, el módulo no resuelve y el fallback in-memory **no se ejecuta**. **Prohibido** convertir el import a dinámico “para que compile sin Redis”: el contrato de producción es Redis real + 503 fail-closed. 429 envelope ADR-003:

```json
{ "error": "Demasiados intentos. Intenta más tarde." }
```

Si Upstash no está configurado en local: fallback in-memory + log `reason: "redis_disabled"` (solo `development`). Staging/prod **requieren** Redis.

### Cola / jobs Inngest

El handler HTTP:

1. Valida + rate limit + persiste AUDIT (sync).
2. `inngest.send({ name, data })` (no espera a Resend).
3. Responde 200 `{ notified: true }` (&lt; 200 ms).

| Evento | Trigger | Job | Must/Should |
|--------|---------|-----|-------------|
| `notify/contact.requested` | `POST /contact` | Email Resend (ADR-005) | Must |
| `notify/order.created` | `POST /api/orders` | Email nuevo pedido al proveedor | Must |
| `notify/order.status` | Transición `PENDING` / `IN_TRANSIT` | WhatsApp Cloud API (opt-in) | Should |

Retries Inngest: **máximo 3**. Tras agotar: segundo `AuditLog` con `details.notificationFailed: true` (mismo `entityId`, patrón ADR-007/008). Sin reintentos infinitos.

Ruta serve: `src/app/api/inngest/route.ts` (handler oficial Inngest Next.js).

### Qué NO hacer

- BullMQ / worker Node persistente en este deploy.
- `after(() => sendEmail)` como camino de producción (queda histórico F2/F3).
- Bloquear la respuesta HTTP esperando Resend o WhatsApp.
- `import()` dinámico de `@upstash/redis` para ocultar un lockfile incompleto.

---

#### 4. Consecuencias e Impacto:

* **Positivas:** Emails sobreviven cold start; rate limit consistente entre instancias; mismo envelope HTTP que F2; camino claro a WhatsApp Should sobre los mismos eventos.
* **Riesgos / Compensaciones:** Dependencia Inngest + Upstash; DevOps debe provisionar keys. Costo SaaS bajo en volumen MVP. Fallback in-memory solo en local — no documentar como comportamiento de prod. Si el paquete no está en el lockfile, ADR-015 no es ejecutable (contacto 500; DEV-P0-001).

## Referencias

- US-NOTIFY-06, US-NOTIFY-07, US-NOTIFY-08
- Email: [`ADR-005-email-provider.md`](./ADR-005-email-provider.md)
- Async histórico: [`ADR-008-notification-async.md`](./ADR-008-notification-async.md)
- Contrato delta: [`../../fase-4/api/API-NOTIFY-01.md`](../../fase-4/api/API-NOTIFY-01.md)
- Diagrama: [`../../fase-4/diagrams/ARCH-NOTIFY-02.md`](../../fase-4/diagrams/ARCH-NOTIFY-02.md)
- Infra: [`../infra-requirements.md`](../infra-requirements.md)
