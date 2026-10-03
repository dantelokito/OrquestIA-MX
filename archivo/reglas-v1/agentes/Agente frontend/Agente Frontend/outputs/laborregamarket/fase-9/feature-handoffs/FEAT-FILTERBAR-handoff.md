# Handoff de Feature: FEAT-FILTERBAR

> **Proyecto:** laborregamarket  
> **Feature:** EXPLORE / FilterBarF9 (Mayoreo + Domicilio)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-25  
> **Wireframe:** `WF-explorar-filterbar-chips`  
> **Contrato:** `API-GEO-01`  
> **US:** US-EXPLORE-11

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| FilterBar chips F9 | `WF-explorar-filterbar-chips` | `/explorar` | OK |

**Componentes:**

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `FilterBar` | `src/components/explore/FilterBar.tsx` | Chips activos; modo `compact` chrome |
| `FILTER_CHIPS` | `src/types/index.ts` | Sin Orgánico ni «Filtros»; Mayoreo/Domicilio habilitados |

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers` | GET | `getProviders` / `buildProvidersQuery` | API-GEO-01 | OK — `offersWholesale=true` / `offersDelivery=true` solo cuando pressed |

URL shareable. AND con geo/`q`/categoría/verificado. No se envía `false`.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Listing | BrandLoader | «No hay fruterías con estos filtros» + Limpiar | ErrorBanner | Grid cards |

---

## 4. Formularios y validación

N/A (toggles `aria-pressed`).

---

## 5. Responsive y accesibilidad

- [x] Targets ≥44px; `aria-pressed`
- [x] Ningún chip disabled de adorno
- [x] Orgánico y «Filtros» ausentes

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/providers-query.test.ts`

- [x] Query solo envía flags `true`

---

## 7. Definition of Done (DoD Frontend)

- [x] Mayoreo/Domicilio filtran + URL
- [x] Empty AND + Limpiar
- [x] Sin Orgánico / «Filtros»
