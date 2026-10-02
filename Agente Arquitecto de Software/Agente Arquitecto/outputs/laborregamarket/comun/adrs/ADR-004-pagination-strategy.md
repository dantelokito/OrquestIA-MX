# ADR-004 — Estrategia de paginación offset

> **Estado:** Aceptado  
> **Fecha:** 05/08/2026  
> **Decisores:** Arquitecto de Software

---

## Contexto

Los listados de proveedores (`GET /api/providers`) y bitácora admin (`GET /api/admin/audit`) necesitan paginación. El wireframe `WF-explorar` especifica controles de paginación y el NFR exige tiempo de carga < 2s en 4G.

Con < 100 proveedores esperados en MVP Monterrey, la elección de estrategia de paginación es pragmática.

## Decisión

Usar **paginación offset** con query params:

| Param | Tipo | Default | Max |
|-------|------|---------|-----|
| `page` | number (1-indexed) | `1` | — |
| `limit` | number | `20` | `50` (providers), `100` (audit) |

### Cálculo

```
skip = (page - 1) * limit
totalPages = Math.ceil(total / limit)
```

### Response meta

```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

## Alternativas consideradas

### A) Cursor-based pagination (`?cursor=abc&limit=20`)

- **Pros:** Consistente con inserciones concurrentes; mejor para feeds infinitos.
- **Contras:** No permite "ir a página 5"; overkill para dataset pequeño; más complejo en Prisma.

### B) Sin paginación (retornar todo)

- **Pros:** Simple.
- **Contras:** No escala; ya es el estado actual problemático; viola NFR.

### C) Offset con `offset` param en lugar de `page`

- **Pros:** Estándar SQL.
- **Contras:** UI piensa en páginas, no offsets; menos intuitivo para Frontend.

## Consecuencias

### Positivas

- Implementación directa con Prisma `skip` + `take`.
- UI puede mostrar "Página 1 de 3" fácilmente.
- Suficiente para MVP Monterrey (< 100 proveedores).

### Negativas

- Performance degrada con offsets muy altos (no relevante en MVP).
- Duplicados/omisiones posibles si hay inserciones durante navegación (aceptable para explorar fruterías).

## Endpoints con paginación

| Endpoint | Default limit | Max limit |
|----------|---------------|-----------|
| `GET /api/providers` | 20 | 50 |
| `GET /api/admin/providers` | 20 | 50 |
| `GET /api/admin/audit` | 20 | 100 |

## Implementación Prisma (referencia)

```typescript
const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  prisma.provider.findMany({ where, skip, take: limit, orderBy }),
  prisma.provider.count({ where }),
]);
```

## Referencias

- API providers: [`../api/API-PROVIDERS-01.md`](../api/API-PROVIDERS-01.md)
- API admin: [`../api/API-ADMIN-01.md`](../api/API-ADMIN-01.md)
- UX: `WF-explorar.md` (paginación)
