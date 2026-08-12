# OBSERVABILITY — LaBorregaMarket (Backend Developer)

> Bitácora de implementación backend: endpoints, variables de entorno, ejecución y restricciones técnicas.  
> **Fuente de verdad de arquitectura:** `Agente Arquitecto de Software/.../outputs/laborregamarket/OBSERVABILITY.md`  
> **Handoff Arquitecto F2:** `handoff-backend-fase-2.md`

---

## Metadatos

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket |
| **Versión backend** | 0.2.0 (NOTIFY + MEDIA + EXPLORE) |
| **Fecha** | 10/08/2026 |
| **Agente** | Backend Developer |
| **Estado fase** | ✅ Fase 2 verificada, alineada a contratos y documentada |
| **Código base** | `C:\Users\PC GAMER\LaBorregaMarket` |

---

## Variables de entorno requeridas

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `DATABASE_URL` | Sí | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/laborregamarket` |
| `JWT_SECRET` | Sí | Secreto JWT (min 32 chars) | `your-super-secret-key-min-32-chars` |
| `NODE_ENV` | Sí | Entorno de ejecución | `development` / `production` |
| `NEXT_PUBLIC_APP_URL` | Sí (F2 email) | Base URL para link panel en email | `http://localhost:8080` |
| `RESEND_API_KEY` | No (F2) | Sin key → no-op email + AUDIT `email_disabled` | — |
| `EMAIL_FROM` | Con Resend | Remitente Resend | `La Borrega Market <noreply@…>` |
| `CLOUDINARY_CLOUD_NAME` | MEDIA | Cloudinary cloud | — |
| `CLOUDINARY_API_KEY` | MEDIA | API key | — |
| `CLOUDINARY_API_SECRET` | MEDIA | API secret | — |
| `CONTACT_RATE_LIMIT_PER_PROVIDER` | No | Default `5` / 10 min | `5` |
| `CONTACT_RATE_LIMIT_PER_IP` | No | Default `20` / 1 h | `20` |

Referencia: `LaBorregaMarket/.env.example`

---

## Instrucciones de ejecución

```bash
cd C:\Users\PC GAMER\LaBorregaMarket
npm install
npx prisma migrate dev    # Incluye CONTACT / MEDIA_UPLOAD
npx prisma db seed
npm run dev               # http://localhost:8080
```

### Cuentas demo (seed)

| Rol | Email | Password |
|-----|-------|----------|
| CLIENT | `cliente@demo.mx` | `Demo1234!` |
| PROVIDER | `frutas@elparaiso.mx` | `Demo1234!` |
| ADMIN | `admin@laborregamarket.mx` | `Demo1234!` |

---

## Envelope estándar (ADR-003)

```json
// Éxito
{ "data": { ... } }

// Éxito paginado
{ "data": [], "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 } }

// Error
{ "error": "Mensaje", "details": [{ "field": "email", "message": "..." }] }
```

Cookie JWT `httpOnly`, `sameSite=lax`, `maxAge=7 días`.

---

## Endpoints implementados

### AUTH (público / sesión)

| Método | Ruta | Auth | Rol | Envelope éxito |
|--------|------|------|-----|----------------|
| POST | `/api/auth/login` | Pública | — | `{ data: { user } }` |
| POST | `/api/auth/register` | Pública | — | `{ data: { user } }` (201) |
| POST | `/api/auth/logout` | Opcional | — | `{ data: { message } }` |

### PROVIDERS / EXPLORE (F1 + F2)

| Método | Ruta | Auth | Rol | Envelope éxito |
|--------|------|------|-----|----------------|
| GET | `/api/providers` | Pública | — | `{ data, meta }` |
| GET | `/api/providers/[id]` | Pública | — | `{ data }` (productos con `imageUrl`) |
| POST | `/api/providers` | JWT | PROVIDER | `{ data }` (201) |
| POST | `/api/providers/[id]/contact` | Pública (JWT CLIENT opcional) | — | `{ data: { notified, message } }` |

**Query GET list (F2):** `city`, `q` (min 2; businessName \| description \| producto activo), `category` (`FRUTA`\|`VERDURA`\|`AGRICOLA`), `verified`, `page`, `limit` (max 50).  
**AND** entre filtros. `q` de 1 char → 400. Category inválida → 400.  
**Filtro fijo:** `isActive=true`.

### NOTIFY (F2)

| Comportamiento | Detalle |
|----------------|---------|
| Email | Resend async vía `after()`; HTML template; ≤3 retries; sin PII cliente |
| Rate limit | 5 / 10 min por provider+IP(+session); 20 / h por IP → **429** |
| AUDIT | `PROVIDERS` + `CONTACT`; shapes ADR-007 (`rate_limited`, `no_email`, `email_disabled`, `send_failed`) |
| Sin email válido | `notified: true` + AUDIT `notificationFailed` / `no_email` (sin error al cliente) |

### MEDIA (F2)

| Método | Ruta | Auth | Rol | Body |
|--------|------|------|-----|------|
| POST | `/api/provider/media` | JWT | PROVIDER | multipart `file` + `field` (`logo`\|`cover`) |
| POST | `/api/admin/products/[id]/image` | JWT | ADMIN | multipart `file` |

Validación: JPEG/PNG/WebP, max 5MB. Purge Cloudinary al reemplazar. AUDIT `MEDIA_UPLOAD`.

### PROVIDER panel

| Método | Ruta | Auth | Rol | Envelope éxito |
|--------|------|------|-----|----------------|
| GET | `/api/provider/me` | JWT | PROVIDER | `{ data }` |
| GET | `/api/provider/products` | JWT | PROVIDER | `{ data: { provider, catalog } }` |
| PATCH | `/api/provider/products` | JWT | PROVIDER | `{ data: { providerProduct } }` |

### USERS (cuenta cliente)

| Método | Ruta | Auth | Rol | Envelope éxito |
|--------|------|------|-----|----------------|
| GET | `/api/users/me` | JWT | CLIENT | `{ data }` |
| PATCH | `/api/users/me` | JWT | CLIENT | `{ data }` |

### ADMIN

| Método | Ruta | Auth | Rol | Envelope éxito |
|--------|------|------|-----|----------------|
| GET | `/api/catalogs` | JWT | ADMIN | `{ data }` / `{ data: { catalogs } }` |
| GET | `/api/admin/providers` | JWT | ADMIN | `{ data, meta }` (+ `hasValidEmail` F2) |
| PATCH | `/api/admin/providers/[id]` | JWT | ADMIN | `{ data }` |
| GET | `/api/admin/audit` | JWT | ADMIN | `{ data, meta }` (filtro `action=CONTACT`\|`MEDIA_UPLOAD`) |

---

## Breaking changes para Frontend

| Endpoint | Antes (F1) | Ahora (F2) |
|----------|------------|------------|
| `GET /api/providers` | sin `category`; `q` solo nombre/desc | `category` + `q` también en productos; `sampleProducts[].imageUrl` |
| `GET /api/providers/[id]` | productos sin `imageUrl` | `products[].imageUrl` nullable |
| `GET /api/admin/providers` | `userEmail` | + `hasValidEmail` (US-NOTIFY-04 badge) |
| Nuevos | — | contact, provider/media, admin product image |

Envelope F1 (`{ data }` / `{ error }`) se mantiene (ADR-003).

---

## Restricciones técnicas

1. **Middleware no protege `/api/*`** — guards `requireRole` en cada handler protegido.
2. **Onboarding proveedor en 2 pasos (ADR-001).**
3. **Pedidos:** modelo en DB; **sin** `POST /api/orders` en F2.
4. **Sin** WhatsApp Business API, push/SMS, cola Redis (F3), filtro distancia, galerías multi-imagen.
5. **Rate limit contacto:** in-memory (ADR-008); se reinicia con el proceso / no compartido entre instancias.
6. **Bounding box Monterrey** en `POST /api/providers`.

---

## Estructura de código (F2)

```
src/app/api/
├── providers/[id]/contact/route.ts
├── provider/media/route.ts
└── admin/products/[id]/image/route.ts
src/lib/
├── services/contact.service.ts
├── services/media.service.ts
├── services/provider.service.ts   # category + q producto + hasValidEmail
├── email/resend.ts
├── storage/cloudinary.ts
├── rate-limit/contact.ts
└── validators/contact.ts
```

---

## Migración Prisma

| Migración | Descripción |
|-----------|-------------|
| `20260805183000_add_provider_search_indexes` | Índices Provider explore |
| `20260810010000_add_audit_contact_media_upload` | Enum `AuditAction`: `CONTACT`, `MEDIA_UPLOAD` |

---

## Log de actividad Backend

| Fecha | Actividad | Estado |
|-------|-----------|--------|
| 05–09/08/2026 | Fase 1 + Quality Gate OBS-001…004 | ✅ |
| 10/08/2026 | Sprint 0 verificado (OBS-001, OBS-003) | ✅ |
| 10/08/2026 | NOTIFY alineado API-NOTIFY-01 (email inválido → `no_email` sync) | ✅ |
| 10/08/2026 | MEDIA mensajes US-MEDIA-03 / API-MEDIA-01 | ✅ |
| 10/08/2026 | EXPLORE `category` + `q` producto + `imageUrl` | ✅ |
| 10/08/2026 | Admin `hasValidEmail` (US-NOTIFY-04) | ✅ |
| 10/08/2026 | Smoke: contact 200/429, media 400 MIME, filters 400/200 | ✅ |
| 12/08/2026 | Handoff Quality Gate F2 al Arquitecto | `handoff-arquitecto-quality-gate-f2.md` |
| 12/08/2026 | Quality Gate F2 dictamen Arquitecto | 🟢 APROBADO CON OBSERVACIONES (OBS-F2-001/002 P3) |

---

## Protocolo de cierre — Pase de estafeta

**Estado Backend Developer:** ENTERADO ✅ — Fase 2

El **@Frontend Developer** debe integrar:

1. Explorar: pasar `category` al API (no solo filtro cliente); URL params US-EXPLORE-03
2. Empty state filtros US-EXPLORE-04
3. Contacto en `/fruteria/[id]`: `POST .../contact` + toast US-NOTIFY-03 (no bloquear `tel:`)
4. Upload logo/cover panel proveedor; imagen producto admin
5. Placeholders / display US-MEDIA-04/05
6. Admin badge si `hasValidEmail === false`

Detalle: [`handoff-frontend.md`](./handoff-frontend.md).

---

*Generado por Backend Developer — LaBorregaMarket v0.2.0.*
