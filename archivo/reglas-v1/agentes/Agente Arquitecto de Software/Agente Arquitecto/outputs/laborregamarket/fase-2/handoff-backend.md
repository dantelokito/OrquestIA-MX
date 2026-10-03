# Handoff Backend Developer — LaBorregaMarket Fase 2 (v0.2.0)

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 10/08/2026  
> **Prioridad:** Implementar NOTIFY, MEDIA y extensión EXPLORE según contratos  
> **Decisión producto:** Contacto directo — **NO** implementar `POST /api/orders` ni checkout

---

## Estado: ENTERADO ✅

La arquitectura Fase 2 está documentada. Puedes iniciar implementación tras **verificar Sprint 0** (OBS-001 envelope catalogs, OBS-003 `product.service`).

**Punto de entrada:** [`OBSERVABILITY.md`](./OBSERVABILITY.md)

---

## Dependencia Sprint 0 (bloquear build Fase 2 si abierto)

| ID | Item | Criterio done |
|----|------|---------------|
| OBS-001 / BL-S0-01 | Envelope ADR-003 en `/api/catalogs` | `ok()` / `apiError()` |
| OBS-003 / BL-S0-03 | Lógica productos en servicio | `lib/services/product.service.ts` |

OBS-002 (aliases catálogos) y OBS-004 (permiso por módulo) recomendados; no bloquean NOTIFY/MEDIA si ya están en código.

---

## Orden de implementación Fase 2

```
0. Verificar Sprint 0 (OBS-001, OBS-003)
1. Migración Prisma AuditAction += CONTACT, MEDIA_UPLOAD
2. BL-NOTIFY — POST /api/providers/[id]/contact + rate limit + Resend + AUDIT
3. BL-MEDIA — Cloudinary + POST /api/provider/media + POST /api/admin/products/[id]/image
4. BL-EXPLORE — Extender listProviders: category, q (producto), imageUrl en detalle
5. Should — templates HTML email, AUDIT MEDIA_UPLOAD (si no en paso 3), env .env.example
```

Mapeo backlog PM aproximado: BL-021…024 (NOTIFY), BL-025…027 (MEDIA), BL-028…032 (EXPLORE), BL-033…036 (Should).

---

### Detalle por bloque

#### 0 — Sprint 0

| Tarea | Referencia |
|-------|------------|
| Confirmar catalogs + product.service | [`OBSERVABILITY.md`](./OBSERVABILITY.md) auditoría 08/08 |

#### 1 — Migración AuditAction

| Tarea | Referencia |
|-------|------------|
| `CONTACT`, `MEDIA_UPLOAD` en enum | [`adrs/ADR-007-contact-audit-action.md`](./adrs/ADR-007-contact-audit-action.md) |
| Actualizar [`data-model/DB-audit-permissions.md`](./data-model/DB-audit-permissions.md) | — |

```bash
npx prisma migrate dev --name add_audit_contact_media_upload
```

#### 2 — NOTIFY (P0)

| Tarea | Referencia |
|-------|------------|
| `POST /api/providers/[id]/contact` | [`api/API-NOTIFY-01.md`](./api/API-NOTIFY-01.md) |
| Rate limit 5/10min + 20/IP/h | ADR-008 |
| Email Resend async (`after()`) | ADR-005, ADR-008 |
| AUDIT CONTACT + shapes details | ADR-007 |
| NFR respuesta &lt; 200ms | API-NOTIFY-01 |

**Sugerencia:** `lib/services/contact.service.ts`, `lib/email/resend.ts`, `lib/rate-limit/contact.ts`.

#### 3 — MEDIA (P0)

| Tarea | Referencia |
|-------|------------|
| `POST /api/provider/media` | [`api/API-MEDIA-01.md`](./api/API-MEDIA-01.md) |
| `POST /api/admin/products/[id]/image` | API-MEDIA-01 |
| Cloudinary upload + purge | ADR-006 |
| Validación 5MB JPEG/PNG/WebP | API-MEDIA-01 |
| AUDIT MEDIA_UPLOAD | ADR-007 |

**Sugerencia:** `lib/services/media.service.ts`, `lib/storage/cloudinary.ts`. Deps: `cloudinary`, `resend`.

#### 4 — EXPLORE (P0)

| Tarea | Referencia |
|-------|------------|
| Query `category` FRUTA\|VERDURA\|AGRICOLA | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) |
| Extender `q` (min 2) a productos activos | API-PROVIDERS-01 |
| Incluir `imageUrl` en productos detalle | API-PROVIDERS-01 / DB-products |
| NFR lista filtrada &lt; 2s | — |

**Sugerencia:** extender `lib/services/provider.service.ts` → `listProviders`.

#### 5 — Should

| Tarea | Referencia |
|-------|------------|
| Template HTML email | ADR-005 |
| Extender `.env.example` | [`infra-requirements.md`](./infra-requirements.md) |

---

## Estructura de código sugerida

```
src/
├── app/api/
│   ├── providers/
│   │   ├── route.ts              (extender filtros)
│   │   ├── [id]/route.ts
│   │   └── [id]/contact/route.ts (nuevo)
│   ├── provider/
│   │   ├── media/route.ts        (nuevo)
│   │   └── ...
│   └── admin/
│       └── products/[id]/image/route.ts (nuevo)
├── lib/
│   ├── services/
│   │   ├── contact.service.ts
│   │   ├── media.service.ts
│   │   └── provider.service.ts   (extender)
│   ├── email/
│   │   └── resend.ts
│   ├── storage/
│   │   └── cloudinary.ts
│   └── rate-limit/
│       └── contact.ts
```

---

## Envelope estándar (obligatorio)

Ver [`adrs/ADR-003-error-envelope.md`](./adrs/ADR-003-error-envelope.md). Helpers existentes: `lib/api/response.ts` (`ok`, `paginated`, `apiError`, `handleRouteError`).

Incluir **429** en contacto:

```json
{ "error": "Demasiados intentos. Intenta más tarde." }
```

---

## Validaciones Zod / multipart

| Campo | Regla | Endpoint |
|-------|-------|----------|
| `source` | enum call_button\|whatsapp_button\|other | POST contact |
| `productIds` | string[] max 10 | POST contact |
| `q` | min 2 si presente | GET providers |
| `category` | FRUTA\|VERDURA\|AGRICOLA | GET providers |
| `file` | JPEG/PNG/WebP, max 5MB | MEDIA |
| `field` | logo\|cover | POST provider/media |

---

## Eventos AuditLog Fase 2

| Módulo | Acción | Trigger |
|--------|--------|---------|
| PROVIDERS | CONTACT | POST contact (éxito o rate_limited) |
| PROVIDERS | MEDIA_UPLOAD | POST provider/media |
| PRODUCTS | MEDIA_UPLOAD | POST admin products image |

Shapes `details`: ADR-007.

---

## Variables de entorno

Ver [`infra-requirements.md`](./infra-requirements.md): `RESEND_*`, `EMAIL_FROM`, `CLOUDINARY_*`, `NEXT_PUBLIC_APP_URL`.

---

## Qué NO implementar en Fase 2

- `POST /api/orders`, checkout, pagos, cambios al modelo Order
- WhatsApp Business API / Twilio
- Push / SMS
- Cola Redis / worker email (Fase 3)
- Filtro por distancia/radio
- Galerías multi-imagen
- Versionado `/api/v1/`

---

## Checklist DoD Backend Fase 2

- [ ] Sprint 0 verificado (OBS-001, OBS-003)
- [ ] Migración `CONTACT` / `MEDIA_UPLOAD` aplicada
- [ ] `POST .../contact` &lt; 200ms; email async; rate limit 429
- [ ] Uploads MEDIA con ownership + purge + envelope
- [ ] `GET /api/providers` con `category` + `q` producto; detalle con `imageUrl`
- [ ] Sin PII cliente en email/AUDIT
- [ ] Thin controllers → services
- [ ] Errores 400/401/403/404/429/500 con `{ error, details? }`

---

## Referencias cruzadas

| Documento | Ubicación |
|-----------|-----------|
| Hub | [`OBSERVABILITY.md`](./OBSERVABILITY.md) |
| SAD | [`sad.md`](./sad.md) |
| NOTIFY | [`api/API-NOTIFY-01.md`](./api/API-NOTIFY-01.md) |
| MEDIA | [`api/API-MEDIA-01.md`](./api/API-MEDIA-01.md) |
| PROVIDERS | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) |
| ADR-005…008 | [`adrs/`](./adrs/) |
| Diagrama | [`diagrams/ARCH-NOTIFY-01.md`](./diagrams/ARCH-NOTIFY-01.md) |
| Infra | [`infra-requirements.md`](./infra-requirements.md) |
| Handoff F1 | [`handoff-backend.md`](./handoff-backend.md) |
| Código | `C:\Users\PC GAMER\LaBorregaMarket` |

---

*Handoff generado por Agente Arquitecto de Software — LaBorregaMarket v0.2.0.*
