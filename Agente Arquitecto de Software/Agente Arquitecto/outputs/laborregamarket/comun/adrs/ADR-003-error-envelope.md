# ADR-003 — Envelope JSON estándar para respuestas API

> **Estado:** Aceptado  
> **Fecha:** 05/08/2026  
> **Decisores:** Arquitecto de Software, UX/UI Designer

---

## Contexto

Los endpoints existentes retornan estructuras inconsistentes:

- Login: `{ token, user }`
- Providers: `{ providers, total }`
- Errors: `{ error: string }` sin detalles de campo

El UX Designer requiere errores inline por campo (`details[]`) y el Frontend necesita estructura predecible para manejar estados Loading/Error/Success.

## Decisión

Adoptar **envelope JSON homogéneo** para todas las respuestas API (nuevas y migradas):

### Éxito — recurso único

```json
{
  "data": { "id": "cuid", "...": "..." }
}
```

### Éxito — lista paginada

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

### Error

```json
{
  "error": "Mensaje legible para el usuario",
  "details": [
    { "field": "email", "message": "Email inválido" }
  ]
}
```

`details` es opcional — omitir en errores simples (401, 404, 500).

## Alternativas consideradas

### A) Mantener respuestas ad-hoc por endpoint

- **Pros:** Sin refactor de código existente.
- **Contras:** Frontend necesita lógica especial por endpoint; difícil de mantener.

### B) Envelope con `success: boolean`

```json
{ "success": true, "data": {}, "error": null }
```

- **Pros:** Flag explícito.
- **Contras:** Redundante con código HTTP; más verboso.

## Consecuencias

### Positivas

- Frontend puede crear helpers genéricos (`apiClient.get<T>()`).
- Errores de validación Zod mapeables a `details[]` para `aria-live`.
- Paginación consistente con `meta`.

### Negativas

- Endpoints existentes requieren migración gradual.
- Respuestas ligeramente más verbosas.

## Migración

| Endpoint | Estado | Acción |
|----------|--------|--------|
| Nuevos (`/api/providers/[id]`, `/api/users/me`, etc.) | — | Usar envelope desde día 1 |
| `GET /api/providers` | `{ providers, total }` | Migrar a `{ data, meta }` |
| `POST /api/auth/login` | `{ token, user }` | Migrar a `{ data: { user } }` — cookie sigue siendo fuente de sesión |
| Errors existentes | `{ error }` | Agregar `details` donde aplique |

## Códigos HTTP estándar

| Código | Uso | Body |
|--------|-----|------|
| 200 | Éxito GET/PATCH | `{ data }` |
| 201 | Creación | `{ data }` |
| 400 | Validación | `{ error, details }` |
| 401 | Sin sesión / credenciales | `{ error }` |
| 403 | Rol incorrecto | `{ error }` |
| 404 | Recurso no encontrado | `{ error }` |
| 409 | Conflicto (email duplicado) | `{ error }` |
| 500 | Error interno | `{ error }` |

## Referencias

- UX: `handoff-backend.md` sección errores
- Requisito R8: `handoff-arquitecto.md`
