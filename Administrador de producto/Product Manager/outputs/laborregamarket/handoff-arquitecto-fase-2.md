# Handoff Arquitecto — LaBorregaMarket Fase 2

> **De:** Agente Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 09/08/2026  
> **Versión:** 0.2.0 (Transacciones)

---

## Objetivo

Definir arquitectura, ADRs y contratos API para notificaciones, almacenamiento de imágenes y extensión de filtros en `GET /api/providers` — **sin implementar módulo ORDERS/checkout**.

**Convención salida:** `Agente Arquitecto/outputs/laborregamarket/`

---

## Inputs

| Documento | Ubicación |
|-----------|-----------|
| PRD Fase 2 | `outputs/laborregamarket/prd-fase-2.md` |
| User stories Fase 2 | `user-stories/US-NOTIFY-*`, `US-MEDIA-*`, `US-EXPLORE-*` |
| Schema actual | `LaBorregaMarket/prisma/schema.prisma` |
| API PROVIDERS existente | `api/API-PROVIDERS-01.md` |
| ADR-003 envelope | `adrs/ADR-003-error-envelope.md` |

---

## Decisiones requeridas (ADRs propuestos)

| ADR | Tema | Opciones | Recomendación PM |
|-----|------|----------|------------------|
| ADR-005 | Proveedor email | Resend / SendGrid / SMTP | Resend o SendGrid |
| ADR-006 | Storage imágenes | Cloudinary vs S3+CloudFront | Cloudinary MVP |
| ADR-007 | Evento contacto | Nuevo `AuditAction.CONTACT` vs VIEW | CONTACT dedicado |
| ADR-008 | Notificación async | Queue in-process vs worker | In-process MVP + queue Fase 3 |

---

## Contratos API a documentar

### API-NOTIFY-01 — Evento de contacto

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/providers/[id]/contact` | Público (opcional CLIENT) | Registra contacto, dispara email async |

**Request body (opcional):**
```json
{ "source": "call_button", "productIds": ["cuid1"] }
```

**Response 200:**
```json
{ "data": { "notified": true, "message": "Frutería notificada" } }
```

**NFR:**
- Respuesta < 200ms (email en background)
- Rate limit: 5/proveedor/10min por IP/sesión (US-NOTIFY-05)
- No PII cliente en email por defecto

---

### API-MEDIA-01 — Upload imágenes

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/provider/media` | PROVIDER | Upload logo o cover (multipart) |
| POST | `/api/admin/products/[id]/image` | ADMIN | Upload imagen producto |

**Validación:** JPEG/PNG/WebP, max 5MB, dimensiones max documentadas.

**Response:**
```json
{ "data": { "url": "https://...", "field": "logoUrl" } }
```

**NFR:** Purge recurso anterior al reemplazar; HTTPS URLs only.

---

### API-PROVIDERS-01 — Extensiones filtros

Extender `GET /api/providers`:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `category` | `FRUTA` \| `VERDURA` \| `AGRICOLA` | Proveedores con producto activo en categoría |
| `q` | string | Búsqueda negocio o producto (min 2 chars) |
| `verified` | boolean | Ya existente — documentar |
| `city` | string | Ya existente |

**Índices:** evaluar join ProviderProduct + Product.category para performance < 2s.

---

## Requerimientos no funcionales

| Área | Requerimiento |
|------|---------------|
| Notificaciones | Async; 3 reintentos email; log fallo en AUDIT |
| Email templates | HTML simple: negocio, timestamp, link panel, productos vistos |
| Storage | 5MB max; signed/public URLs; env vars documentadas |
| Seguridad | PROVIDER solo su Provider; ADMIN solo Product global |
| Privacidad | Sin teléfono cliente en email sin opt-in |
| Observabilidad | AUDIT CONTACT + MEDIA_UPLOAD |

---

## Dependencias Sprint 0

Cerrar antes de Fase 2 build:
- OBS-001 envelope `/api/catalogs`
- OBS-003 `product.service.ts`

---

## Entregables esperados Arquitecto

1. `adrs/ADR-005-email-provider.md`
2. `adrs/ADR-006-image-storage.md`
3. `api/API-NOTIFY-01.md`
4. `api/API-MEDIA-01.md`
5. Actualización `api/API-PROVIDERS-01.md` (category, q)
6. `handoff-backend-fase-2.md`
7. Actualización `OBSERVABILITY.md` arquitecto

---

## Fuera de alcance

- `POST /api/orders`, pagos, WhatsApp Business API
- Push notifications, SMS
- Nuevos campos Order en schema

---

*Handoff PM Fase 2 — LaBorregaMarket v0.2.0*
