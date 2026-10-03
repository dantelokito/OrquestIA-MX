# OBSERVABILITY — LaBorregaMarket (Agente Arquitecto)

> Bitácora de decisiones técnicas, contratos API, esquemas de BD y patrones acordados.  
> **Este archivo es la fuente única de verdad de arquitectura para Backend y Frontend.**

---

## Metadatos

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket |
| **Versión arquitectura** | 0.2.0 (Transacciones — sin checkout) |
| **Fecha** | 12/08/2026 |
| **Agente** | Arquitecto de Software |
| **Estado fase** | 🔶 Quality Gate F2 — APROBADO CON OBSERVACIONES (P1 email async + P2 polish) |
| **Input PM F2** | `Administrador de producto/.../outputs/laborregamarket/prd-fase-2.md`, `handoff-arquitecto-fase-2.md` |
| **Input UX F2** | `handoff-ux-ui-fase-2.md` |
| **Código base** | `C:\Users\PC GAMER\LaBorregaMarket` |
| **Dependencia build** | Sprint 0 (OBS-001, OBS-003) — **cerrado en código** (12/08/2026) |

---

## Punto de entrada para agentes downstream

**Lee este archivo primero.** Luego abre solo los entregables listados para tu rol.

| Agente | Handoff dedicado |
|--------|------------------|
| Backend Developer (Fase 1) | [`handoff-backend.md`](./handoff-backend.md) |
| Backend Developer (**Fase 2**) | [`handoff-backend-fase-2.md`](./handoff-backend-fase-2.md) |
| Frontend Developer | Contratos en [`api/`](./api/) + [`sad.md`](./sad.md) |
| DevOps | [`infra-requirements.md`](./infra-requirements.md) |

---

## Índice de entregables

### Documento principal

| Archivo | Descripción |
|---------|-------------|
| [`sad.md`](./sad.md) | System Architecture Document — topología, capas, módulos (v0.2.0) |

### Diagramas (`diagrams/`)

| ID | Archivo | Descripción |
|----|---------|-------------|
| ARCH-SYSTEM-01 | [`diagrams/ARCH-SYSTEM-01.md`](./diagrams/ARCH-SYSTEM-01.md) | Topología de contenedores |
| ARCH-AUTH-01 | [`diagrams/ARCH-AUTH-01.md`](./diagrams/ARCH-AUTH-01.md) | Flujo JWT + guards API |
| ARCH-CATALOG-01 | [`diagrams/ARCH-CATALOG-01.md`](./diagrams/ARCH-CATALOG-01.md) | Catálogo global → ProviderProduct |
| ARCH-ERD-01 | [`diagrams/ARCH-ERD-01.md`](./diagrams/ARCH-ERD-01.md) | Diagrama entidad-relación |
| ARCH-NOTIFY-01 | [`diagrams/ARCH-NOTIFY-01.md`](./diagrams/ARCH-NOTIFY-01.md) | Contacto + email async (Fase 2) |

### Modelo de datos (`data-model/`)

| ID | Archivo | Entidad |
|----|---------|---------|
| DB-users | [`data-model/DB-users.md`](./data-model/DB-users.md) | `User` |
| DB-providers | [`data-model/DB-providers.md`](./data-model/DB-providers.md) | `Provider` |
| DB-products | [`data-model/DB-products.md`](./data-model/DB-products.md) | `Product`, `ProviderProduct` |
| DB-orders | [`data-model/DB-orders.md`](./data-model/DB-orders.md) | `Order`, `OrderItem` (schema; API en Fase 3) |
| DB-audit-permissions | [`data-model/DB-audit-permissions.md`](./data-model/DB-audit-permissions.md) | `AuditLog`, `Module`, `RolePermission` |

### Contratos API (`api/`)

| ID | Archivo | Módulo |
|----|---------|--------|
| API-AUTH-01 | [`api/API-AUTH-01.md`](./api/API-AUTH-01.md) | Autenticación |
| API-PROVIDERS-01 | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) | Explorar / detalle (v0.2.0 + category/q) |
| API-PROVIDER-01 | [`api/API-PROVIDER-01.md`](./api/API-PROVIDER-01.md) | Panel proveedor |
| API-USERS-01 | [`api/API-USERS-01.md`](./api/API-USERS-01.md) | Cuenta cliente |
| API-ADMIN-01 | [`api/API-ADMIN-01.md`](./api/API-ADMIN-01.md) | Operación admin |
| API-NOTIFY-01 | [`api/API-NOTIFY-01.md`](./api/API-NOTIFY-01.md) | Contacto / email (Fase 2) |
| API-MEDIA-01 | [`api/API-MEDIA-01.md`](./api/API-MEDIA-01.md) | Upload imágenes (Fase 2) |

### ADRs (`adrs/`)

| ID | Archivo | Decisión |
|----|---------|----------|
| ADR-001 | [`adrs/ADR-001-provider-onboarding-two-step.md`](./adrs/ADR-001-provider-onboarding-two-step.md) | Onboarding proveedor en 2 pasos |
| ADR-002 | [`adrs/ADR-002-api-no-versioning-mvp.md`](./adrs/ADR-002-api-no-versioning-mvp.md) | Sin `/api/v1/` en MVP |
| ADR-003 | [`adrs/ADR-003-error-envelope.md`](./adrs/ADR-003-error-envelope.md) | Envelope JSON estándar |
| ADR-004 | [`adrs/ADR-004-pagination-strategy.md`](./adrs/ADR-004-pagination-strategy.md) | Paginación offset |
| ADR-005 | [`adrs/ADR-005-email-provider.md`](./adrs/ADR-005-email-provider.md) | Resend |
| ADR-006 | [`adrs/ADR-006-image-storage.md`](./adrs/ADR-006-image-storage.md) | Cloudinary |
| ADR-007 | [`adrs/ADR-007-contact-audit-action.md`](./adrs/ADR-007-contact-audit-action.md) | AuditAction CONTACT / MEDIA_UPLOAD |
| ADR-008 | [`adrs/ADR-008-notification-async.md`](./adrs/ADR-008-notification-async.md) | Email in-process async |

### Infraestructura

| Archivo | Descripción |
|---------|-------------|
| [`infra-requirements.md`](./infra-requirements.md) | Variables de entorno, Resend, Cloudinary, deploy |

### Handoffs

| Archivo | Descripción |
|---------|-------------|
| [`handoff-backend.md`](./handoff-backend.md) | Fase 1 |
| [`handoff-backend-fase-2.md`](./handoff-backend-fase-2.md) | Fase 2 — NOTIFY / MEDIA / EXPLORE |

---

## Decisiones técnicas

| # | Decisión | Justificación | Referencia |
|---|----------|---------------|------------|
| T1 | Monolito modular Next.js 15 + PostgreSQL | Alineado con código existente; un deploy MVP | `sad.md` |
| T2 | Onboarding proveedor en 2 pasos | UX wizard D1; evita panel roto | ADR-001 |
| T3 | Sin versionado API en MVP | Rutas `/api/*` ya en producción | ADR-002 |
| T4 | Envelope `{ data, meta }` / `{ error, details }` | Homogeneidad para Frontend | ADR-003 |
| T5 | Paginación offset `page` + `limit` | Suficiente para < 100 proveedores MVP | ADR-004 |
| T6 | Guards en route handlers, no middleware API | `middleware.ts` excluye `/api/*` | ARCH-AUTH-01 |
| T7 | Password min 8 unificado login + registro | BL-009, design-tokens UX | API-AUTH-01 |
| T8 | Índices en `Provider.city`, `Provider.businessName` | NFR explorar < 2s | DB-providers.md |
| T9 | `isAvailable` en API/DB; UI mapea `isActive` si aplica | Consistencia con Prisma existente | DB-products.md |
| T10 | Catálogo global solo ADMIN crea `Product` | Asunción PM A5 | ARCH-CATALOG-01 |
| T11 | Email transaccional Resend | D-F2-1; DX Next.js | ADR-005 |
| T12 | Storage imágenes Cloudinary | D-F2-2 MVP | ADR-006 |
| T13 | AuditAction CONTACT + MEDIA_UPLOAD | Trazabilidad sin tabla Contact | ADR-007 |
| T14 | Email fire-and-forget in-process | NFR &lt; 200ms; cola Fase 3 | ADR-008 |
| T15 | Fase 2 sin checkout / orders API | Decisión PM contacto directo | handoff-arquitecto-fase-2 |
| T16 | Explorar: `q` incluye producto; param `category` | Alinear UI chips | API-PROVIDERS-01 |

---

## Matriz rol × módulo × API

| Módulo | CLIENT | PROVIDER | ADMIN | API pública |
|--------|--------|----------|-------|-------------|
| `AUTH` | Propio | Propio | CRUD | login, register |
| `PROVIDERS` | Ver (explorar) | Propio negocio + media | CRUD | GET list/detail, **POST contact** |
| `PRODUCTS` | Ver | Ver + Editar | CRUD + image upload | — |
| `USERS` | Propio (`/me`) | — | CRUD | — |
| `ORDERS` | Fase 3 | Fase 3 | CRUD | — |
| `AUDIT` | — | — | CRUD | — |
| `PERMISSIONS` | — | — | CRUD | — |

---

## Fase 2 — Alcance arquitectura (10/08/2026)

| Capacidad | Contrato / ADR | Estado doc |
|-----------|----------------|------------|
| Contacto + email async | API-NOTIFY-01, ADR-005/007/008 | ✅ |
| Upload logo/cover/product | API-MEDIA-01, ADR-006/007 | ✅ |
| Filtros category + q producto | API-PROVIDERS-01 v0.2.0 | ✅ |
| Handoff Backend | handoff-backend-fase-2.md | ✅ |
| Fuera de alcance | Orders, pagos, WA Business API | Explicitado |

**NFR clave:** contacto HTTP &lt; 200ms; upload max 5MB; explorar filtrado &lt; 2s; envelope ADR-003.

---

## Gaps arquitectura vs implementación actual

| Gap | Estado código | Backlog | Auditoría 08/08/2026 |
|-----|---------------|---------|----------------------|
| PROVIDER sin entidad al registrar | ✅ `POST /api/providers` + `GET /api/provider/me` | BL-002, BL-003 | Cumple ADR-001 |
| `/api/providers` sin paginación | ✅ `{ data, meta }` con `page`, `limit`, `verified` | BL-004 | Cumple ADR-003, ADR-004 |
| Falta `GET /api/providers/[id]` | ✅ Implementado con productos activos | BL-005 | Cumple API-PROVIDERS-01 |
| Falta `/api/users/me` | ✅ GET/PATCH con rol CLIENT | BL-006 | Cumple API-USERS-01 |
| APIs sin guards uniformes | ✅ `requireRole` en rutas protegidas | BL-008 | Cumple ARCH-AUTH-01 |
| Password min 6 en login | ✅ min 8 en Zod | BL-009 | Cumple API-AUTH-01 |
| Sin validación `redirect` | ✅ `isValidRedirect()` en login UI | BL-010 | Cumple (cliente) |
| Sin índices búsqueda | ✅ Migración `add_provider_search_indexes` | BL-011 | Cumple DB-providers.md |
| Admin providers/audit | ✅ `GET/PATCH /api/admin/*` | — | Cumple API-ADMIN-01 |
| Envelope homogéneo en `/api/catalogs` | ✅ Cerrado 12/08 — `ok()`/`apiError()` | — | OBS-001 |
| Thin controllers en `provider/products` | ✅ Cerrado 12/08 — `product.service.ts` | — | OBS-003 |

---

## Envelope estándar (resumen)

Ver [ADR-003](./adrs/ADR-003-error-envelope.md) para detalle completo.

```json
// Éxito paginado
{ "data": [], "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 } }

// Éxito simple
{ "data": { "id": "cuid" } }

// Error
{ "error": "Mensaje", "details": [{ "field": "email", "message": "..." }] }
```

---

## Orden de implementación Backend (sprint 1)

```
BL-002 → POST /api/providers + GET /api/provider/me
BL-008 → Guards uniformes en lib/auth
BL-009 → Password min 8 en login
BL-010 → Validación redirect
BL-004 → Paginación GET /api/providers
BL-005 → GET /api/providers/[id]
BL-006 → GET/PATCH /api/users/me
BL-011 → Índices Prisma + filtros verified
```

Detalle completo en [`handoff-backend.md`](./handoff-backend.md).

### Orden implementación Backend Fase 2

```
Sprint 0 verify → migración AuditAction → NOTIFY → MEDIA → EXPLORE → Should
```

Detalle: [`handoff-backend-fase-2.md`](./handoff-backend-fase-2.md).

---

## Checklist DoD Arquitectura

### Fase 1 (histórico)

- [x] **Seguridad:** Endpoints protegidos documentados con rol mínimo y guards.
- [x] **Rendimiento:** Índices y paginación definidos para listados.
- [x] **Escalabilidad:** Contratos extensibles sin breaking changes en MVP.
- [x] **Modularidad:** Capas delimitadas — OBS-003 cerrado (12/08/2026): `product.service.ts` + thin route.
- [x] **Manejo de errores:** Envelope homogéneo — OBS-001 cerrado (12/08/2026): `/api/catalogs` usa `ok()`/`apiError()`.

### Fase 2 (10/08/2026 doc + 12/08/2026 QG)

- [x] ADRs 005–008 aceptados
- [x] API-NOTIFY-01 + API-MEDIA-01
- [x] API-PROVIDERS-01 extendido (category, q)
- [x] DB-audit / providers / products actualizados
- [x] sad.md + infra + ARCH-NOTIFY-01
- [x] handoff-backend-fase-2.md
- [x] Quality Gate F2 ejecutado — APROBADO CON OBSERVACIONES (OBS-F2-001…007)

---

## Auditoría Arquitectónica de Backend

> **Fecha auditoría:** 08/08/2026  
> **Auditor:** Agente Arquitecto de Software  
> **Alcance:** Código en `LaBorregaMarket/src/app/api/*`, `lib/services/*`, `prisma/schema.prisma`, migraciones  
> **Referencia:** Contratos `api/API-*.md`, ADRs, `handoff-backend.md`  
> **Nota 10/08/2026:** Histórica. El build Fase 2 asume Sprint 0 (OBS-001/003) cerrado o en verificación. No re-ejecutar esta auditoría como bloqueo de diseño F2.

### Veredicto

## 🔴 RECHAZADO CON OBSERVACIONES

El Backend implementó correctamente **todos los ítems críticos del sprint 1** (BL-002 a BL-011) y los endpoints nuevos cumplen contratos y seguridad. Sin embargo, persisten **desviaciones menores** en endpoints legacy y modularidad que deben corregirse antes de cerrar el Quality Gate al 100%.

**El Frontend puede avanzar** en integración de explorar, detalle frutería, cuenta cliente, onboarding proveedor y panel proveedor. **Retrabajo Backend requerido** antes de integración final del panel admin sobre catálogos legacy.

---

### 1. Cumplimiento de Contratos API

| Endpoint | Contrato | Estado | Notas |
|----------|----------|--------|-------|
| `POST /api/auth/login` | API-AUTH-01 | ✅ | min 8, cookie httpOnly, `{ data: { user } }`, audit LOGIN |
| `POST /api/auth/register` | API-AUTH-01 | ✅ | 201, 409 email duplicado, audit CREATE |
| `POST /api/auth/logout` | API-AUTH-01 | ✅ | `{ data: { message } }`, cookie eliminada |
| `GET /api/providers` | API-PROVIDERS-01 | ✅ | Paginación, `city`, `q`, `verified`, envelope |
| `POST /api/providers` | API-PROVIDERS-01 | ✅ | 201/409, bounding box Monterrey, audit |
| `GET /api/providers/[id]` | API-PROVIDERS-01 | ✅ | Productos activos, 404 si inactivo |
| `GET /api/provider/me` | API-PROVIDER-01 | ✅ | 404 EmptyState, guard PROVIDER |
| `GET/PATCH /api/provider/products` | API-PROVIDER-01 | ✅ | Contrato correcto; ver OBS-003 |
| `GET/PATCH /api/users/me` | API-USERS-01 | ✅ | Solo CLIENT, email no editable |
| `GET /api/admin/providers` | API-ADMIN-01 | ✅ | Paginado con `userEmail` |
| `PATCH /api/admin/providers/[id]` | API-ADMIN-01 | ✅ | `isVerified`, audit UPDATE |
| `GET /api/admin/audit` | API-ADMIN-01 | ✅ | Filtros module/action/userId, paginado |
| `GET /api/catalogs` | API-ADMIN-01 | ✅ | OBS-001 cerrado (12/08) — envelope ADR-003 |

**Envelope ADR-003:** Implementado en `lib/api/response.ts`. Aplicado en endpoints nuevos y en `/api/catalogs` (OBS-001 cerrado 12/08/2026).

---

### 2. Integridad de Base de Datos

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Esquema alineado con ERD | ✅ | `prisma/schema.prisma` — entidades sin desviaciones |
| Índices Provider (BL-011) | ✅ | `@@index([city])`, `@@index([businessName])`, `@@index([isActive, isVerified])` |
| Migración aplicada | ✅ | `20260805183000_add_provider_search_indexes/migration.sql` |
| Relaciones y constraints | ✅ | `Provider.userId` UK, `ProviderProduct` UK compuesto |
| Sin redundancia de datos | ✅ | Catálogo global + instancias ProviderProduct |
| Consultas parametrizadas | ✅ | 100% Prisma ORM — sin `$queryRaw` / SQL crudo |

---

### 3. Adherencia Técnica y Seguridad

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Inyección SQL | ✅ | Solo Prisma Client con parámetros tipados |
| JWT httpOnly | ✅ | `login`/`register` set cookie; `secure` en prod |
| bcrypt passwords | ✅ | `lib/auth/password.ts` — 12 salt rounds |
| RBAC en handlers | ✅ | `requireRole(getSession())` en rutas protegidas |
| Rutas públicas sin auth | ✅ | `GET /api/providers`, `GET /api/providers/[id]` |
| Mensaje login genérico | ✅ | "Credenciales inválidas" — no revela email |
| `isActive` check login | ✅ | Usuario inactivo → 401 |
| Open redirect (BL-010) | ✅ | `lib/auth/redirect.ts` + `LoginPageClient` |
| Auditoría transversal | ✅ | LOGIN, LOGOUT, CREATE, UPDATE, ENABLE/DISABLE |
| Capa servicios | 🔶 | `provider.service`, `user.service`, `audit.service` — parcial |

**Guards verificados por ruta:**

| Prefijo | Guard | OK |
|---------|-------|-----|
| `/api/providers` POST | PROVIDER | ✅ |
| `/api/provider/*` | PROVIDER | ✅ |
| `/api/users/me` | CLIENT | ✅ |
| `/api/admin/*` | ADMIN | ✅ |
| `/api/catalogs` | ADMIN + hasModulePermission | ✅ |

---

### 4. Observaciones — Correcciones requeridas (@Backend_Developer)

| ID | Prioridad | Desviación | Acción correctiva | Archivo |
|----|-----------|------------|-------------------|---------|
| **OBS-001** | P1 | `/api/catalogs` no usa `ok()`/`apiError()` de ADR-003. Errores retornan `NextResponse.json({ error })` directo; listado sin `catalog` param retorna `{ catalogs: [...] }` sin wrapper `data`. | Migrar a helpers de `lib/api/response.ts`. Default: `ok({ catalogs: [...] })`. Errores: `apiError()`. | `src/app/api/catalogs/route.ts` |
| **OBS-002** | P2 | Nombres de catálogo divergen de API-ADMIN-01: código usa `permissions` y `audit`; spec documenta `role-permissions` y `provider-products`. | Opción A: agregar aliases (`provider-products` → query provider_products, `role-permissions` → permissions). Opción B: actualizar API-ADMIN-01 si legacy es intencional. | `src/app/api/catalogs/route.ts` |
| **OBS-003** | P2 | SAD exige thin controllers; `GET/PATCH /api/provider/products` contiene lógica Prisma directamente en route handler (~140 líneas). | Extraer a `lib/services/product.service.ts` (`getProviderCatalog`, `upsertProviderProduct`). | `src/app/api/provider/products/route.ts` |
| **OBS-004** | P3 | `/api/catalogs` verifica `hasModulePermission(USERS, view)` para todos los catálogos, incluso `products` u `orders`. | Evaluar permiso por catálogo según `SystemModule` correspondiente. | `src/app/api/catalogs/route.ts` |

---

### 5. Resumen por backlog

| Backlog | Resultado auditoría |
|---------|---------------------|
| BL-002 Onboarding Provider | ✅ Aprobado |
| BL-003 GET provider/me | ✅ Aprobado |
| BL-004 Paginación providers | ✅ Aprobado |
| BL-005 Detalle frutería | ✅ Aprobado |
| BL-006 users/me | ✅ Aprobado |
| BL-008 Guards API | ✅ Aprobado |
| BL-009 Password min 8 | ✅ Aprobado |
| BL-010 Redirect validation | ✅ Aprobado |
| BL-011 Índices + filtros | ✅ Aprobado |

---

### 6. Criterio de re-aprobación (F1 — histórico)

El Quality Gate F1 pasó a **cerrado por Sprint 0** (verificado 12/08/2026 en auditoría F2):

1. [x] OBS-001 resuelto — `/api/catalogs` usa envelope estándar
2. [x] OBS-002 resuelto (aliases en código)
3. [x] OBS-003 resuelto — lógica de productos en capa servicio

OBS-004 también verificado cerrado en F2.

---

### 7. Pase de estafeta post-auditoría

| Agente | Puede avanzar | Condición |
|--------|---------------|-----------|
| **Frontend Developer** | ✅ Sí | Integrar `/explorar`, `/fruteria/[id]`, `/cuenta`, `/proveedor`, onboarding |
| **Backend Developer** | 🔶 Retrabajo menor | Corregir OBS-001 a OBS-003 antes de cerrar sprint |
| **DevOps** | ✅ Sí | Infra sin cambios; migración índices lista |

---

## Auditoría Arquitectónica de Backend — Fase 2 (v0.2.0)

> **Fecha auditoría:** 12/08/2026  
> **Auditor:** Agente Arquitecto de Software (Quality Gate solicitado por Backend Developer)  
> **Alcance:** NOTIFY, MEDIA, EXPLORE + re-verificación Sprint 0 (OBS-001…004)  
> **Referencia:** `handoff-backend-fase-2.md`, API-NOTIFY-01, API-MEDIA-01, API-PROVIDERS-01 v0.2.0, ADR-005…008  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Solicitud:** `Agente backend/Agente backend/outputs/laborregamarket/handoff-arquitecto-quality-gate-f2.md`

### Veredicto

## 🟢 APROBADO CON OBSERVACIONES

El Backend Fase 2 **cumple contratos HTTP** NOTIFY, MEDIA y EXPLORE (envelope ADR-003, RBAC, AUDIT, filtros). Sprint 0 (OBS-001…004) **cerrado en código**.

**Sin P0:** Frontend puede integrar F2 (contacto, uploads, `category`/`q`).

**P1 abierto (OBS-F2-003):** `after(() => { void runContactEmailJob(job) })` no retorna la Promise — riesgo de truncar reintentos Resend en serverless. No bloquea shapes HTTP para FE; sí afecta fiabilidad de entrega de email en producción.

**P2:** MIME solo por `File.type`; paginación clamp vs 400; list samples sin `Product.isActive`.

---

### 1. Cumplimiento de Contratos API

| Endpoint | Contrato | Estado | Notas |
|----------|----------|--------|-------|
| `POST /api/providers/[id]/contact` | API-NOTIFY-01 | 🔶 | Público; Zod; `{ notified, message }`; 429 OK; email async con caveat OBS-F2-003 |
| `POST /api/provider/media` | API-MEDIA-01 | ✅ | PROVIDER; multipart; ownership; purge; AUDIT MEDIA_UPLOAD |
| `POST /api/admin/products/[id]/image` | API-MEDIA-01 | ✅ | ADMIN; `imageUrl`; purge; AUDIT |
| `GET /api/providers` | API-PROVIDERS-01 v0.2.0 | 🔶 | `category`/`q` OK; ver OBS-F2-005 (page/limit), OBS-F2-006 (samples) |
| `GET /api/providers/[id]` | API-PROVIDERS-01 v0.2.0 | ✅ | `products[].imageUrl`; filtro `isAvailable` + `isActive` |
| `GET /api/admin/providers` | US-NOTIFY-04 | ✅ | `hasValidEmail` |

**Fuera de alcance verificado:** sin `POST /api/orders` / rutas orders en F2.

**Re-verificación Sprint 0 (F1):**

| Endpoint / ítem | OBS | Estado | Evidencia |
|-----------------|-----|--------|-----------|
| `GET /api/catalogs` | OBS-001 | ✅ Cerrado | `ok()` / `apiError()` en `catalogs/route.ts` |
| Aliases catálogos | OBS-002 | ✅ Cerrado | aliases en catálogo |
| `GET/PATCH /api/provider/products` | OBS-003 | ✅ Cerrado | Thin route → `product.service.ts` |
| RBAC por catálogo | OBS-004 | ✅ Cerrado | permiso por módulo |

---

### 2. Integridad de Base de Datos

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Enum `AuditAction` CONTACT / MEDIA_UPLOAD | ✅ | `prisma/schema.prisma`; migración `20260810010000_add_audit_contact_media_upload` |
| Shape AUDIT CONTACT | ✅ | `contact.service.ts` — ADR-007 |
| Shape AUDIT MEDIA_UPLOAD | ✅ | `media.service.ts` — ADR-007 |
| Sin PII cliente en AUDIT/email | ✅ | `resend.ts` template |
| Sin tablas Contact/Notification | ✅ | Decisión respetada |
| Filtro EXPLORE category en `where` | ✅ | `isAvailable` + `Product.isActive` + category |
| Consultas parametrizadas | ✅ | Prisma ORM |

---

### 3. Seguridad y Adherencia Técnica

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| NOTIFY público; CLIENT opcional en AUDIT | ✅ | `contact/route.ts` |
| Rate limit 5/10min + 20/h | ✅ | `rate-limit/contact.ts` → 429 |
| Email async + reintentos 3 | 🔶 | `after()` presente; Promise descartada con `void` — OBS-F2-003 |
| MEDIA ownership + ADMIN | ✅ | `media.service.ts` |
| Cloudinary HTTPS + purge | ✅ | `cloudinary.ts` |
| MIME server-side | 🔶 | Solo `file.type` — OBS-F2-004 |
| Thin controllers F2 | ✅ | contact, media, provider |
| `.env.example` F2 | ✅ | Resend, Cloudinary, rate limits |

**Evidencia OBS-F2-003** (`src/app/api/providers/[id]/contact/route.ts` L44–48):

```typescript
after(() => {
  void runContactEmailJob(job);
});
```

Esperado ADR-008: retornar/await la Promise para que la plataforma preserve el trabajo background.

---

### 4. Observaciones — Correcciones (@Backend_Developer)

| ID | Prioridad | Desviación | Acción correctiva | Archivo |
|----|-----------|------------|-------------------|---------|
| **OBS-F2-003** | **P1** | `after()` con `void` descarta Promise; riesgo truncar Resend/retries en serverless | `after(() => runContactEmailJob(job))` o `after(async () => { await runContactEmailJob(job); })` | `src/app/api/providers/[id]/contact/route.ts` |
| **OBS-F2-004** | P2 | MIME validado solo con `File.type` (spoofable) | Magic-byte sniff o documentar mitigación Cloudinary `resource_type: image` | `src/lib/storage/cloudinary.ts` L23–41 |
| **OBS-F2-005** | P2 | `page`/`limit` inválidos se **clampean**; contrato API-PROVIDERS-01 pide **400** | Devolver 400 + `details` o formalizar clamp en ADR-004 | `src/lib/services/pagination.ts` L13–15 |
| **OBS-F2-006** | P2 | List `sampleProducts` / `productCount` filtran solo `isAvailable`, no `Product.isActive` (detalle sí) | Alinear include/`_count`: `product: { isActive: true }` | `src/lib/services/provider.service.ts` L187–193 |
| **OBS-F2-001** | P3 | Rate limit in-memory (ADR-008 conocido) | Redis/Upstash Fase 3 | `lib/rate-limit/contact.ts` |
| **OBS-F2-002** | P3 | Sin tests API automatizados F2 | Suite smoke Fase 3 | — |
| **OBS-F2-007** | P3 | Pulido ADR-005: sin mensaje Resend en AUDIT `send_failed`; `productIds` sin filtro `isActive`; sin log en `email_disabled` | Enriquecer AUDIT/log; filtrar productos activos | `resend.ts`, `contact.service.ts` L87–90 |

---

### 5. Checklist DoD F2 (handoff-backend-fase-2.md)

| Ítem | Estado |
|------|--------|
| Sprint 0 verificado (OBS-001, OBS-003) | ✅ |
| Migración CONTACT / MEDIA_UPLOAD aplicada | ✅ |
| POST contact sync; email async; 429 | 🔶 (async Promise — OBS-F2-003) |
| Uploads MEDIA ownership + purge + envelope | ✅ |
| GET providers `category` + `q` producto; detalle `imageUrl` | ✅ (polish OBS-F2-005/006) |
| Sin PII cliente en email/AUDIT | ✅ |
| Thin controllers → services | ✅ |
| Errores 400/401/403/404/429/500 con envelope | ✅ |

---

### 6. Criterio de re-aprobación

Quality Gate F2 pasa a **🟢 APROBADO** (sin P1) cuando:

1. [ ] **OBS-F2-003** resuelto — `after()` retorna/await Promise del email job

OBS-F2-004…007 son recomendados (P2/P3); no bloquean Frontend ni re-aprobación estricta del gate HTTP.

---

### 7. Pase de estafeta post-auditoría F2

| Agente | Puede avanzar | Condición |
|--------|---------------|-----------|
| **Frontend Developer** | ✅ Sí | Integrar contact, media, `category`/`q`; ver handoff Frontend Backend v0.2.0 |
| **Backend Developer** | 🔶 Retrabajo menor | Corregir **OBS-F2-003** (P1); P2 opcionales |
| **DevOps** | 🔶 Cuando FE/BE lo pida | `RESEND_*` + `CLOUDINARY_*` en staging/prod |

---

## Log de actividad Arquitecto

| Fecha | Actividad | Entregable | Agente destino |
|-------|-----------|------------|----------------|
| 05/08/2026 | Análisis PRD, UX handoff y código existente | Este archivo | — |
| 05/08/2026 | SAD + 4 diagramas de arquitectura | `sad.md`, `diagrams/ARCH-*.md` | Backend, Frontend |
| 05/08/2026 | Modelo de datos 5 entidades | `data-model/DB-*.md` | Backend |
| 05/08/2026 | Contratos API 5 módulos | `api/API-*.md` | Backend, Frontend |
| 05/08/2026 | 4 ADRs decisiones estructurales | `adrs/ADR-*.md` | Backend |
| 05/08/2026 | Infra + handoff Backend | `infra-requirements.md`, `handoff-backend.md` | **Backend Developer** |
| 08/08/2026 | Quality Gate — auditoría código Backend | Sección "Auditoría Arquitectónica de Backend" | **Backend Developer**, Frontend |
| 10/08/2026 | Arquitectura Fase 2 NOTIFY/MEDIA/EXPLORE | ADR-005…008, API-NOTIFY/MEDIA, PROVIDERS 0.2.0, ARCH-NOTIFY-01, handoff-backend-fase-2 | **Backend Developer** |
| 12/08/2026 | Quality Gate F2 — dictamen APROBADO CON OBSERVACIONES (OBS-F2-001…007) | Sección "Auditoría Arquitectónica de Backend — Fase 2" | **Frontend Developer**, **Backend Developer** |

---

## Referencias externas

| Documento | Ubicación | Cuándo leer |
|-----------|-----------|-------------|
| Visión producto | `LaBorregaMarket/PRODUCT.md` | Contexto negocio |
| PRD Fase 1 | `Administrador de producto/.../prd.md` | Requerimientos F1 |
| PRD Fase 2 | `Administrador de producto/.../prd-fase-2.md` | Requerimientos F2 |
| Handoff Arquitecto F2 | `Administrador de producto/.../handoff-arquitecto-fase-2.md` | Entrada F2 |
| Handoff QG F2 (Backend) | `Agente backend/.../handoff-arquitecto-quality-gate-f2.md` | Solicitud auditoría |
| OBSERVABILITY PM | `Administrador de producto/.../OBSERVABILITY.md` | Gaps producto |
| OBSERVABILITY UX | `Agente UX UI/.../OBSERVABILITY.md` | Decisiones diseño |
| Esquema Prisma | `LaBorregaMarket/prisma/schema.prisma` | Fuente de verdad dominio |
| Permisos | `LaBorregaMarket/src/lib/auth/permissions.ts` | Prefijos de ruta |

---

## Protocolo de cierre — Pase de estafeta

**Estado Arquitecto (12/08/2026):** 🔶 **Quality Gate F2 APROBADO CON OBSERVACIONES** — Frontend autorizado; Backend con P1 OBS-F2-003.

**Backend Developer:**

1. ~~Sprint 0 / implementar F2 / solicitar QG.~~ ✅
2. Corregir **OBS-F2-003** (P1) y solicitar re-chequeo puntual si se desea gate sin P1.
3. P2/P3 (OBS-F2-004…007) según capacidad.

**Frontend Developer** puede integrar contra `API-NOTIFY-01`, `API-MEDIA-01`, `API-PROVIDERS-01` v0.2.0 — ver `Agente backend/.../handoff-frontend.md`.

**DevOps:** env Resend + Cloudinary según [`infra-requirements.md`](./infra-requirements.md) cuando se despliegue F2.

Auditoría F1 (08/08): [Auditoría Arquitectónica de Backend](#auditoría-arquitectónica-de-backend) (histórica).  
Auditoría F2 (12/08): [Auditoría Arquitectónica de Backend — Fase 2](#auditoría-arquitectónica-de-backend--fase-2-v020).

---

## Quality Gate Backend — Fase 3 (13/08/2026)

**Veredicto:** APROBADO CON OBSERVACIONES — 90/100, 0 P0.

Dictamen: [`fase-3/quality/REVIEW-ARCH.md`](./fase-3/quality/REVIEW-ARCH.md) · [`STATUS.md`](./STATUS.md)

OBS-F2-003 cerrado en código (`after(async () => { await … })` en contacto y `POST /api/orders`).

No `READY-FOR-QA.md`: falta REVIEW-UX.

| ID | Sev | Tema |
|----|-----|------|
| OBS-F3-020 | P1 | Verificar migración `orders_f3_source_pos_uom` en BD |
| OBS-F3-021 | P2 | Integración mockea servicios |
| OBS-F3-022 | P2 | AUDIT `notificationFailed` si no hay email |
| OBS-F3-023 | P2 | QR-BE no está en el repo Backend |

---

*Generado por Agente Arquitecto de Software — LaBorregaMarket v0.3.0 — Quality Gate F3 13/08/2026.*

---

## Arquitectura Fase 4 — diseño 14/08/2026 (append)

> **No reescribe** auditorías F1–F3. Fuente de trabajo F4: [`../fase-4/README.md`](../fase-4/README.md), SAD v0.4.0 [`../comun/sad.md`](../comun/sad.md).

| Campo | Valor |
|-------|-------|
| **Versión arquitectura** | 0.4.0 |
| **Estado** | Contratos diseñados; código F4 pendiente |
| **Input PM** | `Administrador de producto/.../fase-4/handoff-arquitecto.md`, `prd.md`, US-REV/GEO/NOTIFY/ADMIN/POS/ORDERS-05 |
| **Input UX** | Pendiente (UF-* vacíos) |

### Entregables F4

| Tipo | Path |
|------|------|
| ADRs 015–019 | [`../comun/adrs/ADR-015-notification-queue.md`](../comun/adrs/ADR-015-notification-queue.md) … ADR-019 |
| ADR-008 | Estado **Reemplazado** por 015 |
| APIs | [`../fase-4/api/`](../fase-4/api/) |
| Data model | [`../fase-4/data-model/`](../fase-4/data-model/) |
| Diagramas | [`../fase-4/diagrams/`](../fase-4/diagrams/) |
| Handoff BE | [`../fase-4/handoff-backend-fase-4.md`](../fase-4/handoff-backend-fase-4.md) |
| Infra | [`../comun/infra-requirements.md`](../comun/infra-requirements.md) |

### Decisiones técnicas F4

| # | Decisión | Referencia |
|---|----------|------------|
| T17 | Upstash Redis (rate limit) + Inngest (jobs ≤3); no BullMQ en Vercel | ADR-015 |
| T18 | Google Maps JS reemplaza Leaflet (sin coexistencia) | ADR-016 |
| T19 | ETA = preparación + Haversine/25 km/h; no Distance Matrix | ADR-017 |
| T20 | `Review` 1:1 pedido; rating atómico; PATCH Google 403 si no verificado | ADR-018 |
| T21 | Báscula 100% cliente; POS API F3 intacta | ADR-019 |
| T22 | Delivery / WhatsApp / ETA-en-mensaje son Should (schema listo) | API-ORDERS-01, API-NOTIFY-01 |
| T23 | Haversine app/SQL; PostGIS si &gt;200 providers o p95 &gt;2s | DB-providers delta |

### Matriz rol × API nueva

| Recurso | CLIENT | PROVIDER | ADMIN | Público |
|---------|--------|----------|-------|---------|
| POST `/api/orders/[id]/reviews` | Propio DELIVERED | — | — | — |
| GET `/api/providers/[id]/reviews` | Ver | Ver | Ver | Sí |
| DELETE `/api/admin/reviews/[id]` | — | — | Sí | — |
| GET `/api/providers` + radio | — | — | — | Sí |
| GET `/api/providers/[id]/eta` | — | — | — | Sí |
| `/api/users/me/addresses` | CRUD | 403 | 403 | 401 |
| PATCH `/api/provider/me` | — | Dueño | — | — |
| GET `/api/admin/analytics` | — | — | Sí | — |

### Log 14/08/2026

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 14/08/2026 | Arquitectura F4 (ADRs 015–019, APIs, schema delta, SAD 0.4.0) | `fase-4/`, `comun/` | Backend, Frontend, DevOps |

**Backend / Frontend:** implementar Must según handoff. **QA:** no invocar. **Arquitecto:** QG cuando Backend lo pida.

---

*Append Arquitecto — LaBorregaMarket v0.4.0 — diseño 14/08/2026.*

---

## Quality Gate Backend — Fase 4 (14/08/2026)

**Veredicto:** APROBADO CON OBSERVACIONES — 97/100, **0 P0**.

Dictamen: [`fase-4/quality/REVIEW-ARCH.md`](../fase-4/quality/REVIEW-ARCH.md)  
Estafeta QA: [`fase-4/quality/READY-FOR-QA.md`](../fase-4/quality/READY-FOR-QA.md) · [`STATUS.md`](../STATUS.md)

No se copió el auto-score QR-BE (94). Código cumple ADRs 015–019 y contratos Must (+ Should delivery/WA). `after()` eliminado.

| ID | Sev | Tema |
|----|-----|------|
| OBS-F4-020 | P1 | Verificar migración `add_reviews_addresses_notify_scale` en BD |
| OBS-F4-021 | P2 | Integración mockea servicios |
| OBS-F4-022 | P2 | Sin smoke staging Upstash/Inngest/WhatsApp |

**QA Tester:** habilitado. Aplicar migración antes de la corrida local.

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 14/08/2026 | Quality Gate Backend F4 | REVIEW-ARCH + READY-FOR-QA | **QA Tester**, Backend |

---

*Append Arquitecto — LaBorregaMarket v0.4.0 — Quality Gate F4 14/08/2026.*

---

## Arquitectura Fase 5 — diseño 14/08/2026 (append)

> **No reescribe** auditorías F1–F4. Fuente de trabajo F5: [`../fase-5/README.md`](../fase-5/README.md), SAD v0.5.0 [`../comun/sad.md`](../comun/sad.md).

| Campo | Valor |
|-------|-------|
| **Versión arquitectura** | 0.5.0 |
| **Estado** | Contratos diseñados; código F5 pendiente |
| **Input PM** | `Administrador de producto/.../fase-5/handoff-arquitecto.md`, `prd.md`, CO-F5-001, US-GEO-04/05, US-CAT-01, US-BRAND-01/02 |
| **Input UX** | Pendiente (UF-* vacíos) |

### Entregables F5

| Tipo | Path |
|------|------|
| ADRs 020–022 | [`../comun/adrs/ADR-020-maps-engine-leaflet.md`](../comun/adrs/ADR-020-maps-engine-leaflet.md) … ADR-022 |
| ADR-016 | Estado **Reemplazado** por 020 |
| APIs | [`../fase-5/api/`](../fase-5/api/) |
| Data model | [`../fase-5/data-model/DB-providers.md`](../fase-5/data-model/DB-providers.md) |
| Diagramas | [`../fase-5/diagrams/`](../fase-5/diagrams/) |
| Handoff BE | [`../fase-5/handoff-backend-fase-5.md`](../fase-5/handoff-backend-fase-5.md) |
| Infra | [`../comun/infra-requirements.md`](../comun/infra-requirements.md) |

### Decisiones técnicas F5

| # | Decisión | Referencia |
|---|----------|------------|
| T24 | Leaflet + OSM reemplaza Google Maps JS en `/explorar`; query Haversine intacta | ADR-020, API-GEO-01 delta |
| T25 | Teselas OSM local/QA; prod CDN opcional `NEXT_PUBLIC_OSM_TILE_URL`; attribution Must | ADR-020, infra |
| T26 | `primaryColor`/`secondaryColor` par nullable; contraste WCAG en servidor | ADR-021 |
| T27 | Tema solo sesión PROVIDER; `GET /api/auth/session` siempre 200 | API-SESSION-THEME-01 |
| T28 | Fuente CAT = `ProviderProduct.isAvailable` (no `isActive` nuevo); detalle omite inactivos; venta 409 | ADR-022 |
| T29 | Pagos/CFDI/bbox Must/Places/Distance Matrix fuera de F5 | PRD Won't |

### Matriz rol × API nueva / delta

| Recurso | CLIENT | PROVIDER | ADMIN | Público |
|---------|--------|----------|-------|---------|
| GET `/api/auth/session` | 200 brand null | 200 brand si válido | 200 brand null | 200 unauthenticated |
| PATCH `/api/provider/me` colores | — | Dueño | — | — |
| PATCH `/api/admin/providers/[id]` colores | — | — | Sí | — |
| GET `/api/providers/[id]` products | — | — | — | Solo vendibles |
| POST `/api/orders` producto inhabilitado | 409 | — | — | — |
| POST `/api/provider/pos/sales` catálogo inhabilitado | — | 409 | — | — |

### Log 14/08/2026

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 14/08/2026 | Arquitectura F5 (ADRs 020–022, APIs, schema delta, SAD 0.5.0) | `fase-5/`, `comun/` | Backend, Frontend, DevOps |

**Backend / Frontend:** implementar Must según handoff. **QA:** no invocar. **Arquitecto:** QG cuando Backend lo pida.

---

*Append Arquitecto — LaBorregaMarket v0.5.0 — diseño 14/08/2026.*

---

## Quality Gate Backend — Fase 5 (15/08/2026)

**Veredicto:** APROBADO CON OBSERVACIONES — 97/100, **0 P0**.

Dictamen: [`fase-5/quality/REVIEW-ARCH.md`](../fase-5/quality/REVIEW-ARCH.md)  
Estafeta QA: [`fase-5/quality/READY-FOR-QA.md`](../fase-5/quality/READY-FOR-QA.md) · [`STATUS.md`](../STATUS.md)

No se copió el auto-score QR-BE (96). Código cumple ADRs 021–022 y contratos Must. Query geo F4 intacta. Leaflet es FE.

| ID | Sev | Tema |
|----|-----|------|
| OBS-F5-023 | P1 | Verificar migración `add_provider_brand_colors` en BD |
| OBS-F5-024 | P2 | Integración mockea servicios |
| OBS-F5-025 | P3 | `topProducts` no cruza `Product.isActive` |

**QA Tester:** habilitado. Aplicar migración F5 (y F4 si falta) antes de la corrida local.

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 15/08/2026 | Quality Gate Backend F5 | REVIEW-ARCH + READY-FOR-QA | **QA Tester**, Backend |

---

*Append Arquitecto — LaBorregaMarket v0.5.0 — Quality Gate F5 15/08/2026.*

---

## Arquitectura Fase 6 — confiabilidad 16/08/2026 (append)

> **No reescribe** F1–F5. Fuente: [`../fase-6/README.md`](../fase-6/README.md), SAD v0.6.0, infra 0.6.0. Input: DevOps `deuda-fases-previas.md`, QA `IMPACTO-NO-ATENDER.md`.

| Campo | Valor |
|-------|-------|
| **Versión arquitectura** | 0.6.0 |
| **Estado** | Slice confiabilidad diseñado; **sin** pasarela |
| **Gate** | No READY-FOR-QA de pagos si DEV-P0-001 o DEV-P0-002 abiertos |

### Incidencias F6 (Backend vs otros)

| ID | Dueño | Acción Arquitecto |
|----|-------|-------------------|
| DEV-P0-001 | Backend | Handoff: `npm install @upstash/redis` + lockfile; no lazy-import |
| DEV-P0-002 | DevOps | Infra: CI Postgres + migrate + build/start + Playwright |
| DEV-P1-003 | BE + DevOps | `migrate deploy` F2→F5 |
| DEV-P1-004 | DevOps | Secretos staging |
| DEV-P1-005 | Backend | 503 fail-closed tras instalar SDK |
| DEV-P1-006 | Arquitecto | Checklist F4 Maps **superado** ADR-020 |
| DEV-P1-007 | DevOps | JWT por entorno |
| DEV-P2-011 | Backend | requireRole + test en rutas nuevas |

Fuera de este slice: P2-008 `/health`, P2-009 env FE, P2-010 nube.

### Log 16/08/2026

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 16/08/2026 | F6 confiabilidad (ADR-015 lockfile, infra CI, checklist Maps) | `fase-6/`, `comun/` | **Backend**, DevOps |

---

*Append Arquitecto — LaBorregaMarket v0.6.0 — diseño F6 16/08/2026.*

---

## Arquitectura Fase 6 — reportes + GEO 16/08/2026 (append v0.6.1)

> **No reescribe** el append de deuda v0.6.0 ni F1–F5. Fuente: PM `fase-6/handoff-arquitecto.md`, `prd.md`, CO-F6-001, CO-F6-002. Slice A (deuda) **no se rediseña**.

| Campo | Valor |
|-------|-------|
| **Versión arquitectura** | 0.6.1 |
| **Estado** | Tres slices diseñados; **sin** pasarela |
| **Gate** | QA F6 = P0-001 + P0-002 **y** US-DASH-04/05/06 + US-GEO-07/08. No READY-FOR-QA de pagos |

### Decisiones B / C

| ID | Decisión |
|----|----------|
| ADR-024 | Ventanas `grain=day\|month\|year` + `date` concreta; TZ America/Monterrey; endpoint **nuevo** `/api/provider/reports` (dashboard F3 intacto) |
| ADR-023 | PDF **servidor** `GET /api/provider/reports.pdf`; misma agregación; no Chromium |
| ADR-020 append | FE deriva `radiusKm` pin→borde viewport, clamp 1–25, debounce 300 ms; **no** bbox Must |

Cero schema. Rutas reports: `requireRole(PROVIDER)` + test 401/403 (DEV-P2-011). GEO: cero route Backend.

### Log 16/08/2026 (v0.6.1)

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 16/08/2026 | F6 reportes + GEO (ADR-023/024, API reports, nota GEO) | `fase-6/`, `comun/` | **Backend**, Frontend |

---

*Append Arquitecto — LaBorregaMarket v0.6.1 — diseño F6 slices B/C 16/08/2026.*

---

## 18/08/2026 — Apertura Fase 7 (Arquitecto)

Fase activa **7** (v0.7.1). `fase-6/` congelada. `CO-F7-001` revoca pan→radio. Contratos: GEO clamp/`total`/`q`, `POST .../addresses/[id]/use`, preview vitrina, cookie ADR-025. Constante SN `25.7475, -100.2830`. US-GEO-16 sin API nueva. Pagos aparcados.

| ID | Decisión |
|----|----------|
| ADR-025 | Cookie `HttpOnly` `SameSite=Lax` `Secure` solo HTTPS; no Bearer Must; no querystring |
| ADR-026 | Default Explorar San Nicolás `lat=25.7475 lng=-100.2830` radio 10 |
| ADR-027 | `UserAddress.lastUsedAt` + ruta `/use` (no `updatedAt`) |
| ADR-020 append F7 | Pan/zoom solo vista; slider envía `radiusKm` |

### Log 18/08/2026 (v0.7.1)

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 18/08/2026 | F7 Explorar + AUTH (ADR-025/026/027, APIs, handoff BE) | `fase-7/`, `comun/` | **Backend**, Frontend |

---

*Append Arquitecto — LaBorregaMarket v0.7.1 — diseño F7 18/08/2026.*

---

## 24/08/2026 — Apertura Fase 8 (Arquitecto)

Fase activa **8** (v0.8.3). `fase-7/` solo lectura. `fase-6/` congelada. `CO-F7-001` intacto. Contratos: clamp `radiusKm` 0.5–10 decimal, `MEXICO_BOUNDS` + `isInMexico` (ADR-028), P1/P4 **sin API nueva**. Pagos aparcados.

| ID | Decisión |
|----|----------|
| ADR-020 append F8 | Clamp 0.5–10; sin `Math.round`; pan≠radio limitado a MX |
| ADR-028 | Rectángulo canónico México; `minZoom` 5; sustituye 400 AMM en Explorar |
| P1 addresses | Inventario F4+F7; DELETE pin permanece = FE |
| P4 preview | Mismo GET detalle; debounce/cache hover; cero BE Must |

### Log 24/08/2026 (v0.8.3)

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 24/08/2026 | F8 Explorar polish (ADR-028, clamp GEO, handoff BE) | `fase-8/`, `comun/` | **Backend**, Frontend |

---

*Append Arquitecto — LaBorregaMarket v0.8.3 — diseño F8 24/08/2026.*

---

## 28/08/2026 — Apertura Fase 10 (Arquitecto)

Fase activa **10** (v0.10.2). `fase-9/` solo lectura. `fase-6/` congelada (DASH grain intacto; rango se documenta en `fase-10/`). `CO-F10-001` revoca A5. `CO-F10-002` disco. `CO-F10-003` reportes `from`/`to`. Pagos aparcados (`CO-F6-001`). Explorar F9 intacto.

| ID | Decisión |
|----|----------|
| ADR-029 | Dual SKU: `Product.scope` GLOBAL/LOCAL + `ownerProviderId`; unique `[providerId, productId]` se conserva |
| ADR-030 | `ProviderSection` plana; `ProviderProduct.sectionId`; DELETE solo vacía |
| ADR-031 | `assertNotLastAdmin` → 409; sin auto-escalada; sin CRUD usuarios F10 |
| ADR-032 | Disco `UPLOADS_DIR`; ADR-006 **Aparcado**; URL `/api/media/{opaque}` |
| ADR-033 | Query `from`/`to` inclusive Monterrey; tope 366; grain ADR-024 intacto |
| SEC | Retrofit `hasModulePermission` en `/api/admin/*` (catalogs ya mapea módulo) |

Migración Must: sección + origen local + `ProviderProduct.imageUrl`. Volumen persistente (no Vercel ephemeral).

### Log 28/08/2026 (v0.10.2)

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 28/08/2026 | F10 admin + catálogo local + disco + DASH rango (ADR-029…033, APIs, handoff BE) | `fase-10/`, `comun/` | **Backend**, Frontend, DevOps |

---

*Append Arquitecto — LaBorregaMarket v0.10.2 — diseño F10 28/08/2026.*

### Log 12/09/2026 (v0.11.0)

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 12/09/2026 | F11 1:N + cookie activo + DASH global (ADR-034/035) | `fase-11/`, `comun/` | **Backend** (handoff listo; no activado) |

---

*Append Arquitecto — LaBorregaMarket v0.11.0 — diseño F11 12/09/2026.*

### Log 12/09/2026 (v0.11.0) — QG-correcciones post-QA

QA APROBADO (API 12/12). Contratos y ADR-034/035 intactos. Cookie `lbm_active_provider` httpOnly confirmada. Global `GET /api/provider/reports/global` + 403 N≤1 confirmado. Unique `userId` no se restaura. BUG-017/018 = FE (reconsultar session/mine tras login; no ampliar payload de sesión). SAD no editado.

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 12/09/2026 | QG-correcciones F11: sin cambio de contrato/ADR/datos | `fase-11/quality/QG-correcciones.md` | **PM** (cierre de fase) |

---

*Append Arquitecto — LaBorregaMarket v0.11.0 — QG-correcciones F11 12/09/2026.*

### Log 14/09/2026 (v0.12.0)

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 14/09/2026 | F12 inventario blando Decimal + reserva Encargar (ADR-036/037) | `fase-12/`, `comun/` | **Backend** (handoff listo; no activado) |

---

*Append Arquitecto — LaBorregaMarket v0.12.0 — diseño F12 14/09/2026.*

### Log 15/09/2026 (v0.12.0) — QG-correcciones post-QA

QA APROBADO (API 16/16, E2E 5/5). Contratos y ADR-036/037 intactos. ADR-022 intacto. BUG-019 = Prisma generate EPERM (DLL Next 8080); sin delta de schema. SAD no editado. Fase no promovida. DevOps no lanzado.

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 15/09/2026 | QG-correcciones F12: sin cambio de contrato/ADR/datos | `fase-12/quality/QG-correcciones.md` | **PM** (cierre de fase; espera QG UX) |

---

*Append Arquitecto — LaBorregaMarket v0.12.0 — QG-correcciones F12 15/09/2026.*

### Log 16/09/2026 (v0.13.0) — diseño Fase 13

STATUS Arch reconciliado a fase **13**. ADR-038 aprobado (`archivedAt`, `saleUnit`). Contratos admin/archivo/oferta/precio/inventario/vendible/reportes. Handoff Backend listo. Sin RETORNO-PM. UX paralelo. No se lanzó Backend.

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 16/09/2026 | Diseño F13 + ADR-038 + handoff-backend-fase-13 | `fase-13/`, `comun/` | **Backend** (orquestador activa) |

---

*Append Arquitecto — LaBorregaMarket v0.13.0 — diseño F13 16/09/2026.*

### Log 16/09/2026 (v0.13.0) — QG-correcciones post-QA

QA APROBADO (Playwright 19/19). Contratos y ADR-038 intactos. ADR-022 intacto. BUG-020 = import faltante de `inventoryEntrySchema` en POST entries; 200/409 ya estaban en `API-INVENTORY-13`. SAD no editado. Fase no promovida. DevOps no lanzado.

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 16/09/2026 | QG-correcciones F13: sin cambio de contrato/ADR/datos | `fase-13/quality/QG-correcciones.md` | **PM** (cierre de fase; espera QG UX) |

---

*Append Arquitecto — LaBorregaMarket v0.13.0 — QG-correcciones F13 16/09/2026.*

### Log 17/09/2026 (v0.14.0) — diseño Fase 14

STATUS Arch reconciliado a fase **14**. ADR-039 (`isVerified` intacto), ADR-040 (`InventoryEntry.kind` merma/ajuste; no `InventoryMovement`), ADR-041 (SVG unificado, cero npm charts). Contratos settings/perfil/precio/sección/inventario/reportes. Handoff Backend listo. Sin RETORNO-PM. UX paralelo. No se lanzó Backend. Sin env nueva.

| Fecha | Actividad | Entregable | Destino |
|-------|-----------|------------|---------|
| 17/09/2026 | Diseño F14 + ADR-039/040/041 + handoff-backend-fase-14 | `fase-14/`, `comun/` | **Backend** (orquestador activa) |

---

*Append Arquitecto — LaBorregaMarket v0.14.0 — diseño F14 17/09/2026.*





