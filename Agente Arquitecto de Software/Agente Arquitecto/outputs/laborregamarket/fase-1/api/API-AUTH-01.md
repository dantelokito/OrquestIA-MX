# API-AUTH-01 — Contratos de autenticación

> **Módulo:** `AUTH`  
> **Versión:** 0.1.0  
> **Fecha:** 05/08/2026

---

## POST `/api/auth/login`

> **Descripción:** Autenticar usuario con email y password.  
> **Autenticación:** Pública

#### Body de Solicitud (Request Payload):

```json
{
  "email": "string (requerido, formato email)",
  "password": "string (requerido, min 8 caracteres)"
}
```

#### Respuestas del Servidor:

* **200 Success:**

```json
{
  "data": {
    "user": {
      "id": "clx...",
      "email": "maria@demo.mx",
      "name": "María García",
      "role": "CLIENT"
    }
  }
}
```

Cookie `httpOnly` con JWT incluida en `Set-Cookie`. El campo `token` en body es opcional (legacy); la UI debe depender de la cookie.

* **400 Bad Request:** Validación Zod fallida.

```json
{
  "error": "Contraseña mínima 8 caracteres",
  "details": [{ "field": "password", "message": "Contraseña mínima 8 caracteres" }]
}
```

* **401 Unauthorized:** Credenciales inválidas (mensaje genérico — no revelar si email existe).

```json
{ "error": "Credenciales inválidas" }
```

* **500 Internal Error:**

```json
{ "error": "Error interno" }
```

#### Side effects

- `AuditLog`: `module=AUTH`, `action=LOGIN`, `userId=sub`

#### Redirect post-login (UI)

| Rol | Default | Query `?redirect=` |
|-----|---------|-------------------|
| CLIENT | `/cuenta` | Path interno validado |
| PROVIDER | `/proveedor` o wizard paso 2 | — |
| ADMIN | `/admin` | — |

---

## POST `/api/auth/register`

> **Descripción:** Crear cuenta CLIENT o PROVIDER (paso 1).  
> **Autenticación:** Pública

#### Body de Solicitud:

```json
{
  "name": "string (requerido, min 2)",
  "email": "string (requerido, formato email, único)",
  "password": "string (requerido, min 8)",
  "phone": "string (opcional)",
  "role": "CLIENT | PROVIDER (default CLIENT)"
}
```

#### Respuestas:

* **201 Created:**

```json
{
  "data": {
    "user": {
      "id": "clx...",
      "email": "carlos@fruteria.mx",
      "name": "Carlos Méndez",
      "role": "PROVIDER"
    }
  }
}
```

Cookie JWT incluida. Si `role=PROVIDER`, UI redirige a wizard paso 2 (no a `/proveedor` directamente).

* **400 Bad Request:** Validación fallida.

* **409 Conflict:** Email duplicado.

```json
{ "error": "El email ya está registrado" }
```

* **500 Internal Error**

#### Side effects

- `AuditLog`: `module=USERS`, `action=CREATE`, `entityId=user.id`

---

## POST `/api/auth/logout`

> **Descripción:** Cerrar sesión y eliminar cookie JWT.  
> **Autenticación:** Opcional (funciona con o sin sesión activa)

#### Body: vacío

#### Respuestas:

* **200 Success:**

```json
{ "data": { "message": "Sesión cerrada" } }
```

Cookie JWT eliminada (`maxAge=0`).

#### Side effects

- `AuditLog`: `module=AUTH`, `action=LOGOUT` (si había sesión)

---

## Validación `redirect` param (BL-010)

Aplica en login UI al procesar `?redirect=/ruta`.

| Regla | Ejemplo válido | Ejemplo inválido |
|-------|----------------|------------------|
| Empieza con `/` | `/explorar` | `explorar` |
| Sin `//` al inicio | `/cuenta` | `//evil.com` |
| Sin protocolo | `/fruteria/abc` | `https://evil.com` |

Si inválido → ignorar y usar redirect default por rol.

---

## Cookie JWT

| Atributo | Valor |
|----------|-------|
| `httpOnly` | `true` |
| `secure` | `true` en production |
| `sameSite` | `lax` |
| `maxAge` | 604800 (7 días) |
| `path` | `/` |

---

## Cambios requeridos vs código actual

| Item | Estado actual | Acción |
|------|---------------|--------|
| Password min login | 6 chars | Unificar a 8 (BL-009) |
| Register PROVIDER | No crea Provider | Wizard paso 2 → `POST /api/providers` (BL-002) |
| Error envelope | `{ error: string }` | Migrar a envelope estándar con `details` opcional |

---

## Referencias

- Auth flow: [`../diagrams/ARCH-AUTH-01.md`](../diagrams/ARCH-AUTH-01.md)
- User entity: [`../data-model/DB-users.md`](../data-model/DB-users.md)
- ADR onboarding: [`../adrs/ADR-001-provider-onboarding-two-step.md`](../adrs/ADR-001-provider-onboarding-two-step.md)
