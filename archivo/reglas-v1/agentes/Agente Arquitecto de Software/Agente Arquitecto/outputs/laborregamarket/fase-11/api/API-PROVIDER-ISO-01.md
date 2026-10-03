# API-PROVIDER-ISO-01 — Aislamiento por sucursal activa

> **Endpoint:** delta transversal `/api/provider/*` (paths F3–F10 **sin cambio de URL**)  
> **Módulo:** `PROVIDERS` / `PRODUCTS` / `MEDIA` / `ORDERS` / `DASH`  
> **Versión:** 0.11.0  
> **Fecha:** 12/09/2026  
> **US:** US-ISO-01, US-AUTH-11  
> **ADR:** ADR-034  
> **Autenticación:** JWT + cookie `lbm_active_provider`

## Inputs Utilizados

- Contratos F10 (solo lectura): `API-PROVIDER-PRODUCTS-02`, `API-PROVIDER-SECTIONS-01`, `API-MEDIA-02`, `API-PROVIDER-REPORTS-02`
- **No editar** `fase-10/`

---

## Resolución

Todas las rutas bajo `/api/provider/*` **excepto**:

- `GET /api/provider/mine`
- `POST /api/provider/active`
- `GET /api/provider/reports/global`

usan `resolveActiveProvider`. El `providerId` de negocio **no** se toma del body/query del cliente para “cambiar de sucursal”. Si el cliente envía `providerId` distinto del activo → **403**.

Incluye (lista no exhaustiva; toda ruta panel PROVIDER):

| Área | Paths vigentes |
|------|----------------|
| Me / settings | `GET/PATCH /api/provider/me` |
| Catálogo / local / secciones | `/api/provider/products`, `/api/provider/local-products`, `/api/provider/sections` |
| Media disco | `POST /api/provider/media` y mutaciones de imagen de instancia |
| POS / dashboard rolling | `/api/provider/pos/sales`, `/api/provider/dashboard` |
| Reportes sucursal | `GET /api/provider/reports` (F6 y F10) |
| Pedidos panel | listados/transiciones del proveedor autenticado |

`GET /api/media/{opaque}` público sigue sirviendo el archivo; **mutación** y binding de URL se validan contra el activo.

---

## Reglas IDOR (Must)

| Situación | HTTP |
|-----------|------|
| Sin JWT | 401 |
| CLIENT / ADMIN en ruta PROVIDER | 403 |
| Recurso (`ProviderProduct`, `ProviderSection`, `Order`, media) con `providerId` ≠ activo, aunque sea del mismo user | **403** |
| Recurso de otro dueño | **403** (no 404 de enumeración en mutaciones de id) |
| `productIds[]` de reportes F10 de otra sucursal | **403** (igual F10, ahora vs activo) |

SKU `scope=LOCAL` de A no aparece en listados de B ni como comparable en Explorar de B (regla F10 + filtro `providerId` activo / ficha pública).

N=1: mismas rutas y contratos F10; cookie se setea a la única sucursal.

---

## Errores homogéneos

| HTTP | Uso |
|------|-----|
| 400 | Validación Zod |
| 401 | Sin sesión |
| 403 | Rol o ownership / activo |
| 404 | Solo si el contrato F10 ya lo usaba para recurso de negocio inexistente **después** de pasar ownership; F11 prefiere 403 en ids cruzados |
| 409 | Conflictos F10 (p. ej. sección no vacía, último admin no aplica aquí) |
| 500 | Fallo interno |

Tests Must: 401; 403 cruzando ids El Paraíso Centro ↔ Tecnológico.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/api/API-PROVIDER-ISO-01.md`
- **Agente Downstream:** Backend, QA
