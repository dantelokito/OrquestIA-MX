# Handoff de Feature: FEAT-ONB-SEED-ADMIN

> **Proyecto:** laborregamarket  
> **Feature:** ONB / SEED / ADMIN / EXPLORE  
> **Stack UI:** Next.js 15 / React 19 / Tailwind  
> **Fecha:** 2026-09-12  
> **Wireframes:** `WF-ONB-01`, `WF-SEED-01`, `WF-ADMIN-11`, `WF-EXPLORE-11`  
> **Contratos:** `API-PROVIDER-ONB-01`, `API-SEED-11`, `API-ADMIN-PROVIDERS-02`, `API-EXPLORE-11`

## Inputs Utilizados

- US `US-ONB-01`, `US-SEED-01`, `US-ADMIN-11`, `US-EXPLORE-11`

---

## 1. Pantallas

| Vista | Ruta | Estado |
|-------|------|--------|
| Copy Nueva frutería | `/registro/negocio` | OK si sesión PROVIDER y N≥1 |
| Demo Campo Verde | `/login` (no prod) | Fila `verduras@campoverde.mx` |
| Admin sucursales | `/admin` tab Proveedores | Una fila por `Provider.id`; Dueño = `ownerEmail` o `userEmail` |
| Explorar | `/explorar` | Chrome F9 intacto; card = `businessName` (ya 1:1 Provider) |

**Componentes:** `OnboardingModeCopy` en `BusinessOnboardingClient`; CTA menú «Agregar frutería»; `DemoAccountsBlock`; `ProviderTableF10` + cards móvil.

---

## 2. Integración API

| Endpoint | Uso FE |
|----------|--------|
| `POST /api/providers` | Mismo form; toast «Frutería creada»; activo lo setea BE |
| `GET /api/admin/providers` | Sin agrupar; identidad `id` + `businessName` |
| `GET /api/providers` | Sin deduplicar por email (contrato: no colapsar) |

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Onboarding | CTA «Creando…» | Form en blanco | Inline / banner | Redirect panel + toast |
| Demo | Fila `aria` implícito al submit login | Form vacío | 401 login existente | Redirect por rol |
| Admin | Skeleton F10 | «No hay sucursales registradas» | Banner 500 | Flags por fila |
| Explorar | BrandLoader F9 | Empty F9 | Banner F9 | N cards = N Provider |

---

## 4. Formularios

Onboarding reusa schema F1 (`businessName`, dirección, mapa). CTA «Crear frutería» si N≥1.

---

## 5. Responsive / a11y

Admin móvil: cards 2×2 switches ≥44px. Demo filas `min-h-11`. Unmount demo en production (`shouldShowDemoAccounts`).

---

## 6. Pruebas

Seed visible solo no-prod. Explorar no se rediseñó: verificar dos cards El Paraíso cuando el listing BE no colapse. **Fix BUG-018:** hidratar desde `window.location.search`; no pisar lat/lng URL con San Nicolás.

---

## 7. DoD

Must ONB / SEED / ADMIN cubiertos. EXPLORE: UI ya era una card por Provider; FE no agrupa.

## Won't

Pagos, Cloudinary, `US-ADMIN-04`, chips sección Explorar.

## Outputs Generados

- **Archivo:** `fase-11/feature-handoffs/FEAT-ONB-SEED-ADMIN-handoff.md`
- **Agente Downstream:** QA Tester
