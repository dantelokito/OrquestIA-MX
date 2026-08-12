# ADR-008 — Notificación de contacto asíncrona in-process

> **Estado:** Aceptado  
> **Fecha:** 10/08/2026  
> **Decisores:** Arquitecto de Software  
> **Fase:** 2 — Transacciones (v0.2.0)

---

## Contexto

NFR de contacto: respuesta HTTP **&lt; 200 ms** mientras el email al proveedor puede tardar segundos (Resend + reintentos). Una cola Redis/worker aumenta infra (fuera de MVP). Decisión PM D-F2-5 / recomendación handoff: in-process en Fase 2; worker en Fase 3.

## Decisión

Implementar envío de email en **modo fire-and-forget in-process** después de:

1. Validar Provider activo.
2. Pasar rate limit (o rechazar 429 **antes** de async).
3. Persistir `AuditLog` CONTACT (síncrono).
4. Programar envío email **sin await** en el path de respuesta (p.ej. `after()` de Next.js App Router, o patrón equivalente que no bloquee el `Response`).

### Flujo

```
POST /contact
  → validate + rate limit
  → writeAuditLog(CONTACT)     // sync
  → schedule sendEmail(...)    // async, no bloquea
  → 200 { notified: true }     // < 200ms
       └─ background: Resend × ≤3
            └─ on fail: update/extra AUDIT o log details.notificationFailed
```

### Actualización de fallo email

Preferencia: segundo `writeAuditLog` con `CONTACT` (o `UPDATE` no — mantener CONTACT) y `details.notificationFailed: true`, **o** enriquecer el mismo registro si el helper soporta update por id. Documentar en implementación: si solo create-once, emitir **segundo** AuditLog CONTACT con `reason` de fallo (mismo `entityId`).

### Rate limit (síncrono, antes del 200)

| Límite | Ventana | Clave |
|--------|---------|-------|
| 5 contactos | 10 min | `providerId` + IP (y sessionId si hay cookie) |
| 20 contactos | 1 hora | IP |

Store MVP: **Map in-memory** en el proceso Node (aceptable single-instance Vercel fluid/serverless con best-effort; documentar pérdida en cold start). Redis/Upstash → Fase 3.

429 envelope ADR-003:

```json
{ "error": "Demasiados intentos. Intenta más tarde." }
```

Side effect opcional: AUDIT CONTACT con `rateLimited: true`, `reason: "rate_limited"` (sin email).

### Qué NO hacer en Fase 2

- Bull/BullMQ, SQS, Inngest, workers separados.
- Bloquear respuesta esperando Resend.
- WhatsApp Business API (solo `wa.me` en Frontend).

## Alternativas consideradas

### A) Cola + worker desde día 1

- **Pros:** Confiabilidad, retries persistentes.
- **Contras:** Infra y ops; PM pospone a Fase 3.

### B) Await email en el handler

- **Pros:** Simplicidad.
- **Contras:** Viola NFR &lt; 200ms; UX lenta.

### C) Solo AUDIT, email manual admin

- **Pros:** Cero integración.
- **Contras:** No cumple RF-NOTIFY-01.

## Consecuencias

### Positivas

- Cumple latencia percibida del CTA "Llamar".
- Cero infra nueva.
- Camino claro a cola en Fase 3 (mismo `contact.service` / puerto email).

### Negativas

- En serverless, trabajo background puede truncarse si la plataforma corta el isolate; mitigar con `after()` y reintentos cortos; aceptar best-effort MVP.
- Rate limit in-memory no es global multi-instancia.

## Referencias

- Email: [`ADR-005-email-provider.md`](./ADR-005-email-provider.md)
- Audit: [`ADR-007-contact-audit-action.md`](./ADR-007-contact-audit-action.md)
- Contrato: [`../api/API-NOTIFY-01.md`](../api/API-NOTIFY-01.md)
- Diagrama: [`../diagrams/ARCH-NOTIFY-01.md`](../diagrams/ARCH-NOTIFY-01.md)
