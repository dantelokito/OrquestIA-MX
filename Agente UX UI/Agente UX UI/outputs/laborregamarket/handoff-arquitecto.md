# Handoff Arquitecto — LaBorregaMarket UX/UI v0.1.0

> **De:** Agente UX/UI Designer  
> **Para:** @Arquitecto de Software  
> **Fecha:** 05/08/2026  
> **Prioridad:** Contratos API, NFR y seguridad derivados del diseño

---

## Estado: ENTERADO ✅

El Agente UX/UI Designer confirma entrega completa de flujos, wireframes y design tokens. Listo para que el Arquitecto defina SAD, contratos API y modelo de datos.

---

## Punto de entrada

**Lee primero:** [`OBSERVABILITY.md`](./OBSERVABILITY.md) — índice, matriz de seguimiento y NFR UI.

---

## Inputs de diseño

| Tipo | Ubicación |
|------|-----------|
| Arquitectura información | `information-architecture.md` |
| Design tokens | `design-tokens.md` |
| User flows (10) | `user-flows/UF-*.md` |
| Wireframes (8) | `wireframes/WF-*.md` |

---

## Contratos API implícitos en diseño

### AUTH

| Endpoint | Método | Request UI | Response UI esperada |
|----------|--------|------------|---------------------|
| `/api/auth/login` | POST | `{ email, password }` | 200 + cookie JWT; 401 `"Credenciales inválidas"` |
| `/api/auth/register` | POST | `{ name, email, password, phone?, role }` | 200 + sesión; 409 email duplicado |
| `/api/auth/register` (PROVIDER paso 2) | POST/PATCH | `{ businessName, address, city, lat, lng, businessPhone? }` | 200 + `Provider` creado |
| `/api/auth/logout` | POST | — | 200, cookie eliminada |

### EXPLORE / PROVIDERS

| Endpoint | Método | Query params | Response UI |
|----------|--------|--------------|-------------|
| `/api/providers` | GET | `city`, `q`, `page` | Lista paginada para WF-explorar |
| `/api/providers/[id]` | GET | — | Detalle + productos activos para WF-fruteria-detalle |

### PROVIDER PANEL

| Endpoint | Método | Body | Response UI |
|----------|--------|------|-------------|
| `/api/provider/products` | GET | — | Catálogo global + estado ProviderProduct |
| `/api/provider/products/[id]` | PATCH | `{ price, isActive }` | 200; error inline en fila si falla |

### CLIENT CUENTA

| Endpoint | Método | Body | Response UI |
|----------|--------|------|-------------|
| `/api/users/me` | GET | — | `{ name, email, phone }` |
| `/api/users/me` | PATCH | `{ name, phone }` | 200; errores validación 400 |

### ADMIN

| Endpoint | Método | Notas |
|----------|--------|-------|
| `/api/admin/catalogs` | GET | Read-only JSON MVP |
| `/api/admin/providers` | GET/PATCH | Verificación manual |
| `/api/admin/audit` | GET | Bitácora paginada |

---

## Requerimientos técnicos derivados del diseño

| # | Requisito | Origen diseño |
|---|-----------|---------------|
| R1 | Guards sesión/rol en **todas** las API routes (BL-008) | UF-AUTH-03 |
| R2 | Validar `redirect` param — solo paths internos (BL-010) | UF-AUTH-03 |
| R3 | Password min 8 unificado login + registro (BL-009) | design-tokens |
| R4 | Paginación en `GET /api/providers` | WF-explorar |
| R5 | Lazy load Leaflet — dynamic import | WF-explorar, WF-registro |
| R6 | Header lee sesión server-side (cookie httpOnly) | WF-header-auth |
| R7 | Crear `Provider` en registro PROVIDER o endpoint dedicado (BL-002) | UF-PROVIDER-01 |
| R8 | Estructura error JSON homogénea: `{ error: string, details?: [] }` | Todos los WF |
| R9 | Índices DB para filtros `city`, `q` en providers | WF-explorar NFR < 2s |
| R10 | Coords validación área Monterrey en onboarding | WF-registro paso 2 |

---

## Estados HTTP que la UI maneja

| Código | Uso en UI |
|--------|-----------|
| 200 | Éxito — redirect o actualización estado |
| 400 | Validación — errores inline por campo |
| 401 | Sin sesión — redirect `/login?redirect=` |
| 403 | Rol incorrecto — redirect home o panel del rol |
| 404 | Frutería no encontrada — EmptyState |
| 409 | Email duplicado en registro |
| 500 | ErrorBanner + Reintentar |

---

## Backlog desbloqueado por diseño

```
BL-002 → BL-003 → BL-007 → BL-008 → BL-009 → BL-010
         ↓
BL-004 → BL-005 → BL-006 → BL-011
```

---

## Entregables esperados del Arquitecto

1. `sad.md` — topología sistema
2. `api/API-AUTH-01.md`, `api/API-PROVIDERS-01.md`, etc.
3. `data-model/DB-*.md` — Provider onboarding, ProviderProduct
4. ADR si hay decisiones sobre wizard vs registro atómico

---

*Handoff generado por Agente UX/UI Designer — LaBorregaMarket v0.1.0*
