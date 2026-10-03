# ARCH-NOTIFY-01 — Flujo de contacto y email async

> **Componente / Flujo:** Contacto cliente → AUDIT CONTACT → Resend async  
> **Fecha:** 10/08/2026  
> **Fase:** 2 — v0.2.0

---

## Secuencia

```mermaid
sequenceDiagram
  participant UI as FruteriaDetalle
  participant API as POST_contact
  participant RL as RateLimit
  participant Svc as contact_service
  participant DB as PostgreSQL
  participant Email as Resend

  UI->>UI: tel_link_parallel
  UI->>API: POST body source productIds
  API->>Svc: validate provider active
  alt Provider inactivo o inexistente
    Svc-->>API: 404
    API-->>UI: error Fruteria no encontrada
  else OK
    API->>RL: check IP y providerId
    alt Rate limit excedido
      RL-->>API: reject
      API->>DB: optional AUDIT rate_limited
      API-->>UI: 429
    else Dentro de limite
      API->>DB: writeAuditLog CONTACT
      API->>Email: schedule send after response
      API-->>UI: 200 notified true
      Note over Email: async retries max 3
      alt Email OK
        Email-->>Email: delivered
      else Sin email o fallo
        Email->>DB: AUDIT notificationFailed
      end
    end
  end
```

---

## Topología Fase 2 (terceros)

```mermaid
flowchart LR
  Client[Cliente_web] -->|POST_contact| API[Next_API_Routes]
  Client -->|POST_multipart| API
  Client -->|GET_providers| API
  API --> PG[(PostgreSQL)]
  API -->|async_email| Resend[Resend]
  API -->|upload_purge| Cloudinary[Cloudinary]
  API -->|AUDIT| PG
```

---

## Reglas rápidas

| Regla | Valor |
|-------|-------|
| Latencia HTTP | &lt; 200 ms |
| Auth | Público; JWT opcional |
| Destinatario | `Provider.user.email` |
| PII cliente | No en email ni AUDIT |
| WhatsApp | Solo Frontend `wa.me` |

---

## Referencias

- [`../api/API-NOTIFY-01.md`](../api/API-NOTIFY-01.md)
- [`../adrs/ADR-005-email-provider.md`](../adrs/ADR-005-email-provider.md)
- [`../adrs/ADR-007-contact-audit-action.md`](../adrs/ADR-007-contact-audit-action.md)
- [`../adrs/ADR-008-notification-async.md`](../adrs/ADR-008-notification-async.md)
