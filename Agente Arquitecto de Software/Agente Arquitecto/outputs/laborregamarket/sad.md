# System Architecture Document (SAD) — LaBorregaMarket v0.2.0

> **Producto:** LaBorregaMarket  
> **Versión:** 0.2.0 (Transacciones — sin checkout)  
> **Fecha:** 10/08/2026  
> **Agente:** Arquitecto de Software

---

## 1. Resumen ejecutivo

LaBorregaMarket es un marketplace local que conecta clientes con fruterías y productores agrícolas en Monterrey. La arquitectura adopta un **monolito modular** basado en Next.js 15 con API Routes, PostgreSQL y Prisma ORM.

El núcleo del dominio es el **catálogo global**: productos curados por ADMIN que cada proveedor activa con precio y disponibilidad propios (`ProviderProduct`).

**Fase 2:** contacto directo (tel/WhatsApp FE + email async), upload de imágenes (Cloudinary) y filtros explorar extendidos. **No** se implementa checkout ni `POST /api/orders`.

---

## 2. Objetivos arquitectónicos

| Objetivo | Estrategia |
|----------|------------|
| Time-to-market MVP | Monolito full-stack, un deploy, una DB |
| Seguridad por roles | JWT httpOnly + RBAC en handlers + matriz DB |
| Comparabilidad de precios | Catálogo global unificado |
| Extensibilidad Fase 2 | NOTIFY + MEDIA + EXPLORE sin romper envelope ADR-003 |
| Trazabilidad | `AuditLog` transversal (`CONTACT`, `MEDIA_UPLOAD`) |

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Next.js App Router, React, Tailwind CSS | 15 / 19 / 4 |
| Backend | Next.js API Routes | 15 |
| ORM | Prisma | 6 |
| Base de datos | PostgreSQL | 15+ |
| Autenticación | JWT (jsonwebtoken) + bcrypt | — |
| Validación | Zod | — |
| Mapas | Leaflet + OpenStreetMap | — |
| Email | Resend | Fase 2 — ADR-005 |
| Imágenes | Cloudinary | Fase 2 — ADR-006 |

**Runtime:** Node.js 20+

---

## 4. Patrón arquitectónico

### Monolito modular en capas

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN                          │
│  App Router (pages) · Server/Client Components · Leaflet │
├─────────────────────────────────────────────────────────┤
│                    API (Controllers)                     │
│  /api/auth/* · /api/providers/* · /api/provider/*       │
│  /api/users/* · /api/admin/* · /api/catalogs            │
├─────────────────────────────────────────────────────────┤
│                    DOMINIO / SERVICIOS                   │
│  lib/auth · lib/audit · lib/services/*                   │
│  lib/email · lib/storage · lib/rate-limit                │
├─────────────────────────────────────────────────────────┤
│                    DATOS                                 │
│  lib/prisma · prisma/schema.prisma                      │
├─────────────────────────────────────────────────────────┤
│                    PostgreSQL 15+                        │
│         + Resend (email) + Cloudinary (media)            │
└─────────────────────────────────────────────────────────┘
```

### Principios

1. **API-first:** Contratos documentados en `api/API-*.md` antes de implementar.
2. **Thin controllers:** Route handlers validan (Zod) y delegan a `lib/services/`.
3. **RBAC dual:** `requireRole()` en handlers + `hasModulePermission()` para ADMIN granular.
4. **Sin microservicios MVP:** Un proceso Node.js; email in-process async (ADR-008); cola → Fase 3.

Ver diagrama detallado: [`diagrams/ARCH-SYSTEM-01.md`](./diagrams/ARCH-SYSTEM-01.md)

---

## 5. Módulos del sistema

| Módulo | Código | Capa API | Entidades | Perfiles |
|--------|--------|----------|-----------|----------|
| Autenticación | `AUTH` | `/api/auth/*` | `User` | Todos |
| Proveedores | `PROVIDERS` | `/api/providers/*`, `/api/provider/*` | `Provider` | CLIENT (ver), PROVIDER, ADMIN |
| Productos | `PRODUCTS` | `/api/provider/products`, admin image | `Product`, `ProviderProduct` | CLIENT (ver), PROVIDER, ADMIN |
| Usuarios | `USERS` | `/api/users/me` | `User` | CLIENT, ADMIN |
| Admin | `ADMIN` | `/api/admin/*`, `/api/catalogs` | Todos | ADMIN |
| Notificaciones | `NOTIFY` (lógico) | `POST /api/providers/[id]/contact` | `AuditLog` CONTACT | Público + email dueño |
| Media | `MEDIA` (lógico) | `/api/provider/media`, `/api/admin/products/[id]/image` | URLs en Provider/Product | PROVIDER, ADMIN |
| Pedidos | `ORDERS` | **Fase 3** `/api/orders` | `Order`, `OrderItem` | Reservado schema |
| Auditoría | `AUDIT` | Escritura transversal | `AuditLog` | ADMIN (lectura) |
| Permisos | `PERMISSIONS` | Guards + DB | `Module`, `RolePermission` | ADMIN |

---

## 6. Flujos principales

### 6.1 Autenticación y autorización

JWT en cookie `httpOnly` (7 días). Middleware protege **páginas** por prefijo de rol; **APIs** usan guards en handlers.

Ver: [`diagrams/ARCH-AUTH-01.md`](./diagrams/ARCH-AUTH-01.md)

### 6.2 Catálogo global

```
ADMIN crea Product (catálogo global)
        │
        ▼
PROVIDER activa Product → ProviderProduct (precio + isAvailable)
        │
        ▼
CLIENT ve precios comparables en /fruteria/[id]
```

Ver: [`diagrams/ARCH-CATALOG-01.md`](./diagrams/ARCH-CATALOG-01.md)

### 6.3 Onboarding proveedor (2 pasos)

1. `POST /api/auth/register` con `role=PROVIDER` → crea `User`
2. Wizard UI paso 2 → `POST /api/providers` → crea `Provider` vinculado

Ver ADR: [`adrs/ADR-001-provider-onboarding-two-step.md`](./adrs/ADR-001-provider-onboarding-two-step.md)

### 6.4 Explorar fruterías

`GET /api/providers` (público, paginado) con filtros `city`, `q` (negocio o producto), `category`, `verified` → UI split mapa + tarjetas → `GET /api/providers/[id]` detalle (incluye `imageUrl` productos).

Ver: [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md)

### 6.5 Contacto y notificación (Fase 2)

CTA "Llamar" / contacto → `POST /api/providers/[id]/contact` (público) → AUDIT `CONTACT` + email async Resend. WhatsApp solo `wa.me` en Frontend.

Ver: [`diagrams/ARCH-NOTIFY-01.md`](./diagrams/ARCH-NOTIFY-01.md), [`api/API-NOTIFY-01.md`](./api/API-NOTIFY-01.md)

### 6.6 Upload de imágenes (Fase 2)

PROVIDER: logo/cover vía `POST /api/provider/media`. ADMIN: `Product.imageUrl` vía `POST /api/admin/products/[id]/image`. Storage Cloudinary + purge.

Ver: [`api/API-MEDIA-01.md`](./api/API-MEDIA-01.md)

---

## 7. Modelo de datos

Fuente de verdad: `LaBorregaMarket/prisma/schema.prisma`

Documentación detallada:

| Entidad | Documento |
|---------|-----------|
| `User` | [`data-model/DB-users.md`](./data-model/DB-users.md) |
| `Provider` | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |
| `Product`, `ProviderProduct` | [`data-model/DB-products.md`](./data-model/DB-products.md) |
| `Order`, `OrderItem` | [`data-model/DB-orders.md`](./data-model/DB-orders.md) — schema reservado; **sin API pedidos en Fase 2** |
| `AuditLog`, `Module`, `RolePermission` | [`data-model/DB-audit-permissions.md`](./data-model/DB-audit-permissions.md) |

ERD: [`diagrams/ARCH-ERD-01.md`](./diagrams/ARCH-ERD-01.md)

---

## 8. Contratos API

| Módulo | Documento |
|--------|-----------|
| AUTH | [`api/API-AUTH-01.md`](./api/API-AUTH-01.md) |
| PROVIDERS (explorar) | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) |
| PROVIDER (panel) | [`api/API-PROVIDER-01.md`](./api/API-PROVIDER-01.md) |
| USERS (cuenta) | [`api/API-USERS-01.md`](./api/API-USERS-01.md) |
| ADMIN | [`api/API-ADMIN-01.md`](./api/API-ADMIN-01.md) |
| NOTIFY | [`api/API-NOTIFY-01.md`](./api/API-NOTIFY-01.md) |
| MEDIA | [`api/API-MEDIA-01.md`](./api/API-MEDIA-01.md) |

Envelope estándar: [`adrs/ADR-003-error-envelope.md`](./adrs/ADR-003-error-envelope.md)

---

## 9. Seguridad

| Aspecto | Implementación |
|---------|----------------|
| Autenticación | JWT en cookie `httpOnly`, `sameSite=lax`, `secure` en prod |
| Passwords | bcrypt; nunca en logs ni respuestas |
| RBAC | `requireRole()` + matriz `RolePermission` en DB |
| Open redirect | Validar `redirect` param — solo paths internos |
| APIs públicas | `GET /api/providers`, `GET /api/providers/[id]`, `POST .../contact`, auth login/register |
| Rate limit | Contacto: 5/provider/10min + 20/IP/hora (in-memory) |
| Media | PROVIDER solo su Provider; ADMIN solo Product; MIME/size server-side |
| Privacidad | Sin PII cliente en email/AUDIT de contacto |
| Auditoría | `writeAuditLog()` incl. CONTACT, MEDIA_UPLOAD |

---

## 10. Decisiones arquitectónicas (ADRs)

| ADR | Título |
|-----|--------|
| ADR-001 | [Onboarding proveedor en 2 pasos](./adrs/ADR-001-provider-onboarding-two-step.md) |
| ADR-002 | [Sin versionado API en MVP](./adrs/ADR-002-api-no-versioning-mvp.md) |
| ADR-003 | [Envelope JSON estándar](./adrs/ADR-003-error-envelope.md) |
| ADR-004 | [Paginación offset](./adrs/ADR-004-pagination-strategy.md) |
| ADR-005 | [Email Resend](./adrs/ADR-005-email-provider.md) |
| ADR-006 | [Storage Cloudinary](./adrs/ADR-006-image-storage.md) |
| ADR-007 | [Audit CONTACT / MEDIA_UPLOAD](./adrs/ADR-007-contact-audit-action.md) |
| ADR-008 | [Notificación async in-process](./adrs/ADR-008-notification-async.md) |

---

## 11. Infraestructura

Ver [`infra-requirements.md`](./infra-requirements.md)

---

## 12. Roadmap arquitectónico

| Fase | Capacidades | Impacto arquitectura |
|------|-------------|---------------------|
| **Fase 1 (MVP)** | Auth, explorar, catálogo, admin | Completada + Sprint 0 observabilidades |
| **Fase 2 (v0.2.0)** | Contacto+email, Cloudinary, filtros category/q | Este SAD — **sin** `/api/orders` |
| **Fase 3** | Pedidos/checkout, cola email, WA Business, distancia | `/api/orders`, Redis/worker |

---

## 13. Referencias

| Documento | Ubicación |
|-----------|-----------|
| Hub arquitectura | [`OBSERVABILITY.md`](./OBSERVABILITY.md) |
| Handoff Backend F1 | [`handoff-backend.md`](./handoff-backend.md) |
| Handoff Backend F2 | [`handoff-backend-fase-2.md`](./handoff-backend-fase-2.md) |
| Producto | `LaBorregaMarket/PRODUCT.md` |
| PRD Fase 2 | PM `outputs/laborregamarket/prd-fase-2.md` |
| UX handoff F2 | UX / PM `handoff-ux-ui-fase-2.md` |

---

*SAD generado por Agente Arquitecto de Software — LaBorregaMarket v0.2.0.*
