# Handoff de Módulo: MOD-BRAND

> **Proyecto:** LaBorregaMarket  
> **Módulo:** BRAND (colores de marca + sesión)  
> **Stack:** Next.js 15 + Prisma + PostgreSQL + Zod + Vitest  
> **Fecha:** 2026-08-14  
> **Contrato de referencia:** `API-PROVIDER-SETTINGS-01`, `API-SESSION-THEME-01`, `DB-providers`, ADR-021

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| GET | `/api/provider/me` | PROVIDER | API-PROVIDER-SETTINGS-01 | [x] OK |
| PATCH | `/api/provider/me` | PROVIDER | API-PROVIDER-SETTINGS-01 | [x] OK |
| PATCH | `/api/admin/providers/[id]` | ADMIN | API-PROVIDER-SETTINGS-01 | [x] OK |
| GET | `/api/auth/session` | Opcional (siempre 200) | API-SESSION-THEME-01 | [x] OK |

---

## 2. Validación (DTOs)

- [x] `req.body` validado con schema antes del controlador
- [x] `req.params` validado (IDs, slugs, etc.)
- [ ] `req.query` validado (paginación, filtros) — N/A

**Schemas implementados:**

| DTO | Archivo | Campos validados |
|-----|---------|------------------|
| `patchProviderSettingsSchema` | `src/lib/validators/provider-settings.ts` | par hex/`null`, contraste WCAG, campos F4 |
| `patchAdminProviderSchema` | mismo | `isVerified` + par de colores |

---

## 3. Base de datos y migraciones

- [x] Modelo/schema de BD alineado con `DB-providers`
- [x] Migración aplicable y reversible
- [x] Seeds incluidos (si aplica) — no: `null`/`null` = plataforma

**Archivos:**

| Tipo | Ruta |
|------|------|
| Migración | `prisma/migrations/20260814050000_add_provider_brand_colors` |
| Helper | `src/lib/color/contrast.ts` |

---

## 4. Seguridad (RBAC)

- [x] Rutas protegidas con middleware JWT
- [x] Roles/permisos validados según contrato del Arquitecto
- [x] Passwords hasheados con Argon2 o bcrypt (si aplica) — N/A este módulo

**Rutas protegidas:**

| Ruta | Roles permitidos |
|------|------------------|
| `/api/provider/me` | PROVIDER |
| `/api/admin/providers/[id]` | ADMIN |
| `/api/auth/session` | Público (cookie opcional) |

---

## 5. Pruebas

### Unit tests (`service.ts`)

- [x] Casos de éxito cubiertos
- [x] Casos de error de negocio cubiertos
- [x] Repository mockeado

**Comando:** `npx vitest run tests/unit/contrast.test.ts tests/unit/session.service.test.ts tests/unit/provider-catalog.test.ts`

### Integration tests (endpoints HTTP)

- [x] Códigos HTTP verificados (200, 201, 400, 401, 403, 404, 500)
- [x] Payload JSON de respuesta válido según contrato
- [x] BD de prueba / in-memory configurada — Prisma mockeado

**Comando:** `npx vitest run tests/integration/session.routes.test.ts tests/integration/provider-settings.routes.test.ts tests/integration/admin-providers.routes.test.ts`

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
- Endpoints y JSON: ver `fase-5/handoff-frontend.md`
- Preview de contraste en UI = Should; el servidor rechaza 400

### QA

- Casos límite: `#RGB`, sin `#`, par mixto null/hex, primario #F9A825, session invitado 200 no 401, GET me muestra persistido aunque session haga fallback
- Datos de prueba: par válido `#1B5E20` / `#0D47A1`

### DevOps

- Sin env nuevas. Migración `add_provider_brand_colors`. En Windows, parar `next dev` antes de `prisma generate` (DLL query engine).
