# Handoff Backend Developer — LaBorregaMarket v0.1.0

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer  
> **Fecha:** 05/08/2026  
> **Prioridad:** Implementar capa de datos y APIs según contratos documentados

---

## Estado: ENTERADO ✅

La arquitectura está completa. Puedes iniciar implementación de endpoints, migraciones e índices según este handoff y los contratos en `api/API-*.md`.

---

## Punto de entrada

**Lee primero:** [`OBSERVABILITY.md`](./OBSERVABILITY.md) — hub central con índice, gaps y decisiones.

Luego consulta los contratos API específicos según el backlog item que implementes.

---

## Orden de implementación (sprint 1)

```
1. BL-002  POST /api/providers + GET /api/provider/me
2. BL-008  Guards uniformes en todos los route handlers
3. BL-009  Password min 8 en POST /api/auth/login
4. BL-010  Validación redirect param (helper en lib/auth)
5. BL-004  Paginación GET /api/providers + envelope estándar
6. BL-005  GET /api/providers/[id]
7. BL-006  GET/PATCH /api/users/me
8. BL-011  Migración índices Provider + filtro verified
```

### Detalle por item

#### BL-002 — Onboarding proveedor

| Tarea | Referencia |
|-------|------------|
| Crear `POST /api/providers` | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) |
| Crear `GET /api/provider/me` | [`api/API-PROVIDER-01.md`](./api/API-PROVIDER-01.md) |
| Validar bounding box Monterrey | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |
| 409 si Provider ya existe | ADR-001 |
| AuditLog CREATE en PROVIDERS | [`data-model/DB-audit-permissions.md`](./data-model/DB-audit-permissions.md) |

**Sugerencia:** Crear `lib/services/provider.service.ts` con `createProvider(userId, data)`.

#### BL-008 — Guards API

| Tarea | Referencia |
|-------|------------|
| Verificar `requireRole` en TODOS los handlers protegidos | [`diagrams/ARCH-AUTH-01.md`](./diagrams/ARCH-AUTH-01.md) |
| Rutas públicas: solo GET providers, auth login/register | Matriz autorización |
| Middleware NO protege APIs — guards en handlers | — |

Handlers a auditar:
- `/api/catalogs` ✅ (ya tiene guard)
- `/api/provider/products` ✅ (ya tiene guard)
- Nuevos endpoints: aplicar desde creación

#### BL-009 — Password min 8 login

| Tarea | Referencia |
|-------|------------|
| Cambiar schema Zod login de min 6 a min 8 | [`api/API-AUTH-01.md`](./api/API-AUTH-01.md) |

#### BL-010 — Validación redirect

| Tarea | Referencia |
|-------|------------|
| Crear `isValidRedirect(path)` en `lib/auth/` | [`api/API-AUTH-01.md`](./api/API-AUTH-01.md) |
| Usar en login page o API si procesa redirect | — |

#### BL-004 — Paginación providers

| Tarea | Referencia |
|-------|------------|
| Agregar `page`, `limit`, `verified` query params | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) |
| Migrar response a `{ data, meta }` | ADR-003, ADR-004 |
| **Breaking change:** `providers` → `data` — coordinar con Frontend | — |

#### BL-005 — Detalle frutería

| Tarea | Referencia |
|-------|------------|
| Crear `GET /api/providers/[id]/route.ts` | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) |
| Incluir productos activos | [`data-model/DB-products.md`](./data-model/DB-products.md) |
| 404 si no existe o isActive=false | — |

#### BL-006 — Cuenta cliente

| Tarea | Referencia |
|-------|------------|
| Crear `GET /api/users/me/route.ts` | [`api/API-USERS-01.md`](./api/API-USERS-01.md) |
| Crear `PATCH /api/users/me/route.ts` | [`api/API-USERS-01.md`](./api/API-USERS-01.md) |
| Solo rol CLIENT | Matriz autorización |

#### BL-011 — Índices y filtros

| Tarea | Referencia |
|-------|------------|
| Migración Prisma con índices Provider | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |
| Filtro `?verified=true` en GET providers | [`api/API-PROVIDERS-01.md`](./api/API-PROVIDERS-01.md) |

---

## Endpoints admin (post sprint 1)

| Endpoint | Prioridad | Referencia |
|----------|-----------|------------|
| `GET /api/admin/providers` | Should | [`api/API-ADMIN-01.md`](./api/API-ADMIN-01.md) |
| `PATCH /api/admin/providers/[id]` | Should | [`api/API-ADMIN-01.md`](./api/API-ADMIN-01.md) |
| `GET /api/admin/audit` | Should | [`api/API-ADMIN-01.md`](./api/API-ADMIN-01.md) |

---

## Estructura de código sugerida

```
src/
├── app/api/
│   ├── auth/           (existente — ajustar)
│   ├── providers/
│   │   ├── route.ts    (extender paginación)
│   │   └── [id]/route.ts  (nuevo)
│   ├── provider/
│   │   ├── me/route.ts    (nuevo)
│   │   └── products/      (existente)
│   ├── users/
│   │   └── me/route.ts    (nuevo)
│   └── admin/
│       ├── providers/     (nuevo)
│       └── audit/           (nuevo)
├── lib/
│   ├── auth/           (existente — agregar isValidRedirect)
│   ├── services/       (nuevo)
│   │   ├── provider.service.ts
│   │   ├── user.service.ts
│   │   └── pagination.ts
│   └── api/
│       └── response.ts  (helpers envelope estándar)
```

### Helper envelope (sugerencia)

```typescript
// lib/api/response.ts
export function ok<T>(data: T) {
  return NextResponse.json({ data });
}

export function paginated<T>(data: T[], meta: PaginationMeta) {
  return NextResponse.json({ data, meta });
}

export function error(message: string, status: number, details?: FieldError[]) {
  return NextResponse.json({ error: message, ...(details && { details }) }, { status });
}
```

---

## Envelope estándar (obligatorio en endpoints nuevos)

Ver [`adrs/ADR-003-error-envelope.md`](./adrs/ADR-003-error-envelope.md).

---

## Validaciones Zod requeridas

| Campo | Regla | Endpoint |
|-------|-------|----------|
| `password` | min 8 | login, register |
| `email` | formato + único | register |
| `businessName` | min 2 | POST providers |
| `address` | required | POST providers |
| `latitude/longitude` | bounding box Monterrey | POST providers |
| `price` | >= 0, 2 decimales | PATCH provider/products |
| `redirect` | path interno | login UI |

---

## Eventos AuditLog a registrar

| Módulo | Acción | Trigger |
|--------|--------|---------|
| AUTH | LOGIN | login 200 |
| AUTH | LOGOUT | logout |
| USERS | CREATE | register |
| PROVIDERS | CREATE | POST providers |
| PROVIDERS | UPDATE | PATCH admin verify |
| PRODUCTS | ENABLE/DISABLE | PATCH provider/products |

---

## Migración Prisma pendiente

```prisma
model Provider {
  // ... campos existentes ...
  @@index([city])
  @@index([businessName])
  @@index([isActive, isVerified])
}
```

Ejecutar: `npx prisma migrate dev --name add_provider_search_indexes`

---

## Qué NO implementar en esta fase

- Flujo checkout/pedidos (`Order`, `OrderItem`) — Fase 2
- OAuth, recuperación password
- Upload imágenes (S3/Cloudinary)
- Rate limiting / Redis
- `GET /api/health`
- Versionado `/api/v1/`

---

## Checklist DoD Arquitectura (verificar al completar)

- [ ] **Seguridad:** Ningún endpoint protegido sin `requireRole`.
- [ ] **Rendimiento:** Índices aplicados; listados paginados.
- [ ] **Escalabilidad:** Envelope estándar en endpoints nuevos.
- [ ] **Modularidad:** Lógica en `lib/services/`, handlers delgados.
- [ ] **Errores:** 400/401/403/404/409/500 con `{ error, details? }`.

---

## Referencias cruzadas

| Documento | Ubicación |
|-----------|-----------|
| Hub arquitectura | [`OBSERVABILITY.md`](./OBSERVABILITY.md) |
| SAD | [`sad.md`](./sad.md) |
| Modelo datos | [`data-model/`](./data-model/) |
| Contratos API | [`api/`](./api/) |
| ADRs | [`adrs/`](./adrs/) |
| Infra | [`infra-requirements.md`](./infra-requirements.md) |
| UX handoff | UX `outputs/laborregamarket/handoff-backend.md` |
| Código base | `C:\Users\PC GAMER\LaBorregaMarket` |
| Schema Prisma | `LaBorregaMarket/prisma/schema.prisma` |

---

*Handoff generado por Agente Arquitecto de Software — LaBorregaMarket v0.1.0.*
