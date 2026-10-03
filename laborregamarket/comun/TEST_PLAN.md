# Plan de Pruebas — LaBorregaMarket v0.1.0

> **Proyecto:** LaBorregaMarket  
> **Versión:** 0.1.0 (MVP)  
> **Fecha:** 05/08/2026  
> **Agente:** QA / Tester Senior  
> **Código base:** `C:\Users\PC GAMER\LaBorregaMarket`

---

## 1. Objetivo

Validar que LaBorregaMarket cumple los criterios de aceptación del PRD, contratos API (`API-*`), flujos UX (`UF-*`) y requisitos no funcionales para los tres perfiles: **CLIENT**, **PROVIDER** y **ADMIN**.

---

## 2. Alcance

### En alcance (Fase 1 MVP)

| Módulo | Capacidades |
|--------|-------------|
| `AUTH` | Login, registro CLIENT/PROVIDER, logout, sesión JWT cookie, redirect por rol |
| `PROVIDERS` | Listado público, detalle, onboarding paso 2 (`POST /api/providers`) |
| `EXPLORE` | Vista `/explorar` conectada a API, filtros `q`, `verified`, paginación |
| `USERS` | Perfil cliente `/cuenta`, `GET/PATCH /api/users/me` |
| `PRODUCTS` | Panel proveedor catálogo global |
| `ADMIN` | Catálogos, verificación proveedores, bitácora |
| `RBAC` | Protección rutas UI + guards API |

### Fuera de alcance

- Checkout y pagos (Fase 2)
- OAuth, recuperación de contraseña
- Notificaciones WhatsApp/email
- App móvil nativa / PWA optimizada
- Pruebas de carga / stress (DevOps)

---

## 3. Estrategia de pruebas (pirámide)

```
         ┌─────────────┐
         │  E2E (12)   │  Playwright — flujos críticos UI
         ├─────────────┤
         │ API (35)    │  Playwright request — contratos API + RBAC
         ├─────────────┤
         │ Unit (Devs) │  Responsabilidad Backend/Frontend
         └─────────────┘
```

| Tipo | Herramienta | Responsable | Objetivo |
|------|-------------|-------------|----------|
| Unit | Jest/Vitest (futuro) | Devs | Lógica de dominio, validators |
| API Integration | Playwright `request` | QA | Contratos, envelope ADR-003, RBAC |
| E2E | Playwright + POM | QA | Flujos usuario por rol |
| Manual/Exploratorio | Matrices TC-* | QA | Estados UI, accesibilidad, edge cases |
| Regresión | CI Playwright | DevOps | 100% pass antes de deploy |

---

## 4. Perfiles y datos de prueba

| Rol | Email | Password | Uso |
|-----|-------|----------|-----|
| CLIENT | `cliente@demo.mx` | `Demo1234!` | Cuenta, explorar, login |
| PROVIDER | `frutas@elparaiso.mx` | `Demo1234!` | Panel proveedor, catálogo |
| ADMIN | `admin@laborregamarket.mx` | `Demo1234!` | Admin, catálogos, audit |
| PROVIDER (sin negocio) | Generado en test | `Test1234!` | Onboarding wizard |

**Seed:** `npx prisma db seed` en `LaBorregaMarket`.

---

## 5. Matrices de casos de prueba

| Matriz | Archivo | Casos |
|--------|---------|-------|
| AUTH | `../fase-1/test-matrices/TC-AUTH-matrix.md` | 22 |
| PROVIDERS / EXPLORE | `../fase-1/test-matrices/TC-PROVIDERS-matrix.md` | 18 |
| USERS (CLIENT) | `../fase-1/test-matrices/TC-USERS-matrix.md` | 10 |
| ADMIN | `../fase-1/test-matrices/TC-ADMIN-matrix.md` | 12 |
| RBAC transversal | `../fase-1/test-matrices/TC-RBAC-matrix.md` | 10 |
| **Total manual** | | **72** |

---

## 6. Automatización

| Suite | Archivos | Tests |
|-------|----------|-------|
| API AUTH | `tests/api/auth.spec.ts` | 12 |
| API PROVIDERS | `tests/api/providers.spec.ts` | 10 |
| API USERS | `tests/api/users.spec.ts` | 5 |
| API RBAC | `tests/api/rbac.spec.ts` | 8 |
| API ADMIN | `tests/api/admin.spec.ts` | 5 |
| E2E AUTH | `tests/e2e/auth-login.spec.ts` | 5 |
| E2E RBAC | `tests/e2e/route-protection.spec.ts` | 4 |
| E2E EXPLORE | `tests/e2e/explore.spec.ts` | 4 |
| **Total automatizado** | | **53** |

**Cobertura AC:** 100% happy path AUTH + PROVIDERS; ≥ 85% negativos/edge en módulos Must.

---

## 7. Criterios de entrada / salida

### Entrada (DoR QA)

- [x] PRD y user stories US-AUTH-* disponibles
- [x] Contratos API-AUTH-01, API-PROVIDERS-01, API-USERS-01
- [x] Backend implementado con seed reproducible
- [x] Frontend con rutas MVP desplegables en local

### Salida (DoD QA)

- [x] Matrices TC-* diseñadas (72 casos)
- [x] Suite Playwright implementada (53 tests)
- [x] Bugs documentados en `fase-1/bug-reports/`
- [x] OBSERVABILITY.md QA actualizado
- [x] Sign-off emitido (`fase-1/qa-signoffs/QA-MVP-signoff.md`)
- [ ] Ejecución 100% pass en staging CI (pendiente DevOps)

---

## 8. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker | Sin bugs Blocker/Critical abiertos | ⚠️ 1 Major abierto |
| Happy path | 100% ejecutado (manual + auto) | ✅ |
| Edge/negativos | ≥ 85% | ✅ 88% |
| Regresión auto | 100% pass local | ⏳ Requiere app + DB |
| RBAC | Guards API verificados | ✅ |

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Tests dependen de PostgreSQL local | `env-requirements.md` + seed documentado |
| Sin `data-testid` en UI | Selectores semánticos (role, label, text) |
| Middleware no protege `/api/*` | Tests RBAC en cada endpoint protegido |
| Flaky E2E por mapa Leaflet | `explore.spec.ts` valida lista, no canvas mapa |

---

## 10. Handoff DevOps

Ver `env-requirements.md` y sección CI en `OBSERVABILITY.md`.

**@DevOps / Cloud Engineer:** configurar pipeline CI con PostgreSQL service, seed, `npm run dev` o deploy staging, y `npx playwright test` desde `outputs/laborregamarket/tests/`.

---

*Generado por Agente QA / Tester Senior — LaBorregaMarket v0.1.0.*

---

## 11. Fase 3 — Pedidos, POS, OPS, DASH (v0.3.0)

### Alcance F3

| Módulo | Rutas | Contratos |
|--------|-------|-----------|
| ORDERS | `/fruteria/[id]`, `/carrito`, `/cuenta` | API-ORDERS-01 |
| POS | `/proveedor/pos` | API-POS-01 |
| OPS | `/proveedor/ordenes` | API-PROVIDER-ORDERS-01 |
| DASH | `/proveedor/dashboard` | API-PROVIDER-DASH-01 |

### Matrices F3

| Matriz | Casos |
|--------|-------|
| TC-ORDERS | 20 |
| TC-POS | 14 |
| TC-OPS | 12 |
| TC-DASH | 8 |
| TC-RBAC (ext.) | +6 |
| **Total F3 manual** | **54** |

### Automatización F3

| Suite | Archivo | Tests |
|-------|---------|-------|
| API ORDERS | `orders.spec.ts` | 12 |
| API PROVIDER ORDERS | `provider-orders.spec.ts` | 10 |
| API POS | `pos.spec.ts` | 12 |
| API DASH | `dashboard.spec.ts` | 6 |
| API RBAC F3 | `rbac.spec.ts` | +6 |
| E2E checkout | `checkout.spec.ts` | 2 |
| E2E cart | `cart-empty.spec.ts` | 1 |
| E2E OPS | `provider-orders.spec.ts` | 2 |
| E2E POS | `pos.spec.ts` | 3 |
| E2E DASH | `dashboard.spec.ts` | 2 |
| E2E F2 reg | `contact-f2-regression.spec.ts` | 1 |
| **Total F3 nuevo** | | **58** |
| **Total suite (F1+F3)** | | **111** |

### Sign-off F3

`fase-3/qa-signoffs/QA-F3-signoff.md` — dictamen **APROBADO CON CONDICIONES** (CI DevOps pendiente).

*Actualizado 14/08/2026 — Fase 3 QA.*

---

## 12. Fase 4 — Reseñas, Geo, ETA, Analytics, POS báscula (v0.4.0)

### Alcance F4

| Módulo | Rutas | Contratos |
|--------|-------|-----------|
| REVIEWS | `/cuenta`, `/fruteria/[id]` | API-REVIEWS-01 |
| Google gate | `/proveedor` | API-PROVIDER-SETTINGS-01 |
| GEO | `/explorar` | API-GEO-01 |
| ADDRESSES | `/explorar` | API-ADDRESSES-01 |
| ETA | `/carrito` | GET `/api/providers/{id}/eta` |
| ADMIN | `/admin/analytics` | API-ADMIN-ANALYTICS-01 |
| NOTIFY | contacto frutería | API-NOTIFY-01 |
| POS báscula | `/proveedor/pos` | API-POS-01 sin cambio |
| ORDERS delivery | `/carrito` | API-ORDERS-01 delta (Should) |

### Matrices F4

| Matriz | Casos |
|--------|-------|
| TC-REVIEWS | 14 |
| TC-GEO | 12 |
| TC-ADDRESSES | 10 |
| TC-ETA | 6 |
| TC-ADMIN | 8 |
| TC-NOTIFY | 6 |
| TC-POS | 6 |
| TC-ORDERS | 8 |
| TC-RBAC | 6 |
| **Total F4 manual** | **76** |

### Automatización F4

| Suite | Archivo | Tests |
|-------|---------|-------|
| API REVIEWS | `reviews.spec.ts` | 10 |
| API GEO | `geo.spec.ts` | 8 |
| API ADDRESSES | `addresses.spec.ts` | 8 |
| API ETA | `eta.spec.ts` | 4 |
| API ADMIN | `admin-analytics.spec.ts` | 5 |
| API SETTINGS | `provider-settings.spec.ts` | 5 |
| API NOTIFY | `notify.spec.ts` | 3 |
| API ORDERS delta | `orders.spec.ts` | +4 |
| API POS delta | `pos.spec.ts` | +1 |
| API RBAC F4 | `rbac.spec.ts` | +6 |
| E2E geo | `explore-geo.spec.ts` | 4 |
| E2E reviews | `reviews.spec.ts` | 1 |
| E2E google | `provider-google.spec.ts` | 2 |
| E2E eta | `checkout-eta.spec.ts` | 1 |
| E2E admin | `admin-analytics.spec.ts` | 3 |
| E2E scale | `pos-scale.spec.ts` | 1 |
| E2E delivery | `delivery.spec.ts` | 1 |
| E2E F2 reg | `contact-f2-regression.spec.ts` | +1 |
| **Total F4 nuevo** | | **68** |
| **Total suite (F1+F3+F4)** | | **179** |

### Sign-off F4

`fase-4/qa-signoffs/QA-F4-signoff.md`

*Actualizado 14/08/2026 — Fase 4 QA.*

---

## 13. Fase 5 — Leaflet/OSM, catálogo inhabilitado, marca PROVIDER (v0.5.0)

### Alcance F5

| Módulo | Rutas | Contratos |
|--------|-------|-----------|
| GEO motor + layout | `/explorar` | API-GEO-01 (query F4 intacta) |
| CAT inhabilitado | `/proveedor`, `/fruteria/[id]`, `/carrito`, POS | API-PROVIDER-PRODUCTS-01 |
| Brand settings | `/proveedor` | API-PROVIDER-SETTINGS-01 |
| Tema sesión | chrome PROVIDER | API-SESSION-THEME-01 |

### Matrices F5

| Matriz | Casos |
|--------|-------|
| TC-GEO | 12 |
| TC-CAT | 12 |
| TC-BRAND | 14 |
| TC-RBAC | 6 |
| **Total F5 manual** | **44** |

### Automatización F5

| Suite | Archivo | Tests |
|-------|---------|-------|
| API SESSION | `session.spec.ts` | 4 |
| API CATALOG | `catalog.spec.ts` | 4 |
| API SETTINGS delta | `provider-settings.spec.ts` | +11 |
| API ORDERS 409 | `orders.spec.ts` | +2 |
| API POS 409 | `pos.spec.ts` | +2 |
| API RBAC F5 | `rbac.spec.ts` | +2 |
| E2E geo Leaflet | `explore-geo.spec.ts` | +4 |
| E2E catálogo | `catalog-channels.spec.ts` | 3 |
| E2E marca | `provider-brand.spec.ts` | 3 |
| **Total F5 nuevo** | | **35** |
| **Total suite (F1+F3+F4+F5)** | | **214** |

### Sign-off F5

`fase-5/qa-signoffs/QA-F5-signoff.md` — dictamen **APROBADO CON CONDICIONES** (CI DevOps pendiente).

*Actualizado 15/08/2026 — Fase 5 QA.*

---

## 14. Fase 6 — Confiabilidad + reportes + GEO zoom↔radio (v0.6.1)

### Alcance F6

| Slice | Módulo | Contratos |
|-------|--------|-----------|
| A | Contacto 503, Redis lockfile, CI/migrate | US-NOTIFY-10, DEV-P0-001 |
| B | `/proveedor/dashboard?view=reportes` | API-PROVIDER-REPORTS-01, PDF-01 |
| C | `/explorar` zoom↔radio (solo FE) | API-GEO-01 nota F6 |

### Matrices F6

| Matriz | Casos |
|--------|-------|
| TC-REPORTS | 16 |
| TC-GEO | 10 |
| TC-NOTIFY/OPS | 8 |
| TC-RBAC | 6 |
| **Total F6 manual/auto diseño** | **40** |

### Automatización F6

| Suite | Archivo | Tests |
|-------|---------|-------|
| API REPORTS | `reports.spec.ts` | 10 |
| API RBAC F6 | `rbac.spec.ts` | +5 |
| E2E reportes | `dashboard-reports.spec.ts` | 3 |
| E2E GEO F6 | `explore-geo.spec.ts` | +3 |
| E2E contacto | `contact-resilience.spec.ts` | 2 |
| **Total F6 nuevo** | | **23** |

### Sign-off F6

`fase-6/qa-signoffs/QA-F6-signoff.md` — dictamen **APROBADO CON CONDICIONES**.

*Actualizado 19/08/2026 — Fase 6 QA.*

---

## 15. Fase 8 — Explorar polish (v0.8.3)

Fase 7 (mapa-primero, preview botón, AUTH portable) quedó cerrada el 24/08 — [QA-F7-signoff](../fase-7/qa-signoffs/QA-F7-signoff.md). F8 no reabre AUTH-09.

### Alcance F8

| Módulo | Rutas | Contratos |
|--------|-------|-----------|
| GEO ubicación | `/explorar` | API-ADDRESSES-01 F8 (chip + panel; DELETE pin permanece) |
| GEO radio | `/explorar` | API-GEO-01 F8 · `CO-F8-001` clamp **0.5–10** |
| GEO México | `/explorar` | API-GEO-01 · ADR-028 · `CO-F8-002` |
| EXPLORE preview | `/explorar` | API-PROVIDER-PREVIEW-01 (mismo GET; `CO-F8-003` sin «Vista rápida») |

`CO-F7-001` intacto. Sin env nuevas. ETA / alta proveedor / `clientLat` de pedidos **siguen bbox AMM** (fuera de slice).

### Matrices F8

| Matriz | Casos |
|--------|-------|
| TC-GEO | 22 |
| TC-EXPLORE | 9 |
| TC-ADDRESSES | 5 |
| **Total F8 diseño** | **36** |

### Automatización F8

| Suite | Archivo | Tests |
|-------|---------|-------|
| API GEO delta | `geo.spec.ts` | clamp 0.5/0.7/10/22; CDMX 200; `33.0,-99.0` 400 |
| API ADDRESSES delta | `addresses.spec.ts` | CDMX 201; fuera MX 400 |
| E2E F8 | `explore-f8.spec.ts` | chip, radio, MX, preview hover |
| E2E regresión | `explore-f7.spec.ts`, `explore-geo.spec.ts` | pan ≠ radio, FilterBar chrome, Leaflet |

### Sign-off F8

`fase-8/qa-signoffs/QA-F8-signoff.md` — **APROBADO CON CONDICIONES** (24/08/2026). Suite focal **76/76**.

*Actualizado 24/08/2026 — Fase 8 QA apertura.*

---

## 16. Fase 10 — Admin seguro + catálogo local + media disco + reportes (v0.10.2)

F9 documental queda **solo lectura** (sign-off QA F9 pendiente). F8 no se reabre. Chrome Reportes F10 es rango-primero; grain/PDF F6 siguen en API.

### Alcance F10

| Módulo | Rutas | Contratos |
|--------|-------|-----------|
| SEC | `/api/admin/*`, `/api/catalogs`, `/login` | API-ADMIN-SEC-01 |
| ADMIN | `/admin` Catálogos / Proveedores | API-ADMIN-PRODUCTS-01, API-ADMIN-PROVIDERS-01 |
| CAT | `/proveedor`, `/fruteria/[id]` | API-PROVIDER-PRODUCTS-02, API-PROVIDER-SECTIONS-01 |
| MEDIA | `/api/media`, uploads disco | API-MEDIA-02 · `UPLOADS_DIR` |
| DASH | `/proveedor/dashboard?view=reportes` | API-PROVIDER-REPORTS-02, API-DASH-NOTES-01 |

### Matrices F10

| Matriz | Casos |
|--------|-------|
| TC-SEC | 10 |
| TC-ADMIN | 12 |
| TC-CAT | 14 |
| TC-MEDIA | 11 |
| TC-REPORTS | 12 |
| TC-CART-regresion (DT-F10-001 / ex BUG-015) | 3 |
| **Total F10 diseño** | **62** |

### Automatización F10

| Suite | Archivo |
|-------|---------|
| API admin products / flags | `admin-products.spec.ts` |
| API local SKU | `local-products.spec.ts` |
| API secciones | `sections.spec.ts` |
| API media disco | `media.spec.ts` |
| API reports rango | `reports.spec.ts` (delta TC-REP-011…) |
| API RBAC F10 | `rbac.spec.ts` (TC-SEC-003…) |
| E2E catálogo / frutería / admin / reportes | `provider-catalog-f10.spec.ts`, `fruteria-sections.spec.ts`, `admin-catalog-f10.spec.ts`, `dashboard-reports.spec.ts` |
| E2E Encargar UUID (DT-F10-001) | `cart-uuid.spec.ts` (puede fallar; no bloquea dictamen) |

### Sign-off F10

`fase-10/qa-signoffs/QA-F10-signoff.md` — **APROBADO CON CONDICIONES** (12/09/2026). Zero Blocker **PASS** para release localhost. [BUG-015](../fase-10/bug-reports/BUG-015.md) y resto de [BUG-016](../fase-10/bug-reports/BUG-016.md) **Diferidos** → [DT-F10-001](../fase-10/deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md) / [DT-F10-002](../fase-10/deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md). Specs `cart-uuid.spec.ts` / `HP-MED-02` / `TC-MED-009` = cobertura DT. Suite focal Must **89/89** intacta.

### Alcance F12

Inventario blando Must (US-INV-01…06, CAT-12/13, POS-12). Won't: BOM, kardex, Cloudinary, BL-040, bloquear ventas.

### Automatización F12

| Spec | Notas |
|------|--------|
| `api/f12-inventario.spec.ts` | 16 casos API |
| `e2e/f12-inventario.spec.ts` | 5 casos UI |

### Sign-off F12

`fase-12/qa-signoffs/QA-F12-signoff.md` — **APROBADO** (14/09/2026, re-prueba). BUG-019 Verificado. No cierra fase.

*Actualizado 14/09/2026 — Fase 12 QA APROBADO (re-prueba).*
