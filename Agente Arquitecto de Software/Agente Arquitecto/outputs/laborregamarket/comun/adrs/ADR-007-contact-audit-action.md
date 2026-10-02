# ADR-007 — Acciones de auditoría CONTACT y MEDIA_UPLOAD

> **Estado:** Aceptado  
> **Fecha:** 10/08/2026  
> **Decisores:** Arquitecto de Software  
> **Fase:** 2 — Transacciones (v0.2.0)

---

## Contexto

Fase 2 necesita trazabilidad de:

1. Eventos de contacto cliente → frutería (RF-NOTIFY-02).
2. Uploads de imágenes (RF-MEDIA / BL-036).

El enum `AuditAction` actual (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `ENABLE`, `DISABLE`, `VIEW`) no expresa bien "contacto" ni "upload de media". Reutilizar `VIEW` mezclaría analytics de lectura con intención de contacto comercial.

No se crea tabla `Contact` ni `Notification` en Fase 2: **AuditLog es la fuente de verdad** del evento.

## Decisión

Extender el enum Prisma `AuditAction` con:

| Valor | Uso |
|-------|-----|
| `CONTACT` | Cliente (o anónimo) inicia contacto hacia un Provider |
| `MEDIA_UPLOAD` | Upload exitoso de logo, cover o imagen de producto |

### Mapeo módulo × acción

| Evento | `SystemModule` | `AuditAction` | `entityId` |
|--------|----------------|---------------|------------|
| Contacto | `PROVIDERS` | `CONTACT` | `provider.id` |
| Logo / cover | `PROVIDERS` | `MEDIA_UPLOAD` | `provider.id` |
| Imagen producto | `PRODUCTS` | `MEDIA_UPLOAD` | `product.id` |

### Shape `details` — CONTACT

```json
{
  "source": "call_button",
  "productIds": ["cuid1"],
  "productNames": ["Mango"],
  "rateLimited": false,
  "notificationFailed": false,
  "reason": null
}
```

| Campo | Tipo | Notas |
|-------|------|-------|
| `source` | string | `call_button` \| `whatsapp_button` \| `other` |
| `productIds` | string[] | Opcional; max 10 |
| `productNames` | string[] | Resueltos server-side para email/AUDIT |
| `rateLimited` | boolean | `true` si se registró intento bloqueado (opcional en 429) |
| `notificationFailed` | boolean | Email no enviado |
| `reason` | string \| null | `no_email` \| `send_failed` \| `email_disabled` \| `rate_limited` |

**Prohibido en `details`:** teléfono, email o nombre del cliente.

`userId`: sesión CLIENT si existe; `null` si público anónimo.  
`ipAddress`: capturar cuando esté disponible (rate limit + forense).

### Shape `details` — MEDIA_UPLOAD

```json
{
  "field": "logoUrl",
  "url": "https://res.cloudinary.com/.../logo.jpg",
  "bytes": 120456,
  "mimeType": "image/jpeg",
  "replacedPrevious": true
}
```

### Migración

```prisma
enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  ENABLE
  DISABLE
  VIEW
  CONTACT
  MEDIA_UPLOAD
}
```

Actualizar seeds/catálogos admin que listen acciones si aplica.

## Alternativas consideradas

### A) Reutilizar `VIEW` para contacto

- **Pros:** Sin migración de enum.
- **Contras:** Semántica confusa; filtros admin inútiles; PM recomienda CONTACT dedicado.

### B) Tabla `ContactEvent` aparte

- **Pros:** Queries dedicadas.
- **Contras:** Duplica AuditLog; fuera de alcance MVP.

### C) Solo log de aplicación (console)

- **Pros:** Cero schema.
- **Contras:** No cumple RF-NOTIFY-02 ni visibilidad admin.

## Consecuencias

### Positivas

- Filtros admin claros: `?action=CONTACT` / `?action=MEDIA_UPLOAD`.
- Sin PII cliente en bitácora por defecto.
- Compatible con `writeAuditLog()` existente.

### Negativas

- Migración Prisma obligatoria antes de endpoints Fase 2.
- `VIEW` queda sin uso inmediato (aceptable).

## Referencias

- Modelo: [`../data-model/DB-audit-permissions.md`](../data-model/DB-audit-permissions.md)
- API: [`../api/API-NOTIFY-01.md`](../api/API-NOTIFY-01.md), [`../api/API-MEDIA-01.md`](../api/API-MEDIA-01.md)
- Helper: `LaBorregaMarket/src/lib/audit.ts`
