# Handoff de Feature: FEAT-ETA

> **Proyecto:** laborregamarket  
> **Feature:** ETA (prep time + chip checkout)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-carrito-eta`, `WF-proveedor-google`  
> **Contrato:** `API-GEO-01` (`GET /api/providers/[id]/eta`), `API-PROVIDER-SETTINGS-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Chip checkout | `WF-carrito-eta` | `/carrito` | OK |
| Prep time | `WF-proveedor-google` | `/proveedor` | OK |

**Componentes:** `EtaChip`, `PrepTimeInput` (en `ProviderSettingsForm`)

Ruta canónica: **`GET /api/providers/[id]/eta`** (no `/api/orders/eta`).

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers/[id]/eta` | GET | `getProviderEta` | API-GEO-01 | OK |
| `/api/provider/me` | PATCH | `updateProviderSettings` `{ preparationTimeMinutes }` | API-PROVIDER-SETTINGS-01 | OK |

`copyKey`: `eta_ready_approx` → “Listo aprox. en ~X min”; `eta_prep_only` → “Tiempo de preparación: ~Y min”. Disclaimer: “Es una estimación, no una hora exacta”.

Contacto F2 HTTP intacto.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Chip carrito | — | hint “no disponible” | cálculo fallido: checkout sigue | EtaChip |
| Prep time | skeleton settings | default 20 | 5–120 inline | toast |

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes |
|------------|--------|----------|
| Prep time | 5–120 min | inline |

---

## 5. Responsive y accesibilidad

- [x] Chip `inline-flex` + disclaimer
- [x] `prefers-reduced-motion` heredado

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/eta-copy.test.ts`

---

## 7. DoD Frontend

- [x] Copy canónico por `copyKey`
- [x] Fallo ETA no bloquea Confirmar
- [x] Settings en `/api/provider/me` (no `/profile`)

---

## 8. Notas para downstream

### QA Tester

- Sin pin: copy prep-only
- Con pin: ready-approx
- Checkout F3 pickup sigue si ETA falla
