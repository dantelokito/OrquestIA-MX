# Handoff Backend — LaBorregaMarket UX/UI v0.1.0

> **De:** Agente UX/UI Designer  
> **Para:** @Backend  
> **Fecha:** 05/08/2026  
> **Prioridad:** Endpoints y validaciones que la UI espera según wireframes

---

## Estado: ENTERADO ✅

La UI está especificada con contratos implícitos. Backend debe alinear APIs, validaciones y guards con los estados de error documentados en wireframes.

---

## Punto de entrada

**Lee primero:** [`OBSERVABILITY.md`](./OBSERVABILITY.md) — sección "Matriz de seguimiento" filtrada por Backend.

---

## Endpoints requeridos por pantalla

### AUTH (`WF-login`, `WF-registro`)

| Endpoint | Cambio requerido | Wireframe |
|----------|------------------|-----------|
| `POST /api/auth/login` | Unificar password min **8** chars (BL-009) | WF-login |
| `POST /api/auth/register` | Con `role=PROVIDER`: opción crear `Provider` en mismo flow o endpoint paso 2 (BL-002) | WF-registro |
| `POST /api/auth/logout` | Ya implementado — sin cambios UI | WF-header-auth |
| Middleware | Validar `redirect` solo paths internos (BL-010) | UF-AUTH-03 |

**Errores UI esperados:**

```json
// 401 login
{ "error": "Credenciales inválidas" }

// 409 registro
{ "error": "El email ya está registrado" }

// 400 validación
{ "error": "Validation failed", "details": [{ "field": "email", "message": "..." }] }
```

### PROVIDER Onboarding (`WF-registro` paso 2, `WF-proveedor-panel`)

| Endpoint | Body | Validación |
|----------|------|------------|
| `POST /api/providers` o extensión register | `{ businessName, address, city, latitude, longitude, businessPhone? }` | `businessName` min 2, `address` required, coords en área Monterrey |
| `GET /api/provider/me` | — | Retorna Provider o 404 (UI muestra EmptyState) |

### EXPLORE (`WF-explorar`, `WF-fruteria-detalle`)

| Endpoint | Query | Response |
|----------|-------|----------|
| `GET /api/providers` | `city=Monterrey`, `q`, `page`, `limit` | `{ data: Provider[], total, page }` — paginado |
| `GET /api/providers/[id]` | — | Provider + `products[]` con `{ name, category, price, unit, isActive }` |

**Reemplaza:** mock `DEMO_PROVIDERS` en frontend (BL-004).

### PROVIDER Catálogo (`WF-proveedor-panel`)

| Endpoint | Body | Notas |
|----------|------|-------|
| `GET /api/provider/products` | — | 15 productos globales + estado ProviderProduct del proveedor logueado |
| `PATCH /api/provider/products/[productId]` | `{ price: number, isActive: boolean }` | Guardado por fila; 400 si price < 0 |

### CLIENT Cuenta (`WF-cuenta-cliente`)

| Endpoint | Body | Notas |
|----------|------|-------|
| `GET /api/users/me` | — | Solo CLIENT autenticado |
| `PATCH /api/users/me` | `{ name?, phone? }` | Email no editable en MVP |

### ADMIN (`WF-admin-panel`)

| Endpoint | Notas |
|----------|-------|
| `GET /api/admin/catalogs` | 7 catálogos JSON read-only |
| `GET /api/admin/providers` | Lista con `isVerified` |
| `PATCH /api/admin/providers/[id]` | `{ isVerified: boolean }` |
| `GET /api/admin/audit` | Paginado, sort `createdAt desc` |

---

## Guards requeridos (BL-008)

| Ruta API | Rol mínimo |
|----------|------------|
| `/api/provider/*` | PROVIDER |
| `/api/users/me` | CLIENT |
| `/api/admin/*` | ADMIN |
| `/api/providers` GET | Público |
| `/api/providers/[id]` GET | Público |

Middleware actual excluye `/api/*` — guards deben estar en cada route handler.

---

## Validaciones alineadas con UI

| Campo | Regla | Pantalla |
|-------|-------|----------|
| `password` | min 8 caracteres | login, registro |
| `email` | formato válido, único | registro |
| `businessName` | required, min 2 | wizard paso 2 |
| `address` | required | wizard paso 2 |
| `latitude/longitude` | dentro bounding box Monterrey | wizard paso 2 |
| `price` | number >= 0, 2 decimales | proveedor panel |
| `redirect` | path interno, sin `//` ni `http` | login redirect |

---

## Estados HTTP — manejo en UI

| Código | Cuándo | UI response |
|--------|--------|-------------|
| 200 | Éxito | Actualizar estado / redirect |
| 400 | Validación Zod | Errores inline por campo |
| 401 | Sin sesión / credenciales | Redirect login o mensaje inline |
| 403 | Rol incorrecto | Redirect según rol |
| 404 | Provider/User/Frutería no existe | EmptyState |
| 409 | Email duplicado | Inline bajo email |
| 500 | Error servidor | ErrorBanner + Reintentar |

---

## Backlog Backend priorizado

| ID | Item | Referencia UX |
|----|------|---------------|
| BL-002 | Crear Provider en registro PROVIDER | UF-PROVIDER-01 |
| BL-008 | Guards API routes | UF-AUTH-03 |
| BL-009 | Password min 8 en login API | design-tokens |
| BL-010 | Validar redirect param | UF-AUTH-03 |
| BL-004 | API providers para explorar | WF-explorar |
| BL-005 | API provider detail + productos | WF-fruteria-detalle |
| BL-006 | API users/me | WF-cuenta-cliente |
| BL-011 | Filtros city, q en providers | WF-explorar |

---

## Auditoría (ya parcial)

Eventos que la UI asume en bitácora admin:

- `AUTH`: LOGIN, LOGOUT, REGISTER
- `PRODUCTS`: UPDATE (cambio precio/disponibilidad)

---

*Handoff generado por Agente UX/UI Designer — LaBorregaMarket v0.1.0*
