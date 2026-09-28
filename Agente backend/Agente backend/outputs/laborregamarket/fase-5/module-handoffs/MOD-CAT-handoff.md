# Handoff de Módulo: MOD-CAT

> **Proyecto:** LaBorregaMarket  
> **Módulo:** CAT (catálogo inhabilitado en todos los canales)  
> **Stack:** Next.js 15 + Prisma + PostgreSQL + Vitest  
> **Fecha:** 2026-08-14  
> **Contrato de referencia:** `API-PROVIDER-PRODUCTS-01`, ADR-022

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| GET | `/api/providers` | Público | API-PROVIDER-PRODUCTS-01 | [x] OK |
| GET | `/api/providers/[id]` | Público | API-PROVIDER-PRODUCTS-01 | [x] OK |
| GET | `/api/provider/products` | PROVIDER | API-PROVIDER-01 (sin filtrar) | [x] OK |
| PATCH | `/api/provider/products` | PROVIDER | API-PROVIDER-01 (sin cambio) | [x] OK |
| POST | `/api/orders` | CLIENT | API-ORDERS-01 | [x] OK (409) |
| POST | `/api/provider/pos/sales` | PROVIDER | API-POS-01 | [x] OK (409; líneas libres exentas) |
| GET | `/api/provider/dashboard` | PROVIDER | API-PROVIDER-DASH-01 | [x] OK (`topProducts`) |

---

## 2. Validación (DTOs)

- [x] `req.body` validado con schema antes del controlador
- [x] `req.params` validado (IDs, slugs, etc.)
- [x] `req.query` validado (paginación, filtros)

**Schemas implementados:**

| DTO | Archivo | Campos validados |
|-----|---------|------------------|
| (sin DTO nuevo) | `src/lib/services/provider.service.ts` | `sellableProviderProductWhere` |

Vendible = `isAvailable=true` **y** `Product.isActive=true`. **No** se añadió `ProviderProduct.isActive`.

---

## 3. Base de datos y migraciones

- [x] Modelo/schema de BD alineado con `DB-providers` (semántica CAT sin columna nueva)
- [x] Migración aplicable y reversible — N/A (sin schema CAT)
- [x] Seeds incluidos (si aplica) — seed F1 ya usa `isAvailable`

**Archivos:**

| Tipo | Ruta |
|------|------|
| Migración | N/A |
| Filtro | `src/lib/services/provider.service.ts` (`sellableProviderProductWhere`) |
| Dashboard | `src/lib/services/dashboard.service.ts` (`LEFT JOIN` + `is_available`) |

---

## 4. Seguridad (RBAC)

- [x] Rutas protegidas con middleware JWT
- [x] Roles/permisos validados según contrato del Arquitecto
- [x] Passwords hasheados con Argon2 o bcrypt (si aplica) — N/A

**Rutas protegidas:**

| Ruta | Roles permitidos |
|------|------------------|
| `/api/provider/products` | PROVIDER |
| `/api/orders` | CLIENT |
| `/api/provider/pos/sales` | PROVIDER |
| `/api/provider/dashboard` | PROVIDER |

---

## 5. Pruebas

### Unit tests (`service.ts`)

- [x] Casos de éxito cubiertos
- [x] Casos de error de negocio cubiertos
- [x] Repository mockeado

**Comando:** `npx vitest run tests/unit/provider-catalog.test.ts tests/unit/dashboard.service.test.ts tests/unit/order.service.test.ts`

### Integration tests (endpoints HTTP)

- [x] Códigos HTTP verificados (200, 201, 400, 401, 403, 404, 500)
- [x] Payload JSON de respuesta válido según contrato
- [x] BD de prueba / in-memory configurada — Prisma mockeado

**Comando:** `npx vitest run tests/integration/providers-detail.routes.test.ts tests/integration/orders.routes.test.ts`

---

## 6. Definition of Done (DoD Backend)

- [x] **Validación Completa**
- [x] **Manejo de Errores Robust**
- [x] **Seguridad de Datos** (secrets en `.env`)
- [x] **Seguridad de Endpoints** (auth/RBAC)
- [x] **Eficiencia en Consultas** (sin N+1, paginación en listados)
- [x] **Pruebas Superadas**

---

## 7. Notas para downstream

### Frontend

- Base URL: `http://localhost:8080`
- Detalle/explorar/carrito/POS: ocultar inactivos (no greyscale). Panel proveedor: catálogo completo
- Confirmar pedido con id viejo → 409 `"Producto no disponible"`

### QA

- Casos límite: `isAvailable=false`, `Product.isActive=false`, POS custom item (no 409), replay Idempotency-Key de orden ya creada, `topProducts` conserva venta rápida
- Datos de prueba: toggle panel F1

### DevOps

- Sin env ni migración CAT. Query geo F4 intacta (sin bbox Must).
