# API-ADMIN-01 — Operación administrativa

> **Módulo:** `ADMIN`, `AUDIT`, `PERMISSIONS`  
> **Versión:** 0.1.0  
> **Fecha:** 05/08/2026

---

## GET `/api/catalogs`

> **Descripción:** Consultar catálogos del sistema (read-only MVP).  
> **Autenticación:** Requerida — Rol `ADMIN`  
> **Estado:** Existe (ruta legacy; futuro alias `/api/admin/catalogs`)

#### Query Parameters:

| Param | Valores | Descripción |
|-------|---------|-------------|
| `catalog` | `users`, `providers`, `products`, `provider-products`, `orders`, `modules`, `role-permissions` | Catálogo a consultar |

#### Respuestas:

* **200 Success:**

```json
{
  "data": [
    { "id": "clx...", "email": "admin@laborregamarket.mx", "role": "ADMIN" }
  ]
}
```

Estructura varía por catálogo — ver implementación actual en `src/app/api/catalogs/route.ts`.

* **400 Bad Request:** `catalog` param inválido o faltante.

* **401 Unauthorized**

* **403 Forbidden:** Sin permiso `hasModulePermission(ADMIN, module, "view")`.

---

## GET `/api/admin/providers`

> **Descripción:** Listar proveedores para verificación admin.  
> **Autenticación:** Requerida — Rol `ADMIN`  
> **Estado:** **Nuevo**

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `verified` | boolean | — | Filtrar por `isVerified` |
| `page` | number | `1` | Página |
| `limit` | number | `20` | Items por página |

#### Respuestas:

* **200 Success:**

```json
{
  "data": [
    {
      "id": "clx...",
      "businessName": "Frutas El Paraíso",
      "city": "Monterrey",
      "phone": "+528112345678",
      "isVerified": true,
      "isActive": true,
      "userEmail": "frutas@elparaiso.mx",
      "createdAt": "2026-01-15T10:00:00.000Z"
    },
    {
      "id": "clx...",
      "businessName": "La Borrega Agrícola",
      "city": "Santa Catarina",
      "phone": "+528117776655",
      "isVerified": false,
      "isActive": true,
      "userEmail": "borrega@agricola.mx",
      "createdAt": "2026-02-20T14:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

* **401** / **403**

---

## PATCH `/api/admin/providers/[id]`

> **Descripción:** Verificar o desverificar proveedor manualmente.  
> **Autenticación:** Requerida — Rol `ADMIN`  
> **Estado:** **Nuevo**

#### Body de Solicitud:

```json
{
  "isVerified": "boolean (requerido)"
}
```

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "id": "clx...",
    "businessName": "La Borrega Agrícola",
    "isVerified": true
  }
}
```

* **404 Not Found:** Provider no existe.

* **400 Bad Request:** Body inválido.

* **401** / **403**

#### Side effects

- `AuditLog`: `module=PROVIDERS`, `action=UPDATE`, `details={ isVerified: true }`

---

## GET `/api/admin/audit`

> **Descripción:** Bitácora de actividad paginada.  
> **Autenticación:** Requerida — Rol `ADMIN`  
> **Estado:** **Nuevo**

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | number | `1` | Página |
| `limit` | number | `20` | Items por página (max 100) |
| `module` | SystemModule | — | Filtrar por módulo |
| `action` | AuditAction | — | Filtrar por acción |
| `userId` | string | — | Filtrar por usuario |

#### Respuestas:

* **200 Success:**

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
      "userEmail": "cliente@demo.mx",
      "details": null,
      "ipAddress": "192.168.1.1",
      "createdAt": "2026-08-05T18:00:00.000Z"
    },
    {
      "id": "clx...",
      "module": "PRODUCTS",
      "action": "ENABLE",
      "entityId": "clx...",
      "userId": "clx...",
      "userName": "Carlos Méndez",
      "userEmail": "frutas@elparaiso.mx",
      "details": { "productId": "clx...", "price": 45 },
      "ipAddress": null,
      "createdAt": "2026-08-05T17:55:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Orden:** `createdAt DESC`

* **401** / **403**

---

## Tab admin UI mapping

| Tab | Endpoint |
|-----|----------|
| Catálogos | `GET /api/catalogs?catalog={name}` |
| Proveedores | `GET /api/admin/providers` + `PATCH /api/admin/providers/[id]` |
| Bitácora | `GET /api/admin/audit` |

---

## Referencias

- Audit entity: [`../data-model/DB-audit-permissions.md`](../data-model/DB-audit-permissions.md)
- Provider entity: [`../data-model/DB-providers.md`](../data-model/DB-providers.md)
- UX: `WF-admin-panel.md`, `UF-ADMIN-01-operacion.md`
