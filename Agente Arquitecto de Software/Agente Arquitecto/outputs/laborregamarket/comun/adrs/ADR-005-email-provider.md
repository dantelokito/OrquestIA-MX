# ADR-005 — Proveedor de email transaccional (Resend)

> **Estado:** Aceptado  
> **Fecha:** 10/08/2026  
> **Decisores:** Arquitecto de Software  
> **Fase:** 2 — Transacciones (v0.2.0)

---

## Contexto

Fase 2 requiere notificar al proveedor por email cuando un cliente inicia contacto desde `/fruteria/[id]` (`POST /api/providers/[id]/contact`). No hay SMTP propio ni librería de correo en el monolito actual.

Requisitos PM (D-F2-1, D-F2-4):

- Proveedor SaaS (no SMTP self-hosted en MVP).
- Email sin PII del cliente por defecto.
- Entrega objetivo &lt; 30s; reintentos ante fallo transitorio.
- Fallo de envío no debe romper la respuesta HTTP al cliente.

## Decisión

Usar **Resend** como proveedor de email transaccional en Fase 2.

### Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `RESEND_API_KEY` | Sí (prod/staging) | API key Resend |
| `EMAIL_FROM` | Sí | Remitente verificado (ej. `La Borrega Market <noreply@tudominio.com>`) |

### Comportamiento

| Aspecto | Regla |
|---------|-------|
| Destinatario | `Provider.user.email` (relación User del dueño) |
| Sin email / inválido | No llamar Resend; AUDIT con `notificationFailed: true`, `reason: "no_email"` |
| Reintentos | Hasta **3** intentos con backoff exponencial corto (ej. 0s / 1s / 2s) |
| Fallo definitivo | AUDIT `details.notificationFailed: true`, `reason: "send_failed"` + mensaje proveedor; **no** 5xx al cliente |
| Template | HTML simple: `businessName`, timestamp ISO, link panel (`NEXT_PUBLIC_APP_URL/proveedor`), lista de productos vistos (nombres) |
| Privacidad | **Prohibido** incluir teléfono, email o nombre del cliente sin opt-in explícito |

### Ubicación código sugerida

- `src/lib/email/resend.ts` — cliente + `sendContactNotification(...)`
- Invocado desde flujo async (ver [ADR-008](./ADR-008-notification-async.md))

## Alternativas consideradas

### A) SendGrid

- **Pros:** Maduro, deliverability alta, plantillas.
- **Contras:** DX más pesada para MVP Next.js; más superficie de configuración.

### B) SMTP propio (Nodemailer + servidor)

- **Pros:** Control total.
- **Contras:** Operación, SPF/DKIM, spam; fuera de alcance MVP (decisión PM).

### C) Diferir email a Fase 3

- **Pros:** Menos integración ahora.
- **Contras:** Bloquea RF-NOTIFY-01 (Must).

## Consecuencias

### Positivas

- Integración HTTP simple; encaja con monolito Next.js.
- Secretos acotados a dos env vars.
- Separación clara: fallo de email ≠ fallo de contacto (AUDIT + UX toast).

### Negativas

- Dependencia de tercero (cuota Resend, dominio verificado).
- En local sin `RESEND_API_KEY`: modo no-op documentado (log + AUDIT `reason: "email_disabled"`).

## Referencias

- Contrato: [`../api/API-NOTIFY-01.md`](../api/API-NOTIFY-01.md)
- Async: [`ADR-008-notification-async.md`](./ADR-008-notification-async.md)
- Audit: [`ADR-007-contact-audit-action.md`](./ADR-007-contact-audit-action.md)
- Infra: [`../infra-requirements.md`](../infra-requirements.md)
