# Handoff de Módulo: MOD-REPORTS

> **Proyecto:** LaBorregaMarket  
> **Módulo:** REPORTS (reporte calendario PROVIDER JSON + PDF)  
> **Stack:** Next.js 15 + Prisma + PostgreSQL + Zod + pdfkit + Vitest  
> **Fecha:** 2026-08-16  
> **Contrato de referencia:** `API-PROVIDER-REPORTS-01`, `API-PROVIDER-REPORTS-PDF-01`, ADR-023, ADR-024

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| GET | `/api/provider/reports` | PROVIDER | API-PROVIDER-REPORTS-01 | [x] OK |
| GET | `/api/provider/reports.pdf` | PROVIDER | API-PROVIDER-REPORTS-PDF-01 | [x] OK |

Dashboard rolling `GET /api/provider/dashboard` no se modificó.

---

## 2. Validación (DTOs)

- [x] `req.body` validado con schema antes del controlador — N/A (GET)
- [x] `req.params` validado (IDs, slugs, etc.) — N/A
- [x] `req.query` validado (grain + date; periodo futuro)

**Schemas implementados:**

| DTO | Archivo | Campos validados |
|-----|---------|------------------|
| `reportQuerySchema` / `parseReportQuery` | `src/lib/validators/report.ts` | `grain` day\|month\|year, `date` forma + no futuro |

---

## 3. Base de datos y migraciones

- [x] Modelo/schema de BD alineado — reusa `Order` / `OrderItem` (sin tabla nueva)
- [x] Migración aplicable — **ninguna de producto** en F6
- [ ] Seeds incluidos (si aplica) — N/A

**Archivos:**

| Tipo | Ruta |
|------|------|
| Migraciones previas F2→F5 | `prisma/migrations/20260810010000_add_audit_contact_media_upload` → `…orders_f3…` → `…reviews_addresses…` → `20260814050000_add_provider_brand_colors` |
| Deploy | `npm run db:migrate:deploy` (`prisma migrate deploy`). Local sigue `npm run db:migrate` (`migrate dev`) |

Windows: parar `next dev` antes de `prisma generate` / `migrate` (DLL del query engine).

---

## 4. Seguridad (RBAC)

- [x] Rutas protegidas con middleware JWT
- [x] Roles/permisos validados según contrato del Arquitecto
- [x] Passwords hasheados con Argon2 o bcrypt (si aplica) — N/A

**Rutas protegidas:**

| Ruta | Roles permitidos |
|------|------------------|
| `/api/provider/reports` | PROVIDER (ownership por `session.sub`) |
| `/api/provider/reports.pdf` | PROVIDER |

Tests 401 sin cookie y 403 CLIENT/ADMIN (DEV-P2-011).

---

## 5. Pruebas

### Unit tests (`service.ts`)

- [x] Casos de éxito cubiertos
- [x] Casos de error de negocio cubiertos
- [x] Repository mockeado

**Comando:** `npx vitest run tests/unit/dashboard.service.test.ts tests/unit/timezone.test.ts tests/unit/report-query.test.ts tests/unit/report-pdf.test.ts`

### Integration tests (endpoints HTTP)

- [x] Códigos HTTP verificados (200, 400, 401, 403)
- [x] Payload JSON de respuesta válido según contrato
- [x] PDF `application/pdf` en periodo vacío

**Comando:** `npx vitest run tests/integration/reports.routes.test.ts`

Slice A (contacto): `tests/unit/rate-limit.contact.test.ts`, `tests/unit/contact.service.test.ts`, `tests/integration/contact.routes.test.ts`.

---

## 6. Definition of Done (DoD Backend)

- [x] **Validación Completa**
- [x] **Manejo de Errores Robust**
- [x] **Seguridad de Datos** (secrets en `.env`)
- [x] **Seguridad de Endpoints** (auth/RBAC)
- [x] **Eficiencia en Consultas** (aggregate/groupBy/SQL; PDF desde objeto agregado)
- [x] **Pruebas Superadas** — 166 tests, 38 files

---

## 7. Notas para downstream

### Frontend

- Base URL: `http://localhost:8080`
- Endpoints y JSON: ver [`../handoff-frontend.md`](../handoff-frontend.md)
- Helpers: `getProviderReport`, `providerReportPdfUrl` en `src/lib/api/provider-ops.ts`

### QA

- Casos límite: grano/fecha desajustados; periodo futuro; empty 200 (JSON y PDF); 401/403; `bySource` siempre ambas claves; `series` day=`[]` / month=días / year=12
- Contacto: 429 no encola Inngest; prod sin Redis → 503 no 500
- Datos de prueba: mocks Vitest; no seed nuevo

### DevOps

- `npm run db:migrate:deploy` aplica pendientes F2→F5. Sin migración F6 de producto
- Prod: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` obligatorios (fail-closed 503)
- Nueva dep: `pdfkit`. CI YAML = DevOps (fuera de este módulo)
