# Handoff de Módulo: MOD-GEO

> **Proyecto:** LaBorregaMarket  
> **Módulo:** GEO (explorar radio, ETA, direcciones, settings Google)  
> **Stack:** Next.js 15 + Prisma + PostgreSQL + Zod + Vitest  
> **Fecha:** 2026-08-14  
> **Contrato de referencia:** `API-GEO-01`, `API-ADDRESSES-01`, `API-PROVIDER-SETTINGS-01`, ADR-016/017/018

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| GET | `/api/providers` (delta lat/lng/radiusKm) | Pública | API-GEO-01 | OK |
| GET | `/api/providers/[id]` (delta) | Pública | API-GEO-01 | OK |
| GET | `/api/providers/[id]/eta` | Pública | API-GEO-01 | OK |
| GET/POST | `/api/users/me/addresses` | CLIENT | API-ADDRESSES-01 | OK |
| PATCH/DELETE | `/api/users/me/addresses/[id]` | CLIENT | API-ADDRESSES-01 | OK |
| GET/PATCH | `/api/provider/me` | PROVIDER | API-PROVIDER-SETTINGS-01 | OK |

---

## 2. Validación (DTOs)

- [x] Query geo (XOR, bbox, radio 1–25)
- [x] Addresses bbox + límite 20
- [x] PATCH settings Google URL/Place ID

**Schemas:** `src/lib/validators/geo.ts`, `address.ts`, `provider-settings.ts`, `src/lib/validation/google-maps.ts`

---

## 3. Base de datos

Haversine en aplicación (volumen actual << 200). Umbral PostGIS documentado en contrato DB-providers.

Campos Provider: `preparationTimeMinutes`, `offersDelivery`, Google*. `UserAddress`. Should: `Order.fulfillmentType` default PICKUP (HTTP delivery no implementado).

---

## 4. Seguridad (RBAC)

- [x] Addresses solo CLIENT; 404 cruzado
- [x] PATCH Google → 403 si `isVerified=false` (aunque el valor no cambie)
- [x] ADMIN desverificar apaga `googleReviewsEnabled` en la misma transacción

---

## 5. Pruebas

`npm test -- tests/unit/geo.test.ts tests/unit/google-maps.test.ts tests/integration/geo.routes.test.ts tests/integration/addresses.routes.test.ts tests/integration/provider-settings.routes.test.ts`

---

## 6. Definition of Done (DoD Backend)

- [x] Validación Completa
- [x] Manejo de Errores Robust
- [x] Seguridad de Datos
- [x] Seguridad de Endpoints
- [x] Paginación **después** del filtro radio
- [x] Pruebas Superadas

---

## 7. Notas para downstream

### Frontend

Google Maps JS (quitar Leaflet). Favoritas: 401 → `/login?redirect=/explorar`. ETA: usar `copyKey`. Settings: `googleReviewsLocked`.

### QA

lat XOR lng = 400. Radio 30 = 400. CDMX coords = 400. Bypass API Google sin verificación = 403.

### DevOps

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (FE, restricción dominio). BE no llama Maps.
