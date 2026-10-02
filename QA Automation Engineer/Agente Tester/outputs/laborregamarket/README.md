# LaBorregaMarket — Entregables QA

Lectura mínima: este archivo + `STATUS.md` + `comun/` + `fase-N` activa.

La **suite Playwright** permanece en [`tests/`](./tests/) (código vivo; no se parte por fase). Las matrices y sign-offs sí van por fase.

| Fase | Matrices | Sign-off |
|------|----------|----------|
| 1 | AUTH, USERS, RBAC, ADMIN, PROVIDERS | [QA-MVP-signoff](./fase-1/qa-signoffs/QA-MVP-signoff.md) |
| 2 | Stub — regresión `tests/tests/e2e/contact-f2-regression.spec.ts` | — |
| 3 | ORDERS, POS, DASH, OPS | [QA-F3-signoff](./fase-3/qa-signoffs/QA-F3-signoff.md) |
| 4 | REVIEWS, GEO, ADDRESSES, ETA, ADMIN, NOTIFY, POS, ORDERS, RBAC | [QA-F4-signoff](./fase-4/qa-signoffs/QA-F4-signoff.md) |
| 5 | GEO Leaflet, CAT, BRAND, RBAC | [QA-F5-signoff](./fase-5/qa-signoffs/QA-F5-signoff.md) |
| 6 | Reportes DASH, GEO zoom↔radio, NOTIFY 503, RBAC reports | [QA-F6-signoff](./fase-6/qa-signoffs/QA-F6-signoff.md) |
| 7 | Explorar F7, preview, AUTH cross-device, favoritas `/use` | [QA-F7-signoff](./fase-7/qa-signoffs/QA-F7-signoff.md) |
| 8 | Explorar polish: LocationChip, radio 0.5–10, mapa MX, preview hover | [QA-F8-signoff](./fase-8/qa-signoffs/QA-F8-signoff.md) |
| 9 | Deuda Explorar DT-001…005 (preview, header, distancia, chips, chrome/mapa) → PM | [QA-F9-progreso](./fase-9/qa-signoffs/QA-F9-progreso.md) (sign-off pendiente; **solo lectura**) |
| 10 | SEC, ADMIN, CAT, MEDIA, DASH · DT-F10-001/002 (ex 015/016) | [QA-F10-signoff](./fase-10/qa-signoffs/QA-F10-signoff.md) **APROBADO CON CONDICIONES** (12/09) |
| 11 | Multi-frutería, ISO, DASH global, seed, admin/explorar | [QA-F11-signoff](./fase-11/qa-signoffs/QA-F11-signoff.md) **APROBADO** (12/09, re-prueba) |
| 12 | Inventario blando INV/CAT/POS | [QA-F12-signoff](./fase-12/qa-signoffs/QA-F12-signoff.md) **APROBADO** (14/09, re-prueba) |
| 13 | Archivo oferta, unidad, admin, reportes inv | [QA-F13-signoff](./fase-13/qa-signoffs/QA-F13-signoff.md) **APROBADO** (16/09, re-prueba) |
| 14 | Panel PROVIDER: perfil, merma/ajuste, series/PDF | [QA-F14-signoff](./fase-14/qa-signoffs/QA-F14-signoff.md) **APROBADO** (17/09) |

Plan de pruebas: [comun/TEST_PLAN.md](./comun/TEST_PLAN.md)

## Spec → fase (suite `tests/`)

| Spec | Fase |
|------|------|
| `e2e/auth-login.spec.ts`, `route-protection.spec.ts` | 1 |
| `api/auth.spec.ts`, `users.spec.ts`, `rbac.spec.ts`, `admin.spec.ts`, `providers.spec.ts` | 1 |
| `e2e/explore.spec.ts` | 1–2 |
| `e2e/contact-f2-regression.spec.ts` | 2 |
| `e2e/checkout.spec.ts`, `pos.spec.ts`, `dashboard.spec.ts`, `provider-orders.spec.ts`, `cart-empty.spec.ts` | 3 |
| `api/orders.spec.ts`, `pos.spec.ts`, `dashboard.spec.ts`, `provider-orders.spec.ts` | 3 |
| `api/reviews.spec.ts`, `geo.spec.ts`, `addresses.spec.ts`, `eta.spec.ts`, `admin-analytics.spec.ts`, `provider-settings.spec.ts`, `notify.spec.ts` | 4 |
| `e2e/explore-geo.spec.ts`, `reviews.spec.ts`, `provider-google.spec.ts`, `checkout-eta.spec.ts`, `admin-analytics.spec.ts`, `pos-scale.spec.ts`, `delivery.spec.ts` | 4 |
| `api/session.spec.ts`, `catalog.spec.ts` + deltas settings/orders/pos/rbac | 5 |
| `e2e/explore-geo.spec.ts` (HP-GEO-04/05), `catalog-channels.spec.ts`, `provider-brand.spec.ts` | 5 |
| `api/reports.spec.ts` + RBAC 026–030 | 6 |
| `e2e/dashboard-reports.spec.ts`, `explore-geo.spec.ts` (HP-GEO-07/08), `contact-resilience.spec.ts` | 6 |
| `e2e/explore-f7.spec.ts` + deltas geo/addresses/providers/auth | 7 |
| `e2e/explore-f8.spec.ts` + deltas geo/addresses (clamp 0.5–10, CDMX, `isInMexico`) | 8 |
| `api/admin-products.spec.ts`, `local-products.spec.ts`, `sections.spec.ts`, `media.spec.ts` + deltas reports/rbac | 10 |
| `e2e/provider-catalog-f10.spec.ts`, `fruteria-sections.spec.ts`, `admin-catalog-f10.spec.ts`, `dashboard-reports.spec.ts` (chrome F10) | 10 |
| `e2e/cart-uuid.spec.ts` (DT-F10-001 stub `randomUUID`; puede fallar) | 10 |
| `api/f11-multi-provider.spec.ts`, `e2e/f11-multi-provider.spec.ts` | 11 |
| `api/f12-inventario.spec.ts`, `e2e/f12-inventario.spec.ts` | 12 |
| `api/f13-catalog.spec.ts`, `e2e/f13-catalog.spec.ts` | 13 |
| `api/f14-panel.spec.ts`, `e2e/f14-panel.spec.ts` | 14 |
