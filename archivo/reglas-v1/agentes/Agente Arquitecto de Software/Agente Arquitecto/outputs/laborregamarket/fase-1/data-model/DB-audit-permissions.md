# DB-audit-permissions — AuditLog, Module, RolePermission

> **Entidades:** `audit_logs`, `modules`, `role_permissions`  
> **Módulos:** `AUDIT`, `PERMISSIONS`  
> **Fecha:** 10/08/2026  
> **Versión:** 0.2.0 — + `CONTACT`, `MEDIA_UPLOAD` (Fase 2)

---

## AuditLog — Bitácora de actividad

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador del registro |
| `module` | `SystemModule` | NOT NULL | Módulo afectado |
| `action` | `AuditAction` | NOT NULL | Tipo de acción |
| `entity_id` | `String` | NULLABLE | ID de entidad afectada |
| `user_id` | `String` | FK → `users.id`, NULLABLE | Usuario que realizó la acción |
| `details` | `Json` | NULLABLE | Metadata adicional |
| `ip_address` | `String` | NULLABLE | IP del request (opcional) |
| `created_at` | `DateTime` | NOT NULL, DEFAULT now | Timestamp del evento |

### AuditAction

| Valor | Uso |
|-------|-----|
| `CREATE` | Registro usuario, creación Provider |
| `UPDATE` | Cambio precio, verificación proveedor |
| `DELETE` | — (roadmap) |
| `LOGIN` | Login exitoso |
| `LOGOUT` | Logout |
| `ENABLE` | Activar producto proveedor |
| `DISABLE` | Desactivar producto proveedor |
| `VIEW` | — (roadmap) |
| `CONTACT` | **Fase 2** — contacto cliente → frutería ([ADR-007](../adrs/ADR-007-contact-audit-action.md)) |
| `MEDIA_UPLOAD` | **Fase 2** — upload logo/cover/imagen producto |

### Eventos registrados

| Módulo | Acciones | Trigger |
|--------|----------|---------|
| `AUTH` | LOGIN, LOGOUT | login/logout API |
| `USERS` | CREATE | register API |
| `PRODUCTS` | ENABLE, DISABLE, **MEDIA_UPLOAD** | PATCH provider/products; `POST /api/admin/products/[id]/image` |
| `PROVIDERS` | CREATE, UPDATE, **CONTACT**, **MEDIA_UPLOAD** | onboarding; verify; `POST .../contact`; `POST /api/provider/media` |

### `details` Fase 2 — CONTACT

Ver shapes completos en [ADR-007](../adrs/ADR-007-contact-audit-action.md). Resumen:

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

Sin PII del cliente. `reason`: `no_email` | `send_failed` | `email_disabled` | `rate_limited`.

### `details` Fase 2 — MEDIA_UPLOAD

```json
{
  "field": "logoUrl",
  "url": "https://res.cloudinary.com/.../logo.jpg",
  "bytes": 120456,
  "mimeType": "image/jpeg",
  "replacedPrevious": true
}
```

### Índices

```prisma
@@index([module, createdAt])
@@index([userId])
```

Soportan paginación admin: `GET /api/admin/audit?module=AUTH&page=1&limit=20`

---

## Module — Catálogo de módulos del sistema

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY | Identificador |
| `code` | `SystemModule` | UNIQUE, NOT NULL | Código enum |
| `name` | `String` | NOT NULL | Nombre legible |
| `description` | `String` | NULLABLE | Descripción |
| `is_active` | `Boolean` | DEFAULT `true` | Módulo habilitado |
| `created_at` | `DateTime` | NOT NULL | Fecha creación |

### SystemModule (7 módulos seed)

`USERS`, `PROVIDERS`, `PRODUCTS`, `ORDERS`, `PERMISSIONS`, `AUTH`, `AUDIT`

---

## RolePermission — Matriz RBAC

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY | Identificador |
| `role` | `UserRole` | NOT NULL | Rol del usuario |
| `module_id` | `String` | FK → `modules.id` | Módulo |
| `can_view` | `Boolean` | DEFAULT `false` | Permiso lectura |
| `can_create` | `Boolean` | DEFAULT `false` | Permiso creación |
| `can_edit` | `Boolean` | DEFAULT `false` | Permiso edición |
| `can_delete` | `Boolean` | DEFAULT `false` | Permiso eliminación |
| `created_at` | `DateTime` | NOT NULL | — |
| `updated_at` | `DateTime` | NOT NULL | — |

### Constraint

```prisma
@@unique([role, moduleId])
```

---

## Matriz rol × módulo (referencia)

| Módulo | CLIENT | PROVIDER | ADMIN |
|--------|--------|----------|-------|
| `USERS` | — | — | CRUD |
| `PROVIDERS` | — | — | CRUD |
| `PRODUCTS` | Ver | Ver + Editar | CRUD |
| `ORDERS` | Ver + Crear* | Ver + Crear* | CRUD |
| `PERMISSIONS` | — | — | CRUD |
| `AUTH` | Propio | Propio | CRUD |
| `AUDIT` | — | — | CRUD |

\* Pedidos in-app diferidos — Fase 3 (Fase 2 = contacto directo, sin `POST /api/orders`).

---

## Uso en código

### Guards por rol (handlers)

```typescript
requireRole(getSession(request), UserRole.ADMIN);
```

### Permisos granulares (ADMIN)

```typescript
await hasModulePermission(session.role, SystemModule.USERS, "view");
```

Usado en `GET /api/catalogs` para verificar acceso al catálogo solicitado.

---

## API admin audit (nuevo)

```
GET /api/admin/audit?page=1&limit=20&module=AUTH&action=LOGIN
```

**Response:**

```json
{
  "data": [
    {
      "id": "clx...",
      "module": "AUTH",
      "action": "LOGIN",
      "entityId": null,
      "userId": "clx...",
      "userName": "María García",
      "details": { "email": "maria@demo.mx" },
      "createdAt": "2026-08-05T18:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

Orden: `createdAt DESC`.

---

## Referencias

- Auth guards: [`../diagrams/ARCH-AUTH-01.md`](../diagrams/ARCH-AUTH-01.md)
- API admin: [`../api/API-ADMIN-01.md`](../api/API-ADMIN-01.md)
- ADR-007: [`../adrs/ADR-007-contact-audit-action.md`](../adrs/ADR-007-contact-audit-action.md)
- API notify/media: [`../api/API-NOTIFY-01.md`](../api/API-NOTIFY-01.md), [`../api/API-MEDIA-01.md`](../api/API-MEDIA-01.md)
- Permisos código: `LaBorregaMarket/src/lib/auth/permissions.ts`
- Audit helper: `LaBorregaMarket/src/lib/audit.ts`
