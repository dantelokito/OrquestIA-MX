# ARCH-NOTIFY-02 — Cola de notificaciones F4

> **Componente / Flujo:** Contacto y pedido → Redis rate limit → Inngest → Resend / WhatsApp  
> **Fecha:** 14/08/2026  
> **Fase:** 4 — v0.4.0  
> **Reemplaza el path async de** [`../../fase-1/diagrams/ARCH-NOTIFY-01.md`](../../fase-1/diagrams/ARCH-NOTIFY-01.md) (F2 in-process)

---

## Secuencia (contacto)

```mermaid
sequenceDiagram
  participant UI as FruteriaDetalle
  participant API as POST_contact
  participant RL as UpstashRedis
  participant DB as PostgreSQL
  participant IQ as Inngest
  participant Email as Resend

  UI->>API: POST source productIds
  API->>DB: validate Provider active
  API->>RL: incr providerId plus IP
  alt Rate limit excedido
    RL-->>API: reject
    API-->>UI: 429
  else OK
    API->>DB: writeAuditLog CONTACT
    API->>IQ: send notify_contact_requested
    API-->>UI: 200 notified true
    IQ->>Email: send with retries max 3
    alt Email OK
      Email-->>IQ: delivered
    else Fallo definitivo
      IQ->>DB: AUDIT notificationFailed
    end
  end
```

---

## Topología F4 (terceros)

```mermaid
flowchart LR
  Browser[Browser] -->|HTTPS| Next[Nextjs_API]
  Next --> PG[(PostgreSQL)]
  Next --> Redis[(Upstash_Redis)]
  Next -->|inngest_send| Inngest[Inngest]
  Inngest --> Resend[Resend]
  Inngest -->|Should| WA[WhatsApp_Cloud_API]
```

---

## Eventos Inngest

| name | Origen HTTP | Worker |
|------|-------------|--------|
| `notify/contact.requested` | `POST /api/providers/[id]/contact` | Email contacto |
| `notify/order.created` | `POST /api/orders` | Email pedido (+ WA Should) |
| `notify/order.status` | PATCH status `IN_TRANSIT` | WA cliente Should |

---

## Reglas rápidas

| Regla | Valor |
|-------|-------|
| Latencia HTTP | &lt; 200 ms |
| Rate limit store | Upstash Redis (ADR-015) |
| Retries | ≤3; luego AUDIT `notificationFailed` |
| WhatsApp | Should; no bloquea pedido |
| Path F2 `after()` | Prohibido en prod F4 |

---

## Referencias

- [`../api/API-NOTIFY-01.md`](../api/API-NOTIFY-01.md)
- [`../../comun/adrs/ADR-015-notification-queue.md`](../../comun/adrs/ADR-015-notification-queue.md)
