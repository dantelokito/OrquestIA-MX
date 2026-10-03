# Handoff de Feature: FEAT-REVIEWS

> **Proyecto:** laborregamarket  
> **Feature:** REVIEWS (nativas + Google gate)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-fruteria-reviews`, `WF-cuenta-pedidos-f4`, `WF-resena-pedido`, `WF-proveedor-google`  
> **Contrato:** `API-REVIEWS-01`, `API-PROVIDER-SETTINGS-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Detalle reseñas | `WF-fruteria-reviews` | `/fruteria/[id]` | OK |
| Calificar pedido | `WF-resena-pedido` | `/cuenta` | OK |
| Google settings | `WF-proveedor-google` | `/proveedor` | OK |
| Moderación | — | `/admin/analytics` | OK |

**Componentes:** `RatingStars`, `ReviewCard`, `ReviewList`, `ReviewForm`, `VerificationRequiredBanner`

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers/[id]/reviews` | GET | `listProviderReviews` | API-REVIEWS-01 | OK |
| `/api/orders/[id]/reviews` | POST | `createOrderReview` | API-REVIEWS-01 | OK |
| `/api/orders/[id]/review` | GET | `getOrderReview` | API-REVIEWS-01 | OK |
| `/api/provider/me` | GET/PATCH | `getMyBusiness` / `updateProviderSettings` | API-PROVIDER-SETTINGS-01 | OK |
| `/api/admin/reviews/[id]` | DELETE | `deleteAdminReview` | API-REVIEWS-01 | OK |

CTA Calificar solo `DELIVERED` + `MARKETPLACE`. 409 → GET review + formulario read-only. Embed Google solo si `googleReviews.enabled`. 403 Google → “Requiere verificación de tu negocio” (banner info).

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Lista pública | skeleton cards | “Sin reseñas todavía” | ErrorBanner | ReviewCards |
| Form pedido | — | rating 0 bloquea submit | 409 / red | toast + read-only |
| Settings Google | skeleton | Place ID vacío | 403 info | toast guardado |

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes |
|------------|--------|----------|
| Reseña | rating 1–5, comment ≤1000 | inline; 409 duplicado |
| Google | Place ID / URL / toggle | locked si no verificado |

---

## 5. Responsive y accesibilidad

- [x] Rating 0 anunciado como “Sin reseñas todavía” (nunca estrellas vacías)
- [x] Banner verificación `info` + `aria-describedby` en controles disabled
- [x] Touch ≥44px en estrellas

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/reviews-copy.test.ts`

---

## 7. DoD Frontend

- [x] Copy canónico empty
- [x] Gate Google no es seguridad (servidor 403)
- [x] 4 estados
- [x] F3 Encargar / ContactCTA intactos

---

## 8. Notas para downstream

### QA Tester

- Pedido POS no muestra Calificar
- Negocio no verificado: PATCH Google 403
- `reviewCount=0` no muestra estrellas engañosas
