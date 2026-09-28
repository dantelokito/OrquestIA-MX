# Handoff de Módulo: MOD-REVIEWS

> **Proyecto:** LaBorregaMarket  
> **Módulo:** REVIEWS  
> **Stack:** Next.js 15 + Prisma + PostgreSQL + Zod + Vitest  
> **Fecha:** 2026-08-14  
> **Contrato de referencia:** `API-REVIEWS-01`, `DB-reviews`, ADR-018

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| POST | `/api/orders/[id]/reviews` | CLIENT dueño | API-REVIEWS-01 | OK |
| GET | `/api/orders/[id]/review` | CLIENT dueño / ADMIN | API-REVIEWS-01 | OK |
| GET | `/api/providers/[id]/reviews` | Pública | API-REVIEWS-01 | OK |
| DELETE | `/api/admin/reviews/[id]` | ADMIN | API-REVIEWS-01 | OK |

---

## 2. Validación (DTOs)

- [x] `req.body` validado con schema antes del controlador
- [x] `req.params` validado (IDs)
- [x] `req.query` validado (paginación)

**Schemas implementados:**

| DTO | Archivo | Campos validados |
|-----|---------|------------------|
| createReviewSchema | `src/lib/validators/review.ts` | rating 1–5, comment max 1000 |

---

## 3. Base de datos y migraciones

- [x] Modelo alineado con `DB-reviews`
- [x] Migración aplicable
- [x] Seed: `rating`/`reviewCount` = 0 (no placeholder)

**Archivos:**

| Tipo | Ruta |
|------|------|
| Migración | `prisma/migrations/20260814040000_add_reviews_addresses_notify_scale` |
| Seed | `prisma/seed.ts` |

---

## 4. Seguridad (RBAC)

- [x] JWT cookie
- [x] POS / `clientId` null → 403
- [x] DELETE solo ADMIN + AUDIT `PROVIDERS`

---

## 5. Pruebas

**Comando:** `npm test -- tests/unit/review.service.test.ts tests/integration/reviews.routes.test.ts`

---

## 6. Definition of Done (DoD Backend)

- [x] Validación Completa
- [x] Manejo de Errores Robust
- [x] Seguridad de Datos
- [x] Seguridad de Endpoints
- [x] Eficiencia (AVG/COUNT transaccional, listado paginado)
- [x] Pruebas Superadas

---

## 7. Notas para downstream

### Frontend

Must: sin PATCH. `authorName` no es email. `reviewCount=0` → "Sin reseñas todavía".

### QA

POS walk-in no reseña. Segundo POST → 409. Agregado se recalcula al DELETE admin.

### DevOps

Sin env extra. Relación `Review` Restrict on delete Order.
