# API-NOTIFY-01 — Evento de contacto a frutería

> **Módulo:** `PROVIDERS` (NOTIFY)  
> **Versión:** 0.2.0  
> **Fecha:** 10/08/2026  
> **Estado:** Nuevo — Fase 2

---

## POST `/api/providers/[id]/contact`

> **Descripción:** Registra intento de contacto del cliente hacia la frutería, escribe AUDIT `CONTACT` y dispara email async al dueño (`Provider.user.email`). No bloquea el CTA `tel:` del Frontend.  
> **Autenticación:** Pública (JWT opcional — si hay sesión CLIENT, incluir `userId` en AUDIT)

#### Path Parameters:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | string (cuid) | ID del Provider |

#### Body de Solicitud (opcional):

```json
{
  "source": "call_button",
  "productIds": ["cuid1", "cuid2"]
}
```

| Campo | Tipo | Default | Validación |
|-------|------|---------|------------|
| `source` | string | `"call_button"` | `call_button` \| `whatsapp_button` \| `other` |
| `productIds` | string[] | `[]` | Max **10** cuids; IDs inexistentes se ignoran al resolver nombres |

Body vacío `{}` o ausente es válido.

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "notified": true,
    "message": "Frutería notificada"
  }
}
```

Semántica de `notified: true`: el evento se registró (AUDIT). El email puede fallar en background sin cambiar esta respuesta (ver ADR-005 / ADR-008). Si el provider no tiene email, igualmente `notified: true` + AUDIT `notificationFailed`.

* **400 Bad Request:** Validación Zod (source inválido, `productIds` no array, etc.).

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "source", "message": "Valor no permitido" }
  ]
}
```

* **404 Not Found:** Provider inexistente o `isActive=false`.

```json
{ "error": "Frutería no encontrada" }
```

* **429 Too Many Requests:** Rate limit excedido.

```json
{ "error": "Demasiados intentos. Intenta más tarde." }
```

* **500 Internal Error:** Fallos síncronos (DB AUDIT, etc.). **No** por fallo de Resend.

---

## Rate limit

| Límite | Ventana | Clave |
|--------|---------|-------|
| **5** | 10 minutos | `providerId` + IP (+ session cookie si existe) |
| **20** | 1 hora | IP |

Configurable por env (opcional): `CONTACT_RATE_LIMIT_PER_PROVIDER`, `CONTACT_RATE_LIMIT_PER_IP`.

Evaluación **antes** de escribir AUDIT de éxito y de programar email. Store: in-memory MVP ([ADR-008](../adrs/ADR-008-notification-async.md)).

---

## Side effects (orden)

1. Validar Provider activo.
2. Rate limit → 429 si excede (AUDIT opcional con `reason: "rate_limited"`).
3. Resolver nombres de `productIds` (solo productos activos ligados o globales — implementación: lookup `Product` por id; si no existe, omitir).
4. `writeAuditLog`: `module=PROVIDERS`, `action=CONTACT`, `entityId=provider.id`, `details` según [ADR-007](../adrs/ADR-007-contact-audit-action.md), `ipAddress`, `userId` opcional.
5. Schedule email async (Resend) — [ADR-005](../adrs/ADR-005-email-provider.md), [ADR-008](../adrs/ADR-008-notification-async.md).
6. Return 200.

### Contenido email (HTML simple)

| Campo | Origen |
|-------|--------|
| Nombre negocio | `Provider.businessName` |
| Timestamp | ISO UTC del evento |
| Link panel | `{NEXT_PUBLIC_APP_URL}/proveedor` |
| Productos vistos | Nombres resueltos de `productIds` |
| PII cliente | **No incluir** |

---

## NFR

| Métrica | Objetivo |
|---------|----------|
| Latencia HTTP | **&lt; 200 ms** (p95) |
| Entrega email | Best-effort &lt; 30 s; 3 reintentos |
| Envelope | ADR-003 en todos los status |

---

## Fuera de alcance

- WhatsApp Business API / envío WhatsApp desde Backend.
- `POST /api/orders`.
- Push / SMS.
- Almacenar mensaje libre del cliente.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Route | `src/app/api/providers/[id]/contact/route.ts` |
| Service | `src/lib/services/contact.service.ts` |
| Email | `src/lib/email/resend.ts` |
| Rate limit | `src/lib/rate-limit/contact.ts` |

Patrón: thin handler → Zod → service → `ok()` / `apiError()` / `handleRouteError`.

---

## Referencias

- ADR email: [`../adrs/ADR-005-email-provider.md`](../adrs/ADR-005-email-provider.md)
- ADR async: [`../adrs/ADR-008-notification-async.md`](../adrs/ADR-008-notification-async.md)
- ADR audit: [`../adrs/ADR-007-contact-audit-action.md`](../adrs/ADR-007-contact-audit-action.md)
- Diagrama: [`../diagrams/ARCH-NOTIFY-01.md`](../diagrams/ARCH-NOTIFY-01.md)
- Envelope: [`../adrs/ADR-003-error-envelope.md`](../adrs/ADR-003-error-envelope.md)
- UX: `handoff-ux-ui-fase-2.md` (toast + `tel:` paralelo)
