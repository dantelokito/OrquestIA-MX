# API-USERS-01 — Cuenta cliente

> **Módulo:** `USERS`  
> **Versión:** 0.1.0  
> **Fecha:** 05/08/2026

---

## GET `/api/users/me`

> **Descripción:** Obtener perfil del cliente autenticado.  
> **Autenticación:** Requerida — Rol `CLIENT`  
> **Estado:** **Nuevo** (BL-006)

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "id": "clx...",
    "name": "María García",
    "email": "cliente@demo.mx",
    "phone": "+528112345678",
    "role": "CLIENT"
  }
}
```

**Nunca incluir:** `passwordHash`, `isActive` (interno).

* **401 Unauthorized:** Sin sesión — UI redirect `/login?redirect=/cuenta`.

* **403 Forbidden:** Rol no es CLIENT (PROVIDER/ADMIN redirigen a su panel).

* **500 Internal Error**

---

## PATCH `/api/users/me`

> **Descripción:** Actualizar perfil del cliente.  
> **Autenticación:** Requerida — Rol `CLIENT`  
> **Estado:** **Nuevo** (BL-006)

#### Body de Solicitud:

```json
{
  "name": "string (opcional, min 2)",
  "phone": "string (opcional, puede ser null para eliminar)"
}
```

**No acepta:** `email` (no editable en MVP), `role`, `password`.

#### Respuestas:

* **200 Success:**

```json
{
  "data": {
    "id": "clx...",
    "name": "María García López",
    "email": "cliente@demo.mx",
    "phone": "+528119998877",
    "role": "CLIENT"
  }
}
```

* **400 Bad Request:**

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "Nombre requerido" }
  ]
}
```

* **401 Unauthorized**

* **403 Forbidden**

* **500 Internal Error**

#### Side effects

- `AuditLog`: `module=USERS`, `action=UPDATE`, `entityId=user.id` (opcional MVP)

---

## Uso en UI (`/cuenta`)

| Sección | Fuente |
|---------|--------|
| Perfil (nombre, email, teléfono) | `GET /api/users/me` |
| Guardar cambios | `PATCH /api/users/me` |
| Pedidos | Placeholder Fase 2 — sin API |

**Email:** Mostrar read-only en formulario.

---

## Referencias

- User entity: [`../data-model/DB-users.md`](../data-model/DB-users.md)
- UX: `WF-cuenta-cliente.md`, `UF-CLIENT-03-cuenta.md`
