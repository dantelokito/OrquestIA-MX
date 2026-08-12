# ARCH-AUTH-01 — Flujo de autenticación y autorización

> **Componente / Flujo:** JWT + RBAC + guards API  
> **Fecha:** 05/08/2026

---

## Flujo de login

```mermaid
sequenceDiagram
  participant UI as Login_Page
  participant API as POST_api_auth_login
  participant Auth as lib_auth
  participant DB as PostgreSQL
  participant Audit as writeAuditLog

  UI->>API: email + password
  API->>Auth: validate + compare bcrypt
  Auth->>DB: user.findUnique email
  DB-->>Auth: User o null
  alt Credenciales invalidas
    Auth-->>API: 401
    API-->>UI: error Credenciales invalidas
  else Credenciales validas
    Auth->>Auth: signToken sub email role name
    API->>Audit: LOGIN
    API-->>UI: 200 + Set-Cookie httpOnly JWT
    UI->>UI: Redirect por rol
  end
```

---

## Redirect post-login por rol

| Rol | Destino default | Override |
|-----|-----------------|----------|
| `CLIENT` | `/cuenta` o `redirect` param | `?redirect=/explorar` |
| `PROVIDER` | `/proveedor` | Sin Provider → wizard paso 2 |
| `ADMIN` | `/admin` | — |

**Validación `redirect`:** Solo paths internos que empiecen con `/`, sin `//`, sin `http://` ni `https://`.

```typescript
// Patrón de validación (referencia Backend)
function isValidRedirect(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}
```

---

## Cookie JWT

| Atributo | Valor |
|----------|-------|
| Nombre | Definido en `TOKEN_COOKIE` (`lib/auth/token`) |
| `httpOnly` | `true` |
| `secure` | `true` en `NODE_ENV=production` |
| `sameSite` | `lax` |
| `maxAge` | 7 días (604800 segundos) |
| `path` | `/` |

**Payload JWT:**

```json
{
  "sub": "user_cuid",
  "email": "user@example.com",
  "role": "CLIENT | PROVIDER | ADMIN",
  "name": "Nombre Usuario",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Doble capa de protección

```mermaid
flowchart TB
  subgraph pages [Proteccion Paginas]
    MW["middleware.ts"]
    MW --> CheckCookie{"Cookie JWT valida?"}
    CheckCookie -->|No + ruta protegida| RedirectLogin["Redirect /login"]
    CheckCookie -->|Si| CheckRolePage{"Rol permite ruta?"}
    CheckRolePage -->|No| RedirectHome["Redirect / o panel rol"]
    CheckRolePage -->|Si| AllowPage["next()"]
  end

  subgraph api [Proteccion API]
    Handler["Route Handler"]
    Handler --> GetSession["getSession(request)"]
    GetSession --> RequireRole["requireRole(session, ROLE)"]
    RequireRole -->|AuthError| JSON401["401/403 JSON"]
    RequireRole -->|OK| BusinessLogic["Logica negocio"]
  end
```

**Importante:** `middleware.ts` retorna `next()` para rutas `/api/*`. Los guards **deben** estar en cada route handler protegido (BL-008).

---

## Matriz de autorización API

| Ruta | Método | Auth | Rol mínimo |
|------|--------|------|------------|
| `/api/auth/login` | POST | Público | — |
| `/api/auth/register` | POST | Público | — |
| `/api/auth/logout` | POST | Opcional | Cualquiera autenticado |
| `/api/providers` | GET | Público | — |
| `/api/providers` | POST | Requerida | PROVIDER (sin Provider previo) |
| `/api/providers/[id]` | GET | Público | — |
| `/api/provider/me` | GET | Requerida | PROVIDER |
| `/api/provider/products` | GET, PATCH | Requerida | PROVIDER |
| `/api/users/me` | GET, PATCH | Requerida | CLIENT |
| `/api/catalogs` | GET | Requerida | ADMIN |
| `/api/admin/*` | * | Requerida | ADMIN |

---

## RBAC granular (ADMIN)

Para operaciones admin sensibles, además de `requireRole(ADMIN)`:

```typescript
await hasModulePermission(session.role, SystemModule.USERS, "view");
```

Matriz en DB: `modules` + `role_permissions` (seed en `prisma/seed.ts`).

---

## Eventos de auditoría AUTH

| Acción | `AuditAction` | Cuándo |
|--------|---------------|--------|
| Login exitoso | `LOGIN` | POST login 200 |
| Logout | `LOGOUT` | POST logout |
| Registro | `CREATE` | POST register 201 (módulo USERS) |

---

## Referencias

- Contrato API: [`../api/API-AUTH-01.md`](../api/API-AUTH-01.md)
- Entidad User: [`../data-model/DB-users.md`](../data-model/DB-users.md)
- Permisos código: `LaBorregaMarket/src/lib/auth/permissions.ts`
