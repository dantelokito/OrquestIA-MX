# DB-users — Entidad User

> **Entidad:** `users` (Prisma model `User`)  
> **Módulo:** `AUTH`, `USERS`  
> **Fecha:** 05/08/2026

---

## Esquema

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (cuid) | PRIMARY KEY, NOT NULL | Identificador único |
| `email` | `String` | UNIQUE, NOT NULL | Correo electrónico de login |
| `password_hash` | `String` | NOT NULL | Hash bcrypt — nunca exponer en API |
| `name` | `String` | NOT NULL | Nombre completo del usuario |
| `phone` | `String` | NULLABLE | Teléfono de contacto |
| `role` | `UserRole` enum | NOT NULL, DEFAULT `CLIENT` | `CLIENT`, `PROVIDER`, `ADMIN` |
| `is_active` | `Boolean` | NOT NULL, DEFAULT `true` | Cuenta activa/suspendida |
| `created_at` | `DateTime` | NOT NULL, DEFAULT now | Fecha de creación |
| `updated_at` | `DateTime` | NOT NULL, auto-update | Última modificación |

---

## Relaciones

| Relación | Entidad | Cardinalidad | On Delete |
|----------|---------|--------------|-----------|
| `provider` | `Provider` | 0..1 | Cascade (desde Provider) |
| `orders` | `Order` | 0..N | — (cliente) |
| `auditLogs` | `AuditLog` | 0..N | SetNull |

---

## Reglas de dominio

1. **Email único** en todo el sistema.
2. **Password:** mínimo 8 caracteres; hash bcrypt antes de persistir.
3. **Role en registro:** solo `CLIENT` o `PROVIDER` (ADMIN se crea via seed/admin).
4. **PROVIDER sin Provider:** usuario puede existir sin entidad `Provider` tras registro paso 1; debe completar wizard (ADR-001).
5. **is_active=false:** bloquea login (validar en `POST /api/auth/login`).
6. **Email no editable** en MVP (`PATCH /api/users/me` no acepta email).

---

## Perfiles y permisos

| Rol | Descripción | Rutas principales |
|-----|-------------|-------------------|
| `CLIENT` | Cliente final — explora y contacta | `/cuenta`, `/explorar` |
| `PROVIDER` | Dueño de frutería — gestiona catálogo | `/proveedor` |
| `ADMIN` | Operador plataforma | `/admin` |

---

## API expuesta (sin password)

```json
{
  "id": "clx...",
  "email": "maria@demo.mx",
  "name": "María García",
  "phone": "+528112345678",
  "role": "CLIENT"
}
```

**Nunca incluir:** `passwordHash`, `password_hash`.

---

## Cuentas demo (seed)

| Email | Rol | Password |
|-------|-----|----------|
| `cliente@demo.mx` | CLIENT | `Demo1234!` |
| `frutas@elparaiso.mx` | PROVIDER | `Demo1234!` |
| `admin@laborregamarket.mx` | ADMIN | `Demo1234!` |

---

## Índices

| Índice | Campos | Estado |
|--------|--------|--------|
| PK | `id` | Existe |
| UK | `email` | Existe (unique constraint) |

No se requieren índices adicionales para MVP.

---

## Referencias

- API: [`../api/API-AUTH-01.md`](../api/API-AUTH-01.md), [`../api/API-USERS-01.md`](../api/API-USERS-01.md)
- Auth flow: [`../diagrams/ARCH-AUTH-01.md`](../diagrams/ARCH-AUTH-01.md)
- Schema: `LaBorregaMarket/prisma/schema.prisma` (model `User`)
