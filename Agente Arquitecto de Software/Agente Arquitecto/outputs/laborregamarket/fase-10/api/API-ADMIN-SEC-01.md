# API-ADMIN-SEC-01 — RBAC por módulo, último ADMIN e higiene

> **Endpoints:** `GET /api/catalogs`, todas las `/api/admin/*` existentes y nuevas F10  
> **Módulo:** `PERMISSIONS`, `AUDIT`, `ADMIN`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-SEC-01, US-SEC-02, US-SEC-03  
> **ADR:** [`../../comun/adrs/ADR-031-last-admin.md`](../../comun/adrs/ADR-031-last-admin.md), [`../../comun/adrs/ADR-003-error-envelope.md`](../../comun/adrs/ADR-003-error-envelope.md)  
> **Autenticación:** JWT cookie httpOnly (ADR-025)  
> **Base:** [`../../fase-1/api/API-ADMIN-01.md`](../../fase-1/api/API-ADMIN-01.md) (solo lectura)

## Inputs Utilizados

- **PRD:** `Administrador de producto/.../fase-10/prd.md`
- **US:** `US-SEC-01` … `03`
- **Código:** `src/app/api/catalogs/route.ts`, `src/lib/services/catalog.service.ts`, `src/lib/auth/permissions.ts`

---

## Dual RBAC

Toda ruta admin cumple **en este orden**:

1. Sin cookie / JWT inválido → **401**.
2. `requireRole(ADMIN)` falla (CLIENT/PROVIDER) → **403**.
3. `hasModulePermission(session.role, module, action)` falla → **403** `{ "error": "Sin permiso para este módulo" }`.

`GET /api/catalogs` **ya** mapea catálogo → `SystemModule` (OBS-004/002). F10 **no** relaja ese mapa. El hueco Must es el retrofit de `/api/admin/*`, que hoy solo hace `requireRole(ADMIN)`.

### Mapa catalog query → módulo (OBS-002 aliases)

| `?catalog=` | `SystemModule` | Acción |
|-------------|----------------|--------|
| `users` | `USERS` | view |
| `providers` | `PROVIDERS` | view |
| `products` | `PRODUCTS` | view |
| `provider-products` | `PRODUCTS` | view |
| `orders` | `ORDERS` | view |
| `modules` | `PERMISSIONS` | view |
| `permissions` / `role-permissions` | `PERMISSIONS` | view |
| `audit` | `AUDIT` | view |

`GET /api/catalogs` sin query sigue listando nombres (solo ADMIN + no exige módulo concreto).

`GET /api/catalogs?catalog=products` en F10 serializa **solo** `Product.scope=GLOBAL` (los LOCAL no son catálogo de plataforma).

### Mapa `/api/admin/*` → módulo

| Ruta | Método | Módulo | Acción |
|------|--------|--------|--------|
| `/api/admin/providers` | GET | `PROVIDERS` | view |
| `/api/admin/providers/[id]` | PATCH | `PROVIDERS` | edit |
| `/api/admin/audit` | GET | `AUDIT` | view |
| `/api/admin/analytics` | GET | `ORDERS` | view |
| `/api/admin/reviews/[id]` | DELETE | `ORDERS` | delete |
| `/api/admin/products` | GET | `PRODUCTS` | view |
| `/api/admin/products` | POST | `PRODUCTS` | create |
| `/api/admin/products/[id]` | PATCH | `PRODUCTS` | edit |
| `/api/admin/products/[id]/image` | POST | `PRODUCTS` | edit |

No se añade valor nuevo a `SystemModule` (Won't matriz UI).

---

## GET `/api/catalogs` — sin cambio de path

Envelope ADR-003. 400 catálogo inválido. 401/403 según dual RBAC.

---

## Último ADMIN (US-SEC-02)

No hay CRUD de usuarios Must F10. Helper `assertNotLastAdmin` (ADR-031): si una mutación dejara 0 ADMIN activos → **409**.

```json
{
  "error": "Debe existir al menos un administrador activo",
  "details": [{ "field": "role", "message": "No se puede quitar el último administrador" }]
}
```

Sin auto-escalada: CLIENT/PROVIDER no escriben `User.role=ADMIN`. Password **nunca** en `AuditLog.details`.

AUDIT Must en escrituras F10: `CREATE` / `UPDATE` / `DISABLE` / `MEDIA_UPLOAD` con `entityId` + `userId`.

---

## Higiene demo (US-SEC-03)

Criterio: `NODE_ENV=production` → la UI de `/login` y `/registro` **no** lista emails/contraseñas demo. Es Must **Frontend**. Backend no expone un endpoint de “cuentas demo”.

Tests BE Must (DEV-P2-011): **cada** ruta **nueva** F10:

| Caso | Esperado |
|------|----------|
| Sin cookie | 401 |
| Cookie CLIENT o PROVIDER en ruta solo-ADMIN | 403 |
| PROVIDER en ruta de **otro** `providerId` | 403 |

---

## Códigos

| HTTP | Uso |
|------|-----|
| 401 | Sin sesión |
| 403 | Rol o permiso de módulo insuficiente; IDOR |
| 409 | Último ADMIN |

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Guard | `src/lib/auth/require-admin-module.ts` (`requireRole` + `hasModulePermission`) |
| Último ADMIN | `src/lib/auth/assert-not-last-admin.ts` |
| Catalogs | Ya usa `getCatalogModule`; filtrar products GLOBAL |
| Admin routes | Envolver handlers existentes con el guard |

---

## Fuera de alcance

CRUD usuarios, 2FA, impersonation, editar matriz `RolePermission` por API.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-ADMIN-SEC-01.md`
- **Agente Downstream:** Backend Developer
