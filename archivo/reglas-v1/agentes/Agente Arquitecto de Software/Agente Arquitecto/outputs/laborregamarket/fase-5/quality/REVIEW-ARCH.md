# REVIEW-ARCH — Quality Gate Backend Fase 5

> **De:** Agente Arquitecto de Software  
> **Para:** @Backend Developer (devolución) · @QA Tester (si READY-FOR-QA)  
> **Producto:** LaBorregaMarket v0.5.0  
> **Fecha:** 15/08/2026  
> **Código:** `C:\Users\PC GAMER\LaBorregaMarket`  
> **Veredicto:** **APROBADO CON OBSERVACIONES**  
> **Puntaje:** 97 / 100 · **0 P0** · P1 operacional (migración)

No se copia el auto-score de QR-BE (96/100). Auditoría contra ADRs 021–022 y contratos `fase-5/api/`. ADR-020 (Leaflet) es FE; el BE no debía cambiar el query geo.

---

## Alcance auditado

Migración `prisma/migrations/20260814050000_add_provider_brand_colors`, `prisma/schema.prisma` (`primaryColor` / `secondaryColor`), `GET /api/auth/session`, `PATCH/GET /api/provider/me` (colores), `PATCH /api/admin/providers/[id]` (colores), `getProviderDetail` / `sellableProviderProductWhere`, `getProviderCatalog` (panel sin filtrar), `createMarketplaceOrder` / `createPosSale` (409), `getProviderDashboard` (`topProducts`), `lib/color/contrast.ts`, `lib/validators/provider-settings.ts`, `lib/services/session.service.ts`. Query `GET /api/providers` geo F4 (sin bbox). Tests: `tests/unit/contrast.test.ts`, `session.service.test.ts`, `provider-catalog.test.ts`, `order.service.test.ts`, `dashboard.service.test.ts`, `google-maps.test.ts`; `tests/integration/session.routes.test.ts`, `provider-settings.routes.test.ts`, `admin-providers.routes.test.ts`, `providers-detail.routes.test.ts`, `orders.routes.test.ts`.

Contrato de referencia: [`../handoff-backend-fase-5.md`](../handoff-backend-fase-5.md), [`../api/`](../api/), [`../../comun/adrs/ADR-021-provider-brand-colors.md`](../../comun/adrs/ADR-021-provider-brand-colors.md), [`ADR-022-catalog-inactive.md`](../../comun/adrs/ADR-022-catalog-inactive.md).

QR-BE Backend: `Agente backend/.../fase-5/quality/QR-BE.md` (insumo, no dictamen).

---

## Rúbrica (10 × 10)

| # | Criterio | Pts | Nota |
|---|----------|-----|------|
| 1 | Schema vs delta F5 | 10 | `primary_color` / `secondary_color` nullable; **sin** `ProviderProduct.isActive`; par no en CHECK SQL |
| 2 | Brand PATCH/GET | 10 | Par ambos hex o ambos null; canonical `#RRGGBB` uppercase; 4.5:1 / 3:1 vs blanco; GET me devuelve persistido |
| 3 | `GET /api/auth/session` | 10 | 200 invitado; CLIENT/ADMIN `brand: null`; PROVIDER válido `source: "provider"`; fallback contraste; `no-store` |
| 4 | ADMIN colores | 10 | Misma validación; `isVerified=false` apaga Google y **no** nullifica colores |
| 5 | Detalle/listado omiten inactivos | 10 | `sellableProviderProductWhere` en detalle, samples y `_count`; panel GET completo |
| 6 | Venta 409 | 10 | Orders + POS `ProductUnavailableError` → 409; orden no creada; líneas libres POS exentas |
| 7 | Dashboard `topProducts` | 10 | `is_available = true`; venta rápida null se conserva; KPIs históricos sin reescribir |
| 8 | Geo F4 intacta | 10 | Solo `lat`/`lng`/`radiusKm`; cero bbox API; Leaflet fuera de BE |
| 9 | Envelope + RBAC | 10 | ADR-003; PATCH solo colores **no** dispara Google 403; session sin 401 |
| 10 | Pruebas | 7 | Unitarios de contraste, session, CAT, 409, dashboard; integración **mockea servicios** |
| | **Total** | **97** | Umbral 80% |

---

## Hallazgos

### OBS-F5-023 (P1) — Migración F5 no verificada en runtime

El SQL está en el repo. QR-BE reporta el mismo bloqueo Windows: `prisma generate` / DLL del query engine si `next dev` está vivo. **Acción:** parar el dev server y `npx prisma migrate deploy` (o `migrate dev`). Confirmar columnas `providers.primary_color` / `secondary_color`. Arrastre de OBS-F4-020.

### OBS-F5-024 (P2) — Integración mockea servicios

`session.routes.test.ts`, `provider-settings.routes.test.ts`, `admin-providers.routes.test.ts`, `providers-detail.routes.test.ts` y `orders.routes.test.ts` sustituyen `*.service`. Cubren envelope/HTTP, no el filtro Prisma contra PostgreSQL ni el 409 de POS a nivel route. Los unitarios (`contrast`, `session.service`, `provider-catalog`, `order.service` POS/marketplace, `dashboard.service`) sí ejercitan las reglas.

### OBS-F5-025 (P3) — `topProducts` no cruza `Product.isActive`

El SQL Must pide excluir `isAvailable=false` (cumplido). Un `Product` global inactivo cuya instancia sigue `is_available=true` podría aparecer en el ranking. Borde; no bloquea US-CAT-01.

Ningún P0. Contraste, session 200 y omisión de inactivos en detalle están en código, no solo en UI.

---

## Cumplimiento (resumen)

| Regla | Resultado |
|-------|-----------|
| Par hex o reset null; 400 incompleto / contraste | OK · copy ADR-021 |
| Canonical `#` + uppercase al persistir | OK |
| PATCH solo colores no dispara 403 Google | OK · `bodyTouchesGoogle` |
| Session 200 invitado; `brand` solo PROVIDER válido | OK · `Cache-Control: private, no-store` |
| CLIENT/ADMIN `brand: null` | OK |
| Lectura session fallback si contraste inválido | OK |
| GET `/api/provider/me` muestra persistido (picker) | OK |
| Detalle público omite `isAvailable=false` | OK · cierra hueco F1/`getProviderDetail` |
| Samples/`_count` + `Product.isActive` | OK |
| Panel `GET /api/provider/products` sin filtrar | OK |
| `POST /api/orders` inhabilitado → 409, no crea | OK |
| POS catálogo inhabilitado → 409; custom item exento | OK |
| `topProducts` catálogo vigente; KPIs intactos | OK · P3 `Product.isActive` |
| Query geo sin bbox Must | OK |
| Leaflet / Maps JS / teselas | Fuera de BE (FE) — correcto |
| Sin pasarela / Places / Distance Matrix / stock | OK |

---

## Veredicto

**APROBADO CON OBSERVACIONES.** Frontend ya integró contra estas APIs (QR-FE 89/100). Backend debe aplicar OBS-F5-023 antes de la corrida QA en local. P2/P3 no bloquean.

**QA Tester:** habilitado — [`READY-FOR-QA.md`](./READY-FOR-QA.md).

---

*Dictamen Arquitecto — LaBorregaMarket v0.5.0 — 15/08/2026.*
